<?php

namespace App\Providers;

use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Support\ServiceProvider;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;
use Illuminate\Notifications\Messages\MailMessage;

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

        VerifyEmail::toMailUsing(function (object $notifiable, string $url) {
            return (new MailMessage())
                ->subject('Kích hoạt tài khoản')
                ->greeting('Chào bạn!')
                ->line('Cảm ơn bạn đã chọn sử dụng ứng dụng của chúng tôi.')
                ->line('Để trải nghiệm được trọn vẹn nhất, bạn vui lòng kích hoạt tài khoản bằng cách nhấn vào nút bên dưới')
                ->action('Kích hoạt', $url)
                ->line('Chúc bạn sử dụng ứng dụng vui vẻ.');
        });
    }
}
