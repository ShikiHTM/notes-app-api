<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use URL;

class VerifyEmailNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $verificationEmail = $this->verificationUrl($notifiable);

        return (new MailMessage())
            ->line('The introduction to the notification.')
            ->action('Notification Action', $verificationEmail)
            ->line('Thank you for using our application!');
    }

    protected function verificationUrl(object $notifiable)
    {
        $signedUrl = URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(60),
            ['id' => $notifiable->getKey(), 'hash' => sha1($notifiable->getEmailForVerification())]
        );

        $signedUrl = str_replace(config('app.url'), 'https://api.shikii.dev', $signedUrl);

        $parsed = parse_url($signedUrl);
        parse_str($parsed['query'], $queryParams);
        preg_match('/email\/verify\/(\d+)\/([^?]+)/', $parsed['path'], $matches);

        return 'https://shikii.dev/verify?' . http_build_query([
            'id'        => $matches[1],
            'hash'      => $matches[2],
            'expires'   => $queryParams['expires'],
            'signature' => $queryParams['signature'],
        ]);
    }
    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
