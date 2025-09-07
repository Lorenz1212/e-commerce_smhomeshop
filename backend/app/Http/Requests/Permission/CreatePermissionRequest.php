<?php

namespace App\Http\Requests\Permission;

use Illuminate\Http\Request;
use Illuminate\Foundation\Http\FormRequest;
use App\Models\User;
use App\Traits\Encryption;

class CreatePermissionRequest extends FormRequest
{
    use Encryption;

    public function authorize(User $user): bool
    {
        return $user->can('create_permission');
    }

    public function rules(Request $request): array
    {
        return [
            'permission_parent_id'=>['required'],
            'description' => ['required', 'max:255','unique'],
        ];
    }

    public function messages(): array
    {
        return [
            'permission_parent_id.required' => _lang_validation('required',['attribute'=>'permission parent name']),
            'description.required' => _lang_validation('required',['attribute'=>'name']),
            'description.max' => _lang_validation('max',['string'=> ['attribute'=>'name','max'=>'255']]),
            'description.unique' => _lang_validation('unique',['attribute'=> $this->description]),
        ];
    }

    public function prepareForValidation(): void
    {
        $this->merge([
            'permission_parent_id' => $this->decrypt_string($this->permission_parent_id),
            'name' => to_snake_case($this->description)
        ]);
    }
}
