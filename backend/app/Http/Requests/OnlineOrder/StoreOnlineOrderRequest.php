<?php

namespace App\Http\Requests\OnlineOrder;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\User;

class StoreOnlineOrderRequest  extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(User $user): bool
    {
         return $user->can('create_order');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
          return [
            'customer_id' => 'nullable|exists:customers,id',
            'total_amount' => 'required|numeric|min:0',
            'payment_method' => 'required|in:CASH,GCASH,CARD',
            'status' => 'required|in:PENDING,PAID,CANCELLED,DELIVERED',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.subtotal' => 'required|numeric|min:0',
        ];
    }
}
