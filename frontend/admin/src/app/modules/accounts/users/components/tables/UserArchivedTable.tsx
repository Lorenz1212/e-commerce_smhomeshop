import React from 'react'
import { DataTable, Column } from '@@@/datatable/DataTable'
import { ActionsCell } from '@@@/datatable/components/ActionsCell'
import { UserListModel } from '../../core/_models'
import { ImageTitleCell } from '@@@/datatable/components/ImageTitleCell'
import { toAbsoluteUrl } from '@/helpers'

type Props = {
  data: UserListModel[]
  loading: boolean
  pagination: any
  sortColumn: string
  sortDirection: 'asc' | 'desc'
  onPageChange: (page: number) => void
  onSortChange: (col: string, dir: 'asc' | 'desc') => void
  onRestore: (id: string, setRefreshTable?: (refresh: boolean) =>void, setRefreshFirstTable?: (refresh: boolean) =>void) => void
  setRefreshTable?: (refresh: boolean) =>void
  onSearchChange?:(value: any) => void
  setRefreshFirstTable?: (refresh: boolean) =>void
}

export const UserArchivedTable: React.FC<Props> = ({
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
  const columns: Column<UserListModel>[] = [
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
            mainTitle={item.user.email}
            subTitle={item.contant_no??'No Mobile Number Available'}
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
        <DataTable<UserListModel>
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
