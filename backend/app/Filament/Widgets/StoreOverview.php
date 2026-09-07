<?php

namespace App\Filament\Widgets;

use App\Models\Customer;
use App\Models\Order;
use App\Models\Product;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StoreOverview extends BaseWidget
{
    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        // 1. Total & Monthly Revenue
        $revenue = Order::whereNotIn('status', ['cancelled', 'returned', 'refunded'])
            ->sum('grand_total');

        $thisMonthRevenue = Order::whereNotIn('status', ['cancelled', 'returned', 'refunded'])
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->sum('grand_total');

        // Sparkline for 7 days revenue
        $revenueTrend = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $val = Order::whereDate('created_at', $date)
                ->whereNotIn('status', ['cancelled', 'returned', 'refunded'])
                ->sum('grand_total');
            $revenueTrend[] = (int) round($val / 100);
        }

        // 2. Orders count & Pending
        $totalOrders = Order::count();
        $pendingOrders = Order::whereIn('status', ['pending', 'confirmed', 'processing'])->count();

        // Orders 7 days trend
        $ordersTrend = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $ordersTrend[] = Order::whereDate('created_at', $date)->count();
        }

        // 3. Customers count
        $customersCount = Customer::count();
        $registeredCustomers = Customer::whereNotNull('password')->count();

        // 4. Products & Stock health
        $liveProducts = Product::where('is_active', true)->count();
        $lowStock = Product::query()
            ->where('is_active', true)
            ->where('manage_stock', true)
            ->whereColumn('stock_quantity', '<=', 'low_stock_threshold')
            ->count();

        return [
            Stat::make('Total Revenue', '৳' . number_format($revenue / 100))
                ->description('৳' . number_format($thisMonthRevenue / 100) . ' this month')
                ->descriptionIcon('heroicon-m-arrow-trending-up')
                ->chart($revenueTrend)
                ->color('success'),

            Stat::make('Total Orders', $totalOrders)
                ->description($pendingOrders > 0 ? "{$pendingOrders} need processing" : 'All orders processed')
                ->descriptionIcon('heroicon-m-shopping-cart')
                ->chart($ordersTrend)
                ->color($pendingOrders > 0 ? 'warning' : 'primary'),

            Stat::make('Customers', $customersCount)
                ->description("{$registeredCustomers} registered accounts")
                ->descriptionIcon('heroicon-m-user-group')
                ->chart([3, 5, 8, 12, 15, 18, 24])
                ->color('info'),

            Stat::make('Live Products', $liveProducts)
                ->description($lowStock > 0 ? "{$lowStock} products low in stock" : 'Stock levels healthy')
                ->descriptionIcon($lowStock > 0 ? 'heroicon-m-exclamation-triangle' : 'heroicon-m-check-circle')
                ->color($lowStock > 0 ? 'danger' : 'success'),
        ];
    }
}
