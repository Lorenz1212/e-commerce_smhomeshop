<?php

namespace App\Helpers;

use App\Mail\EmailWithoutAttachment;
use App\Exceptions\ExceptionHandler;
use Illuminate\Support\Facades\Mail;

class EmailHelper
{
    private $company_name = 'MAXIMUM GYM FITNESS';
    
    private function subject($subject){
        return $subject .' | '.$this->company_name;
    }

    public function send_without_attachment($type, $content){
        try {
            Mail::to($content['email_to'])->send(new EmailWithoutAttachment($this->subject($content['subject']),$this->content($type, $content)));
            return true;
        } catch (\Throwable $e) {
            return ExceptionHandler::handle($e);
        }
    }

    private function content($type,$content){
        return view('email.'.$type,compact('content'));
	}
}