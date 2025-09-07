import {FC, useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import clsx from 'clsx'
import { useAddon } from '../../core/_request'
import { ImageUploader } from '@@@/uploader/ImageUploader'

interface Props {
  setPage?: (values: number) => void
  setRefreshTable?: (value: boolean) => void
  onSubmit?: (values: any) => void
}

const Schema = Yup.object().shape({
  name: Yup.string()
    .min(1, 'Minimum 1 character')
    .max(50, 'Maximum 50 characters')
    .required('Add-ons name is required'),
  base_price: Yup.number().required('Base price is required').min(1),
})

const CreateAddon: FC<Props> = ({
  setPage,
  setRefreshTable,
  onSubmit,
}) => {

  const { createAddon } = useAddon()

  const formik = useFormik({
    initialValues: {
      name: '',
      base_price:'',
    },
    validationSchema: Schema,
    onSubmit: async (values, {resetForm}) => {
      await createAddon(
        values,
        resetForm,
        setRefreshTable,
        setPage
      )
      onSubmit?.(values)
    }
  })

  return (
    <form className='form' noValidate onSubmit={formik.handleSubmit}>
      <div className='row'>
        {/* Category Name */}
        <div className='col-md-12 mb-3'>
          <label className='form-label'>Add-ons Name</label>
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

         <div className='col-md-12 mb-3'>
            <label className='form-label'>Cost Price</label>
            <input
              type='number'
              className={clsx('form-control', {
                'is-invalid': formik.touched.base_price && formik.errors.base_price,
              })}
              {...formik.getFieldProps('base_price')}
            />
            {formik.touched.base_price && formik.errors.base_price && (
              <div className='invalid-feedback'>{formik.errors.base_price}</div>
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

export {CreateAddon}
