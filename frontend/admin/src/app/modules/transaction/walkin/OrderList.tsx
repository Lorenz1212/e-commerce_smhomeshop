
import { Content } from '@/layout/components/Content'
import {KTIcon, toAbsoluteUrl} from '@/helpers'
import React, { FC,  useEffect, useState  } from 'react'
import { ModalResponse } from '@@@@/types'
import ModalHandler from '@@@/ModalHandler'
import { useTableHook } from '@@@@@@/hooks/useTableHook'
import { WalkinOrderListModel } from './core/_model'
import { useOrder } from './core/_request'
import { ViewReceipt } from './components/modals/ViewReceipt'
import { WalkinOrderTable } from './components/tables/WalkinOrderTable'

const OrderList: FC<{title:any}> = ({title}) => {

  const table = useTableHook<WalkinOrderListModel>('/admin/order/walkin/list')  

  const { viewOrderDetails } = useOrder()
  
  const [modalState, setModalState] = useState<ModalResponse>({
    visible: false,
    title: '',
    body: <></>,
    className:'modal-xl',
    alignment:'centered'
  })


  const handleOrderDetails = async  (product_id: string) => {
    const res = await viewOrderDetails(product_id)
    if (!res) return;
    setModalState({
      visible: true,
      title: 'View Invoice',
      body: <ViewReceipt data={res} />,
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
              <span className='card-label fw-bold fs-3 mb-1'>{title}</span>
            </h3>
          </div>
          {/* end::Header */}
          {/* begin::Body */}
          <div className='card-body py-3'>
            {/* begin::Table container */}
            <div className='table-responsive'>
              {/* begin::Table */}
              <WalkinOrderTable
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
                onView={handleOrderDetails}
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

export {OrderList}
