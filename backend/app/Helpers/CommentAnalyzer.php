<?php

namespace App\Helpers;

use App\Mail\EmailWithoutAttachment;
use App\Exceptions\ExceptionHandler;
use Illuminate\Support\Facades\Mail;

class CommentAnalyzer
{
    public function analyze($text)
    {
        // Example only — plug in real ML or API call here.
        if (str_contains($text, 'good')) {
            return ['sentiment' => 'positive', 'confidence' => 0.95];
        }

        return ['sentiment' => 'neutral', 'confidence' => 0.5];
    }
}