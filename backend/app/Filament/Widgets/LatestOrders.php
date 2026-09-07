<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use Filament\Actions\Action;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class LatestOrders extends BaseWidget
{
    protected static ?int $sort = 5;

    protected int|string|array $columnSpan = 'full';

    protected static ?string $heading = 'Recent Orders';

    public function table(Table $table): Table
    {
        return $table
            ->query(Order::query()->latest()->limit(6))
            ->paginated(false)
            ->columns([
                TextColumn::make('order_number')
                    ->label('Order #')
                    ->weight('bold')
                    ->copyable()
                    ->description(fn (Order $r) => $r->customer_phone),

                TextColumn::make('customer_name')
                    ->label('Customer')
                    ->weight('semibold'),

                TextColumn::make('status')
                    ->badge()
                    ->formatStateUsing(fn ($state) => Order::STATUSES[$state] ?? $state)
                    ->color(fn ($state) => match ($state) {
                        'delivered' => 'success',
                        'cancelled', 'returned', 'refunded' => 'danger',
                        'shipped', 'confirmed' => 'info',
                        default => 'warning',
                    }),

                TextColumn::make('payment_status')
                    ->label('Payment')
                    ->badge()
                    ->color(fn ($state) => match ($state) {
                        'paid' => 'success',
                        'partially_paid' => 'warning',
                        default => 'danger',
                    }),

                TextColumn::make('grand_total')
                    ->label('Total')
                    ->weight('bold')
                    ->color('primary')
                    ->formatStateUsing(fn ($state) => '৳' . number_format($state / 100)),

                TextColumn::make('created_at')
                    ->label('Placed')
                    ->since(),
            ])
            ->recordActions([
                Action::make('open')
                    ->label('View')
                    ->icon('heroicon-o-eye')
                    ->url(fn (Order $record) => route(
                        'filament.admin.resources.orders.edit',
                        ['record' => $record->getKey()]
                    )),

                Action::make('invoice')
                    ->label('PDF')
                    ->icon('heroicon-o-arrow-down-tray')
                    ->color('success')
                    ->url(fn (Order $record) => route('admin.orders.invoice', $record))
                    ->openUrlInNewTab(),
            ])
            ->emptyStateHeading('No orders yet')
            ->emptyStateDescription('Orders placed on the storefront will appear here.');
    }
}
