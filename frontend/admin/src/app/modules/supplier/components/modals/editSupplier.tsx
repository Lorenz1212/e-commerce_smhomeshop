import {FC, useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import clsx from 'clsx'
import { PhoneFormat } from '../../../../components/inputmasks/phoneNumber'
import { useSupplierRequest } from '../../core/_request'


interface Props {
  supplierId:string
  data:any
  setRefreshTable?: (values: boolean) => void
  onSubmit?: (values: any) => void
}

const Schema = Yup.object().shape({
  name: Yup.string()
    .min(1, 'Minimum 1 character')
    .max(50, 'Maximum 50 characters')
    .required('Supplier name is required'),

  contact_person: Yup.string()
    .min(1, 'Minimum 1 character')
    .max(50, 'Maximum 50 characters')
    .required('Contact person is required'),

  phone: Yup.string()
    .min(1, 'Minimum 1 character')
    .max(30, 'Maximum 30 characters')
    .required('Phone number is required'),

  email: Yup.string()
    .email('Invalid email format')
    .max(100, 'Maximum 100 characters')
    .required('Email is required'),
})

const EditSupplierModal: FC<Props> = ({
  supplierId,
  data,
  setRefreshTable,
  onSubmit,
}) => {

  const { updateSupplier } = useSupplierRequest()

  const formik = useFormik({
    initialValues: {
      name: data.name,
      contact_person: data.contact_person,
      phone: data.phone,
      email:data.email
    },
    validationSchema: Schema,
    onSubmit: async (values, {resetForm}) => {
      await updateSupplier(
        values,
        supplierId,
        setRefreshTable
      )
      onSubmit?.(values)
    }
  })

  return (
    <form className='form' noValidate onSubmit={formik.handleSubmit}>
      <div className='row'>
        {/* Supplier Name */}
        <div className='col-md-12 mb-3'>
          <label className='form-label'>Supplier Name</label>
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
         {/* Contact Person */}
        <div className='col-md-12 mb-3'>
            <label className='form-label'>Contact Person</label>
            <input
              type='text'
              className={clsx('form-control', {
                'is-invalid': formik.touched.contact_person && formik.errors.contact_person,
              })}
              {...formik.getFieldProps('contact_person')}
            />
            {formik.touched.phone && typeof formik.errors.phone === 'string' && (
              <div className='invalid-feedback'>{formik.errors.phone}</div>
            )}
        </div>
        <div className='col-md-12 '>
             <PhoneFormat
                setClass='mb-3'
                labelName='Contact Number'
                data={formik.values.phone}
                name='phone'
                setFieldValue={formik.setFieldValue}
                error={typeof formik.errors.phone === 'string' ? formik.errors.phone : undefined}
                touched={typeof formik.touched.phone === 'string' ? formik.touched.phone : undefined}
            />
            {formik.touched.phone && typeof formik.errors.phone === 'string' && (
                <div className='invalid-feedback'>{formik.errors.phone}</div>
            )}
        </div>
        <div className='col-md-12 mb-3'>
            <label className='form-label'>Email Address</label>
            <input
              type='email'
              placeholder='e.g. example@email.com'
              className={clsx('form-control', {
                'is-invalid': formik.touched.email && formik.errors.email,
              })}
              {...formik.getFieldProps('email')}
            />
            {formik.touched.email && typeof formik.errors.email === 'string' && (
                <div className='invalid-feedback'>{formik.errors.email}</div>
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

export {EditSupplierModal}
