<?php

namespace App\Filament\Resources\Pages\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class PageForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Page Information')
                    ->schema([
                        TextInput::make('title')
                            ->label('Page Title')
                            ->required()
                            ->live(onBlur: true)
                            ->afterStateUpdated(fn ($set, ?string $state) => $set('slug', Str::slug($state))),

                        TextInput::make('slug')
                            ->label('Page URL Slug')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->helperText('e.g. about, contact, privacy-policy, warranty'),

                        Textarea::make('excerpt')
                            ->label('Short Summary')
                            ->rows(2)
                            ->columnSpanFull(),
                    ])->columns(2),

                Section::make('Page Content')
                    ->schema([
                        RichEditor::make('content')
                            ->label('Detailed Content')
                            ->columnSpanFull(),
                    ]),

                Section::make('Display & Placement')
                    ->schema([
                        Toggle::make('show_in_footer')
                            ->label('Show in Footer')
                            ->helperText('Automatically adds link under the Help Desk section in website footer')
                            ->default(true),

                        Toggle::make('is_published')
                            ->label('Publish Status')
                            ->default(true),

                        DateTimePicker::make('published_at')
                            ->label('Published At')
                            ->default(now()),
                    ])->columns(3),

                Section::make('SEO & Featured Image')
                    ->schema([
                        FileUpload::make('featured_image')
                            ->label('Featured Banner Image')
                            ->image()
                            ->directory('pages'),

                        TextInput::make('meta_title')
                            ->label('Meta Title'),

                        Textarea::make('meta_description')
                            ->label('Meta Description')
                            ->rows(2)
                            ->columnSpanFull(),
                    ])->columns(2)->collapsed(),
            ]);
    }
}

