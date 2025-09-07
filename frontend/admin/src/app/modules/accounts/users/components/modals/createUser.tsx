import React, { FC, useState } from 'react'
import * as Yup from 'yup'
import { Formik, Form } from 'formik'
import clsx from 'clsx'
import { ImageUploader } from '@@@/uploader/ImageUploader'
import { PhoneFormat } from '@@@/inputmasks/phoneNumber'
import { useUser } from '../../core/_requests'
import { RoleSelect } from '@@@/selects/RoleSelect'


interface UserModalProps {
  setPage?: (values: number) => void
  setRefreshTable?: (value: boolean) => void
  onSubmit?: (values: any) => void
}

const Schema = Yup.object().shape({
  fname: Yup.string().required('First name is required'),
  lname: Yup.string().required('Last name is required'),
  contact_no: Yup.string().required('Contact number is required'),
  email: Yup.string().required('Email address is required'),
  gender: Yup.string().oneOf(['M', 'F']).required('Gender is required'),
  birthdate: Yup.date().required('Birthdate is required'),
  modules: Yup.array().of(Yup.string()).min(1, 'At least one module must be selected'),
  role_id: Yup.string().test(
    'role-required-if-core',
    'Role is required when Core module is selected',
    function(value) {
      const { modules } = this.parent;
      if (modules?.includes('core')) {
        return !!value; // value must exist
      }
      return true; // otherwise, pass
    }
  ),
  images: Yup.mixed()
    .test('required', 'Image is required', (value) => Array.isArray(value) && value.length > 0),
})

const CreateUserModal: FC<UserModalProps> = ({
  setPage,
  setRefreshTable,
  onSubmit,
}) => {
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const { createUser } = useUser()
  return (
    <Formik
      initialValues={{
        fname: '',
        lname: '',
        mname: '',
        suffix: '',
        contact_no: '',
        email: '',
        gender: '',
        birthdate: '',
        address: '',
        role_id: '',
        modules: [] as string[],
        images: [] as File[],
      }}
      validationSchema={Schema}
      onSubmit={async (values, { resetForm }) => {
        await createUser(values, resetForm, setRefreshTable, setPage)
        onSubmit?.(values)
      }}
    >
      {(formik) => (
         <form noValidate onSubmit={formik.handleSubmit}>
          <div className="row">
            {/* LEFT COLUMN */}
            <div className="col-md-12">
              {/* Profile Image */}
              <div className="mb-3">
                <ImageUploader
                  name="images"
                  formik={formik}
                  previews={imagePreviews}
                  setPreviews={setImagePreviews}
                  label="Profile Image"
                  maxFiles={1}
                />
              </div>
            </div>
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
                {formik.touched.fname && formik.errors.fname && (
                  <div className="invalid-feedback">
                    {formik.errors.fname}
                  </div>
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
                {formik.touched.lname && formik.errors.lname && (
                  <div className="invalid-feedback">
                    {formik.errors.lname}
                  </div>
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
                name="contact_no"
                data={formik.values.contact_no}
                setFieldValue={formik.setFieldValue}
                error={formik.errors.contact_no as string}
                touched={formik.touched.contact_no}
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
                {formik.touched.email && formik.errors.email && (
                  <div className="invalid-feedback">
                    {formik.errors.email}
                  </div>
                )}
              </div>

              {/* Address */}
              <div className="col-md-12 mb-5">
                <label className="form-label">Address</label>
                <textarea
                  rows={3}
                  className={clsx('form-control')}
                  {...formik.getFieldProps('address')}
                />
              </div>
            </div>
              {/* Modules selection */}
              <div className="col-md-12 mb-3">
                <div>
                  <label className="form-label fw-bold me-5">Modules</label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="module-cashier"
                    value="cashier"
                    checked={formik.values.modules.includes('cashier')}
                    onChange={() => {
                      const modules = [...formik.values.modules]
                      if (modules.includes('cashier')) {
                        formik.setFieldValue('modules', modules.filter(m => m !== 'cashier'))
                      } else {
                        modules.push('cashier')
                        formik.setFieldValue('modules', modules)
                      }
                    }}
                  />
                  <label className="form-check-label" htmlFor="module-cashier">Cashier</label>
                  <div className="form-text">
                    Grants access to the cashier portal for handling transactions.
                  </div>
                </div>
                <div className="form-check form-check-inline">
                    <input
                      className="form-check-input mb-10"
                      type="checkbox"
                      id="module-core"
                      value="core"
                      checked={formik.values.modules.includes('core')}
                      onChange={() => {
                        const modules = [...formik.values.modules]
                        if (modules.includes('core')) {
                          formik.setFieldValue('modules', modules.filter(m => m !== 'core'))
                        } else {
                          modules.push('core')
                          formik.setFieldValue('modules', modules)
                        }
                      }}
                    />
                    <label className="form-check-label" htmlFor="module-core">Core</label>
                    <div className="form-text">
                      Grants access to core system features. Selecting this will enable Role selection.
                    </div>
                </div>
                {formik.touched.modules && formik.errors.modules && (
                  <div className="text-danger small">{formik.errors.modules}</div>
                )}
              </div>

              {/* Roles dropdown */}
              {formik.values.modules.includes('core') && (
                <div className="col-md-12 mb-3">
                  <RoleSelect
                    setClass="mb-3"
                    name="role_id"
                    value={formik.values.role_id}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.errors.role_id}
                    touched={formik.touched.role_id}
                  />
                  {formik.touched.role_id && formik.errors.role_id && (
                    <div className="invalid-feedback">{formik.errors.role_id}</div>
                  )}
                </div>
              )}
          </div>

          {/* Actions */}
          <div className="d-flex justify-content-end mt-4">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
      )}
    </Formik>
  )
}

export { CreateUserModal }
