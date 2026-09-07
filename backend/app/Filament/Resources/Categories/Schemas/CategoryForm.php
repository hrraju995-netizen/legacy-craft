<?php

namespace App\Filament\Resources\Categories\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class CategoryForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Category')->schema([
                TextInput::make('name')
                    ->required()
                    ->live(onBlur: true)
                    ->afterStateUpdated(function ($state, $set, $operation) {
                        if ($operation === 'create') {
                            $set('slug', Str::slug($state));
                        }
                    }),

                TextInput::make('slug')
                    ->required()
                    ->unique(ignoreRecord: true)
                    ->helperText('URL: /categories/your-slug'),

                Select::make('parent_id')
                    ->label('Parent category')
                    ->relationship('parent', 'name')
                    ->searchable()
                    ->preload()
                    ->placeholder('Top level'),

                TextInput::make('position')
                    ->numeric()
                    ->default(0)
                    ->helperText('Lower numbers appear first.'),

                Textarea::make('description')->rows(3)->columnSpanFull(),
            ])->columns(2),

            Section::make('Images')->schema([
                FileUpload::make('image')
                    ->label('Tile image')
                    ->image()
                    ->imageEditor()
                    ->disk('public')
                    ->directory('categories')
                    ->visibility('public')
                    ->helperText('Shown on the Shop by Category grid.'),

                FileUpload::make('banner')
                    ->label('Page banner')
                    ->image()
                    ->disk('public')
                    ->directory('categories/banners')
                    ->visibility('public')
                    ->helperText('Wide image for the top of the category page.'),
            ])->columns(2),

            Section::make('Visibility & SEO')->schema([
                Toggle::make('is_active')->label('Published')->default(true),
                Toggle::make('show_in_menu')->label('Show in menus')->default(true),

                TextInput::make('meta_title')->maxLength(70),
                Textarea::make('meta_description')->rows(2)->maxLength(160),
            ])->columns(2),
        ]);
    }
}
