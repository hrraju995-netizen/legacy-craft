<?php

namespace App\Services\Courier;

use App\Models\Consignment;
use App\Models\Courier;
use App\Models\Order;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;

/**
 * Steadfast Courier (steadfast.com.bd) integration.
 *
 * Auth is two headers: Api-Key and Secret-Key. Amounts are sent in whole taka,
 * while we store paisa internally, hence the /100 conversions.
 */
class SteadfastDriver implements CourierDriver
{
    public function __construct(private Courier $courier) {}

    private function baseUrl(): string
    {
        return rtrim($this->courier->base_url ?: 'https://portal.packzy.com/api/v1', '/');
    }

    private function request()
    {
        return Http::withHeaders([
            'Api-Key' => $this->courier->api_key,
            'Secret-Key' => $this->courier->api_secret,
            'Content-Type' => 'application/json',
        ])->timeout(30)->retry(2, 500);
    }

    public function createConsignment(Order $order, array $options = []): Consignment
    {
        // COD is the grand total only when the order has not been paid online.
        $codAmount = $order->payment_status === 'paid' ? 0 : $order->grand_total;

        $payload = [
            'invoice' => $order->order_number,
            'recipient_name' => $order->customer_name,
            'recipient_phone' => $this->normalisePhone($order->customer_phone),
            'recipient_address' => trim($order->shipping_address.' '.$order->shipping_city),
            'cod_amount' => round($codAmount / 100, 2),
            'note' => $options['note'] ?? $order->order_note ?? '',
        ];

        $consignment = $order->consignments()->create([
            'courier_id' => $this->courier->id,
            'invoice' => $order->order_number,
            'cod_amount' => $codAmount,
            'status' => 'pending',
            'request_payload' => $payload,
        ]);

        try {
            $response = $this->request()->post($this->baseUrl().'/create_order', $payload);
            $body = $response->json() ?? [];

            $consignment->response_payload = $body;

            // Steadfast answers 200 with status 200 in the body on success.
            if (! $response->successful() || ($body['status'] ?? null) != 200) {
                $consignment->status = 'failed';
                $consignment->note = $body['message'] ?? 'Steadfast rejected the request.';
                $consignment->save();

                throw new RuntimeException($consignment->note);
            }

            $data = $body['consignment'] ?? [];

            $consignment->fill([
                'consignment_id' => $data['consignment_id'] ?? null,
                'tracking_code' => $data['tracking_code'] ?? null,
                'courier_status' => $data['status'] ?? 'in_review',
                'status' => 'dispatched',
                'dispatched_at' => now(),
            ])->save();

            $order->changeStatus('shipped', 'Handed to Steadfast ('.$consignment->tracking_code.')');
        } catch (\Throwable $e) {
            Log::error('Steadfast consignment failed', [
                'order' => $order->order_number,
                'error' => $e->getMessage(),
            ]);

            $consignment->status = 'failed';
            $consignment->note = $e->getMessage();
            $consignment->save();

            throw $e;
        }

        return $consignment->refresh();
    }

    public function trackStatus(Consignment $consignment): string
    {
        $response = $this->request()->get(
            $this->baseUrl().'/status_by_cid/'.$consignment->consignment_id
        );

        $status = $response->json('delivery_status') ?? 'unknown';

        $consignment->courier_status = $status;
        if ($status === 'delivered' && ! $consignment->delivered_at) {
            $consignment->delivered_at = now();
            $consignment->status = 'delivered';
            $consignment->order?->changeStatus('delivered', 'Marked delivered by Steadfast');
        }
        $consignment->save();

        return $status;
    }

    public function handleWebhook(array $payload): void
    {
        $consignment = Consignment::query()
            ->where('consignment_id', $payload['consignment_id'] ?? null)
            ->orWhere('tracking_code', $payload['tracking_code'] ?? null)
            ->first();

        if (! $consignment) {
            return;
        }

        $status = $payload['status'] ?? $payload['delivery_status'] ?? null;
        if (! $status) {
            return;
        }

        $consignment->courier_status = $status;

        // Map the courier's vocabulary onto our own order statuses.
        $map = [
            'delivered' => 'delivered',
            'partial_delivered' => 'delivered',
            'cancelled' => 'cancelled',
            'returned' => 'returned',
        ];

        if (isset($map[$status])) {
            $consignment->status = $map[$status];
            $consignment->delivered_at ??= $status === 'delivered' ? now() : null;
            $consignment->order?->changeStatus($map[$status], "Steadfast webhook: {$status}");
        }

        $consignment->save();
    }

    private function normalisePhone(string $phone): string
    {
        $digits = preg_replace('/\D/', '', $phone);

        // Steadfast wants a local 11-digit number: 8801… and +8801… -> 01…
        if (str_starts_with($digits, '880')) {
            $digits = '0'.substr($digits, 3);
        }

        return $digits;
    }
}
