<?php

namespace App\Helpers;

use Illuminate\Support\Facades\DB;

class DTServerSide {

    protected $request;
    protected $data;
    protected $searchableColumns;
    protected $sortableColumns;

    public function __construct($request, $data, $searchableColumns = [], $sortableColumns = []) {
        $this->request = $request;
        $this->data = $data;
        $this->searchableColumns = $searchableColumns;
        $this->sortableColumns = $sortableColumns;
    }

    public function renderTable()
    {
        $validated = validator($this->request->all(), [
            'search' => ['nullable', 'string'],
            'sortColumn' => ['nullable', 'in:' . implode(',', array_keys($this->sortableColumns))],
            'sortDirection' => ['nullable', 'in:asc,desc'],
            'pageSize' => ['nullable', 'integer', 'min:1', 'max:100'],
            'page' => ['nullable', 'integer', 'min:1'],
        ])->validate();

        $search = $validated['search'] ?? null;
        $sortColumn = $validated['sortColumn'] ?? 'row_number';
        $sortDirection = $validated['sortDirection'] ?? 'asc';
        $pageSize = $validated['pageSize'] ?? 10;
        $page = $validated['page'] ?? 1;

        $query = clone $this->data;

        if ($search) {
            $query->where(function ($q) use ($search) {
                foreach ($this->searchableColumns as $column) {
                    $this->applySearch($q, $column, $search);
                }
            });
        }

        if (isset($this->sortableColumns[$sortColumn])) {
            $query->orderBy($this->sortableColumns[$sortColumn], $sortDirection);
        }

        $result = $query->paginate($pageSize, ['*'], 'page', $page);

        $items = $result->getCollection()->transform(function ($item, $index) use ($page, $pageSize) {
            $item->row_number = ($page - 1) * $pageSize + $index + 1;
            return $item;
        });

        return response()->json([
            'success' => true,
            'data' => $items,
            'pagination' => [
                'total' => $result->total(),
                'per_page' => $result->perPage(),
                'current_page' => $result->currentPage(),
                'last_page' => $result->lastPage(),
                'from' => $result->firstItem(),
                'to' => $result->lastItem(),
            ],
        ]);
    }

    private function applySearch($query, $column, $search)
    {
        if (strpos($column, '.') !== false) {
            [$relation, $relatedColumn] = explode('.', $column, 2);
            $query->orWhereHas($relation, function ($q) use ($relatedColumn, $search) {
                $q->where($relatedColumn, 'LIKE', "%$search%");
            });
        } else {
            $query->orWhere($column, 'LIKE', "%$search%");
        }
    }
}
