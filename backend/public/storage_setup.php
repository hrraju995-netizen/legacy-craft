<?php
/**
 * Comprehensive Storage & Media Setup for Look Studio BD (Laravel Backend)
 * 
 * - Cleans and creates the public/storage symlink
 * - Clears route, config, and API caches (api.site.home, api.site.config)
 * - Ensures all media folders exist with proper permissions (products, banners, sliders, categories, etc.)
 * - Inspects each directory and outputs sample clickable URLs
 * - Checks and cleans any localhost URLs in the database
 */

declare(strict_types=1);

error_reporting(E_ALL);
ini_set('display_errors', '1');

$baseDir = dirname(__DIR__);
$results = [];

// 1. Clear cached routes and configs
$cacheFiles = [
    $baseDir . '/bootstrap/cache/routes-v7.php',
    $baseDir . '/bootstrap/cache/config.php',
    $baseDir . '/bootstrap/cache/services.php',
    $baseDir . '/bootstrap/cache/packages.php',
];

$clearedCaches = 0;
foreach ($cacheFiles as $cf) {
    if (file_exists($cf)) {
        if (@unlink($cf)) {
            $clearedCaches++;
        }
    }
}
$results[] = [
    'type' => 'success',
    'msg' => "Cleared $clearedCaches bootstrap cache file(s) (route & config cache refreshed).",
];

// 2. Clear framework cache data files
$dataCacheDir = $baseDir . '/storage/framework/cache/data';
if (is_dir($dataCacheDir)) {
    $rdi = new RecursiveDirectoryIterator($dataCacheDir, RecursiveDirectoryIterator::SKIP_DOTS);
    $rii = new RecursiveIteratorIterator($rdi, RecursiveIteratorIterator::CHILD_FIRST);
    $clearedData = 0;
    foreach ($rii as $file) {
        if ($file->isFile()) {
            @unlink($file->getRealPath());
            $clearedData++;
        }
    }
    $results[] = [
        'type' => 'success',
        'msg' => "Cleared $clearedData cached data file(s) (including api.site.home & api.site.config).",
    ];
}

// 3. Resolve storage and public paths
$storageTarget = realpath($baseDir . '/storage/app/public') ?: ($baseDir . '/storage/app/public');
$publicLink = __DIR__ . '/storage';

if (! is_dir($storageTarget)) {
    @mkdir($storageTarget, 0755, true);
}

// 4. Handle public/storage symlink
if (is_link($publicLink)) {
    $currentTarget = readlink($publicLink);
    if ($currentTarget === $storageTarget || realpath($currentTarget) === realpath($storageTarget)) {
        $results[] = ['type' => 'success', 'msg' => "Storage symlink already valid &rarr; <code>$currentTarget</code>"];
    } else {
        @unlink($publicLink);
        $results[] = ['type' => 'warning', 'msg' => "Removed outdated symlink pointing to <code>$currentTarget</code>"];
    }
} elseif (is_dir($publicLink)) {
    $items = array_diff(scandir($publicLink) ?: [], ['.', '..']);
    if (empty($items)) {
        @rmdir($publicLink);
    } else {
        $results[] = ['type' => 'warning', 'msg' => "<code>public/storage</code> is a physical folder with " . count($items) . " items. Web fallback route will handle storage paths."];
    }
} elseif (file_exists($publicLink)) {
    @unlink($publicLink);
}

if (! is_link($publicLink)) {
    if (function_exists('symlink')) {
        $created = @symlink($storageTarget, $publicLink);
        if ($created) {
            $results[] = ['type' => 'success', 'msg' => "Successfully created symlink: <code>public/storage</code> &rarr; <code>$storageTarget</code>"];
        } else {
            $err = error_get_last()['message'] ?? 'unknown error';
            $results[] = ['type' => 'warning', 'msg' => "Native symlink notice ($err). Laravel dynamic fallback route <code>/storage/{path}</code> will serve all images seamlessly."];
        }
    } else {
        $results[] = ['type' => 'warning', 'msg' => "<code>symlink()</code> function is disabled on this server. Laravel dynamic fallback route <code>/storage/{path}</code> will serve all images."];
    }
}

// 5. Ensure all media subdirectories exist and check files
$folders = [
    'banners' => 'Homepage & Promo Banners',
    'banners/backgrounds' => 'Banner Background Textures',
    'banners/mobile' => 'Mobile Banners',
    'sliders' => 'Hero Sliders',
    'sliders/mobile' => 'Mobile Sliders',
    'categories' => 'Category Tiles',
    'categories/banners' => 'Category Top Banners',
    'products' => 'Product Images',
    'rooms' => 'Room Inspiration Images',
    'lookbooks' => 'Lookbook Scenes',
    'settings' => 'Site Settings & Logos',
    'avatars' => 'User & Customer Avatars',
    'partners' => 'Partner Logos',
];

