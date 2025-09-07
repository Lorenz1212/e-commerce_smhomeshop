import { FC } from 'react'
import { useTableHook } from '@@@@@@/hooks/useTableHook'
import { CustomerListModel } from '@@/customers/core/_model'
import { useCustomer } from '@@/customers/core/_request'
import { CustomerArchivedTable } from '../tables/CustomerArchivedTable'

const ViewCustomerArchived: FC<{onRefreshFirstTable?: (refresh: boolean) =>void}> = ({onRefreshFirstTable}) => {
  
  const table = useTableHook<CustomerListModel>('/admin/customer/archived/list')  

  const { restoreCustomer } = useCustomer()

  return (
    <div className='row'>
      <div className='col-12'>
           <CustomerArchivedTable
              data={table.data}
              loading={table.loading}
              pagination={table.pagination}
              sortColumn={table.sortColumn}
              sortDirection={table.sortDirection}
              onPageChange={table.setPage}
              onSortChange={(col, dir) => {
                table.setSortColumn(col)
                table.setSortDirection(dir)
              }}
              onRestore={restoreCustomer}
              onSearchChange={(val) => {
                table.setPage(1)
                table.setSearch(val)
              }}
              setRefreshTable={table.setRefreshTable}
              setRefreshFirstTable={onRefreshFirstTable}
            />
      </div>
    </div>
  )
}

export { ViewCustomerArchived }
