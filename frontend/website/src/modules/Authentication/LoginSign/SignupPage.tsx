import { Link, useNavigate } from "react-router-dom";
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {register} from '../core/_requests'
import clsx from "clsx";
import "react-datepicker/dist/react-datepicker.css";
import { useLoader } from "@/components/LoaderContext";
import Swal from 'sweetalert2'

const Schema = Yup.object().shape({
  fname: Yup.string().required('First name is required'),
  lname: Yup.string().required('Last name is required'),
  contact_number: Yup.string().matches(/^09\d{9}$/, "Contact number must be 11 digits and start with 09")
  .required("Contact number is required"),
  gender: Yup.string().required('Gender is required'),
  birthdate: Yup.date().required('Birthdate is required'),
  mname: Yup.string()
    .nullable()
    .max(50, 'Maximum 50 symbols'),
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required'),
  password: Yup.string()
      .min(6, 'Minimum 6 characters')
      .max(50, 'Maximum 50 characters')
      .required('Password is required'),
  password_confirmation: Yup.string()
      .required('Confirmation is required')
      .oneOf([Yup.ref('password')], 'Passwords must match'),
  terms: Yup.string().required('term is required'),    
})

const initialValues = {
  fname:'',
  lname:'',
  mname:'',
  suffix:'',
  contact_number:'',
  gender:'',
  birthdate:'',
  email: '',
  password: '',
  password_confirmation:'',
  terms:''
}

