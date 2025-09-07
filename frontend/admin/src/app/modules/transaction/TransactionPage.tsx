import {Navigate, Outlet, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'
import { OrderList as OnlineOrder } from './online/OrderList'
import { OrderList as WalkinOrder } from './walkin/OrderList'

const BreadCrumbs: Array<PageLink> = [
  {
    title: 'Transactions',
    path: '/transactions',
    isSeparator: false,
    isActive: false,
  }
]

const TransactionPage = () => {
  return (
    <Routes>
     <Route element={<Outlet />}>
        <Route
          path='/online/order/list'
          element={
            <>
              <PageTitle breadcrumbs={BreadCrumbs}>Online Order</PageTitle>
              <OnlineOrder title={'Online Order'}/>
            </>
          }
        />
        <Route
          path='/walkin/order/list'
          element={
            <>
              <PageTitle breadcrumbs={BreadCrumbs}>In-Store Order</PageTitle>
              <WalkinOrder title={'In-Store Order'}/>
            </>
          }
        />
      </Route>
    </Routes>
  )
}

export default TransactionPage
