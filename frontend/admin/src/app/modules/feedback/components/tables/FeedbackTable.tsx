// components/Table/SupplierTable.tsx
import React from 'react'
import { DataTable, Column } from '@@@/datatable/DataTable'
import { ActionsCell } from '@@@/datatable/components/ActionsCell'
import { FeedbackModel } from '../../core/_model'
import { ImageTitleCell } from '@@@/datatable/components/ImageTitleCell'
import { StatusCell } from '@@@/datatable/components/StatusCell'
import { KTIcon } from '@/helpers'

type Props = {
  data: FeedbackModel[]
  loading: boolean
  pagination: any
  sortColumn: string
  sortDirection: 'asc' | 'desc'
  onPageChange: (page: number) => void
  onSortChange: (col: string, dir: 'asc' | 'desc') => void
  onView: (value: any, setRefreshTable?: (refresh: boolean) =>void) => void
  setRefreshTable?: (refresh: boolean) =>void
  onSearchChange?:(value: any) => void
}

export const FeedbackTable: React.FC<Props> = ({
  data,
  loading,
  pagination,
  sortColumn,
  sortDirection,
  onPageChange,
  onSortChange,
  onView,
  onSearchChange,
  setRefreshTable,
}) => {

  const columns: Column<FeedbackModel>[] = [
    { title: '#', key: 'row_number', sortable: true },
    { title: 'Author Name', key: 'author_name', sortable: true, 
      render: (item:any) => (
          <ImageTitleCell
              mainTitle={item.author_name}
              subTitle={item.source.name}
          />
        ),
    },
    {
      title:'Comment',key: 'comment',
       render: (item:any) => (
       <>
         <p className="text-gray-700">
          {item.comment.length > 80 ? item.comment.substring(0,80)+"..." : item.comment}
        </p>
       </>
      ),
    },
    {
      title: 'Rating',
      key: 'rating',
      render: (item:any) => (
       <>
        {Array.from({ length: item.rating }).map((_, i) => (
          <KTIcon
            key={i}
            iconName="star"
            className="fs-3 me-1 text-warning"
          />
        ))}
       </>
      ),
    },
    { title: 'Date Posted', key: 'date_posted_format', sortable: true },
    { title: 'Sentiment', key: 'sentiment_format', sortable: true,
      render: (item:any) => (
          <StatusCell
              color={item.sentiment_format.color}
              title={item.sentiment_format.title}
          />
        ),

     },
    {
      title: 'Action',
      key: 'id',
      render: (item) => (
        <ActionsCell
          openDetailsModal={() => onView(item)}
        />
      ),
    },
  ]

  return (
    <div className="table-responsive">
      {loading ? (
        <div className="alert alert-info">Loading...</div>
      ) : (
        <DataTable<FeedbackModel>
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
