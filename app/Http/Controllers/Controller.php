<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Auth;

abstract class Controller extends BaseController
{
    use AuthorizesRequests;

    /**
     * Returns the current authenticated user.
     */
    protected function getCurrentUser(): ?User
    {
        return Auth::check() ? Auth::user() : null;
    }

    /**
     * Send a data-only success response.
     */
    protected function responseDataSuccess(array $data): JsonResponse
    {
        return $this->responseSuccess('', $data);
    }

    /**
     * Send a successful store response.
     */
    protected function responseStoreSuccess(array $data = [], int $code = 200): JsonResponse
    {
        return $this->responseSuccess(__('Record created successfully.'), $data, $code);
    }

    /**
     * Send a failed store response.
     */
    protected function responseStoreFail(array $data = [], int $code = 422): JsonResponse
    {
        return $this->responseFail(__('Failed to create record.'), $data, $code);
    }

    /**
     * Send a successful update response.
     */
    protected function responseUpdateSuccess(array $data = [], int $code = 200): JsonResponse
    {
        return $this->responseSuccess(__('Record updated successfully.'), $data, $code);
    }

    /**
     * Send a failed update response.
     */
    protected function responseUpdateFail(array $data = [], int $code = 422): JsonResponse
    {
        return $this->responseFail(__('Failed to update record.'), $data, $code);
    }

    /**
     * Send a successful delete response.
     */
    protected function responseDeleteSuccess(array $data = [], int $code = 200): JsonResponse
    {
        return $this->responseSuccess(__('Record deleted successfully.'), $data, $code);
    }

    /**
     * Send a failed delete response.
     */
    protected function responseDeleteFail(array $data = [], int $code = 422): JsonResponse
    {
        return $this->responseFail(__('Failed to delete record.'), $data, $code);
    }

    /**
     * Send a successful response.
     */
    protected function responseSuccess(string $message, array $data = [], int $code = 200): JsonResponse
    {
        return $this->response($code, $message, $data);
    }

    /**
     * Send a failed response.
     */
    protected function responseFail(string $message, array $data = [], int $code = 400): JsonResponse
    {
        return $this->response($code, $message, $data);
    }

    /**
     * Build a JSON response.
     */
    protected function response(int $code, string $message = '', array $data = []): JsonResponse
    {
        return response()->json(array_merge(['message' => $message], $data), $code);
    }
}
