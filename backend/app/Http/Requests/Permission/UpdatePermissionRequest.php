<?php

namespace App\Http\Requests\Permission;

use Illuminate\Http\Request;
use Illuminate\Foundation\Http\FormRequest;
use App\Models\User;
use App\Traits\Encryption;
use Illuminate\Validation\Rule;


class UpdatePermissionRequest extends FormRequest
{
    use Encryption;

    protected $id;

    public function __construct(Request $request)
    {
        $this->id = $this->decrypt_string($request->route('id'));
    }

    public function authorize(User $user): bool
    {
        return $user->can('update_permission');
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(Request $request): array
    {
        return [
            'permission_parent_id'=>['required'],
            'description' => [
                'required',
                'max:255',
                 Rule::unique('permissions', 'description')->ignore($this->id)
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'permission_parent_id.required' => _lang_validation('required',['attribute'=>'permission parent name']),
            'description.required' =>_lang_validation('required',['attribute'=>'name']),
            'description.max' => _lang_validation('max',['string'=> ['attribute'=>'name','max'=>'255']]),
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
