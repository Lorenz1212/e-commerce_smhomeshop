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

export const CurrencyFormat: React.FC<Props> = ({
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
      <label className="form-label">{labelName}</label>
      <IMaskInput
        placeholder="₱0.00"
        className={clsx('form-control', {
          'is-invalid': error && touched,
        })}
        name={name}
        value={data}
        // currency mask
        mask="₱ num"
        blocks={{
          num: {
            mask: Number,
            thousandsSeparator: ',',
            radix: '.',
            mapToRadix: ['.'],
            scale: 2, // 2 decimal places
          },
        }}
        onAccept={(value) => setFieldValue(name, value)}
      />
      {error && touched && <div className="invalid-feedback">{error}</div>}
    </div>
  )
}
