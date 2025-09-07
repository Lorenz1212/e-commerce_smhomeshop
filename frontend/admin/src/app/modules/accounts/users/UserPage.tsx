
import { Content } from '@/layout/components/Content'
import {KTIcon} from '@/helpers'
import React, { FC,  useEffect, useState  } from 'react'
import { ModalResponse } from '@@@@/types'
import ModalHandler from '@@@/ModalHandler'
import { useTableHook } from '@@@@@@/hooks/useTableHook'
import { UserListModel } from './core/_models'
import { useUser } from './core/_requests'
import { CreateUserModal } from './components/modals/createUser'
import { EditUserModal } from './components/modals/editUser'
import { ViewUserDetailsModal } from './components/modals/viewUserDetails'
import { ViewUserArchived } from './components/modals/viewUserArchived'
import { UserTable } from './components/tables/UserTable'


const UserPage: FC<{title:String}> = ({title}) => {

  const table = useTableHook<UserListModel>('/core/user/list')  

  const { viewUserDetails, archivedUser, resetPasswordUser } = useUser()
  
  const [modalState, setModalState] = useState<ModalResponse>({
    visible: false,
    title: '',
    body: <></>,
    className:'modal-xl',
    alignment:'centered'
  })

  const handleCreate = () => {
    setModalState({
      visible: true,
      title: `Create ${title}`,
      body: <CreateUserModal 
              setPage={table.setPage}
              setRefreshTable={table.setRefreshTable} 
            />,
      className:'modal-xl',
      alignment:'centered'
    })
  }

  const handleUserEdit = async (user_id: string) => {
    const res = await viewUserDetails(user_id)
    if (!res) return;
    setModalState({
      visible: true,
      title: `Edit ${title}`,
      body: <EditUserModal 
              userID={user_id} 
              data={res} 
              setRefreshTable={table.setRefreshTable} 
            />,
      className:'modal-xl',
      alignment:'centered'
    })
  }

  const handleUserDetails = async  (user_id: string) => {
    const res = await viewUserDetails(user_id)
    if (!res) return;
    setModalState({
      visible: true,
      title: `View ${title} Details`,
      body: <ViewUserDetailsModal data={res} />,
      className:'modal-md',
      alignment:'centered'
    })
  }

  const handleUserArchivedList = async  () => {
    setModalState({
      visible: true,
      title: 'Archived',
      body: <ViewUserArchived
                onRefreshFirstTable={table.setRefreshTable}
            />,
      className:'modal-xl',
      alignment:'centered'
    })
  }

  return (
    <>
      <Content>
         <div className='card mb-5 mb-xl-8'>
          {/* begin::Header */}
          <div className='card-header border-0 pt-5'>
            <h3 className='card-title align-items-start flex-column'>
              <span className='card-label fw-bold fs-3 mb-1'>{title}s</span>
            </h3>
            <div
              className='card-toolbar'
              data-bs-toggle='tooltip'
              data-bs-placement='top'
              data-bs-trigger='hover'
              title={`Click to add a ${title.toLowerCase()}`}
            >
                <button onClick={() => handleUserArchivedList()}
                    className='btn btn-sm btn-light-danger me-3'
                  >
                <KTIcon iconName='delete-files' className='fs-3' />
                  Archived
                </button>
                <button onClick={() => handleCreate()}
                  className='btn btn-sm btn-light-primary'
                >
                <KTIcon iconName='plus' className='fs-3' />
                New {title}
              </button>
            </div>
          </div>
          {/* end::Header */}
          {/* begin::Body */}
          <div className='card-body py-3'>
            {/* begin::Table container */}
            <div className='table-responsive'>
              {/* begin::Table */}
              <UserTable
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
                onEdit={handleUserEdit}
                onView={handleUserDetails}
                onArchive={archivedUser}
                onResetPassword={resetPasswordUser}
                onSearchChange={(val) => {
                  table.setPage(1)
                  table.setSearch(val)
                }}
                setRefreshTable={table.setRefreshTable}
              />
              {/* end::Table */}
            </div>
            {/* end::Table container */}
          </div>
          {/* begin::Body */}
        </div>
        {modalState.visible && (
          <ModalHandler
            title={modalState.title}
            body={modalState.body}
            modalClass={modalState.className}
            alignment={modalState.alignment}
            onClose={() =>
              setModalState({
                visible: false,
                title: '',
                body: <></>,
                className: '',
                alignment: 'center',
              })
            }
          />
      )}
      </Content>
    </>
  )
}

export {UserPage}
