<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::query()->where('email', 'test@example.com')->firstOrFail();

        $products = [
            ['Wireless Studio Headphones', 129.99, 15, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80', 48, 5, true, true],
            ['Classic Smart Watch', 189.00, 20, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80', 35, 5, true, true],
            ['Mirrorless Travel Camera', 749.00, 10, 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80', 18, 5, true, true],
            ['Portable Bluetooth Speaker', 79.99, null, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=80', 62, 4, true, false],
            ['Premium Leather Backpack', 119.50, 12, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80', 27, 4, false, true],
            ['Minimal Running Shoes', 94.00, 18, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80', 44, 5, true, false],
            ['Mechanical Gaming Keyboard', 139.99, null, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80', 31, 4, false, true],
            ['Wireless Gaming Mouse', 69.00, 8, 'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=900&q=80', 56, 4, true, false],
            ['Modern Desk Lamp', 58.00, 25, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80', 23, 4, false, false],
            ['Everyday Sunglasses', 49.99, 10, 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80', 71, 4, true, false],
            ['Ceramic Coffee Mug', 24.50, null, 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=80', 80, 3, false, false],
            ['Compact Instant Camera', 109.00, 15, 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=900&q=80', 29, 5, true, true],
        ];

        foreach ($products as [$name, $price, $discount, $image, $stock, $rating, $isNew, $isTopRated]) {
            Product::query()->updateOrCreate(
                ['name' => $name],
                [
                    'price' => $price,
                    'discount_price' => $discount,
                    'image' => $image,
                    'description' => "Demo product: {$name}. High-quality sample item for the ecommerce storefront.",
                    'user_id' => $user->id,
                    'stock' => $stock,
                    'rating' => $rating,
                    'is_new' => $isNew,
                    'is_top_rated' => $isTopRated,
                ]
            );
        }
    }
}
