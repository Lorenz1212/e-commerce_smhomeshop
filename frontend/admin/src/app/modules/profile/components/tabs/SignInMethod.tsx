import React, { useState } from 'react'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { Eye, EyeOff } from 'lucide-react'

import { IUpdateEmail, IUpdatePassword, updateEmail, updatePassword } from '@@/profile/core/_models'
import { useAuth } from '@@/auth'
import { useProfile } from '@@/profile/core/_request'

/* ---------------------------
   Reusable Password Input
---------------------------- */
const PasswordInput: React.FC<{
  id: string
  label: string
  placeholder?: string
  field: any
  error?: string | undefined
  touched?: boolean
}> = ({ id, label, placeholder, field, error, touched }) => {
  const [show, setShow] = useState(false)

  return (
    <div className="fv-row mb-0">
      <label htmlFor={id} className="form-label fs-6 fw-bolder mb-3">
        {label}
      </label>
      <div className="input-group">
        <input
          type={show ? 'text' : 'password'}
          className="form-control form-control-lg form-control-solid"
          id={id}
          placeholder={placeholder}
          {...field}
        />
        <button
          type="button"
          className="btn btn-light"
          onClick={() => setShow(!show)}
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {touched && error && (
        <div className="fv-plugins-message-container">
          <div className="fv-help-block">{error}</div>
        </div>
      )}
    </div>
  )
}

/* ---------------------------
   Validation Schemas
---------------------------- */
const emailFormValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required'),
  confirm_password: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password is required'),
})

const passwordFormValidationSchema = Yup.object().shape({
  current_password: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password is required'),
  new_password: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password is required'),
  new_password_confirmation: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password is required')
    .oneOf([Yup.ref('new_password')], 'Passwords must match'),
})

/* ---------------------------
   Main Component
---------------------------- */
const SignInMethod: React.FC = () => {
  const { currentUser } = useAuth()
  const { changeEmail, changePassword } = useProfile()
  const { auth, requestUser } = useAuth()

  const [emailUpdateData, setEmailUpdateData] = useState<IUpdateEmail>(updateEmail)
  const [passwordUpdateData, setPasswordUpdateData] = useState<IUpdatePassword>(updatePassword)

  const [showEmailForm, setShowEmailForm] = useState<boolean>(false)
  const [showPasswordForm, setPasswordForm] = useState<boolean>(false)

  const formik1 = useFormik<IUpdateEmail>({
    initialValues: { ...emailUpdateData },
    validationSchema: emailFormValidationSchema,
    onSubmit: async (values) => {
      const response = await changeEmail(values)
      if (response === 'success') {
        setEmailUpdateData(values)
        setShowEmailForm(false)
        requestUser(auth)
      }
    },
  })

  const formik2 = useFormik<IUpdatePassword>({
    initialValues: { ...passwordUpdateData },
    validationSchema: passwordFormValidationSchema,
    onSubmit: async (values) => {
      const response = await changePassword(values)
      if (response === 'success') {
        setPasswordUpdateData(values)
        setPasswordForm(false)
      }
    },
  })

  return (
    <div className="card mb-5 mb-xl-10">
      <div
        className="card-header border-0 cursor-pointer"
        role="button"
        data-bs-toggle="collapse"
        data-bs-target="#kt_account_signin_method"
      >
        <div className="card-title m-0">
          <h3 className="fw-bolder m-0">Sign-in Method</h3>
        </div>
      </div>

      <div id="kt_account_signin_method" className="collapse show">
        <div className="card-body border-top p-9">
          {/* ---------------- EMAIL SECTION ---------------- */}
          <div className="d-flex flex-wrap align-items-center">
            <div id="kt_signin_email" className={' ' + (showEmailForm && 'd-none')}>
              <div className="fs-6 fw-bolder mb-1">Email Address</div>
              <div className="fw-bold text-gray-600">{currentUser?.email}</div>
            </div>

            <div
              id="kt_signin_email_edit"
              className={'flex-row-fluid ' + (!showEmailForm && 'd-none')}
            >
              <form onSubmit={formik1.handleSubmit} id="kt_signin_change_email" className="form" noValidate>
                <div className="row mb-6">
                  <div className="col-lg-6 mb-4 mb-lg-0">
                    <div className="fv-row mb-0">
                      <label htmlFor="emailaddress" className="form-label fs-6 fw-bolder mb-3">
                        Enter New Email Address
                      </label>
                      <input
                        type="email"
                        className="form-control form-control-lg form-control-solid"
                        id="emailaddress"
                        placeholder="Email Address"
                        {...formik1.getFieldProps('email')}
                      />
                      {formik1.touched.email && formik1.errors.email && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">{formik1.errors.email}</div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <PasswordInput
                      id="confirmemailpassword"
                      label="Confirm Password"
                      field={formik1.getFieldProps('confirm_password')}
                      error={formik1.errors.confirm_password}
                      touched={formik1.touched.confirm_password}
                    />
                  </div>
                </div>
                <div className="d-flex">
                  <button type="submit" className="btn btn-primary me-2 px-6">
                    Update Email
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEmailForm(false)}
                    className="btn btn-color-gray-500 btn-active-light-primary px-6"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>

            <div id="kt_signin_email_button" className={'ms-auto ' + (showEmailForm && 'd-none')}>
              <button onClick={() => setShowEmailForm(true)} className="btn btn-light btn-active-light-primary">
                Change Email
              </button>
            </div>
          </div>

          <div className="separator separator-dashed my-6"></div>

          {/* ---------------- PASSWORD SECTION ---------------- */}
          <div className="d-flex flex-wrap align-items-center mb-10">
            <div id="kt_signin_password" className={' ' + (showPasswordForm && 'd-none')}>
              <div className="fs-6 fw-bolder mb-1">Password</div>
              <div className="fw-bold text-gray-600">************</div>
            </div>

            <div id="kt_signin_password_edit" className={'flex-row-fluid ' + (!showPasswordForm && 'd-none')}>
              <form onSubmit={formik2.handleSubmit} id="kt_signin_change_password" className="form" noValidate>
                <div className="row mb-1">
                  <div className="col-lg-4">
                    <PasswordInput
                      id="currentpassword"
                      label="Current Password"
                      field={formik2.getFieldProps('current_password')}
                      error={formik2.errors.current_password}
                      touched={formik2.touched.current_password}
                    />
                  </div>
                  <div className="col-lg-4">
                    <PasswordInput
                      id="newpassword"
                      label="New Password"
                      field={formik2.getFieldProps('new_password')}
                      error={formik2.errors.new_password}
                      touched={formik2.touched.new_password}
                    />
                  </div>
                  <div className="col-lg-4">
                    <PasswordInput
                      id="confirmpassword"
                      label="Confirm New Password"
                      field={formik2.getFieldProps('new_password_confirmation')}
                      error={formik2.errors.new_password_confirmation}
                      touched={formik2.touched.new_password_confirmation}
                    />
                  </div>
                </div>

                <div className="form-text mb-5">
                  Password must be at least 8 characters and contain symbols
                </div>

                <div className="d-flex">
                  <button type="submit" className="btn btn-primary me-2 px-6">
                    Update Password
                  </button>
                  <button
                    onClick={() => setPasswordForm(false)}
                    type="button"
                    className="btn btn-color-gray-500 btn-active-light-primary px-6"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>

            <div id="kt_signin_password_button" className={'ms-auto ' + (showPasswordForm && 'd-none')}>
              <button onClick={() => setPasswordForm(true)} className="btn btn-light btn-active-light-primary">
                Reset Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { SignInMethod }
