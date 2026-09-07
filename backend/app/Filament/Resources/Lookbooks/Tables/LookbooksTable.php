<?php

namespace App\Filament\Resources\Lookbooks\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Table;

class LookbooksTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('position')
            ->reorderable('position')
            ->columns([
                ImageColumn::make('image')
                    ->label('Photo')
                    ->disk('public')
                    ->height(56)
                    ->width(75)
                    ->extraImgAttributes(['style' => 'object-fit: cover; border-radius: 8px;']),

                TextColumn::make('title')
                    ->label('Scene Title')
                    ->searchable()
                    ->weight('bold'),

                TextColumn::make('hotspots_count')
                    ->counts('hotspots')
                    ->label('Hotspots')
                    ->badge()
                    ->suffix(' Products')
                    ->color(fn ($state) => $state > 0 ? 'success' : 'warning'),

                TextColumn::make('hotspots.product.name')
                    ->label('Tagged Products')
                    ->badge()
                    ->color('gray')
                    ->limitList(3),

                ToggleColumn::make('is_active')
                    ->label('Live on Home'),
            ])
            ->recordActions([EditAction::make()])
            ->toolbarActions([
                BulkActionGroup::make([DeleteBulkAction::make()]),
            ])
            ->emptyStateHeading('No Lookbooks Yet')
            ->emptyStateDescription('Upload a room photo and add interactive product hotspots on it.');
    }
}
