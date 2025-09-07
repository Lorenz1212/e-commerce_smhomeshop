// components/Table/SupplierTable.tsx
import React from 'react'
import { DataTable, Column } from '@@@/DataTable'
import { ActionsCell } from '@@@/datatable/ActionsCell'
import { RoleModel } from '../core/_models'

type Props = {
  data: RoleModel[]
  loading: boolean
  pagination: any
  sortColumn: string
  sortDirection: 'asc' | 'desc'
  onPageChange: (page: number) => void
  onSortChange: (col: string, dir: 'asc' | 'desc') => void
  onRestore: (
    id: string, 
    setRefreshTable?: (refresh: boolean) =>void,
    setRefreshFirstTable?: (refresh: boolean) =>void
  ) => void
  setRefreshTable?: (refresh: boolean) =>void
  onSearchChange?:(value: any) => void
  setRefreshFirstTable?: (refresh: boolean) => void
}

export const RoleArchivedTable: React.FC<Props> = ({
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
  const columns: Column<RoleModel>[] = [
    { title: '#', key: 'row_number', sortable: true },
    { title: 'Name',key: 'name', sortable: true },
    {
      title: 'Permissions',
      key: 'permissionParents',
      render: (item) => {
        if (!item.permissionParents || item.permissionParents.length === 0) {
          return <span className="text-muted">No permissions</span>
        }

        return (
          <div className="d-flex flex-wrap gap-1">
            {item.permissionParents.map((parent: any, idx: number) => (
              <span key={idx} className="badge bg-primary">
                {parent.name}
              </span>
            ))}
          </div>
        )
      },
    },
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
        <DataTable<RoleModel>
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
