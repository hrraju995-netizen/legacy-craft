<?php

namespace App\Models;

use Filament\Models\Contracts\FilamentUser;
use Filament\Models\Contracts\HasAvatar;
use Filament\Panel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

/** Admin/staff account for Filament. Storefront shoppers live in the Customer model. */
class User extends Authenticatable implements FilamentUser, HasAvatar
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'avatar',
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    /** Filament Avatar integration. */
    public function getFilamentAvatarUrl(): ?string
    {
        if ($this->avatar) {
            return Product::resolveImageUrl($this->avatar);
        }

        return 'https://ui-avatars.com/api/?name=' . urlencode($this->name ?: 'Admin') . '&background=9f582c&color=ffffff&bold=true&size=128&rounded=true';
    }

    /** Deactivated staff cannot get into the admin panel. */
    public function canAccessPanel(Panel $panel): bool
    {
        return $this->is_active && in_array($this->role, ['admin', 'manager', 'staff'], true);
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isManager(): bool
    {
        return $this->role === 'manager';
    }

    public function isStaff(): bool
    {
        return $this->role === 'staff';
    }

    public function getRoleLabelAttribute(): string
    {
        return match ($this->role) {
            'admin' => 'Administrator',
            'manager' => 'Store Manager',
            'staff' => 'Support Staff',
            default => ucfirst($this->role ?? 'User'),
        };
    }

    public function getRoleBadgeColorAttribute(): string
    {
        return match ($this->role) {
            'admin' => 'danger',
            'manager' => 'warning',
            'staff' => 'info',
            default => 'gray',
        };
    }
}
