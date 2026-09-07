<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Cart extends Model
{
    protected $guarded = [];

    protected $casts = ['expires_at' => 'datetime'];

    protected static function booted(): void
    {
        static::creating(function (self $cart) {
            $cart->token ??= (string) Str::uuid();
            $cart->expires_at ??= now()->addDays(30);
        });
    }

    public function items()
    {
        return $this->hasMany(CartItem::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function coupon()
    {
        return $this->belongsTo(Coupon::class);
    }

    public function getSubtotalAttribute(): int
    {
        return $this->items->sum(fn (CartItem $item) => $item->unit_price * $item->quantity);
    }

    public function getItemCountAttribute(): int
    {
        return $this->items->sum('quantity');
    }
}
