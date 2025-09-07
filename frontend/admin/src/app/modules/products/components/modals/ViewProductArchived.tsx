import { FC } from 'react'
import { ProductArchivedTable } from '../tables/ProductArchivedTable'
import { ProductModel } from '@@/products/core/_model'
import { useTableHook } from '@@@@@@/hooks/useTableHook'
import { useProduct } from '@@/products/core/_request'


const ViewProductArchived: FC<{onRefreshFirstTable?: (refresh: boolean) =>void}> = ({onRefreshFirstTable}) => {
  
  const table = useTableHook<ProductModel>('/admin/product/archived/list')  

  const { restoreProduct } = useProduct()

  return (
    <div className='row'>
      <div className='col-12'>
           <ProductArchivedTable
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
              onRestore={restoreProduct}
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

export { ViewProductArchived }
