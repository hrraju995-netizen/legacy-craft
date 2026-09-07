<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Page extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'blocks' => 'array',
        'is_published' => 'boolean',
        'show_in_footer' => 'boolean',
        'published_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::saved(function () {
            \Illuminate\Support\Facades\Cache::forget('api.site.config');
        });
        static::deleted(function () {
            \Illuminate\Support\Facades\Cache::forget('api.site.config');
        });
    }

    public function scopePublished($q) { return $q->where('is_published', true); }
    public function getRouteKeyName(): string { return 'slug'; }
}
