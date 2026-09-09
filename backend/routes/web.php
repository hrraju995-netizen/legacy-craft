<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/admin/orders/{order}/invoice', [App\Http\Controllers\Admin\OrderInvoiceController::class, 'show'])
    ->name('admin.orders.invoice');

Route::get('/orders/{orderNumber}/invoice/download', [App\Http\Controllers\Admin\OrderInvoiceController::class, 'download'])
    ->name('orders.invoice.download');

Route::get('/favicon.ico', function () {
    $raw = \App\Models\Setting::get('favicon') ?: \App\Models\Setting::get('logo');
    if ($raw) {
        if (is_string($raw) && (str_starts_with($raw, '["') || str_starts_with($raw, '[\"'))) {
            $dec = json_decode($raw, true);
            if (is_array($dec)) {
                $raw = (string) (collect($dec)->flatten()->filter()->first() ?? '');
            }
        }
        $clean = ltrim(str_replace(['\\', 'public/', 'storage/'], ['/', '', ''], (string) $raw), '/');
        while (str_starts_with($clean, 'storage/')) {
            $clean = substr($clean, 8);
        }
        while (str_starts_with($clean, 'public/')) {
            $clean = substr($clean, 7);
        }
        $disk = \Illuminate\Support\Facades\Storage::disk('public');
        if (! empty($clean) && $disk->exists($clean)) {
            $filePath = $disk->path($clean);

            return response()->file($filePath, [
                'Content-Type' => mime_content_type($filePath) ?: 'image/x-icon',
                'Cache-Control' => 'no-cache, must-revalidate',
                'Access-Control-Allow-Origin' => '*',
            ]);
        }
    }
    $default = public_path('favicon.ico');
    if (file_exists($default)) {
        return response()->file($default, [
            'Content-Type' => 'image/x-icon',
            'Cache-Control' => 'no-cache, must-revalidate',
            'Access-Control-Allow-Origin' => '*',
        ]);
    }
    abort(404);
});

/**
 * Storage File Server Fallback.
 * Serves files from storage/app/public/ when Apache symlink is missing or blocked.
 * Handles products, banners, sliders, categories, rooms, lookbooks, avatars, and settings.
 */
Route::get('/storage/{path}', function (string $path) {
    // 1. Normalize slashes
    $cleanPath = str_replace('\\', '/', trim($path));
    $cleanPath = ltrim($cleanPath, '/');

    // 2. Prevent directory traversal attacks
    if (str_contains($cleanPath, '..')) {
        abort(403, 'Unauthorized');
    }

    // 3. Strip duplicate "storage/" or "public/" prefixes from incoming URL
    while (str_starts_with($cleanPath, 'storage/')) {
        $cleanPath = substr($cleanPath, 8);
    }
    while (str_starts_with($cleanPath, 'public/')) {
        $cleanPath = substr($cleanPath, 7);
    }

    // 4. Check in storage/app/public/
    $disk = \Illuminate\Support\Facades\Storage::disk('public');
    if ($disk->exists($cleanPath)) {
        $filePath = $disk->path($cleanPath);
        $mimeType = mime_content_type($filePath) ?: 'application/octet-stream';

        return response()->file($filePath, [
            'Content-Type' => $mimeType,
            'Cache-Control' => 'public, max-age=31536000',
            'Access-Control-Allow-Origin' => '*',
            'Access-Control-Allow-Methods' => 'GET, HEAD, OPTIONS',
        ]);
    }

    // 5. Fallback: check public_path() (e.g. for root public files like main-logo.png)
    $publicFile = public_path($cleanPath);
    if (file_exists($publicFile) && ! is_dir($publicFile)) {
        $mimeType = mime_content_type($publicFile) ?: 'application/octet-stream';

        return response()->file($publicFile, [
            'Content-Type' => $mimeType,
            'Cache-Control' => 'public, max-age=31536000',
            'Access-Control-Allow-Origin' => '*',
            'Access-Control-Allow-Methods' => 'GET, HEAD, OPTIONS',
        ]);
    }

    abort(404, 'File not found');
})->where('path', '.*')->name('storage.file');

/**
 * Maintenance route to run storage:link, clear cache, and report all media directories.
 */
Route::get('/admin-storage-link', function () {
    $results = [];
    $target = storage_path('app/public');
    $link = public_path('storage');

    $results['storage_public_dir'] = $target;
    $results['target_exists'] = is_dir($target);
    $results['public_storage_link'] = $link;
    $results['link_exists_before'] = file_exists($link) || is_link($link);

    if (is_link($link)) {
        $results['existing_symlink_points_to'] = readlink($link);
    }

    // Attempt Artisan storage:link
    try {
        \Illuminate\Support\Facades\Artisan::call('storage:link', ['--force' => true]);
        $results['artisan_storage_link_output'] = trim(\Illuminate\Support\Facades\Artisan::output());
    } catch (\Throwable $e) {
        $results['artisan_error'] = $e->getMessage();
    }

    // If symlink still doesn't exist, attempt native PHP symlink
    if (! file_exists($link) && ! is_link($link)) {
        if (function_exists('symlink')) {
            $created = @symlink($target, $link);
            $results['native_php_symlink'] = $created ? 'success' : 'failed: ' . (error_get_last()['message'] ?? 'unknown');
        } else {
            $results['native_php_symlink'] = 'symlink() function is disabled in php.ini';
        }
    }

    $results['link_exists_after'] = file_exists($link) || is_link($link);
    $results['fallback_storage_route'] = 'active';

    // Clear site API caches so fresh image paths are served immediately
    \Illuminate\Support\Facades\Cache::forget('api.site.home');
    \Illuminate\Support\Facades\Cache::forget('api.site.config');
    \Illuminate\Support\Facades\Cache::forget('settings.all');
    $results['api_cache_cleared'] = true;

    // Check all media directories
    $directories = ['products', 'banners', 'banners/backgrounds', 'banners/mobile', 'sliders', 'sliders/mobile', 'categories', 'categories/banners', 'rooms', 'lookbooks', 'settings', 'avatars', 'partners'];
    $mediaCounts = [];
    foreach ($directories as $dir) {
        $fullPath = $target . '/' . $dir;
        if (is_dir($fullPath)) {
            $files = array_diff(scandir($fullPath) ?: [], ['.', '..']);
            $mediaCounts[$dir] = [
                'exists' => true,
                'file_count' => count($files),
                'samples' => array_slice(array_values($files), 0, 5),
            ];
        } else {
            @mkdir($fullPath, 0755, true);
            $mediaCounts[$dir] = ['exists' => false, 'created' => true];
        }
    }
    $results['media_directories'] = $mediaCounts;

    return response()->json($results, 200, [], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
});

