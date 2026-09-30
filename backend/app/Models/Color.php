<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Support\Str;

class Color extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = ['is_active' => 'boolean'];

    protected static function booted(): void
    {
        static::saving(function (self $color) {
            if (blank($color->slug)) {
                $color->slug = Str::slug($color->name ?: 'color-' . time());
            } else {
                $color->slug = Str::slug($color->slug);
            }
        });
    }

    public function variants() { return $this->hasMany(ProductVariant::class); }
}
