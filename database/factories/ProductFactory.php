<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    public function definition(): array
    {
        $images = [
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80',
            'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=900&q=80',
        ];
        $gallery = $this->faker->randomElements($images, 4);

        return [
            'name' => $this->faker->unique()->words(3, true),
            'category' => $this->faker->randomElement([
                'Electronics', 'Audio', 'Cameras', 'Wearables', 'Computing',
                'Fashion', 'Home & Living', 'Sports', 'Gaming', 'Accessories',
            ]),
            'price' => $this->faker->randomFloat(2, 15, 1200),
            'discount_price' => $this->faker->randomElement([null, 5, 10, 15, 20, 25]),
            'image' => $gallery[0],
            'images' => $gallery,
            'description' => $this->faker->sentence(16),
            'user_id' => \App\Models\User::factory(),
            'stock' => $this->faker->numberBetween(0, 100),
            'rating' => $this->faker->numberBetween(1, 5),
            'is_new' => $this->faker->boolean(35),
            'is_top_rated' => $this->faker->boolean(25),
        ];
    }
}
