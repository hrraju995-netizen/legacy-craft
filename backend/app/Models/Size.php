<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Size extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'is_active' => 'boolean',
        'position' => 'integer',
    ];

    protected static function booted(): void
    {
        static::saving(function (self $size) {
            if (blank($size->slug)) {
                $size->slug = Str::slug($size->name ?: 'size-' . time());
            } else {
                $size->slug = Str::slug($size->slug);
            }
        });
    }

    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }
}
