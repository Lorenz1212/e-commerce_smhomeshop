import { useEffect, useState } from 'react';
import Select from 'react-select';
import { fetchData } from '@@@@@/storeService';
import clsx from 'clsx';

interface Props {
  setClass: string;
  name: string;
  value?: string | number;
  onChange?: (e: any) => void;
  onBlur?: (e: any) => void;
  error?: string;
  touched?: boolean;
  search?: boolean;
}

export const StoreSelect: React.FC<Props> = ({
  setClass,
  name,
  value,
  onChange,
  onBlur,
  error,
  touched,
  search = true
}) => {
  const [options, setOptions] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    fetchData()
      .then((data) => {
        const mapped = data.map((item) => ({
          value: item.id.toString(),
          label: item.name,
        }));
        setOptions(mapped);
      })
      .catch(console.error);
  }, []);

  return (
    <div className={setClass}>
      <label className='form-label'>Stores</label>
      {search ? (
        <Select
          name={name}
          options={options}
          value={options.find((opt) => opt.value === value?.toString()) || null}
          onChange={(selectedOption) => {
            onChange?.({
              target: {
                name,
                value: selectedOption?.value || '',
              },
            });
          }}
          onBlur={onBlur}
          className={clsx('form-select-solid text-dark', {
            'is-invalid': error && touched,
          })}
        />
      ) : (
        <select
          name={name}
          className={clsx('form-select', {
            'is-invalid': error && touched,
          })}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
        >
          <option value="">Select a store</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
      {error && touched && <div className='invalid-feedback'>{error}</div>}
    </div>
  );
};