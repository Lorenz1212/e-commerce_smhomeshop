import { FC } from 'react'
import { useTableHook } from '@@@@@@/hooks/useTableHook'
import { useAddon } from '@@/Addons/core/_request'
import { RoleModel } from '../core/_models'
import { RoleArchivedTable } from '../tables/RoleArchivedTable'
import { useRole } from '../core/_requests'

const ViewRoleArchived: FC<{onRefreshFirstTable?: (refresh: boolean) =>void}> = ({onRefreshFirstTable}) => {
  
  const table = useTableHook<RoleModel>('/core/role/archived/list')  

  const { restoreRole } = useRole()

  return (
    <div className='row'>
      <div className='col-12'>
           <RoleArchivedTable
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
              onRestore={restoreRole}
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

export { ViewRoleArchived }
