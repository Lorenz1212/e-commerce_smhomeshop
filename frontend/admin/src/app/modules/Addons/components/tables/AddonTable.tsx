// components/Table/SupplierTable.tsx
import React from 'react'
import { DataTable, Column } from '@@@/datatable/DataTable'
import { ActionsCell } from '@@@/datatable/components/ActionsCell'
import { AddonModel } from '../../core/_model'
import { ImageTitleCell } from '@@@/datatable/components/ImageTitleCell'
import { KTIcon } from '@/helpers'

type Props = {
  data: AddonModel[]
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

export const ProductCategoryTable: React.FC<Props> = ({
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
  const columns: Column<AddonModel>[] = [
    { title: '#', key: 'row_number', sortable: true },
    { title: 'Name',key: 'name', sortable: true },
    { 
      title: 'Base Price',key: 'base_price', sortable: true,
      render: (item) => (
        <>
          {item.is_freebies == 'Y' ? (
            <>
              <span className='text-success'>Freebie</span>
            </>
          ):(
            item.base_price
          )}
        </>
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
