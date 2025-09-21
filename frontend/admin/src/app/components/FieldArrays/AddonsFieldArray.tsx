import React, { FC, useEffect, useState } from 'react'
import { FieldArray, useFormikContext } from 'formik'
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'
import clsx from 'clsx'
import { fetchData } from '@@@@@/addonsService'

interface Addon {
  id: string
  name: string
  base_price: number
  custom_price: number | ''
  is_freebies?: string
}

interface AddonsFieldArrayProps {
  name: string
  errors: any
  touched: any
  onBlur?:(data: any) => void
  onChange?:(data: any) => void
  setFieldValue?: any
  setFieldTouched?: any
  initialAddons?: Addon[]
}

interface AvailableAddon {
  id: string
  name: string
  base_price: number
  is_freebies: string
}

export const AddonsFieldArray: FC<AddonsFieldArrayProps> = ({
  name,
  errors,
  touched,
  onBlur,
  onChange,
  setFieldValue,
  setFieldTouched,
  initialAddons = [],
}) => {
  const { values } = useFormikContext<any>()

  const [availableAddons, setAvailableAddons] = useState<AvailableAddon[]>([])
  const [removedAddons, setRemovedAddons] = useState<Addon[]>([]) // 🔑 keep removed items

  // Fetch available addons
  useEffect(() => {
    fetchData()
      .then((data) => {
        setAvailableAddons(
          data.map((item: any) => ({
            id: String(item.id),
            name: item.name,
            base_price: Number(item.base_price),
            is_freebies: item.is_freebies ?? 'N',
          }))
        )
      })
      .catch(console.error)
  }, [])

  const addons: Addon[] = values[name] || []

  // Initialize addons only once (edit mode)
  useEffect(() => {
    if (initialAddons.length && addons.length === 0) {
      setFieldValue(
        name,
        initialAddons.map((a) => ({
          ...a,
          custom_price: a.is_freebies === 'Y' ? 0 : a.custom_price,
        }))
      )
    }
  }, [initialAddons, addons.length, name, setFieldValue])

  return (
    <FieldArray
      name={name}
      render={(arrayHelpers) => (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5>Addons</h5>
            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() =>
                  arrayHelpers.push({
                    id: '',
                    name: '',
                    base_price: 0,
                    custom_price: '',
                    is_freebies: 'N',
                  })
                }
              >
                Add Addon
              </button>

            {/* 🔑 Show retrieve button if we have removed addons */}
            {(() => {
              // ✅ Only include addons that have a valid id
              const retrievableAddons = removedAddons.filter(addon => addon.id)

              return (
                retrievableAddons.length > 0 && (
                  <button
                    type="button"
                    className="btn btn-outline-primary d-inline-flex align-items-center"
                    id="tooltip-retrieve-addons"
                    onClick={() => {
                      retrievableAddons.forEach((addon) => arrayHelpers.push(addon))
                      // remove only the ones we retrieved
                      setRemovedAddons((prev) => prev.filter((addon) => !addon.id))
                    }}
                  >
                    <i className="bi bi-arrow-counterclockwise fs-5"></i>
                    <Tooltip
                      anchorId="tooltip-retrieve-addons"
                      place="top"
                      content={`Retrieve Existing (${retrievableAddons.length})`}
                    />
                  </button>
                )
              )
            })()}
            </div>
          </div>

          {addons.length === 0 && (
            <div className="alert alert-secondary text-center rounded-3 py-4 shadow-sm">
              <i className="bi bi-plus-circle fs-3 d-block mb-2 text-muted"></i>
              <span className="fw-semibold text-muted">
                No addons added yet.
              </span>
            </div>
          )}

          {addons.map((addon, index) => {
            const idKey = `addons[${index}].id`
            const priceKey = `addons[${index}].custom_price`

            const idError = (errors as any)[idKey]
            const priceError = (errors as any)[priceKey]
            const touchedArray =
              typeof touched.addons !== 'undefined'
                ? (touched.addons as any)[index]
                : touched

            return (
              <div key={index} className="row align-items-center mb-3">
                {/* Select Addon */}
                <div className="col-md-4">
                  <select
                    name={`${name}[${index}].id`}
                    value={addon.id || ''}
                    className={clsx('form-control', {
                      'is-invalid': idError && (touchedArray?.id ?? true),
                    })}
                    onChange={(e) => {
                      const selectedId = e.target.value
                      const selectedAddon = availableAddons.find(
                        (a) => a.id === selectedId
                      )
                      setFieldValue(`${name}[${index}].id`, selectedId)

                      if (selectedAddon) {
                        setFieldTouched(`${name}[${index}].id`, false)
                        setFieldValue(
                          `${name}[${index}].name`,
                          selectedAddon.name
                        )
                        setFieldValue(
                          `${name}[${index}].base_price`,
                          selectedAddon.base_price
                        )
                        setFieldValue(
                          `${name}[${index}].is_freebies`,
                          selectedAddon.is_freebies
                        )
                        setFieldValue(
                          `${name}[${index}].custom_price`,
                          selectedAddon.is_freebies === 'Y' ? 0 : ''
                        )
                      }
                    }}
                  >
                    <option value="">Select Addon</option>
                    {availableAddons.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                  {idError && (touchedArray?.id ?? true) && (
                    <div className="invalid-feedback">{idError}</div>
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

                {/* Custom Price */}
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
                        name={`${name}[${index}].custom_price`}
                        value={addon.custom_price}
                        min={0}
                        step={0.01}
                        placeholder="Custom Price"
                        className={clsx('form-control', {
                          'is-invalid':
                            priceError && (touchedArray?.custom_price ?? true),
                        })}
                        onChange={(e) =>
                          setFieldValue(
                            `${name}[${index}].custom_price`,
                            e.target.value
                          )
                        }
                        onBlur={() =>
                          setFieldTouched(
                            `${name}[${index}].custom_price`,
                            false
                          )
                        }
                      />
                      {priceError && (touchedArray?.custom_price ?? true) && (
                        <div className="invalid-feedback">{priceError}</div>
                      )}
                    </>
                  )}
                </div>

                {/* Remove Button */}
                <div className="col-md-2">
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => {
                      // save removed addon locally before removing from form
                      setRemovedAddons((prev) => [...prev, addons[index]])
                      arrayHelpers.remove(index)

                      setFieldTouched(`${name}[${index}].id`, false)
                      setFieldTouched(`${name}[${index}].custom_price`, false)
                    }}
                  >
                    &times;
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    />
  )
}
