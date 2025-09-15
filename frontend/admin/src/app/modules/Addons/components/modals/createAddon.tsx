import { FC } from 'react'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import clsx from 'clsx'
import { useAddon } from '../../core/_request'

interface Props {
  setPage?: (values: number) => void
  setRefreshTable?: (value: boolean) => void
  onSubmit?: (values: any) => void
}

// ✅ Dynamic validation depende sa is_freebies
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

const CreateAddon: FC<Props> = ({
  setPage,
  setRefreshTable,
  onSubmit,
}) => {
  const { createAddon } = useAddon()

  const formik = useFormik({
    initialValues: {
      name: '',
      base_price: '',
      is_freebies: 'N', // ✅ default NO
    },
    validationSchema: Schema,
    onSubmit: async (values, { resetForm }) => {
      await createAddon(values, resetForm, setRefreshTable, setPage)
      onSubmit?.(values)
    },
  })

  return (
    <form className='form' noValidate onSubmit={formik.handleSubmit}>
      <div className='row'>
        {/* Addon Name */}
        <div className='col-md-12 mb-3'>
          <label className='form-label'>Add-on Name</label>
          <input
            type='text'
            className={clsx('form-control', {
              'is-invalid': formik.touched.name && formik.errors.name,
            })}
            {...formik.getFieldProps('name')}
          />
          {formik.touched.name && formik.errors.name && (
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
            <label
              className='form-check-label'
              htmlFor='is_freebies'
            >
              {formik.values.is_freebies === 'Y' ? 'Yes' : 'No'}
            </label>
          </div>
        </div>

        {/* Cost Price → lalabas lang kung hindi freebie */}
        {formik.values.is_freebies === 'N' && (
          <div className='col-md-12 mb-3'>
            <label className='form-label'>Cost Price</label>
            <input
              type='number'
              className={clsx('form-control', {
                'is-invalid':
                  formik.touched.base_price && formik.errors.base_price,
              })}
              {...formik.getFieldProps('base_price')}
            />
            {formik.touched.base_price && formik.errors.base_price && (
              <div className='invalid-feedback'>{formik.errors.base_price}</div>
            )}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className='d-flex justify-content-end mt-4'>
        <button type='submit' className='btn btn-primary'>
          Save
        </button>
      </div>
    </form>
  )
}

export { CreateAddon }
