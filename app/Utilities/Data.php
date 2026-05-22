<?php

namespace App\Utilities;

class Data
{
    /**
     * Take a value from an array and remove it.
     *
     * @param  array<string, mixed>  $arr
     */
    public static function take(array &$arr, string $key): mixed
    {
        if (isset($arr[$key])) {
            $value = $arr[$key];
            unset($arr[$key]);

            return $value;
        }

        return null;
    }
}
