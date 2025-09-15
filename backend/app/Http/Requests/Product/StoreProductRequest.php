<?php

namespace App\Http\Requests\Product;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use App\Helpers\UploadImageHelper;

class StoreProductRequest extends FormRequest
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
        // return $user->can('create_product');
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
            'sku' => 'required|string|max:255|unique:products,sku',
            'name' => 'required|string|max:100',
            'description' => 'required|string',
            'category_id' => 'required|exists:product_categories,id',
            'quantity_on_hand' => 'required|integer|min:0',
            'reorder_point' => 'required|integer|min:0',
            'supplier_id' => 'required|exists:suppliers,id',
            'brand_id' => 'required|exists:product_brands,id',
            'cost_price' => 'required|numeric|min:0',
            'selling_price' => 'required|numeric|min:0',
            
            'addons' => 'nullable|array',
            'addons.*' => 'array',
            'addons.*.id' => 'required|string',
            'addons.*.base_price' => 'required|numeric|min:0',
            'addons.*.custom_price' => 'required|string|min:0',
            
            'variants' => 'nullable|array',
            'variants.*' => 'array',
            'variants.*.sku' => 'required|string|max:100',
            'variants.*.variant_name' => 'required|string|max:100',
            'variants.*.quantity_on_hand' => 'required|numeric|min:1',
            'variants.*.reorder_point' => 'required|numeric|min:0',
            'variants.*.cost_price' => 'nullable|numeric|min:0',
            'variants.*.selling_price' => 'nullable|numeric|min:0',
            'variants.*.image' => 'nullable|array',
            'variants.*.image.*' => 'file|mimes:jpg,png,jpeg|max:2048',
            'variants.*.filename' => 'nullable|array',
            'variants.*.filename.*' => 'nullable|string',

            'images' => 'required|array',
            'images.*' => 'required|file|mimes:jpg,png,jpeg|max:2048',
            'filename' => 'nullable|array',
            'filename.*' => 'nullable|string',

            'primary_index' => 'required|integer|min:0',
        ];
    }

    public function prepareForValidation(): void
    {
        $this->UploadImageHelper->processFileUpload($this,'images/products','images','filename');

        if ($this->has('variants')) {
            foreach ($this->variants as $key => $variant) {
                $this->UploadImageHelper->processFileUpload(
                    $this,
                    'images/variants',
                    "variants.$key.image",
                    "variants.$key.filename"
                );
            }
        }

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
