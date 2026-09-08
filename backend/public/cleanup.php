<?php
// DISK CLEANUP SCRIPT - DELETE AFTER USE
$base = '/home/lookstud/repositories/legacy-craft';
$results = [];

// 1. Truncate Laravel log (does NOT need extra disk space)
$logFile = $base . '/backend/storage/logs/laravel.log';
if (file_exists($logFile)) {
    $before = filesize($logFile);
    file_put_contents($logFile, '');
    $results[] = "✅ Laravel log cleared: " . round($before / 1024 / 1024, 2) . " MB freed";
} else {
    $results[] = "⚠️ Log file not found at: $logFile";
}

// 2. Clear framework cache
$cacheDirs = [
    $base . '/backend/storage/framework/cache/data',
    $base . '/backend/storage/framework/views',
    $base . '/backend/bootstrap/cache',
];
foreach ($cacheDirs as $dir) {
    if (is_dir($dir)) {
        $files = glob($dir . '/*');
        $count = 0;
        foreach ($files as $file) {
            if (is_file($file)) {
                unlink($file);
                $count++;
            }
        }
        $results[] = "✅ Cleared $count files from: $dir";
    }
}

// 3. Delete .git/objects/pack (large git packfiles containing zip blobs)
$gitPack = $base . '/.git/objects/pack';
if (is_dir($gitPack)) {
    $size = 0;
    foreach (glob($gitPack . '/*') as $f) {
        $size += filesize($f);
        unlink($f);
    }
    $results[] = "✅ Git pack files deleted: " . round($size / 1024 / 1024, 2) . " MB freed";
}

// 4. Delete loose git objects
$gitObjects = $base . '/.git/objects';
if (is_dir($gitObjects)) {
    $freed = 0;
    $dirs = glob($gitObjects . '/??');
    foreach ((array)$dirs as $d) {
        foreach (glob($d . '/*') as $f) {
            $freed += filesize($f);
            unlink($f);
        }
    }
    if ($freed > 0) {
        $results[] = "✅ Git loose objects deleted: " . round($freed / 1024 / 1024, 2) . " MB freed";
    }
}

// 5. Delete zip files if found
$zips = [
    '/home/lookstud/backend.zip',
    '/home/lookstud/vendor.zip',
    $base . '/backend.zip',
    $base . '/vendor.zip',
];
foreach ($zips as $z) {
    if (file_exists($z)) {
        $s = filesize($z);
        unlink($z);
        $results[] = "✅ Deleted: $z (" . round($s / 1024 / 1024, 2) . " MB)";
    }
}

// 6. Check current disk usage
$diskFree = disk_free_space('/home/lookstud');
$diskTotal = disk_total_space('/home/lookstud');
$results[] = "💾 Disk free: " . round($diskFree / 1024 / 1024, 2) . " MB / " . round($diskTotal / 1024 / 1024, 2) . " MB";

// Output
echo "<html><body style='font-family:monospace;font-size:14px;padding:20px;'>";
echo "<h2>🧹 Disk Cleanup Result</h2>";
foreach ($results as $r) {
    echo "<p>$r</p>";
}
echo "<hr><p style='color:red;'><strong>⚠️ DELETE THIS FILE NOW: cleanup.php</strong></p>";
echo "</body></html>";
