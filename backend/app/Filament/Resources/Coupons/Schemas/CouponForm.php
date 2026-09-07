<?php

namespace App\Filament\Resources\Coupons\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class CouponForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                // 1. Basic Coupon Information
                Section::make('Basic Information')
                    ->description('Set coupon code and discount type.')
                    ->schema([
                        TextInput::make('code')
                            ->label('Coupon Code')
                            ->placeholder('e.g. EID2026')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->extraInputAttributes(['style' => 'text-transform: uppercase; font-weight: bold;'])
                            ->dehydrateStateUsing(fn ($state) => strtoupper(trim($state)))
                            ->helperText('Code customers enter at checkout (e.g. SAVE10, SUMMER)'),

                        Select::make('type')
                            ->label('Discount Type')
                            ->options([
                                'percentage' => 'Percentage Discount (%) — e.g. 10%, 15%',
                                'fixed' => 'Fixed Amount Discount (৳) — e.g. ৳100, ৳500',
                                'free_shipping' => 'Free Shipping',
                            ])
                            ->default('percentage')
                            ->required()
                            ->reactive()
                            ->helperText('Select how discount should be calculated'),

                        TextInput::make('value')
                            ->label(fn ($get) => match ($get('type')) {
                                'fixed' => 'Discount Amount (৳)',
                                'free_shipping' => 'Value (Not Applicable)',
                                default => 'Discount Percentage (%)',
                            })
                            ->prefix(fn ($get) => $get('type') === 'fixed' ? '৳' : null)
                            ->suffix(fn ($get) => $get('type') === 'percentage' ? '%' : null)
                            ->numeric()
                            ->placeholder('10')
                            ->required(fn ($get) => $get('type') !== 'free_shipping')
                            ->disabled(fn ($get) => $get('type') === 'free_shipping')
                            ->formatStateUsing(function ($state, $get) {
                                if ($get('type') === 'fixed' && $state !== null) {
                                    return $state / 100;
                                }
                                return $state ?? 0;
                            })
                            ->dehydrateStateUsing(function ($state, $get) {
                                if ($get('type') === 'free_shipping') {
                                    return 0;
                                }
                                if ($get('type') === 'fixed') {
                                    return (int) round(((float) $state) * 100);
                                }
                                return (int) $state;
                            })
                            ->helperText(fn ($get) => match ($get('type')) {
                                'fixed' => 'Fixed amount deducted from subtotal',
                                'free_shipping' => 'No value needed for free shipping',
                                default => 'Percentage discount applied to subtotal',
                            }),
                    ])->columns(3),

                // 2. Rules & Limitations
                Section::make('Rules & Limits')
                    ->description('Set minimum order requirement and usage limits (optional).')
                    ->schema([
                        TextInput::make('min_order_total')
                            ->label('Minimum Order Amount (৳)')
                            ->prefix('৳')
                            ->numeric()
                            ->placeholder('e.g. 1000')
                            ->formatStateUsing(fn ($state) => $state !== null ? $state / 100 : null)
                            ->dehydrateStateUsing(fn ($state) => $state !== null && $state !== '' ? (int) round(((float) $state) * 100) : null)
                            ->helperText('Minimum subtotal needed to use this coupon (leave empty for any amount)'),

                        TextInput::make('max_discount')
                            ->label('Maximum Discount Limit (৳)')
                            ->prefix('৳')
                            ->numeric()
                            ->placeholder('e.g. 500')
                            ->visible(fn ($get) => $get('type') === 'percentage')
                            ->formatStateUsing(fn ($state) => $state !== null ? $state / 100 : null)
                            ->dehydrateStateUsing(fn ($state) => $state !== null && $state !== '' ? (int) round(((float) $state) * 100) : null)
                            ->helperText('Cap on the maximum discount for percentage coupons'),

                        TextInput::make('usage_limit')
                            ->label('Total Usage Limit')
                            ->numeric()
                            ->placeholder('Unlimited')
                            ->helperText('Total times this coupon can be used across all customers (empty for unlimited)'),

                        TextInput::make('usage_limit_per_customer')
                            ->label('Per Customer Limit')
                            ->numeric()
                            ->default(1)
                            ->helperText('Maximum times a single customer can use this coupon (default: 1)'),
                    ])->columns(2),

                // 3. Validity & Status
                Section::make('Validity & Status')
                    ->schema([
                        DateTimePicker::make('starts_at')
                            ->label('Start Date & Time')
                            ->helperText('When coupon becomes valid (empty to start immediately)'),

                        DateTimePicker::make('expires_at')
                            ->label('Expiry Date & Time')
                            ->helperText('When coupon expires (empty for no expiry)'),

                        Toggle::make('is_active')
                            ->label('Active')
                            ->default(true)
                            ->helperText('Switch to immediately enable or disable this coupon'),
                    ])->columns(3),
            ]);
    }
}
