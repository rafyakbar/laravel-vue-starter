<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Schema;

trait Searchable
{
    /**
     * Scope a query to search across defined fields.
     */
    public static function scopeSearch(Builder $query, string $keyword, bool $matchAllFields = false): Builder
    {
        return $query->where(function (Builder $query) use ($keyword, $matchAllFields) {
            foreach (static::getSearchableFields() as $field) {
                if ($matchAllFields) {
                    $query->where($field, 'LIKE', "%{$keyword}%");
                } else {
                    $query->orWhere($field, 'LIKE', "%{$keyword}%");
                }
            }
        });
    }

    /**
     * Get all searchable fields for the model.
     *
     * @return array<int, string>
     */
    public static function getSearchableFields(): array
    {
        /** @var Model $model */
        $model = new static;

        $fields = $model->searchFields ?? [];

        if (empty($fields)) {
            $fields = Schema::getColumnListing($model->getTable());

            $ignoredColumns = [
                $model->getKeyName(),
                $model->getUpdatedAtColumn(),
                $model->getCreatedAtColumn(),
            ];

            if (method_exists($model, 'getDeletedAtColumn')) {
                $ignoredColumns[] = $model->getDeletedAtColumn();
            }

            $fields = array_diff($fields, $model->getHidden(), $ignoredColumns);
        }

        return $fields;
    }
}
