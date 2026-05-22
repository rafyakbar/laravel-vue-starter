<?php

namespace App\Http\Requests;

class UpdateUserRequest extends BaseRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users,username,'.$this->route('user')?->id,
            'email' => 'required|email|max:255',
            'roles' => 'required|array',
            'roles.*' => 'exists:roles,name',
            'avatar' => 'nullable|image',
            'password' => 'nullable|min:6',
        ];
    }
}
