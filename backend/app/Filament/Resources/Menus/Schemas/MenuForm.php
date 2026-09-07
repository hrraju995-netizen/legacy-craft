<?php

namespace App\Filament\Resources\Menus\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class MenuForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make()
                ->description('A menu is a slot in the layout. Add the actual links from the Items tab after saving.')
                ->schema([
                    TextInput::make('name')
                        ->required()
                        ->helperText('For your reference only, e.g. "Header Main Menu".'),

                    TextInput::make('location')
                        ->required()
                        ->unique(ignoreRecord: true)
                        ->helperText('Where it renders: header_main, footer_company, footer_help.'),

                    Toggle::make('is_active')->default(true),
                ])->columns(2),
        ]);
    }
}
