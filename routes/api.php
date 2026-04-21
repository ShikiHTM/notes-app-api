<?php

use App\Http\Controllers\Api\LabelController;
use App\Http\Controllers\Api\NoteController;
use App\Http\Controllers\Api\NoteImageController;
use App\Http\Controllers\Api\PasswordResetController;
use App\Http\Controllers\Api\VerificationController;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

Route::prefix('v1')->group(function () {
    Route::prefix('auth')->group(function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);
        Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLinkEmail']);
        Route::post('/reset-password', [PasswordResetController::class, 'reset']);
    });

    Route::get('/email/verify/{id}/{hash}', [VerificationController::class, 'verify'])
        ->name('verification.verify');

    Route::middleware('auth:sanctum')->group(function () {

        Route::prefix('auth')->group(function() {
            Route::post('/logout', [AuthController::class, 'logout']);
            Route::post('/email/verification-notification', [VerificationController::class, 'resend'])
                ->middleware('throttle:6,1');
        });

        Route::get('/me', [AuthController::class, 'me']);

        // Image CRUD
        Route::apiResource('images', NoteImageController::class)->only(['index', 'store', 'destroy']);
        Route::post('/images/{id}', [NoteImageController::class, 'update']);

        Route::apiResource('notes', NoteController::class);

        Route::apiResource('labels', LabelController::class);
    });
});
