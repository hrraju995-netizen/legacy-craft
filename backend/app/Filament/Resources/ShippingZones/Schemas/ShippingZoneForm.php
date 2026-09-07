<?php

namespace App\Filament\Resources\ShippingZones\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class ShippingZoneForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->required(),
                TextInput::make('slug')
                    ->required(),
                TextInput::make('note'),
                TextInput::make('rate')
                    ->required()
                    ->numeric(),
                TextInput::make('free_above')
                    ->numeric(),
                TextInput::make('min_days')
                    ->numeric(),
                TextInput::make('max_days')
                    ->numeric(),
                TextInput::make('position')
                    ->required()
                    ->numeric()
                    ->default(0),
                Toggle::make('is_active')
                    ->required(),
                Toggle::make('is_default')
                    ->required(),
            ]);
    }
}
