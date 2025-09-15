<?php

namespace App\Http\Requests\Addons;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;

class StoreAddonsRequest extends FormRequest
{

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(User $user): bool
    {
        // return $user->can('create_product_category');
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255|unique:addons,name',
            'base_price' => 'required|numeric|min:0',
            'is_freebies' => ['nullable', 'in:Y,N'],
        ];
    }
}
