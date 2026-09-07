<?php

namespace App\Services\Courier;

use App\Models\Consignment;
use App\Models\Order;

/**
 * Contract every courier integration implements. Adding Pathao or RedX later
 * means writing one class — no changes anywhere else in the app.
 */
interface CourierDriver
{
    public function createConsignment(Order $order, array $options = []): Consignment;

    public function trackStatus(Consignment $consignment): string;

    public function handleWebhook(array $payload): void;
}
