<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SslCommerzPaymentController;
use App\Http\Controllers\WishlistController;
use Illuminate\Support\Facades\Route;

// routes/products.php
Route::get('/', [ProductController::class, 'index'])->name('products.index');
Route::get('/products/{id}', [ProductController::class, 'show'])->name('product.show');
Route::get('/all-product', [ProductController::class, 'shopLeftSidebar'])->name('products.shopLeftSidebar');

Route::get('/blog', function () {
    return inertia('Blog');
});

Route::get('/test', function () {
    return inertia('Test');
});
Route::post('/payments/sslcommerz/success', [SslCommerzPaymentController::class, 'success'])->name('payments.sslcommerz.success');
Route::post('/payments/sslcommerz/fail', [SslCommerzPaymentController::class, 'fail'])->name('payments.sslcommerz.fail');
Route::post('/payments/sslcommerz/cancel', [SslCommerzPaymentController::class, 'cancel'])->name('payments.sslcommerz.cancel');
Route::post('/payments/sslcommerz/ipn', [SslCommerzPaymentController::class, 'ipn'])->name('payments.sslcommerz.ipn');

// Admin routes
Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    Route::get('/dashboard', [AdminController::class, 'index'])->name('dashboard');
    Route::get('/admin/wishlists', [AdminController::class, 'wishlists'])->name('admin.wishlists.index');
    Route::get('/admin/orders', [AdminController::class, 'orders'])->name('admin.orders.index');
    Route::get('/admin/orders/{order}', [AdminController::class, 'showOrder'])->name('admin.orders.show');
    Route::patch('/admin/orders/{order}/status', [AdminController::class, 'updateOrderStatus'])->name('admin.orders.status');
    Route::patch('/admin/orders/{order}/payment', [AdminController::class, 'updateOrderPayment'])->name('admin.orders.payment');
    Route::get('/admin/products', [ProductController::class, 'adminIndex'])->name('admin.products.index');
    Route::get('/admin/products/create', [ProductController::class, 'create'])->name('admin.products.create');
    Route::post('/admin/products', [ProductController::class, 'store'])->name('admin.products.store');
    Route::get('/admin/products/{product}/edit', [ProductController::class, 'edit'])->name('admin.products.edit');
    Route::put('/admin/products/{product}', [ProductController::class, 'update'])->name('admin.products.update');
    Route::delete('/admin/products/{product}', [ProductController::class, 'destroy'])->name('admin.products.destroy');
});

// routes/cart.php
Route::middleware('auth')->group(function () {
    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    Route::post('/add-to-cart', [CartController::class, 'addToCart'])->name('add-to-cart');
    Route::patch('/cart/{cart}', [CartController::class, 'update'])->name('cart.update');
    Route::delete('/cart/{cart}', [CartController::class, 'removeFromCart'])->name('remove-from-cart');
    Route::get('/checkout', [CartController::class, 'checkout'])->name('checkout.index');
    Route::post('/checkout', [CartController::class, 'placeOrder'])->name('checkout.store');
    Route::get('/orders/{order}/success', [CartController::class, 'success'])->name('orders.success');
    Route::get('/my-orders', [CartController::class, 'orders'])->name('orders.index');
    Route::get('/my-orders/{order}', [CartController::class, 'orderDetails'])->name('orders.show');
});

// routes/wishlist.php
Route::post('/add-to-favorites', [WishlistController::class, 'addToWishlist'])->name('add-to-wishlist');
Route::delete('/remove-from-wishlist/{wishlist}', [WishlistController::class, 'removeFromWishlist'])->name('remove-from-wishlist');

// Auth routes
// Route::middleware(['guest'])->group(function () {
//     Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
//     Route::post('/login', [AuthenticatedSessionController::class, 'store']);
//     Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
//     Route::post('/register', [RegisteredUserController::class, 'store']);
// });

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', action: [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
