<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductVariant extends Model
{
    protected $guarded = [];

    protected $casts = [
        'price' => 'integer',
        'compare_at_price' => 'integer',
        'stock_quantity' => 'integer',
        'is_active' => 'boolean',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function color()
    {
        return $this->belongsTo(Color::class);
    }

    public function size()
    {
        return $this->belongsTo(Size::class);
    }

    /** Variants fall back to the parent product's price when unset. */
    public function getEffectivePriceAttribute(): int
    {
        return $this->price ?? $this->product->price;
    }

    public function getDisplayNameAttribute(): string
    {
        if (!empty($this->name)) {
            return $this->name;
        }

        $parts = array_filter([$this->color?->name, $this->size?->name]);
        return !empty($parts) ? implode(' - ', $parts) : 'Variant';
    }
}
