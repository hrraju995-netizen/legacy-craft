<?php

namespace App\Filament\Resources\Partners\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Table;

class PartnersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('logo')
                    ->label('Logo')
                    ->disk('public')
                    ->height(40)
                    ->width(80)
                    ->extraImgAttributes(['style' => 'object-fit: contain;']),

                TextColumn::make('name')
                    ->label('Brand / Company')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),

                TextColumn::make('website_url')
                    ->label('Website')
                    ->limit(30)
                    ->placeholder('—'),

                TextColumn::make('position')
                    ->label('Order')
                    ->sortable(),

                ToggleColumn::make('is_active')
                    ->label('Active'),
            ])
            ->defaultSort('position', 'asc')
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->bulkActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
