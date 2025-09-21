// components/Table/SupplierTable.tsx
import React from 'react'
import { DataTable, Column } from '@@@/datatable/DataTable'
import { ActionsCell } from '@@@/datatable/components/ActionsCell'
import { ProductCategoryModel } from '../../core/_model'
import { ImageTitleCell } from '@@@/datatable/components/ImageTitleCell'
import { toAbsoluteUrl } from '@/helpers'

type Props = {
  data: ProductCategoryModel[]
  loading: boolean
  pagination: any
  sortColumn: string
  sortDirection: 'asc' | 'desc'
  onPageChange: (page: number) => void
  onSortChange: (col: string, dir: 'asc' | 'desc') => void
  onRestore: (id: string, setRefreshTable?: (refresh: boolean) =>void, setRefreshFirstTable?: (refresh: boolean) =>void) => void
  setRefreshTable?: (refresh: boolean) =>void
  onSearchChange?:(value: any) => void,
  setRefreshFirstTable?: (refresh: boolean) =>void
}

export const ProductCategoryArchivedTable: React.FC<Props> = ({
  data,
  loading,
  pagination,
  sortColumn,
  sortDirection,
  onPageChange,
  onSortChange,
  onRestore,
  onSearchChange,
  setRefreshTable,
  setRefreshFirstTable
}) => {
  const columns: Column<ProductCategoryModel>[] = [
    { title: '#', key: 'row_number', sortable: true },
    {
      title: 'Items',
      key: 'image_cover',
      render: (item:any) => (
        <ImageTitleCell
            image={item.images[0]?.image_cover??toAbsoluteUrl('media/default.jpg')}
            mainTitle={item.name}
        />
      ),
    },
    { title: 'Created At', key: 'created_at_format', sortable: true },
    {
      title: 'Action',
      key: 'id_encrypted',
      render: (item) => (
        <ActionsCell
          restoreAction={() => onRestore(item.id_encrypted,setRefreshTable, setRefreshFirstTable)}
        />
      ),
    },
  ]

  return (
    <div className="table-responsive">
      {loading ? (
        <div className="alert alert-info">Loading...</div>
      ) : (
        <DataTable<ProductCategoryModel>
          data={data}
          columns={columns}
          loading={loading}
          pagination={pagination}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onPageChange={onPageChange}
          onSortChange={onSortChange}
          onSearchChange={onSearchChange}
        />
      )}
    </div>
  )
}
