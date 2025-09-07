import {useState, useEffect} from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
import {Link, useNavigate} from 'react-router-dom'
import {useFormik} from 'formik'
import {requestPassword, verifyOTP} from '../core/_requests'
import {toast, ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AxiosError } from 'axios'
import { useLoader } from '@@@/LoaderContext'

const initialValues = {
  email: ''
}

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required'),
})

export function ForgotPassword() {
  const { showLoader, hideLoader } = useLoader()
  const [loading, setLoading] = useState(false)
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [otp, setOtp] = useState('')
  const [email, setEmail] = useState('')
  const [timer, setTimer] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000)
    }
    return () => clearInterval(interval)
  }, [timer])

  const formik = useFormik({
    initialValues,
    validationSchema: forgotPasswordSchema,
    onSubmit: (values, {setSubmitting}) => {
      showLoader()
      setTimeout(() => {
        requestPassword(values.email)
          .then((res) => {
            toast.success(res.data.message)
            setShowOtpModal(true)
            setTimer(30)
            setEmail(values.email)
          })
          .catch((err) => {
            const error = err as AxiosError<{ message: string; errors?: Record<string, string[]> }>;
            const apiErrors = error.response?.data?.errors;
            let errorMessage = error.response?.data?.message || "Something went wrong";

            if (apiErrors) {
              const firstError = Object.values(apiErrors)[0]?.[0];
              if (firstError) {
                errorMessage = firstError;
              }
            }
            toast.error(errorMessage);
            setSubmitting(false)
          }).finally(()=>{
            hideLoader()
          })
      }, 1000)
    },
  })

  const handleOtpSubmit = () => {
    showLoader()
    setTimeout(() => {
      verifyOTP({email: email, otp: otp})
        .then((res) => {
          const token = res.data.result 
          toast.success(res.data.message)
          setShowOtpModal(false)
          navigate(`/auth/reset-password/${token}`)
        })
        .catch((err) => {
          const error = err as AxiosError<{ message: string; errors?: Record<string, string[]> }>;
          const apiErrors = error.response?.data?.errors;
          let errorMessage = error.response?.data?.message || "Something went wrong";

          if (apiErrors) {
            const firstError = Object.values(apiErrors)[0]?.[0];
            if (firstError) {
              errorMessage = firstError;
            }
          }

          toast.error(errorMessage);
        }).finally(()=>{
          hideLoader()
        })
    }, 1000)
  }

  const handleResendOtp = () => {
    showLoader()
    requestPassword(email)
      .then((res) => {
        toast.success(res.data.message)
        setTimer(30)
      })
      .catch((err) => {
        const error = err as AxiosError<{ message: string; errors?: Record<string, string[]> }>;
        const apiErrors = error.response?.data?.errors;
        let errorMessage = error.response?.data?.message || "Something went wrong";

        if (apiErrors) {
          const firstError = Object.values(apiErrors)[0]?.[0];
          if (firstError) {
            errorMessage = firstError;
          }
        }
        toast.error(errorMessage);
        setTimer(30)
      }).finally(()=>{
        hideLoader()
      })
  }

  return (
    <>
      <form
        className='form w-100 fv-plugins-bootstrap5 fv-plugins-framework'
        noValidate
        id='kt_login_password_reset_form'
        onSubmit={formik.handleSubmit}
      >
        <div className='text-center mb-10'>
          <h1 className='text-gray-900 fw-bolder mb-3'>Forgot Password ?</h1>
          <div className='text-gray-500 fw-semibold fs-6'>
            Enter your email to reset your password.
          </div>
        </div>

        <div className='fv-row mb-8'>
          <label className='form-label fw-bolder text-gray-900 fs-6'>Email</label>
          <input
            type='email'
            autoComplete='off'
            placeholder='Enter your email'
            {...formik.getFieldProps('email')}
            className={clsx(
              'form-control bg-transparent',
              {'is-invalid': formik.touched.email && formik.errors.email},
              {'is-valid': formik.touched.email && !formik.errors.email}
            )}
          />
          {formik.touched.email && formik.errors.email && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{formik.errors.email}</span>
              </div>
            </div>
          )}
        </div>

        <div className='d-flex flex-wrap justify-content-center pb-lg-0'>
          <button type='submit' id='kt_password_reset_submit' className='btn btn-primary me-4'>
            <span className='indicator-label'>Submit</span>
            {loading && (
              <span className='indicator-progress'>
                Please wait...
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
            )}
          </button>
          <Link to='/auth/login'>
            <button
              type='button'
              id='kt_login_password_reset_form_cancel_button'
              className='btn btn-light'
              disabled={formik.isSubmitting || !formik.isValid}
            >
              Cancel
            </button>
          </Link>
        </div>
      </form>

      {/* ✅ OTP Modal */}
      {showOtpModal && (
        <div className='modal fade show d-block' tabIndex={-1} role='dialog'>
          <div className='modal-dialog modal-dialog-centered'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title'>Enter OTP</h5>
                <button
                  type='button'
                  className='btn-close'
                  onClick={() => setShowOtpModal(false)}
                ></button>
              </div>
              <div className='modal-body text-center'>
                <input
                  type='text'
                  className='form-control mb-3 text-center'
                  placeholder='Enter 6-digit OTP'
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />

                <button
                  className='btn btn-link p-0 '
                  onClick={handleResendOtp}
                  disabled={timer > 0}
                >
                  {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP'}
                </button>
              </div>
              <div className='modal-footer'>
                <button className='btn btn-secondary' onClick={() => setShowOtpModal(false)}>
                  Cancel
                </button>
                <button className='btn btn-primary' onClick={handleOtpSubmit}>
                  Verify OTP
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Toast container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </>
  )
}
