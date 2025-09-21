import {FC, useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import clsx from 'clsx'

import { MulitpleImageUploader } from '@@@/uploader/MulitpleImageUploader'
import { useProductBrand } from '@@/brands/core/_request'


interface Props {
  brandID:string
  data:any
  setRefreshTable?: (values: boolean) => void
  onSubmit?: (values: any) => void
}

const EditBrandModal: FC<Props> = ({
  brandID,
  data,
  setRefreshTable,
  onSubmit,
}) => {

  const { updateProductBrand } = useProductBrand()

  const [imagePreviews, setImagePreviews] = useState<string[]>(
    data?.image_cover ? [data.image_cover] : []
  );

  const Schema = Yup.object().shape({
    name: Yup.string()
      .min(1, 'Minimum 1 character')
      .max(50, 'Maximum 50 characters')
      .required('Brand name is required'),
    images: Yup.mixed()
        .test('images', 'At least one image required', function (value) {
          return (
            (Array.isArray(value) && value.length > 0) ||
            (imagePreviews && imagePreviews.length > 0)
          );
        }),
  })

  const formik = useFormik({
    initialValues: {
      name: data.name,
      images: [],
    },
    validationSchema: Schema,
    onSubmit: async (values, {resetForm}) => {
      await updateProductBrand(
        values,
        brandID,
        setRefreshTable
      )
      onSubmit?.(values)
    }
  })

  return (
     <form noValidate onSubmit={formik.handleSubmit}>
      <div className='row'>
          <div className='col-md-12'>
            <MulitpleImageUploader
              name="images"
              formik={formik}
              previews={imagePreviews}
              setPreviews={setImagePreviews}
              label="Upload Image"
              maxFiles={1}
            />
        </div>
        {/*  Name */}
        <div className='col-md-12 mb-3'>
          <label className='form-label'>Brand Name</label>
          <input
            type='text'
            className={clsx('form-control', {
              'is-invalid': formik.touched.name && formik.errors.name,
            })}
            {...formik.getFieldProps('name')}
          />
          {formik.touched.name && typeof formik.errors.name === 'string' && (
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

export {EditBrandModal}
