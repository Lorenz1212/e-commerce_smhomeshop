import { FC } from 'react'

interface Props {
  data: {
    name: string
  }
}

const ViewBrandDetailsModal: FC<Props> = ({ data }) => {
  return (
    <>
        <div className='row mb-3'>
          <div className='col-sm-4 text-muted'>Product Brand</div>
          <div className='col-sm-8 fw-semibold'>{data.name}</div>
        </div>
    </>
  )
}

export { ViewBrandDetailsModal }
