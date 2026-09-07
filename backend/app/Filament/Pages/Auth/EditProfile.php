<?php

namespace App\Filament\Pages\Auth;

use Filament\Auth\Pages\EditProfile as BaseEditProfile;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class EditProfile extends BaseEditProfile
{
    protected string $view = 'filament.pages.auth.edit-profile';

    protected static ?string $navigationLabel = 'My Profile';

    public static function getLabel(): string
    {
        return 'Admin Profile & Security';
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Personal Information & Photo')
                    ->description('Update your profile photo, full name, and email address.')
                    ->icon('heroicon-o-user-circle')
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
                            ->helperText('Upload a square profile photo (JPEG, PNG, or WebP up to 2MB). Shown in the dashboard header.')
                            ->columnSpanFull(),

                        $this->getNameFormComponent()
                            ->label('Full Name')
                            ->prefixIcon('heroicon-o-user')
                            ->placeholder('e.g. Store Admin'),

                        $this->getEmailFormComponent()
                            ->label('Email Address')
                            ->prefixIcon('heroicon-o-envelope')
                            ->placeholder('admin@legacycraftstudio.com'),

                        TextInput::make('role')
                            ->label('System Role')
                            ->prefixIcon('heroicon-o-shield-check')
                            ->formatStateUsing(fn () => $this->getUser()->role_label)
                            ->disabled()
                            ->dehydrated(false)
                            ->helperText('Indicates your administrative permission level in the system.'),
                    ])->columns(2),

                Section::make('Password & Security')
                    ->description('Ensure your account is using a strong password of at least 8 characters.')
                    ->icon('heroicon-o-key')
                    ->schema([
                        $this->getCurrentPasswordFormComponent()
                            ->label('Current Password')
                            ->prefixIcon('heroicon-o-lock-closed')
                            ->placeholder('Enter current password to verify'),

                        $this->getPasswordFormComponent()
                            ->label('New Password')
                            ->prefixIcon('heroicon-o-key')
                            ->placeholder('Enter new password (min 8 characters)'),

                        $this->getPasswordConfirmationFormComponent()
                            ->label('Confirm New Password')
                            ->prefixIcon('heroicon-o-check-circle')
                            ->placeholder('Confirm new password'),
                    ])->columns(1),
            ]);
    }
}
