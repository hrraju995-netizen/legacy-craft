<?php
/**
 * Database Diagnostic - Standalone PHP script
 * Bootstraps Laravel and inspects the database state
 * Access via: https://api.lookstudiobd.com/db_diagnostic.php
 */

// Bootstrap Laravel
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$response = $kernel->handle($request = Illuminate\Http\Request::capture());

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

header('Content-Type: application/json; charset=utf-8');

try {
    $products = App\Models\Product::with(['images', 'variants.color', 'variants.size', 'category'])->get();

    $productSummary = $products->map(function ($p) {
        $imgPaths = $p->images->map(fn ($i) => $i->path)->all();
        $hasUnsplash = collect($imgPaths)->contains(fn ($path) => str_contains($path ?? '', 'unsplash'));
        $hasUploaded = collect($imgPaths)->contains(fn ($path) => $path && !str_contains($path, 'unsplash') && !str_contains($path, 'http'));

        return [
            'id' => $p->id,
            'name' => $p->name,
            'slug' => $p->slug,
            'category' => $p->category?->name,
            'is_active' => $p->is_active,
            'image_count' => $p->images->count(),
            'image_paths' => $imgPaths,
            'has_unsplash_images' => $hasUnsplash,
            'has_uploaded_images' => $hasUploaded,
            'variant_count' => $p->variants->count(),
            'variants' => $p->variants->map(fn ($v) => [
                'id' => $v->id,
                'name' => $v->name,
                'color' => $v->color?->name,
                'color_hex' => $v->color?->hex,
                'size' => $v->size?->name,
                'image' => $v->image,
                'price' => $v->price,
                'is_active' => $v->is_active,
            ])->all(),
            'created_at' => $p->created_at?->toDateTimeString(),
            'updated_at' => $p->updated_at?->toDateTimeString(),
        ];
    });

    $colors = App\Models\Color::all(['id', 'name', 'hex']);

    $sizesExist = Schema::hasTable('sizes');
    $sizes = $sizesExist ? DB::table('sizes')->get() : 'sizes table does not exist';

    // Check storage files
    $storagePath = storage_path('app/public/products');
    $storageFiles = is_dir($storagePath) ? array_diff(scandir($storagePath) ?: [], ['.', '..']) : [];

    // Check all storage dirs
    $allStorageDirs = ['products', 'banners', 'sliders', 'categories', 'rooms', 'settings'];
    $dirInfo = [];
    foreach ($allStorageDirs as $dir) {
        $path = storage_path('app/public/' . $dir);
        if (is_dir($path)) {
            $files = array_diff(scandir($path) ?: [], ['.', '..']);
            $dirInfo[$dir] = ['exists' => true, 'count' => count($files), 'samples' => array_slice(array_values($files), 0, 5)];
        } else {
            $dirInfo[$dir] = ['exists' => false];
        }
    }

    echo json_encode([
        'status' => 'ok',
        'total_products' => $products->count(),
        'active_products' => $products->where('is_active', true)->count(),
        'products_with_unsplash' => $productSummary->where('has_unsplash_images', true)->count(),
        'products_with_uploaded_images' => $productSummary->where('has_uploaded_images', true)->count(),
        'storage_product_files' => count($storageFiles),
        'storage_product_samples' => array_slice(array_values($storageFiles), 0, 20),
        'storage_directories' => $dirInfo,
        'colors' => $colors,
        'sizes' => $sizes,
        'sizes_table_exists' => $sizesExist,
        'product_variants_table_exists' => Schema::hasTable('product_variants'),
        'products' => $productSummary,
        'db_connection' => config('database.default'),
        'db_path' => config('database.connections.' . config('database.default') . '.database', 'N/A'),
        'env_app_url' => config('app.url'),
        'server_time' => now()->toDateTimeString(),
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

} catch (Throwable $e) {
    echo json_encode([
        'status' => 'error',
        'error' => $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine(),
        'trace' => array_slice(explode("\n", $e->getTraceAsString()), 0, 10),
    ], JSON_PRETTY_PRINT);
}

$kernel->terminate($request, $response);
