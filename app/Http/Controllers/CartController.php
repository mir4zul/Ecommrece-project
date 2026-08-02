<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use App\Models\Product;
use App\Models\Wishlist;
use App\Services\Payments\SslCommerzGateway;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Throwable;

class CartController extends Controller
{
    public function index(Request $request)
    {
        return inertia('Main/Cart', $this->cartPageProps($request));
    }

    public function addToCart(Request $request)
    {
        if (! Auth::check()) {
            return to_route('login')->with('error', 'Please login to add products to cart.');
        }

        $data = $request->validate([
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'quantity' => ['nullable', 'integer', 'min:1'],
        ]);
        $product = Product::query()->findOrFail($data['product_id']);
        $quantity = $data['quantity'] ?? 1;
        $cart = Cart::query()->firstOrNew([
            'user_id' => Auth::id(),
            'product_id' => $product->id,
        ]);
        $newQuantity = ($cart->exists ? $cart->quantity : 0) + $quantity;

        if ($product->stock < $newQuantity) {
            return back()->with('error', 'The requested quantity is not available.');
        }

        $cart->fill([
            'name' => $product->name,
            'image' => $product->image,
            'price' => $product->price,
            'discount' => $product->discount_price,
            'stock' => $product->stock,
            'rating' => $product->rating,
            'description' => $product->description,
            'quantity' => $newQuantity,
        ])->save();

        return back()->with('success', 'Cart updated successfully.');
    }

    public function update(Request $request, Cart $cart)
    {
        $this->authorizeCart($cart);
        $data = $request->validate(['quantity' => ['required', 'integer', 'min:1']]);
        $product = Product::query()->findOrFail($cart->product_id);

        if ($data['quantity'] > $product->stock) {
            throw ValidationException::withMessages([
                'quantity' => 'Only '.$product->stock.' units are available.',
            ]);
        }

        $cart->update(['quantity' => $data['quantity'], 'stock' => $product->stock]);

        return back()->with('success', 'Cart quantity updated.');
    }

    public function removeFromCart(Cart $cart)
    {
        $this->authorizeCart($cart);
        $cart->delete();

        return back()->with('success', 'Product removed from cart.');
    }

    public function checkout(Request $request)
    {
        $props = $this->cartPageProps($request);
        if ($props['carts']->isEmpty()) {
            return to_route('cart.index')->with('error', 'Your cart is empty.');
        }

        return inertia('Main/Checkout', $props);
    }

    public function placeOrder(Request $request)
    {
        $data = $request->validate([
            'customer_name' => ['required', 'string', 'max:255'],
            'customer_email' => ['required', 'email', 'max:255'],
            'customer_phone' => ['required', 'string', 'max:30'],
            'shipping_address' => ['required', 'string', 'max:1000'],
            'shipping_city' => ['required', 'string', 'max:100'],
            'shipping_postal_code' => ['required', 'string', 'max:20'],
            'payment_method' => ['required', 'in:cash_on_delivery,bkash,nagad,rocket,upay,bank_dutch_bangla,bank_brac,bank_city,bank_ebl,bank_islami,bank_sonali'],
        ]);

        $order = DB::transaction(function () use ($request, $data) {
            $carts = Cart::query()->where('user_id', $request->user()->id)->lockForUpdate()->get();
            if ($carts->isEmpty()) {
                throw ValidationException::withMessages(['cart' => 'Your cart is empty.']);
            }

            $items = $carts->map(function (Cart $cart) {
                $product = Product::query()->lockForUpdate()->find($cart->product_id);
                if (! $product || $product->stock < $cart->quantity) {
                    throw ValidationException::withMessages([
                        'cart' => "{$cart->name} no longer has enough stock.",
                    ]);
                }

                $price = $this->salePrice($product->price, $product->discount_price);

                return compact('cart', 'product', 'price');
            });

            $subtotal = round($items->sum(
                fn ($item) => (float) $item['product']->price * $item['cart']->quantity,
            ), 2);
            $discountedSubtotal = round($items->sum(
                fn ($item) => $item['price'] * $item['cart']->quantity,
            ), 2);
            $discount = round($subtotal - $discountedSubtotal, 2);
            $shipping = $this->shippingFee($data['shipping_city']);
            $order = Order::query()->create([
                ...$data,
                'user_id' => $request->user()->id,
                'order_number' => 'ORD-'.now()->format('Ymd').'-'.Str::upper(Str::random(8)),
                'status' => 'pending',
                'payment_status' => 'pending',
                'gateway_transaction_id' => $data['payment_method'] === 'cash_on_delivery'
                    ? null
                    : 'PAY-'.now()->format('YmdHis').'-'.Str::upper(Str::random(10)),
                'subtotal' => $subtotal,
                'discount' => $discount,
                'shipping' => $shipping,
                'total' => round($subtotal - $discount + $shipping, 2),
                'stock_deducted' => true,
                'ordered_at' => now(),
            ]);

            foreach ($items as $item) {
                $quantity = $item['cart']->quantity;
                $order->items()->create([
                    'product_id' => $item['product']->id,
                    'product_name' => $item['product']->name,
                    'price' => $item['price'],
                    'quantity' => $quantity,
                    'line_total' => round($item['price'] * $quantity, 2),
                ]);
                $item['product']->decrement('stock', $quantity);
            }

            Cart::query()->where('user_id', $request->user()->id)->delete();

            return $order;
        });

        if ($order->payment_method === 'cash_on_delivery') {
            return to_route('orders.success', $order);
        }

        try {
            $gatewayUrl = app(SslCommerzGateway::class)->initiate($order);

            return Inertia::location($gatewayUrl);
        } catch (Throwable $exception) {
            Log::error('SSLCOMMERZ payment initiation failed.', [
                'order_id' => $order->id,
                'message' => $exception->getMessage(),
            ]);

            DB::transaction(function () use ($order, $exception) {
                $lockedOrder = Order::query()->with('items')->lockForUpdate()->findOrFail($order->id);
                $this->releaseReservedStock($lockedOrder);
                $lockedOrder->update([
                    'payment_status' => 'failed',
                    'gateway_status' => 'initiation_failed',
                    'gateway_response' => ['message' => $exception->getMessage()],
                ]);
            });

            return to_route('orders.show', $order)
                ->with('error', 'The payment gateway could not be started. Please try again or contact support.');
        }
    }

