import { FC } from 'react'
import { useTableHook } from '@@@@@@/hooks/useTableHook'
import { UserArchivedTable } from '../tables/UserArchivedTable'
import { UserListModel } from '../../core/_models'
import { useUser } from '../../core/_requests'

const ViewUserArchived: FC<{onRefreshFirstTable?: (refresh: boolean) =>void}> = ({onRefreshFirstTable}) => {
  
  const table = useTableHook<UserListModel>('/core/user/archived/list')  

  const { restoreUser } = useUser()

  return (
    <div className='row'>
      <div className='col-12'>
           <UserArchivedTable
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
              onRestore={restoreUser}
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

export { ViewUserArchived }
