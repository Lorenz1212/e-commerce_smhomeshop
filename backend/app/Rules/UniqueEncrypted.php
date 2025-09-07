<?php 
namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class UniqueEncrypted implements Rule
{
    protected $table;
    protected $column;
    protected $exceptId;

    public function __construct($table, $column, $exceptId = null)
    {
        $this->table = $table;
        $this->column = $column;
        $this->exceptId = $exceptId;
    }

    public function passes($attribute, $value)
    {

        $query = $this->table::where($this->column, $value);

        if ($this->exceptId) {
            $query->where($this->table::ID_COLUMN, '!=', $this->exceptId);
        }

        return !$query->exists(); // Passes if no match is found
    }

    public function message()
    {
        return 'The :attribute has already been taken.';
    }
}
