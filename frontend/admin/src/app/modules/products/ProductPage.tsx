import {Route, Routes, Outlet, Navigate} from 'react-router-dom'
import {PageLink, PageTitle} from '@/layout/core'
import {ProductList} from './components/productList'

const Breadcrumbs: Array<PageLink> = [
  {
    title: 'Product List',
    path: '/product/list',
    isSeparator: false,
    isActive: false,
  },

]

const ProductPage = () => {
  return (
    <>
      <PageTitle breadcrumbs={Breadcrumbs}></PageTitle>
      <ProductList />
    </>
  )
}

export default ProductPage
