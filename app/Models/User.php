<?php

namespace App\Models;

use App\Traits\Filterable;
use App\Traits\Searchable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Image\Enums\Fit;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements HasMedia, MustVerifyEmail
{
    use Filterable, Searchable;
    use HasApiTokens, HasFactory, Notifiable;
    use HasRoles;
    use InteractsWithMedia;

    /**
     * Allowed search fields.
     *
     * @var string[]
     */
    protected $searchFields = ['name', 'username', 'email'];

    /**
     * The attributes that aren't mass assignable.
     *
     * @var array<string>|bool
     */
    protected $guarded = ['id'];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array<int, string>
     */
    protected $appends = [
        'avatar_url',
        'avatar_thumb_url',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the user's avatar media item.
     */
    public function avatar(): ?Media
    {
        return $this->getMedia('avatars')->first();
    }

    /**
     * Get the avatar URL attribute.
     */
    public function getAvatarUrlAttribute(): ?string
    {
        $avatar = $this->avatar();

        return $avatar?->getFullUrl();
    }

    /**
     * Get the avatar thumbnail URL attribute.
     */
    public function getAvatarThumbUrlAttribute(): ?string
    {
        $avatar = $this->avatar();

        return $avatar?->getAvailableFullUrl(['small_thumb']);
    }

    /**
     * Get the is_admin attribute.
     */
    public function getIsAdminAttribute(): bool
    {
        return $this->hasRole('admin');
    }

    /**
     * Register the media conversions.
     */
    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('small_thumb')
            ->fit(Fit::Crop, 300, 300)
            ->nonQueued();

        $this->addMediaConversion('medium_thumb')
            ->fit(Fit::Crop, 600, 600)
            ->nonQueued();

        $this->addMediaConversion('large_thumb')
            ->fit(Fit::Crop, 1200, 1200)
            ->nonQueued();
    }
}
