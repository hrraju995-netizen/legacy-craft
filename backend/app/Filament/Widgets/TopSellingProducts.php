<?php

namespace App\Filament\Widgets;

use App\Models\Product;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class TopSellingProducts extends BaseWidget
{
    protected static ?int $sort = 4;

    protected int|string|array $columnSpan = [
        'md' => 1,
        'xl' => 1,
    ];

    protected static ?string $heading = 'Featured & Popular Products';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                Product::query()
                    ->where('is_active', true)
                    ->orderByDesc('is_featured')
                    ->latest()
                    ->limit(5)
            )
            ->paginated(false)
            ->columns([
                ImageColumn::make('thumbnail')
                    ->label('')
                    ->square()
                    ->size(40),

                TextColumn::make('name')
                    ->label('Product')
                    ->weight('bold')
                    ->description(fn (Product $p) => $p->category?->name)
                    ->wrap(),

                TextColumn::make('price')
                    ->label('Price')
                    ->formatStateUsing(fn ($state) => '৳' . number_format($state / 100))
                    ->weight('semibold')
                    ->color('primary'),

                TextColumn::make('stock_quantity')
                    ->label('Stock')
                    ->badge()
                    ->formatStateUsing(fn ($state, Product $p) => $p->manage_stock ? $state : 'In Stock')
                    ->color(fn ($state, Product $p) => match (true) {
                        !$p->manage_stock => 'gray',
                        $state <= 0 => 'danger',
                        $state <= $p->low_stock_threshold => 'warning',
                        default => 'success',
                    }),
            ]);
    }
}
