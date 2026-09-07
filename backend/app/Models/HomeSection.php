<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HomeSection extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = ['settings' => 'array', 'is_active' => 'boolean'];

    public function scopeActive($q) { return $q->where('is_active', true)->orderBy('position'); }
}
