import React, { useRef, useState } from 'react'
import { Link } from "react-router-dom";
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {getUserByToken, login} from '../core/_requests'
import clsx from "clsx";
import { useAuth } from '../core/Auth';
import { useLoader } from "@/components/LoaderContext";
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required'),
  password: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password is required'),
})

const initialValues = {
  email: '',
  password: '',
}

export const LoginPage = () => {
  const navigate = useNavigate()
  const {saveAuth, setCurrentUser} =useAuth()
  const { showLoader, hideLoader } = useLoader();
  const formikLogin = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, {setStatus, setSubmitting}) => {
        showLoader()
        try {
       const {data: auth} = await login(values.email, values.password)
        Swal.fire({
          icon: auth?.status,
          title: auth?.message,
        });
        if(auth?.status == 'error'){
          return false;
        }
        saveAuth(auth)
        const {data: user} = await getUserByToken(auth.result.token)
        setCurrentUser(user)
        navigate('/home') 
      } catch (error) {
          let message = "Something wen't wrong";
          if (typeof error === "object" && error !== null && "response" in error) {
            message = (error as any).response?.data?.message || message;
          }
          Swal.fire({
            icon: "error",
            title: message,
          });
          saveAuth(undefined)
          return null;
      } finally{
        hideLoader();
      }
    },
  })
  return (
     <form
        onSubmit={formikLogin.handleSubmit}
        noValidate
        >
        <div className="form-group">
            <label htmlFor="email" className="form-label required">Email Address</label>
            <input
            id="email"
            placeholder="Enter your email"
            {...formikLogin.getFieldProps('email')}
            className={clsx(
                {
                'is-invalid': formikLogin.touched.email && formikLogin.errors.email
                },
                {
                'is-valid': formikLogin.touched.email && !formikLogin.errors.email
                }
            )}
            type="email"
            name="email"
            autoComplete="off"
            />
            {formikLogin.touched.email && formikLogin.errors.email && (
            <div className="form-error-message">
                <span role="alert">{formikLogin.errors.email}</span>
            </div>
            )}
        </div>
        <div className="form-group">
            <label htmlFor="email" className="form-label required">Password</label>
        <input
            type='password'
            placeholder='Enter your password'
            autoComplete='off'
            {...formikLogin.getFieldProps('password')}
            className={clsx(
            {
                'is-invalid': formikLogin.touched.password && formikLogin.errors.password,
            },
            {
                'is-valid': formikLogin.touched.password && !formikLogin.errors.password,
            }
            )}
        />
        {formikLogin.touched.password && formikLogin.errors.password && (
            <div className="form-error-message">
            <span role="alert">{formikLogin.errors.password}</span>
            </div>
        )}
        </div>
        <div className="loginSignUpForgetPass">
        <label>
            <input type="checkbox" className="brandRadio" />
            <p>Remember me</p>
        </label>
        <p>
            <Link to="/resetPassword">Lost password?</Link>
        </p>
        </div>
        <button>Log In</button>
    </form>
  )
}
