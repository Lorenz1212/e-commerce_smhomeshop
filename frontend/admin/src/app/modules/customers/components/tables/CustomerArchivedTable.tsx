import React from 'react'
import { DataTable, Column } from '@@@/datatable/DataTable'
import { ActionsCell } from '@@@/datatable/components/ActionsCell'
import { ImageTitleCell } from '@@@/datatable/components/ImageTitleCell'
import { toAbsoluteUrl } from '@/helpers'
import { CustomerListModel } from '@@/customers/core/_model'
import { useAuth } from '@@/auth'

type Props = {
  data: CustomerListModel[]
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

export const CustomerArchivedTable: React.FC<Props> = ({
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
  const {currentUser} = useAuth();

  const permissions = currentUser?.permissions

  const columns: Column<CustomerListModel>[] = [
    { title: '#', key: 'row_number', sortable: true },
    {
      title: 'User',
      key: 'image_cover',
      render: (item:any) => (
        <ImageTitleCell
            image={item.image_cover??toAbsoluteUrl('media/products/default.jpg')}
            mainTitle={item.full_name}
            subTitle={item.account_no}
        />
      ),
    },
    {
      title: 'Contact Info',
      key: 'email',
      sortable: true,
     render: (item:any) => (
        <ImageTitleCell
            mainTitle={item.customer_account.email}
            subTitle={item.phone??'No Mobile Number Available'}
        />
      ),
    },
    {
      title: 'Gender',
      key: 'gender_text_format',
      sortable: true
    },
    {
      title: 'Birth Date',
      key: 'birth_date_format',
      sortable: true
    },
    {
      title: 'Action',
      key: 'id_encrypted',
      render: (item) => (
        <ActionsCell
            restoreAction={permissions.includes('restore_customer') ? () => onRestore(item.id_encrypted,setRefreshTable, setRefreshFirstTable) : undefined}
        />
      ),
    },
  ]

  return (
    <div className="table-responsive">
      {loading ? (
        <div className="alert alert-info">Loading...</div>
      ) : (
        <DataTable<CustomerListModel>
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
