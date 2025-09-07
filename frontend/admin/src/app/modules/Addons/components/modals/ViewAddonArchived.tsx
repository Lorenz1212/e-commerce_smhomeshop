import { FC } from 'react'
import { useTableHook } from '@@@@@@/hooks/useTableHook'
import { AddonModel } from '@@/Addons/core/_model'
import { useAddon } from '@@/Addons/core/_request'
import { AddonArchivedTable } from '../tables/AddonArchivedTable'


const ViewAddonArchived: FC<{onRefreshFirstTable?: (refresh: boolean) =>void}> = ({onRefreshFirstTable}) => {
  
  const table = useTableHook<AddonModel>('/admin/addon/archived/list')  

  const { restoreAddon } = useAddon()

  return (
    <div className='row'>
      <div className='col-12'>
           <AddonArchivedTable
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
              onRestore={restoreAddon}
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

export { ViewAddonArchived }
