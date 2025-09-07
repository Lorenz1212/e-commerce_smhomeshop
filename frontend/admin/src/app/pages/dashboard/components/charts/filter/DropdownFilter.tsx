import React, { useEffect, useRef } from 'react'
import { useFormik } from 'formik'
import { StoreSelect } from '@@@/selects/StoreSelect'
import * as Yup from 'yup'

type FilterValues = {
  from_date: Date | null
  to_date: Date | null
  store_id: string
  channel: 'pos' | 'online' | 'both'
}

type Props = {
  onApply: (values: FilterValues) => void
  initialValues?: Partial<FilterValues>
}

export const DropdownFilter: React.FC<Props> = ({
  onApply,
  initialValues = {
    from_date: null,
    to_date: null,
    store_id: '',
    channel: 'both',
  },
}) => {
  const validationSchema = Yup.object().shape({
    from_date: Yup.date()
      .required('From Date is required')
      .typeError('Invalid date'),
    to_date: Yup.date()
      .required('To Date is required')
      .typeError('Invalid date')
      .min(Yup.ref('from_date'), 'To Date cannot be before From Date'),
    store_id: Yup.string().required('Store is required'),
    channel: Yup.string()
      .oneOf(['pos', 'online', 'both'])
      .required('Channel is required'),
  })
  
  const formik = useFormik<FilterValues>({
    initialValues: {
      from_date: initialValues.from_date || null,
      to_date: initialValues.to_date || null,
      store_id: initialValues.store_id || '',
      channel: initialValues.channel || 'both',
    },
    validationSchema,
    onSubmit: (values) => {
      onApply(values)
    },
  })

  // Use a portal for the date picker to avoid z-index issues
  const CalendarContainer = ({ children }: { children: React.ReactNode }) => {
    return (
      <div style={{
        position: 'absolute',
        zIndex: 9999,
        backgroundColor: 'white',
        boxShadow: '0 2px 5px rgba(0,0,0,0.15)'
      }}>
        {children}
      </div>
    )
  }

  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = dropdownRef.current
    const handleClick = (e: Event) => e.stopPropagation()

    if (el) el.addEventListener('click', handleClick)
    return () => {
      if (el) el.removeEventListener('click', handleClick)
    }
  }, [])

  return (
    <div className="menu menu-sub menu-sub-dropdown w-250px w-md-300px" data-kt-menu="true" data-kt-menu-overflow="true"
>
      <div className="px-7 py-5">
        <div className="fs-5 text-gray-900 fw-bolder">Filter Options</div>
      </div>

      <div className="separator border-gray-200"></div>

      <form onSubmit={formik.handleSubmit}>
        <div className="px-7 py-5">
          <div className="mb-10">
  <label className="form-label">From Date</label>
  <input
    type="date"
    name="from_date"
    className="form-control form-control-solid"
    value={formik.values.from_date instanceof Date 
      ? formik.values.from_date.toISOString().split('T')[0]
      : formik.values.from_date || ''}
    onChange={(e) => {
      formik.setFieldValue('from_date', e.target.value);
      if (formik.values.to_date && new Date(e.target.value) > new Date(formik.values.to_date)) {
        formik.setFieldValue('to_date', '');
      }
    }}
    onBlur={formik.handleBlur}
    max={new Date().toISOString().split('T')[0]} // Ensures string format
  />
  {formik.touched.from_date && formik.errors.from_date && (
    <div className="text-danger mt-1">{formik.errors.from_date}</div>
  )}
          </div>

          <div className="mb-10">
            <label className="form-label">To Date</label>
            <input
              type="date"
              name="to_date"
              className="form-control form-control-solid"
              value={formik.values.to_date instanceof Date 
                ? formik.values.to_date.toISOString().split('T')[0]
                : formik.values.to_date || ''}
              onChange={(e) => formik.setFieldValue('to_date', e.target.value)}
              onBlur={formik.handleBlur}
              min={formik.values.from_date 
                ? new Date(formik.values.from_date).toISOString().split('T')[0] 
                : new Date().toISOString().split('T')[0]} // Ensures string format
              max={new Date().toISOString().split('T')[0]} // Ensures string format
              disabled={!formik.values.from_date}
            />
            {formik.touched.to_date && formik.errors.to_date && (
              <div className="text-danger mt-1">{formik.errors.to_date}</div>
            )}
          </div>

          <StoreSelect
            setClass="mb-10"
            name="store_id"
            value={formik.values.store_id}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.errors.store_id && formik.touched.store_id
                ? formik.errors.store_id
                : undefined
            }
            touched={!!formik.touched.store_id}
            search={false}
          />

          <div className="mb-10">
            <label className="form-label">Channel</label>
            <select
              name="channel"
              className="form-select"
              value={formik.values.channel}
              onChange={formik.handleChange}
            >
              <option value="both">Both</option>
              <option value="pos">POS</option>
              <option value="online">Online</option>
            </select>
          </div>

          <div className="d-flex justify-content-end">
            <button
              type="reset"
              className="btn btn-sm btn-body btn-active-light-primary me-2"
              onClick={() => formik.resetForm()}
            >
              Reset
            </button>
            <button
              type="submit"
              className="btn btn-sm btn-primary"
              disabled={!formik.isValid || formik.isSubmitting}
            >
              Apply
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}