    public function success(Request $request, Order $order)
    {
        abort_unless($order->user_id === $request->user()->id || $request->user()->role === 'admin', 403);

        return inertia('Main/OrderSuccess', [
            'order' => $order->load('items'),
            'carts' => [],
            'wishlists' => Wishlist::query()->where('user_id', $request->user()->id)->get(),
        ]);
    }

    private function cartPageProps(Request $request): array
    {
        $carts = Cart::query()->where('user_id', $request->user()->id)->get()->map(function (Cart $cart) {
            $cart->unit_price = $this->salePrice($cart->price, $cart->discount);
            $cart->line_total = round($cart->unit_price * $cart->quantity, 2);

            return $cart;
        });
        $subtotal = round($carts->sum(
            fn (Cart $cart) => (float) $cart->price * $cart->quantity,
        ), 2);
        $discountedSubtotal = round($carts->sum('line_total'), 2);
        $discount = round($subtotal - $discountedSubtotal, 2);

        return [
            'carts' => $carts,
            'wishlists' => Wishlist::query()->where('user_id', $request->user()->id)->get(),
            'summary' => [
                'subtotal' => $subtotal,
                'discount' => $discount,
                'shipping' => $subtotal > 0 ? $this->shippingFee('') : 0,
                'total' => $subtotal - $discount + ($subtotal > 0 ? $this->shippingFee('') : 0),
            ],
            'shipping' => [
                'free_offer' => (bool) config('shipping.free_offer'),
                'inside_dhaka_fee' => (float) config('shipping.inside_dhaka_fee'),
                'outside_dhaka_fee' => (float) config('shipping.outside_dhaka_fee'),
            ],
        ];
    }

    private function releaseReservedStock(Order $order): void
    {
        if (! $order->stock_deducted) {
            return;
        }

        foreach ($order->items as $item) {
            if ($item->product_id) {
                Product::query()->whereKey($item->product_id)->increment('stock', $item->quantity);
            }
        }

        $order->update(['stock_deducted' => false]);
    }

    private function shippingFee(string $city): float
    {
        if (config('shipping.free_offer')) {
            return 0;
        }

        $normalizedCity = Str::lower(trim($city));
        $insideDhaka = $normalizedCity === 'dhaka'
            || Str::contains($normalizedCity, ['dhaka city', 'ঢাকা']);

        return (float) config(
            $insideDhaka ? 'shipping.inside_dhaka_fee' : 'shipping.outside_dhaka_fee',
        );
    }

    private function salePrice($price, $discount): float
    {
        return round((float) $price * (1 - ((float) $discount / 100)), 2);
    }

    private function authorizeCart(Cart $cart): void
    {
        abort_unless($cart->user_id === Auth::id(), 403);
    }

    public function orders(Request $request)
    {
        return inertia('Main/MyOrders', [
            'orders' => Order::query()
                ->where('user_id', $request->user()->id)
                ->withCount('items')
                ->latest('ordered_at')
                ->paginate(10),
            'carts' => Cart::query()->where('user_id', $request->user()->id)->get(),
            'wishlists' => Wishlist::query()->where('user_id', $request->user()->id)->get(),
        ]);
    }

    public function orderDetails(Request $request, Order $order)
    {
        abort_unless($order->user_id === $request->user()->id, 403);

        return inertia('Main/MyOrderDetails', [
            'order' => $order->load(['items.product:id,name,image,category', 'histories.user:id,name']),
            'carts' => Cart::query()->where('user_id', $request->user()->id)->get(),
            'wishlists' => Wishlist::query()->where('user_id', $request->user()->id)->get(),
        ]);
    }
}
