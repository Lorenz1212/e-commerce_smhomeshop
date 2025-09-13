import React, { FC, useState } from 'react'
import * as Yup from 'yup'
import { Formik, Form } from 'formik'
import clsx from 'clsx'
import { CategorySelect } from '@@@/selects/CategorySelect'
import { SupplierSelect } from '@@@/selects/SupplierSelect'
import { useProduct } from '@@/products/core/_request'
import { ImageUploader } from '@@@/uploader/ImageUploader'
import { AddonsFieldArray } from '@@@/AddonsFieldArray'
import { VariantsFieldArray } from '@@@/VariantFieldArray'

interface EditProductModalProps {
  productID: any,
  data:any,
  setRefreshTable?: (value: boolean) => void
  onSubmit?: (values: any) => void
}

const EditProductModal: FC<EditProductModalProps> = ({
  productID,
  data,
  setRefreshTable,
  onSubmit,
}) => {
  
 const [imagePreviews, setImagePreviews] = useState<string[]>(
      data?.images?.map((img: any) => img.image_cover) || []
    )

 const { updateProduct } = useProduct()

 const Schema = Yup.object().shape({
    sku: Yup.string().min(1).max(50).required('SKU is required'),
    name: Yup.string().min(1).max(50).required('Product name is required'),
    description: Yup.string().min(1).required('Description is required'),
    category_id: Yup.string().required('Category is required'),
    supplier_id: Yup.string().required('Supplier is required'),
    add_new_stocks: Yup.number().min(0),
    reorder_point: Yup.number().required('Reorder point is required').min(0),
    cost_price: Yup.number().required('Cost price is required').min(0),
    selling_price: Yup.number().required('Selling price is required').min(0),
    images: Yup.mixed()
    .test('images', 'At least one image required', function (value) {
    return (
        (Array.isArray(value) && value.length > 0) ||
        (imagePreviews && imagePreviews.length > 0)
    );
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
})

  return (
    <Formik
      initialValues={ {
        sku: data.sku,
        name: data.name,
        description: data.description,
        category_id: data.category_id,
        supplier_id: data.supplier_id,
        quantity_on_hand: data.quantity_on_hand,
        add_new_stocks:0,
        reorder_point: data.reorder_point,
        cost_price: data.cost_price,
        selling_price: data.selling_price,
        images: [],
        addons: data.product_addons?.map((addon: any) => ({
          id: addon.addon_id, 
          base_price: addon.base_price ?? '', 
          custom_price: addon.custom_price ?? '',
        })) || [],
        variants: data.variants?.map((variant: any) => ({
          id: variant.variant_id, 
          sku: variant.sku ?? '', 
          variant_name: variant.variant_name ?? '',
          quantity_on_hand: variant.quantity_on_hand ?? '',
          reorder_point: variant.reorder_point ?? '',
          cost_price: variant.cost_price ?? '',
          selling_price: variant.selling_price ?? '',
          image: variant.image ?? '',
        })) || []
      }}
      validationSchema={Schema}
      onSubmit={async (values, { resetForm }) => {
        await updateProduct(
          values,
          productID,
          setRefreshTable
        )
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
                     {formik.touched.sku && typeof formik.errors.sku === 'string' && (
                            <div className='invalid-feedback'>{formik.errors.sku}</div>
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
                      {formik.touched.name && typeof formik.errors.name === 'string' && (
                            <div className='invalid-feedback'>{formik.errors.name}</div>
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
                      {formik.touched.description && typeof formik.errors.description === 'string' && (
                            <div className='invalid-feedback'>{formik.errors.description}</div>
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

                    {/* Supplier */}
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

                     {/* Quantity */}
                    <div className='col-md-6 mb-3'>
                        <label className='form-label'>Quantity on Hand</label>
                        <input
                        type='number'
                        className="form-control"
                        {...formik.getFieldProps('quantity_on_hand')}
                        readOnly
                        />
                    </div>

                    <div className='col-md-6 mb-3'>
                        <label className='form-label'>Add New Stocks</label>
                        <input
                        type='number'
                        className={clsx('form-control', {
                            'is-invalid': formik.touched.add_new_stocks && formik.errors.add_new_stocks,
                        })}
                        {...formik.getFieldProps('add_new_stocks')}
                        />
                        {formik.touched.add_new_stocks && typeof formik.errors.add_new_stocks === 'string' && (
                            <div className='invalid-feedback'>{formik.errors.add_new_stocks}</div>
                        )}
                    </div>


                    {/* Reorder Point */}
                    <div className="col-md-12 mb-3">
                      <label className="form-label">Reorder Point</label>
                      <input
                        type="number"
                        className={clsx('form-control', {
                          'is-invalid': formik.touched.reorder_point && formik.errors.reorder_point,
                        })}
                        {...formik.getFieldProps('reorder_point')}
                      />
                        {formik.touched.reorder_point && typeof formik.errors.reorder_point === 'string' && (
                            <div className='invalid-feedback'>{formik.errors.reorder_point}</div>
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
                      {formik.touched.cost_price && typeof formik.errors.cost_price === 'string' && (
                            <div className='invalid-feedback'>{formik.errors.cost_price}</div>
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
                       {formik.touched.selling_price && typeof formik.errors.selling_price === 'string' && (
                            <div className='invalid-feedback'>{formik.errors.selling_price}</div>
                       )}
                    </div>
                </div>
              </div>
              <div className="col-md-6 mb-4">
                  <div className="col-md-12 mb-4">
                      <AddonsFieldArray name="addons" />
                  </div>
              </div>
               <div className="col-md-12 mb-4">
                    <VariantsFieldArray name="variants" initialPreviews={data.variants?.map((v: any) => [v.image]) || []} />
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

export { EditProductModal }
