<?php

namespace App\Services\Customer;

use App\Models\Product;
use App\Helpers\DTServerSide;
use App\Models\Feedback;
use App\Models\Order;
use App\Models\OrderItem;

class FeedbackService
{
    public function create(array $request)
    {
        $response = Feedback::create($request);

        return $response;
    }
}