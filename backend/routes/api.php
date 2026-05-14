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
        Route::post('/check-username', [AuthController::class, 'checkUsername'])
            ->middleware('throttle:30,1');
        Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLinkEmail']);
        Route::post('/reset-password', [PasswordResetController::class, 'reset']);
    });

    Route::get('/email/verify/{id}/{hash}', [VerificationController::class, 'verify'])
        ->name('verification.verify');

    Route::post('/yjs-callback', [NoteController::class, 'handleYjsWebhook']);

    Route::middleware('auth:sanctum')->group(function () {

        Route::prefix('auth')->group(function() {
            Route::post('/logout', [AuthController::class, 'logout']);
            Route::post('/email/verification-notification', [VerificationController::class, 'resend'])
                ->middleware('throttle:6,1');
            Route::post('/request-password-reset', [PasswordResetController::class, 'requestPasswordReset']);
        });

        Route::get('/me', [AuthController::class, 'me']);
        Route::patch('/user', [AuthController::class, 'update']);

        // Image CRUD
        Route::apiResource('images', NoteImageController::class)->only(['index', 'store', 'destroy']);
        Route::post('/images/{id}', [NoteImageController::class, 'update']);

        Route::get('/notes/search', [NoteController::class, 'search']);
        Route::get('/notes/archived', [NoteController::class, 'archived']);
        Route::get('/notes/trashed', [NoteController::class, 'trashed']);
        Route::post('/notes/{id}/restore', [NoteController::class, 'restore']);
        Route::delete('/notes/{id}/force', [NoteController::class, 'forceDestroy']);
        Route::apiResource('notes', NoteController::class);

        Route::apiResource('labels', LabelController::class);
    });
});
