<?php

namespace App\Providers;

use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Support\ServiceProvider;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
        $this->app->singleton(ImageManager::class, function ($app) {
            return new ImageManager(new Driver());
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        VerifyEmail::createUrlUsing(function ($notifiable) {
            return 'https://shikii.dev/verify-email?url=' . URL::temporarySignedRoute(
                'verification.verify',
                    now()->addMinutes(60),
                    ['id' => $notifiable->getKey(), 'hash' => sha1($notifiable->getEmailForVerification())]
                );
        });
    }
}
