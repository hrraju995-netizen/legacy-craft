<!DOCTYPE html>
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Invoice {{ $order->order_number }}</title>
    <style>
        @page {
            margin: 20px 25px;
        }
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-size: 12px;
            line-height: 1.4;
            color: #1e293b;
            margin: 0;
            padding: 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        .header-table {
            margin-bottom: 20px;
            border-bottom: 2px solid #9f582c;
            padding-bottom: 15px;
        }
        .logo-text {
            font-size: 22px;
            font-weight: bold;
            color: #9f582c;
            letter-spacing: 0.5px;
        }
        .tagline {
            font-size: 10px;
            color: #64748b;
            margin-top: 2px;
        }
        .invoice-title {
            font-size: 20px;
            font-weight: bold;
            color: #0f172a;
            text-align: right;
        }
        .invoice-meta {
            text-align: right;
            font-size: 11px;
            color: #475569;
            margin-top: 4px;
        }
        .badge {
            display: inline-block;
            padding: 4px 10px;
            font-size: 10px;
            font-weight: bold;
            border-radius: 4px;
            text-transform: uppercase;
        }
        .info-table {
            margin-bottom: 20px;
        }
        .info-box {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 12px;
            font-size: 11px;
            vertical-align: top;
        }
        .info-title {
            font-size: 11px;
            font-weight: bold;
            color: #9f582c;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 6px;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 4px;
        }
        .items-table {
            margin-bottom: 20px;
        }
        .items-table th {
            background-color: #f1f5f9;
            color: #334155;
            font-size: 11px;
            font-weight: bold;
            text-transform: uppercase;
            padding: 8px 10px;
            border: 1px solid #cbd5e1;
            text-align: left;
        }
        .items-table td {
            padding: 8px 10px;
            border: 1px solid #e2e8f0;
            font-size: 11px;
        }
        .items-table tr:nth-child(even) {
            background-color: #fafafa;
        }
        .totals-table {
            width: 45%;
            margin-left: auto;
            margin-bottom: 20px;
        }
        .totals-table td {
            padding: 6px 10px;
            font-size: 11px;
        }
        .totals-table .grand-total {
            font-size: 13px;
            font-weight: bold;
            color: #9f582c;
            border-top: 2px solid #9f582c;
            border-bottom: 2px solid #9f582c;
            background-color: #fff7ed;
        }
        .footer {
            margin-top: 30px;
            border-top: 1px solid #e2e8f0;
            padding-top: 12px;
            text-align: center;
            font-size: 10px;
            color: #64748b;
        }
    </style>
