import React from 'react'
import { DataTable, Column } from '@@@/datatable/DataTable'
import { ActionsCell } from '@@@/datatable/components/ActionsCell'
import { SupplierModel } from '../../core/_model'

type Props = {
  data: SupplierModel[]
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

export const SupplierTable: React.FC<Props> = ({
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
  const columns: Column<SupplierModel>[] = [
    { title: '#', key: 'row_number', sortable: true },
    { title: 'Name', key: 'name', sortable: true },
    { title: 'Contact Person.', key: 'contact_person' },
    { title: 'Contact No.', key: 'phone', sortable: true },
    { title: 'Email Address', key: 'email', sortable: true },
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
        <DataTable<SupplierModel>
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
