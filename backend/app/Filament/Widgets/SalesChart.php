<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Carbon;

class SalesChart extends ChartWidget
{
    protected ?string $heading = 'Sales Analytics & Revenue Trend';

    protected static ?int $sort = 2;

    protected int|string|array $columnSpan = 'full';

    protected function getData(): array
    {
        $days = 14;
        $labels = [];
        $revenueData = [];
        $ordersCountData = [];

        for ($i = $days - 1; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $labels[] = $date->format('d M');

            $sum = Order::whereDate('created_at', $date->toDateString())
                ->whereNotIn('status', ['cancelled', 'returned', 'refunded'])
                ->sum('grand_total');

            $count = Order::whereDate('created_at', $date->toDateString())->count();

            $revenueData[] = (int) round($sum / 100);
            $ordersCountData[] = $count;
        }

        return [
            'datasets' => [
                [
                    'label' => 'Revenue (৳)',
                    'data' => $revenueData,
                    'fill' => 'start',
                    'borderColor' => '#9f582c',
                    'backgroundColor' => 'rgba(159, 88, 44, 0.1)',
                    'tension' => 0.35,
                ],
                [
                    'label' => 'Orders Count',
                    'data' => $ordersCountData,
                    'borderColor' => '#10b981',
                    'backgroundColor' => 'rgba(16, 185, 129, 0.1)',
                    'tension' => 0.35,
                ],
            ],
            'labels' => $labels,
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
}
