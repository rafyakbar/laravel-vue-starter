<?php

namespace App\Http\Requests;

class StoreUserRequest extends BaseRequest
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
            'username' => 'required|string|max:255|unique:users',
            'email' => 'required|email|unique:users',
            'roles' => 'required|array',
            'roles.*' => 'exists:roles,name',
            'avatar' => 'nullable|image',
            'password' => 'required|min:6',
        ];
    }
}
