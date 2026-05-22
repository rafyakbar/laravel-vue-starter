<?php

namespace App\Services\Media;

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class MediaService
{
    /**
     * Replace existing media in a collection with a new file.
     */
    public function replace(UploadedFile $file, User $user, string $collection): Media
    {
        $media = $user->getMedia($collection);

        foreach ($media as $mediaItem) {
            $mediaItem->delete();
        }

        return $this->store($file, $user, $collection);
    }

    /**
     * Store a file in a media collection.
     */
    public function store(UploadedFile $file, User $user, string $collection): Media
    {
        return $user->addMedia($file)->toMediaCollection($collection);
    }
}
