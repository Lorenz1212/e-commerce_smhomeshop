
import { Content } from '@/layout/components/Content'
import { useAuth } from '@@/auth'
import React from 'react'
import {Link} from 'react-router-dom'

export function Overview() {
  const {currentUser} = useAuth()
  return (
    <Content>
      <div className='card mb-5 mb-xl-10' id='kt_profile_details_view'>
        <div className='card-header cursor-pointer'>
          <div className='card-title m-0'>
            <h3 className='fw-bolder m-0'>Profile Details</h3>
          </div>
        </div>

        <div className='card-body p-9'>
          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>Full Name</label>

            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-gray-900'>{currentUser?.fullname}</span>
            </div>
          </div>

          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>
              Gender
            </label>
            <div className='col-lg-8 d-flex align-items-center'>
              <span className='fw-bolder fs-6 me-2'>{currentUser?.gender??'N/A'}</span>
            </div>
          </div>

          
          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>
              Birth Date
            </label>
            <div className='col-lg-8 d-flex align-items-center'>
              <span className='fw-bolder fs-6 me-2'>{currentUser?.birthdate??'N/A'}</span>
            </div>
          </div>

          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>
              Age
            </label>
            <div className='col-lg-8 d-flex align-items-center'>
              <span className='fw-bolder fs-6 me-2'>{currentUser?.age??'N/A'}</span>
            </div>
          </div>


          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>
              Contact Phone
            </label>
            <div className='col-lg-8 d-flex align-items-center'>
              <span className='fw-bolder fs-6 me-2'>{currentUser?.contact_no??'N/A'}</span>
            </div>
          </div>
          

          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>Address</label>

            <div className='col-lg-8'>
              <span className='fw-bold fs-6 text-gray-900 text-hover-primary'>
                {currentUser?.address??'N/A'}
              </span>
            </div>
          </div>

        </div>
      </div>
    </Content>
  )
}
