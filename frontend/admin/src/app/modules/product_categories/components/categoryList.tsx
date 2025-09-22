
import { Content } from '@/layout/components/Content'
import {KTIcon, toAbsoluteUrl} from '@/helpers'
import React, { FC,  useEffect, useState  } from 'react'

import { ModalResponse } from '@@@@/types'
import ModalHandler from '@@@/ModalHandler'
import {  useProductCategory } from '../core/_request'
import { useTableHook } from '@@@@@@/hooks/useTableHook'
import { ViewCategoryDetailsModal } from './modals/viewCategoryDetails'
import { CreateCategoryModal } from './modals/createCategory'
import { EditCategoryModal } from './modals/editCategory'
import { ProductCategoryTable } from './tables/ProductCategoryTable'
import { ProductCategoryModel } from '../core/_model'
import { ViewCategoryArchived } from './modals/ViewCategoryArchived'
import { useAuth } from '@@/auth'

const CategoryList: FC = () => {
  const {currentUser} = useAuth();

  const permissions = currentUser?.permissions

  const table = useTableHook<ProductCategoryModel>('/admin/product_category/list')  

  const { viewProductCategoryDetails, archivedProductCategory } = useProductCategory()
  
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
      title: 'Create Category',
      body: <CreateCategoryModal 
              setPage={table.setPage}
              setRefreshTable={table.setRefreshTable} 
            />,
      className:'modal-lg',
      alignment:'centered'
    })
  }

  const handleCategoryEdit = async (category_id: string) => {
    const res = await viewProductCategoryDetails(category_id)
    if (!res) return;
    setModalState({
      visible: true,
      title: 'Edit Category',
      body: <EditCategoryModal 
              categoryID={category_id} 
              data={res} 
              setRefreshTable={table.setRefreshTable} 
            />,
      className:'modal-lg',
      alignment:'centered'
    })
  }

  const handleCategoryDetails = async  (category_id: string) => {
    const res = await viewProductCategoryDetails(category_id)
    if (!res) return;
    setModalState({
      visible: true,
      title: 'View Category Details',
      body: <ViewCategoryDetailsModal data={res} />,
      className:'modal-md',
      alignment:'centered'
    })
  }

   const handleCategoryArchivedList = async  () => {
    setModalState({
      visible: true,
      title: 'Archived',
      body: <ViewCategoryArchived
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
              <span className='card-label fw-bold fs-3 mb-1'>Product Category</span>
            </h3>
            <div
              className='card-toolbar'
              data-bs-toggle='tooltip'
              data-bs-placement='top'
              data-bs-trigger='hover'
              title='Click to add a user'
            >
                {
                      (permissions.includes("archived_product")) && (
                        <button onClick={() => handleCategoryArchivedList()}
                            className='btn btn-sm btn-light-danger me-3'
                          >
                          <KTIcon iconName='delete-files' className='fs-3' />
                            Archived
                        </button>
                      )
                  }
  
                  {
                      (permissions.includes("create_product")) && (
                        <button onClick={() => handleCreate()}
                            className='btn btn-sm btn-light-primary'
                          >
                          <KTIcon iconName='plus' className='fs-3' />
                            New Category
                        </button>
                      )
                  }
            </div>
          </div>
          {/* end::Header */}
          {/* begin::Body */}
          <div className='card-body py-3'>
            {/* begin::Table container */}
            <div className='table-responsive'>
              {/* begin::Table */}
              <ProductCategoryTable
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
                onEdit={handleCategoryEdit}
                onView={handleCategoryDetails}
                onArchive={archivedProductCategory}
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

export {CategoryList}
