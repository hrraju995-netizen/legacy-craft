<?php

namespace App\Filament\Resources\Partners\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class PartnerForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Partner Information')
                    ->schema([
                        TextInput::make('name')
                            ->label('Company / Brand Name')
                            ->required()
                            ->placeholder('e.g. Prothom Alo, City Bank, Pizza Hut'),

                        TextInput::make('website_url')
                            ->label('Website Link (Optional)')
                            ->url()
                            ->placeholder('https://...'),

                        FileUpload::make('logo')
                            ->label('Brand Logo')
                            ->image()
                            ->directory('partners')
                            ->disk('public')
                            ->imagePreviewHeight('80')
                            ->helperText('Transparent PNG, WebP, or SVG recommended.')
                            ->columnSpanFull(),

                        TextInput::make('position')
                            ->label('Display Order')
                            ->numeric()
                            ->default(0)
                            ->helperText('Lower numbers appear first (e.g. 1, 2, 3...)'),

                        Toggle::make('is_active')
                            ->label('Active (Display on Homepage)')
                            ->default(true),

                        Textarea::make('svg_logo')
                            ->label('Custom SVG Code (Optional Inline SVG)')
                            ->rows(3)
                            ->columnSpanFull()
                            ->helperText('You can also paste raw <svg>...</svg> code here.'),
                    ])
                    ->columns(2),
            ]);
    }
}
