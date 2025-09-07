<?php

namespace App\Http\Requests\Category;

use App\Helpers\UploadImageHelper;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use App\Traits\Encryption;

class UpdateProductCategoryRequest extends FormRequest
{
    use Encryption;

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
        $category_id = $this->decrypt_string($this->route('category_id'));

        return [
            'name' => 'required|string|max:255|unique:product_categories,name,' . $category_id,
            'images' => 'nullable|array',
            'images.*' => 'nullable|file|mimes:jpg,png,jpeg|max:2048',
            'filename' => 'nullable|array',
            'filename.*' => 'nullable|string',
        ];
    }

    public function prepareForValidation(): void
    {
        $this->UploadImageHelper->processFileUpload($this,'images/categories','images','filename');
     
    }
}
