<?php

namespace App\Http\Requests\Role;

use Illuminate\Http\Request;
use Illuminate\Foundation\Http\FormRequest;
use App\Models\User;
use App\Traits\Encryption;
use Illuminate\Validation\Rule;

class UpdateRoleRequest extends FormRequest
{
    use Encryption;

    protected $id;

    public function __construct(Request $request)
    {
        $this->id = $this->decrypt_string($request->route('role_id'));
    }

    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(Request $request): array
    {
        return [
            'name' => 'required|string|max:50|unique:roles,name,' . $this->id,
            'permissions' => 'array',
            'permissions.*' => 'integer|exists:permissions,id',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' =>_lang_validation('required',['attribute'=>'name']),
            'name.max' => _lang_validation('max.string',['attribute'=>'name','max'=>'50']),
            'name.unique' => _lang_validation('unique',['attribute'=> $this->name]),
        ];
    }
}
