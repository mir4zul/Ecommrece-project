<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Services\Payments\SslCommerzGateway;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Throwable;

class SslCommerzPaymentController extends Controller
{
    public function success(Request $request, SslCommerzGateway $gateway): RedirectResponse
    {
        $order = $this->processSuccessfulPayment($request, $gateway);

        if (! $order) {
            return to_route('products.index')
                ->with('error', 'We could not verify this payment. Please contact support with your transaction ID.');
        }

        return to_route('orders.success', $order)
            ->with('success', 'Your payment was verified successfully.');
    }

    public function ipn(Request $request, SslCommerzGateway $gateway): JsonResponse
    {
        $order = $this->processSuccessfulPayment($request, $gateway);

        return response()->json([
            'received' => true,
            'verified' => (bool) $order,
        ], $order ? 200 : 422);
    }

    public function fail(Request $request): RedirectResponse
    {
        return $this->markFailed($request, 'failed');
    }

    public function cancel(Request $request): RedirectResponse
    {
        return $this->markFailed($request, 'cancelled');
    }

    private function processSuccessfulPayment(Request $request, SslCommerzGateway $gateway): ?Order
    {
        $transactionId = (string) $request->input('tran_id');
        $validationId = (string) $request->input('val_id');

        if ($transactionId === '' || $validationId === '') {
            return null;
        }

        try {
            $validation = $gateway->validate($validationId);
        } catch (Throwable $exception) {
            Log::error('SSLCOMMERZ validation request failed.', [
                'transaction_id' => $transactionId,
                'message' => $exception->getMessage(),
            ]);

            return null;
        }

        return DB::transaction(function () use ($transactionId, $validationId, $validation) {
            $order = Order::query()
                ->where('gateway_transaction_id', $transactionId)
                ->lockForUpdate()
                ->first();

            if (! $order || ! $this->validForOrder($validation, $order)) {
                Log::warning('SSLCOMMERZ payment validation mismatch.', [
                    'transaction_id' => $transactionId,
                    'order_id' => $order?->id,
                    'validation' => $validation,
                ]);

                return null;
            }

            if ($order->payment_status !== 'paid') {
                $order->update([
                    'payment_status' => 'paid',
                    'gateway_validation_id' => $validationId,
                    'gateway_status' => strtolower((string) $validation['status']),
                    'gateway_response' => $validation,
                    'paid_at' => now(),
                ]);
            }

            return $order;
        });
    }

    private function validForOrder(array $validation, Order $order): bool
    {
        return in_array($validation['status'] ?? null, ['VALID', 'VALIDATED'], true)
            && hash_equals((string) $order->gateway_transaction_id, (string) ($validation['tran_id'] ?? ''))
            && strtoupper((string) ($validation['currency'] ?? '')) === 'BDT'
            && abs((float) ($validation['amount'] ?? 0) - (float) $order->total) < 0.01;
    }

    private function markFailed(Request $request, string $status): RedirectResponse
    {
        $transactionId = (string) $request->input('tran_id');
        $order = $transactionId === ''
            ? null
            : Order::query()->where('gateway_transaction_id', $transactionId)->first();

        if ($order) {
            DB::transaction(function () use ($order, $request, $status) {
                $lockedOrder = Order::query()->with('items')->lockForUpdate()->findOrFail($order->id);

                if ($lockedOrder->payment_status !== 'paid') {
                    $this->releaseReservedStock($lockedOrder);
                    $lockedOrder->update([
                        'payment_status' => 'failed',
                        'gateway_status' => $status,
                        'gateway_response' => $request->except(['store_passwd']),
                    ]);
                }
            });
        }

        $redirect = $order ? to_route('orders.show', $order) : to_route('products.index');

        return $redirect->with(
            'error',
            $status === 'cancelled' ? 'Payment was cancelled.' : 'Payment failed. Please try again.',
        );
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
}