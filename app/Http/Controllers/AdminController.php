<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class AdminController extends Controller
{
    public function index()
    {
        $monthlyProducts = collect(range(5, 0))->map(function (int $monthsAgo) {
            $month = now()->startOfMonth()->subMonths($monthsAgo);

            return [
                'label' => $month->format('M'),
                'count' => Product::query()
                    ->whereBetween('created_at', [
                        $month->copy()->startOfMonth(),
                        $month->copy()->endOfMonth(),
                    ])
                    ->count(),
            ];
        });

        $monthlySales = collect(range(5, 0))->map(function (int $monthsAgo) {
            $month = now()->startOfMonth()->subMonths($monthsAgo);
            $paidOrders = Order::query()
                ->where('payment_status', 'paid')
                ->whereBetween('ordered_at', [
                    $month->copy()->startOfMonth(),
                    $month->copy()->endOfMonth(),
                ]);

            return [
                'label' => $month->format('M'),
                'revenue' => round((float) (clone $paidOrders)->sum('total'), 2),
                'orders' => (clone $paidOrders)->count(),
            ];
        });

        $categoryBreakdown = Product::query()
            ->selectRaw('category, COUNT(*) as total')
            ->whereNotNull('category')
            ->groupBy('category')
            ->orderByDesc('total')
            ->take(8)
            ->get()
            ->map(fn (Product $product) => [
                'label' => $product->category,
                'count' => (int) $product->total,
            ]);

        return inertia('Dashboard', [
            'stats' => [
                'totalSales' => Order::query()->where('status', '!=', 'cancelled')->count(),
                'totalIncome' => round((float) Order::query()->where('payment_status', 'paid')->sum('total'), 2),
                'averageOrder' => round((float) Order::query()->where('payment_status', 'paid')->avg('total'), 2),
                'itemsSold' => (int) OrderItem::query()->whereHas('order', fn ($query) => $query->where('payment_status', 'paid'))->sum('quantity'),
                'pendingOrders' => Order::query()->where('status', 'pending')->count(),
                'products' => Product::query()->count(),
                'users' => User::query()->count(),
                'cartItems' => Cart::query()->sum('quantity'),
                'wishlists' => Wishlist::query()->count(),
                'categories' => Product::query()
                    ->whereNotNull('category')
                    ->distinct()
                    ->count('category'),
                'lowStock' => Product::query()
                    ->whereBetween('stock', [1, 10])
                    ->count(),
                'outOfStock' => Product::query()
                    ->where('stock', '<=', 0)
                    ->count(),
            ],
            'chartData' => [
                'monthlySales' => $monthlySales,
                'orderStatuses' => collect(['completed', 'delivered', 'shipped', 'processing', 'confirmed', 'pending', 'cancelled'])->map(fn (string $status) => [
                    'label' => ucfirst($status),
                    'count' => Order::query()->where('status', $status)->count(),
                ]),
                'topProducts' => OrderItem::query()
                    ->selectRaw('product_name as label, SUM(quantity) as quantity, SUM(line_total) as revenue')
                    ->whereHas('order', fn ($query) => $query->where('payment_status', 'paid'))
                    ->groupBy('product_name')
                    ->orderByDesc('quantity')
                    ->take(5)
                    ->get()
                    ->map(fn (OrderItem $item) => [
                        'label' => $item->label,
                        'quantity' => (int) $item->quantity,
                        'revenue' => round((float) $item->revenue, 2),
                    ]),
                'categories' => $categoryBreakdown,
                'monthlyProducts' => $monthlyProducts,
                'stock' => [
                    'healthy' => Product::query()->where('stock', '>', 10)->count(),
                    'low' => Product::query()->whereBetween('stock', [1, 10])->count(),
                    'out' => Product::query()->where('stock', '<=', 0)->count(),
                ],
                'ratings' => collect(range(1, 5))->map(fn (int $rating) => [
                    'label' => "{$rating} star",
                    'count' => Product::query()->where('rating', $rating)->count(),
                ]),
                'priceRanges' => [
                    ['label' => 'Under $100', 'count' => Product::query()->where('price', '<', 100)->count()],
                    ['label' => '$100–$299', 'count' => Product::query()->whereBetween('price', [100, 299.99])->count()],
                    ['label' => '$300–$599', 'count' => Product::query()->whereBetween('price', [300, 599.99])->count()],
                    ['label' => '$600+', 'count' => Product::query()->where('price', '>=', 600)->count()],
                ],
                'labels' => [
                    ['label' => 'New arrivals', 'count' => Product::query()->where('is_new', true)->count()],
                    ['label' => 'Top rated', 'count' => Product::query()->where('is_top_rated', true)->count()],
                    ['label' => 'Regular', 'count' => Product::query()->where('is_new', false)->where('is_top_rated', false)->count()],
                ],
            ],
            'recentProducts' => Product::query()
                ->latest()
                ->take(6)
                ->get([
                    'id',
                    'name',
                    'category',
                    'image',
                    'price',
                    'stock',
                    'rating',
                    'created_at',
                ]),
        ]);
    }

    public function wishlists(Request $request)
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
        ]);

        $wishlists = Wishlist::query()
            ->with([
                'user:id,name,email',
                'product:id,name,category,image,price,discount_price,stock,rating',
            ])
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhereHas('user', fn ($query) => $query
                            ->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%"))
                        ->orWhereHas('product', fn ($query) => $query
                            ->where('category', 'like', "%{$search}%"));
                });
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return inertia('Admin/Wishlists/Index', [
            'wishlists' => $wishlists,
            'filters' => $filters,
        ]);
    }

    public function orders(Request $request)
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'status' => ['nullable', 'in:pending,confirmed,processing,shipped,delivered,completed,cancelled'],
            'payment_status' => ['nullable', 'in:pending,paid,failed'],
        ]);

        $orders = Order::query()
            ->with('user:id,name,email')
            ->withCount('items')
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('order_number', 'like', "%{$search}%")
                        ->orWhere('customer_name', 'like', "%{$search}%")
                        ->orWhere('customer_email', 'like', "%{$search}%")
                        ->orWhereHas('user', fn ($query) => $query
                            ->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%"));
                });
            })
            ->when($filters['status'] ?? null, fn ($query, $status) => $query->where('status', $status))
            ->when($filters['payment_status'] ?? null, fn ($query, $status) => $query->where('payment_status', $status))
            ->latest('ordered_at')
            ->paginate(15)
            ->withQueryString();

        return inertia('Admin/Orders/Index', [
            'orders' => $orders,
            'filters' => $filters,
        ]);
    }

    public function showOrder(Order $order)
    {
        return inertia('Admin/Orders/Show', [
            'order' => $order->load([
                'user:id,name,email',
                'items.product:id,name,image,category,stock',
                'histories.user:id,name,email',
            ]),
        ]);
    }

    public function updateOrderStatus(Request $request, Order $order)
    {
        $data = $request->validate([
            'status' => ['required', 'in:confirmed,processing,shipped,delivered,cancelled'],
            'note' => ['nullable', 'string', 'max:1000'],
            'courier_name' => ['required_if:status,shipped', 'nullable', 'string', 'max:100'],
            'tracking_number' => ['required_if:status,shipped', 'nullable', 'string', 'max:100'],
        ]);

        DB::transaction(function () use ($request, $order, $data): void {
            $order = Order::query()->with('items')->lockForUpdate()->findOrFail($order->id);
            $transitions = [
                'pending' => ['confirmed', 'cancelled'],
                'confirmed' => ['processing', 'cancelled'],
                'processing' => ['shipped', 'cancelled'],
                'shipped' => ['delivered'],
                'delivered' => [],
                'completed' => [],
                'cancelled' => [],
            ];

            if (! in_array($data['status'], $transitions[$order->status] ?? [], true)) {
                throw ValidationException::withMessages([
                    'status' => "Order cannot move from {$order->status} to {$data['status']}.",
                ]);
            }

            $fromStatus = $order->status;
            $updates = ['status' => $data['status']];

            if ($data['status'] === 'confirmed') {
                $updates['confirmed_at'] = now();
            }
            if ($data['status'] === 'shipped') {
                $updates['courier_name'] = $data['courier_name'];
                $updates['tracking_number'] = $data['tracking_number'];
                $updates['shipped_at'] = now();
            }
            if ($data['status'] === 'delivered') {
                $updates['delivered_at'] = now();
                if ($order->payment_method === 'cash_on_delivery') {
                    $updates['payment_status'] = 'paid';
                }
            }
            if ($data['status'] === 'cancelled') {
                if ($order->stock_deducted) {
                    foreach ($order->items as $item) {
                        Product::query()->whereKey($item->product_id)->increment('stock', $item->quantity);
                    }
                    $updates['stock_deducted'] = false;
                }
                $updates['cancelled_at'] = now();
                if ($order->payment_status === 'pending') {
                    $updates['payment_status'] = 'failed';
                }
            }

            $order->update($updates);
            $order->histories()->create([
                'user_id' => $request->user()->id,
                'from_status' => $fromStatus,
                'to_status' => $data['status'],
                'note' => $data['note'] ?? null,
            ]);
        });

        return back()->with('success', 'Order status updated successfully.');
    }

    public function updateOrderPayment(Request $request, Order $order)
    {
        $data = $request->validate([
            'payment_status' => ['required', 'in:pending,paid,failed'],
        ]);
        $order->update(['payment_status' => $data['payment_status']]);

        return back()->with('success', 'Payment status updated successfully.');
    }
}
