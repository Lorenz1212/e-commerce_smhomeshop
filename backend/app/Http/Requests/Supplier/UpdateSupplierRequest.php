<?php

namespace App\Http\Requests\Supplier;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use App\Traits\Encryption;

class UpdateSupplierRequest extends FormRequest
{
    use Encryption;
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(User $user): bool
    {
        // return $user->can('update_supplier');
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $supplierId = $this->decrypt_string($this->route('supplier_id'));

        return [
            'name' => 'required|string|max:255|unique:suppliers,name,' . $supplierId,
            'contact_person' => 'required|string|max:255',
            'phone' => 'required|string|max:255',
            'email' => 'required|string|max:255'
        ];
    }
}
