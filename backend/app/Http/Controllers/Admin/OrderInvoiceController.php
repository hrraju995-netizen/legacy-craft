<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\Setting;
use Illuminate\Http\Request;

class OrderInvoiceController extends Controller
{
    /**
     * Display a clean, professional print/PDF invoice for an order.
     */
    public function show(Order $order)
    {
        $order->load(['items.product', 'customer', 'shippingZone']);

        // Site details & default logo from settings
        $rawLogo = Setting::get('logo');
        $siteLogo = $rawLogo ? Product::resolveImageUrl($rawLogo) : null;
        if (! $siteLogo) {
            $siteLogo = url('/main-logo.png');
        }

        $siteName = Setting::get('site_name', 'Legacy Craft Studio');
        $siteTagline = Setting::get('site_tagline', 'Handcrafted Furniture in Bangladesh');
        $sitePhone = Setting::get('footer_phone', Setting::get('topbar_phone', '+8801897711118'));
        $siteEmail = Setting::get('footer_email', 'support@legacycraftstudio.com');
        $siteAddress = Setting::get('footer_address', 'Shop No: 33, Round Glass Bay, Level 5, Mirpur DOHS Shopping Complex, Dhaka');
        $currencySymbol = Setting::get('currency_symbol', '৳');

        // Status configuration for styling
        $statusConfig = match ($order->status) {
            'confirmed' => [
                'label' => 'CONFIRMED',
                'bg' => '#dbeafe',
                'color' => '#1e40af',
                'border' => '#93c5fd',
            ],
            'processing' => [
                'label' => 'PROCESSING',
                'bg' => '#e0e7ff',
                'color' => '#3730a3',
                'border' => '#a5b4fc',
            ],
            'ready_to_ship' => [
                'label' => 'READY TO SHIP',
                'bg' => '#ccfbf1',
                'color' => '#115e59',
                'border' => '#5eead4',
            ],
            'shipped' => [
                'label' => 'SHIPPED',
                'bg' => '#f3e8ff',
                'color' => '#6b21a8',
                'border' => '#d8b4fe',
            ],
            'delivered' => [
                'label' => 'DELIVERED',
                'bg' => '#d1fae5',
                'color' => '#065f46',
                'border' => '#6ee7b7',
            ],
            'cancelled' => [
                'label' => 'CANCELLED',
                'bg' => '#fee2e2',
                'color' => '#991b1b',
                'border' => '#fca5a5',
            ],
            'returned' => [
                'label' => 'RETURNED',
                'bg' => '#f1f5f9',
                'color' => '#475569',
                'border' => '#cbd5e1',
            ],
            'refunded' => [
                'label' => 'REFUNDED',
                'bg' => '#ffe4e6',
                'color' => '#9f1239',
                'border' => '#fda4af',
            ],
            default => [
                'label' => 'PENDING',
                'bg' => '#fef3c7',
                'color' => '#92400e',
                'border' => '#fcd34d',
            ],
        };

        return view('admin.orders.invoice', [
            'order' => $order,
            'siteLogo' => $siteLogo,
            'siteName' => $siteName,
            'siteTagline' => $siteTagline,
            'sitePhone' => $sitePhone,
            'siteEmail' => $siteEmail,
            'siteAddress' => $siteAddress,
            'currencySymbol' => $currencySymbol,
            'statusConfig' => $statusConfig,
        ]);
    }

    /**
     * Download invoice directly as PDF.
     */
    public function download($orderNumber)
    {
        $order = Order::where('order_number', $orderNumber)
            ->orWhere('id', $orderNumber)
            ->firstOrFail();

        $order->load(['items.product', 'customer', 'shippingZone']);

        $rawLogo = Setting::get('logo');
        $siteLogo = $rawLogo ? Product::resolveImageUrl($rawLogo) : null;
        if (! $siteLogo) {
            $siteLogo = url('/main-logo.png');
        }

        $siteName = Setting::get('site_name', 'Legacy Craft Studio');
        $siteTagline = Setting::get('site_tagline', 'Handcrafted Furniture in Bangladesh');
        $sitePhone = Setting::get('footer_phone', Setting::get('topbar_phone', '+8801897711118'));
        $siteEmail = Setting::get('footer_email', 'support@legacycraftstudio.com');
        $siteAddress = Setting::get('footer_address', 'Shop No: 33, Round Glass Bay, Level 5, Mirpur DOHS Shopping Complex, Dhaka');
        $currencySymbol = Setting::get('currency_symbol', '৳');

        $statusConfig = match ($order->status) {
            'confirmed' => ['label' => 'CONFIRMED', 'bg' => '#dbeafe', 'color' => '#1e40af', 'border' => '#93c5fd'],
            'processing' => ['label' => 'PROCESSING', 'bg' => '#e0e7ff', 'color' => '#3730a3', 'border' => '#a5b4fc'],
            'ready_to_ship' => ['label' => 'READY TO SHIP', 'bg' => '#ccfbf1', 'color' => '#115e59', 'border' => '#5eead4'],
            'shipped' => ['label' => 'SHIPPED', 'bg' => '#f3e8ff', 'color' => '#6b21a8', 'border' => '#d8b4fe'],
            'delivered' => ['label' => 'DELIVERED', 'bg' => '#d1fae5', 'color' => '#065f46', 'border' => '#6ee7b7'],
            'cancelled' => ['label' => 'CANCELLED', 'bg' => '#fee2e2', 'color' => '#991b1b', 'border' => '#fca5a5'],
            'returned' => ['label' => 'RETURNED', 'bg' => '#f1f5f9', 'color' => '#475569', 'border' => '#cbd5e1'],
            'refunded' => ['label' => 'REFUNDED', 'bg' => '#ffe4e6', 'color' => '#9f1239', 'border' => '#fda4af'],
            default => ['label' => 'PENDING', 'bg' => '#fef3c7', 'color' => '#92400e', 'border' => '#fcd34d'],
        };

        $data = [
            'order' => $order,
            'siteLogo' => $siteLogo,
            'siteName' => $siteName,
            'siteTagline' => $siteTagline,
            'sitePhone' => $sitePhone,
            'siteEmail' => $siteEmail,
            'siteAddress' => $siteAddress,
            'currencySymbol' => $currencySymbol,
            'statusConfig' => $statusConfig,
        ];

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('admin.orders.invoice_pdf', $data);
        return $pdf->download("invoice-{$order->order_number}.pdf");
    }
}
