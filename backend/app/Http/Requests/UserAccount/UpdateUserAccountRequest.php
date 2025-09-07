<?php

namespace App\Http\Requests\UserAccount;

use Illuminate\Http\Request;
use App\Traits\Encryption;
use App\Rules\UniqueEncrypted;
use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

use App\Helpers\UploadImageHelper;
use App\Models\AdminAccount;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;


class UpdateUserAccountRequest extends FormRequest
{
    use Encryption;
    protected $user_id;

    protected $UploadImageHelper;

    public function __construct(UploadImageHelper $UploadImageHelper)
    {
        $this->user_id = NULL;
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
        $this->user_id = $this->decrypt_string($this->route('user_id'));

        return [
            'fname' => [
                'required',
                'max:255',
                function ($attribute, $value, $fail) {
                    $exists = DB::table('user_personal_infos')
                        ->where('fname', $this->fname)
                        ->where('lname', $this->lname)
                        ->where('id','!=',$this->user_id)
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
                    $exists = DB::table('users')
                        ->where('email', $this->email)
                        ->where('user_id','!=',$this->user_id)
                        ->exists();

                    if ($exists) {
                        $fail('The email address has already been taken.');
                    }
                }
            ],
            'address'=>'nullable',
            'contact_no' => 'nullable|regex:/^[0-9+\-\s()]*$/|max:20',
            'birthdate' => 'nullable|date|before:today',
            'age'   => 'nullable',
            'images'  => 'nullable|array',
            'role_id' => 'nullable',
            'modules' => 'nullable',
            'images.*' => 'nullable|file|mimes:jpg,png,jpeg|max:2048',
            'filename' => 'nullable|array',
            'filename.*' => 'nullable|string',
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
        $this->UploadImageHelper->processFileUpload($this,'images/profiles','images','filename');
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
