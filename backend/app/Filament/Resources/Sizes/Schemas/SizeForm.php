<?php

namespace App\Filament\Resources\Sizes\Schemas;

use App\Models\Size;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class SizeForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->label('Size Name / Variation')
                    ->placeholder('e.g. King (6\' × 7\'), Single (3\' × 6\'), Medium (M)')
                    ->required()
                    ->live(onBlur: true)
                    ->afterStateUpdated(function ($state, $set, $operation) {
                        if ($operation === 'create') {
                            $set('slug', Str::slug($state));
                        }
                    }),
                TextInput::make('slug')
                    ->label('Slug')
                    ->required()
                    ->unique(Size::class, 'slug', ignoreRecord: true)
                    ->helperText('Unique URL-friendly key, e.g. king-6x7'),
                TextInput::make('dimensions')
                    ->label('Dimensions / Measurements (optional)')
                    ->placeholder('e.g. 6ft × 7ft or 180cm × 200cm')
                    ->helperText('Optional precise physical dimensions for furniture/specifications.'),
                TextInput::make('position')
                    ->label('Display Order')
                    ->required()
                    ->numeric()
                    ->default(0)
                    ->helperText('Lower numbers appear first (0, 1, 2...).'),
                Toggle::make('is_active')
                    ->label('Active / Visible')
                    ->default(true)
                    ->required(),
            ]);
    }
}
