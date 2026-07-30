<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::query()->where('email', 'test@example.com')->firstOrFail();

        $categories = [
            'Electronics' => ['Wireless', 'Smart', 'Portable', 'Digital', 'Premium', 'Compact', 'Advanced', 'Classic', 'Modern', 'Essential'],
            'Audio' => ['Studio', 'Bluetooth', 'Noise-Cancelling', 'Hi-Fi', 'Portable', 'Gaming', 'Wireless', 'Mini', 'Pro', 'Bass'],
            'Cameras' => ['Mirrorless', 'Instant', 'Action', 'Travel', 'Digital', 'Compact', 'Vlogging', 'Professional', 'Outdoor', 'Classic'],
            'Wearables' => ['Fitness', 'Smart', 'Classic', 'Sport', 'Health', 'Active', 'Premium', 'Everyday', 'Adventure', 'Minimal'],
            'Computing' => ['Mechanical', 'Ergonomic', 'Wireless', 'Portable', 'Gaming', 'Ultra', 'Compact', 'Professional', 'Smart', 'Essential'],
            'Fashion' => ['Leather', 'Urban', 'Minimal', 'Classic', 'Everyday', 'Premium', 'Modern', 'Casual', 'Travel', 'Signature'],
            'Home & Living' => ['Modern', 'Ceramic', 'Ambient', 'Minimal', 'Smart', 'Classic', 'Cozy', 'Natural', 'Premium', 'Everyday'],
            'Sports' => ['Running', 'Training', 'Outdoor', 'Performance', 'Fitness', 'Active', 'Professional', 'Lightweight', 'Team', 'Endurance'],
            'Gaming' => ['RGB', 'Mechanical', 'Wireless', 'Pro', 'Elite', 'Compact', 'Streaming', 'Arcade', 'Precision', 'Tournament'],
            'Accessories' => ['Everyday', 'Travel', 'Premium', 'Compact', 'Protective', 'Minimal', 'Smart', 'Classic', 'Universal', 'Essential'],
        ];

        $productTypes = [
            'Electronics' => 'Device',
            'Audio' => 'Headphones',
            'Cameras' => 'Camera',
            'Wearables' => 'Smart Watch',
            'Computing' => 'Computer Accessory',
            'Fashion' => 'Fashion Item',
            'Home & Living' => 'Home Essential',
            'Sports' => 'Sports Gear',
            'Gaming' => 'Gaming Accessory',
            'Accessories' => 'Accessory',
        ];

        $imagePool = [
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=900&q=80',
        ];

        $productNumber = 0;
        foreach ($categories as $category => $styles) {
            foreach ($styles as $style) {
                $gallery = $this->galleryFor($imagePool, $productNumber);
                $name = "{$style} {$productTypes[$category]}";
                $price = 24.99 + (($productNumber * 17) % 950);

                Product::query()->updateOrCreate(
                    ['name' => $name, 'category' => $category],
                    [
                        'price' => $price,
                        'discount_price' => $productNumber % 4 === 0 ? null : (($productNumber % 5) + 1) * 5,
                        'image' => $gallery[0],
                        'images' => $gallery,
                        'description' => "Discover the {$name}, a dependable {$category} product designed for everyday quality, comfort, and performance.",
                        'user_id' => $user->id,
                        'stock' => ($productNumber * 13) % 101,
                        'rating' => ($productNumber % 5) + 1,
                        'is_new' => $productNumber % 3 === 0,
                        'is_top_rated' => $productNumber % 5 === 0,
                    ]
                );

                $productNumber++;
            }
        }

        Product::query()->get()->each(function (Product $product) use ($imagePool): void {
            $gallery = is_array($product->images) && count($product->images) >= 4
                ? array_values(array_slice($product->images, 0, 4))
                : $this->galleryFor($imagePool, $product->id);

            $product->update([
                'category' => $product->category ?: 'Accessories',
                'image' => $gallery[0],
                'images' => $gallery,
            ]);
        });
    }

    /** @return array<int, string> */
    private function galleryFor(array $imagePool, int $offset): array
    {
        $gallery = [];
        for ($index = 0; $index < 4; $index++) {
            $gallery[] = $imagePool[($offset + $index) % count($imagePool)];
        }

        return $gallery;
    }
}
