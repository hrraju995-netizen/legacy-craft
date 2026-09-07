<?php

namespace App\Filament\Resources\Products\Schemas;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Color;
use App\Models\Room;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\DateTimePicker;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

/**
 * Hand-built form. The generated scaffold exposed raw foreign-key integers
 * (category_id, room_id, brand_id) as number inputs, which is how a
 * non-existent brand id could be saved and break the foreign key. It also had
 * no way to attach images or colour variants at all.
 */
class ProductForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Tabs::make('Product')->tabs([

                /* ---------------------------------------------- Basics */
                Tabs\Tab::make('Basics')->schema([
                    Section::make()->schema([
                        TextInput::make('name')
                            ->required()
                            ->maxLength(180)
                            ->live(onBlur: true)
                            // Only auto-fill the slug while creating, so editing
                            // a live product never silently changes its URL.
                            ->afterStateUpdated(function ($state, $set, $operation) {
                                if ($operation === 'create') {
                                    $set('slug', Str::slug($state));
                                }
                            })
                            ->columnSpanFull(),

                        TextInput::make('slug')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->helperText('The product URL: /products/your-slug'),

                        TextInput::make('sku')
                            ->label('SKU')
                            ->unique(ignoreRecord: true)
                            ->helperText('Your own stock code. Optional.'),

                        Select::make('category_id')
                            ->label('Category')
                            ->relationship('category', 'name')
                            ->searchable()
                            ->preload()
                            ->required()
                            ->createOptionForm([
                                TextInput::make('name')->required(),
                            ]),

                        Select::make('room_id')
                            ->label('Room')
                            ->relationship('room', 'name')
                            ->searchable()
                            ->preload()
                            ->placeholder('No specific room'),

                        Select::make('brand_id')
                            ->label('Brand')
                            ->relationship('brand', 'name')
                            ->searchable()
                            ->preload()
                            ->placeholder('No brand')
                            ->helperText('Leave empty if the product has no brand.'),

                        TextInput::make('subcategory')
                            ->label('Subcategory')
                            ->datalist(fn () => \App\Models\Product::query()
                                ->whereNotNull('subcategory')
                                ->distinct()
                                ->pluck('subcategory')
                                ->all())
                            ->helperText('Free text, e.g. "Wardrobes". Shown as a filter tile on category pages.'),

                        Textarea::make('short_description')
                            ->rows(2)
                            ->maxLength(300)
                            ->helperText('Used on product cards and in search results.')
                            ->columnSpanFull(),

                        Textarea::make('description')
                            ->rows(6)
                            ->columnSpanFull(),
                    ])->columns(2),
                ]),

                /* ---------------------------------------------- Images */
                Tabs\Tab::make('Images')->schema([
                    Section::make()
                        ->description('The first image is the thumbnail. Drag to reorder.')
                        ->schema([
                            Repeater::make('images')
                                ->relationship()
                                ->defaultItems(0)
                                ->orderColumn('position')
                                ->reorderable()
                                ->collapsible()
                                ->itemLabel(fn (array $state) => $state['alt'] ?? 'Image')
                                ->schema([
                                    FileUpload::make('path')
                                        ->label('Image')
                                        ->image()
                                        ->imageEditor()
                                        ->disk('public')
                                        ->directory('products')
                                        ->visibility('public')
                                        ->maxSize(5120)
                                        ->required()
                                        ->columnSpanFull(),

                                    TextInput::make('alt')
                                        ->label('Alt text')
                                        ->helperText('Describes the image for search engines and screen readers.'),

                                    Toggle::make('is_thumbnail')
                                        ->label('Use as thumbnail')
                                        ->helperText('If none is set, the first image is used.'),
                                ])
                                ->columns(2)
                                ->addActionLabel('Add image')
                                ->columnSpanFull(),
                        ]),
                ]),

                /* ------------------------------------- Pricing & stock */
                Tabs\Tab::make('Pricing & Stock')->schema([
                    Section::make('Pricing')->schema([
                        // Stored in paisa; these fields work in taka.
                        TextInput::make('price')
                            ->label('Price (৳)')
                            ->numeric()
                            ->required()
                            ->minValue(0)
                            ->formatStateUsing(fn ($state) => $state !== null ? $state / 100 : null)
                            ->dehydrateStateUsing(fn ($state) => (int) round($state * 100)),

                        TextInput::make('compare_at_price')
                            ->label('Compare-at price (৳)')
                            ->numeric()
                            ->minValue(0)
                            ->helperText('The struck-through price. Leave empty for no discount badge.')
                            ->formatStateUsing(fn ($state) => $state !== null ? $state / 100 : null)
                            ->dehydrateStateUsing(fn ($state) => $state !== null && $state !== ''
                                ? (int) round($state * 100)
                                : null),

                        TextInput::make('cost_price')
                            ->label('Cost price (৳)')
                            ->numeric()
                            ->minValue(0)
                            ->helperText('Your purchase cost. Never shown on the site.')
                            ->formatStateUsing(fn ($state) => $state !== null ? $state / 100 : null)
                            ->dehydrateStateUsing(fn ($state) => $state !== null && $state !== ''
                                ? (int) round($state * 100)
                                : null),
                    ])->columns(3),

                    Section::make('Stock')->schema([
                        Toggle::make('manage_stock')
                            ->label('Track stock')
                            ->default(true)
                            ->live()
                            ->helperText('Off means the product is always purchasable.'),

                        TextInput::make('stock_quantity')
                            ->numeric()
                            ->default(0)
                            ->minValue(0)
                            ->visible(fn ($get) => $get('manage_stock'))
                            // Status follows the quantity, so the two can't disagree.
                            ->live(onBlur: true)
                            ->afterStateUpdated(fn ($state, $set) => $set(
                                'stock_status',
                                (int) $state > 0 ? 'in_stock' : 'out_of_stock'
                            )),

                        TextInput::make('low_stock_threshold')
                            ->numeric()
                            ->default(3)
                            ->visible(fn ($get) => $get('manage_stock'))
                            ->helperText('Warn when stock drops to this level.'),

                        Select::make('stock_status')
                            ->options([
                                'in_stock' => 'In stock',
                                'out_of_stock' => 'Out of stock',
                                'on_backorder' => 'On backorder',
                            ])
                            ->default('in_stock')
                            ->required(),
                    ])->columns(2),
                ]),

                /* -------------------------------------------- Variants */
                Tabs\Tab::make('Colours & Variants')->schema([
                    Section::make()
                        ->description('Each colour becomes a separately buyable option. Leave empty for a single-option product.')
                        ->schema([
                            Repeater::make('variants')
                                ->relationship()
                                ->defaultItems(0)
                                ->orderColumn('position')
                                ->reorderable()
                                ->collapsible()
                                ->itemLabel(fn (array $state) => $state['name'] ?? 'Variant')
                                ->schema([
                                    Select::make('color_id')
                                        ->label('Colour')
                                        ->relationship('color', 'name')
                                        ->searchable()
                                        ->preload()
                                        ->createOptionForm([
                                            TextInput::make('name')->required(),
                                            TextInput::make('hex')
                                                ->label('Hex code')
                                                ->required()
                                                ->placeholder('#C89F6B'),
                                        ])
                                        ->live()
                                        ->afterStateUpdated(function ($state, $set) {
                                            if ($color = Color::find($state)) {
                                                $set('name', $color->name);
                                            }
                                        }),

                                    TextInput::make('name')
                                        ->label('Variant name')
                                        ->helperText('Defaults to the colour name.'),

                                    TextInput::make('price')
                                        ->label('Price override (৳)')
                                        ->numeric()
                                        ->helperText('Leave empty to use the product price.')
                                        ->formatStateUsing(fn ($state) => $state !== null ? $state / 100 : null)
                                        ->dehydrateStateUsing(fn ($state) => $state !== null && $state !== ''
                                            ? (int) round($state * 100)
                                            : null),

                                    TextInput::make('compare_at_price')
                                        ->label('Compare-at price override (৳)')
                                        ->numeric()
                                        ->helperText('Leave empty to use the product compare-at price.')
                                        ->formatStateUsing(fn ($state) => $state !== null ? $state / 100 : null)
                                        ->dehydrateStateUsing(fn ($state) => $state !== null && $state !== ''
                                            ? (int) round($state * 100)
                                            : null),

                                    TextInput::make('stock_quantity')
                                        ->numeric()
                                        ->default(0),

                                    FileUpload::make('image')
                                        ->image()
                                        ->disk('public')
                                        ->directory('variants')
                                        ->visibility('public')
                                        ->helperText('Optional photo of this colour.'),

                                    Toggle::make('is_active')->default(true),
                                ])
                                ->columns(2)
                                ->addActionLabel('Add colour')
                                ->columnSpanFull(),
                        ]),
                ]),

                /* ------------------------------------------ Specs */
                Tabs\Tab::make('Specifications')->schema([
                    Section::make()->schema([
                        TextInput::make('material')
                            ->placeholder('Segun Wood & Veneer Board'),

                        Select::make('size_label')
                            ->label('Size')
                            // Must match one of these exactly — the storefront
                            // sidebar filters on this value.
                            ->options([
                                'Small Size' => 'Small Size',
                                'Standard' => 'Standard',
                                'Medium Size' => 'Medium Size',
                                'Large Size' => 'Large Size',
                            ])
                            ->helperText('Used by the size filter on listing pages.'),

                        TextInput::make('weight_kg')
                            ->label('Weight (kg)')
                            ->numeric(),

                        TextInput::make('dim_width')->label('Width')->placeholder('2 ft'),
                        TextInput::make('dim_length')->label('Length')->placeholder('6 ft'),
                        TextInput::make('dim_height')->label('Height')->placeholder('3 ft'),
                    ])->columns(3),
                ]),

                /* ------------------------------------- Display & SEO */
                Tabs\Tab::make('Display & SEO')->schema([
                    Section::make('Visibility')->schema([
                        Toggle::make('is_active')
                            ->label('Published')
                            ->default(true)
                            ->helperText('Off hides the product from the site entirely.'),

                        Toggle::make('is_featured')->label('Featured'),
                        Toggle::make('is_best_seller')->label('Best seller badge'),
                        Toggle::make('is_new')->label('New badge'),

                        TextInput::make('position')
                            ->numeric()
                            ->default(0)
                            ->helperText('Lower numbers appear first.'),

                        DateTimePicker::make('published_at')
                            ->default(now())
                            ->helperText('Used for "Newest" sorting.'),
                    ])->columns(3),

                    Section::make('Ratings')->schema([
                        TextInput::make('rating')
                            ->numeric()
                            ->minValue(0)
                            ->maxValue(5)
                            ->step(0.1)
                            ->default(0),

                        TextInput::make('review_count')->numeric()->default(0),
                    ])->columns(2),

                    Section::make('Search engines')->schema([
                        TextInput::make('meta_title')
                            ->maxLength(70)
                            ->helperText('Falls back to the product name.'),

                        Textarea::make('meta_description')
                            ->rows(2)
                            ->maxLength(160)
                            ->helperText('Falls back to the short description.'),
                    ]),
                ]),

            ])->columnSpanFull(),
        ]);
    }
}
