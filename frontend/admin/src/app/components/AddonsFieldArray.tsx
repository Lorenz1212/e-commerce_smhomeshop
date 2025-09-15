import React, { FC, useEffect, useState } from 'react'
import { FieldArray, useFormikContext } from 'formik'
import clsx from 'clsx'
import { fetchData } from '@@@@@/addonsService'

interface Addon {
  id: string
  name: string
  base_price: number | string
  custom_price: number | string
  is_freebies?: string
}

interface AddonsFieldArrayProps {
  name: string // Formik field name, usually 'addons'
  initialAddons?: Addon[]
}

interface AvailableAddon {
  id: string
  name: string
  base_price: number
  is_freebies: string
}

export const AddonsFieldArray: FC<AddonsFieldArrayProps> = ({ name, initialAddons = [] }) => {
  
  const { values, errors, touched, setFieldValue, handleChange, handleBlur } =
    useFormikContext<any>()
  const [availableAddons, setAvailableAddons] = useState<AvailableAddon[]>([])

  useEffect(() => {
    fetchData()
      .then((data) => {
        const mapped = data.map((item: any) => ({
          id: String(item.id),
          name: item.name,
          base_price: Number(item.base_price),
          is_freebies: item.is_freebies ?? 'N',
        }))
        setAvailableAddons(mapped)
      })
      .catch(console.error)
  }, [])

  useEffect(() => {
    if (initialAddons.length && (!values[name] || values[name].length === 0)) {
      setFieldValue(name, initialAddons)
    }
  }, [initialAddons, setFieldValue, name, values])

  const addons: Addon[] = values[name] || []

  return (
    <FieldArray
      name={name}
      render={(arrayHelpers) => (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5>Addons</h5>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() =>
                arrayHelpers.push({
                  id: '',
                  name: '',
                  base_price: '',
                  custom_price: '',
                  is_freebies: 'N',
                })
              }
            >
              Add Addon
            </button>
          </div>

          {addons.length > 0 ? (
            addons.map((addon, index) => {
              const touchedArray = Array.isArray(touched[name]) ? touched[name] : []
              const errorsArray = Array.isArray(errors[name]) ? errors[name] : []
              const errorAtIndex = errorsArray[index]

              return (
                <div key={index} className="row align-items-center mb-3">
                  {/* Select Addon */}
                  <div className="col-md-4">
                    <select
                      name={`${name}[${index}].id`}
                      className={clsx('form-control', {
                        'is-invalid':
                          touchedArray[index]?.id &&
                          typeof errorAtIndex === 'object' &&
                          errorAtIndex !== null &&
                          'id' in errorAtIndex,
                      })}
                      value={addon.id || ''}
                      onChange={(e) => {
                        const selectedId = e.target.value
                        const selectedAddon = availableAddons.find((a) => a.id === selectedId)

                        setFieldValue(`${name}[${index}].id`, selectedId)

                        if (selectedAddon) {
                          setFieldValue(`${name}[${index}].name`, selectedAddon.name)
                          setFieldValue(`${name}[${index}].base_price`, selectedAddon.base_price)
                          setFieldValue(`${name}[${index}].is_freebies`, selectedAddon.is_freebies)

                          // If freebie, auto-set custom_price = 0
                          if (selectedAddon.is_freebies === 'Y') {
                            setFieldValue(`${name}[${index}].custom_price`, 0)
                          }
                        }
                      }}
                      onBlur={handleBlur}
                    >
                      <option value="">Select Addon</option>
                      {availableAddons.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.name}
                        </option>
                      ))}
                    </select>
                    {touchedArray[index]?.id &&
                      typeof errorAtIndex === 'object' &&
                      errorAtIndex !== null &&
                      'id' in errorAtIndex && (
                        <div className="invalid-feedback">
                          {(errorAtIndex as { id?: string }).id}
                        </div>
                      )}
                  </div>

                  {/* Base Price */}
                  <div className="col-md-3">
                    <input
                      type="number"
                      placeholder="Base Price"
                      className="form-control"
                      value={addon.base_price}
                      readOnly
                    />
                  </div>

                  {/* Custom Price or Freebie */}
                  <div className="col-md-3">
                    {addon.is_freebies === 'Y' ? (
                      <input
                        type="text"
                        className="form-control"
                        value="Freebie"
                        readOnly
                      />
                    ) : (
                      <>
                        <input
                          type="number"
                          placeholder="Custom Price"
                          min={0}
                          step="0.01"
                          className={clsx('form-control', {
                            'is-invalid':
                              touchedArray[index]?.custom_price &&
                              typeof errorAtIndex === 'object' &&
                              errorAtIndex !== null &&
                              'custom_price' in errorAtIndex,
                          })}
                          name={`${name}[${index}].custom_price`}
                          value={addon.custom_price}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {touchedArray[index]?.custom_price &&
                          typeof errorAtIndex === 'object' &&
                          errorAtIndex !== null &&
                          'custom_price' in errorAtIndex && (
                            <div className="invalid-feedback">
                              {(errorAtIndex as { custom_price?: string }).custom_price}
                            </div>
                          )}
                      </>
                    )}
                  </div>

                  {/* Remove Button */}
                  <div className="col-md-2">
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => arrayHelpers.remove(index)}
                      aria-label={`Remove addon row ${index + 1}`}
                    >
                      &times;
                    </button>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="alert alert-secondary text-center rounded-3 py-4 shadow-sm">
              <i className="bi bi-plus-circle fs-3 d-block mb-2 text-muted"></i>
              <span className="fw-semibold text-muted">No addons added yet.</span>
            </div>
          )}
        </div>
      )}
    />
  )
}
