

import {FC} from 'react'
import {Link} from 'react-router-dom'
import clsx from 'clsx'
import {useLayout} from '../../core'
import { toAbsoluteUrl} from '../../../helpers'
import {AsideMenu} from './AsideMenu'

const AsideDefault: FC = () => {
  const {classes} = useLayout()
  return (
    <div
      id='kt_aside'
      className={clsx('aside overflow-visible bg-primary', classes.aside.join(' '))}
      data-kt-drawer='true'
      data-kt-drawer-name='aside'
      data-kt-drawer-activate='{default: true, lg: false}'
      data-kt-drawer-overlay='true'
      data-kt-drawer-width='auto'
      data-kt-drawer-direction='start'
      data-kt-drawer-toggle='#kt_aside_toggle'
    >
      {/* begin::Logo */}
      <div
        className='aside-logo d-none d-lg-flex flex-column align-items-center flex-column-auto py-8'
        id='kt_aside_logo'
      >
        <Link to='/dashboard'>
          <img src={toAbsoluteUrl('media/logos/logo2.png')} alt='logo' className='h-55px' />
        </Link>
      </div>
      {/* end::Logo */}

      {/* begin::Nav */}
      <div
        className='asaside-nav d-flex flex-column align-lg-center flex-column-fluid w-100 pt-5 pt-lg-0'
        id='kt_aside_nav'
      >
        <AsideMenu asideMenuCSSClasses={classes.asideMenu} />
      </div>
      {/* end::Nav */}

 
    </div>
  )
}

export {AsideDefault}
