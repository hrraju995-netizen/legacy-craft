<?php

namespace App\Filament\Resources\Menus\RelationManagers;

use App\Models\Category;
use App\Models\MenuItem;
use App\Models\Page;
use App\Models\Product;
use App\Models\Room;
use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Table;

/**
 * Mega-menu builder. Items are self-referencing, so a top-level item can hold
 * columns of children, and those children can hold their own links.
 */
class ItemsRelationManager extends RelationManager
{
    protected static string $relationship = 'allItems';

    protected static ?string $title = 'Menu items';

    public function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Link')->schema([
                TextInput::make('label')
                    ->required()
                    ->helperText('The text shown in the menu.'),

                Select::make('parent_id')
                    ->label('Nest under')
                    ->options(fn () => $this->getOwnerRecord()
                        ->allItems()
                        ->pluck('label', 'id'))
                    ->searchable()
                    ->placeholder('Top level')
                    ->helperText('Leave empty for a top-level item. Pick a parent to make it a dropdown entry.'),

                Select::make('link_type')
                    ->label('Points to')
                    ->options([
                        'url' => 'Custom URL',
                        'category' => 'Category',
                        'product' => 'Product',
                        'page' => 'CMS page',
                        'room' => 'Room',
                    ])
                    ->default('url')
                    ->required()
                    ->live(),

                TextInput::make('url')
                    ->label('URL')
                    ->placeholder('/products')
                    ->visible(fn ($get) => $get('link_type') === 'url')
                    ->required(fn ($get) => $get('link_type') === 'url'),

                // Choosing the target by id means a renamed category can never
                // leave a dead link — the URL is derived at render time.
                Select::make('linkable_id')
                    ->label(fn ($get) => match ($get('link_type')) {
                        'category' => 'Category',
                        'product' => 'Product',
                        'page' => 'Page',
                        'room' => 'Room',
                        default => 'Target',
                    })
                    ->options(fn ($get) => match ($get('link_type')) {
                        'category' => Category::pluck('name', 'id'),
                        'product' => Product::pluck('name', 'id'),
                        'page' => Page::pluck('title', 'id'),
                        'room' => Room::pluck('name', 'id'),
                        default => [],
                    })
                    ->searchable()
                    ->visible(fn ($get) => $get('link_type') !== 'url')
                    ->required(fn ($get) => $get('link_type') !== 'url'),
            ])->columns(2),

            Section::make('Mega menu')->schema([
                Toggle::make('is_mega')
                    ->label('Open as a mega menu')
                    ->helperText('Top-level items only. Children render as columns.')
                    ->live(),

                TextInput::make('columns')
                    ->numeric()
                    ->default(1)
                    ->minValue(1)
                    ->maxValue(6)
                    ->visible(fn ($get) => $get('is_mega'))
                    ->helperText('How many columns the dropdown uses.'),

                TextInput::make('description')
                    ->label('Subtitle')
                    ->helperText('Small text under the label inside a mega menu.'),

                FileUpload::make('image')
                    ->image()
                    ->directory('menu')
                    ->visibility('public')
                    ->helperText('Optional thumbnail shown beside the label.'),
            ])->columns(2),

            Section::make('Appearance')->schema([
                TextInput::make('icon')
                    ->placeholder('heroicon-o-home')
                    ->helperText('Optional Heroicon name.'),

                TextInput::make('badge')
                    ->placeholder('New')
                    ->helperText('Small tag beside the label.'),

                TextInput::make('badge_color')->placeholder('#9f582c'),

                TextInput::make('position')
                    ->numeric()
                    ->default(0)
                    ->helperText('Lower numbers appear first.'),

                Toggle::make('open_in_new_tab'),
                Toggle::make('is_active')->default(true),
            ])->columns(3),
        ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->defaultSort('position')
            ->reorderable('position')
            ->columns([
                TextColumn::make('label')
                    ->weight('bold')
                    // Indent children so the hierarchy is readable at a glance.
                    ->formatStateUsing(fn (MenuItem $r, $state) => $r->parent_id
                        ? '— '.$state
                        : $state)
                    ->description(fn (MenuItem $r) => $r->parent
                        ? 'under '.$r->parent->label
                        : 'top level'),

                TextColumn::make('link_type')->badge(),

                TextColumn::make('resolved_url')
                    ->label('Resolves to')
                    ->color('gray')
                    ->copyable(),

                IconColumn::make('is_mega')->label('Mega')->boolean(),

                ToggleColumn::make('is_active')->label('Live'),
            ])
            ->headerActions([
                CreateAction::make()->label('Add item'),
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->emptyStateHeading('No menu items yet')
            ->emptyStateDescription('Add a top-level item first, then nest children under it.');
    }
}
