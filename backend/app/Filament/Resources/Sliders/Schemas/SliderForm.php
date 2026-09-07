<?php

namespace App\Filament\Resources\Sliders\Schemas;

use Filament\Forms\Components\ColorPicker;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Hidden;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class SliderForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Hidden::make('placement')->default('hero_slide'),

                Section::make('Slide Content & Link')
                    ->description('Configure the text and button for the homepage main slider.')
                    ->schema([
                        TextInput::make('badge')
                            ->label('Badge / Offer Tag')
                            ->placeholder('e.g. SPECIAL OFFER / 20% OFF')
                            ->default('SPECIAL OFFER'),

                        TextInput::make('title')
                            ->label('Slide Title')
                            ->placeholder('e.g. Handcrafted Furniture Collection')
                            ->required(),

                        Textarea::make('subtitle')
                            ->label('Subtitle / Description')
                            ->placeholder('Discover premium handcrafted furniture built for elegance and comfort.')
                            ->rows(2)
                            ->columnSpanFull(),

                        TextInput::make('button_text')
                            ->label('Button Text')
                            ->default('Shop Now')
                            ->placeholder('Shop Now')
                            ->required(),

                        TextInput::make('link')
                            ->label('Target Link')
                            ->default('/products')
                            ->placeholder('/products or /category/sofas')
                            ->required(),
                    ])->columns(2),

                Section::make('Colors & Styling')
                    ->description('Customize background color, text color, and button style.')
                    ->schema([
                        ColorPicker::make('bg_color')
                            ->label('Slide Background Color')
                            ->placeholder('#faf6f3')
                            ->helperText('Main slide background color (default: #faf6f3)'),

                        ColorPicker::make('text_color')
                            ->label('Text Color')
                            ->placeholder('#0f172a')
                            ->helperText('Text color for title and subtitle'),

                        ColorPicker::make('button_color')
                            ->label('Button Color')
                            ->placeholder('#9f582c')
                            ->helperText('Button background color'),

                        ColorPicker::make('button_text_color')
                            ->label('Button Text Color')
                            ->placeholder('#ffffff')
                            ->helperText('Button text color (default: #ffffff)'),
                    ])->columns(2),

                Section::make('Slide Images')
                    ->description('Upload high quality images (1200×500 recommended).')
                    ->schema([
                        FileUpload::make('image')
                            ->label('Desktop Slide Image')
                            ->image()
                            ->disk('public')
                            ->directory('sliders')
                            ->visibility('public')
                            ->required(),

                        FileUpload::make('mobile_image')
                            ->label('Mobile Slide Image (Optional)')
                            ->image()
                            ->disk('public')
                            ->directory('sliders/mobile')
                            ->visibility('public'),
                    ])->columns(2),

                Section::make('Display & Status')
                    ->schema([
                        TextInput::make('position')
                            ->label('Display Order / Serial')
                            ->numeric()
                            ->default(0)
                            ->helperText('Lower numbers appear first (0, 1, 2...)'),

                        Toggle::make('is_active')
                            ->label('Active / Published')
                            ->default(true)
                            ->helperText('Enable to display this slide on the homepage'),

                        DateTimePicker::make('starts_at')
                            ->label('Start Date (Optional)'),

                        DateTimePicker::make('ends_at')
                            ->label('End Date (Optional)'),
                    ])->columns(4),
            ]);
    }
}
