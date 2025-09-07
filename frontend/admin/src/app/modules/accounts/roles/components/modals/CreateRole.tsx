import {FC, useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import clsx from 'clsx'
import {useRole} from '../core/_requests'
import { PermissionSelector } from '@@@/selects/PermissionSelector'


interface Props {
  setPage?: (values: number) => void
  setRefreshTable?: (value: boolean) => void
  onSubmit?: (values: any) => void
}

const Schema = Yup.object().shape({
  name: Yup.string()
    .min(1, 'Minimum 1 character')
    .max(50, 'Maximum 50 characters')
    .required('Role name is required'),
  permissions: Yup.array().of(Yup.number()).min(1, 'At least 1 permission is required'),
})

const CreateRoleModal: FC<Props> = ({setPage, setRefreshTable, onSubmit}) => {
  const {createRole} = useRole()

  const formik = useFormik({
    initialValues: {
      name: '',
      permissions: [] as number[],
    },
    validationSchema: Schema,
    onSubmit: async (values, {resetForm}) => {
      await createRole(values, resetForm, setRefreshTable, setPage)
      onSubmit?.(values)
    },
  })

  return (
    <form className='form' noValidate onSubmit={formik.handleSubmit}>
      <div className='row'>
        <div className='col-md-12 mb-3'>
          <label className='form-label'>Role Name</label>
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
        <div className='col-md-12'>
          <PermissionSelector
            selected={formik.values.permissions}
            onChange={(val) => formik.setFieldValue('permissions', val)}
          />
          {formik.touched.permissions && formik.errors.permissions && (
            <div className='text-danger small'>{formik.errors.permissions as string}</div>
          )}
        </div>
      </div>
      <div className='d-flex justify-content-end mt-4'>
        <button type='submit' className='btn btn-primary'>
          Save
        </button>
      </div>
    </form>
  )
}

export {CreateRoleModal}
