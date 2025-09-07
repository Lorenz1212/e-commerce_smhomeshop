import {Navigate, Outlet, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'
import { InventoryMovementContent } from './inventory_movement/InventoryMovementContent'
import { SalesContent } from './sales/SalesContent'

const BreadCrumbs: Array<PageLink> = [
  {
    title: 'Reports',
    path: '/reports',
    isSeparator: false,
    isActive: false,
  }
]

const ReportPage = () => {
  return (
    <Routes>
     <Route element={<Outlet />}>
        <Route
          path='/inventory-movement'
          element={
            <>
              <PageTitle breadcrumbs={BreadCrumbs}>Inventory Movement Reports</PageTitle>
              <InventoryMovementContent title={'Inventory Movement Report'}/>
            </>
          }
        />
         <Route
          path='/sales'
          element={
            <>
              <PageTitle breadcrumbs={BreadCrumbs}>Sales Reports</PageTitle>
              <SalesContent title={'Sales Report'}/>
            </>
          }
        />
      </Route>
    </Routes>
  )
}

export default ReportPage
