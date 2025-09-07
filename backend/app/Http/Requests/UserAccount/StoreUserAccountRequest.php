<?php

namespace App\Http\Requests\UserAccount;

use App\Rules\UniqueEncrypted;
use App\Traits\Encryption;
use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use App\Helpers\AddressHelper;
use App\Helpers\UploadImageHelper;
use App\Models\AdminAccount;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

class StoreUserAccountRequest extends FormRequest
{
    use Encryption;
    protected $UploadImageHelper;
    protected $adminModel;
    protected $AddressHelper;

    public function __construct(UploadImageHelper $UploadImageHelper,AddressHelper $AddressHelper)
    {
        $this->UploadImageHelper = $UploadImageHelper;
        $this->AddressHelper = $AddressHelper;
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
     */
    public function rules(): array
    {
        return [
            'fname' => [
                'required',
                'max:255',
                function ($attribute, $value, $fail) {
                    $exists = DB::table('user_personal_infos')
                        ->where('fname', $this->fname)
                        ->where('lname', $this->lname)
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
            'email' => 'required|string|max:255|unique:users,email',
            'address'=>'nullable',
            'contact_no' => 'nullable|regex:/^[0-9+\-\s()]*$/|max:20',
            'birthdate' => 'nullable|date|before:today',
            'age'   => 'nullable',
            'images'  => 'required|array',
            'role_id' => 'nullable',
            'modules' => 'nullable',
            'images.*' => 'required|file|mimes:jpg,png,jpeg|max:2048',
            'filename' => 'nullable|array',
            'filename.*' => 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'fname.required' => _lang_validation('required',['attribute'=>'first name']),
            'fname.max' => _lang_validation('max.string',['attribute'=>'first name','max'=>'255']),
            'fname.unique' => _lang_validation('unique',['attribute'=> 'first and last name']),
            'lname.required' => _lang_validation('required',['attribute'=>'last name']),
            'lname.max' => _lang_validation('max.string', ['attribute'=>'last name','max'=>'255']),
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
