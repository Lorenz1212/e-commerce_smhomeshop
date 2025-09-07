import {useState} from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
import {useNavigate, useParams} from 'react-router-dom'
import {useFormik} from 'formik'
import {setupPassword} from '../core/_requests'
import { AxiosError } from 'axios'
import {toast, ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { FaEye, FaEyeSlash } from 'react-icons/fa' 
import { useLoader } from '@@@/LoaderContext'
import Swal from 'sweetalert2'

const Schema = Yup.object().shape({
  new_password: Yup.string()
    .min(6, 'Minimum 6 characters')
    .max(50, 'Maximum 50 characters')
    .required('Password is required'),
  new_password_confirmation: Yup.string()
    .required('Confirmation is required')
    .oneOf([Yup.ref('new_password')], 'Passwords must match'),
})

export function SetupPassword() {
  const  {showLoader,hideLoader }= useLoader();
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const navigate = useNavigate()
  const { token } = useParams()

  const initialValues = {
    new_password: '',
    new_password_confirmation: '',
    token: token,
  }

  const formik = useFormik({
    initialValues,
    validationSchema: Schema,
    onSubmit: async (values) => {
      showLoader()
      setTimeout(() => {
        setupPassword(values)
          .then((res) => {
            Swal.fire({
            icon: "success",
            title: res.data.message,
            text: res.data.message || "You can now login with your new password.",
            confirmButtonText: "Go to Login",
            confirmButtonColor: "#5473E3",
            }).then(() => {
                 navigate(`/auth/login`)
            })
          })
          .catch((err) => {
            const error = err as AxiosError<{ message: string; errors?: Record<string, string[]> }>
            const apiErrors = error.response?.data?.errors
            let errorMessage = error.response?.data?.message || 'Something went wrong'

            if (apiErrors) {
              const firstError = Object.values(apiErrors)[0]?.[0]
              if (firstError) {
                errorMessage = firstError
              }
            }
            toast.error(errorMessage)
          })
          .finally(() => {
            hideLoader()
          })
      }, 1000)
    },
  })

  return (
    <>
    <form
      className='form w-100'
      onSubmit={formik.handleSubmit}
      noValidate
      id='kt_login_signin_form'
    >
      <div className='text-center mb-11'>
        <h1 className='text-gray-900 fw-bolder mb-3'>Setup your Password</h1>
      </div>

      {/* New Password */}
      <div className='fv-row mb-8 position-relative'>
        <label className='form-label fs-6 fw-bolder text-gray-900'>New Password</label>
        <div className='input-group'>
          <input
            placeholder='Enter your new password'
            {...formik.getFieldProps('new_password')}
            className={clsx(
              'form-control bg-transparent',
              {'is-invalid': formik.touched.new_password && formik.errors.new_password},
              {'is-valid': formik.touched.new_password && !formik.errors.new_password}
            )}
            type={showPassword ? 'text' : 'password'}
            name='new_password'
            autoComplete='off'
          />
          <span
            className="input-group-text cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {formik.touched.new_password && formik.errors.new_password && (
          <div className='fv-plugins-message-container'>
            <span role='alert'>{formik.errors.new_password}</span>
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <div className='fv-row mb-3 position-relative'>
        <label className='form-label fw-bolder text-gray-900 fs-6 mb-0'>Confirmation Password</label>
        <div className='input-group'>
          <input
            type={showConfirm ? 'text' : 'password'}
            placeholder='Enter your confirmation password'
            autoComplete='off'
            {...formik.getFieldProps('new_password_confirmation')}
            className={clsx(
              'form-control bg-transparent',
              {
                'is-invalid': formik.touched.new_password_confirmation && formik.errors.new_password_confirmation,
              },
              {
                'is-valid': formik.touched.new_password_confirmation && !formik.errors.new_password_confirmation,
              }
            )}
          />
          <span
            className="input-group-text cursor-pointer"
            onClick={() => setShowConfirm(!showConfirm)}
          >
            {showConfirm ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {formik.touched.new_password_confirmation && formik.errors.new_password_confirmation && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.new_password_confirmation}</span>
            </div>
          </div>
        )}
      </div>

      <div className='d-grid mb-10'>
        <button
          type='submit'
          id='kt_sign_in_submit'
          className='btn btn-primary'
          disabled={formik.isSubmitting || !formik.isValid}
        >
          {!loading && <span className='indicator-label'>Submit</span>}
          {loading && (
            <span className='indicator-progress' style={{display: 'block'}}>
              Please wait...
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          )}
        </button>
      </div>
    </form>
    <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </>
  )
}
