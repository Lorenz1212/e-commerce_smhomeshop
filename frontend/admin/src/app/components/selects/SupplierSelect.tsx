import {useEffect, useState} from 'react'
import Select from 'react-select'
import clsx from 'clsx'
import { fetchData } from '@@@@@/supplierService'

interface Props {
  setClass: string
  name: string
  value: string | number
  onChange: (e: any) => void
  onBlur?: (e: any) => void
  error?: string
  touched?: boolean
}


export const SupplierSelect: React.FC<Props> = ({
  setClass,
  name,
  value,
  onChange,
  onBlur,
  error,
  touched,
}) => {
  const [options, setOptions] = useState<{ label: string; value: number }[]>([])

  useEffect(() => {
    fetchData()
      .then((data) => {
        const mapped = data.map((item) => ({
          value: item.id,
          label: item.name,
        }))
        setOptions(mapped)
      })
      .catch(console.error)
  }, [])

  return (
    <div className={setClass}>
      <label className='form-label'>Supplier</label>
      <Select
        name={name}
        options={options}
        value={options.find((opt) => opt.value === value) || null}
        onChange={(selectedOption) =>
          onChange({
            target: {
              name,
              value: selectedOption?.value || '',
            },
          })
        }
        onBlur={onBlur}
       className={clsx('form-select-solid text-dark', {
          'is-invalid': error && touched,
        },{})}
      />
      {error && touched && <div className='invalid-feedback'>{error}</div>}
    </div>
  )
}
