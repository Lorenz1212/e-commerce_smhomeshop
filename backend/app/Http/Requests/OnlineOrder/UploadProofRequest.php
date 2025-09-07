<?php

namespace App\Http\Requests\OnlineOrder;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\User;

class UploadProofRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(User $user): bool
    {
         return $user->can('upload_order');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
       return ['file' => 'required|file|mimes:jpg,png,pdf|max:2048'];
    }
}
