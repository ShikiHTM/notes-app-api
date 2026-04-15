<?php

use App\Http\Controllers\Api\NoteImageController;
use App\Http\Controllers\Api\PasswordResetController;
use App\Http\Controllers\Api\VerificationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

Route::prefix('v1')->group(function () {
    Route::prefix('auth')->group(function() {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);
        Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLink']);
        Route::post('/reset-password', [PasswordResetController::class, 'resetPassword']);
    });

    Route::get('/email/verify/{id}/{hash}', [VerificationController::class, 'verify'])
        ->name('verification.verify');

    Route::middleware('auth:sanctum')->group(function() {
        Route::prefix('auth')->group(function() {
            Route::post('/logout', [AuthController::class, 'logout']);
            Route::post('/email/verification-notification', [VerificationController::class, 'resend'])
                ->middleware('throttle:6,1')
                ->name('verification.resend');
        });

        Route::prefix('users')->group(function() {
            Route::post('/me', [AuthController::class, 'me']);
        });

        // Image CRUD
        Route::prefix('images')->group(function() {

            // (GET /api/v1/images) Get images list
            Route::get('/', [NoteImageController::class, 'index']);

            // (POST /api/v1/images) Upload new image
            Route::post('/', [NoteImageController::class, 'store']);

            // (POST /api/v1/images/{id}) Update an image
            Route::post('/{id}', [NoteImageController::class, 'update']);

            // (DELETE /api/v1/images/delete) Delete an image
            Route::delete('/delete', [NoteImageController::class, 'destroy']);
        });
    });
});
