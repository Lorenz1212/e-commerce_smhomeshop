// components/Table/SupplierTable.tsx
import React from 'react'
import { DataTable, Column } from '@@@/datatable/DataTable'
import { ActionsCell } from '@@@/datatable/components/ActionsCell'
import { ProductModel } from '../../core/_model'
import { ImageTitleCell } from '@@@/datatable/components/ImageTitleCell'
import { StatusCell } from '@@@/datatable/components/StatusCell'
import { toAbsoluteUrl } from '@/helpers'
import { CurrencyText } from '@@@/inputmasks/CurrencyText'

type Props = {
  data: ProductModel[]
  loading: boolean
  pagination: any
  sortColumn: string
  sortDirection: 'asc' | 'desc'
  onPageChange: (page: number) => void
  onSortChange: (col: string, dir: 'asc' | 'desc') => void
  onEdit: (id: string) => void
  onView: (id: string) => void
  onArchive: (id: string, setRefreshTable?: (refresh: boolean) =>void) => void
  setRefreshTable?: (refresh: boolean) =>void
  onSearchChange?:(value: any) => void
}

export const ProductTable: React.FC<Props> = ({
  data,
  loading,
  pagination,
  sortColumn,
  sortDirection,
  onPageChange,
  onSortChange,
  onEdit,
  onView,
  onArchive,
  onSearchChange,
  setRefreshTable,
}) => {

  const columns: Column<ProductModel>[] = [
    { title: '#', key: 'row_number', sortable: true },
    {
      title: 'Items',
      key: 'image_cover',
      render: (item:any) => (
        <ImageTitleCell
            image={item.primary_image?.image_cover??toAbsoluteUrl('media/products/default.jpg')}
            mainTitle={item.name}
            subTitle={item.sku}
        />
      ),
    },
    { title: 'QTY on hand', key: 'quantity_on_hand', sortable: true,
      render: (item:any) => (
        <>
       <div className="d-flex flex-column align-items-start">
          <span className='mb-2'>QTY: {item.quantity_on_hand}</span>
          <StatusCell
            color={item.stock_status['color']}
            title={item.stock_status['title']}
          />
        </div>
        </>
      ),
    },
    { title: 'Price', key: 'cost_price', sortable: true,
       render: (item:any) => (
        <>
         <div className="d-flex flex-column align-items-start">
            <span className='mb-2'>Cost: { <CurrencyText value={item.cost_price || 0} />}</span>
             <span className='mb-2'>Selling: { <CurrencyText value={item.selling_price || 0} />}</span>
          </div>
          </>
        ),
    },
    {
      title: 'Variants',
      key: 'variants',
      render: (item: any) => (
        <div className="d-flex flex-column gap-1">
          {item.variants && item.variants.length > 0 ? (
            item.variants.map((variant: any, idx: number) => (
              <div key={idx} className="border rounded p-2 bg-light">
                <div className="fw-semibold small">
                  SKU: <span className="text-primary">{variant.sku}</span>
                </div>
                <div className="small">
                  Name: {variant.variant_name ?? '-'}
                </div>
                <div className="small">
                  Qty: <span className="fw-bold">{variant.quantity_on_hand ?? 0}</span>
                </div>
              </div>
            ))
          ) : (
            <span className="text-muted small">No variants</span>
          )}
        </div>
      ),
    },
    { title: 'Created At', key: 'created_at_format', sortable: true },
    {
      title: 'Action',
      key: 'id_encrypted',
      render: (item) => (
        <ActionsCell
          openDetailsModal={() => onView(item.id_encrypted)}
          openEditModal={() => onEdit(item.id_encrypted)}
          archiveAction={() => onArchive(item.id_encrypted,setRefreshTable)}
        />
      ),
    },
  ]

  return (
    <div className="table-responsive">
      {loading ? (
        <div className="alert alert-info">Loading...</div>
      ) : (
        <DataTable<ProductModel>
          data={data}
          columns={columns}
          loading={loading}
          pagination={pagination}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onPageChange={onPageChange}
          onSortChange={onSortChange}
          onSearchChange={onSearchChange}
        />
      )}
    </div>
  )
}
