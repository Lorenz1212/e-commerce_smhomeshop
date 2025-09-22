import { toAbsoluteUrl } from '@/helpers'
import { CurrencyText } from '@@@/inputmasks/CurrencyText'
import { ImageViewer } from '@@@/fileviewers/ImageViewer'
import { FC, useState } from 'react'

interface ProductModalProps {
  data: any
}

const steps = [
  { label: 'Basic Info' },
  { label: 'Inventory & Pricing' },
  { label: 'Images' },
  { label: 'Addons' },
  { label: 'Variants' },
]

// split validation per step
const ViewProductDetailsModal: FC<ProductModalProps> = ({
  data,
}) => {
  const [step, setStep] = useState(1)

  const [imagePreviews, setImagePreviews] = useState<string[]>(
    data?.images?.map((img: any) => img.image_cover) || []
  )

  return (
    <div>
      {/* Step Header */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          {steps.map((s, index) => (
            <div
              key={index}
              onClick={() => setStep(index + 1)}
              className={`flex-fill text-center cursor-pointer ${step === index + 1 ? 'fw-bold text-primary' : 'text-muted'}`}
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

      {step === 1 && (
        <div className="row">
            <hr></hr>
          <div className="col-md-12 mb-3">
            <div className="d-flex">
            <span className="fw-bold me-2">SKU:</span>
            <span>{data.sku || '-'}</span>
            </div>
          </div>
          <div className="col-md-12 mb-3">
             <div className="d-flex">
                <span className="fw-bold me-2">Product Name:</span>
                <span>{data.name || '-'}</span>
              </div>
          </div>
          <div className="col-md-12 mb-3">
             <div className="d-flex">
                <span className="fw-bold me-2">Supplier:</span>
                <span>{data.supplier.name || '-'}</span>
              </div>
          </div>
           <div className="col-md-12 mb-3">
             <div className="d-flex">
                <span className="fw-bold me-2">Brand:</span>
                <span>{data.brand.name || '-'}</span>
              </div>
          </div>
           <div className="col-md-12 mb-3">
             <div className="d-flex">
                <span className="fw-bold me-2">Category:</span>
                <span>{data.category.name || '-'}</span>
              </div>
          </div>
            <hr></hr>
          <div className="col-md-12 mb-3">
            <span className="fw-bold me-2">Description:</span>
            <div className="form-control-plaintext">{data.description || '-'}</div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="row">
            <hr></hr>
          <div className="col-md-12 mb-3">
             <div className="d-flex">
                <span className="fw-bold me-2">Quantity on Hand:</span>
                <span>{data.quantity_on_hand || '-'}</span>
              </div>
          </div>
          <div className="col-md-12 mb-3">
             <div className="d-flex">
                <span className="fw-bold me-2">Reorder Point:</span>
                <span>{data.reorder_point || '-'}</span>
              </div>
          </div>
          <div className="col-md-12 mb-3">
             <div className="d-flex">
                <span className="fw-bold me-2">Cost Price:</span>
                <span><CurrencyText value={data.cost_price}/></span>
              </div>
          </div>
          <div className="col-md-12 mb-3">
             <div className="d-flex">
                <span className="fw-bold me-2">Selling Price:</span>
                <span><CurrencyText value={data.selling_price}/></span>
              </div>
          </div>
           <hr></hr>
        </div>
      )}

      {step === 3 && (
          data.images.length > 0 ? (
            <div className="col-md-12 mb-3">
              <hr />
              <label className="form-label fw-bold">Images</label>
              <div className="d-flex gap-2 flex-wrap">
                {data.images.map((img: any, i: number) => (
                  <ImageViewer 
                    key={i}
                    preview={img.image_cover} 
                    index={i} 
                    allImages={data.images.map((img: any) => img.image_cover)}
                  />
                ))}
              </div>
              <hr />
            </div>
          ) : (
            <div className="col-md-12 mb-3">
              <div className="alert alert-secondary text-center rounded-3 py-4 shadow-sm">
                <i className="bi bi-plus-circle fs-3 d-block mb-2 text-muted"></i>
                <span className="fw-semibold text-muted">No images added yet.</span>
              </div>
            </div>
          )
      )}

      {step === 4 && (
        <div className="col-md-12 mb-3">
          <h6 className="fw-bold mb-3">Addons</h6>

            {data.product_addons?.length > 0 ? (
              <div className="list-group shadow-sm rounded-3">
              {data.product_addons.map((item: any, idx: number) => (
                <div key={idx}>
                  <div
                    className="list-group-item d-flex justify-content-between align-items-center  border-success"
                  >
                    <div>
                      <div className="fw-semibold text-dark">{item.addon?.name || `Addon #${idx + 1}`}</div>
                    </div>
                    <div className="fw-semibold">
                      {item.addon.is_freebies === 'Y'
                        ? <span className="badge bg-success">Freebie</span>
                        : <span className='text-dark'><CurrencyText value={item.custom_price || item.addon.base_price || 0} /></span>}
                    </div>
                  </div>

                  {/* separator except last item */}
                  {idx < data.product_addons.length - 1 && (
                    <hr className="my-1 text-muted opacity-25" />
                  )}
                </div>
              ))}

              </div>
            ) : (
              <div className="alert alert-secondary text-center rounded-3 py-4 shadow-sm">
                <i className="bi bi-gift fs-3 d-block mb-2 text-muted"></i>
                <span className="fw-semibold text-muted">No addons added yet.</span>
              </div>
            )}
          </div>
      )}

      {step === 5 && (
        <div className="col-md-12 mb-3">
          <h6 className="fw-bold mb-3">Variants</h6>

          {data.variants?.length > 0 ? (
            <div className="row g-3">
              {data.variants.map((variant: any, idx: number) => (
                <div key={idx} className="col-md-6">
                  <div className="card shadow-sm h-100 border-success">
                    <div className="card-body d-flex justify-content-between align-items-start">
                      {/* Left side - Info */}
                      <div className="flex-grow-1 pe-3">
                        <h6 className="fw-semibold mb-1">{variant.variant_name || '-'}</h6>
                        <p className="text-muted small mb-2">SKU: {variant.sku || '-'}</p>

                        <div className="d-flex justify-content-between small mb-1">
                          <span className="text-muted">Quantity:</span>
                          <span className="fw-semibold">{variant.quantity_on_hand ?? 0}</span>
                        </div>
                        <div className="d-flex justify-content-between small mb-1">
                          <span className="text-muted">Cost Price:</span>
                          <span className="fw-semibold">
                            <CurrencyText value={variant.cost_price || 0} />
                          </span>
                        </div>
                        <div className="d-flex justify-content-between small">
                          <span className="text-muted">Selling Price:</span>
                          <span className="fw-semibold">
                            <CurrencyText value={variant.selling_price || 0} />
                          </span>
                        </div>
                      </div>

                      {/* Right side - Image */}
                      <div className="ms-auto">
                        <img
                          src={variant.image_cover ?? toAbsoluteUrl('media/default.jpg')}
                          alt={variant.variant_name || 'Variant Image'}
                          className="rounded border"
                          style={{
                            width: '70px',
                            height: '70px',
                            objectFit: 'cover',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="alert alert-secondary text-center rounded-3 py-4 shadow-sm">
              <i className="bi bi-box-seam fs-3 d-block mb-2 text-muted"></i>
              <span className="fw-semibold text-muted">No variants added yet.</span>
            </div>
          )}
        </div>
      )}


    </div>
  )
}

export { ViewProductDetailsModal }
