import {FC, useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import clsx from 'clsx'
import { ImageUploader } from '@@@/uploader/ImageUploader'
import { useProductBrand } from '@@/brands/core/_request'

interface Props {
  setPage?: (values: number) => void
  setRefreshTable?: (value: boolean) => void
  onSubmit?: (values: any) => void
}

const Schema = Yup.object().shape({
  name: Yup.string()
    .min(1, 'Minimum 1 character')
    .max(50, 'Maximum 50 characters')
    .required('Brand name is required'),
  images: Yup.mixed()
    .test('required', 'Image is required', (value) => {
      return Array.isArray(value) && value.length > 0
    }),
})

const CreateBrandModal: FC<Props> = ({
  setPage,
  setRefreshTable,
  onSubmit,
}) => {

  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const { createProductBrand } = useProductBrand()

  const formik = useFormik({
    initialValues: {
      name: '',
      images: [] as File[],
    },
    validationSchema: Schema,
    onSubmit: async (values, {resetForm}) => {
      await createProductBrand(
        values,
        resetForm,
        setRefreshTable,
        setPage
      )
      onSubmit?.(values)
    }
  })

  return (
    <form noValidate onSubmit={formik.handleSubmit}>
      <div className='row'>
        <div className='col-md-12'>
            <ImageUploader
              name="images"
              formik={formik}
              previews={imagePreviews}
              setPreviews={setImagePreviews}
              label="Upload Image"
              maxFiles={1}
            />
        </div>
        {/* Brand Name */}
        <div className='col-md-12 mb-3'>
          <label className='form-label'>Brand Name</label>
          <input
            type='text'
            className={clsx('form-control', {
              'is-invalid': formik.touched.name && formik.errors.name,
            })}
            {...formik.getFieldProps('name')}
          />
          {formik.touched.name && formik.errors.name && (
            <div className='invalid-feedback'>{formik.errors.name}</div>
          )}
        </div>
      </div>
      <div className='d-flex justify-content-end mt-4'>
        <button type='submit' className='btn btn-primary'>
          Save
        </button>
      </div>
    </form>
  )
}

export {CreateBrandModal}
