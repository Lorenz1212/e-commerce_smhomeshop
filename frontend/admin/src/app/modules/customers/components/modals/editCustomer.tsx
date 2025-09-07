import React, { FC, useState,useEffect } from 'react'
import * as Yup from 'yup'
import { Formik } from 'formik'
import clsx from 'clsx'
import { PhoneFormat } from '@@@/inputmasks/phoneNumber'
import { useCustomer } from '@@/customers/core/_request'


interface Props {
  customerID: any,
  data:any,
  setRefreshTable?: (value: boolean) => void
  onSubmit?: (values: any) => void
}

const EditCustomerModal: FC<Props> = ({
  customerID,
  data,
  setRefreshTable,
  onSubmit,
}) => {
 
  const { updateCustomer } = useCustomer()

  const Schema = Yup.object().shape({
    fname: Yup.string().required('First name is required'),
    lname: Yup.string().required('Last name is required'),
    phone: Yup.string().required('Contact number is required'),
    email: Yup.string().required('Email address is required'),
    gender: Yup.string().oneOf(['M', 'F']).required('Gender is required'),
    birthdate: Yup.date().required('Birthdate is required'),
  })
  

  return (
    <Formik
      initialValues={{
        fname: data.personal_info.fname || '',
        lname: data.personal_info.lname || '',
        mname: data.personal_info.mname || '',
        suffix: data.personal_info.suffix || '',
        phone: data.personal_info.phone || '',
        email: data.personal_info.email || '',
        gender: data.personal_info.gender || '',
        birthdate: data.personal_info.birthdate || '',
        address: data.personal_info.address || '',
      }}
      validationSchema={Schema}
      onSubmit={async (values, { resetForm }) => {
        await updateCustomer(   
          values,
          customerID,
          setRefreshTable
        )
        onSubmit?.(values)
      }}
    >
   {(formik) => {
       return (
          <form noValidate onSubmit={formik.handleSubmit}>
            <div className="row">
              {/* LEFT COLUMN */}
                {/* First Name */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">First Name</label>
                  <input
                    type="text"
                    className={clsx('form-control', {
                      'is-invalid':
                        formik.touched.fname && formik.errors.fname,
                    })}
                    {...formik.getFieldProps('fname')}
                  />
                  {formik.touched.fname && typeof formik.errors.fname === 'string' && (
                      <div className='invalid-feedback'>{formik.errors.fname}</div>
                  )}
                </div>

                {/* Middle Name */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Middle Name</label>
                  <input
                    type="text"
                    className="form-control"
                    {...formik.getFieldProps('mname')}
                  />
                </div>

                {/* Last Name */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Last Name</label>
                  <input
                    type="text"
                    className={clsx('form-control', {
                      'is-invalid':
                        formik.touched.lname && formik.errors.lname,
                    })}
                    {...formik.getFieldProps('lname')}
                  />
                  {formik.touched.lname && typeof formik.errors.lname === 'string' && (
                      <div className='invalid-feedback'>{formik.errors.lname}</div>
                  )}
                </div>

                {/* Suffix */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Suffix</label>
                  <input
                    type="text"
                    className="form-control"
                    {...formik.getFieldProps('suffix')}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Gender</label>
                  <select
                    className={clsx('form-select', {
                      'is-invalid':
                        formik.touched.gender && formik.errors.gender,
                    })}
                    {...formik.getFieldProps('gender')}
                  >
                    <option value="">Select Gender</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                  </select>
                  {formik.touched.gender && typeof formik.errors.gender === 'string' && (
                      <div className='invalid-feedback'>{formik.errors.gender}</div>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Birthdate</label>
                  <input
                    type="date"
                    className={clsx('form-control', {
                      'is-invalid':
                        formik.touched.birthdate && formik.errors.birthdate,
                    })}
                    {...formik.getFieldProps('birthdate')}
                  />
                  {formik.touched.birthdate && typeof formik.errors.birthdate === 'string' && (
                      <div className='invalid-feedback'>{formik.errors.birthdate}</div>
                  )}
                </div>

                {/* Contact No */}
                <PhoneFormat
                  setClass="col-md-12 mb-3"
                  labelName="Contact Number"
                  name="phone"
                  data={formik.values.phone}
                  setFieldValue={formik.setFieldValue}
                  error={formik.errors.phone as string}
                  touched={!!formik.touched.phone}
                />

                <div className="col-md-12 mb-3">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className={clsx('form-control', {
                      'is-invalid':
                        formik.touched.email && formik.errors.email,
                    })}
                    {...formik.getFieldProps('email')}
                  />
                  {formik.touched.email && typeof formik.errors.email === 'string' && (
                      <div className='invalid-feedback'>{formik.errors.email}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="d-flex justify-content-end mt-4">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
          </form>
        );
      }
    }
    </Formik>
  )
}

export { EditCustomerModal }
