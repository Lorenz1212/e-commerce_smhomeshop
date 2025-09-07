<?php

namespace App\Http\Requests\Addons;

use App\Helpers\UploadImageHelper;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use App\Traits\Encryption;

class UpdateAddonsRequest extends FormRequest
{
    use Encryption;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(User $user): bool
    {
        // return $user->can('update_product_category');
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $addon_id = $this->decrypt_string($this->route('addon_id'));

        return [
            'name' => 'required|string|max:255|unique:addons,name,' . $addon_id,
            'base_price' => 'required|numeric|min:0',
        ];
    }
}
