import React, { FC, useState } from 'react'
import * as Yup from 'yup'
import { Formik } from 'formik'
import clsx from 'clsx'
import { CategorySelect } from '@@@/selects/CategorySelect'
import { SupplierSelect } from '@@@/selects/SupplierSelect'
import { useProduct } from '@@/products/core/_request'
import { ImageUploader } from '@@@/uploader/ImageUploader'
import { AddonsFieldArray } from '@@@/AddonsFieldArray'

interface Option {
  id: string | number
  name: string
}

interface Addon {
  id: number
  base_price: any | ''
  custom_price: any | ''
}

interface CreateProductModalProps {
  categories?: Option[]
  suppliers?: Option[]
  setPage?: (values: number) => void
  setRefreshTable?: (value: boolean) => void
  onSubmit?: (values: any) => void
}

const Schema = Yup.object().shape({
  sku: Yup.string().min(1).max(50).required('SKU is required'),
  name: Yup.string().min(1).max(50).required('Product name is required'),
  description: Yup.string().min(1).required('Description is required'),
  category_id: Yup.string().required('Category is required'),
  supplier_id: Yup.string().required('Supplier is required'),
  quantity_on_hand: Yup.number().required('Quantity is required').min(1),
  reorder_point: Yup.number().required('Reorder point is required').min(1),
  cost_price: Yup.number().required('Cost price is required').min(1),
  selling_price: Yup.number().required('Selling price is required').min(1),
  images: Yup.mixed()
    .test('required', 'Image is required', (value) => {
      return Array.isArray(value) && value.length > 0
    }),
  addons: Yup.array().of(
    Yup.object().shape({
      id: Yup.number().required('Addon name is required'),
      base_price: Yup.number()
        .typeError('Base price must be a number')
        .required('Base price is required')
        .min(0, 'Base price cannot be negative'),
      custom_price: Yup.number()
        .typeError('Custom price must be a number')
        .min(0, 'Custom price cannot be negative')
        .test(
          'custom-vs-base',
          'Custom price cannot be less than base price',
         function (value) {
            const { base_price } = this.parent
            if (value === undefined || value === null) return true;
            return value >= base_price;
          }
        ),
    })
  ),
})

