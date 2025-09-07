import {Route, Routes, Outlet, Navigate} from 'react-router-dom'
import {PageLink, PageTitle} from '@/layout/core'
import { SupplierList } from './components/supplierList'

const Breadcrumbs: Array<PageLink> = [
  {
    title: 'Supplier List',
    path: '/supplier/list',
    isSeparator: false,
    isActive: false,
  },

]

const SupplierPage = () => {
  return (
    <>
      <PageTitle breadcrumbs={Breadcrumbs}></PageTitle>
      <SupplierList />
    </>
  )
}

export default SupplierPage
