import { FieldArray } from 'formik'
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'
import { useState, useEffect } from 'react'
import clsx from 'clsx'
import { SingleImageUploader } from '@@@/uploader/SingleImageUploader'
import { toAbsoluteUrl } from '@/helpers'

interface VariantsFieldArrayProps {
  name: string
  errors: any
  touched: any
  onBlur?: (data: any) => void
  onChange?: (data: any) => void
  setFieldValue?: any
  setFieldTouched?: any
  initialPreviews?: string[][]
}

export const VariantsFieldArray = ({
  name,
  errors,
  touched,
  onBlur,
  onChange,
  setFieldValue,
  setFieldTouched,
  initialPreviews = []
}: VariantsFieldArrayProps) => {
  const [variantPreviews, setVariantPreviews] = useState<string[][]>([])
  const [removedVariants, setRemovedVariants] = useState<any[]>([]) // ✅ Store removed variants for retrieval

  useEffect(() => {
    if (initialPreviews.length > 0) {
      setVariantPreviews(initialPreviews.map(inner => inner.filter(Boolean)))
    }
  }, [initialPreviews])

  return (
    <FieldArray
      name={name}
      render={(arrayHelpers) => (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5>Variants</h5>

            <div className="d-flex gap-2">
              {/* ➕ Add Variant */}
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  arrayHelpers.push({
                    id: '',
                    sku: '',
                    variant_name: '',
                    quantity_on_hand: '',
                    reorder_point: '',
                    cost_price: '',
                    selling_price: '',
                    image: null,
                    image_preview: null
                  })
                  setVariantPreviews(prev => [...prev, []])
                }}
              >
                Add Variant
              </button>

              {/* 🔄 Retrieve Existing */}
              {removedVariants.filter(v => v.id).length > 0 && (
                <button
                  type="button"
                  className="btn btn-outline-primary d-inline-flex align-items-center"
                  id="tooltip-retrieve-variants"
                  onClick={() => {
                    const toRetrieve = removedVariants.filter(v => v.id)
                    toRetrieve.forEach(v => arrayHelpers.push(v))
                    setRemovedVariants(prev => prev.filter(v => !v.id)) // remove retrieved ones
                  }}
                >
                  <i className="bi bi-arrow-counterclockwise fs-5"></i>
                  <Tooltip
                    anchorId="tooltip-retrieve-variants"
                    place="top"
                    content={`Retrieve Existing (${removedVariants.filter(v => v.id).length})`}
                  />
                </button>
              )}
            </div>
          </div>

          {arrayHelpers.form.values[name].length === 0 && (
            <div className="alert alert-secondary text-center rounded-3 py-4 shadow-sm">
              <i className="bi bi-plus-circle fs-3 d-block mb-2 text-muted"></i>
              <span className="fw-semibold text-muted">No variant added yet.</span>
            </div>
          )}

          <div className="row">
            {arrayHelpers.form.values[name].map((variant: any, index: number) => {
              const quantityKey = `variants[${index}].quantity_on_hand`
              const skuKey = `variants[${index}].sku`
              const variantNameKey = `variants[${index}].variant_name`
              const imageKey = `variants[${index}].image`

              const quantityError = (errors as any)[quantityKey]
              const skuError = (errors as any)[skuKey]
              const variantNameError = (errors as any)[variantNameKey]
              const imageError = (errors as any)[imageKey]

              const touchedArray =
                typeof touched.variants !== 'undefined'
                  ? (touched.variants as any)[index]
                  : touched

              return (
                <div key={index} className="col-md-3 mb-4">
                  <div className="border rounded p-3 mb-3">
                    <SingleImageUploader
                      name={`variants.${index}.image`}
                      formik={arrayHelpers.form}
                      preview={typeof variant.image_preview === 'string' ? variant.image_preview : null}
                      setPreview={(newPreview) => {
                        const newVariants = [...arrayHelpers.form.values.variants]
                        newVariants[index].image_preview = newPreview
                        arrayHelpers.form.setFieldValue(
                          `variants.${index}.image_preview`,
                          newPreview
                        )
                      }}
                      label="Variant Image"
                    />
                    {imageError && (touchedArray?.image ?? true) && (
                      <div className="text-danger">{imageError}</div>
                    )}

                    <label className="form-label required">Variant SKU</label>
                    <input
                      type="text"
                      className={clsx('form-control mb-2', {
                        'is-invalid': skuError && (touchedArray?.sku ?? true)
                      })}
                      placeholder="Variant SKU"
                      {...arrayHelpers.form.getFieldProps(skuKey)}
                      onBlur={() => setFieldTouched(skuKey, false)}
                    />

                    <label className="form-label required">Variant Name</label>
                    <input
                      type="text"
                      className={clsx('form-control mb-2', {
                        'is-invalid': variantNameError && (touchedArray?.variant_name ?? true)
                      })}
                      placeholder="Variant Name"
                      {...arrayHelpers.form.getFieldProps(variantNameKey)}
                      onBlur={() => setFieldTouched(variantNameKey, false)}
                    />

                    <label className="form-label required">Quantity</label>
                    <input
                      type="number"
                      className={clsx('form-control mb-2', {
                        'is-invalid': quantityError && (touchedArray?.quantity_on_hand ?? true)
                      })}
                      placeholder="Quantity on Hand"
                      {...arrayHelpers.form.getFieldProps(quantityKey)}
                      onBlur={() => setFieldTouched(quantityKey, false)}
                    />

                    <label className="form-label">
                      Reorder Point (optional)
                      <span
                        id={`tooltip-reorders-${index}`}
                        className="ms-2 cursor-pointer text-primary"
                      >
                        ℹ️
                      </span>
                      <Tooltip
                        anchorId={`tooltip-reorders-${index}`}
                        place="right"
                        content="If Reorder point is 0 or empty, the main product re order points will be used."
                      />
                    </label>
                    <input
                      type="number"
                      className="form-control mb-2"
                      placeholder="Reorder Point"
                      {...arrayHelpers.form.getFieldProps(`${name}[${index}].reorder_point`)}
                    />

                    <label className="form-label">
                      Cost Price (optional)
                      <span
                        id={`tooltip-cost-${index}`}
                        className="ms-2 cursor-pointer text-primary"
                      >
                        ℹ️
                      </span>
                      <Tooltip
                        anchorId={`tooltip-cost-${index}`}
                        place="right"
                        content="If Cost Price is 0 or empty, the main product price will be used."
                      />
                    </label>
                    <input
                      type="number"
                      className="form-control mb-2"
                      placeholder="Cost Price"
                      {...arrayHelpers.form.getFieldProps(`${name}[${index}].cost_price`)}
                    />

                    <label className="form-label">
                      Selling Price (optional)
                      <span
                        id={`tooltip-selling-${index}`}
                        className="ms-2 cursor-pointer text-primary"
                      >
                        ℹ️
                      </span>
                      <Tooltip
                        anchorId={`tooltip-selling-${index}`}
                        place="right"
                        content="If Selling Price is 0 or empty, the main product price will be used."
                      />
                    </label>
                    <input
                      type="number"
                      className="form-control mb-2"
                      placeholder="Selling Price"
                      {...arrayHelpers.form.getFieldProps(`${name}[${index}].selling_price`)}
                    />

                    <button
                      type="button"
                      className="btn btn-sm btn-danger mt-2"
                      onClick={() => {
                        // ✅ Keep existing variants (with id) for retrieval
                        if (variant.id) {
                          setRemovedVariants(prev => [...prev, variant])
                        }

                        arrayHelpers.remove(index)
                        setVariantPreviews(prev => prev.filter((_, i) => i !== index))

                        setFieldTouched(skuKey, false)
                        setFieldTouched(variantNameKey, false)
                        setFieldTouched(imageKey, false)
                        setFieldTouched(quantityKey, false)
                      }}
                    >
                      Remove Variant
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    />
  )
}
