<?php
/**
 * Self-contained diagnostic deployment script.
 * Upload to backend/public/ and access via https://api.lookstudiobd.com/deploy_diagnostic.php
 * 
 * This writes the db-diagnostic route into web.php if it doesn't exist,
 * and then redirects to the diagnostic endpoint.
 */

$webPhpPath = __DIR__ . '/../routes/web.php';
$content = file_get_contents($webPhpPath);

if (strpos($content, '/db-diagnostic') === false) {
    $diagnosticRoute = <<<'PHP'

/**
 * Database diagnostic endpoint to inspect current product/variant/image state.
 */
Route::get('/db-diagnostic', function () {
    $products = \App\Models\Product::with(['images', 'variants.color', 'variants.size', 'category'])->get();

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

    $colors = \App\Models\Color::all(['id', 'name', 'hex']);
    $sizes = \Illuminate\Support\Facades\Schema::hasTable('sizes')
        ? \Illuminate\Support\Facades\DB::table('sizes')->get()
        : 'sizes table does not exist';

    // Check storage files
    $storagePath = storage_path('app/public/products');
    $storageFiles = is_dir($storagePath) ? array_diff(scandir($storagePath) ?: [], ['.', '..']) : [];

    return response()->json([
        'total_products' => $products->count(),
        'active_products' => $products->where('is_active', true)->count(),
        'products_with_unsplash' => $productSummary->where('has_unsplash_images', true)->count(),
        'products_with_uploaded_images' => $productSummary->where('has_uploaded_images', true)->count(),
        'storage_product_files' => count($storageFiles),
        'storage_product_samples' => array_slice(array_values($storageFiles), 0, 20),
        'colors' => $colors,
        'sizes' => $sizes,
        'products' => $productSummary,
        'db_path' => config('database.connections.sqlite.database', 'N/A'),
        'env_app_url' => config('app.url'),
    ], 200, [], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
});
PHP;

    file_put_contents($webPhpPath, $content . $diagnosticRoute);
    echo "Diagnostic route added to web.php\n";
} else {
    echo "Diagnostic route already exists in web.php\n";
}

echo "Redirecting to /db-diagnostic...\n";
header('Location: /db-diagnostic');
exit;
