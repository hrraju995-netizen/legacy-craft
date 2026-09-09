<?php

namespace App\Filament\Resources\Banners\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\BadgeColumn;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class BannersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('image')
                    ->label('Image')
                    ->state(fn ($record) => \App\Models\Product::resolveImageUrl($record->image))
                    ->height(48)
                    ->width(75)
                    ->extraImgAttributes(['style' => 'object-fit: cover; border-radius: 6px;']),

                BadgeColumn::make('placement')
                    ->label('Placement')
                    ->formatStateUsing(fn ($state) => match ($state) {
                        'hero_side_top' => 'Side Banner (Top)',
                        'hero_side_bottom' => 'Side Banner (Bottom)',
                        'meeting_banner' => 'Mid-Page Promo',
                        default => $state,
                    })
                    ->colors([
                        'primary' => 'hero_side_top',
                        'success' => 'hero_side_bottom',
                        'warning' => 'meeting_banner',
                    ]),

                TextColumn::make('title')
                    ->label('Title')
                    ->searchable()
                    ->weight('bold')
                    ->description(fn ($record) => $record->subtitle),

                TextColumn::make('badge')
                    ->label('Badge')
                    ->badge()
                    ->color('warning'),

                TextColumn::make('link')
                    ->label('Target Link')
                    ->searchable()
                    ->copyable()
                    ->fontFamily('mono')
                    ->color('primary'),

                TextColumn::make('position')
                    ->label('Order')
                    ->numeric()
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
