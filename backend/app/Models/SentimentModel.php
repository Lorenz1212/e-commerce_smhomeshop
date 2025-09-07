<?php 
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SentimentModel extends Model
{
    use SoftDeletes;

    protected $fillable = ['model_name', 'description', 'accuracy'];
}
