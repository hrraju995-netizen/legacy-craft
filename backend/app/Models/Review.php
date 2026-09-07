<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = ['is_approved' => 'boolean', 'rating' => 'integer'];

    public function product() { return $this->belongsTo(Product::class); }
    public function scopeApproved($q) { return $q->where('is_approved', true); }
}
