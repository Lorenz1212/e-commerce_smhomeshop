import { FC, useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'

type Props = {
  image?: string
  mainTitle?: string
  subTitle?: string
}

const ImageTitleCell: FC<Props> = ({
  image,
  mainTitle,
  subTitle,
}) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className='d-flex align-items-center'>
        {image && (
          <div className='symbol symbol-45px me-5'>
            <img
              src={image}
              alt=''
              style={{ cursor: 'pointer' }}
              onClick={() => setOpen(true)}
            />
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

      {image && (
        <Lightbox
          open={open}
          close={() => setOpen(false)}
          slides={[{ src: image }]} // single slide lang
        />
      )}
    </>
  )
}

export { ImageTitleCell }
