import { FC } from 'react'

import { useTableHook } from '@@@@@@/hooks/useTableHook'
import { ProductCategoryModel } from '@@/product_categories/core/_model'
import { useProductCategory } from '@@/product_categories/core/_request'
import { ProductBrandArchivedTable } from '../tables/ProductBrandArchivedTable'
import { useProductBrand } from '@@/brands/core/_request'


const ViewBrandArchived: FC<{onRefreshFirstTable?: (refresh: boolean) =>void}> = ({onRefreshFirstTable}) => {
  
  const table = useTableHook<ProductCategoryModel>('/admin/product_brand/archived/list')  

  const { restoreProductBrand } = useProductBrand()

  return (
    <div className='row'>
      <div className='col-12'>
           <ProductBrandArchivedTable
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
              onRestore={restoreProductBrand}
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

export { ViewBrandArchived }
