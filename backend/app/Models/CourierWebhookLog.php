<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CourierWebhookLog extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = ['payload' => 'array', 'processed' => 'boolean'];

    public function courier() { return $this->belongsTo(Courier::class); }
}
