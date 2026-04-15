<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'status' => 'Api is Running',
    ]);
});

Route::prefix('api')->group(function () {
    Route::get('/reset-password', function () {
        return view('emails.password-reset');
    })->name('reset-password');
});
