<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Partner extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'is_active' => 'boolean',
        'position' => 'integer',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true)->orderBy('position');
    }

    protected static function booted(): void
    {
        static::saved(function () {
            Cache::forget('api.site.home');
        });
        static::deleted(function () {
            Cache::forget('api.site.home');
        });
    }

    public function getLogoUrlAttribute(): ?string
    {
        if ($this->logo) {
            return Product::resolveImageUrl($this->logo);
        }
        return null;
    }
}
