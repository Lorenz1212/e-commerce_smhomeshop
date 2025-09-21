
import { toAbsoluteUrl } from '@/helpers'
import {FC, useEffect} from 'react'

type Props = {
  mainTitle?: any
  subTitle?: any | any[] 
}


const TitleBlockCell: FC<Props> = ({ mainTitle, subTitle }) => {
  return (
    <div className='d-flex align-items-center'>
      <div className='d-flex justify-content-start flex-column'>
        {mainTitle && (
          <span className='text-gray-900 fw-bold text-hover-primary fs-6'>
            {mainTitle}
          </span>
        )}
        {Array.isArray(subTitle) ? (
          subTitle.map((text, i) => (
            <span
              key={i}
              className='text-muted fw-semibold d-block fs-7'
            >
              {text}
            </span>
          ))
        ) : (
          subTitle && (
            <span className='text-muted fw-semibold d-block fs-7'>
              {subTitle}
            </span>
          )
        )}
      </div>
    </div>
  )
}


export {TitleBlockCell}
