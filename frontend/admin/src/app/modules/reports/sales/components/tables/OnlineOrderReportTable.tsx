// components/Table/SupplierTable.tsx
import React from 'react'
import { DataTable, Column } from '@@@/datatable/DataTable'
import { ActionsCell } from '@@@/datatable/components/ActionsCell'
import { ImageTitleCell } from '@@@/datatable/components/ImageTitleCell'
import { OnlineOrderListModel } from '../../core/_model'
import { TitleBlockCell } from '@@@/datatable/components/TitleBlockCell'
import { StatusCell } from '@@@/datatable/components/StatusCell'
import { CurrencyText } from '@@@/inputmasks/CurrencyText'

type Props = {
  data: OnlineOrderListModel[]
  loading: boolean
  pagination: any
  sortColumn: string
  sortDirection: 'asc' | 'desc'
  onPageChange: (page: number) => void
  onSortChange: (col: string, dir: 'asc' | 'desc') => void
  onView: (id: string) => void
  setRefreshTable?: (refresh: boolean) =>void
  onSearchChange?:(value: any) => void
}

export const OnlineOrderReportTable: React.FC<Props> = ({
  data,
  loading,
  pagination,
  sortColumn,
  sortDirection,
  onPageChange,
  onSortChange,
  onView,
  onSearchChange,
}) => {

  const columns: Column<OnlineOrderListModel>[] = [
    { title: '#', key: 'row_number', sortable: true },
    {
      title: 'Orders',
      key: 'order_no',
      render: (item:any) => (
        <ImageTitleCell
            mainTitle={item.customer_name}
            subTitle={item.order_no}
        />
      ),
    },
    { title: 'Order Date', key: 'order_date_format', sortable: true },
    { 
      title: 'Total Amount', key: 'total_amount', 
      render: (item:any) => (
        <TitleBlockCell
            mainTitle={<CurrencyText value={item.total_amount??0}/>}
                    subTitle={[
            <>
              VAT AMOUNT: <CurrencyText value={item.tax_amount ?? 0} />
            </>,
            <>
              VATABLE SALES: <CurrencyText value={(item.subtotal-item.tax_amount)} />
            </>,
          ]}
        />
      ),
    },
    {
      title: 'Action',
      key: 'id_encrypted',
      render: (item) => (
        <ActionsCell
          openDetailsModal={() => onView(item.id_encrypted)}
        />
      ),
    },
  ]

  return (
    <div className="table-responsive">
      {loading ? (
        <div className="alert alert-info">Loading...</div>
      ) : (
        <DataTable<OnlineOrderListModel>
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