</head>
<body>

    <!-- Header -->
    <table class="header-table">
        <tr>
            <td style="width: 55%; vertical-align: top;">
                <div class="logo-text">{{ $siteName }}</div>
                <div class="tagline">{{ $siteTagline }}</div>
                <div style="margin-top: 6px; font-size: 10px; color: #475569;">
                    {{ $siteAddress }}<br>
                    Phone: {{ $sitePhone }} | Email: {{ $siteEmail }}
                </div>
            </td>
            <td style="width: 45%; vertical-align: top;">
                <div class="invoice-title">INVOICE</div>
                <div class="invoice-meta">
                    <strong>Invoice #:</strong> {{ $order->order_number }}<br>
                    <strong>Date:</strong> {{ $order->created_at->format('M d, Y') }}<br>
                    <strong>Payment:</strong> {{ strtoupper($order->payment_method ?? 'COD') }}<br>
                    <div style="margin-top: 6px;">
                        <span class="badge" style="background-color: {{ $statusConfig['bg'] }}; color: {{ $statusConfig['color'] }}; border: 1px solid {{ $statusConfig['border'] }};">
                            {{ $statusConfig['label'] }}
                        </span>
                    </div>
                </div>
            </td>
        </tr>
    </table>

    <!-- Customer & Shipping Info -->
    <table class="info-table">
        <tr>
            <td style="width: 48%; vertical-align: top;">
                <div class="info-box">
                    <div class="info-title">Billed To / Customer</div>
                    <strong>{{ $order->customer_name ?? $order->customer?->name ?? 'Valued Customer' }}</strong><br>
                    Phone: {{ $order->customer_phone ?? $order->customer?->phone ?? 'N/A' }}<br>
                    @if($order->customer_email || $order->customer?->email)
                        Email: {{ $order->customer_email ?? $order->customer?->email }}<br>
                    @endif
                </div>
            </td>
            <td style="width: 4%;"></td>
            <td style="width: 48%; vertical-align: top;">
                <div class="info-box">
                    <div class="info-title">Shipping Address</div>
                    {{ $order->shipping_address ?? 'Dhaka, Bangladesh' }}<br>
                    @if($order->shipping_city)
                        City: {{ $order->shipping_city }}<br>
                    @endif
                    Zone: {{ $order->shippingZone?->name ?? 'Standard Delivery' }}
                </div>
            </td>
        </tr>
    </table>

    <!-- Items Table -->
    <table class="items-table">
        <thead>
            <tr>
                <th style="width: 5%;">#</th>
                <th style="width: 55%;">Item Description</th>
                <th style="width: 15%; text-align: right;">Unit Price</th>
                <th style="width: 10%; text-align: center;">Qty</th>
                <th style="width: 15%; text-align: right;">Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($order->items as $index => $item)
                @php
                    $unitPrice = (int) round($item->unit_price / 100);
                    $lineTotal = (int) round($item->total_price / 100);
                @endphp
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>
                        <strong>{{ $item->product_name }}</strong>
                        @if($item->variant_label)
                            <div style="font-size: 10px; color: #64748b;">Variant: {{ $item->variant_label }}</div>
                        @endif
                    </td>
                    <td style="text-align: right;">{{ $currencySymbol }}{{ number_format($unitPrice) }}</td>
                    <td style="text-align: center;">{{ $item->quantity }}</td>
                    <td style="text-align: right; font-weight: bold;">{{ $currencySymbol }}{{ number_format($lineTotal) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <!-- Totals Table -->
    <table class="totals-table">
        <tr>
            <td style="color: #64748b;">Subtotal:</td>
            <td style="text-align: right; font-weight: bold;">
                {{ $currencySymbol }}{{ number_format((int) round($order->subtotal / 100)) }}
            </td>
        </tr>
        @if($order->discount > 0)
            <tr>
                <td style="color: #16a34a;">Discount:</td>
                <td style="text-align: right; font-weight: bold; color: #16a34a;">
                    -{{ $currencySymbol }}{{ number_format((int) round($order->discount / 100)) }}
                </td>
            </tr>
        @endif
        <tr>
            <td style="color: #64748b;">Shipping Fee:</td>
            <td style="text-align: right; font-weight: bold;">
                @if($order->shipping_cost > 0)
                    {{ $currencySymbol }}{{ number_format((int) round($order->shipping_cost / 100)) }}
                @else
                    FREE
                @endif
            </td>
        </tr>
        <tr class="grand-total">
            <td>Grand Total:</td>
            <td style="text-align: right;">
                {{ $currencySymbol }}{{ number_format((int) round($order->grand_total / 100)) }}
            </td>
        </tr>
    </table>

    @if($order->notes)
        <div style="background-color: #f8fafc; border-left: 3px solid #9f582c; padding: 8px 12px; margin-bottom: 20px; font-size: 11px;">
            <strong>Order Notes:</strong> {{ $order->notes }}
        </div>
    @endif

    <!-- Footer -->
    <div class="footer">
        <p>Thank you for choosing <strong>{{ $siteName }}</strong>! For any questions, please contact {{ $sitePhone }} or {{ $siteEmail }}.</p>
        <p style="margin-top: 4px; color: #94a3b8;">This is a computer generated invoice and does not require a physical signature.</p>
    </div>

</body>
</html>
