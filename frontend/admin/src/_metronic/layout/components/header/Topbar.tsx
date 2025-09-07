import {FC} from 'react'
import clsx from 'clsx'
import {KTIcon} from '../../../helpers'
import {  HeaderUserMenu, ThemeModeSwitcher} from '../../../partials'
import {useLayout} from '../../core'
import { useAuth } from '@@/auth'

const itemClass = 'ms-1 ms-lg-3',
  userAvatarClass = 'symbol-30px symbol-md-40px'

const Topbar: FC = () => {
  const {config} = useLayout()
  const {currentUser} = useAuth()
  return (
    <div className='d-flex align-items-stretch justify-self-end flex-shrink-0'>


      {/* begin::Theme mode */}
      <div className={'d-flex align-items-center ms-1 ms-lg-3'}>
        <ThemeModeSwitcher toggleBtnClass='btn-active-light-primary w-30px h-30px w-md-40px h-md-40px' />
      </div>
      {/* end::Theme mode */}

      {/* begin::User */}
      <div className={clsx('d-flex align-items-center', itemClass)} id='kt_header_user_menu_toggle'>
        {/* begin::Toggle */}
        <div
          className={clsx('cursor-pointer symbol', userAvatarClass)}
          data-kt-menu-trigger='click'
          data-kt-menu-attach='parent'
          data-kt-menu-placement='bottom-end'
        >
          <img src={currentUser?.image} alt='metronic' />
        </div>
        <HeaderUserMenu />
        {/* end::Toggle */}
      </div>
      {/* end::User */}

      {/* begin::Aside Toggler */}
      {config.header.left === 'menu' && (
        <div className='d-flex align-items-center d-lg-none ms-2 me-n3' title='Show header menu'>
          <div
            className='btn btn-icon btn-active-light-primary w-30px h-30px w-md-40px h-md-40px'
            id='kt_header_menu_mobile_toggle'
          >
            <KTIcon iconName='text-align-left' className='fs-1' />
          </div>
        </div>
      )}
    </div>
  )
}

export {Topbar}
