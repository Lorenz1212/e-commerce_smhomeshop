<?php

namespace App\Http\Requests\Customer;

use App\Traits\Encryption;
use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;
use App\Helpers\UploadImageHelper;
use Illuminate\Support\Facades\DB;


class UpdateCustomerRequest extends FormRequest
{
    use Encryption;
    protected $customer_id;

    protected $UploadImageHelper;

    public function __construct(UploadImageHelper $UploadImageHelper)
    {
        $this->customer_id = NULL;
        $this->UploadImageHelper = $UploadImageHelper;
    }
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
        $this->customer_id = $this->decrypt_string($this->route('customer_id'));

        return [
            'fname' => [
                'required',
                'max:255',
                function ($attribute, $value, $fail) {
                    $exists = DB::table('customers')
                        ->where('fname', $this->fname)
                        ->where('lname', $this->lname)
                        ->where('id','!=',$this->customer_id)
                        ->exists();

                    if ($exists) {
                        $fail('The combination of first name and last name must be unique.');
                    }
                }
            ],
            'lname' => 'required|max:255',
            'mname' => 'nullable|max:255',
            'suffix' => 'nullable|max:50',
            'gender' => 'required|in:M,F,O',
            'email' => [
                'required',
                'max:255',
                function ($attribute, $value, $fail) {
                    $exists = DB::table('customer_accounts')
                        ->where('email', $this->email)
                        ->where('customer_id','!=',$this->customer_id)
                        ->exists();

                    if ($exists) {
                        $fail('The email address has already been taken.');
                    }
                }
            ],
            'address'=>'nullable',
            'phone' => 'nullable|regex:/^[0-9+\-\s()]*$/|max:20',
            'birthdate' => 'nullable|date|before:today',
            'age'   => 'nullable'
        ];
    }

    public function messages(): array
    {
        return [
            'fname.required' => 'The first name is required.',
            'fname.max' => 'The first name may not be greater than 255 characters.',
            'fname.unique' => 'The combination of first and last name must be unique.',
            'lname.required' => 'The last name is required.',
            'lname.max' => 'The last name may not be greater than 255 characters.',
        ];
    }

    public function prepareForValidation(): void
    {
        $this->processBirthdate();
    }

    private function processBirthdate(): void
    {
        if ($birthdate = $this->input('birthdate')) {
            $this->merge([
                'age' => Carbon::parse($birthdate)->age,
                'birthdate' => Carbon::parse($birthdate)->format('Y-m-d'),
            ]);
        }
    }
}
