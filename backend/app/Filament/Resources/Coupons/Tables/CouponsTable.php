<?php

namespace App\Filament\Resources\Coupons\Tables;

use App\Models\Coupon;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\BadgeColumn;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class CouponsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('code')
                    ->label('Code')
                    ->searchable()
                    ->copyable()
                    ->weight('bold')
                    ->fontFamily('mono'),

                BadgeColumn::make('type')
                    ->label('Type')
                    ->formatStateUsing(fn ($state) => match ($state) {
                        'percentage' => 'Percentage (%)',
                        'fixed' => 'Fixed (৳)',
                        'free_shipping' => 'Free Shipping',
                        default => $state,
                    })
                    ->colors([
                        'primary' => 'percentage',
                        'success' => 'fixed',
                        'warning' => 'free_shipping',
                    ]),

                TextColumn::make('value')
                    ->label('Benefit')
                    ->formatStateUsing(function ($state, Coupon $record) {
                        if ($record->type === 'percentage') {
                            return $state . '% OFF';
                        }
                        if ($record->type === 'fixed') {
                            return '৳' . number_format($state / 100) . ' OFF';
                        }
                        return 'Free Shipping';
                    })
                    ->weight('bold'),

                TextColumn::make('min_order_total')
                    ->label('Min. Order')
                    ->formatStateUsing(fn ($state) => $state ? '৳' . number_format($state / 100) : 'None'),

                TextColumn::make('usage_summary')
                    ->label('Used')
                    ->getStateUsing(fn (Coupon $record) => $record->usage_limit 
                        ? "{$record->used_count} / {$record->usage_limit}" 
                        : "{$record->used_count} (Unlimited)"
                    ),

                TextColumn::make('expires_at')
                    ->label('Expires')
                    ->dateTime('d M Y, h:i A')
                    ->placeholder('Never')
                    ->sortable(),

                IconColumn::make('is_active')
                    ->label('Active')
                    ->boolean(),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
