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

    /** Variants fall back to the parent product's price when unset. */
    public function getEffectivePriceAttribute(): int
    {
        return $this->price ?? $this->product->price;
    }
}
