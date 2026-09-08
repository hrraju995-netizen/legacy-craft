<?php
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

echo "<h2>PHP Diagnostics</h2>";
echo "<b>PHP Version:</b> " . PHP_VERSION . "<br>";
echo "<b>PHP SAPI:</b> " . PHP_SAPI . "<br>";

$extensions = ['pdo', 'pdo_sqlite', 'sqlite3', 'mbstring', 'openssl', 'tokenizer', 'xml', 'ctype', 'json', 'bcmath', 'fileinfo'];
echo "<h3>Extensions:</h3><ul>";
foreach ($extensions as $ext) {
    echo "<li>" . $ext . ": " . (extension_loaded($ext) ? "<span style='color:green'>ENABLED</span>" : "<span style='color:red'>MISSING</span>") . "</li>";
}
echo "</ul>";

echo "<h3>Testing Autoload:</h3>";
try {
    require __DIR__ . '/../vendor/autoload.php';
    echo "<span style='color:green'>Autoload successful!</span><br>";
} catch (\Throwable $e) {
    echo "<span style='color:red'>Autoload Error: " . $e->getMessage() . " in " . $e->getFile() . ":" . $e->getLine() . "</span><br>";
    exit;
}

echo "<h3>Testing Laravel Bootstrap:</h3>";
try {
    $app = require_once __DIR__ . '/../bootstrap/app.php';
    echo "<span style='color:green'>Bootstrap successful!</span><br>";
} catch (\Throwable $e) {
    echo "<span style='color:red'>Bootstrap Error: " . $e->getMessage() . " in " . $e->getFile() . ":" . $e->getLine() . "</span><br>";
    exit;
}

echo "<h3>Testing Kernel Handle:</h3>";
try {
    $kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
    $response = $kernel->handle(
        $request = Illuminate\Http\Request::capture()
    );
    echo "<span style='color:green'>Kernel handle successful! Status code: " . $response->getStatusCode() . "</span><br>";
} catch (\Throwable $e) {
    echo "<span style='color:red'>Kernel Error: " . $e->getMessage() . " in " . $e->getFile() . ":" . $e->getLine() . "</span><br>";
    echo "<pre>" . $e->getTraceAsString() . "</pre>";
}
