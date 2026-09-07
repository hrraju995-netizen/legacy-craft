<?php

namespace App\Filament\Resources\Lookbooks;

use App\Filament\Resources\Lookbooks\Pages\CreateLookbook;
use App\Filament\Resources\Lookbooks\Pages\EditLookbook;
use App\Filament\Resources\Lookbooks\Pages\ListLookbooks;
use App\Filament\Resources\Lookbooks\Schemas\LookbookForm;
use App\Filament\Resources\Lookbooks\Tables\LookbooksTable;
use App\Models\Lookbook;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class LookbookResource extends Resource
{
    protected static ?string $model = Lookbook::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedSparkles;

    protected static \UnitEnum|string|null $navigationGroup = 'Site Customization';

    protected static ?string $navigationLabel = 'Get the Look';

    protected static ?string $modelLabel = 'Lookbook Scene';

    protected static ?string $pluralModelLabel = 'Get the Look Scenes';

    protected static ?int $navigationSort = 3;

    public static function form(Schema $schema): Schema
    {
        return LookbookForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return LookbooksTable::configure($table);
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
            'index' => ListLookbooks::route('/'),
            'create' => CreateLookbook::route('/create'),
            'edit' => EditLookbook::route('/{record}/edit'),
        ];
    }
}
