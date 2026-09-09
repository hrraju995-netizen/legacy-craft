<?php

namespace App\Filament\Resources\Articles\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

class ArticlesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('image')
                    ->label('Cover')
                    ->circular()
                    ->defaultImageUrl('https://images.unsplash.com/photo-1513694203232-719a280e022f?w=80&h=80&fit=crop'),

                TextColumn::make('title')
                    ->label('Article Title')
                    ->searchable()
                    ->sortable()
                    ->weight('bold')
                    ->limit(45)
                    ->description(fn ($record) => $record->bangla_title ?: $record->slug),

                TextColumn::make('category')
                    ->label('Category')
                    ->badge()
                    ->color('primary')
                    ->sortable()
                    ->searchable(),

                TextColumn::make('author_name')
                    ->label('Author')
                    ->sortable()
                    ->toggleable(),

                IconColumn::make('is_featured')
                    ->label('Featured')
                    ->boolean()
                    ->sortable(),

                IconColumn::make('is_published')
                    ->label('Published')
                    ->boolean()
                    ->sortable(),

                TextColumn::make('published_at')
                    ->label('Publish Date')
                    ->dateTime('M d, Y')
                    ->sortable(),
            ])
            ->filters([
                SelectFilter::make('category')
                    ->options([
                        'Kids Room' => 'Kids Room',
                        'Kitchen Furniture' => 'Kitchen Furniture',
                        'Storage & Shelves' => 'Storage & Shelves',
                        'Bedroom Design' => 'Bedroom Design',
                        'Office Furniture' => 'Office Furniture',
                        'Living Room' => 'Living Room',
                        'Interior Trends' => 'Interior Trends',
                    ]),

                TernaryFilter::make('is_published')
                    ->label('Publication Status')
                    ->placeholder('All Articles')
                    ->trueLabel('Published Only')
                    ->falseLabel('Drafts Only'),
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('published_at', 'desc');
    }
}
