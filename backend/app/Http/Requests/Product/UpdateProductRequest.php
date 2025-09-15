<?php

namespace App\Http\Requests\Product;

use App\Helpers\UploadImageHelper;
use Illuminate\Foundation\Http\FormRequest;
use App\Traits\Encryption;
use App\Models\User;

class UpdateProductRequest extends FormRequest
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
        // return $user->can('update_product');
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $product_id = $this->decrypt_string($this->route('product_id'));

        return [
            'sku' => 'required|string|max:255|unique:products,sku,' . $product_id,
            'name' => 'required|string|max:100',
            'description' => 'required|string',
            'category_id' => 'required|exists:product_categories,id',
            'reorder_point' => 'required|integer|min:0',
            'add_new_stocks' => 'required|integer|min:0',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'brand_id' => 'nullable|exists:product_brands,id',
            'cost_price' => 'required|numeric|min:0',
            'selling_price' => 'required|numeric|min:0',
            
            'addons' => 'nullable|array',
            'addons.*' => 'array',
            'addons.*.id' => 'required|string',
            'addons.*.base_price' => 'required|numeric|min:0',
            'addons.*.custom_price' => 'required|string|min:0',

            'variants' => 'nullable|array',
            'variants.*' => 'array',
            'variants.*.id' => 'required|string',
            'variants.*.sku' => 'required|string|max:100',
            'variants.*.variant_name' => 'required|string|max:100',
            'variants.*.quantity_on_hand' => 'required|numeric|min:1',
            'variants.*.reorder_point' => 'required|numeric|min:0',
            'variants.*.cost_price' => 'nullable|numeric|min:0',
            'variants.*.selling_price' => 'nullable|numeric|min:0',
            'variants.*.image' => 'required|file|mimes:jpg,png,jpeg|max:2048',
            'variants.*.filename' => 'nullable|string',

            'images' => 'nullable|array',
            'images.*' => 'nullable|file|mimes:jpg,png,jpeg|max:2048',
            'filename' => 'nullable|array',
            'filename.*' => 'nullable|string',
        ];
    }

    public function prepareForValidation(): void
    {
        $this->UploadImageHelper->processFileUpload($this,'images/products','images','filename');

         if ($this->has('addons')) {
            $addons = $this->input('addons');

            if (is_array($addons)) {
                foreach ($addons as $key => $addon) {
                    if (is_string($addon)) {
                        $addons[$key] = json_decode($addon, true);
                    }
                }
                $this->merge(['addons' => $addons]);
            }
        }
     
    }
}
