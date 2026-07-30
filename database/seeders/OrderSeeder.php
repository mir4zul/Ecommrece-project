<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        $products = Product::query()->orderBy('id')->get();
        if ($products->isEmpty()) {
            return;
        }

        $customers = collect(range(1, 12))->map(fn (int $number) => User::query()->updateOrCreate(
            ['email' => "customer{$number}@example.com"],
            [
                'name' => "Demo Customer {$number}",
                'password' => Hash::make('password'),
                'role' => 'user',
            ]
        ));

        $statuses = ['completed', 'completed', 'processing', 'completed', 'pending', 'cancelled'];

        DB::transaction(function () use ($customers, $products, $statuses): void {
            foreach (range(5, 0) as $monthsAgo) {
                $month = now()->startOfMonth()->subMonths($monthsAgo);

                foreach (range(1, 12) as $sequence) {
                    $orderIndex = ((5 - $monthsAgo) * 12) + $sequence - 1;
                    $status = $statuses[$orderIndex % count($statuses)];
                    $orderedAt = $month->copy()->day(min($sequence * 2, $month->daysInMonth))->setTime(10 + ($sequence % 8), 0);
                    $lineItems = collect(range(0, 1 + ($orderIndex % 3)))->map(function (int $itemIndex) use ($orderIndex, $products) {
                        $product = $products[($orderIndex * 3 + $itemIndex) % $products->count()];
                        $quantity = 1 + (($orderIndex + $itemIndex) % 3);
                        $price = (float) $product->price;

                        return [
                            'product_id' => $product->id,
                            'product_name' => $product->name,
                            'price' => $price,
                            'quantity' => $quantity,
                            'line_total' => round($price * $quantity, 2),
                        ];
                    });
                    $subtotal = round($lineItems->sum('line_total'), 2);
                    $discount = $orderIndex % 4 === 0 ? round($subtotal * 0.1, 2) : 0;
                    $shipping = $subtotal - $discount >= 250 ? 0 : 12;
                    $total = round($subtotal - $discount + $shipping, 2);

                    $order = Order::query()->updateOrCreate(
                        ['order_number' => sprintf('DEMO-%s-%02d', $month->format('Ym'), $sequence)],
                        [
                            'user_id' => $customers[$orderIndex % $customers->count()]->id,
                            'status' => $status,
                            'payment_status' => in_array($status, ['completed', 'processing'], true) ? 'paid' : ($status === 'cancelled' ? 'failed' : 'pending'),
                            'subtotal' => $subtotal,
                            'discount' => $discount,
                            'shipping' => $shipping,
                            'total' => $total,
                            'ordered_at' => $orderedAt,
                        ]
                    );

                    $order->items()->delete();
                    $order->items()->createMany($lineItems->all());
                }
            }
        });
    }
}
