import { useEffect, useState } from 'react';
import Select from 'react-select';
import { fetchBrgy } from '@/services/GetAddress';
import clsx from 'clsx';


interface Props {
  name: string
  value: string | number
  parentId?: string | number
  onChange: (e: any) => void
  onBlur?: (e: any) => void
  error?: string
  touched?: boolean
}

const BrgySelect: React.FC<Props> = ({   
  name,
  value,
  parentId,
  onChange,
  onBlur,
  error,
  touched
}) => {
    const [options, setOptions] = useState<{ label: string; value: number }[]>([])

    useEffect(() => {
      if (!parentId) {
            setOptions([]);
            return;
      }

    fetchBrgy(parentId)
        .then((data) => {
          const mapped = data.map((item:any) => ({
            value: item.value,
            label: item.label,
          }))
          setOptions(mapped)
        })
        .catch(console.error)
    }, [parentId])

    return (
        <>
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
                styles={{
                    container: (provided) => ({
                    ...provided,
                    width: '100%', // Make the select take 100% width of parent
                    }),
                    control: (provided) => ({
                    ...provided,
                    minHeight: '40px', // Optional: adjust height
                    }),
                }}
          />
            {error && touched &&  
              <div className="form-error-message">
                    <span role="alert">{error}</span>
                </div>
            }
        </>
    );
}

export default BrgySelect;