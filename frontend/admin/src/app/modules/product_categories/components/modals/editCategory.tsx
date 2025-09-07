import {FC, useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import clsx from 'clsx'
import { useProductCategory } from '../../core/_request'
import { ImageUploader } from '@@@/uploader/ImageUploader'
import { Form } from 'react-bootstrap'


interface Props {
  categoryID:string
  data:any
  setRefreshTable?: (values: boolean) => void
  onSubmit?: (values: any) => void
}

 

const EditCategoryModal: FC<Props> = ({
  categoryID,
  data,
  setRefreshTable,
  onSubmit,
}) => {

  const { updateProductCategory } = useProductCategory()

  const [imagePreviews, setImagePreviews] = useState<string[]>(
    data?.images?.map((img: any) => img.image_cover) || []
  )

  const Schema = Yup.object().shape({
    name: Yup.string()
      .min(1, 'Minimum 1 character')
      .max(50, 'Maximum 50 characters')
      .required('Supplier name is required'),
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
      await updateProductCategory(
        values,
        categoryID,
        setRefreshTable
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
              label="Category Images"
              maxFiles={1}
            />
        </div>
        {/*  Name */}
        <div className='col-md-12 mb-3'>
          <label className='form-label'>Product Category</label>
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

export {EditCategoryModal}
