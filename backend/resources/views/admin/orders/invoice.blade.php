<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice {{ $order->order_number }} — {{ $siteName }}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #9f582c;
            --primary-dark: #7a3e1b;
            --text-main: #0f172a;
            --text-muted: #64748b;
            --border-color: #e2e8f0;
            --bg-light: #f8fafc;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
            background-color: #f1f5f9;
            color: var(--text-main);
            font-size: 13px;
            line-height: 1.5;
            -webkit-font-smoothing: antialiased;
        }

        /* Top Action Bar (Screen Only) */
        .no-print-bar {
            background: #1e293b;
            color: #ffffff;
            padding: 12px 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: sticky;
            top: 0;
            z-index: 100;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .no-print-bar .title {
            font-weight: 700;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .action-buttons {
            display: flex;
            gap: 12px;
        }

        .btn {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 8px 18px;
            border-radius: 8px;
            font-weight: 700;
            font-size: 13px;
            cursor: pointer;
            text-decoration: none;
            transition: all 0.2s ease;
            border: none;
        }

        .btn-print {
            background: var(--primary);
            color: #ffffff;
        }

        .btn-print:hover {
            background: var(--primary-dark);
        }

        .btn-close {
            background: #334155;
            color: #f8fafc;
        }

        .btn-close:hover {
            background: #475569;
        }

        /* Invoice Container */
        .invoice-wrapper {
            max-width: 850px;
            margin: 24px auto;
            background: #ffffff;
            border-radius: 16px;
            box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04);
            padding: 40px;
            position: relative;
            overflow: hidden;
        }

        /* Subtle Top Decorative Border */
        .invoice-wrapper::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 6px;
            background: linear-gradient(90deg, var(--primary) 0%, #d97706 100%);
        }

        /* Invoice Header */
        .invoice-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding-bottom: 28px;
            border-bottom: 1.5px solid var(--border-color);
        }

        .company-brand {
            display: flex;
            flex-direction: column;
            gap: 6px;
            max-width: 50%;
        }

        .company-logo {
            max-height: 52px;
            max-width: 180px;
            object-fit: contain;
            display: block;
            margin-bottom: 4px;
        }

        .company-name {
            font-size: 18px;
            font-weight: 800;
            color: var(--text-main);
            letter-spacing: -0.02em;
        }

        .company-tagline {
            font-size: 11px;
            color: var(--text-muted);
            font-weight: 500;
        }

        .company-meta {
            font-size: 11px;
            color: var(--text-muted);
            line-height: 1.6;
            margin-top: 4px;
        }

        .invoice-meta {
            text-align: right;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 8px;
        }

        .invoice-title {
            font-size: 28px;
            font-weight: 800;
            color: var(--primary);
            letter-spacing: -0.03em;
            text-transform: uppercase;
            line-height: 1;
        }

        .invoice-number {
            font-family: 'JetBrains Mono', monospace;
            font-weight: 700;
            font-size: 14px;
            color: var(--text-main);
            background: var(--bg-light);
            padding: 4px 10px;
            border-radius: 6px;
            border: 1px solid var(--border-color);
            display: inline-block;
        }

        /* Status Badge */
        .status-badge {
            display: inline-block;
            padding: 5px 14px;
            border-radius: 9999px;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 0.06em;
            text-transform: uppercase;
            background-color: {{ $statusConfig['bg'] }};
            color: {{ $statusConfig['color'] }};
            border: 1px solid {{ $statusConfig['border'] }};
        }

        .invoice-dates {
            font-size: 11px;
            color: var(--text-muted);
            line-height: 1.5;
        }

        /* Details Section: Bill To / Ship To */
        .details-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 32px;
            padding: 24px 0;
            border-bottom: 1.5px solid var(--border-color);
        }

        .details-col h4 {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--text-muted);
            font-weight: 700;
            margin-bottom: 8px;
        }

        .details-col .primary-text {
            font-size: 14px;
            font-weight: 700;
            color: var(--text-main);
            margin-bottom: 4px;
        }

        .details-col .secondary-text {
            font-size: 12px;
            color: var(--text-muted);
            line-height: 1.6;
        }

        /* Items Table */
        .items-table-wrapper {
            margin: 28px 0;
        }

        .items-table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
        }

        .items-table th {
            background-color: var(--bg-light);
            padding: 10px 14px;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            font-weight: 700;
            color: var(--text-muted);
            border-bottom: 1.5px solid var(--border-color);
        }

        .items-table td {
            padding: 14px;
            border-bottom: 1px solid var(--border-color);
            vertical-align: middle;
            font-size: 13px;
        }

        .item-info {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .item-thumb {
            width: 44px;
            height: 44px;
            object-fit: cover;
            border-radius: 8px;
            border: 1px solid var(--border-color);
            background: #ffffff;
            flex-shrink: 0;
        }

        .item-name {
            font-weight: 700;
            color: var(--text-main);
            font-size: 13px;
        }

        .item-variant {
            font-size: 11px;
            color: var(--primary);
            font-weight: 600;
            margin-top: 2px;
        }

        .item-sku {
            font-size: 10px;
            color: #94a3b8;
            font-family: 'JetBrains Mono', monospace;
        }

        .text-center { text-align: center; }
        .text-right { text-align: right; }

        /* Summary Calculation */
        .summary-section {
            display: grid;
            grid-template-columns: 1fr 340px;
            gap: 32px;
            margin-top: 20px;
        }

        .notes-col {
            background: var(--bg-light);
            border-radius: 12px;
            padding: 16px;
            border: 1px solid var(--border-color);
            font-size: 11px;
        }

        .notes-col h5 {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            color: var(--text-muted);
            margin-bottom: 6px;
        }

        .notes-col p {
            color: var(--text-main);
            line-height: 1.5;
        }

        .calculation-table {
            width: 100%;
            border-collapse: collapse;
        }

        .calculation-table td {
            padding: 7px 10px;
            font-size: 12px;
        }

        .calculation-table .label {
            color: var(--text-muted);
            font-weight: 500;
        }

        .calculation-table .amount {
            text-align: right;
            font-weight: 600;
            color: var(--text-main);
        }

        .calculation-table .total-row td {
            padding-top: 12px;
            border-top: 2px solid var(--border-color);
            font-size: 16px;
            font-weight: 800;
            color: var(--primary);
        }

        /* Invoice Footer */
        .invoice-footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1.5px solid var(--border-color);
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
        }

        .footer-terms {
            font-size: 10.5px;
            color: var(--text-muted);
            max-width: 60%;
            line-height: 1.5;
        }

        .signature-block {
            text-align: center;
            width: 180px;
        }

        .signature-line {
            border-top: 1px solid var(--text-main);
            margin-bottom: 6px;
            padding-top: 4px;
            font-size: 11px;
            font-weight: 700;
            color: var(--text-main);
        }

        /* Print Optimization */
        @media print {
            body {
                background: #ffffff;
                color: #000000;
                font-size: 12px;
            }

            .no-print-bar {
                display: none !important;
            }

            .invoice-wrapper {
                margin: 0;
                padding: 10px 0;
                max-width: 100%;
                box-shadow: none;
                border-radius: 0;
            }

            .invoice-wrapper::before {
                display: none;
            }

            .status-badge {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }

            .items-table th {
                background-color: #f1f5f9 !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }

            .notes-col {
                background-color: #f8fafc !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }

            @page {
                size: A4 portrait;
                margin: 12mm 15mm;
            }
        }
    </style>
</head>
<body>

    <!-- Top Action Bar for Web Preview -->
    <div class="no-print-bar">
        <div class="title">
            <span>📄 Official Order Invoice — {{ $order->order_number }}</span>
        </div>
        <div class="action-buttons">
            <button onclick="window.print()" class="btn btn-print">
                🖨️ Print / Save as PDF
            </button>
            <button onclick="window.close()" class="btn btn-close">
                ✕ Close
            </button>
        </div>
    </div>

    <!-- Main Invoice Container -->
    <div class="invoice-wrapper">
        
        <!-- Header -->
        <header class="invoice-header">
            <div class="company-brand">
                @if($siteLogo)
                    <img src="{{ $siteLogo }}" alt="{{ $siteName }}" class="company-logo" />
                @endif
                <div class="company-name">{{ $siteName }}</div>
                <div class="company-tagline">{{ $siteTagline }}</div>
                <div class="company-meta">
                    {{ $siteAddress }}<br>
                    Phone: {{ $sitePhone }} | Email: {{ $siteEmail }}
                </div>
            </div>

            <div class="invoice-meta">
                <div class="invoice-title">INVOICE</div>
                <div class="invoice-number">#{{ $order->order_number }}</div>
                
                <!-- Dynamic Status Badge -->
                <div class="status-badge">
                    Status: {{ $statusConfig['label'] }}
                </div>

                <div class="invoice-dates">
                    <strong>Invoice Date:</strong> {{ $order->created_at->format('d M, Y') }}<br>
                    <strong>Time:</strong> {{ $order->created_at->format('h:i A') }}
                </div>
            </div>
        </header>

        <!-- Customer & Delivery Details -->
        <section class="details-grid">
            <div class="details-col">
                <h4>Billed / Shipped To</h4>
                <div class="primary-text">{{ $order->customer_name }}</div>
                <div class="secondary-text">
                    <strong>Phone:</strong> {{ $order->customer_phone }}<br>
                    @if($order->customer_email)
                        <strong>Email:</strong> {{ $order->customer_email }}<br>
                    @endif
                    <strong>Delivery Address:</strong><br>
                    {{ $order->shipping_address }}
                    @if($order->shipping_city)
                        , {{ $order->shipping_city }}
                    @endif
                </div>
            </div>

            <div class="details-col">
                <h4>Payment & Shipping Overview</h4>
                <div class="secondary-text">
                    <strong>Payment Method:</strong> {{ strtoupper($order->payment_method) }} (Cash on Delivery)<br>
                    <strong>Payment Status:</strong> 
                    <span style="font-weight: 700; color: {{ $order->payment_status === 'paid' ? '#059669' : '#d97706' }};">
                        {{ strtoupper($order->payment_status) }}
                    </span><br>
                    @if($order->shippingZone)
                        <strong>Shipping Zone:</strong> {{ $order->shippingZone->name }}<br>
                    @endif
                    @if($order->consignments->isNotEmpty() && $order->consignments->first()->tracking_code)
                        <strong>Tracking Code:</strong> {{ $order->consignments->first()->tracking_code }}<br>
                    @endif
                </div>
            </div>
        </section>

        <!-- Items Table -->
        <section class="items-table-wrapper">
            <table class="items-table">
                <thead>
                    <tr>
                        <th style="width: 5%;">#</th>
                        <th style="width: 50%;">Item & Specifications</th>
                        <th class="text-right" style="width: 15%;">Unit Price</th>
                        <th class="text-center" style="width: 10%;">Qty</th>
                        <th class="text-right" style="width: 20%;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($order->items as $index => $item)
                        <tr>
                            <td style="color: var(--text-muted); font-weight: 600;">{{ $index + 1 }}</td>
                            <td>
                                <div class="item-info">
                                    @if($item->product_image)
                                        <img src="{{ \App\Models\Product::resolveImageUrl($item->product_image) }}" alt="{{ $item->product_name }}" class="item-thumb" />
                                    @endif
                                    <div>
                                        <div class="item-name">{{ $item->product_name }}</div>
                                        @if($item->variant_name)
                                            <div class="item-variant">Option: {{ $item->variant_name }}</div>
                                        @endif
                                        @if($item->product_sku)
                                            <div class="item-sku">SKU: {{ $item->product_sku }}</div>
                                        @endif
                                    </div>
                                </div>
                            </td>
                            <td class="text-right font-medium">
                                {{ $currencySymbol }}{{ number_format($item->unit_price / 100) }}
                            </td>
                            <td class="text-center font-bold">
                                {{ $item->quantity }}
                            </td>
                            <td class="text-right font-bold">
                                {{ $currencySymbol }}{{ number_format($item->line_total / 100) }}
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="5" class="text-center" style="padding: 24px; color: var(--text-muted);">
                                No items found.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </section>

        <!-- Summary Section -->
        <section class="summary-section">
            <div class="notes-col">
                <h5>Special Instructions / Notes:</h5>
                <p>{{ $order->order_note ?: 'No special delivery instructions provided for this order.' }}</p>
                @if($order->admin_note)
                    <div style="margin-top: 8px; border-top: 1px dashed var(--border-color); padding-top: 6px;">
                        <span style="font-weight: 700; color: var(--text-muted);">Internal Note:</span> {{ $order->admin_note }}
                    </div>
                @endif
            </div>

            <div>
                <table class="calculation-table">
                    <tr>
                        <td class="label">Subtotal</td>
                        <td class="amount">{{ $currencySymbol }}{{ number_format($order->subtotal / 100) }}</td>
                    </tr>
                    @if($order->discount_total > 0)
                        <tr>
                            <td class="label" style="color: #059669;">Discount</td>
                            <td class="amount" style="color: #059669;">-{{ $currencySymbol }}{{ number_format($order->discount_total / 100) }}</td>
                        </tr>
                    @endif
                    <tr>
                        <td class="label">Delivery / Shipping</td>
                        <td class="amount">
                            @if($order->shipping_total > 0)
                                {{ $currencySymbol }}{{ number_format($order->shipping_total / 100) }}
                            @else
                                <span style="color: #059669;">Free Delivery</span>
                            @endif
                        </td>
                    </tr>
                    <tr class="total-row">
                        <td class="label" style="font-weight: 800; color: var(--text-main);">Grand Total</td>
                        <td class="amount">{{ $currencySymbol }}{{ number_format($order->grand_total / 100) }}</td>
                    </tr>
                </table>
            </div>
        </section>

        <!-- Footer -->
        <footer class="invoice-footer">
            <div class="footer-terms">
                <strong>Thank you for choosing {{ $siteName }}!</strong><br>
                For customer service or return queries, please contact our hotline at <strong>{{ $sitePhone }}</strong> or email <strong>{{ $siteEmail }}</strong>.<br>
                <span style="color: #94a3b8;">Printed on {{ now()->format('d M, Y \a\t h:i A') }}</span>
            </div>

            <div class="signature-block">
                <div style="height: 35px;"></div>
                <div class="signature-line">Authorized Signatory</div>
                <div style="font-size: 10px; color: var(--text-muted);">{{ $siteName }}</div>
            </div>
        </footer>

    </div>

    <script>
        // If URL has ?print=1, open browser print dialog immediately
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('print') === '1') {
            window.addEventListener('load', () => {
                setTimeout(() => window.print(), 400);
            });
        }
    </script>
</body>
</html>
