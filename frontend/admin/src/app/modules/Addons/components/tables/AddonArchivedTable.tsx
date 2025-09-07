// components/Table/SupplierTable.tsx
import React from 'react'
import { DataTable, Column } from '@@@/DataTable'
import { ActionsCell } from '@@@/datatable/ActionsCell'
import { AddonModel } from '../../core/_model'
import { ImageTitleCell } from '@@@/datatable/ImageTitleCell'

type Props = {
  data: AddonModel[]
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

export const AddonArchivedTable: React.FC<Props> = ({
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
  const columns: Column<AddonModel>[] = [
    { title: '#', key: 'row_number', sortable: true },
    { title: 'Name',key: 'name', sortable: true },
    { title: 'Base Price',key: 'base_price', sortable: true },
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
        <DataTable<AddonModel>
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
