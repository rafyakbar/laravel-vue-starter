<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;

trait Filterable
{
    /**
     * Filters a query by key:value parameters.
     */
    public function scopeFilter(Builder $query, array $data, string $operator = 'AND'): Builder
    {
        $operator = strtoupper($operator);
        $callbacks = [
            'AND_WHERE' => 'where',
            'AND_WHERE_IN' => 'whereIn',
            'OR_WHERE' => 'orWhere',
            'OR_WHERE_IN' => 'orWhereIn',
        ];

        foreach ($data as $column => $value) {
            $filterParts = self::parseFilter($value);
            if (empty($filterParts)) {
                continue;
            }

            $comparison = $filterParts[1];
            $inputVal = $filterParts[2];

            if (is_array($inputVal)) {
                call_user_func_array([$query, $callbacks[$operator.'_WHERE_IN']], [$column, $inputVal]);
            } else {
                if (! is_numeric($inputVal)) {
                    $comparison = 'LIKE';
                    $inputVal = '%'.$inputVal.'%';
                }
                call_user_func_array([$query, $callbacks[$operator.'_WHERE']], [$column, $comparison, $inputVal]);
            }
        }

        return $query;
    }

    /**
     * Parse the filter value into parts.
     *
     * @return array<int, mixed>
     */
    public static function parseFilter(string $value): array
    {
        $filterParts = explode(';', $value);
        $totalFilterParts = count($filterParts);

        if ($totalFilterParts !== 3) {
            return [];
        }

        $lastValue = $filterParts[$totalFilterParts - 1];
        if (str_contains($lastValue, '|')) {
            $filterParts[$totalFilterParts - 1] = explode('|', $lastValue);
        }

        return $filterParts;
    }
}
