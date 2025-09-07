import { FC } from 'react'
import { useTableHook } from '@@@@@@/hooks/useTableHook'
import { SupplierArchivedTable } from '../tables/SupplierArchivedTable'
import { useSupplierRequest } from '@@/supplier/core/_request'
import { SupplierModel } from '@@/supplier/core/_model'


const ViewSupplierArchived: FC<{onRefreshFirstTable?: (refresh: boolean) =>void}> = ({onRefreshFirstTable}) => {
  
  const table = useTableHook<SupplierModel>('/admin/supplier/archived/list')  

  const { restoreSupplier } = useSupplierRequest()

  return (
    <div className='row'>
      <div className='col-12'>
           <SupplierArchivedTable
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
              onRestore={restoreSupplier}
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

export { ViewSupplierArchived }
