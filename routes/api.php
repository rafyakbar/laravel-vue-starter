<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BrowserSessionController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\TokenController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::post('/sanctum/token', TokenController::class);

Route::middleware(['auth:sanctum', 'apply_locale'])->group(function () {

    /**
     * Auth related
     */
    Route::get('/users/auth', AuthController::class);

    /**
     * Profile (self-update)
     */
    Route::put('/profile', [ProfileController::class, 'update']);

    /**
     * Browser sessions — requires web session (SPA cookie auth)
     */
    Route::middleware('web')->group(function () {
        Route::get('/profile/sessions', [BrowserSessionController::class, 'index']);
        Route::delete('/profile/sessions/others', [BrowserSessionController::class, 'destroyOthers']);
    });

    /**
     * Users
     */
    Route::put('/users/{user}/avatar', [UserController::class, 'updateAvatar']);
    Route::delete('/users/{user}/avatar', [UserController::class, 'destroyAvatar']);
    Route::resource('users', UserController::class);

    /**
     * Roles
     */
    Route::get('/roles/search', [RoleController::class, 'search'])->middleware('throttle:400,1');
    Route::resource('roles', RoleController::class)->except(['create', 'edit']);

    /**
     * Permissions
     */
    Route::get('/permissions', [PermissionController::class, 'index']);
});
