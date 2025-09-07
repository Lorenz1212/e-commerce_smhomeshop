
import { toAbsoluteUrl } from '@/helpers'
import {FC, useEffect} from 'react'

type Props = {
  image?: any
  mainTitle?: string
  subTitle?: string
}

const ImageTitleCell: FC<Props> = ({
  image,
  mainTitle,
  subTitle,
}) => {

  return (
    <>
      <div className='d-flex align-items-center'>
            {image && (
                <div className='symbol symbol-45px me-5'>
                  <img src={image} alt='' />
                </div>
              )}
            <div className='d-flex justify-content-start flex-column'>
                <span className='text-gray-900 fw-bold text-hover-primary fs-6'>
                {mainTitle}
                </span>
               {subTitle && (
                  <span className='text-muted fw-semibold d-block fs-7'>
                      {subTitle}
                  </span>
              )}
            </div>
        </div>
    </>
  )
}


export {ImageTitleCell}
