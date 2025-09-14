import {Route, Routes, Outlet, Navigate} from 'react-router-dom'
import {PageLink, PageTitle} from '@/layout/core'
import {BrandList} from './components/brandList'

const Breadcrumbs: Array<PageLink> = [
  {
    title: 'Product Brand',
    path: '/product/brands/list',
    isSeparator: false,
    isActive: false,
  },

]

const ProductBrandPage = () => {
  return (
    <>
      <PageTitle breadcrumbs={Breadcrumbs}></PageTitle>
      <BrandList title="Product Brand"/>
    </>
  )
}

export default ProductBrandPage
