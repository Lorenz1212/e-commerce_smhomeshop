// components/Table/SupplierTable.tsx
import React from 'react'
import { DataTable, Column } from '@@@/datatable/DataTable'
import { ActionsCell } from '@@@/datatable/components/ActionsCell'
import { ProductBrandModel } from '../../core/_model'
import { ImageTitleCell } from '@@@/datatable/components/ImageTitleCell'
import { toAbsoluteUrl } from '@/helpers'
import { useAuth } from '@@/auth'

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
  const {currentUser} = useAuth();

  const permissions = currentUser?.permissions

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
          openDetailsModal={permissions.includes('view_product_brand_details') ? () => onView(item.id_encrypted) : undefined}
          openEditModal={permissions.includes('update_product_brand') ? () => onEdit(item.id_encrypted) : undefined}
          archiveAction={permissions.includes('archived_product_brand') ? () => onArchive(item.id_encrypted,setRefreshTable) : undefined}
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
