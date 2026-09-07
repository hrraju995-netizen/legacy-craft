<?php

namespace App\Filament\Resources\Sliders;

use App\Filament\Resources\Sliders\Pages\CreateSlider;
use App\Filament\Resources\Sliders\Pages\EditSlider;
use App\Filament\Resources\Sliders\Pages\ListSliders;
use App\Filament\Resources\Sliders\Schemas\SliderForm;
use App\Filament\Resources\Sliders\Tables\SlidersTable;
use App\Models\Banner;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class SliderResource extends Resource
{
    protected static ?string $model = Banner::class;

    protected static ?string $navigationLabel = 'Sliders';

    protected static ?string $modelLabel = 'Slide';

    protected static ?string $pluralModelLabel = 'Sliders';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedPhoto;

    protected static \UnitEnum|string|null $navigationGroup = 'Site Customization';

    protected static ?int $navigationSort = 1;

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()->where('placement', 'hero_slide');
    }

    public static function form(Schema $schema): Schema
    {
        return SliderForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return SlidersTable::configure($table);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListSliders::route('/'),
            'create' => CreateSlider::route('/create'),
            'edit' => EditSlider::route('/{record}/edit'),
        ];
    }
}
