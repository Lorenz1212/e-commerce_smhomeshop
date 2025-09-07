<?php

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class UserCreatedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $user;
    public $role;
    /**
     * Create a new notification instance.
     */
    public function __construct($user,$role)
    {
        $this->user = $user;
        $this->role = $role;
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
         $frontendUrl = $this->getFrontendUrl($this->role);

         return (new MailMessage)
            ->subject(__('Validate your account'))
            ->line(__('Welcome to :app store.', ['app' => config('app.name')]))
            ->line(__('To complete the creation of your account, please use the below button to choose a password and verify your user account.'))
            ->action(__('Verify my account'), $frontendUrl . "/auth/setup-password/" . $this->user->creation_token);
    }

    private function getFrontendUrl($role)
    {
        $isLive = app()->environment('production');

        if ($role === 'core') {
            return $isLive ? config('app.frontend_core_live') : config('app.frontend_core_local');
        }

        if ($role === 'cashier') {
            return $isLive ? config('app.frontend_cashier_live') : config('app.frontend_cashier_local');
        }

        // fallback
        return config('app.url');
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
