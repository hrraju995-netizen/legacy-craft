<?php
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Http\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Artisan;

echo "<!DOCTYPE html><html><head><title>Database Migration & Cache Clear</title>";
echo "<style>body{font-family:monospace;background:#0f172a;color:#f8fafc;padding:24px;line-height:1.6;}";
echo ".card{background:#1e293b;padding:16px 20px;border-radius:8px;margin-bottom:16px;border:1px solid #334155;}";
echo "pre{background:#090d16;padding:12px;border-radius:6px;color:#4ade80;overflow-x:auto;}";
echo "h1,h2{color:#38bdf8;} a{color:#38bdf8;text-decoration:none;font-weight:bold;}</style></head><body>";

echo "<h1>🚀 Look Studio BD — Database Migration & Optimize</h1>";

echo "<div class='card'><h2>1. Run Database Migrations</h2>";
try {
    Artisan::call('migrate', ['--force' => true]);
    $out = trim(Artisan::output());
    echo "<pre>" . htmlspecialchars($out ?: 'Database already up to date.') . "</pre>";
} catch (\Throwable $e) {
    echo "<p style='color:#f87171;'><strong>Error:</strong> " . htmlspecialchars($e->getMessage()) . "</p>";
}
echo "</div>";

echo "<div class='card'><h2>2. Seed Default Sizes</h2>";
try {
    Artisan::call('db:seed', ['--class' => 'SizeSeeder', '--force' => true]);
    $out = trim(Artisan::output());
    echo "<pre>" . htmlspecialchars($out ?: 'SizeSeeder completed.') . "</pre>";
} catch (\Throwable $e) {
    echo "<p style='color:#f87171;'><strong>Error:</strong> " . htmlspecialchars($e->getMessage()) . "</p>";
}
echo "</div>";

echo "<div class='card'><h2>3. Clear System Caches</h2>";
try {
    Artisan::call('optimize:clear');
    $out = trim(Artisan::output());
    echo "<pre>" . htmlspecialchars($out ?: 'Caches cleared.') . "</pre>";
} catch (\Throwable $e) {
    echo "<p style='color:#f87171;'><strong>Error:</strong> " . htmlspecialchars($e->getMessage()) . "</p>";
}

// Clear Filament component cache directory if exists
$filCache = dirname(__DIR__) . '/bootstrap/cache/filament';
if (is_dir($filCache)) {
    $rdi = new RecursiveDirectoryIterator($filCache, RecursiveDirectoryIterator::SKIP_DOTS);
    $rii = new RecursiveIteratorIterator($rdi, RecursiveIteratorIterator::CHILD_FIRST);
    foreach ($rii as $item) {
        if ($item->isFile()) @unlink($item->getRealPath());
        elseif ($item->isDir()) @rmdir($item->getRealPath());
    }
    @rmdir($filCache);
    echo "<p style='color:#4ade80;'>✅ Filament Component Cache Directory Cleared.</p>";
}

if (function_exists('opcache_reset')) {
    @opcache_reset();
    echo "<p style='color:#4ade80;'>✅ OPcache Reset.</p>";
}
echo "</div>";

echo "<div class='card'>";
echo "<p><a href='/admin/sizes' target='_blank'>&rarr; Open /admin/sizes in Admin Panel</a> | <a href='/admin' target='_blank'>&rarr; Admin Dashboard</a></p>";
echo "</div>";

echo "</body></html>";
