<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
    protected $guarded = [];

    protected $casts = [
        'value' => 'integer',
        'min_order_total' => 'integer',
        'max_discount' => 'integer',
        'is_active' => 'boolean',
        'starts_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    public function isValidFor(int $subtotal): bool
    {
        if (! $this->is_active) {
            return false;
        }
        if ($this->starts_at && $this->starts_at->isFuture()) {
            return false;
        }
        if ($this->expires_at && $this->expires_at->isPast()) {
            return false;
        }
        if ($this->usage_limit && $this->used_count >= $this->usage_limit) {
            return false;
        }
        if ($this->min_order_total && $subtotal < $this->min_order_total) {
            return false;
        }

        return true;
    }

    /** Discount in paisa for a given subtotal. Never exceeds the subtotal. */
    public function discountFor(int $subtotal): int
    {
        if (! $this->isValidFor($subtotal)) {
            return 0;
        }

        $discount = match ($this->type) {
            'percentage' => (int) round($subtotal * $this->value / 100),
            'fixed' => $this->value,
            default => 0, // free_shipping is applied to the shipping line instead
        };

        if ($this->max_discount) {
            $discount = min($discount, $this->max_discount);
        }

        return min($discount, $subtotal);
    }
}
