<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use App\Models\Customer;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\ShippingZone;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CheckoutController extends Controller
{
    /**
     * POST /api/checkout
     *
     * Prices are re-read from the database, never trusted from the client —
     * otherwise anyone could post their own price and buy a bed for ৳1.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'customer_name' => 'required|string|max:120',
            'customer_phone' => ['required', 'regex:/^01[3-9]\d{8}$/'],
            'customer_email' => 'nullable|email|max:150',
            'shipping_address' => 'required|string|max:500',
            'shipping_city' => 'nullable|string|max:80',
            'shipping_zone' => 'required|string|exists:shipping_zones,slug',
            'order_note' => 'nullable|string|max:1000',
            'coupon_code' => 'nullable|string|max:50',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|integer|exists:products,id',
            'items.*.variant_id' => 'nullable|integer|exists:product_variants,id',
            'items.*.quantity' => 'required|integer|min:1|max:99',
        ]);

        $zone = ShippingZone::where('slug', $data['shipping_zone'])->firstOrFail();

        $order = DB::transaction(function () use ($data, $zone) {
            $products = Product::active()
                ->whereIn('id', collect($data['items'])->pluck('product_id'))
                ->with('images')
                ->get()
                ->keyBy('id');

            $lines = [];
            $subtotal = 0;

            foreach ($data['items'] as $line) {
                $product = $products->get($line['product_id']);
                abort_unless($product, 422, 'A product in your cart is no longer available.');

                $variant = isset($line['variant_id'])
                    ? ProductVariant::find($line['variant_id'])
                    : null;

                $unitPrice = $variant?->effective_price ?? $product->price;
                $quantity = (int) $line['quantity'];

                if ($product->manage_stock && $product->stock_quantity < $quantity) {
                    abort(422, "Only {$product->stock_quantity} left of {$product->name}.");
                }

                $lineTotal = $unitPrice * $quantity;
                $subtotal += $lineTotal;

                $lines[] = [
                    'product' => $product,
                    'variant' => $variant,
                    'attributes' => [
                        'product_id' => $product->id,
                        'product_variant_id' => $variant?->id,
                        'product_name' => $product->name,
                        'product_sku' => $variant?->sku ?? $product->sku,
                        'variant_name' => $variant?->name ?? $variant?->color?->name,
                        'product_image' => $variant?->image ?? $product->thumbnail,
                        'unit_price' => $unitPrice,
                        'quantity' => $quantity,
                        'line_total' => $lineTotal,
                    ],
                ];
            }

            $coupon = null;
            $discount = 0;
            $freeShipping = false;

            if (! empty($data['coupon_code'])) {
                $coupon = Coupon::where('code', $data['coupon_code'])->first();
                if ($coupon && $coupon->isValidFor($subtotal)) {
                    $discount = $coupon->discountFor($subtotal);
                    $freeShipping = $coupon->type === 'free_shipping';
                } else {
                    $coupon = null;
                }
            }

            $shipping = $freeShipping ? 0 : $zone->rateFor($subtotal);

            $customer = Customer::firstOrCreate(
                ['phone' => $data['customer_phone']],
                ['name' => $data['customer_name'], 'email' => $data['customer_email'] ?? null]
            );

            $order = Order::create([
                'customer_id' => $customer->id,
                'coupon_id' => $coupon?->id,
                'status' => 'pending',
                'payment_status' => 'unpaid',
                'payment_method' => 'cod',
                'customer_name' => $data['customer_name'],
                'customer_phone' => $data['customer_phone'],
                'customer_email' => $data['customer_email'] ?? null,
                'shipping_address' => $data['shipping_address'],
                'shipping_city' => $data['shipping_city'] ?? 'Dhaka',
                'shipping_zone_id' => $zone->id,
                'order_note' => $data['order_note'] ?? null,
                'subtotal' => $subtotal,
                'discount_total' => $discount,
                'shipping_total' => $shipping,
                'grand_total' => max(0, $subtotal - $discount + $shipping),
            ]);

            foreach ($lines as $line) {
                $order->items()->create($line['attributes']);

                if ($line['product']->manage_stock) {
                    $line['product']->decrement('stock_quantity', $line['attributes']['quantity']);
                }
            }

            $coupon?->increment('used_count');

            $order->statusHistories()->create([
                'to_status' => 'pending',
                'comment' => 'Order placed from storefront',
            ]);

            return $order->load('items');
        });

        return response()->json([
            'message' => 'Order placed successfully.',
            'order' => [
                'orderNumber' => $order->order_number,
                'status' => $order->status,
                'date' => $order->created_at->format('M d, Y'),
                'customer' => [
                    'fullName' => $order->customer_name,
                    'phone' => $order->customer_phone,
                    'email' => $order->customer_email,
                    'address' => $order->shipping_address,
                    'city' => $order->shipping_city,
                    'orderNote' => $order->order_note,
                ],
                'subtotal' => (int) round($order->subtotal / 100),
                'discount' => (int) round($order->discount_total / 100),
                'shipping' => (int) round($order->shipping_total / 100),
                'total' => (int) round($order->grand_total / 100),
                'items' => $order->items->map(fn ($i) => [
                    'name' => $i->product_name,
                    'variant' => $i->variant_name,
                    'image' => Product::resolveImageUrl($i->product_image) ?? $i->product_image,
                    'quantity' => $i->quantity,
                    'price' => (int) round($i->unit_price / 100),
                    'lineTotal' => (int) round($i->line_total / 100),
                ]),
            ],
        ], 201);
    }

    /** GET /api/orders/{orderNumber}/track — public order lookup by order number and optional phone. */
    public function track(Request $request, string $orderNumber)
    {
        $corsHeaders = [
            'Access-Control-Allow-Origin' => '*',
            'Access-Control-Allow-Methods' => 'GET, OPTIONS',
            'Access-Control-Allow-Headers' => 'Content-Type, Accept, Authorization, X-Requested-With',
        ];

        if ($request->isMethod('OPTIONS')) {
            return response('', 204, $corsHeaders);
        }

        $rawPhone = trim((string) $request->input('phone'));
        $cleanOrderNumber = trim($orderNumber);

        // Case-insensitive order number search
        $query = Order::where(function ($q) use ($cleanOrderNumber) {
            $q->where('order_number', $cleanOrderNumber)
              ->orWhere('order_number', strtoupper($cleanOrderNumber))
              ->orWhere('order_number', strtolower($cleanOrderNumber));
        });

        // Only filter by phone if provided and not placeholder text (e.g. 01XXXXXXXXX)
        $hasRealPhone = ! empty($rawPhone) && ! str_contains($rawPhone, 'X') && ! str_contains($rawPhone, 'x');
        if ($hasRealPhone) {
            $digits = preg_replace('/[^0-9]/', '', $rawPhone);
            if (strlen($digits) >= 6) {
                $lastDigits = substr($digits, -10);
                $query->where('customer_phone', 'like', "%{$lastDigits}%");
            }
        }

        $order = $query->with(['items', 'consignments.courier', 'statusHistories'])->first();

        $corsHeaders = [
            'Access-Control-Allow-Origin' => '*',
            'Access-Control-Allow-Methods' => 'GET, OPTIONS',
            'Access-Control-Allow-Headers' => 'Content-Type, Accept, Authorization, X-Requested-With',
        ];

        if (! $order) {
            return response()->json([
                'message' => 'No order found with Order Number: ' . $cleanOrderNumber . ($hasRealPhone ? ' and Phone: ' . $rawPhone : '. Please check the number.'),
            ], 404, $corsHeaders);
        }

        $phoneVerified = false;
        if ($hasRealPhone) {
            $digits = preg_replace('/[^0-9]/', '', $rawPhone);
            $lastDigits = substr($digits, -10);
            $orderDigits = preg_replace('/[^0-9]/', '', (string) $order->customer_phone);
            if (! empty($lastDigits) && str_ends_with($orderDigits, $lastDigits)) {
                $phoneVerified = true;
            }
        }

        // Also check if request is authenticated as the owning customer
        $authCustomer = $request->user('sanctum') ?? $request->user();
        if ($authCustomer && $authCustomer->id === $order->customer_id) {
            $phoneVerified = true;
        }

        $customerPhone = $phoneVerified
            ? $order->customer_phone
            : (strlen($order->customer_phone) > 6
                ? substr($order->customer_phone, 0, 3) . '*****' . substr($order->customer_phone, -3)
                : '***');

        $shippingAddress = $phoneVerified
            ? ($order->shipping_address . ($order->shipping_city ? ', ' . $order->shipping_city : ''))
            : ($order->shipping_city ? '***, ' . $order->shipping_city : '***, Bangladesh');

        return response()->json([
            'orderNumber' => $order->order_number,
            'status' => $order->status,
            'statusLabel' => Order::STATUSES[$order->status] ?? ucfirst($order->status),
            'customerName' => $order->customer_name,
            'customerPhone' => $customerPhone,
            'shippingAddress' => $shippingAddress,
            'isVerified' => $phoneVerified,
            'paymentStatus' => $order->payment_status,
            'paymentMethod' => $order->payment_method,
            'placedAt' => $order->created_at->format('M d, Y h:i A'),
            'total' => (int) round($order->grand_total / 100),
            'subtotal' => (int) round($order->subtotal / 100),
            'shippingTotal' => (int) round($order->shipping_total / 100),
            'discountTotal' => (int) round($order->discount_total / 100),
            'items' => $order->items->map(fn ($i) => [
                'name' => $i->product_name,
                'variant' => $i->variant_name,
                'image' => Product::resolveImageUrl($i->product_image) ?? $i->product_image,
                'quantity' => $i->quantity,
                'price' => (int) round($i->unit_price / 100),
                'lineTotal' => (int) round($i->line_total / 100),
            ]),
            'tracking' => $order->consignments->map(fn ($c) => [
                'courier' => $c->courier?->name,
                'trackingCode' => $c->tracking_code,
                'status' => $c->courier_status,
            ]),
            'timeline' => $order->statusHistories()->latest()->get()->map(fn ($h) => [
                'status' => $h->to_status,
                'statusLabel' => Order::STATUSES[$h->to_status] ?? ucfirst($h->to_status),
                'comment' => $h->comment,
                'time' => $h->created_at->format('M d, Y h:i A'),
            ]),
        ], 200, $corsHeaders);
    }
}

