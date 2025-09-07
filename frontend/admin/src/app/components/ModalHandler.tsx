import {useEffect} from 'react'
import {KTIcon} from '@/helpers'
import React from 'react'

export interface ModalProps {
  title: string
  body: React.ReactNode
  modalClass?: string
  alignment?: 'centered' | 'top' | 'scrollable' | string
  loading?: boolean
  onClose: () => void
}

export function ModalHandler({
  title,
  body,
  modalClass = '',
  alignment = 'centered',
  loading = false,
  onClose,
}: ModalProps) {
  useEffect(() => {
    document.body.classList.add('modal-open')
    return () => {
      document.body.classList.remove('modal-open')
    }
  }, [])

  return (
    <>
      <div
        className='modal fade show d-block'
        role='dialog'
        tabIndex={-1}
        aria-modal='true'
      >
        {/* Modal dialog */}
        <div className={`modal-dialog modal-dialog-${alignment} ${modalClass}`}>
          <div className='modal-content'>
            <div className='modal-header'>
              <h2 className='fw-bolder'>{title}</h2>
              <div
                className='btn btn-icon btn-sm btn-active-icon-primary'
                onClick={onClose}
                style={{cursor: 'pointer'}}
              >
                <KTIcon iconName='cross' className='fs-1' />
              </div>
            </div>

            <div className='modal-body scroll-y mx-5 mx-xl-7 my-7'>
              {loading ? <p>Loading...</p> : body}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Backdrop */}
      <div className='modal-backdrop fade show'></div>
    </>
  )
}

export default ModalHandler
