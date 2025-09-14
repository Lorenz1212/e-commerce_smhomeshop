import {FC, lazy, Suspense} from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import {MasterLayout} from '../../_metronic/layout/MasterLayout'
import TopBarProgress from 'react-topbar-progress-indicator'
import {DashboardWrapper} from '../pages/dashboard/DashboardWrapper'
import {MenuTestPage} from '../pages/MenuTestPage'
import {getCSSVariableValue} from '../../_metronic/assets/ts/_utils'
import {WithChildren} from '../../_metronic/helpers'
import BuilderPageWrapper from '../pages/layout-builder/BuilderPageWrapper'

const PrivateRoutes = () => {
  
  const ProfilePage = lazy(() => import('@@/profile/ProfilePage'))
  const AccountPage = lazy(() => import('@@/accounts/AccountPage'))
  const ProductPage = lazy(() => import('@@/products/ProductPage'))
  const ProductCategoryPage = lazy(() => import('@@/product_categories/ProductCategoryPage'))
  const SupplierPage = lazy(() => import('@@/supplier/SupplierPage'))
  const AddonPage = lazy(() => import('@@/Addons/AddonPage'))
  const TransactionPage = lazy(() => import('@@/transaction/TransactionPage'))
  const FeedbackPage = lazy(() => import('@@/feedback/FeedbackPage'))
  const CustomerPage = lazy(() => import('@@/customers/CustomerPage'))
  const ReportPage = lazy(() => import('@@/reports/ReportPage'))
  const ProductBrandPage = lazy(() => import('@@/brands/ProductBrandPage'))

  return (
    <Routes>
      <Route element={<MasterLayout />}>
        {/* Redirect to Dashboard after success login/registartion */}
        <Route path='auth/*' element={<Navigate to='/dashboard' />} />
        {/* Pages */}
        <Route path='dashboard' element={<DashboardWrapper />} />
        <Route path='builder' element={<BuilderPageWrapper />} />
        <Route path='menu-test' element={<MenuTestPage />} />
        {/* Lazy Modules */}
          <Route
          path='customer/list'
          element={
            <SuspensedView>
              <CustomerPage />
            </SuspensedView>
          }
        />
         <Route
          path='product/list'
          element={
            <SuspensedView>
              <ProductPage />
            </SuspensedView>
          }
        />
        <Route
          path='product/addon/list'
          element={
            <SuspensedView>
              <AddonPage />
            </SuspensedView>
          }
        />
        <Route
          path='product/brands/list'
          element={
            <SuspensedView>
              <ProductBrandPage />
            </SuspensedView>
          }
        />
        <Route
          path='product/category/list'
          element={
            <SuspensedView>
              <ProductCategoryPage />
            </SuspensedView>
          }
        />
         <Route
          path='supplier/list'
          element={
            <SuspensedView>
              <SupplierPage />
            </SuspensedView>
          }
        />
        <Route
          path='profile'
          element={
            <SuspensedView>
              <ProfilePage />
            </SuspensedView>
          }
        />
         <Route
          path='transactions/*'
          element={
            <SuspensedView>
              <TransactionPage />
            </SuspensedView>
          }
        />
        <Route
          path='feedback/list'
          element={
            <SuspensedView>
              <FeedbackPage />
            </SuspensedView>
          }
        />
        <Route
          path='account-management/*'
          element={
            <SuspensedView>
              <AccountPage />
            </SuspensedView>
          }
        />
         <Route
          path='reports/*'
          element={
            <SuspensedView>
              <ReportPage />
            </SuspensedView>
          }
        />
         <Route
          path='profile/*'
          element={
            <SuspensedView>
              <ProfilePage />
            </SuspensedView>
          }
        />
        {/* Page Not Found */}
        <Route path='*' element={<Navigate to='/error/404' />} />
      </Route>
    </Routes>
  )
}

const SuspensedView: FC<WithChildren> = ({children}) => {
  const baseColor = getCSSVariableValue('--bs-primary')
  TopBarProgress.config({
    barColors: {
      '0': baseColor,
    },
    barThickness: 1,
    shadowBlur: 5,
  })
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>
}

export {PrivateRoutes}
