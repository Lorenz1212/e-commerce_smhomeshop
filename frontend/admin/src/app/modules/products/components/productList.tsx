
import { Content } from '@/layout/components/Content'
import {KTIcon, toAbsoluteUrl} from '@/helpers'
import React, { FC,  useEffect, useState  } from 'react'

import { ModalResponse } from '@@@@/types'
import ModalHandler from '@@@/ModalHandler'
import { useTableHook } from '@@@@@@/hooks/useTableHook'
import { ProductTable } from './tables/ProductTable'
import { useProduct } from '../core/_request'
import { CreateProductModal } from './modals/createProduct'
import { EditProductModal } from './modals/editProduct'
import { ProductModel } from '../core/_model'
import { ViewProductArchived } from './modals/ViewProductArchived'
import { ViewProductDetailsModal } from './modals/ViewProductDetails'

const ProductList: FC = () => {

  const table = useTableHook<ProductModel>('/admin/product/list')  

  const { viewProductDetails, archivedProduct } = useProduct()
  
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
      title: 'Create Product',
      body: <CreateProductModal 
              setPage={table.setPage}
              setRefreshTable={table.setRefreshTable} 
            />,
      className:'modal-xl',
      alignment:'centered'
    })
  }

  const handleProductEdit = async (product_id: string) => {
    const res = await viewProductDetails(product_id)
    if (!res) return;
    setModalState({
      visible: true,
      title: 'Edit Product',
      body: <EditProductModal 
              productID={product_id} 
              data={res} 
              setRefreshTable={table.setRefreshTable} 
            />,
      className:'modal-xl',
      alignment:'centered'
    })
  }

  const handleProductDetails = async  (product_id: string) => {
    const res = await viewProductDetails(product_id)
    if (!res) return;
    setModalState({
      visible: true,
      title: 'View Product Details',
      body: <ViewProductDetailsModal data={res} />,
      className:'modal-lg',
      alignment:'centered'
    })
  }

  const handleProductArchivedList = async  () => {
    setModalState({
      visible: true,
      title: 'Archived',
      body: <ViewProductArchived
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
              <span className='card-label fw-bold fs-3 mb-1'>Products</span>
            </h3>
            <div
              className='card-toolbar'
              data-bs-toggle='tooltip'
              data-bs-placement='top'
              data-bs-trigger='hover'
              title='Click to add a user'
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
                New Product
              </button>
            </div>
          </div>
          {/* end::Header */}
          {/* begin::Body */}
          <div className='card-body py-3'>
            {/* begin::Table container */}
            <div className='table-responsive'>
              {/* begin::Table */}
              <ProductTable
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
                onArchive={archivedProduct}
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

export {ProductList}