const CreateProductModal: FC<CreateProductModalProps> = ({
  setPage,
  setRefreshTable,
  onSubmit,
}) => {
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const { createProduct } = useProduct()

  return (
    <Formik
      initialValues={{
        sku: '',
        name: '',
        description: '',
        category_id: '',
        supplier_id: '',
        quantity_on_hand: '',
        reorder_point: '',
        cost_price: '',
        selling_price: '',
        images: [] as File[],
        addons: [] as Addon[],
      }}
      validationSchema={Schema}
      onSubmit={async (values, { resetForm }) => {
        await createProduct(values, resetForm, setRefreshTable, setPage)
        onSubmit?.(values)
      }}
    >
      {(formik) => (
        <form noValidate onSubmit={formik.handleSubmit}>
          <div className="row">
              <div className="col-md-6">
                <div className="row">
                    <div className="col-md-12 mb-3">
                      <ImageUploader
                        name="images"
                        formik={formik}
                        previews={imagePreviews}
                        setPreviews={setImagePreviews}
                        label="Product Images"
                        maxFiles={1}
                      />
                    </div>

                    {/* SKU */}
                    <div className="col-md-12 mb-3">
                      <label className="form-label">SKU</label>
                      <input
                        type="text"
                        className={clsx('form-control', {
                          'is-invalid': formik.touched.sku && formik.errors.sku,
                        })}
                        {...formik.getFieldProps('sku')}
                      />
                      {formik.touched.sku && formik.errors.sku && (
                        <div className="invalid-feedback">{formik.errors.sku}</div>
                      )}
                    </div>

                    {/* Name */}
                    <div className="col-md-12 mb-3">
                      <label className="form-label">Product Name</label>
                      <input
                        type="text"
                        className={clsx('form-control', {
                          'is-invalid': formik.touched.name && formik.errors.name,
                        })}
                        {...formik.getFieldProps('name')}
                      />
                      {formik.touched.name && formik.errors.name && (
                        <div className="invalid-feedback">{formik.errors.name}</div>
                      )}
                    </div>

                    {/* Description */}
                    <div className="col-md-12 mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        className={clsx('form-control', {
                          'is-invalid': formik.touched.description && formik.errors.description,
                        })}
                        rows={4}
                        {...formik.getFieldProps('description')}
                      />
                      {formik.touched.description && formik.errors.description && (
                        <div className="invalid-feedback">{formik.errors.description}</div>
                      )}
                    </div>

                    {/* Category */}
                    <div className="col-md-6">
                      <CategorySelect
                        setClass="mb-3"
                        name="category_id"
                        value={formik.values.category_id}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.errors.category_id}
                        touched={formik.touched.category_id}
                      />
                      {formik.touched.category_id && formik.errors.category_id && (
                        <div className="invalid-feedback">{formik.errors.category_id}</div>
                      )}
                    </div>

                    {/* Supplier */}
                    <div className="col-md-6 mb-3">
                      <SupplierSelect
                        setClass="mb-3"
                        name="supplier_id"
                        value={formik.values.supplier_id}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.errors.supplier_id}
                        touched={formik.touched.supplier_id}
                      />
                      {formik.touched.supplier_id && formik.errors.supplier_id && (
                        <div className="invalid-feedback">{formik.errors.supplier_id}</div>
                      )}
                    </div>

                    {/* Quantity on Hand */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Quantity on Hand</label>
                      <input
                        type="number"
                        className={clsx('form-control', {
                          'is-invalid': formik.touched.quantity_on_hand && formik.errors.quantity_on_hand,
                        })}
                        {...formik.getFieldProps('quantity_on_hand')}
                      />
                      {formik.touched.quantity_on_hand && formik.errors.quantity_on_hand && (
                        <div className="invalid-feedback">{formik.errors.quantity_on_hand}</div>
                      )}
                    </div>

                    {/* Reorder Point */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Reorder Point</label>
                      <input
                        type="number"
                        className={clsx('form-control', {
                          'is-invalid': formik.touched.reorder_point && formik.errors.reorder_point,
                        })}
                        {...formik.getFieldProps('reorder_point')}
                      />
                      {formik.touched.reorder_point && formik.errors.reorder_point && (
                        <div className="invalid-feedback">{formik.errors.reorder_point}</div>
                      )}
                    </div>

                    {/* Cost Price */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Cost Price</label>
                      <input
                        type="number"
                        className={clsx('form-control', {
                          'is-invalid': formik.touched.cost_price && formik.errors.cost_price,
                        })}
                        {...formik.getFieldProps('cost_price')}
                      />
                      {formik.touched.cost_price && formik.errors.cost_price && (
                        <div className="invalid-feedback">{formik.errors.cost_price}</div>
                      )}
                    </div>

                    {/* Selling Price */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Selling Price</label>
                      <input
                        type="number"
                        className={clsx('form-control', {
                          'is-invalid': formik.touched.selling_price && formik.errors.selling_price,
                        })}
                        {...formik.getFieldProps('selling_price')}
                      />
                      {formik.touched.selling_price && formik.errors.selling_price && (
                        <div className="invalid-feedback">{formik.errors.selling_price}</div>
                      )}
                    </div>
                </div>
              </div>
              <div className="col-md-6 mb-4">
                  <div className="col-md-12 mb-4">
                    {/* Dynamic Addons Section */}
                    <div className="col-md-12 mb-4">
                      <h5>Addons</h5>
                      <AddonsFieldArray name="addons" />
                    </div>
                  </div>
              </div>
          </div>

          <div className="d-flex justify-content-end mt-4">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
      )}
    </Formik>
  )
}

export { CreateProductModal }
