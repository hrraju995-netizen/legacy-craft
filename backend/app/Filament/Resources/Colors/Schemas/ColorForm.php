<?php

namespace App\Filament\Resources\Colors\Schemas;

use App\Models\Color;
use Filament\Forms\Components\ColorPicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class ColorForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->label('Color Name')
                    ->placeholder('e.g. Royal Blue / Walnut Brown')
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
                    ->unique(Color::class, 'slug', ignoreRecord: true)
                    ->helperText('Unique URL-friendly key, e.g. royal-blue'),
                ColorPicker::make('hex')
                    ->label('Color Preview (Hex)')
                    ->required(),
                FileUpload::make('swatch_image')
                    ->label('Swatch Image (optional)')
                    ->image()
                    ->disk('public')
                    ->directory('colors')
                    ->visibility('public'),
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
