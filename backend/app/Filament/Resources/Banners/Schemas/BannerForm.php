<?php

namespace App\Filament\Resources\Banners\Schemas;

use Filament\Forms\Components\ColorPicker;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class BannerForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Banner Location & Order')->schema([
                    Select::make('placement')
                        ->label('Banner Placement')
                        ->options([
                            'hero_side_top' => 'Hero Side Banner - Top',
                            'hero_side_bottom' => 'Hero Side Banner - Bottom',
                            'meeting_banner' => 'Mid-Page Promo Banner',
                        ])
                        ->default('hero_side_top')
                        ->required()
                        ->helperText('Select banner display location (use Sliders for main carousel).'),

                    TextInput::make('position')
                        ->numeric()
                        ->default(0)
                        ->helperText('Display order (lower numbers appear first).'),
                ])->columns(2),

                Section::make('Content & Details')->schema([
                    TextInput::make('badge')
                        ->label('Badge Text (e.g. 17% OFF / SALE / BESTSELLER)')
                        ->placeholder('SALE'),

                    TextInput::make('title')
                        ->label('Banner Title / Main Heading (e.g. UP TO 20% OFF)')
                        ->placeholder('UP TO 20% OFF'),

                    Textarea::make('subtitle')
                        ->label('Subtitle / Category Name (e.g. Kitchen & Dining Cabinets)')
                        ->placeholder('Kitchen & Dining Cabinets')
                        ->rows(2)
                        ->columnSpanFull(),

                    TextInput::make('button_text')
                        ->label('Button Text')
                        ->default('Shop Now')
                        ->placeholder('Shop Now'),

                    TextInput::make('link')
                        ->label('Target URL / Link')
                        ->placeholder('/products or /category/kitchen'),
                ])->columns(2),

                Section::make('Colors & Styling')->schema([
                    ColorPicker::make('bg_color')
                        ->label('Card Background Color')
                        ->placeholder('#f4f4f4')
                        ->helperText('Main card background color (default: #f4f4f4)'),

                    ColorPicker::make('text_color')
                        ->label('Text Color')
                        ->placeholder('#0f172a')
                        ->helperText('Text color for title and subtitle'),

                    ColorPicker::make('button_color')
                        ->label('Button / Link Color')
                        ->placeholder('#9f582c')
                        ->helperText('Button background or link accent color'),

                    ColorPicker::make('button_text_color')
                        ->label('Button Text Color')
                        ->placeholder('#ffffff')
                        ->helperText('Text color inside the button (optional)'),
                ])->columns(2),

                Section::make('Images')->schema([
                    FileUpload::make('image')
                        ->label('Foreground / Product Image')
                        ->image()
                        ->disk('public')
                        ->directory('banners')
                        ->visibility('public')
                        ->required()
                        ->helperText('Product image on the right side (transparent PNG or square recommended)'),

                    FileUpload::make('bg_image')
                        ->label('Full Card Background Image (Optional)')
                        ->image()
                        ->disk('public')
                        ->directory('banners/backgrounds')
                        ->visibility('public')
                        ->helperText('Optional background texture or full card image'),

                    FileUpload::make('mobile_image')
                        ->label('Mobile Image (Optional)')
                        ->image()
                        ->disk('public')
                        ->directory('banners/mobile')
                        ->visibility('public'),
                ])->columns(3),

                Section::make('Visibility')->schema([
                    Toggle::make('is_active')
                        ->label('Published / Active')
                        ->default(true),

                    DateTimePicker::make('starts_at')->label('Start Date'),
                    DateTimePicker::make('ends_at')->label('End Date'),
                ])->columns(3),
            ]);
    }
}
