import { FC } from 'react'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import clsx from 'clsx'
import { useAddon } from '../../core/_request'

interface Props {
  categoryID: string
  data: any
  setRefreshTable?: (values: boolean) => void
  onSubmit?: (values: any) => void
}

const EditAddonModal: FC<Props> = ({
  categoryID,
  data,
  setRefreshTable,
  onSubmit,
}) => {
  const { updateAddon } = useAddon()

  // ✅ Schema with conditional validation
  const Schema = Yup.object().shape({
    name: Yup.string()
      .min(1, 'Minimum 1 character')
      .max(50, 'Maximum 50 characters')
      .required('Add-ons name is required'),
    base_price: Yup.number().when('is_freebies', {
      is: 'N',
      then: (schema) => schema.required('Base price is required').min(1),
      otherwise: (schema) => schema.notRequired().nullable(),
    }),
    is_freebies: Yup.string().oneOf(['Y', 'N']).required(),
  })

  const formik = useFormik({
    initialValues: {
      name: data.name,
      base_price: data.base_price,
      is_freebies: data.is_freebies ?? 'N', // ✅ default to N if not provided
    },
    validationSchema: Schema,
    onSubmit: async (values, { resetForm }) => {
      // ✅ Auto set base_price = 0 if freebies
      const payload = {
        ...values,
        base_price: values.is_freebies === 'Y' ? 0 : values.base_price,
      }

      await updateAddon(payload, categoryID, setRefreshTable)
      onSubmit?.(payload)
    },
  })

  return (
    <form className='form' noValidate onSubmit={formik.handleSubmit}>
      <div className='row'>
        {/* Addon Name */}
        <div className='col-md-12 mb-3'>
          <label className='form-label'>Product Add-on</label>
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

        {/* Is Freebies Switch */}
        <div className='col-md-12 mb-3 d-flex align-items-center'>
          <label className='form-label me-3 mb-0'>Is Freebie?</label>
          <div className='form-check form-switch'>
            <input
              type='checkbox'
              className='form-check-input'
              id='is_freebies'
              checked={formik.values.is_freebies === 'Y'}
              onChange={(e) =>
                formik.setFieldValue('is_freebies', e.target.checked ? 'Y' : 'N')
              }
            />
            <label className='form-check-label' htmlFor='is_freebies'>
              {formik.values.is_freebies === 'Y' ? 'Yes' : 'No'}
            </label>
          </div>
        </div>

        {/* Base Price → only show if NOT freebies */}
        {formik.values.is_freebies === 'N' && (
          <div className='col-md-12 mb-3'>
            <label className='form-label'>Base Price</label>
            <input
              type='number'
              className={clsx('form-control', {
                'is-invalid':
                  formik.touched.base_price && formik.errors.base_price,
              })}
              {...formik.getFieldProps('base_price')}
            />
            {formik.touched.base_price &&
              typeof formik.errors.base_price === 'string' && (
                <div className='invalid-feedback'>
                  {formik.errors.base_price}
                </div>
              )}
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className='d-flex justify-content-end mt-4'>
        <button type='submit' className='btn btn-primary'>
          Save
        </button>
      </div>
    </form>
  )
}

export { EditAddonModal }
