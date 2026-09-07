<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = ['quantity' => 'integer', 'unit_price' => 'integer'];

    public function cart() { return $this->belongsTo(Cart::class); }
    public function product() { return $this->belongsTo(Product::class); }
    public function variant() { return $this->belongsTo(ProductVariant::class, 'product_variant_id'); }

    public function getLineTotalAttribute(): int
    {
        return $this->unit_price * $this->quantity;
    }
}
