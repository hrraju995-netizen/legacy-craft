<?php
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

$baseDir = dirname(__DIR__);
$repoDir = dirname($baseDir);
if (!is_dir($repoDir . '/.git') && is_dir($baseDir . '/.git')) {
    $repoDir = $baseDir;
}

$results = [];

// 1. Git Pull
$gitOutput = 'Git command not run';
if (function_exists('shell_exec')) {
    $gitOutput = shell_exec("git -C " . escapeshellarg($repoDir) . " pull origin main 2>&1");
    $lastCommit = shell_exec("git -C " . escapeshellarg($repoDir) . " log -1 --oneline 2>&1");
}

// 2. Artisan Migrate & Seed
$artisan = $baseDir . '/artisan';
$php = '/usr/bin/php';
$migrateOutput = '';
$seedOutput = '';
if (file_exists($artisan) && function_exists('shell_exec')) {
    $migrateOutput = shell_exec("$php $artisan migrate --force 2>&1");
    $seedOutput = shell_exec("$php $artisan db:seed --class=SizeSeeder --force 2>&1");
}

// 3. Clear Caches
$cacheFiles = [
    $baseDir . '/bootstrap/cache/routes-v7.php',
    $baseDir . '/bootstrap/cache/routes.php',
    $baseDir . '/bootstrap/cache/config.php',
    $baseDir . '/bootstrap/cache/services.php',
    $baseDir . '/bootstrap/cache/packages.php',
];
$cleared = 0;
foreach ($cacheFiles as $cf) {
    if (file_exists($cf)) {
        if (@unlink($cf)) $cleared++;
    }
}

$filCache = $baseDir . '/bootstrap/cache/filament';
if (is_dir($filCache)) {
    $rdi = new RecursiveDirectoryIterator($filCache, RecursiveDirectoryIterator::SKIP_DOTS);
    $rii = new RecursiveIteratorIterator($rdi, RecursiveIteratorIterator::CHILD_FIRST);
    foreach ($rii as $item) {
        if ($item->isFile()) {
            @unlink($item->getRealPath());
            $cleared++;
        } elseif ($item->isDir()) {
            @rmdir($item->getRealPath());
        }
    }
    @rmdir($filCache);
}

if (function_exists('opcache_reset')) {
    @opcache_reset();
}

$response = [
    'success' => true,
    'timestamp' => date('Y-m-d H:i:s'),
    'last_commit' => trim($lastCommit ?? ''),
    'git_pull' => trim($gitOutput ?? ''),
    'migrate' => trim($migrateOutput ?? ''),
    'seed' => trim($seedOutput ?? ''),
    'caches_cleared' => $cleared,
];

if (isset($_GET['json'])) {
    header('Content-Type: application/json');
    echo json_encode($response, JSON_PRETTY_PRINT);
    exit;
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Server Deployment Status</title>
    <style>
        body { font-family: monospace; background: #0f172a; color: #f8fafc; padding: 24px; font-size: 14px; }
        .card { background: #1e293b; padding: 18px 24px; border-radius: 8px; margin-bottom: 16px; border: 1px solid #334155; }
        h2 { color: #38bdf8; margin-top: 0; }
        pre { background: #090d16; padding: 12px; border-radius: 6px; overflow-x: auto; color: #4ade80; }
        .badge { background: #0284c7; color: white; padding: 3px 8px; border-radius: 4px; font-weight: bold; }
    </style>
</head>
<body>
    <div class="card">
        <h2>🚀 Deployment & Sync Complete</h2>
        <p><strong>Timestamp:</strong> <?= $response['timestamp'] ?></p>
        <p><strong>Current Commit:</strong> <span class="badge"><?= htmlspecialchars($response['last_commit']) ?></span></p>
    </div>

    <div class="card">
        <h3>1. Git Pull Output</h3>
        <pre><?= htmlspecialchars($response['git_pull']) ?></pre>
    </div>

    <div class="card">
        <h3>2. Migration Output</h3>
        <pre><?= htmlspecialchars($response['migrate'] ?: 'No output') ?></pre>
    </div>

    <div class="card">
        <h3>3. SizeSeeder Output</h3>
        <pre><?= htmlspecialchars($response['seed'] ?: 'No output') ?></pre>
    </div>

    <div class="card">
        <h3>4. Cache Clearing</h3>
        <p>Cleared <?= $response['caches_cleared'] ?> bootstrap and Filament cache files. OPcache reset performed.</p>
        <p><a href="/admin/sizes" target="_blank" style="color:#38bdf8; font-weight:bold;">&rarr; Open /admin/sizes in Admin Panel</a></p>
    </div>
</body>
</html>
