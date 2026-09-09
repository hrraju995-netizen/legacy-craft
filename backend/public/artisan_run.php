<?php
// MAINTENANCE SCRIPT - DELETE AFTER USE
$base = '/home/lookstud/repositories/legacy-craft';
$results = [];

// 1. Delete backend.zip (45MB) from home dir
$zipFiles = [
    '/home/lookstud/backend.zip',
    '/home/lookstud/vendor.zip',
    $base . '/backend.zip',
    $base . '/vendor.zip',
];
foreach ($zipFiles as $zip) {
    if (file_exists($zip)) {
        $size = round(filesize($zip) / 1024 / 1024, 2);
        if (unlink($zip)) {
            $results[] = "✅ Deleted: $zip ($size MB freed)";
        } else {
            $results[] = "❌ Cannot delete: $zip";
        }
    }
}

// 2. Clear laravel.log
$log = $base . '/backend/storage/logs/laravel.log';
if (file_exists($log)) {
    $size = round(filesize($log) / 1024 / 1024, 2);
    file_put_contents($log, '');
    $results[] = "✅ Laravel log cleared ($size MB freed)";
}

// 3. Run php artisan commands
$php = '/usr/bin/php';
$artisan = $base . '/backend/artisan';
$commands = [
    "storage:link" => "$php $artisan storage:link 2>&1",
    "cache:clear" => "$php $artisan cache:clear 2>&1",
    "config:clear" => "$php $artisan config:clear 2>&1",
    "view:clear" => "$php $artisan view:clear 2>&1",
];
foreach ($commands as $name => $cmd) {
    $out = shell_exec($cmd);
    $results[] = "✅ artisan $name: " . trim($out ?? 'done');
}

// 4. Clear framework cache files manually
$cachePaths = [
    $base . '/backend/storage/framework/cache/data',
    $base . '/backend/storage/framework/views',
    $base . '/backend/bootstrap/cache',
];
foreach ($cachePaths as $dir) {
    if (!is_dir($dir)) continue;
    $count = 0;
    foreach (glob("$dir/*") as $f) {
        if (is_file($f)) { unlink($f); $count++; }
    }
    $results[] = "✅ Cleared $count files from " . basename(dirname($dir)) . "/" . basename($dir);
}

// 5. Check storage symlink
$storageLink = $base . '/backend/public/storage';
if (is_link($storageLink)) {
    $results[] = "✅ storage symlink exists → " . readlink($storageLink);
} elseif (is_dir($storageLink)) {
    $results[] = "⚠️ storage is a directory (not symlink)";
} else {
    $results[] = "❌ storage symlink missing!";
}

// 6. Disk status
$free = disk_free_space('/home/lookstud');
$total = disk_total_space('/home/lookstud');
$results[] = "💾 Disk: " . round($free/1024/1024, 1) . " MB free / " . round($total/1024/1024, 1) . " MB total (" . round(($total-$free)/$total*100) . "% used)";

// Output
echo "<html><body style='font-family:monospace;font-size:13px;padding:20px;background:#1a1a1a;color:#eee;'>";
echo "<h2 style='color:#4ade80;'>🔧 Maintenance Result</h2>";
foreach ($results as $r) {
    echo "<p style='margin:4px 0;'>$r</p>";
}
echo "<hr style='border-color:#444;margin:20px 0;'>";
echo "<p style='color:#f87171;'><strong>⚠️ DELETE THIS FILE: https://api.lookstudiobd.com/artisan_run.php</strong></p>";
echo "</body></html>";
