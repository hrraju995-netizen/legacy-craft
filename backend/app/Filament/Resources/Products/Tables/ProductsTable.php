<?php

namespace App\Filament\Resources\Products\Tables;

use App\Models\Product;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\Action;
use Filament\Actions\EditAction;
use Filament\Actions\ForceDeleteBulkAction;
use Filament\Actions\ReplicateAction;
use Filament\Actions\RestoreBulkAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Filters\TrashedFilter;
use Filament\Tables\Table;

class ProductsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('position')
            ->reorderable('position')
            ->columns([
                ImageColumn::make('thumbnail')
                    ->label('')
                    ->square()
                    ->size(48),

                TextColumn::make('name')
                    ->searchable()
                    ->sortable()
                    ->weight('bold')
                    ->description(fn (Product $r) => $r->subcategory)
                    ->wrap(),

                TextColumn::make('category.name')
                    ->label('Category')
                    ->badge()
                    ->sortable(),

                // Stored in paisa.
                TextColumn::make('price')
                    ->label('Price')
                    ->formatStateUsing(fn ($state) => '৳'.number_format($state / 100))
                    ->description(fn (Product $r) => $r->discount_percent > 0
                        ? "-{$r->discount_percent}%"
                        : null)
                    ->sortable(),

                TextColumn::make('stock_quantity')
                    ->label('Stock')
                    ->badge()
                    ->formatStateUsing(fn ($state, Product $r) => $r->manage_stock
                        ? $state
                        : '∞')
                    ->color(fn ($state, Product $r) => match (true) {
                        ! $r->manage_stock => 'gray',
                        $state <= 0 => 'danger',
                        $state <= $r->low_stock_threshold => 'warning',
                        default => 'success',
                    })
                    ->sortable(),

                // Editable straight from the list — no need to open the record.
                ToggleColumn::make('is_active')->label('Live'),
                ToggleColumn::make('is_featured')->label('Featured')->toggleable(),

                IconColumn::make('images_exist')
                    ->label('Photos')
                    ->boolean()
                    ->getStateUsing(fn (Product $r) => $r->images()->exists())
                    ->trueIcon('heroicon-o-photo')
                    ->falseIcon('heroicon-o-exclamation-triangle')
                    ->falseColor('warning')
                    ->tooltip(fn (Product $r) => $r->images()->exists()
                        ? null
                        : 'No image — this product will show a placeholder on the site'),

                TextColumn::make('updated_at')
                    ->dateTime('d M Y')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('category')
                    ->relationship('category', 'name')
                    ->searchable()
                    ->preload(),

                SelectFilter::make('room')
                    ->relationship('room', 'name')
                    ->preload(),

                TernaryFilter::make('is_active')->label('Published'),
                TernaryFilter::make('is_featured')->label('Featured'),

                SelectFilter::make('stock_status')->options([
                    'in_stock' => 'In stock',
                    'out_of_stock' => 'Out of stock',
                    'on_backorder' => 'On backorder',
                ]),

                TrashedFilter::make(),
            ])
            ->recordActions([
                // Opens the live storefront page for this product.
                Action::make('viewOnSite')
                    ->label('View')
                    ->icon('heroicon-o-arrow-top-right-on-square')
                    ->color('gray')
                    ->url(fn (Product $record) => rtrim(config('app.storefront_url'), '/').'/products/'.$record->slug)
                    ->openUrlInNewTab()
                    ->visible(fn (Product $record) => $record->is_active),

                EditAction::make(),
                // Handy for building a colour range from one base product.
                ReplicateAction::make()
                    ->label('Duplicate')
                    ->icon('heroicon-o-document-duplicate')
                    ->beforeReplicaSaved(function (Product $replica) {
                        $replica->name = $replica->name.' (copy)';
                        $replica->slug = $replica->slug.'-copy-'.uniqid();
                        $replica->sku = null;
                        $replica->is_active = false;
                    })
                    ->successNotificationTitle('Product duplicated — it is unpublished until you review it'),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                    ForceDeleteBulkAction::make(),
                    RestoreBulkAction::make(),
                ]),
            ]);
    }
}
