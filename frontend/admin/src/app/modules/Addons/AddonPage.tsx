import {Route, Routes, Outlet, Navigate} from 'react-router-dom'
import {PageLink, PageTitle} from '@/layout/core'
import { AddonList } from './components/AddonList'


const Breadcrumbs: Array<PageLink> = [
  {
    title: 'Product Add-ons',
    path: '/product/addon/list',
    isSeparator: false,
    isActive: false,
  },

]

const AddonPage = () => {
  return (
    <>
      <PageTitle breadcrumbs={Breadcrumbs}></PageTitle>
      <AddonList/>
    </>
  )
}

export default AddonPage
