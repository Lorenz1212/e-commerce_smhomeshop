import { FC } from 'react'

interface Props {
  data: {
    name: string
  }
}

const ViewCategoryDetailsModal: FC<Props> = ({ data }) => {
  return (
    <>
        <div className='row mb-3'>
          <div className='col-sm-4 text-muted'>Product Category</div>
          <div className='col-sm-8 fw-semibold'>{data.name}</div>
        </div>
    </>
  )
}

export { ViewCategoryDetailsModal }
