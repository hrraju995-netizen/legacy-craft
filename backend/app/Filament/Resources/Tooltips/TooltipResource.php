<?php

namespace App\Filament\Resources\Tooltips;

use App\Filament\Resources\Tooltips\Pages\CreateTooltip;
use App\Filament\Resources\Tooltips\Pages\EditTooltip;
use App\Filament\Resources\Tooltips\Pages\ListTooltips;
use App\Filament\Resources\Tooltips\Schemas\TooltipForm;
use App\Filament\Resources\Tooltips\Tables\TooltipsTable;
use App\Models\Tooltip;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class TooltipResource extends Resource
{
    protected static ?string $model = Tooltip::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedInformationCircle;

    protected static ?string $navigationLabel = 'Tooltips';

    protected static \UnitEnum|string|null $navigationGroup = 'Site Customization';

    public static function form(Schema $schema): Schema
    {
        return TooltipForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return TooltipsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListTooltips::route('/'),
            'create' => CreateTooltip::route('/create'),
            'edit' => EditTooltip::route('/{record}/edit'),
        ];
    }
}
