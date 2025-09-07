
import {FC, useEffect} from 'react'
import {ID, KTIcon} from '@/helpers'
import {MenuComponent} from '@/assets/ts/components'

type Props = {
  openDetailsModal?: () => void
  openEditModal?: () => void
  archiveAction?: () => void
  restoreAction?: () => void
  resetAction?: () => void
}

const ActionsCell: FC<Props> = ({
  openDetailsModal,
  openEditModal,
  archiveAction,
  restoreAction,
  resetAction,
}) => {
  const hasMenu =
    openDetailsModal || openEditModal || archiveAction || restoreAction

  if (!hasMenu) return null

  useEffect(() => {
    MenuComponent.reinitialization()
  }, [])

  return (
    <>
      <a
        href='#'
        className='btn btn-light btn-active-light-primary btn-sm'
        data-kt-menu-trigger='click'
        data-kt-menu-placement='bottom-end'
      >
        Actions
        <KTIcon iconName='down' className='fs-5 m-0' />
      </a>

      {/* begin::Menu */}
      <div
        className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold fs-7 w-125px py-4'
        data-kt-menu='true'
      >
        {openDetailsModal && (
          <div className='menu-item px-3'>
            <a
              className='menu-link px-3'
              onClick={() => openDetailsModal()}
            >
              View Details
            </a>
          </div>
        )}

        {openEditModal && (
          <div className='menu-item px-3'>
            <a
              className='menu-link px-3'
              onClick={() => openEditModal()}
            >
              Edit
            </a>
          </div>
        )}

        {archiveAction && (
          <div className='menu-item px-3'>
            <a
              className='menu-link px-3'
              onClick={() => archiveAction()}
              data-kt-users-table-filter='delete_row'
            >
              Archive
            </a>
          </div>
        )}

        {restoreAction && (
          <div className='menu-item px-3'>
            <a
              className='menu-link px-3'
              onClick={() => restoreAction()}
              data-kt-users-table-filter='delete_row'
            >
              Restore
            </a>
          </div>
        )}
        {resetAction && (
          <div className='menu-item px-3'>
            <a
              className='menu-link px-3'
              onClick={() => resetAction()}
              data-kt-users-table-filter='delete_row'
            >
              Reset Password
            </a>
          </div>
        )}
      </div>
      {/* end::Menu */}
    </>
  )
}


export {ActionsCell}
