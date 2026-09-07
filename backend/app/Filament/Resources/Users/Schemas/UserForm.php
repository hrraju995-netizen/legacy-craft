<?php

namespace App\Filament\Resources\Users\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class UserForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('User Profile & Roles')
                    ->description('Manage staff and administrator account details, roles, and status.')
                    ->schema([
                        FileUpload::make('avatar')
                            ->label('Profile Photo')
                            ->image()
                            ->disk('public')
                            ->directory('avatars')
                            ->visibility('public')
                            ->imageResizeTargetWidth('300')
                            ->imageResizeTargetHeight('300')
                            ->maxSize(2048)
                            ->helperText('Upload a square photo (JPEG, PNG, WebP up to 2MB).')
                            ->columnSpanFull(),

                        TextInput::make('name')
                            ->label('Full Name')
                            ->placeholder('e.g. John Doe')
                            ->prefixIcon('heroicon-o-user')
                            ->required()
                            ->maxLength(255),

                        TextInput::make('email')
                            ->label('Email Address')
                            ->placeholder('e.g. admin@legacycraftstudio.com')
                            ->prefixIcon('heroicon-o-envelope')
                            ->email()
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->maxLength(255),

                        Select::make('role')
                            ->label('System Role')
                            ->prefixIcon('heroicon-o-shield-check')
                            ->options([
                                'admin' => 'Administrator — Full System Access',
                                'manager' => 'Store Manager — Catalogue & Orders Management',
                                'staff' => 'Support Staff — Orders & Support Assistance',
                            ])
                            ->default('staff')
                            ->required()
                            ->native(false),

                        TextInput::make('password')
                            ->label('Password')
                            ->prefixIcon('heroicon-o-key')
                            ->password()
                            ->revealable()
                            ->required(fn (string $operation): bool => $operation === 'create')
                            ->dehydrated(fn ($state) => filled($state))
                            ->helperText(fn (string $operation): string => $operation === 'create'
                                ? 'Create with a secure password of at least 8 characters.'
                                : 'Leave blank to keep the current password unchanged.'
                            ),

                        Toggle::make('is_active')
                            ->label('Account Active')
                            ->default(true)
                            ->helperText('If deactivated, this user will not be able to log in to the admin panel.')
                            ->columnSpanFull(),
                    ])->columns(2),
            ]);
    }
}
