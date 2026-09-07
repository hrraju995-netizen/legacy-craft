<?php

namespace App\Filament\Resources\Lookbooks\Schemas;

use App\Models\Product;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\HtmlString;
use Illuminate\Support\Str;

/**
 * "Get the look" scene builder: one room photo plus clickable hotspots, each
 * tied to a real product so the label, price and link stay correct forever.
 */
class LookbookForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Scene & Photo')
                ->description('Upload an interior or room photo and give it a title.')
                ->schema([
                    TextInput::make('title')
                        ->label('Scene Title')
                        ->placeholder('e.g. Modern Living Room Setup / Executive Office')
                        ->required()
                        ->live(onBlur: true)
                        ->afterStateUpdated(function ($state, $set, $operation) {
                            if ($operation === 'create' || blank($set('slug', null))) {
                                $set('slug', Str::slug($state));
                            }
                        })
                        ->helperText('This title will be displayed below the card on the homepage.'),

                    TextInput::make('slug')
                        ->label('Slug / URL Identifier')
                        ->helperText('Automatically generated from title.')
                        ->unique(ignoreRecord: true),

                    FileUpload::make('image')
                        ->label('Room Photo')
                        ->image()
                        ->disk('public')
                        ->directory('lookbooks')
                        ->visibility('public')
                        ->required()
                        ->helperText('Upload high-resolution image (1200×900 recommended).')
                        ->columnSpanFull(),

                    TextInput::make('position')
                        ->label('Display Order')
                        ->numeric()
                        ->default(0)
                        ->helperText('Lower numbers appear first (0, 1, 2...).'),

                    Toggle::make('is_active')
                        ->label('Published / Live')
                        ->default(true)
                        ->helperText('Enable to display this lookbook on the homepage.'),
                ])->columns(2),

            Section::make('Product Hotspots')
                ->description('Add clickable product tags directly on the photo.')
                ->schema([
                    Placeholder::make('hotspot_guide')
                        ->hiddenLabel()
                        ->content(new HtmlString('
                            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 12px 16px; font-size: 13px; color: #166534; line-height: 1.6;">
                                <strong>💡 Easy Hotspot Guide:</strong>
                                <ul style="list-style-type: disc; margin-left: 20px; margin-top: 4px;">
                                    <li>Click <strong>"Add Hotspot Pin"</strong> below and choose a Product.</li>
                                    <li>Select a pin position from the <strong>Quick Position</strong> dropdown (e.g. Center, Top Center, Bottom Right).</li>
                                    <li>Adjust <strong>X</strong> (left-right) and <strong>Y</strong> (top-bottom) percentages if fine-tuning is needed.</li>
                                </ul>
                            </div>
                        '))
                        ->columnSpanFull(),

                    Repeater::make('hotspots')
                        ->relationship()
                        ->defaultItems(0)
                        ->collapsible()
                        ->itemLabel(fn (array $state) => filled($state['product_id'] ?? null)
                            ? (Product::find($state['product_id'])?->name . ' (X: ' . ($state['x'] ?? 50) . '%, Y: ' . ($state['y'] ?? 50) . '%)')
                            : 'New Hotspot Pin')
                        ->schema([
                            Select::make('product_id')
                                ->label('Select Product')
                                ->relationship('product', 'name')
                                ->searchable()
                                ->preload()
                                ->required()
                                ->columnSpanFull(),

                            Select::make('position_preset')
                                ->label('Quick Position')
                                ->options([
                                    'custom' => 'Custom Coordinates',
                                    'center' => 'Center — X: 50%, Y: 50%',
                                    'top_center' => 'Top Center — X: 50%, Y: 25%',
                                    'bottom_center' => 'Bottom Center — X: 50%, Y: 75%',
                                    'top_left' => 'Top Left — X: 25%, Y: 25%',
                                    'top_right' => 'Top Right — X: 75%, Y: 25%',
                                    'middle_left' => 'Middle Left — X: 25%, Y: 50%',
                                    'middle_right' => 'Middle Right — X: 75%, Y: 50%',
                                    'bottom_left' => 'Bottom Left — X: 25%, Y: 75%',
                                    'bottom_right' => 'Bottom Right — X: 75%, Y: 75%',
                                ])
                                ->live()
                                ->afterStateUpdated(function ($state, $set) {
                                    match ($state) {
                                        'center' => [$set('x', 50), $set('y', 50)],
                                        'top_center' => [$set('x', 50), $set('y', 25)],
                                        'bottom_center' => [$set('x', 50), $set('y', 75)],
                                        'top_left' => [$set('x', 25), $set('y', 25)],
                                        'top_right' => [$set('x', 75), $set('y', 25)],
                                        'middle_left' => [$set('x', 25), $set('y', 50)],
                                        'middle_right' => [$set('x', 75), $set('y', 50)],
                                        'bottom_left' => [$set('x', 25), $set('y', 75)],
                                        'bottom_right' => [$set('x', 75), $set('y', 75)],
                                        default => null,
                                    };
                                })
                                ->placeholder('Choose position preset')
                                ->columnSpanFull(),

                            TextInput::make('x')
                                ->label('X — Horizontal Position (%)')
                                ->numeric()
                                ->minValue(0)
                                ->maxValue(100)
                                ->default(50)
                                ->required()
                                ->suffix('%')
                                ->helperText('0% = Left edge, 50% = Center, 100% = Right edge'),

                            TextInput::make('y')
                                ->label('Y — Vertical Position (%)')
                                ->numeric()
                                ->minValue(0)
                                ->maxValue(100)
                                ->default(50)
                                ->required()
                                ->suffix('%')
                                ->helperText('0% = Top edge, 50% = Center, 100% = Bottom edge'),
                        ])
                        ->columns(2)
                        ->addActionLabel('Add Hotspot Pin')
                        ->columnSpanFull(),
                ]),
        ]);
    }
}
