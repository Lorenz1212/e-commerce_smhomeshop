import React, { FC, useState } from 'react'
import * as Yup from 'yup'
import { Formik } from 'formik'
import clsx from 'clsx'
import { CategorySelect } from '@@@/selects/CategorySelect'
import { SupplierSelect } from '@@@/selects/SupplierSelect'
import { useProduct } from '@@/products/core/_request'
import { MulitpleImageUploader } from '@@@/uploader/MulitpleImageUploader'
import { AddonsFieldArray } from '@@@/FieldArrays/AddonsFieldArray'
import { VariantsFieldArray } from '@@@/FieldArrays/VariantFieldArray'
import { BrandSelect } from '@@@/selects/BrandSelect'

interface Option { id: string | number; name: string }

interface Addon { id: number; base_price: any | ''; custom_price: any | '', is_freebies : string | 'N' }

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
      .of(
        Yup.mixed<File>()
          .test('fileType', 'Only JPG, JPEG, PNG files are allowed', (value) => {
            if (!value) return true; // allow empty before required check
            if (!(value instanceof File)) return false;
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            return allowedTypes.includes(value.type);
          })
          .test('fileSize', 'File size is too large (max 5MB)', (value) => {
            if (!value) return true;
            if (!(value instanceof File)) return false;
            return value.size <= 5 * 1024 * 1024; // 5MB
          })
      )
      .test('images', 'At least one image required', function (value) {
        const previews = (this.options.context as any)?.imagePreviews;
        return (
          (Array.isArray(value) && value.length > 0) ||
          (previews && previews.length > 0)
        );
      }),
  }),
  // Step 4: Addons
  Yup.object().shape({
    addons: Yup.array()
      .min(0, 'At least one addon is required')
      .of(
        Yup.object().shape({
          id: Yup.string().required('Addon is required'),

          is_freebies: Yup.string()
          .oneOf(['Y', 'N'], 'Must be Y or N')
          .required('is_freebies is required'),

          base_price: Yup.number()
            .transform((val, orig) => (orig === '' ? null : val))
            .min(0, 'Base price cannot be negative')
            .when('is_freebies', {
              is: 'Y',
              then: (schema) => schema.notRequired().nullable(),
              otherwise: (schema) => schema.required('Base price is required'),
            }),

          custom_price: Yup.number()
            .transform((val, orig) => (orig === '' ? null : val)) 
           .required('Custom price is required') 
            .min(0, 'Custom price cannot be negative')
            .when('is_freebies', {
              is: 'Y',
              then: (schema) =>
                schema.test(
                  'must-be-zero-if-freebie',
                  'Custom price must be 0 for freebies',
                  (value) =>
                    value === 0 || value === null || value === undefined
                ),
              otherwise: (schema) =>
                schema.test(
                  'custom-vs-base',
                  'Custom price cannot be less than base price',
                  function (value) {
                    const { base_price } = this.parent;
                    if (value === undefined || value === null) return true;
                    return value >= base_price;
                  }
                ),
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
        quantity_on_hand: Yup.number().required('Quantity on hand is required').min(0),
        reorder_point: Yup.number()
          .transform((val, orig) => (orig === '' ? null : val))
          .nullable(),

        cost_price: Yup.number()
          .transform((val, orig) => (orig === '' ? null : val))
          .nullable(),

        selling_price: Yup.number()
          .transform((val, orig) => (orig === '' ? null : val))
          .nullable(),
         image: Yup.mixed<File>()
            .nullable()
            .test('required', 'Variant image is required', function (value) {
              const ctx = this as Yup.TestContext
              const parent = (ctx.parent ?? {}) as { image_preview?: string }
  
              if (
                parent.image_preview &&
                typeof parent.image_preview === 'string' &&
                parent.image_preview.trim() !== ''
              ) {
                return true
              }
  
              if (!value) return false
              if (Array.isArray(value)) {
                if (value.length === 0) return false
                return value.some(v => typeof v === 'string' || v instanceof File)
              }

              if (typeof value === 'string') return true
              if (value instanceof File) return true
              return false
            })
            .test('fileType', 'Only JPG, JPEG, PNG files are allowed', (value) => {
              if (!value) return true
              if (Array.isArray(value)) {
                return value.every(v => 
                  typeof v === 'string' || 
                  (v instanceof File && ['image/jpeg', 'image/jpg', 'image/png'].includes(v.type))
                )
              }
              if (typeof value === 'string') return true
              if (value instanceof File) {
                return ['image/jpeg', 'image/jpg', 'image/png'].includes(value.type)
              }
              return false
            })
            .test('fileSize', 'File size is too large (max 5MB)', (value) => {
              if (!value) return true
              if (Array.isArray(value)) {
                return value.every(v => 
                  typeof v === 'string' || 
                  (v instanceof File && v.size <= 5 * 1024 * 1024)
                )
              }
              if (typeof value === 'string') return true
              if (value instanceof File) {
                return value.size <= 5 * 1024 * 1024
              }
              return true
            }),
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

  const prevStep = () => setStep((s) => Math.max(s - 1, 1))
  const buildTouchedForStep = (stepIndex: number, values: any) => {
  const result: any = {}
    if (stepIndex === 4) {
      // addons step (index 4 because your steps are 1-based; step===4 -> addons)
      const addons = Array.isArray(values.addons) ? values.addons : []
      result.addons = addons.map(() => ({
        id: true,
        name: true,
        base_price: true,
        custom_price: true,
        is_freebies: true,
      }))
    } else {
      // other steps — mark each field in the schema as touched
      const keys = StepSchemas[stepIndex - 1] && (StepSchemas[stepIndex - 1] as any).fields
        ? Object.keys((StepSchemas[stepIndex - 1] as any).fields)
        : []
      keys.forEach((k) => (result[k] = true))
    }
    return result
  }

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
      validationSchema={Yup.object()}
      validateOnChange={false}
      validateOnBlur={false}
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
                  onChange={(e) => {
                    formik.handleChange(e);
                    const stepSchema = StepSchemas[step - 1];
                    stepSchema
                      .validateAt('sku', formik.values)
                      .then(() => formik.setFieldError('sku', ''))
                      .catch((err: any) => formik.setFieldError('sku', err.message));
                  }}
                />
                {formik.touched.sku && formik.errors.sku && <div className="invalid-feedback">{formik.errors.sku}</div>}
              </div>
              <div className="col-md-12 mb-3">
                <label className="form-label required">Product Name</label>
                <input
                  type="text"
                  className={clsx('form-control', { 'is-invalid': formik.touched.name && formik.errors.name })}
                  {...formik.getFieldProps('name')}
                  onChange={(e) => {
                    formik.handleChange(e);
                    const stepSchema = StepSchemas[step - 1];
                    stepSchema
                      .validateAt('name', formik.values)
                      .then(() => formik.setFieldError('name', ''))
                      .catch((err: any) => formik.setFieldError('name', err.message));
                  }}
                />
                {formik.touched.name && formik.errors.name && <div className="invalid-feedback">{formik.errors.name}</div>}
              </div>
              <div className="col-md-12 mb-3">
                <label className="form-label required">Description</label>
                <textarea
                  className={clsx('form-control', { 'is-invalid': formik.touched.description && formik.errors.description })}
                  rows={4}
                  {...formik.getFieldProps('description')}
                  onChange={(e) => {
                    formik.handleChange(e);
                    const stepSchema = StepSchemas[step - 1];
                    stepSchema
                      .validateAt('description', formik.values)
                      .then(() => formik.setFieldError('description', ''))
                      .catch((err: any) => formik.setFieldError('description', err.message));
                  }}
                />
                {formik.touched.description && formik.errors.description && <div className="invalid-feedback">{formik.errors.description}</div>}
              </div>
              <div className="col-md-6">
                <BrandSelect
                  setClass="mb-3"
                  name="brand_id"
                  value={formik.values.brand_id}
                  onChange={(e) => {
                    // Update Formik value
                    formik.handleChange(e);

                    // Validate this field immediately
                    const stepSchema = StepSchemas[step - 1];
                    stepSchema
                      .validateAt('brand_id', { ...formik.values, [e.target.name]: e.target.value })
                      .then(() => formik.setFieldError('brand_id', ''))
                      .catch((err: any) => formik.setFieldError('brand_id', err.message));
                  }}
                  onBlur={(e)=> {formik.handleBlur(e)}}
                  error={formik.errors.brand_id}
                  touched={formik.touched.brand_id}
                />
              </div>
              <div className="col-md-6">
                <CategorySelect
                  setClass="mb-3"
                  name="category_id"
                  value={formik.values.category_id}
                  onChange={(e) => {
                    // Update Formik value
                    formik.handleChange(e);

                    // Validate this field immediately
                    const stepSchema = StepSchemas[step - 1];
                    stepSchema
                      .validateAt('category_id', { ...formik.values, [e.target.name]: e.target.value })
                      .then(() => formik.setFieldError('category_id', ''))
                      .catch((err: any) => formik.setFieldError('category_id', err.message));
                  }}
                  onBlur={(e)=> {formik.handleBlur(e)}}
                  error={formik.errors.category_id}
                  touched={formik.touched.category_id}
                />
              </div>
              <div className="col-md-6 mb-3">
               <SupplierSelect
                  setClass="mb-3"
                  name="supplier_id"
                  value={formik.values.supplier_id}
                  onChange={(e) => {
                    // Update Formik value
                    formik.handleChange(e);

                    // Validate this field immediately
                    const stepSchema = StepSchemas[step - 1];
                    stepSchema
                      .validateAt('supplier_id', { ...formik.values, [e.target.name]: e.target.value })
                      .then(() => formik.setFieldError('supplier_id', ''))
                      .catch((err: any) => formik.setFieldError('supplier_id', err.message));
                  }}
                  onBlur={(e) => {formik.handleBlur(e)}}
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
                  onBlur={(e) => {
                    formik.handleBlur(e);
                    const stepSchema = StepSchemas[step - 1];
                    stepSchema
                      .validateAt('quantity_on_hand', formik.values)
                      .then(() => formik.setFieldError('quantity_on_hand', ''))
                      .catch((err: any) => formik.setFieldError('quantity_on_hand', err.message));
                  }}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label required">Reorder Point</label>
                <input
                  type="number"
                  className={clsx('form-control', { 'is-invalid': formik.touched.reorder_point && formik.errors.reorder_point })}
                  {...formik.getFieldProps('reorder_point')}
                  onBlur={(e) => {
                    formik.handleBlur(e);
                    const stepSchema = StepSchemas[step - 1];
                    stepSchema
                      .validateAt('reorder_point', formik.values)
                      .then(() => formik.setFieldError('reorder_point', ''))
                      .catch((err: any) => formik.setFieldError('reorder_point', err.message));
                  }}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label required">Cost Price</label>
                <input
                  type="number"
                  className={clsx('form-control', { 'is-invalid': formik.touched.cost_price && formik.errors.cost_price })}
                  {...formik.getFieldProps('cost_price')}
                  onBlur={(e) => {
                    formik.handleBlur(e);
                    const stepSchema = StepSchemas[step - 1];
                    stepSchema
                      .validateAt('cost_price', formik.values)
                      .then(() => formik.setFieldError('cost_price', ''))
                      .catch((err: any) => formik.setFieldError('cost_price', err.message));
                  }}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label required">Selling Price</label>
                <input
                  type="number"
                  className={clsx('form-control', { 'is-invalid': formik.touched.selling_price && formik.errors.selling_price })}
                  {...formik.getFieldProps('selling_price')}
                  onBlur={(e) => {
                    formik.handleBlur(e);
                    const stepSchema = StepSchemas[step - 1];
                    stepSchema
                      .validateAt('selling_price', formik.values)
                      .then(() => formik.setFieldError('selling_price', ''))
                      .catch((err: any) => formik.setFieldError('selling_price', err.message));
                  }}
                />
              </div>
            </div>
          )}

          {step === 3 && 
            (
              <>
              <MulitpleImageUploader 
                name="images" 
                formik={formik} 
                previews={imagePreviews} 
                setPreviews={setImagePreviews} 
                label="Product Images" 
                maxFiles={5} 
                />
              </>
            )
          }

          {step === 4 && (
            <>
              <AddonsFieldArray 
                name="addons" 
                errors={formik.errors}
                touched={formik.touched}
                onBlur={(e) => {formik.handleBlur(e)}}
                onChange={(e) => {formik.handleChange(e)}}
                setFieldValue={formik.setFieldValue}
                setFieldTouched={formik.setFieldTouched}
              />
            </>
          )}

          {step === 5 && 
          <VariantsFieldArray 
            name="variants" 
            errors={formik.errors}
            touched={formik.touched}
            onBlur={(e) => {formik.handleBlur(e)}}
            onChange={(e) => {formik.handleChange(e)}}
            setFieldValue={formik.setFieldValue}
            setFieldTouched={formik.setFieldTouched}
        />}

          {/* Navigation Buttons */}
          <div className="d-flex justify-content-between mt-4">
            {step > 1 && <button type="button" className="btn btn-light" onClick={prevStep}>Back</button>}
           {step < steps.length ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={async () => {
                  try {
                    Object.fromEntries(
                      Object.keys(StepSchemas[step - 1].fields).map((field) => [field, true])
                    )
                    await StepSchemas[step - 1].validate(formik.values, { abortEarly: false })

                    nextStep(formik.values, formik.validateForm)
                  } catch (err: any) {
                      const errors: any = {} 
                      err.inner.forEach((e: any) => { errors[e.path] = e.message })
                      formik.setErrors(errors)
                      const touchedForStep = buildTouchedForStep(step, formik.values);
                        formik.setTouched({
                          ...(formik.touched || {}),
                          ...touchedForStep,
                        });
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
                   console.log(formik.values)
                    formik.handleSubmit() // ✅ trigger submit only after validation
                  } catch (err: any) {
                
                    const errors: any = {} 
                    err.inner.forEach((e: any) => { errors[e.path] = e.message })
                        console.log(errors)
                    formik.setErrors(errors)
                    
                   const touchedForStep = buildTouchedForStep(step, formik.values);
                    formik.setTouched({
                      ...(formik.touched || {}),
                      ...touchedForStep,
                    });
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
