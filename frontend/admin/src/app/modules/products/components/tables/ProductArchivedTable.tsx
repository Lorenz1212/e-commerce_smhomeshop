// components/Table/SupplierTable.tsx
import React from 'react'
import { DataTable, Column } from '@@@/DataTable'
import { ActionsCell } from '@@@/datatable/ActionsCell'
import { ProductModel } from '../../core/_model'
import { ImageTitleCell } from '@@@/datatable/ImageTitleCell'
import { StatusCell } from '@@@/datatable/StatusCell'
import { useTableHook } from '@@@@@@/hooks/useTableHook'
import { toAbsoluteUrl } from '@/helpers'

type Props = {
  data: ProductModel[]
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

export const ProductArchivedTable: React.FC<Props> = ({
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

  const columns: Column<ProductModel>[] = [
    { title: '#', key: 'row_number', sortable: true },
    {
      title: 'Items',
      key: 'image_cover',
      render: (item:any) => (
        <ImageTitleCell
            image={item.primary_image?.image_cover??toAbsoluteUrl('media/products/default.jpg')}
            mainTitle={item.name}
            subTitle={item.sku}
        />
      ),
    },
    { title: 'QTY on hand', key: 'quantity_on_hand', sortable: true },
    { title: 'Cost Price', key: 'cost_price', sortable: true },
    { title: 'Selling Price', key: 'selling_price', sortable: true },
    {
      title: 'Stocks Status',
      key: 'stock_status',
      render: (item:any) => (
        <StatusCell
            color={item.stock_status['color']}
            title={item.stock_status['title']}
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
        <DataTable<ProductModel>
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
