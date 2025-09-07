<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;
use App\Traits\Encryption;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

abstract class BaseModel extends Model
{
    use LogsActivity, Encryption;

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->useLogName($this->getTable())
            ->logOnlyDirty();
    }
 
    public static function generateQueueNumber()
    {
        $last = QueueOrder::whereYear('created_at', now()->year)->count();

        return str_pad($last + 1, 5, '0', STR_PAD_LEFT);
    }

    public static function generateOrderNumber()
    {
       return DB::transaction(function () {
            $counter = DB::table('order_counters')->lockForUpdate()->first();

            // If no counter exists yet
            if (!$counter) {
                DB::table('order_counters')->insert(['last_order_no' => 1]);
                $sequence = 1;
            } else {
                $sequence = $counter->last_order_no + 1;
                DB::table('order_counters')->update(['last_order_no' => $sequence]);
            }

            $year = now()->format('y'); // e.g. 25 for 2025
            $month = now()->format('m'); // e.g. 03 for March

            return $year . $month . str_pad($sequence, 5, '0', STR_PAD_LEFT); // e.g. 250300001
        });
    }

    public static function generateNumber()
    {
        // Combine parts to form the final ID
        $date = Carbon::now();

        $lastRecord = self::whereYear('created_at', $date->format('Y'))->count();
        // Get the last two digits of the year
        $lastTwoDigitsOfYear = $date->format('y');
        // Current seconds
        $filler = str_pad($lastRecord + 1, 5, '0', STR_PAD_LEFT);

        $ID = $lastTwoDigitsOfYear . $filler;

        return $ID;
    }
}