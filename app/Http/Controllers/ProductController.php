<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Product;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class ProductController extends Controller
{
    public function index()
    {
        return inertia('Main/Home', [
            'products' => Product::query()->latest()->get(),
            'carts' => $this->getUserCart(),
            'wishlists' => $this->getUserWishlist(),
        ]);
    }

    public function adminIndex(Request $request)
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'category' => ['nullable', 'string', 'max:100'],
            'stock' => ['nullable', Rule::in(['in-stock', 'low-stock', 'out-of-stock'])],
        ]);

        $products = Product::query()
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('category', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->when($filters['category'] ?? null, fn ($query, $category) => $query->where('category', $category))
            ->when(($filters['stock'] ?? null) === 'in-stock', fn ($query) => $query->where('stock', '>', 10))
            ->when(($filters['stock'] ?? null) === 'low-stock', fn ($query) => $query->whereBetween('stock', [1, 10]))
            ->when(($filters['stock'] ?? null) === 'out-of-stock', fn ($query) => $query->where('stock', '<=', 0))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return inertia('Admin/Products/Index', [
            'products' => $products,
            'categories' => Product::query()->whereNotNull('category')->distinct()->orderBy('category')->pluck('category'),
            'filters' => $filters,
        ]);
    }

    public function create()
    {
        return inertia('Admin/Products/Create', [
            'categories' => Product::query()->whereNotNull('category')->distinct()->orderBy('category')->pluck('category'),
        ]);
    }

    public function store(Request $request)
    {
        $data = $this->validatedProduct($request);
        $data['image'] = $data['images'][0];
        $data['user_id'] = $request->user()->id;

        Product::query()->create($data);

        return to_route('admin.products.index')->with('success', 'Product created successfully.');
    }

    public function show(Request $request, $id)
    {
        return inertia('Main/ShowProduct', [
            'product' => Product::query()->findOrFail($id),
            'products' => Product::query()->get(),
            'carts' => $this->getUserCart(),
            'wishlists' => $this->getUserWishlist(),
        ]);
    }

    public function edit(Product $product)
    {
        return inertia('Admin/Products/Edit', [
            'product' => $product,
            'categories' => Product::query()->whereNotNull('category')->distinct()->orderBy('category')->pluck('category'),
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $data = $this->validatedProduct($request);
        $data['image'] = $data['images'][0];
        $product->update($data);

        return to_route('admin.products.index')->with('success', 'Product updated successfully.');
    }

    public function destroy(Product $product)
    {
        DB::transaction(function () use ($product) {
            Cart::query()->where('product_id', $product->id)->delete();
            Wishlist::query()->where('product_id', $product->id)->delete();
            $product->delete();
        });

        return to_route('admin.products.index')->with('success', 'Product deleted successfully.');
    }

    public function shopLeftSidebar()
    {
        return inertia('Main/ShopLeftSidebar', [
            'products' => Product::query()->get(),
            'carts' => $this->getUserCart(),
            'wishlists' => $this->getUserWishlist(),
        ]);
    }

    private function validatedProduct(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:100'],
            'price' => ['required', 'numeric', 'min:0', 'max:999999.99'],
            'discount_price' => ['nullable', 'integer', 'min:0', 'max:100'],
            'description' => ['required', 'string', 'max:5000'],
            'stock' => ['required', 'integer', 'min:0'],
            'rating' => ['required', 'integer', 'between:0,5'],
            'is_new' => ['required', 'boolean'],
            'is_top_rated' => ['required', 'boolean'],
            'images' => ['required', 'array', 'min:4'],
            'images.*' => ['required', 'url', 'max:2048'],
        ]);
    }

    private function getUserCart()
    {
        return Auth::check() ? Cart::query()->where('user_id', Auth::id())->get() : [];
    }

    private function getUserWishlist()
    {
        return Auth::check() ? Wishlist::query()->where('user_id', Auth::id())->get() : [];
    }
}
