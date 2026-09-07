<?php

namespace App\Filament\Resources\Reviews\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class ReviewForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('product_id')
                    ->required()
                    ->numeric(),
                TextInput::make('user_id')
                    ->numeric(),
                TextInput::make('author_name')
                    ->required(),
                TextInput::make('author_email')
                    ->email(),
                TextInput::make('rating')
                    ->required()
                    ->numeric(),
                Textarea::make('body')
                    ->columnSpanFull(),
                Toggle::make('is_approved')
                    ->required(),
            ]);
    }
}
