<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SystemDefinition extends Model
{
    use HasFactory;

    protected $table = 'system_definitions';

    protected $fillable = [
        'code', 'name', 'value', 'description', 'remarks', 'is_active'
    ];

    /**
     * Scope to only active definitions
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', 'Y');
    }

    /**
     * Get value by code
     */
    public static function getValue(string $code)
    {
        $definition = self::active()->where('code', $code)->first();
        return $definition ? $definition->value : null;
    }
}
