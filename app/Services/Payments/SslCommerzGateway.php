<?php

namespace App\Services\Payments;

use App\Models\Order;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class SslCommerzGateway
{
    public function configured(): bool
    {
        return filled(config('services.sslcommerz.store_id'))
            && filled(config('services.sslcommerz.store_password'));
    }

    public function initiate(Order $order): string
    {
        $this->ensureConfigured();

        $response = $this->client()->asForm()->post($this->baseUrl().'/gwprocess/v4/api.php', [
            'store_id' => config('services.sslcommerz.store_id'),
            'store_passwd' => config('services.sslcommerz.store_password'),
            'total_amount' => number_format((float) $order->total, 2, '.', ''),
            'currency' => 'BDT',
            'tran_id' => $order->gateway_transaction_id,
            'success_url' => route('payments.sslcommerz.success'),
            'fail_url' => route('payments.sslcommerz.fail'),
            'cancel_url' => route('payments.sslcommerz.cancel'),
            'ipn_url' => route('payments.sslcommerz.ipn'),
            'shipping_method' => 'Courier',
            'product_name' => 'ShopHunt order '.$order->order_number,
            'product_category' => 'ecommerce',
            'product_profile' => 'general',
            'cus_name' => $order->customer_name,
            'cus_email' => $order->customer_email,
            'cus_add1' => $order->shipping_address,
            'cus_city' => $order->shipping_city,
            'cus_postcode' => $order->shipping_postal_code,
            'cus_country' => 'Bangladesh',
            'cus_phone' => $order->customer_phone,
            'ship_name' => $order->customer_name,
            'ship_add1' => $order->shipping_address,
            'ship_city' => $order->shipping_city,
            'ship_postcode' => $order->shipping_postal_code,
            'ship_country' => 'Bangladesh',
            'multi_card_name' => $this->channelFor($order->payment_method),
            'value_a' => (string) $order->id,
            'value_b' => (string) $order->user_id,
        ])->throw()->json();

        if (($response['status'] ?? null) !== 'SUCCESS' || blank($response['GatewayPageURL'] ?? null)) {
            throw new RuntimeException($response['failedreason'] ?? 'Unable to create the payment session.');
        }

        $order->update([
            'gateway_session_id' => $response['sessionkey'] ?? null,
            'gateway_status' => 'initiated',
            'gateway_response' => $response,
        ]);

        return $response['GatewayPageURL'];
    }

    public function validate(string $validationId): array
    {
        $this->ensureConfigured();

        return $this->client()->get($this->baseUrl().'/validator/api/validationserverAPI.php', [
            'val_id' => $validationId,
            'store_id' => config('services.sslcommerz.store_id'),
            'store_passwd' => config('services.sslcommerz.store_password'),
            'format' => 'json',
        ])->throw()->json();
    }

    private function client(): PendingRequest
    {
        return Http::acceptJson()->timeout(20)->retry(2, 300);
    }

    private function baseUrl(): string
    {
        return config('services.sslcommerz.sandbox', true)
            ? 'https://sandbox.sslcommerz.com'
            : 'https://securepay.sslcommerz.com';
    }

    private function channelFor(string $paymentMethod): string
    {
        return match ($paymentMethod) {
            'bkash' => 'bkash',
            'nagad' => 'nagad',
            'rocket' => 'dbblmobilebanking',
            'upay' => 'upay',
            'bank_dutch_bangla' => 'dbbl_visa,dbbl_master',
            'bank_brac' => 'brac_visa,brac_master',
            'bank_city' => 'city_visa,city_master,city_amex',
            'bank_ebl' => 'ebl_visa,ebl_master',
            default => '',
        };
    }

    private function ensureConfigured(): void
    {
        if (! $this->configured()) {
            throw new RuntimeException('SSLCOMMERZ credentials are not configured.');
        }
    }
}