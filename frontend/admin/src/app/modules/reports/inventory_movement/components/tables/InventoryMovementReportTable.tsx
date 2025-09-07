// components/Table/InventoryMovementReportTable.tsx
import React from 'react'
import { DataTable, Column } from '@@@/DataTable'
import { InventoryMovementReportModel } from '../../core/_model'
import { StatusCell } from '@@@/datatable/StatusCell'

type Props = {
  data: InventoryMovementReportModel[]
  loading: boolean
  pagination: any
  sortColumn: string
  sortDirection: 'asc' | 'desc'
  onPageChange: (page: number) => void
  onSortChange: (col: string, dir: 'asc' | 'desc') => void
  onSearchChange?: (value: any) => void,
  setRefreshTable?: (refresh: boolean) =>void
}

export const InventoryMovementReportTable: React.FC<Props> = ({
  data,
  loading,
  pagination,
  sortColumn,
  sortDirection,
  onPageChange,
  onSortChange,
  onSearchChange,
  setRefreshTable
}) => {
  const columns: Column<InventoryMovementReportModel>[] = [
    { title: 'ID', key: 'row_number', sortable: true },
    { title: 'Product', key: 'product', sortable: true,
           render: (row: InventoryMovementReportModel) => row.product?.name ?? 'N/A',

     },
    { title: 'Supplier', key: 'supplier.name', sortable: true,
       render: (row: InventoryMovementReportModel) => row.supplier?.name ?? 'N/A',
     },
    { title: 'Quantity', key: 'quantity', sortable: true },
    { title: 'Date', key: 'created_at_format', sortable: true },
    {
      title: 'Movement Type',
      key: 'movement_type',
      render: (item: InventoryMovementReportModel) => (
        <StatusCell
          color={item.movement_type === 'IN' ? 'success' : 'danger'}
          title={item.movement_type === 'IN' ? 'Stock In' : 'Stock Out'}
        />
      ),
    },
  ]

  return (
    <div className="table-responsive">
      {loading ? (
        <div className="alert alert-info">Loading...</div>
      ) : (
        <DataTable<InventoryMovementReportModel>
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
