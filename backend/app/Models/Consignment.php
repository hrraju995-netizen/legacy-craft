<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Consignment extends Model
{
    protected $guarded = [];

    protected $casts = [
        'cod_amount' => 'integer',
        'request_payload' => 'array',
        'response_payload' => 'array',
        'dispatched_at' => 'datetime',
        'delivered_at' => 'datetime',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function courier()
    {
        return $this->belongsTo(Courier::class);
    }
}
