<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = ['is_active' => 'boolean'];

    public function products() { return $this->hasMany(Product::class); }
    public function getRouteKeyName(): string { return 'slug'; }
}
