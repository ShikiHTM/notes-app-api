<?php

use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Kiểm tra xem web có đang ở chế độ bảo trì không...
if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}

// Gọi file autoload của Composer...
require __DIR__.'/../vendor/autoload.php';

// Khởi động Laravel và xử lý Request...
(require_once __DIR__.'/../bootstrap/app.php')
    ->handleRequest(Request::capture());