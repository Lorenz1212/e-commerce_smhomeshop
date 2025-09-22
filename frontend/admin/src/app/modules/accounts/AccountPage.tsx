import React from 'react'
import {Navigate, Outlet, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'
import {UserPage} from './users/UserPage'
import {RolePage} from './roles/RolePage'
import { useAuth } from '@@/auth'

const accountBreadCrumbs: Array<PageLink> = [
  {
    title: 'Account',
    path: '/account-management',
    isSeparator: false,
    isActive: false,
  },
  {
    title: '',
    path: '',
    isSeparator: true,
    isActive: false,
  },
]

const AccountPage: React.FC = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path='/user/list'
          element={
            <>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Users</PageTitle>
              <UserPage title={'User'}/>
            </>
          }
        />
        <Route
          path='/role/list'
          element={
            <>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Roles</PageTitle>
              <RolePage title={'Role'}/>
            </>
          }
        />
      </Route>
    </Routes>
  )
}

export default AccountPage
