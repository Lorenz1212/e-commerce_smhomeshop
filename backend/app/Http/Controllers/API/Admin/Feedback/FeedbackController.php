<?php

namespace App\Http\Controllers\API\Admin\Feedback;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\Admin\Feedback\FeedbackService;

class FeedbackController extends Controller
{
    protected $feedbackService;

    public function __construct(FeedbackService $feedbackService)
    {
        $this->feedbackService = $feedbackService;
    }

    public function list(Request $request){
        
        return $this->feedbackService->getFeedbackList(
            $request,
            $request->extra_filter['start_date'],
            $request->extra_filter['end_date']
        );
    }   

    public function count(Request $request){
        
        $response = $this->feedbackService->getFeedbackStats(
            $request->status,
            $request->extraFilter['start_date'],
            $request->extraFilter['end_date']
        );

        return $this->returnData($response);
    }   
}
