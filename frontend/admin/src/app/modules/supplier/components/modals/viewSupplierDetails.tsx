import { FC } from 'react'

interface Props {
  data: {
    name: string
    contact_person: string
    phone: string
    email: string
  }
}

const ViewSupplierDetailsModal: FC<Props> = ({ data }) => {
  return (
    <>
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
    </>
  )
}

export { ViewSupplierDetailsModal }
