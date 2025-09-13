import { FieldArray } from 'formik'
import { ImageUploader } from '@@@/uploader/ImageUploader'
import { useState, useEffect } from 'react'

interface VariantsFieldArrayProps {
  name: string
  initialPreviews?: string[][]
}

export const VariantsFieldArray = ({ name, initialPreviews = [] }: VariantsFieldArrayProps) => {
  const [variantPreviews, setVariantPreviews] = useState<string[][]>([])

  useEffect(() => {
    if (initialPreviews.length > 0) {
      setVariantPreviews(initialPreviews)
    }
  }, [initialPreviews])

  return (
    <FieldArray
      name={name}
      render={(arrayHelpers) => (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5>Variants</h5>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                arrayHelpers.push({
                  sku: '',
                  variant_name: '',
                  quantity_on_hand: 0,
                  reorder_point: '',
                  cost_price: '',
                  selling_price: '',
                  image: [] as File[],
                })
                setVariantPreviews((prev) => [...prev, []]) // add empty previews slot
              }}
            >
              Add Variant
            </button>
          </div>

          {arrayHelpers.form.values[name].length === 0 && (
            <div className="mb-3 text-muted">No variant added yet.</div>
          )}

          <div className="row">
            {arrayHelpers.form.values[name].map((variant: any, index: number) => (
              <div key={index} className="col-md-3 mb-4">
                <div className="border rounded p-3 mb-3">
                  {/* Image Uploader */}
                  <ImageUploader
                    name={`${name}[${index}].image`}
                    formik={arrayHelpers.form}
                    previews={variantPreviews[index] || []}
                    setPreviews={(newPrevs) => {
                      const updated = [...variantPreviews]
                      updated[index] = newPrevs
                      setVariantPreviews(updated)
                    }}
                    label="Variant Image"
                    maxFiles={1}
                  />

                  {/* SKU */}
                  <label className="form-label required">Variant SKU</label>
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Variant SKU"
                    {...arrayHelpers.form.getFieldProps(`${name}[${index}].sku`)}
                  />

                  {/* Variant Name */}
                   <label className="form-label required">Variant Name</label>
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Variant Name"
                    {...arrayHelpers.form.getFieldProps(`${name}[${index}].variant_name`)}
                  />

                  {/* Quantity */}
                    <label className="form-label required">Quantity</label>
                  <input
                    type="number"
                    className="form-control mb-2"
                    placeholder="Quantity on Hand"
                    {...arrayHelpers.form.getFieldProps(`${name}[${index}].quantity_on_hand`)}
                  />

                  {/* Reorder Point */}
                    <label className="form-label required">Reorder Point</label>
                  <input
                    type="number"
                    className="form-control mb-2"
                    placeholder="Reorder Point"
                    {...arrayHelpers.form.getFieldProps(`${name}[${index}].reorder_point`)}
                  />

                  {/* Cost Price */}
                  <label className="form-label required">Cost Price </label>
                  <input
                    type="number"
                    className="form-control mb-2"
                    placeholder="Cost Price"
                    {...arrayHelpers.form.getFieldProps(`${name}[${index}].cost_price`)}
                  />

                  {/* Selling Price */}
                   <label className="form-label required">Selling Price </label>
                  <input
                    type="number"
                    className="form-control mb-2"
                    placeholder="Selling Price"
                    {...arrayHelpers.form.getFieldProps(`${name}[${index}].selling_price`)}
                  />

                  {/* Remove Button */}
                  <button
                    type="button"
                    className="btn btn-sm btn-danger mt-2"
                    onClick={() => {
                      arrayHelpers.remove(index)
                      setVariantPreviews((prev) => prev.filter((_, i) => i !== index))
                    }}
                  >
                    Remove Variant
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    />
  )
}
