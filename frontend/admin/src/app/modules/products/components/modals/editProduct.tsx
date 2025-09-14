import React, { FC, useState } from 'react'
import * as Yup from 'yup'
import { Formik } from 'formik'
import clsx from 'clsx'
import { CategorySelect } from '@@@/selects/CategorySelect'
import { SupplierSelect } from '@@@/selects/SupplierSelect'
import { useProduct } from '@@/products/core/_request'
import { ImageUploader } from '@@@/uploader/ImageUploader'
import { AddonsFieldArray } from '@@@/AddonsFieldArray'
import { VariantsFieldArray } from '@@@/VariantFieldArray'
import { BrandSelect } from '@@@/selects/BrandSelect'

interface EditProductModalProps {
  productID: any
  data: any
  setRefreshTable?: (value: boolean) => void
  onSubmit?: (values: any) => void
}

const steps = [
  { label: 'Basic Info' },
  { label: 'Inventory & Pricing' },
  { label: 'Images' },
  { label: 'Addons' },
  { label: 'Variants' },
]

// split validation per step
const StepSchemas = [
  Yup.object().shape({
    sku: Yup.string().min(1).max(50).required('SKU is required'),
    name: Yup.string().min(1).max(50).required('Product name is required'),
    description: Yup.string().min(1).required('Description is required'),
    brand_id: Yup.string().required('Brand is required'),
    category_id: Yup.string().required('Category is required'),
    supplier_id: Yup.string().required('Supplier is required'),
  }),
  Yup.object().shape({
    add_new_stocks: Yup.number().min(0),
    reorder_point: Yup.number().required('Reorder point is required').min(0),
    cost_price: Yup.number().required('Cost price is required').min(0),
    selling_price: Yup.number().required('Selling price is required').min(0),
  }),
  Yup.object().shape({
    images: Yup.mixed().test('images', 'At least one image required', function (value) {
      const previews = (this.options.context as any)?.imagePreviews
      return (
        (Array.isArray(value) && value.length > 0) ||
        (previews && previews.length > 0)
      )
    }),
  }),
  Yup.object().shape({
    addons: Yup.array().of(
      Yup.object().shape({
        id: Yup.number().required('Addon name is required'),
        base_price: Yup.number().typeError('Base price must be a number')
          .required('Base price is required')
          .min(0, 'Base price cannot be negative'),
        custom_price: Yup.number().typeError('Custom price must be a number')
          .min(0, 'Custom price cannot be negative')
          .test('custom-vs-base', 'Custom price cannot be less than base price', function (value) {
            const { base_price } = this.parent
            if (value === undefined || value === null) return true
            return value >= base_price
          }),
      })
    ),
  }),
  Yup.object().shape({
    variants: Yup.array().of(
      Yup.object().shape({
        sku: Yup.string().required('Variant SKU is required'),
        variant_name: Yup.string().required('Variant name is required'),
        quantity_on_hand: Yup.number().required().min(0),
        reorder_point: Yup.number().nullable(),
        cost_price: Yup.number().nullable(),
        selling_price: Yup.number().nullable(),
        image: Yup.mixed().required('Variant image is required'),
      })
    ),
  }),
]

