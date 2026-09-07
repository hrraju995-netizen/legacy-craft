<?php

namespace App\Filament\Resources\Tooltips\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class TooltipForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('context')
                    ->required()
                    ->default('global'),
                TextInput::make('anchor'),
                TextInput::make('title'),
                Textarea::make('content')
                    ->required()
                    ->columnSpanFull(),
                TextInput::make('placement')
                    ->required()
                    ->default('top'),
                TextInput::make('trigger')
                    ->required()
                    ->default('hover'),
                Toggle::make('is_active')
                    ->required(),
            ]);
    }
}
