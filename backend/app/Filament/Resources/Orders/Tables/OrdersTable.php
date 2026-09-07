<?php

namespace App\Filament\Resources\Orders\Tables;

use App\Models\Courier;
use App\Models\Order;
use App\Services\Courier\CourierManager;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Notifications\Notification;
use Filament\Tables\Columns\BadgeColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Collection;

class OrdersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->columns([
                TextColumn::make('order_number')->label('Order #')
                    ->searchable()->copyable()->weight('bold'),

                TextColumn::make('customer_name')->searchable()
                    ->description(fn (Order $r) => $r->customer_phone),

                BadgeColumn::make('status')
                    ->formatStateUsing(fn ($state) => Order::STATUSES[$state] ?? $state)
                    ->colors([
                        'warning' => ['pending', 'processing', 'ready_to_ship'],
                        'info' => ['confirmed', 'shipped'],
                        'success' => 'delivered',
                        'danger' => ['cancelled', 'returned', 'refunded'],
                    ]),

                BadgeColumn::make('payment_status')->label('Payment')
                    ->colors(['danger' => 'unpaid', 'success' => 'paid', 'warning' => 'partially_paid']),

                // Money lives in paisa; show taka.
                TextColumn::make('grand_total')->label('Total')
                    ->formatStateUsing(fn ($state) => '৳'.number_format($state / 100))
                    ->sortable(),

                TextColumn::make('consignments.tracking_code')->label('Tracking')
                    ->placeholder('—')->copyable(),

                TextColumn::make('created_at')->label('Placed')
                    ->dateTime('d M Y, h:i A')->sortable(),
            ])
            ->filters([
                SelectFilter::make('status')->options(Order::STATUSES)->multiple(),
                SelectFilter::make('payment_status')->options([
                    'unpaid' => 'Unpaid', 'paid' => 'Paid', 'refunded' => 'Refunded',
                ]),
            ])
            ->recordActions([
                ViewAction::make(),

                Action::make('invoice')
                    ->label('PDF Invoice')
                    ->icon('heroicon-o-document-text')
                    ->color('success')
                    ->url(fn (Order $record) => route('admin.orders.invoice', $record))
                    ->openUrlInNewTab(),

                EditAction::make(),

                // Change status without leaving the list, keeping the audit trail.
                Action::make('updateStatus')
                    ->label('Status')
                    ->icon('heroicon-o-arrow-path')
                    ->schema([
                        Select::make('status')->options(Order::STATUSES)->required(),
                        Textarea::make('comment')->rows(2),
                    ])
                    ->action(fn (Order $record, array $data) => $record->changeStatus(
                        $data['status'], $data['comment'] ?? null
                    ))
                    ->successNotificationTitle('Order status updated'),

                // Hand the parcel to Steadfast/Pathao.
                Action::make('sendToCourier')
                    ->label('Send to Courier')
                    ->icon('heroicon-o-truck')
                    ->color('info')
                    ->visible(fn (Order $record) => $record->consignments()->doesntExist()
                        && ! in_array($record->status, ['cancelled', 'delivered', 'returned'], true))
                    ->schema([
                        Select::make('courier_id')
                            ->label('Courier')
                            ->options(Courier::active()->pluck('name', 'id'))
                            ->default(fn () => Courier::active()->where('is_default', true)->value('id'))
                            ->required(),
                        Textarea::make('note')->label('Delivery note')->rows(2),
                    ])
                    ->action(function (Order $record, array $data) {
                        try {
                            $courier = Courier::findOrFail($data['courier_id']);
                            $consignment = app(CourierManager::class)
                                ->driver($courier)
                                ->createConsignment($record, ['note' => $data['note'] ?? null]);

                            Notification::make()->success()
                                ->title('Sent to '.$courier->name)
                                ->body('Tracking: '.$consignment->tracking_code)
                                ->send();
                        } catch (\Throwable $e) {
                            Notification::make()->danger()
                                ->title('Courier request failed')
                                ->body($e->getMessage())
                                ->send();
                        }
                    }),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    \Filament\Actions\BulkAction::make('markConfirmed')
                        ->label('Mark confirmed')
                        ->icon('heroicon-o-check')
                        ->action(fn (Collection $records) => $records->each(
                            fn (Order $o) => $o->changeStatus('confirmed', 'Bulk confirmed')
                        ))
                        ->deselectRecordsAfterCompletion(),
                ]),
            ]);
    }
}
