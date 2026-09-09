<?php
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

$baseDir = dirname(__DIR__);
$results = [];

echo "<html><head><title>Article Resource & Route Diagnostic</title>";
echo "<style>body { font-family: monospace; padding: 20px; background: #0f172a; color: #f8fafc; font-size: 14px; line-height: 1.6; }
.card { background: #1e293b; padding: 15px 20px; border-radius: 8px; margin-bottom: 15px; border: 1px solid #334155; }
.success { color: #4ade80; } .danger { color: #f87171; } .warning { color: #fbbf24; }
h2, h3 { margin-top: 0; color: #38bdf8; } pre { background: #090d16; padding: 12px; border-radius: 6px; overflow-x: auto; color: #a5f3fc; }
a.btn { display: inline-block; background: #0284c7; color: white; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-weight: bold; margin-top: 10px; }
</style></head><body>";

echo "<h1>🔍 Look Studio BD — Article & Filament Diagnostic</h1>";

// 1. Check physical files on server
echo "<div class='card'>";
echo "<h3>1. Physical Files on Live Server</h3>";
$filesToCheck = [
    'app/Models/Article.php' => $baseDir . '/app/Models/Article.php',
    'app/Filament/Resources/Articles/ArticleResource.php' => $baseDir . '/app/Filament/Resources/Articles/ArticleResource.php',
    'app/Filament/Resources/Articles/Pages/ListArticles.php' => $baseDir . '/app/Filament/Resources/Articles/Pages/ListArticles.php',
    'app/Filament/Resources/Articles/Pages/CreateArticle.php' => $baseDir . '/app/Filament/Resources/Articles/Pages/CreateArticle.php',
    'app/Filament/Resources/Articles/Pages/EditArticle.php' => $baseDir . '/app/Filament/Resources/Articles/Pages/EditArticle.php',
    'app/Filament/Resources/Articles/Schemas/ArticleForm.php' => $baseDir . '/app/Filament/Resources/Articles/Schemas/ArticleForm.php',
    'app/Filament/Resources/Articles/Tables/ArticlesTable.php' => $baseDir . '/app/Filament/Resources/Articles/Tables/ArticlesTable.php',
    'app/Providers/Filament/AdminPanelProvider.php' => $baseDir . '/app/Providers/Filament/AdminPanelProvider.php',
];

$allFilesExist = true;
foreach ($filesToCheck as $name => $path) {
    if (file_exists($path)) {
        $mtime = date('Y-m-d H:i:s', filemtime($path));
        $size = filesize($path);
        echo "<span class='success'>✅ EXISTS</span>: <code>$name</code> ($size bytes, modified: $mtime)<br>";
    } else {
        echo "<span class='danger'>❌ MISSING</span>: <code>$name</code><br>";
        $allFilesExist = false;
    }
}

if (!$allFilesExist) {
    echo "<p class='danger'><strong>⚠️ WARNING: Some Article files do not exist on the live server yet! The server repository has NOT been updated with the latest git push!</strong></p>";
}
echo "</div>";

// 2. Check Git status on server (if shell_exec available)
echo "<div class='card'>";
echo "<h3>2. Server Git Status & Pull</h3>";
if (function_exists('shell_exec')) {
    $repoDir = dirname($baseDir);
    if (!is_dir($repoDir . '/.git') && is_dir($baseDir . '/.git')) {
        $repoDir = $baseDir;
    }
    
    $lastCommit = trim((string) @shell_exec("git -C " . escapeshellarg($repoDir) . " log -1 --oneline 2>&1"));
    echo "Current Server Git Commit: <code>$lastCommit</code><br>";

    // If user requested pull via ?pull=1
    if (isset($_GET['pull'])) {
        echo "<h4>Running git pull...</h4>";
        $pullOut = @shell_exec("git -C " . escapeshellarg($repoDir) . " pull origin main 2>&1");
        echo "<pre>" . htmlspecialchars((string) $pullOut) . "</pre>";
    } else {
        echo "<a class='btn' href='?pull=1'>🚀 Force Git Pull on Server Now</a>";
    }
} else {
    echo "<span class='warning'>shell_exec is disabled. Cannot run git commands directly.</span>";
}
echo "</div>";

// 3. Cache & Optimization Clear
echo "<div class='card'>";
echo "<h3>3. Cache Clearing</h3>";
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
        if (@unlink($cf)) {
            echo "<span class='success'>✅ Deleted cached file</span>: " . basename($cf) . "<br>";
            $cleared++;
        }
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
    echo "<span class='success'>✅ Deleted Filament Panel Component Cache</span><br>";
}

if (function_exists('opcache_reset')) {
    @opcache_reset();
    echo "<span class='success'>✅ OPcache successfully reset</span><br>";
}
echo "<p>Total cache files cleared: <strong>$cleared</strong></p>";
echo "</div>";

// 4. Bootstrap Laravel and Inspect Filament
echo "<div class='card'>";
echo "<h3>4. Laravel Framework & Filament Panel Inspection</h3>";
try {
    require $baseDir . '/vendor/autoload.php';
    $app = require_once $baseDir . '/bootstrap/app.php';
    $kernel = $app->make(\Illuminate\Contracts\Http\Kernel::class);
    $kernel->bootstrap();

    // Check Article model
    if (class_exists(\App\Models\Article::class)) {
        $count = \App\Models\Article::count();
        echo "<span class='success'>✅ Article Model</span>: Connected to database. Total articles in DB: <strong>$count</strong><br>";
    } else {
        echo "<span class='danger'>❌ Article Model class does not exist!</span><br>";
    }

    // Check Filament Panel
    $panel = \Filament\Facades\Filament::getPanel('admin');
    $resources = $panel->getResources();
    echo "<h4>Registered Resources in 'admin' Panel (" . count($resources) . "):</h4><ul>";
    $hasArticleResource = false;
    foreach ($resources as $res) {
        $isArt = ($res === \App\Filament\Resources\Articles\ArticleResource::class);
        if ($isArt) $hasArticleResource = true;
        echo "<li>" . ($isArt ? "<strong style='color:#4ade80;'>★ " . htmlspecialchars($res) . " (FOUND!)</strong>" : htmlspecialchars($res)) . "</li>";
    }
    echo "</ul>";

    if ($hasArticleResource) {
        echo "<p class='success'><strong>🎉 ArticleResource is REGISTERED in Filament!</strong></p>";
        echo "<p>Navigation items check: ";
        try {
            $navItems = \App\Filament\Resources\Articles\ArticleResource::getNavigationItems();
            echo "<span class='success'>Generated " . count($navItems) . " navigation item(s).</span></p>";
            foreach ($navItems as $ni) {
                echo "Label: <strong>" . $ni->getLabel() . "</strong> | Group: <strong>" . $ni->getGroup() . "</strong> | URL: <a href='" . $ni->getUrl() . "' target='_blank' style='color:#38bdf8;'>" . $ni->getUrl() . "</a><br>";
            }
        } catch (\Throwable $ne) {
            echo "<span class='danger'>Error generating navigation: " . htmlspecialchars($ne->getMessage()) . "</span></p>";
        }
    } else {
        echo "<p class='danger'><strong>❌ ArticleResource is NOT registered in the admin panel!</strong></p>";
    }

    // Check Routes
    echo "<h4>Routes matching 'articles':</h4>";
    $router = $app->make('router');
    $matchedRoutes = [];
    foreach ($router->getRoutes() as $r) {
        if (str_contains($r->uri(), 'articles')) {
            $matchedRoutes[] = [
                'methods' => implode('|', $r->methods()),
                'uri' => $r->uri(),
                'name' => $r->getName(),
                'action' => $r->getActionName(),
            ];
        }
    }

    if (empty($matchedRoutes)) {
        echo "<p class='danger'>No routes registered containing 'articles'.</p>";
    } else {
        echo "<ul>";
        foreach ($matchedRoutes as $mr) {
            echo "<li><code>[{$mr['methods']}] /{$mr['uri']}</code> &rarr; <em>{$mr['name']}</em> ({$mr['action']})</li>";
        }
        echo "</ul>";
    }

} catch (\Throwable $e) {
    echo "<span class='danger'>Framework Inspection Exception: " . htmlspecialchars($e->getMessage()) . "</span>";
    echo "<pre>" . htmlspecialchars($e->getTraceAsString()) . "</pre>";
}
echo "</div>";

echo "<div class='card'>";
echo "<a class='btn' href='/admin/articles' target='_blank'>Go to /admin/articles &rarr;</a> ";
echo "<a class='btn' href='/admin' target='_blank' style='background:#475569;'>Open Admin Dashboard &rarr;</a>";
echo "</div>";

echo "</body></html>";
