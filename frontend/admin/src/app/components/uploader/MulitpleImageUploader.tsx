import React, { useRef, useState } from 'react'
import { FormikProps } from 'formik'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import clsx from 'clsx'
import Swal from 'sweetalert2'

interface MulitpleImageUploaderProps<T> {
  name: keyof T
  formik: FormikProps<T>
  previews: string[]
  setPreviews: (previews: any[]) => void
  label?: string
  accept?: string
  maxFiles?: number
  getPrimaryIndex?: number,
}

export const MulitpleImageUploader = <T extends object>({
  name,
  formik,
  previews,
  setPreviews,
  label = 'Upload Images',
  accept = 'image/*',
  maxFiles = 5,
  getPrimaryIndex = 0,
}: MulitpleImageUploaderProps<T>) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [progresses, setProgresses] = useState<number[]>([])
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [primaryIndex, setPrimaryIndex] = useState<number>(getPrimaryIndex)

  // ✅ Allowed MIME types (safe)
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']

  const isAllowedType = (file: File) => allowedTypes.includes(file.type)

  const handleFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    const selectedFiles = Array.from(files)
    const validFiles = selectedFiles.filter(isAllowedType)

    if (validFiles.length < selectedFiles.length) {
      Swal.fire({
        icon:  'info',
        title: 'Only JPG, JPEG, PNG files are allowed.',
      })
    }

    if (maxFiles === 1) {
      const newFile = validFiles[0]
      if (!newFile) return

      previews[0] && URL.revokeObjectURL(previews[0])
      const objectUrl = URL.createObjectURL(newFile)

      formik.setFieldValue(name as string, [newFile])
      setPreviews([objectUrl])
      setProgresses([100])
      setPrimaryIndex(0)
    } else {
      const existingFiles = (formik.values[name] as File[]) || []
      const mergedFiles = [...existingFiles, ...validFiles].slice(0, maxFiles)
      formik.setFieldValue(name as string, mergedFiles)

      previews.forEach(url => URL.revokeObjectURL(url))
      const newPreviews = mergedFiles.map(file => URL.createObjectURL(file))
      setPreviews(newPreviews)
      setProgresses(Array(newPreviews.length).fill(100))
      if (primaryIndex >= newPreviews.length) setPrimaryIndex(0)
    }

    event.target.value = ''
  }

  const handleRemoveImage = (index: number) => {
    const updatedFiles = [...((formik.values[name] as File[]) || [])]
    updatedFiles.splice(index, 1)
    formik.setFieldValue(name as string, updatedFiles)

    const updatedPreviews = [...previews]
    updatedPreviews.splice(index, 1)
    setPreviews(updatedPreviews)

    const updatedProgresses = [...progresses]
    updatedProgresses.splice(index, 1)
    setProgresses(updatedProgresses)

    if (primaryIndex === index) setPrimaryIndex(0)
    else if (primaryIndex > index) setPrimaryIndex(prev => prev - 1)
  }

  return (
    <div className="mb-3">
      <label className="form-label">{label}</label>

      <div className="d-flex flex-wrap gap-2 mb-2">
        {previews.length > 0 ? (
          previews.filter(Boolean).map((preview, index) => (
            <div
              key={index}
              className={clsx(
                'position-relative image-preview-container image-input-wrapper w-150px h-150px',
                { 'border border-success border-3': index === primaryIndex }
              )}
            >
              {previews.length > 1 && (
                <button
                  type="button"
                  className={clsx(
                    'btn btn-sm position-absolute top-0 start-0 m-1',
                    index === primaryIndex ? 'btn-success' : 'btn-secondary'
                  )}
                  onClick={() => {
                    setPrimaryIndex(index)
                    formik.setFieldValue('primary_index', index)
                  }}
                >
                  {index === primaryIndex ? '✓ Primary' : 'Set Primary'}
                </button>
              )}

              <img
                src={preview}
                alt={`Preview ${index}`}
                className="img-thumbnail preview-image"
                style={{ cursor: 'pointer' }}
                onClick={() => setLightboxIndex(index)}
              />

              <div className="progress mt-1" style={{ height: '5px' }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{ width: `${progresses[index] || 0}%` }}
                  aria-valuenow={progresses[index] || 0}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>

              <button
                type="button"
                className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow remove-button"
                onClick={() => handleRemoveImage(index)}
              >
                ×
              </button>
            </div>
          ))
        ) : (
          <div className="position-relative image-preview-container image-input-wrapper w-150px h-150px">
            <img
              src="/media/default.jpg"
              alt="Default Preview"
              className="img-thumbnail preview-image"
            />
          </div>
        )}
      </div>

      <button
        type="button"
        className="btn btn-secondary"
        onClick={() => fileInputRef.current?.click()}
      >
        Select Images
      </button>

      <input
        type="file"
        accept={accept}
        onChange={handleFilesChange}
        ref={fileInputRef}
        className="d-none"
        multiple={maxFiles > 1}
      />

      {formik.touched[name] && formik.errors[name] && (
        <div className="invalid-feedback d-block">{formik.errors[name] as string}</div>
      )}

      {lightboxIndex !== null && (
        <Lightbox
          open={lightboxIndex !== null}
          close={() => setLightboxIndex(null)}
          index={lightboxIndex}
          slides={previews.filter(Boolean).map(url => ({ src: url }))}
        />
      )}
    </div>
  )
}
