<?php
namespace App\Services\Admin\Feedback;

use App\Helpers\DTServerSide;
use App\Models\Feedback;
use Carbon\Carbon;

class FeedbackService
{
    public function getFeedbackList($request,$startDate = null, $endDate = null)
    {
        $data = Feedback::with('source')->select('author_name', 'rating', 'comment', 'date_posted', 'source_id','sentiment');

        if ($startDate && $endDate) {
            $data->whereBetween('date_posted', [
                Carbon::parse($startDate)->startOfDay(),
                Carbon::parse($endDate)->endOfDay()
            ]);
        }

        $normalFields = ['author_name', 'source.name','rating', 'comment', 'date_posted', 'source_id']; 
        
        $sortableColumns = [
            'id'               => 'id',
            'created_at'       => 'created_at',
            'author_name'      => 'author_name',
            'comment'          => 'comment',
            'date_posted'      => 'date_posted',
        ];

        return (new DTServerSide($request, $data, $normalFields, $sortableColumns))->renderTable();
    }

    public function getFeedbackStats($status,$startDate,$endDate){

        $data = Feedback::where('sentiment',$status);

        if ($startDate && $endDate) {
            $data->whereBetween('date_posted', [
                Carbon::parse($startDate)->startOfDay(),
                Carbon::parse($endDate)->endOfDay()
            ]);
        }

        $count  = $data->count();

        return $count;
    } 
}