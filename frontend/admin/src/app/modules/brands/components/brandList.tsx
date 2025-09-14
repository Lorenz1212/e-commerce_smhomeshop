
import { Content } from '@/layout/components/Content'
import {KTIcon, toAbsoluteUrl} from '@/helpers'
import React, { FC,  useEffect, useState  } from 'react'

import { ModalResponse } from '@@@@/types'
import ModalHandler from '@@@/ModalHandler'

import { useTableHook } from '@@@@@@/hooks/useTableHook'
import { ProductBrandModel } from '../core/_model'
import { useProductBrand } from '../core/_request'
import { CreateBrandModal } from './modals/createBrand'
import { EditBrandModal } from './modals/editBrand'
import { ViewBrandDetailsModal } from './modals/viewBrandDetails'
import { ViewBrandArchived } from './modals/ViewBrandArchived'
import { ProductBrandTable } from './tables/ProductBrandTable'

const BrandList: FC<{title:string}> = ({title}) => {

   const table = useTableHook<ProductBrandModel>('/admin/product_brand/list')  

  const { viewProductBrandDetails, archivedProductBrand } = useProductBrand()
  
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
      body: <CreateBrandModal 
              setPage={table.setPage}
              setRefreshTable={table.setRefreshTable} 
            />,
      className:'modal-lg',
      alignment:'centered'
    })
  }

  const handleCategoryEdit = async (brand_id: string) => {
    const res = await viewProductBrandDetails(brand_id)
    if (!res) return;
    setModalState({
      visible: true,
      title: `Edit ${title}`,
      body: <EditBrandModal 
              brandID={brand_id} 
              data={res} 
              setRefreshTable={table.setRefreshTable} 
            />,
      className:'modal-lg',
      alignment:'centered'
    })
  }

  const handleCategoryDetails = async  (category_id: string) => {
    const res = await viewProductBrandDetails(category_id)
    if (!res) return;
    setModalState({
      visible: true,
      title: `View ${title} Details`,
      body: <ViewBrandDetailsModal data={res} />,
      className:'modal-md',
      alignment:'centered'
    })
  }

   const handleCategoryArchivedList = async  () => {
    setModalState({
      visible: true,
      title: 'Archived',
      body: <ViewBrandArchived
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
              title='Click to add a user'
            >
                <button onClick={() => handleCategoryArchivedList()}
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
              <ProductBrandTable
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
                onArchive={archivedProductBrand}
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

export {BrandList}
