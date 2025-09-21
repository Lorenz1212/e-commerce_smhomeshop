// components/Table/SupplierTable.tsx
import React from 'react'
import { DataTable, Column } from '@@@/datatable/DataTable'
import { ImageTitleCell } from '@@@/datatable/components/ImageTitleCell'
import { StatusCell } from '@@@/datatable/components/StatusCell'
import { ProductModel } from '@@/products/core/_model'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { toAbsoluteUrl } from '@/helpers'

type Props = {
  data: ProductModel[]
  loading: boolean
  setRefreshTable?: (refresh: boolean) =>void
}

  export const ProductStocksTable: React.FC<Props> = ({
    data,
    loading,
    setRefreshTable,
  }) => {

  const count = data.length;

  const columns: Column<ProductModel>[] = [
    { title: '#', key: 'row_number', sortable: true },
    {
      title: 'Items',
      key: 'image_cover',
      render: (item) => (
        <ImageTitleCell
            image={item.image_cover??toAbsoluteUrl('media/products/default.jpg')}
            mainTitle={item.name}
            subTitle={item.sku}
        />
      ),
    },
    { title: 'QTY on hand', key: 'quantity_on_hand', sortable: true },
    {
      title: 'Status',
      key: 'status',
      render: (item:any) => (
        <StatusCell
            color={item.status['color']}
            title={item.status['title']}
        />
      ),
    },
  ]

  return (
    <>
        <DataTable<ProductModel>
          data={data}
          columns={columns}
          loading={loading}
          classNameCard="card-xxl-stretch mb-5 mb-xl-8"
          cardTitle="Product Stocks"
          cardSubTitle={`${count} Product${count !== 1 ? 's' : ''}`}
          scrollHeight="500px"
        />
    </>
  )
}
