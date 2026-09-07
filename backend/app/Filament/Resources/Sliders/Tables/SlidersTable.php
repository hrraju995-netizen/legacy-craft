<?php

namespace App\Filament\Resources\Sliders\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class SlidersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('position')
            ->columns([
                ImageColumn::make('image')
                    ->label('Image')
                    ->disk('public')
                    ->height(48)
                    ->width(90)
                    ->extraImgAttributes(['style' => 'object-fit: cover; border-radius: 6px;']),

                TextColumn::make('title')
                    ->label('Title')
                    ->searchable()
                    ->weight('bold')
                    ->description(fn ($record) => $record->subtitle),

                TextColumn::make('badge')
                    ->label('Badge')
                    ->badge()
                    ->color('warning'),

                TextColumn::make('button_text')
                    ->label('Button')
                    ->badge()
                    ->color('gray'),

                TextColumn::make('link')
                    ->label('Link')
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
