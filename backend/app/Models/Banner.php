<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Banner extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'is_active' => 'boolean',
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::saved(function () {
            \Illuminate\Support\Facades\Cache::forget('api.site.home');
        });
        static::deleted(function () {
            \Illuminate\Support\Facades\Cache::forget('api.site.home');
        });
    }

    /** Only banners that are on and inside their schedule window. */
    public function scopeLive($q)
    {
        $now = now();

        return $q->where('is_active', true)
            ->where(fn ($s) => $s->whereNull('starts_at')->orWhere('starts_at', '<=', $now))
            ->where(fn ($s) => $s->whereNull('ends_at')->orWhere('ends_at', '>=', $now))
            ->orderBy('position');
    }
}
