<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use Filament\Widgets\ChartWidget;

class OrderStatusChart extends ChartWidget
{
    protected ?string $heading = 'Order Status Distribution';

    protected static ?int $sort = 3;

    protected int|string|array $columnSpan = [
        'md' => 1,
        'xl' => 1,
    ];

    protected function getData(): array
    {
        $statuses = [
            'pending' => 'Pending',
            'confirmed' => 'Confirmed',
            'processing' => 'Processing',
            'shipped' => 'Shipped',
            'delivered' => 'Delivered',
            'cancelled' => 'Cancelled',
        ];

        $counts = [];
        $labels = [];
        foreach ($statuses as $key => $label) {
            $count = Order::where('status', $key)->count();
            if ($count > 0 || in_array($key, ['pending', 'confirmed', 'delivered'])) {
                $labels[] = $label;
                $counts[] = $count;
            }
        }

        return [
            'datasets' => [
                [
                    'label' => 'Orders',
                    'data' => $counts,
                    'backgroundColor' => [
                        '#f59e0b', // pending - amber
                        '#3b82f6', // confirmed - blue
                        '#6366f1', // processing - indigo
                        '#8b5cf6', // shipped - purple
                        '#10b981', // delivered - green
                        '#ef4444', // cancelled - red
                    ],
                ],
            ],
            'labels' => $labels,
        ];
    }

    protected function getType(): string
    {
        return 'doughnut';
    }
}
