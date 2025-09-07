<?php

namespace App\Http\Requests\Role;

use Illuminate\Http\Request;
use Illuminate\Foundation\Http\FormRequest;

class StoreRoleRequest extends FormRequest
{

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:50|unique:roles,name',
            'permissions' => 'array',
            'permissions.*' => 'integer|exists:permissions,id',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => _lang_validation('required',['attribute'=>'name']),
            'name.max' => _lang_validation('max.string',['attribute'=>'name','max'=>'50']),
            'name.unique' => _lang_validation('unique',['attribute'=> $this->name]),
        ];
    }
}
