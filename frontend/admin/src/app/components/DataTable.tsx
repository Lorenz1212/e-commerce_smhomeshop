import { KTIcon } from '@/helpers'
import React, { useState, useRef } from 'react'

export interface Column<T> {
  title: string
  key: keyof T | string
  render?: (row: T) => React.ReactNode
  sortable?: boolean
}

export interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  pagination?: {
    total?: number
    per_page?: number
    current_page?: any
    last_page?: number
  }
  loading?: boolean
  onPageChange?: (page: number) => void
  onSortChange?: (column: string, direction: 'asc' | 'desc') => void
  sortColumn?: string
  sortDirection?: 'asc' | 'desc'
  onSearchChange?: (query: string) => void
  search?: string
  classNameCard?: string
  cardTitle?: string
  cardSubTitle?: string
  scrollHeight?: string // optional: for vertical scroll
}

export function DataTable<T>({
  data = [],
  columns = [],
  pagination,
  loading = false,
  onPageChange,
  onSortChange,
  sortColumn,
  sortDirection,
  onSearchChange,
  classNameCard = 'card-flush',
  cardTitle = '',
  cardSubTitle = '',
  scrollHeight,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('')
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  const handleSort = (colKey: string) => {
    if (!onSortChange) return
    const newDirection = sortColumn === colKey && sortDirection === 'asc' ? 'desc' : 'asc'
    onSortChange(colKey, newDirection)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearch(value)

    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      onSearchChange?.(value)
    }, 500)
  }

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= (pagination?.last_page || 1)) {
      onPageChange?.(page)
    }
  }

  return (
    <div className={`card ${classNameCard} shadow p-3 mb-5 rounded`}>
      <div className="card-header d-flex justify-content-between align-items-center border-0 pt-5">
         <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>{cardTitle}</span>
          {cardSubTitle && (<span className='text-muted mt-1 fw-semibold fs-7'>{cardSubTitle}</span>)}
        </h3>
        {onSearchChange && (
          <div className="card-toolbar">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Search..."
              value={search}
              onChange={handleSearch}
            />
          </div>
        )}
      </div>
      <div className="card-body pt-0">
        <div
          className="table-responsive"
          style={scrollHeight ? { maxHeight: scrollHeight, overflowY: 'auto' } : {}}
        >
          <table className="table align-middle table-row-dashed fs-6 gy-5">
            <thead>
              <tr className="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
                {columns.map((col, index) => (
                  <th
                    key={index}
                    style={{ cursor: col.sortable ? 'pointer' : 'default', whiteSpace: 'nowrap' }}
                    onClick={() => col.sortable && handleSort(col.key.toString())}
                  >
                    {col.title}
                    {sortColumn === col.key && (
                      <span className="ms-1">
                        {sortDirection === 'asc' ? '▲' : '▼'}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length} className="text-center">Loading...</td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="text-center text-muted py-5">
                    <div className="d-flex flex-column align-items-center">
                        <KTIcon iconName='abstract-26' className='fs-1' />
                        <span className="fw-semibold fs-3">No records found</span>
                     </div> 
                  </td>
                </tr>
              ) : (
                data.map((row, i) => (
                  <tr key={i}>
                    {columns.map((col, j) => (
                      <td key={j}>
                        {col.render ? col.render(row) : (row as any)[col.key]}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pagination && (
          <div className="d-flex justify-content-between align-items-center mt-4">
            <span className="text-muted">
              Page {pagination.current_page} of {pagination.last_page}
            </span>
            <ul className="pagination mb-0">
              <li className={`page-item ${pagination.current_page === 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => handlePageClick(pagination.current_page - 1)}>
                  ←
                </button>
              </li>
              {[...Array(pagination.last_page)].map((_, index) => {
                const page = index + 1
                return (
                  <li
                    key={page}
                    className={`page-item ${pagination.current_page === page ? 'active' : ''}`}
                  >
                    <button className="page-link" onClick={() => handlePageClick(page)}>
                      {page}
                    </button>
                  </li>
                )
              })}
              <li className={`page-item ${pagination.current_page === pagination.last_page ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => handlePageClick(pagination.current_page + 1)}>
                  →
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
