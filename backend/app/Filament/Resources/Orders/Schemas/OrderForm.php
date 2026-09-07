<?php

namespace App\Filament\Resources\Orders\Schemas;

use App\Models\Order;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Actions;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\View;
use Filament\Schemas\Schema;

class OrderForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                // Quick Action Bar: Print / PDF Invoice
                Actions::make([
                    \Filament\Actions\Action::make('printInvoice')
                        ->label('Print / Download PDF Invoice')
                        ->icon('heroicon-o-printer')
                        ->color('success')
                        ->url(fn (?Order $record) => $record ? route('admin.orders.invoice', $record) : null)
                        ->openUrlInNewTab()
                        ->visible(fn (?Order $record) => $record !== null),
                ])->columnSpanFull(),

                // 1. Order Information
                Section::make('Order Overview')
                    ->description('Key identifiers and lifecycle status.')
                    ->schema([
                        TextInput::make('order_number')
                            ->label('Order Number')
                            ->disabled()
                            ->required(),

                        Select::make('status')
                            ->label('Order Status')
                            ->options(Order::STATUSES)
                            ->required(),

                        Select::make('payment_status')
                            ->label('Payment Status')
                            ->options([
                                'unpaid' => 'Unpaid',
                                'paid' => 'Paid',
                                'partially_paid' => 'Partially Paid',
                                'refunded' => 'Refunded',
                            ])
                            ->required(),

                        TextInput::make('payment_method')
                            ->label('Payment Method')
                            ->disabled(),

                        DateTimePicker::make('created_at')
                            ->label('Date Placed')
                            ->disabled(),
                    ])->columns(3),

                // 2. Ordered Products (Items)
                Section::make('Ordered Products')
                    ->description('Items purchased in this order including options, unit prices, and quantities.')
                    ->schema([
                        View::make('filament.resources.orders.order-items')
                            ->columnSpanFull(),
                    ])->columnSpanFull(),

                // 3. Customer & Delivery Information
                Section::make('Customer & Shipping Details')
                    ->schema([
                        TextInput::make('customer_name')
                            ->label('Customer Name')
                            ->required(),

                        TextInput::make('customer_phone')
                            ->label('Phone Number')
                            ->tel()
                            ->required(),

                        TextInput::make('customer_email')
                            ->label('Email Address')
                            ->email(),

                        TextInput::make('shipping_city')
                            ->label('Delivery City'),

                        Textarea::make('shipping_address')
                            ->label('Delivery Address')
                            ->rows(2)
                            ->required()
                            ->columnSpanFull(),

                        Textarea::make('order_note')
                            ->label('Customer Order Note')
                            ->rows(2)
                            ->disabled()
                            ->columnSpanFull(),

                        Textarea::make('admin_note')
                            ->label('Internal Admin Note')
                            ->rows(2)
                            ->columnSpanFull(),
                    ])->columns(2),

                // 4. Financial Breakdown
                Section::make('Financial Totals')
                    ->schema([
                        TextInput::make('subtotal')
                            ->label('Subtotal (৳)')
                            ->numeric()
                            ->formatStateUsing(fn ($state) => $state !== null ? $state / 100 : null)
                            ->dehydrateStateUsing(fn ($state) => (int) round($state * 100)),

                        TextInput::make('shipping_total')
                            ->label('Shipping Cost (৳)')
                            ->numeric()
                            ->formatStateUsing(fn ($state) => $state !== null ? $state / 100 : null)
                            ->dehydrateStateUsing(fn ($state) => (int) round($state * 100)),

                        TextInput::make('discount_total')
                            ->label('Discount (৳)')
                            ->numeric()
                            ->formatStateUsing(fn ($state) => $state !== null ? $state / 100 : null)
                            ->dehydrateStateUsing(fn ($state) => (int) round($state * 100)),

                        TextInput::make('grand_total')
                            ->label('Grand Total (৳)')
                            ->numeric()
                            ->disabled()
                            ->formatStateUsing(fn ($state) => $state !== null ? $state / 100 : null)
                            ->dehydrateStateUsing(fn ($state) => (int) round($state * 100)),
                    ])->columns(4),
            ]);
    }
}
