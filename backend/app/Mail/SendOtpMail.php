<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class SendOtpMail   extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public $otp;
    public $fname;

    public function __construct($fname,$otp)
    {
        $this->otp = $otp;
        $this->fname = $fname;
    }

    /**
     * Get the message envelope.
     */
    public function build()
    {
        return $this->subject('Password Reset OTP')
                    ->view('emails.otp')
                    ->with(['otp' => $this->otp,'fname'=>$this->fname]);
    }
   
}