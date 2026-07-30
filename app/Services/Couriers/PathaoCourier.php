<?php

namespace App\Services\Couriers;

use App\Models\Order;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class PathaoCourier
{
    public function book(Order $order, int $cityId, int $zoneId): array
    {
        $config = config('services.pathao');
        foreach (['client_id', 'client_secret', 'username', 'password', 'store_id'] as $key) {
            if (blank($config[$key] ?? null)) {
                throw new RuntimeException('Pathao API is not configured. Add the merchant credentials in .env.');
            }
        }

        $token = Cache::remember('pathao.access_token', now()->addMinutes(50), function () use ($config) {
            $response = Http::acceptJson()->post($config['base_url'].'/issue-token', [
                'client_id' => $config['client_id'],
                'client_secret' => $config['client_secret'],
                'username' => $config['username'],
                'password' => $config['password'],
                'grant_type' => 'password',
            ])->throw()->json();

            return $response['access_token'] ?? throw new RuntimeException('Pathao did not return an access token.');
        });

        $response = Http::acceptJson()->withToken($token)
            ->post($config['base_url'].'/orders', [
                'store_id' => (int) $config['store_id'],
                'merchant_order_id' => $order->order_number,
                'recipient_name' => $order->customer_name,
                'recipient_phone' => $order->customer_phone,
                'recipient_address' => $order->shipping_address,
                'recipient_city' => $cityId,
                'recipient_zone' => $zoneId,
                'delivery_type' => 48,
                'item_type' => 2,
                'special_instruction' => 'Order '.$order->order_number,
                'item_quantity' => max(1, $order->items->sum('quantity')),
                'item_weight' => 0.5,
                'amount_to_collect' => $order->payment_method === 'cash_on_delivery' ? (float) $order->total : 0,
            ])->throw()->json();

        $data = $response['data'] ?? $response;
        $reference = $data['consignment_id'] ?? $data['tracking_id'] ?? null;
        if (! $reference) {
            throw new RuntimeException($response['message'] ?? 'Pathao booking reference was not returned.');
        }

        return ['reference' => (string) $reference, 'status' => 'booked'];
    }
}