$folderStats = [];
foreach ($folders as $dir => $label) {
    $dirPath = $storageTarget . '/' . $dir;
    if (! is_dir($dirPath)) {
        @mkdir($dirPath, 0755, true);
    }
    @chmod($dirPath, 0755);

    $files = array_diff(scandir($dirPath) ?: [], ['.', '..']);
    // Filter to only actual files
    $files = array_filter($files, fn($f) => is_file($dirPath . '/' . $f));

    $folderStats[] = [
        'dir' => $dir,
        'label' => $label,
        'count' => count($files),
        'samples' => array_slice(array_values($files), 0, 4),
    ];
}

// 6. Inspect SQLite database for localhost URLs and fix them if present
$sqliteFile = $baseDir . '/database/database.sqlite';
$cleanedRows = 0;
if (file_exists($sqliteFile) && extension_loaded('pdo_sqlite')) {
    try {
        $pdo = new PDO("sqlite:" . $sqliteFile);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Clean localhost from banners
        $stmt = $pdo->query("SELECT id, image, mobile_image, bg_image FROM banners");
        $banners = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach ($banners as $b) {
            $updated = false;
            $fields = [];
            foreach (['image', 'mobile_image', 'bg_image'] as $col) {
                if (!empty($b[$col]) && preg_match('#^https?://(localhost|127\.0\.0\.1)(:\d+)?/(.*)$#i', $b[$col], $m)) {
                    $fields[$col] = $m[3];
                    $updated = true;
                }
            }
            if ($updated) {
                $setSql = implode(', ', array_map(fn($k) => "$k = :$k", array_keys($fields)));
                $upStmt = $pdo->prepare("UPDATE banners SET $setSql WHERE id = :id");
                $fields['id'] = $b['id'];
                $upStmt->execute($fields);
                $cleanedRows++;
            }
        }

        // Clean localhost from settings
        $stmt = $pdo->query("SELECT id, key, value FROM settings WHERE value LIKE '%localhost%' OR value LIKE '%127.0.0.1%'");
        $settings = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach ($settings as $s) {
            if (preg_match('#^https?://(localhost|127\.0\.0\.1)(:\d+)?/(.*)$#i', $s['value'], $m)) {
                $cleanVal = $m[3];
                $upStmt = $pdo->prepare("UPDATE settings SET value = :val WHERE id = :id");
                $upStmt->execute(['val' => $cleanVal, 'id' => $s['id']]);
                $cleanedRows++;
            }
        }

        // Ensure favicon exists in settings
        $fCheck = $pdo->prepare("SELECT id, value FROM settings WHERE key = 'favicon'");
        $fCheck->execute();
        $favRow = $fCheck->fetch(PDO::FETCH_ASSOC);
        if (! $favRow) {
            $fIns = $pdo->prepare("INSERT INTO settings (key, value, \"group\", type, label, hint, position, created_at, updated_at) VALUES ('favicon', NULL, 'general', 'image', 'Website Favicon', 'Upload browser tab favicon (.png, .ico, .svg, .webp)', 3, datetime('now'), datetime('now'))");
            $fIns->execute();
            $results[] = ['type' => 'success', 'msg' => "Added <strong>Website Favicon</strong> upload field to General Site Settings."];
        } else {
            $favVal = $favRow['value'];
            if (! empty($favVal)) {
                $cleanFav = ltrim(str_replace(['\\', 'public/', 'storage/'], ['/', '', ''], (string) $favVal), '/');
                if (str_starts_with($cleanFav, '["')) {
                    $dec = json_decode($cleanFav, true);
                    if (! empty($dec[0])) $cleanFav = $dec[0];
                }
                $favFile = $storageTarget . '/' . $cleanFav;
                if (file_exists($favFile)) {
                    @copy($favFile, __DIR__ . '/favicon.ico');
                    $results[] = ['type' => 'success', 'msg' => "✅ Active favicon found: <code>$cleanFav</code> and synced to <code>public/favicon.ico</code>."];
                } else {
                    $results[] = ['type' => 'warning', 'msg' => "⚠️ Favicon setting points to <code>$cleanFav</code>, but file is missing at <code>$favFile</code>. Please re-upload in Site Settings."];
                }
            } else {
                $results[] = ['type' => 'warning', 'msg' => "ℹ️ Favicon setting is currently empty in database. Upload an image in <strong>Site Customization &rarr; Site Settings &rarr; General</strong>."];
            }
        }

        // Ensure articles table exists
        try {
            $pdo->query("SELECT 1 FROM articles LIMIT 1");
            $results[] = ['type' => 'success', 'msg' => "✅ Database table <code>articles</code> is active and ready for blog posting."];
        } catch (\Throwable $e) {
            $pdo->exec("CREATE TABLE IF NOT EXISTS articles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title VARCHAR(255) NOT NULL,
                bangla_title VARCHAR(255) NULL,
                slug VARCHAR(255) NOT NULL UNIQUE,
                category VARCHAR(255) DEFAULT 'Interior Design',
                image VARCHAR(255) NULL,
                excerpt TEXT NULL,
                content TEXT NULL,
                author_name VARCHAR(255) DEFAULT 'Look Studio Design Team',
                author_role VARCHAR(255) DEFAULT 'Senior Interior Architect',
                author_avatar VARCHAR(255) NULL,
                read_time VARCHAR(50) DEFAULT '5 min read',
                tags TEXT NULL,
                related_category_slug VARCHAR(255) NULL,
                is_published INTEGER DEFAULT 1,
                is_featured INTEGER DEFAULT 0,
                published_at DATETIME NULL,
                meta_title VARCHAR(255) NULL,
                meta_description TEXT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )");
            \App\Models\Article::seedDefaults();
            $results[] = ['type' => 'success', 'msg' => "✅ Created <code>articles</code> database table and seeded default articles for blog posts."];
        }

        if ($cleanedRows > 0) {
            $results[] = [
                'type' => 'success',
                'msg' => "Cleaned $cleanedRows database record(s) containing outdated localhost URLs.",
            ];
        }
    } catch (\Throwable $e) {
        // Ignore or report
    }
}

