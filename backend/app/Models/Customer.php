<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

/** Storefront account. Separate from User, which is admin staff only. */
class Customer extends Authenticatable
{
    use HasApiTokens, HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'phone',
        'email',
        'password',
        'is_active',
        'phone_verified_at',
        'notes',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'password' => 'hashed',
        'phone_verified_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    public function addresses()
    {
        return $this->hasMany(Address::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function defaultAddress()
    {
        return $this->hasOne(Address::class)->where('is_default', true);
    }

    public function getTotalSpentAttribute(): int
    {
        return (int) $this->orders()->where('payment_status', 'paid')->sum('grand_total');
    }
}
