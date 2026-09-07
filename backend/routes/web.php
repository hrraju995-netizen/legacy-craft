<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/admin/orders/{order}/invoice', [App\Http\Controllers\Admin\OrderInvoiceController::class, 'show'])
    ->name('admin.orders.invoice');

Route::get('/orders/{orderNumber}/invoice/download', [App\Http\Controllers\Admin\OrderInvoiceController::class, 'download'])
    ->name('orders.invoice.download');

