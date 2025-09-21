

import {FC} from 'react'
import {useLayout} from '../core'

const Footer: FC = () => {
  const {classes} = useLayout()
  return (
    <div className='footer py-4 d-flex flex-lg-column' id='kt_footer'>
      {/* begin::Container */}
      <div className={`${classes.footerContainer} d-flex flex-column flex-md-row flex-stack`}>
        {/* begin::Copyright */}
        <div className='text-gray-900 order-2 order-md-1'>
          <span className='text-gray-500 fw-bold me-1'></span>
          <a
            href='#'
            target='_blank'
            className='text-muted text-hover-primary fw-bold me-2 fs-6'
          >
            SM Home Shop Management System@2025
          </a>
        </div>
        {/* end::Copyright */}

        {/* begin::Menu */}
  
        {/* end::Nav */}
      </div>
      {/* end::Container */}
    </div>
  )
}

export {Footer}
