// VariantsFieldArray.tsx
import { FieldArray } from 'formik'

import { useState, useEffect } from 'react'
import { ImageUploader } from './uploader/ImageUploader'

interface VariantsFieldArrayProps {
  name: string
  initialPreviews?: string[][]
}

export const VariantsFieldArray = ({ name, initialPreviews = [] }: VariantsFieldArrayProps) => {
  const [variantPreviews, setVariantPreviews] = useState<string[][]>([])

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
                setVariantPreviews(prev => [...prev, []])
              }}
            >
              Add Variant
            </button>
          </div>

          {arrayHelpers.form.values[name].length === 0 && (
            <div className="alert alert-secondary text-center rounded-3 py-4 shadow-sm">
              <i className="bi bi-plus-circle fs-3 d-block mb-2 text-muted"></i>
              <span className="fw-semibold text-muted">No variant added yet.</span>
            </div>
          )}

          <div className="row">
            {arrayHelpers.form.values[name].map((variant: any, index: number) => (
              <div key={index} className="col-md-3 mb-4">
                <div className="border rounded p-3 mb-3">
                  <ImageUploader
                    name={`${name}[${index}].image`}
                    formik={arrayHelpers.form}
                    previews={variantPreviews[index] || []}
                    setPreviews={(newPrevs:any) => {
                      setVariantPreviews(prev => {
                        const updated = [...prev]
                        updated[index] = newPrevs.filter(Boolean)
                        return updated
                      })
                    }}
                    label="Variant Image"
                    maxFiles={1}
                  />

                  <label className="form-label required">Variant SKU</label>
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Variant SKU"
                    {...arrayHelpers.form.getFieldProps(`${name}[${index}].sku`)}
                  />

                  <label className="form-label required">Variant Name</label>
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Variant Name"
                    {...arrayHelpers.form.getFieldProps(`${name}[${index}].variant_name`)}
                  />

                  <label className="form-label required">Quantity</label>
                  <input
                    type="number"
                    className="form-control mb-2"
                    placeholder="Quantity on Hand"
                    {...arrayHelpers.form.getFieldProps(`${name}[${index}].quantity_on_hand`)}
                  />

                  <label className="form-label required">Reorder Point</label>
                  <input
                    type="number"
                    className="form-control mb-2"
                    placeholder="Reorder Point"
                    {...arrayHelpers.form.getFieldProps(`${name}[${index}].reorder_point`)}
                  />

                  <label className="form-label required">Cost Price</label>
                  <input
                    type="number"
                    className="form-control mb-2"
                    placeholder="Cost Price"
                    {...arrayHelpers.form.getFieldProps(`${name}[${index}].cost_price`)}
                  />

                  <label className="form-label required">Selling Price</label>
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
                      arrayHelpers.remove(index)
                      setVariantPreviews(prev => prev.filter((_, i) => i !== index))
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
