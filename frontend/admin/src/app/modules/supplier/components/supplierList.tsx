
import { Content } from '@/layout/components/Content'
import {KTIcon, toAbsoluteUrl} from '@/helpers'
import React, { FC,  useEffect, useState  } from 'react'

import { ModalResponse } from '@@@@/types'
import ModalHandler from '@@@/ModalHandler'
import {  useSupplierRequest } from '../core/_request'
import { CreatetSupplierModal } from './modals/createSupplier'

import { EditSupplierModal } from './modals/editSupplier'
import { ViewSupplierDetailsModal } from './modals/viewSupplierDetails'
import { SupplierTable } from './tables/SupplierTable'
import { SupplierModel } from '../core/_model'
import { useTableHook } from '@@@@@@/hooks/useTableHook'
import { ViewProductArchived } from '@@/products/components/modals/ViewProductArchived'
import { ViewSupplierArchived } from './modals/ViewSupplierArchived'

const SupplierList: FC = () => {

  const table = useTableHook<SupplierModel>('/admin/supplier/list')  
 
  const { viewSupplierDetails, archivedSupplier } = useSupplierRequest()
  
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
      title: 'Create Supplier',
      body: <CreatetSupplierModal setPage={table.setPage}/>,
      className:'modal-lg',
      alignment:'centered'
    })
  }

  const handleSupplierEdit = async (supplierId: string) => {
    const res = await viewSupplierDetails(supplierId)
    if (!res) return;
    setModalState({
      visible: true,
      title: 'Edit Supplier',
      body: <EditSupplierModal 
              supplierId={supplierId} 
              data={res} 
              setRefreshTable={table.setRefreshTable} 
            />,
      className:'modal-lg',
      alignment:'centered'
    })
  }

  const handleSupplierDetails = async  (supplierId: string) => {
    const res = await viewSupplierDetails(supplierId)
    if (!res) return;
    setModalState({
      visible: true,
      title: 'View Supplier Details',
      body: <ViewSupplierDetailsModal data={res} />,
      className:'modal-md',
      alignment:'centered'
    })
  }

  const handleSupplierArchivedList = async  () => {
    setModalState({
      visible: true,
      title: 'Archived',
      body: <ViewSupplierArchived
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
              <span className='card-label fw-bold fs-3 mb-1'>Supplier</span>
            </h3>
            <div
              className='card-toolbar'
              data-bs-toggle='tooltip'
              data-bs-placement='top'
              data-bs-trigger='hover'
              title='Click to add a user'
            >
              <button onClick={() => handleSupplierArchivedList()}
                  className='btn btn-sm btn-light-danger me-3'
                >
                <KTIcon iconName='delete-files' className='fs-3' />
                Archived
              </button>
              <button onClick={() => handleCreate()}
                className='btn btn-sm btn-light-primary'
                // data-bs-toggle='modal'
                // data-bs-target='#kt_modal_invite_friends'
              >
                <KTIcon iconName='plus' className='fs-3' />
                New Supplier
              </button>
            </div>
          </div>
          {/* end::Header */}
          {/* begin::Body */}
          <div className='card-body py-3'>
            {/* begin::Table container */}
            <div className='table-responsive'>
              {/* begin::Table */}
              <SupplierTable
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
                onEdit={handleSupplierEdit}
                onView={handleSupplierDetails}
                onArchive={archivedSupplier}
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

export {SupplierList}