export const SignupPage = () => {
  const today = new Date();
  today.setFullYear(today.getFullYear() - 7); 
  const maxDate = today.toISOString().split("T")[0];
  const { showLoader, hideLoader } = useLoader();
  const navigate = useNavigate();
  const formikSignup = useFormik({
    initialValues,
    validationSchema: Schema,
    onSubmit: async (values) => {
      showLoader()
      try {
        const res = await register(values)
        Swal.fire({
          icon: "success",
          title: res?.data.message,
        });
        navigate(`/login-signup?tab=login`); 
      } catch (error) {
          let message = "Something wen't wrong";
          if (typeof error === "object" && error !== null && "response" in error) {
            message = (error as any).response?.data?.message || message;
          }
          Swal.fire({
            icon: "error",
            title: message,
          });
          return null;
      } finally{
        hideLoader();
      }
    },
  })
  return (
    <form
        onSubmit={formikSignup.handleSubmit}
        noValidate
        className="signupForm"
        >
        <div className="form-group">
            <label htmlFor="fname" className="form-label required">First Name</label>
            <input
            id="fname"
            placeholder="Enter your first name"
            {...formikSignup.getFieldProps('fname')}
            className={clsx(
                {
                'is-invalid': formikSignup.touched.fname && formikSignup.errors.fname
                },
                {
                'is-valid': formikSignup.touched.fname && !formikSignup.errors.fname
                }
            )}
            type="text"
            name="fname"
            autoComplete="off"
            />
            {formikSignup.touched.fname && formikSignup.errors.fname && (
            <div className="form-error-message">
                <span role="alert">{formikSignup.errors.fname}</span>
            </div>
            )}
        </div>
        <div className="form-group ml-10px">
            <label htmlFor="email" className="form-label required">Last Name</label>
            <input
            id="lname"
            placeholder="Enter your last name"
            {...formikSignup.getFieldProps('lname')}
            className={clsx(
                {
                'is-invalid': formikSignup.touched.lname && formikSignup.errors.lname
                },
                {
                'is-valid': formikSignup.touched.lname && !formikSignup.errors.lname
                }
            )}
            type="text"
            name="lname"
            autoComplete="off"
            />
            {formikSignup.touched.lname && formikSignup.errors.lname && (
            <div className="form-error-message">
                <span role="alert">{formikSignup.errors.lname}</span>
            </div>
            )}
        </div>
        <div className="form-group">
            <label htmlFor="mname" className="form-label required">Middle Name (optional)</label>
            <input
            id="mname"
            placeholder="Enter your middle name"
            {...formikSignup.getFieldProps('mname')}
            type="text"
            name="mname"
            autoComplete="off"
            />
        </div>
        <div className="form-group ml-10px">
            <label htmlFor="suffix" className="form-label required">Suffix (optional)</label>
            <input
            id="suffix"
            placeholder="Enter your suffix"
            {...formikSignup.getFieldProps('suffix')}
            type="text"
            name="suffix"
            autoComplete="off"
            />
        </div>
        <div className="form-group">
            <label htmlFor="gender" className="form-label required">Gender</label>
            <select
            id="gender"
            {...formikSignup.getFieldProps('gender')}
            name="gender"
            className={clsx(
                {
                'is-invalid': formikSignup.touched.gender && formikSignup.errors.gender
                },
                {
                'is-valid': formikSignup.touched.gender && !formikSignup.errors.gender
                }
            )}
            >
              <option value=" ">Choose Gender</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
            {formikSignup.touched.gender && formikSignup.errors.gender && (
            <div className="form-error-message">
                <span role="alert">{formikSignup.errors.gender}</span>
            </div>
            )}
        </div>
        <div className="form-group ml-10px datepicker-wrapper">
          <label htmlFor="birthdate" className="form-label required">Birth Date</label>
          <input
               max={maxDate}
              type='date'
              id="birthdate"
              name="birthdate"
              value={formikSignup.values.birthdate}
              onChange={(e) => formikSignup.setFieldValue("birthdate", e.target.value)}
              placeholder="Select your birth date"
              className={clsx(`datepicker-input`,
                {
                'is-invalid': formikSignup.touched.birthdate && formikSignup.errors.birthdate
                },
                {
                'is-valid': formikSignup.touched.birthdate && !formikSignup.errors.birthdate
                }
              )}
          />
          {formikSignup.touched.birthdate && formikSignup.errors.birthdate && (
            <div className="form-error-message">
              <span role="alert">{formikSignup.errors.birthdate}</span>
            </div>
          )}
        </div>
        <div className="form-group full-width">
            <label htmlFor="contact_number" className="form-label required">Contact No.</label>
            <input
            id="contact_number"
            placeholder="Enter your contact no."
            {...formikSignup.getFieldProps('contact_number')}
            className={clsx(
                {
                'is-invalid': formikSignup.touched.contact_number && formikSignup.errors.contact_number
                },
                {
                'is-valid': formikSignup.touched.contact_number && !formikSignup.errors.contact_number
                }
            )}
              type="tel"
              name="contact_number"
              autoComplete="off"
              pattern="^09\d{9}$"
              maxLength={11}
            />
            {formikSignup.touched.contact_number && formikSignup.errors.contact_number && (
            <div className="form-error-message">
                <span role="alert">{formikSignup.errors.contact_number}</span>
            </div>
            )}
        </div>
        <div className="form-group full-width">
            <label htmlFor="email" className="form-label required">Email Address</label>
            <input
            id="email"
            placeholder="Enter your email"
            {...formikSignup.getFieldProps('email')}
            className={clsx(
                {
                'is-invalid': formikSignup.touched.email && formikSignup.errors.email
                },
                {
                'is-valid': formikSignup.touched.email && !formikSignup.errors.email
                }
            )}
            type="email"
            name="email"
            autoComplete="off"
            />
            {formikSignup.touched.email && formikSignup.errors.email && (
            <div className="form-error-message">
                <span role="alert">{formikSignup.errors.email}</span>
            </div>
            )}
        </div>
        <div className="form-group full-width">
            <label htmlFor="password" className="form-label required">Password</label>
            <input
            id="password"
            placeholder="Enter your password"
            {...formikSignup.getFieldProps('password')}
            className={clsx(
                {
                'is-invalid': formikSignup.touched.password && formikSignup.errors.password
                },
                {
                'is-valid': formikSignup.touched.password && !formikSignup.errors.password
                }
            )}
            type="password"
            name="password"
            autoComplete="off"
            />
            {formikSignup.touched.password && formikSignup.errors.password && (
            <div className="form-error-message">
                <span role="alert">{formikSignup.errors.password}</span>
            </div>
            )}
        </div>
        <div className="form-group full-width">
            <label htmlFor="con_password" className="form-label required">Confirmation Password</label>
            <input
            id="password_confirmation"
            placeholder="Enter Confirmation Password"
            {...formikSignup.getFieldProps('password_confirmation')}
            className={clsx(
                {
                'is-invalid': formikSignup.touched.password_confirmation && formikSignup.errors.password_confirmation
                },
                {
                'is-valid': formikSignup.touched.password_confirmation && !formikSignup.errors.password_confirmation
                }
            )}
            type="password"
            name="password_confirmation"
            autoComplete="off"
            />
            {formikSignup.touched.password_confirmation && formikSignup.errors.password_confirmation && (
            <div className="form-error-message">
                <span role="alert">{formikSignup.errors.password_confirmation}</span>
            </div>
            )}
        </div>
        <div className="form-group full-width privacy-section">
          <label className="privacyLabel">
            <input
              type="checkbox"
               {...formikSignup.getFieldProps('terms')}
              className={clsx("privacyRadio",
                {
                'is-invalid': formikSignup.touched.terms && formikSignup.errors.terms
                },
                {
                'is-valid': formikSignup.touched.terms && !formikSignup.errors.terms
                }
            )}
            />
            <span>
              Your personal data will be used to support your experience throughout this website, 
              to manage access to your account, and for other purposes described in our 
              <Link
                to="/terms"
                style={{ textDecoration: "none", color: "#c32929" }}
              >
                {" "}privacy policy
              </Link>
            </span>
          </label>
        </div>
        <div className="form-group full-width">
          <button type="submit">Register</button>
        </div>
    </form>
  )
}
