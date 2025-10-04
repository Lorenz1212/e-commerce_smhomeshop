import { IMaskInput } from 'react-imask'
import clsx from 'clsx'

interface Props {
  setClass: string
  labelName: string
  name: string
  data: string
  setFieldValue: (field: string, value: any) => void
  error?: string
  touched?: boolean
}

export const PhoneFormat: React.FC<Props> = ({
  setClass,
  labelName,
  name,
  data,
  setFieldValue,
  error,
  touched,
}) => {
  return (
    <div className={setClass}>
      <label className='form-label'>{labelName}</label>
      <IMaskInput
        placeholder='+63 900 000 0000'
        className={clsx('form-control', {
          'is-invalid': error && touched,
        })}
        name={name}
        value={data}
        unmask={false}
        mask='+63 000 000 0000'
        onAccept={(value) => setFieldValue(name, value)}
      />
      {error && touched && <div className='invalid-feedback'>{error}</div>}
    </div>
  )
}
