<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Order extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = [];

    protected $casts = [
        'subtotal' => 'integer',
        'discount_total' => 'integer',
        'shipping_total' => 'integer',
        'tax_total' => 'integer',
        'grand_total' => 'integer',
        'confirmed_at' => 'datetime',
        'shipped_at' => 'datetime',
        'delivered_at' => 'datetime',
        'cancelled_at' => 'datetime',
    ];

    public const STATUSES = [
        'pending' => 'Pending',
        'confirmed' => 'Confirmed',
        'processing' => 'Processing',
        'ready_to_ship' => 'Ready to Ship',
        'shipped' => 'Shipped',
        'delivered' => 'Delivered',
        'cancelled' => 'Cancelled',
        'returned' => 'Returned',
        'refunded' => 'Refunded',
    ];

    protected static function booted(): void
    {
        static::creating(function (self $order) {
            $order->order_number ??= static::generateNumber();
        });
    }

    public static function generateNumber(): string
    {
        do {
            $number = 'LCS-'.now()->format('ymd').'-'.random_int(1000, 9999);
        } while (static::where('order_number', $number)->exists());

        return $number;
    }

    /* ------------------------------------------------------------ relations */

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function coupon()
    {
        return $this->belongsTo(Coupon::class);
    }

    public function shippingZone()
    {
        return $this->belongsTo(ShippingZone::class);
    }

    public function consignments()
    {
        return $this->hasMany(Consignment::class);
    }

    public function statusHistories()
    {
        return $this->hasMany(OrderStatusHistory::class)->latest();
    }

    /* -------------------------------------------------------------- helpers */

    /**
     * Single entry point for status changes so the audit trail and timestamps
     * can never drift out of sync with the status column.
     */
    public function changeStatus(string $to, ?string $comment = null, ?int $userId = null): void
    {
        $from = $this->status;

        if ($from === $to) {
            return;
        }

        $this->status = $to;

        match ($to) {
            'confirmed' => $this->confirmed_at ??= now(),
            'shipped' => $this->shipped_at ??= now(),
            'delivered' => $this->delivered_at ??= now(),
            'cancelled' => $this->cancelled_at ??= now(),
            default => null,
        };

        $this->save();

        $this->statusHistories()->create([
            'user_id' => $userId ?? auth()->id(),
            'from_status' => $from,
            'to_status' => $to,
            'comment' => $comment,
        ]);
    }

    public function recalculateTotals(): void
    {
        $this->subtotal = $this->items->sum('line_total');
        $this->grand_total = max(
            0,
            $this->subtotal - $this->discount_total + $this->shipping_total + $this->tax_total
        );
        $this->save();
    }

    public function getRouteKeyName(): string
    {
        return 'order_number';
    }
}