const EditProductModal: FC<EditProductModalProps> = ({
  productID,
  data,
  setRefreshTable,
  onSubmit,
}) => {
  const [step, setStep] = useState(1)
  const [imagePreviews, setImagePreviews] = useState<string[]>(
    data?.images?.map((img: any) => img.image_cover) || []
  )

  const { updateProduct } = useProduct()

  const nextStep = async (formikValues: any, validateForm: any) => {
    const errors = await validateForm()
    if (Object.keys(errors).length > 0) return
    setStep((prev) => Math.min(prev + 1, steps.length))
  }

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1))

  return (
    <Formik
      initialValues={{
        sku: data.sku,
        name: data.name,
        description: data.description,
        category_id: data.category_id,
        brand_id: data.brand_id,
        supplier_id: data.supplier_id,
        quantity_on_hand: data.quantity_on_hand,
        add_new_stocks: 0,
        reorder_point: data.reorder_point,
        cost_price: data.cost_price,
        selling_price: data.selling_price,
        images: [],
        addons:
          data.product_addons?.map((addon: any) => ({
            id: addon.addon_id,
            base_price: addon.base_price ?? '',
            custom_price: addon.custom_price ?? '',
          })) || [],
        variants:
          data.variants?.map((variant: any) => ({
            id: variant.variant_id,
            sku: variant.sku ?? '',
            variant_name: variant.variant_name ?? '',
            quantity_on_hand: variant.quantity_on_hand ?? '',
            reorder_point: variant.reorder_point ?? '',
            cost_price: variant.cost_price ?? '',
            selling_price: variant.selling_price ?? '',
            image: variant.image ?? '',
          })) || [],
      }}
      validationSchema={Yup.object()}
      validateOnChange={false}
      validateOnBlur={true}
      onSubmit={async (values, { resetForm }) => {
        await updateProduct(values, productID, setRefreshTable)
        onSubmit?.(values)
      }}
      context={{ imagePreviews }}
    >
      {(formik) => (
        <form noValidate onSubmit={formik.handleSubmit}>
          {/* Step Header */}
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              {steps.map((s, index) => (
                <div
                  key={index}
                  className={`flex-fill text-center ${step === index + 1 ? 'fw-bold text-primary' : 'text-muted'}`}
                >
                  {s.label}
                </div>
              ))}
            </div>
            <div className="progress" style={{ height: '6px' }}>
              <div
                className="progress-bar bg-primary"
                role="progressbar"
                style={{ width: `${(step / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Step Content */}
          {step === 1 && (
            <div className="row">
              {/* SKU */}
              <div className="col-md-12 mb-3">
                <label className="form-label required">SKU</label>
                <input
                  type="text"
                  className={clsx('form-control ', { 'is-invalid': formik.touched.sku && formik.errors.sku })}
                  {...formik.getFieldProps('sku')}
                />
                {formik.touched.sku && typeof formik.errors.sku === 'string' && (
                            <div className='invalid-feedback'>{formik.errors.sku}</div>
                )}
              </div>

              {/* Name */}
              <div className="col-md-12 mb-3">
                <label className="form-label required">Product Name</label>
                <input
                  type="text"
                  className={clsx('form-control', { 'is-invalid': formik.touched.name && formik.errors.name })}
                  {...formik.getFieldProps('name')}
                />
                {formik.touched.name && typeof formik.errors.name === 'string' && (
                            <div className='invalid-feedback'>{formik.errors.name}</div>
                )}
              </div>

              {/* Description */}
              <div className="col-md-12 mb-3">
                <label className="form-label required">Description</label>
                <textarea
                  className={clsx('form-control', { 'is-invalid': formik.touched.description && formik.errors.description })}
                  rows={4}
                  {...formik.getFieldProps('description')}
                />
                {formik.touched.description && typeof formik.errors.description === 'string' && (
                    <div className='invalid-feedback'>{formik.errors.description}</div>
                )}
              </div>
               <div className="col-md-6">
                <BrandSelect
                  setClass="mb-3"
                  name="brand_id"
                  value={formik.values.brand_id}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                      !!formik.errors.brand_id && typeof formik.errors.brand_id === 'string'
                      ? formik.errors.brand_id
                      : undefined
                  }
                  touched={!!formik.touched.brand_id}
                  />
                  {formik.touched.brand_id && typeof formik.errors.brand_id === 'string' && (
                      <div className='invalid-feedback'>{formik.errors.brand_id}</div>
                  )}
              </div>

              <div className="col-md-6">
                <CategorySelect
                    setClass="mb-3"
                    name="category_id"
                    value={formik.values.category_id}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                        !!formik.errors.category_id && typeof formik.errors.category_id === 'string'
                        ? formik.errors.category_id
                        : undefined
                    }
                    touched={!!formik.touched.category_id}
                    />
                    {formik.touched.category_id && typeof formik.errors.category_id === 'string' && (
                        <div className='invalid-feedback'>{formik.errors.category_id}</div>
                    )}
              </div>
              <div className="col-md-6 mb-3">
                <SupplierSelect
                setClass="mb-3"
                name="supplier_id"
                value={formik.values.supplier_id}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                    !!formik.errors.supplier_id && typeof formik.errors.supplier_id === 'string'
                    ? formik.errors.supplier_id
                    : undefined
                }
                touched={!!formik.touched.supplier_id}
                />
                {formik.touched.supplier_id && typeof formik.errors.supplier_id === 'string' && (
                    <div className='invalid-feedback'>{formik.errors.supplier_id}</div>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Quantity on Hand</label>
                <input type="number" className="form-control" {...formik.getFieldProps('quantity_on_hand')} readOnly />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Add New Stocks</label>
                <input
                  type="number"
                  className={clsx('form-control', {
                    'is-invalid': formik.touched.add_new_stocks && formik.errors.add_new_stocks,
                  })}
                  {...formik.getFieldProps('add_new_stocks')}
                />
              </div>
              <div className="col-md-12 mb-3">
                <label className="form-label">Reorder Point</label>
                <input
                  type="number"
                  className={clsx('form-control', { 'is-invalid': formik.touched.reorder_point && formik.errors.reorder_point })}
                  {...formik.getFieldProps('reorder_point')}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Cost Price</label>
                <input
                  type="number"
                  className={clsx('form-control', { 'is-invalid': formik.touched.cost_price && formik.errors.cost_price })}
                  {...formik.getFieldProps('cost_price')}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Selling Price</label>
                <input
                  type="number"
                  className={clsx('form-control', { 'is-invalid': formik.touched.selling_price && formik.errors.selling_price })}
                  {...formik.getFieldProps('selling_price')}
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <ImageUploader
              name="images"
              formik={formik}
              previews={imagePreviews}
              setPreviews={setImagePreviews}
              label="Product Images"
              maxFiles={5}
              getPrimaryIndex={data?.primary_index ?? 0}
            />
          )}

          {step === 4 && <AddonsFieldArray name="addons" />}

          {step === 5 && (
            <VariantsFieldArray
              name="variants"
              initialPreviews={data.variants?.map((v: any) => [v.image]) || []}
            />
          )}

          {/* Navigation */}
          <div className="d-flex justify-content-between mt-4">
            {step > 1 && (
              <button type="button" className="btn btn-light" onClick={prevStep}>
                Back
              </button>
            )}
            {step < steps.length ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={async () => {
                  try {
                    await StepSchemas[step - 1].validate(formik.values, {
                      abortEarly: false,
                      context: { imagePreviews },
                    })
                    nextStep(formik.values, formik.validateForm)
                  } catch (err: any) {
                    const errors: any = {}
                    err.inner.forEach((e: any) => {
                      errors[e.path] = e.message
                    })
                    formik.setErrors(errors)
                  }
                }}
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-success"
                onClick={async () => {
                  try {
                    await StepSchemas[step - 1].validate(formik.values, {
                      abortEarly: false,
                      context: { imagePreviews },
                    })
                    formik.handleSubmit()
                  } catch (err: any) {
                    const errors: any = {}
                    err.inner.forEach((e: any) => {
                      errors[e.path] = e.message
                    })
                    formik.setErrors(errors)
                  }
                }}
              >
                Submit
              </button>
            )}
          </div>
        </form>
      )}
    </Formik>
  )
}

export { EditProductModal }
