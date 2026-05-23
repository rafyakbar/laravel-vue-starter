<?php

namespace App\Providers;

use App\Http\Responses\LoginResponse;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class AppServiceProvider extends ServiceProvider
{
    /**
     * The path to the "home" route for your application.
     */
    public const HOME = '/home';

    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(LoginResponseContract::class, LoginResponse::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->bootAuth();
        $this->bootRoute();
    }

    /**
     * Bootstrap authentication services.
     *
     * Note: We do NOT use Gate::before for role-based bypass. All roles
     * (including superadmin) hold explicit permissions via the seeder.
     * This keeps the permissions API consistent across all roles.
     */
    protected function bootAuth(): void
    {
        ResetPassword::createUrlUsing(function ($user, string $token) {
            return env('APP_URL').'/reset-password?token='.$token;
        });
    }

    /**
     * Bootstrap route services.
     */
    protected function bootRoute(): void
    {
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });
    }
}
