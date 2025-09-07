
import { Content } from '@/layout/components/Content'
import {KTIcon, toAbsoluteUrl} from '@/helpers'
import React, { FC,  useEffect, useState  } from 'react'

import { ModalResponse } from '@@@@/types'
import ModalHandler from '@@@/ModalHandler'
import { useTableHook } from '@@@@@@/hooks/useTableHook'
import { RoleModel } from './components/core/_models'
import { useRole } from './components/core/_requests'
import { CreateRoleModal } from './components/modals/CreateRole'
import { EditRoleModal } from './components/modals/EditRole'
import { ViewRoleDetailsModal } from './components/modals/ViewRoleDetails'
import { ViewRoleArchived } from './components/modals/ViewRoleArchived'
import { RoleTable } from './components/tables/RoleTable'


const RolePage: FC<{title:String}> = ({title}) => {

  const table = useTableHook<RoleModel>('/core/role/list')  

  const { viewRoleDetails, archivedRole } = useRole()
  
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
      body: <CreateRoleModal 
              setPage={table.setPage}
              setRefreshTable={table.setRefreshTable} 
            />,
      className:'modal-xl',
      alignment:'centered'
    })
  }

  const handleProductEdit = async (role_id: string) => {
    const res = await viewRoleDetails(role_id)
    if (!res) return;
    setModalState({
      visible: true,
      title: `Edit ${title}`,
      body: <EditRoleModal 
              roleID={role_id} 
              data={res} 
              setRefreshTable={table.setRefreshTable} 
            />,
      className:'modal-xl',
      alignment:'centered'
    })
  }

  const handleProductDetails = async  (product_id: string) => {
    const res = await viewRoleDetails(product_id)
    if (!res) return;
    setModalState({
      visible: true,
      title: `View ${title} Details`,
      body: <ViewRoleDetailsModal data={res} />,
      className:'modal-xl',
      alignment:'centered'
    })
  }

  const handleProductArchivedList = async  () => {
    setModalState({
      visible: true,
      title: 'Archived',
      body: <ViewRoleArchived
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
                <button onClick={() => handleProductArchivedList()}
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
              <RoleTable
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
                onEdit={handleProductEdit}
                onView={handleProductDetails}
                onArchive={archivedRole}
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

export {RolePage}
