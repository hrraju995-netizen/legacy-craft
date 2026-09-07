<?php

namespace App\Services\Courier;

use App\Models\Courier;
use InvalidArgumentException;

/** Resolves a Courier record to its driver implementation. */
class CourierManager
{
    protected array $drivers = [
        'steadfast' => SteadfastDriver::class,
    ];

    public function driver(?Courier $courier = null): CourierDriver
    {
        $courier ??= Courier::active()->where('is_default', true)->first()
            ?? Courier::active()->first();

        if (! $courier) {
            throw new InvalidArgumentException('No active courier is configured.');
        }

        $class = $this->drivers[$courier->code] ?? null;

        if (! $class) {
            throw new InvalidArgumentException("No driver for courier [{$courier->code}].");
        }

        return new $class($courier);
    }

    public function extend(string $code, string $class): void
    {
        $this->drivers[$code] = $class;
    }
}
