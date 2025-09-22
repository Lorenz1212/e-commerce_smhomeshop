import React from 'react'
import { DataTable, Column } from '@@@/datatable/DataTable'
import { ActionsCell } from '@@@/datatable/components/ActionsCell'
import { RoleModel } from '../core/_models'
import { useAuth } from '@@/auth'

type Props = {
  data: RoleModel[]
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

export const RoleTable: React.FC<Props> = ({
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
            openDetailsModal={permissions.includes('view_role_details') ? () => onView(item.id_encrypted) : undefined}
            openEditModal={permissions.includes('update_role') ? () => onEdit(item.id_encrypted) : undefined}
            archiveAction={permissions.includes('archived_role') ? () => onArchive(item.id_encrypted,setRefreshTable) : undefined}
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
