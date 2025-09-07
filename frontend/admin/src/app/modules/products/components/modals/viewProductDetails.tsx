import { FC } from 'react'

interface Props {
  data: {
    name: string
    contact_person: string
    phone: string
    email: string
    image?: string // Optional image URL
  }
}

const ViewProductDetailsModal: FC<Props> = ({ data }) => {
  return (
    <div className='row'>
      {data.image && (
        <div className='col-12 text-center mb-4'>
          <img
            src={data.image}
            alt='Supplier Image'
            className='rounded shadow-sm'
            style={{ maxWidth: '120px', maxHeight: '120px', objectFit: 'cover' }}
          />
        </div>
      )}

      <div className='col-12'>
        <div className='row mb-3'>
          <div className='col-sm-4 text-muted'>Supplier Name</div>
          <div className='col-sm-8 fw-semibold'>{data.name}</div>
        </div>

        <div className='row mb-3'>
          <div className='col-sm-4 text-muted'>Contact Person</div>
          <div className='col-sm-8 fw-semibold'>{data.contact_person}</div>
        </div>

        <div className='row mb-3'>
          <div className='col-sm-4 text-muted'>Contact No.</div>
          <div className='col-sm-8 fw-semibold'>{data.phone}</div>
        </div>

        <div className='row mb-3'>
          <div className='col-sm-4 text-muted'>Email Address</div>
          <div className='col-sm-8 fw-semibold'>{data.email}</div>
        </div>
      </div>
    </div>
  )
}

export { ViewProductDetailsModal }