// 7. Render report
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Look Studio BD — Complete Media Setup</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; padding: 24px; margin: 0; line-height: 1.6; }
        .container { max-width: 860px; margin: 0 auto; background: #1e293b; padding: 28px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); border: 1px solid #334155; }
        h1 { margin-top: 0; font-size: 24px; color: #38bdf8; display: flex; align-items: center; gap: 10px; }
        h2 { font-size: 18px; color: #cbd5e1; margin-top: 24px; margin-bottom: 12px; border-bottom: 1px solid #334155; padding-bottom: 6px; }
        .result-card { background: #0f172a; border-left: 4px solid #38bdf8; padding: 12px 16px; margin: 10px 0; border-radius: 0 8px 8px 0; }
        .result-card.success { border-left-color: #10b981; }
        .result-card.warning { border-left-color: #f59e0b; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 12px; margin-top: 14px; }
        .folder-box { background: #0f172a; border: 1px solid #334155; border-radius: 8px; padding: 12px 14px; }
        .folder-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
        .folder-name { font-weight: 600; font-size: 14px; color: #f1f5f9; }
        .count-badge { background: #0369a1; color: #e0f2fe; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: 700; }
        .count-badge.empty { background: #334155; color: #94a3b8; }
        .file-link { display: block; font-family: monospace; font-size: 11px; color: #38bdf8; text-decoration: none; padding: 2px 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .file-link:hover { text-decoration: underline; }
        .btn { display: inline-block; padding: 10px 18px; background: #0284c7; color: white; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 14px; }
        .btn:hover { background: #0369a1; }
        .btn-secondary { background: #334155; margin-left: 8px; }
        .btn-secondary:hover { background: #475569; }
        .danger-box { margin-top: 24px; padding: 14px; background: #450a0a; border: 1px solid #7f1d1d; border-radius: 8px; font-size: 13px; color: #fca5a5; }
    </style>
</head>
<body>
<div class="container">
    <h1>🖼️ Look Studio BD — Media & Storage Setup</h1>
    <p style="color: #94a3b8; margin: 0;">Comprehensive verification for banners, sliders, categories, products, and settings.</p>

    <hr style="border: 0; border-top: 1px solid #334155; margin: 20px 0;">

    <?php foreach ($results as $r): ?>
        <div class="result-card <?= $r['type'] ?>">
            <div><?= $r['msg'] ?></div>
        </div>
    <?php endforeach; ?>

    <h2>📁 Media Storage Directories</h2>
    <div class="grid">
        <?php foreach ($folderStats as $f): ?>
            <div class="folder-box">
                <div class="folder-header">
                    <span class="folder-name"><?= htmlspecialchars($f['label']) ?></span>
                    <span class="count-badge <?= $f['count'] === 0 ? 'empty' : '' ?>"><?= $f['count'] ?> files</span>
                </div>
                <div style="font-size: 11px; color: #64748b; margin-bottom: 6px;">storage/app/public/<?= htmlspecialchars($f['dir']) ?>/</div>
                <?php if (!empty($f['samples'])): ?>
                    <div style="border-top: 1px solid #1e293b; padding-top: 6px;">
                        <?php foreach ($f['samples'] as $sample): ?>
                            <a href="/storage/<?= htmlspecialchars($f['dir']) ?>/<?= urlencode($sample) ?>" target="_blank" class="file-link">
                                🔗 <?= htmlspecialchars($sample) ?> &nearr;
                            </a>
                        <?php endforeach; ?>
                    </div>
                <?php else: ?>
                    <div style="font-size: 12px; color: #64748b; font-style: italic;">No files uploaded yet.</div>
                <?php endif; ?>
            </div>
        <?php endforeach; ?>
    </div>

    <div style="margin-top: 25px;">
        <a href="/admin/sliders" class="btn" target="_blank">Admin Sliders &rarr;</a>
        <a href="/admin/banners" class="btn btn-secondary" target="_blank">Admin Banners &rarr;</a>
        <a href="/admin/categories" class="btn btn-secondary" target="_blank">Admin Categories &rarr;</a>
        <a href="https://lookstudiobd.com" class="btn btn-secondary" target="_blank">View Storefront &rarr;</a>
    </div>

    <div class="danger-box">
        <strong>🔒 Security Notice:</strong> After verifying your banners, sliders, and images, remove <code>backend/public/storage_setup.php</code>.
    </div>
</div>
</body>
</html>
