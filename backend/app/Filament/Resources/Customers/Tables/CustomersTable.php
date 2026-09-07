<?php

namespace App\Filament\Resources\Customers\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Table;

class CustomersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->columns([
                TextColumn::make('name')
                    ->label('Customer Name')
                    ->searchable()
                    ->weight('bold'),

                TextColumn::make('phone')
                    ->label('Phone Number')
                    ->searchable()
                    ->copyable()
                    ->icon('heroicon-o-phone'),

                TextColumn::make('email')
                    ->label('Email')
                    ->searchable()
                    ->default('—'),

                TextColumn::make('account_type')
                    ->label('Account Status')
                    ->state(fn ($record) => filled($record->password) ? 'Registered' : 'Guest')
                    ->badge()
                    ->color(fn ($state) => $state === 'Registered' ? 'success' : 'gray'),

                TextColumn::make('orders_count')
                    ->counts('orders')
                    ->label('Total Orders')
                    ->badge()
                    ->color(fn ($state) => $state > 0 ? 'info' : 'gray')
                    ->suffix(' Orders'),

                ToggleColumn::make('is_active')
                    ->label('Active'),

                TextColumn::make('created_at')
                    ->label('Joined Date')
                    ->dateTime('M d, Y h:i A')
                    ->sortable(),
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ])
            ->emptyStateHeading('No Customers Found')
            ->emptyStateDescription('Customers will appear here automatically after signing up or placing orders.');
    }
}
