
import { Content } from '@/layout/components/Content'
import {KTIcon} from '@/helpers'
import React, { FC,  useEffect, useState  } from 'react'
import { ModalResponse } from '@@@@/types'
import ModalHandler from '@@@/ModalHandler'
import { useTableHook } from '@@@@@@/hooks/useTableHook'
import { CustomerListModel } from '../core/_model'
import { useCustomer } from '../core/_request'
import { ViewCustomerDetails } from './modals/viewCustomerDetails'
import { ViewCustomerArchived } from './modals/viewCustomerArchived'
import { CustomerTable } from './tables/CustomerTable'
import { EditCustomerModal } from './modals/editCustomer'


const CustomerList: FC<{title:String}> = ({title}) => {

  const table = useTableHook<CustomerListModel>('/admin/customer/list')  

  const { viewCustomerDetails, archivedCustomer } = useCustomer()
  
  const [modalState, setModalState] = useState<ModalResponse>({
    visible: false,
    title: '',
    body: <></>,
    className:'modal-xl',
    alignment:'centered'
  })


  const handleCustomerEdit = async (customer_id: string) => {
    const res = await viewCustomerDetails(customer_id)
    if (!res) return;
    setModalState({
      visible: true,
      title: `Edit ${title}`,
      body: <EditCustomerModal 
              customerID={customer_id} 
              data={res} 
              setRefreshTable={table.setRefreshTable} 
            />,
      className:'modal-xl',
      alignment:'centered'
    })
  }

  const handleCustomerDetails = async  (customer_id: string) => {
    const res = await viewCustomerDetails(customer_id)
    if (!res) return;
    setModalState({
      visible: true,
      title: `View ${title} Details`,
      body: <ViewCustomerDetails data={res} />,
      className:'modal-md',
      alignment:'centered'
    })
  }

  const handleCustomerArchivedList = async  () => {
    setModalState({
      visible: true,
      title: 'Archived',
      body: <ViewCustomerArchived
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
                <button onClick={() => handleCustomerArchivedList()}
                    className='btn btn-sm btn-light-danger me-3'
                  >
                <KTIcon iconName='delete-files' className='fs-3' />
                  Archived
                </button>
            </div>
          </div>
          {/* end::Header */}
          {/* begin::Body */}
          <div className='card-body py-3'>
            {/* begin::Table container */}
            <div className='table-responsive'>
              {/* begin::Table */}
              <CustomerTable
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
                onEdit={handleCustomerEdit}
                onView={handleCustomerDetails}
                onArchive={archivedCustomer}
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

export {CustomerList}
