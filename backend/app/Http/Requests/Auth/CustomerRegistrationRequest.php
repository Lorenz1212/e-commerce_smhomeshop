<?php

namespace App\Http\Requests\Auth;

use App\Rules\UniqueEncrypted;
use Illuminate\Foundation\Http\FormRequest;
use App\Rules\EmailExists; 

class CustomerRegistrationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
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
            'fname' => ['required', 'string', 'max:100'],
            'lname' => ['required', 'string', 'max:100'],
            'mname' => ['nullable', 'string', 'max:100'],
            'gender' => ['nullable', 'in:M,F,O'],
            'birthdate' => ['nullable', 'date', 'before:today'],
            'contact_number' => ['nullable', 'regex:/^[0-9+\-\s()]*$/', 'max:20'],
            'email' => ['required', 'email', 'max:255', 'unique:customer_accounts,email'],
            'password' => ['required', 'confirmed', 'min:8'],
            'password_confirmation' => ['required', 'min:8'],
        ];
    }
}
