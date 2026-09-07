<?php

namespace App\Filament\Resources\Couriers\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class CourierForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->required(),
                TextInput::make('code')
                    ->required(),
                TextInput::make('logo'),
                TextInput::make('base_url')
                    ->url(),
                Textarea::make('api_key')
                    ->columnSpanFull(),
                Textarea::make('api_secret')
                    ->columnSpanFull(),
                Toggle::make('is_active')
                    ->required(),
                Toggle::make('is_default')
                    ->required(),
                Textarea::make('settings')
                    ->columnSpanFull(),
            ]);
    }
}
