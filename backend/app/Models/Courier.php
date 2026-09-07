<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Courier extends Model
{
    protected $guarded = [];

    protected $hidden = ['api_key', 'api_secret'];

    protected $casts = [
        // Credentials are encrypted at rest — they must never sit in plain
        // text in the database or leak through an API response.
        'api_key' => 'encrypted',
        'api_secret' => 'encrypted',
        'settings' => 'array',
        'is_active' => 'boolean',
        'is_default' => 'boolean',
    ];

    public function consignments()
    {
        return $this->hasMany(Consignment::class);
    }

    public function scopeActive($q)
    {
        return $q->where('is_active', true);
    }
}
