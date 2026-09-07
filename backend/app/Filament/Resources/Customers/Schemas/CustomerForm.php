<?php

namespace App\Filament\Resources\Customers\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class CustomerForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Customer Profile')
                    ->description('Customer personal information and contact details.')
                    ->schema([
                        TextInput::make('name')
                            ->label('Full Name')
                            ->required(),

                        TextInput::make('phone')
                            ->label('Phone Number')
                            ->tel()
                            ->required()
                            ->unique(ignoreRecord: true),

                        TextInput::make('email')
                            ->label('Email Address')
                            ->email(),

                        TextInput::make('password')
                            ->label('Password')
                            ->password()
                            ->dehydrated(fn ($state) => filled($state))
                            ->helperText('Enter a new password to change it, otherwise leave blank.'),

                        Toggle::make('is_active')
                            ->label('Account Active')
                            ->default(true)
                            ->helperText('Disabling this prevents the customer from logging in.'),

                        Textarea::make('notes')
                            ->label('Admin Notes')
                            ->placeholder('Special notes about this customer...')
                            ->columnSpanFull(),
                    ])->columns(2),
            ]);
    }
}
