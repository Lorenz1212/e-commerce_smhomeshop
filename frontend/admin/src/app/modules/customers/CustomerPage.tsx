import {Route, Routes, Outlet, Navigate} from 'react-router-dom'
import {PageLink, PageTitle} from '@/layout/core'
import {CustomerList} from './components/CustomerList'

const Breadcrumbs: Array<PageLink> = [
  {
    title: 'Customer List',
    path: '/customer/list',
    isSeparator: false,
    isActive: false,
  },

]

const CustomerPage = () => {
  return (
    <>
      <PageTitle breadcrumbs={Breadcrumbs}></PageTitle>
      <CustomerList title="Customer"/>
    </>
  )
}

export default CustomerPage
