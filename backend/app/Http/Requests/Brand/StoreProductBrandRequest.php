<?php

namespace App\Http\Requests\Brand;

use App\Helpers\UploadImageHelper;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;

class StoreProductBrandRequest extends FormRequest
{
    protected $UploadImageHelper;

    public function __construct(UploadImageHelper $UploadImageHelper)
    {
        $this->UploadImageHelper = $UploadImageHelper;
    }
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
            'name' => 'required|string|max:255|unique:product_brands,name',
            'images' => 'required|array',
            'images.*' => 'required|file|mimes:jpg,png,jpeg|max:2048',
            'filename' => 'nullable|array',
            'filename.*' => 'nullable|string',
        ];
    }

    public function prepareForValidation(): void
    {
        $this->UploadImageHelper->processFileUpload($this,'images/brands','images','filename');
     
    }
}
