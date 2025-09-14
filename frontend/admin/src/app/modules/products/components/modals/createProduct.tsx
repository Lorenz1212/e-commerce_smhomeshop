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

interface Option { id: string | number; name: string }

interface Addon { id: number; base_price: any | ''; custom_price: any | '' }

interface CreateProductModalProps {
  categories?: Option[]
  brands?: Option[]
  suppliers?: Option[]
  setPage?: (values: number) => void
  setRefreshTable?: (value: boolean) => void
  onSubmit?: (values: any) => void
}

// Split validation by step
const StepSchemas = [
  // Step 1: Basic Info
  Yup.object().shape({
    sku: Yup.string().min(1).max(50).required('SKU is required'),
    name: Yup.string().min(1).max(50).required('Product name is required'),
    description: Yup.string().min(1).required('Description is required'),
    brand_id: Yup.string().required('Product Brand is required'),
    category_id: Yup.string().required('Category is required'),
    supplier_id: Yup.string().required('Supplier is required'),
  }),
  // Step 2: Inventory & Pricing
  Yup.object().shape({
    quantity_on_hand: Yup.number().required('Quantity is required').min(1),
    reorder_point: Yup.number().required('Reorder point is required').min(0),
    cost_price: Yup.number().required('Cost price is required').min(0),
    selling_price: Yup.number().required('Selling price is required').min(0),
  }),
  // Step 3: Images
  Yup.object().shape({
    images: Yup.array()
      .of(Yup.mixed())
      .min(1, 'At least one image is required'),
  }),
  // Step 4: Addons
  Yup.object().shape({
    addons: Yup.array().of(
      Yup.object().shape({
        id: Yup.number().required('Addon is required'),
        base_price: Yup.number()
          .typeError('Base price must be a number')
          .required('Base price is required')
          .min(0, 'Cannot be negative'),
        custom_price: Yup.number()
          .typeError('Custom price must be a number')
          .min(0, 'Cannot be negative')
          .test('custom-vs-base', 'Custom price cannot be less than base price', function (value) {
            const { base_price } = this.parent
            if (value === undefined || value === null) return true
            return value >= base_price
          }),
      })
    ),
  }),
  // Step 5: Variants
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

const steps = [
  { label: 'Basic Info' },
  { label: 'Inventory & Pricing' },
  { label: 'Images' },
  { label: 'Addons' },
  { label: 'Variants' },
]

const CreateProductModal: FC<CreateProductModalProps> = ({ setPage, setRefreshTable, onSubmit }) => {
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [step, setStep] = useState(1)
  const { createProduct } = useProduct()

  const nextStep = async (formikValues: any, validateForm: any) => {
    const errors = await validateForm()
    if (Object.keys(errors).length > 0) return // prevent step change if errors
    setStep(prev => Math.min(prev + 1, steps.length))
  }

  const prevStep = () => setStep(prev => Math.max(prev - 1, 1))

  return (
    <Formik
      initialValues={{
        sku: '',
        name: '',
        description: '',
        brand_id: '',
        category_id: '',
        supplier_id: '',
        quantity_on_hand: '',
        reorder_point: '',
        cost_price: '',
        selling_price: '',
        images: [] as File[],
        primary_index: 0,
        addons: [] as Addon[],
        variants: [] as any[],
      }}
      validationSchema={Yup.object()} // overall schema not needed since per-step
      onSubmit={async (values, { resetForm }) => {
        await createProduct(values, resetForm, setRefreshTable, setPage)
        onSubmit?.(values)
      }}
    >
      {(formik) => (
        <form noValidate onSubmit={formik.handleSubmit}>
          {/* Step Header */}
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              {steps.map((s, index) => (
                <div key={index} className={`flex-fill text-center ${step === index + 1 ? 'fw-bold text-primary' : 'text-muted'}`}>
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
              <div className="col-md-12 mb-3">
                <label className="form-label required">SKU</label>
                <input
                  type="text"
                  className={clsx('form-control', { 'is-invalid': formik.touched.sku && formik.errors.sku })}
                  {...formik.getFieldProps('sku')}
                />
                {formik.touched.sku && formik.errors.sku && <div className="invalid-feedback">{formik.errors.sku}</div>}
              </div>
              <div className="col-md-12 mb-3">
                <label className="form-label required">Product Name</label>
                <input
                  type="text"
                  className={clsx('form-control', { 'is-invalid': formik.touched.name && formik.errors.name })}
                  {...formik.getFieldProps('name')}
                />
                {formik.touched.name && formik.errors.name && <div className="invalid-feedback">{formik.errors.name}</div>}
              </div>
              <div className="col-md-12 mb-3">
                <label className="form-label required">Description</label>
                <textarea
                  className={clsx('form-control', { 'is-invalid': formik.touched.description && formik.errors.description })}
                  rows={4}
                  {...formik.getFieldProps('description')}
                />
                {formik.touched.description && formik.errors.description && <div className="invalid-feedback">{formik.errors.description}</div>}
              </div>
              <div className="col-md-6">
                <BrandSelect
                  setClass="mb-3"
                  name="brand_id"
                  value={formik.values.brand_id}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.errors.brand_id}
                  touched={formik.touched.brand_id}
                />
              </div>
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
              </div>
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
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label required">Quantity on Hand</label>
                <input
                  type="number"
                  className={clsx('form-control', { 'is-invalid': formik.touched.quantity_on_hand && formik.errors.quantity_on_hand })}
                  {...formik.getFieldProps('quantity_on_hand')}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label required">Reorder Point</label>
                <input
                  type="number"
                  className={clsx('form-control', { 'is-invalid': formik.touched.reorder_point && formik.errors.reorder_point })}
                  {...formik.getFieldProps('reorder_point')}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label required">Cost Price</label>
                <input
                  type="number"
                  className={clsx('form-control', { 'is-invalid': formik.touched.cost_price && formik.errors.cost_price })}
                  {...formik.getFieldProps('cost_price')}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label required">Selling Price</label>
                <input
                  type="number"
                  className={clsx('form-control', { 'is-invalid': formik.touched.selling_price && formik.errors.selling_price })}
                  {...formik.getFieldProps('selling_price')}
                />
              </div>
            </div>
          )}

          {step === 3 && 
            (
              <>
              <ImageUploader 
                name="images" 
                formik={formik} 
                previews={imagePreviews} 
                setPreviews={setImagePreviews} 
                label="Product Images" 
                maxFiles={5} 
                />
                {formik.errors.images && (
                  <div className="invalid-feedback d-block">{formik.errors.images as string}</div>
                )}
              </>
            )
          }

          {step === 4 && <AddonsFieldArray name="addons" />}

          {step === 5 && <VariantsFieldArray name="variants" />}

          {/* Navigation Buttons */}
          <div className="d-flex justify-content-between mt-4">
            {step > 1 && <button type="button" className="btn btn-light" onClick={prevStep}>Back</button>}
           {step < steps.length ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={async () => {
                  try {
                    await StepSchemas[step - 1].validate(formik.values, { abortEarly: false })
                    nextStep(formik.values, formik.validateForm)
                  } catch (err: any) {
                    const errors: any = {}
                    err.inner.forEach((e: any) => { errors[e.path] = e.message })
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
                    await StepSchemas[step - 1].validate(formik.values, { abortEarly: false })
                    formik.handleSubmit() // ✅ trigger submit only after validation
                  } catch (err: any) {
                    const errors: any = {}
                    err.inner.forEach((e: any) => { errors[e.path] = e.message })
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

export { CreateProductModal }
