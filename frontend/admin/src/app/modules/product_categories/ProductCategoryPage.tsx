import {Route, Routes, Outlet, Navigate} from 'react-router-dom'
import {PageLink, PageTitle} from '@/layout/core'
import {CategoryList} from './components/categoryList'

const Breadcrumbs: Array<PageLink> = [
  {
    title: 'Product Category',
    path: '/product/category/list',
    isSeparator: false,
    isActive: false,
  },

]

const ProductCategoryPage = () => {
  return (
    <>
      <PageTitle breadcrumbs={Breadcrumbs}></PageTitle>
      <CategoryList/>
    </>
  )
}

export default ProductCategoryPage
