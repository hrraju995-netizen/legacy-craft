<?php

namespace App\Filament\Resources\Users\Tables;

use App\Models\User;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Table;
use Illuminate\Support\Facades\Hash;

class UsersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->columns([
                ImageColumn::make('avatar')
                    ->label('Photo')
                    ->circular()
                    ->disk('public')
                    ->defaultImageUrl(fn ($record) => 'https://ui-avatars.com/api/?name=' . urlencode($record->name) . '&background=9f582c&color=fff'),

                TextColumn::make('name')
                    ->label('User Name')
                    ->searchable()
                    ->weight('bold'),

                TextColumn::make('email')
                    ->label('Email Address')
                    ->searchable()
                    ->copyable()
                    ->icon('heroicon-o-envelope'),

                TextColumn::make('role')
                    ->label('Role')
                    ->badge()
                    ->formatStateUsing(fn ($record) => match ($record->role) {
                        'admin' => 'Administrator',
                        'manager' => 'Store Manager',
                        'staff' => 'Support Staff',
                        default => ucfirst($record->role ?? 'User'),
                    })
                    ->color(fn ($record) => match ($record->role) {
                        'admin' => 'danger',
                        'manager' => 'warning',
                        'staff' => 'info',
                        default => 'gray',
                    }),

                ToggleColumn::make('is_active')
                    ->label('Active'),

                TextColumn::make('created_at')
                    ->label('Created')
                    ->dateTime('M d, Y h:i A')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->recordActions([
                Action::make('changePassword')
                    ->label('Change Password')
                    ->icon('heroicon-o-key')
                    ->color('warning')
                    ->modalHeading(fn (User $record): string => "Change Password for {$record->name} ({$record->email})")
                    ->modalDescription('Specify a new secure password for this user.')
                    ->modalSubmitActionLabel('Update Password')
                    ->form([
                        TextInput::make('new_password')
                            ->label('New Password')
                            ->password()
                            ->revealable()
                            ->required()
                            ->minLength(8)
                            ->placeholder('At least 8 characters'),

                        TextInput::make('new_password_confirmation')
                            ->label('Confirm Password')
                            ->password()
                            ->revealable()
                            ->required()
                            ->same('new_password')
                            ->placeholder('Re-enter new password'),
                    ])
                    ->action(function (User $record, array $data): void {
                        $record->update([
                            'password' => Hash::make($data['new_password']),
                        ]);

                        Notification::make()
                            ->title('Password Updated')
                            ->body("Password for {$record->name} has been updated successfully.")
                            ->success()
                            ->send();
                    }),

                EditAction::make(),

                DeleteAction::make()
                    ->disabled(fn (User $record): bool => $record->id === auth()->id()),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ])
            ->emptyStateHeading('No users found')
            ->emptyStateDescription('Click "New User" to add an administrator, manager, or staff member.');
    }
}
