// components/Table/SupplierTable.tsx
import React from 'react'
import { DataTable, Column } from '@@@/DataTable'
import { ActionsCell } from '@@@/datatable/ActionsCell'
import { ProductBrandModel } from '../../core/_model'
import { ImageTitleCell } from '@@@/datatable/ImageTitleCell'
import { toAbsoluteUrl } from '@/helpers'

type Props = {
  data: ProductBrandModel[]
  loading: boolean
  pagination: any
  sortColumn: string
  sortDirection: 'asc' | 'desc'
  onPageChange: (page: number) => void
  onSortChange: (col: string, dir: 'asc' | 'desc') => void
  onEdit: (id: string) => void
  onView: (id: string) => void
  onArchive: (id: string, setRefreshTable?: (refresh: boolean) =>void) => void
  setRefreshTable?: (refresh: boolean) =>void
  onSearchChange?:(value: any) => void
}

export const ProductBrandTable: React.FC<Props> = ({
  data,
  loading,
  pagination,
  sortColumn,
  sortDirection,
  onPageChange,
  onSortChange,
  onEdit,
  onView,
  onArchive,
  onSearchChange,
  setRefreshTable 
}) => {
  const columns: Column<ProductBrandModel>[] = [
    { title: '#', key: 'row_number', sortable: true },
    {
      title: 'Items',
      key: 'image_cover',
      render: (item:any) => (
        <ImageTitleCell
            image={item.image_cover??toAbsoluteUrl('media/default.jpg')}
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
          openDetailsModal={() => onView(item.id_encrypted)}
          openEditModal={() => onEdit(item.id_encrypted)}
          archiveAction={() => onArchive(item.id_encrypted,setRefreshTable)}
        />
      ),
    },
  ]

  return (
    <div className="table-responsive">
      {loading ? (
        <div className="alert alert-info">Loading...</div>
      ) : (
        <DataTable<ProductBrandModel>
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
