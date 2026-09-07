<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShippingZone extends Model
{
    protected $guarded = [];

    protected $casts = [
        'rate' => 'integer',
        'free_above' => 'integer',
        'is_active' => 'boolean',
        'is_default' => 'boolean',
    ];

    public function areas()
    {
        return $this->hasMany(ShippingArea::class);
    }

    public function scopeActive($q)
    {
        return $q->where('is_active', true)->orderBy('position');
    }

    /** Rate for a subtotal, honouring the free-delivery threshold. */
    public function rateFor(int $subtotal): int
    {
        if ($this->free_above && $subtotal >= $this->free_above) {
            return 0;
        }

        return $this->rate;
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
