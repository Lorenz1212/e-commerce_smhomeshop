import React, { useRef, useState } from 'react'
import { FormikProps } from 'formik'
import clsx from 'clsx'
import Swal from 'sweetalert2'

interface SingleImageUploaderProps<T> {
  name: keyof T
  formik: FormikProps<T>
  preview: string | null
  setPreview: (preview: string | null) => void
  label?: string
  accept?: string
}

export const SingleImageUploader = <T extends object>({
  name,
  formik,
  preview,
  setPreview,
  label = 'Upload Image',
  accept = 'image/*',
}: SingleImageUploaderProps<T>) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [progress, setProgress] = useState<number>(0)
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!allowedTypes.includes(file.type)) {
      Swal.fire({
        icon: 'info',
        title: 'Only JPG, JPEG, PNG files are allowed.',
      })
      return
    }

    formik.setFieldValue(name as string, file)

    console.log(formik.values)

    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview)
    }

    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)
    setProgress(100)
    formik.setFieldValue((name as string).replace('.image', '.image_preview'), objectUrl)

    event.target.value = ''
  }

  const handleRemoveImage = () => {
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview)
    }
    formik.setFieldValue(name as string, null)
    setPreview(null)
    setProgress(0)
  }

  return (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      <div className="position-relative image-preview-container image-input-wrapper w-150px h-150px">
        {preview ? (
          <>
            <img
              src={preview}
              alt="Preview"
              className="img-thumbnail preview-image"
            />
            <div className="progress mt-1" style={{ height: '5px' }}>
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${progress}%` }}
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
            <button
              type="button"
              className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow position-absolute top-0 end-0 m-1"
              onClick={handleRemoveImage}
            >
              ×
            </button>
          </>
        ) : (
          <img
            src="/media/default.jpg"
            alt="Default Preview"
            className="img-thumbnail preview-image"
          />
        )}
      </div>

      <button
        type="button"
        className="btn btn-secondary mt-2"
        onClick={() => fileInputRef.current?.click()}
      >
        Select Image
      </button>

      <input
        type="file"
        accept={accept}
        onChange={handleFileChange}
        ref={fileInputRef}
        className="d-none"
      />

      {formik.touched[name] && formik.errors[name] && (
        <div className="invalid-feedback d-block">
          {formik.errors[name] as string}
        </div>
      )}
    </div>
  )
}
