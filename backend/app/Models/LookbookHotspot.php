<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LookbookHotspot extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = ['x' => 'float', 'y' => 'float'];

    protected static function booted(): void
    {
        static::saved(function () {
            \Illuminate\Support\Facades\Cache::forget('api.site.home');
        });

        static::deleted(function () {
            \Illuminate\Support\Facades\Cache::forget('api.site.home');
        });
    }

    public function lookbook() { return $this->belongsTo(Lookbook::class); }
    public function product() { return $this->belongsTo(Product::class); }
}
