import React, { useRef, useState, useEffect } from 'react'
import { FormikProps } from 'formik'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'

interface ImageUploaderProps<T> {
  name: keyof T
  formik: FormikProps<T>
  previews: string[]
  setPreviews: React.Dispatch<React.SetStateAction<string[]>>
  label?: string
  accept?: string
  maxFiles?: number
}

export const ImageUploader = <T extends object>({
  name,
  formik,
  previews,
  setPreviews,
  label = 'Upload Images',
  accept = 'image/*',
  maxFiles = 5,
}: ImageUploaderProps<T>) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [progresses, setProgresses] = useState<number[]>([])
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const disallowedExtensions = ['.exe', '.php', '.js', '.sh', '.bat', '.html', '.htm', '.svg']

  const hasDisallowedExtension = (file: File) => {
    const lowerName = file.name.toLowerCase()
    return disallowedExtensions.some(ext => lowerName.endsWith(ext))
  }

  const handleFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    const selectedFiles = Array.from(files)
    const validFiles = selectedFiles.filter(file => !hasDisallowedExtension(file))

    if (validFiles.length < selectedFiles.length) {
      alert('Some files were not allowed and have been ignored.')
    }

    if (maxFiles === 1) {
      const newFile = validFiles[0]
      if (!newFile) return

      if (previews.length > 0) {
        URL.revokeObjectURL(previews[0])
      }

      const objectUrl = URL.createObjectURL(newFile)
      formik.setFieldValue(name as string, [newFile])
      setPreviews([objectUrl])
      setProgresses([100])
    } else {
      const existingFiles = (formik.values[name] as File[]) || []
      const mergedFiles = [...existingFiles, ...validFiles].slice(0, maxFiles)

      formik.setFieldValue(name as string, mergedFiles)
      previews.forEach(url => URL.revokeObjectURL(url))
      const newPreviews = mergedFiles.map(file => URL.createObjectURL(file))
      setPreviews(newPreviews)

      const newProgresses = Array(mergedFiles.length).fill(100)
      setProgresses(newProgresses)
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
  }

  return (
    <div className="mb-3">
      <label className="form-label">{label}</label>

      <div className="d-flex flex-wrap gap-2 mb-2">
        {previews.length > 0 ? (
          previews.map((preview, index) => (
            <div
              key={index}
              className="position-relative image-preview-container image-input-wrapper w-150px h-150px"
            >
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
              src="/media/products/default.jpg"
              alt="Default Preview"
              className="img-thumbnail preview-image"
            />
            {previews?.map((src, i) => (
              <img key={i} src={(src)?src:"/media/products/default.jpg"} alt={`Preview ${i}`} className="img-thumbnail preview-image" />
            ))}
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
          slides={previews.map(url => ({ src: url }))}
        />
      )}
    </div>
  )
}
