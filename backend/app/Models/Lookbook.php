<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lookbook extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = ['is_active' => 'boolean'];

    protected static function booted(): void
    {
        static::saving(function (self $lookbook) {
            if (blank($lookbook->slug)) {
                $lookbook->slug = \Illuminate\Support\Str::slug($lookbook->title ?: 'lookbook-'.time());
            }
        });

        static::saved(function () {
            \Illuminate\Support\Facades\Cache::forget('api.site.home');
        });

        static::deleted(function () {
            \Illuminate\Support\Facades\Cache::forget('api.site.home');
        });
    }

    public function hotspots() { return $this->hasMany(LookbookHotspot::class); }
}
