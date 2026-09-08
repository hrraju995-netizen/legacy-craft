<?php
// Temporary file - DELETE AFTER USE
$output = shell_exec('cd /home/lookstud/repositories/legacy-craft/backend && /usr/bin/php artisan config:clear && /usr/bin/php artisan cache:clear && /usr/bin/php artisan route:clear 2>&1');
echo '<pre>' . htmlspecialchars($output ?? 'No output') . '</pre>';
echo '<p style="color:green">Done! Delete this file now.</p>';
