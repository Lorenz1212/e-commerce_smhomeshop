import React, { FC, useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'

interface ImageViewerProps {
  preview: string
  index: number
  allImages: string[] // all images for lightbox
}

export const ImageViewer: FC<ImageViewerProps> = ({ preview, index, allImages }) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  return (
    <div>
      <img
        src={preview}
        alt={`Preview ${index}`}
        className="img-thumbnail preview-image"
        onClick={() => setLightboxIndex(index)}
        style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, cursor: 'pointer' }}
      />

      {lightboxIndex !== null && (
        <Lightbox
          open={lightboxIndex !== null}
          close={() => setLightboxIndex(null)}
          index={lightboxIndex}
          slides={allImages.filter(Boolean).map(url => ({ src: url }))}
        />
      )}
    </div>
  )
}
