import {useEffect} from 'react'
import {useIntl} from 'react-intl'
import {PageTitle} from '../../../_metronic/layout/core'
import { Content } from '../../../_metronic/layout/components/Content'
import { StatisticWidgets } from './components/statistics/StatisticWidgets'
import { ProductModel } from '@@/products/core/_model'
import { useTableHook } from '@@@@@@/hooks/useTableHook'
import { ProductStocksTable } from './components/table/ProductStocksTable'
import ForecastSalesChart from './components/charts/ForecastSalesChart'
import { FeedbackMixed } from './components/mixed/FeedbackMixed'

const DashboardPage = () => {
  const table = useTableHook<ProductModel>('/admin/dashboard/product_stocks')  

  useEffect(() => {
    // We have to show toolbar only for dashboard page
    document.getElementById('kt_layout_toolbar')?.classList.remove('d-none')
    return () => {
      document.getElementById('kt_layout_toolbar')?.classList.add('d-none')
    }
  }, [])

  return (
    <>
      <Content>
        {/* begin::Row  */}
        <div className='row g-5 g-xl-8'>
          {/* begin::Col  */}
          <div className='col-xxl-3'>
             <StatisticWidgets
                className='card-xl-stretch mb-5 mb-xl-8'
                svgIcon='user-tick'
                color='primary'
                iconColor='white'
                titleColor='white'
                description='Active Customers'
                descriptionColor='white'
                url='/admin/dashboard/customer_count'
                value="1"
              />
          </div>
          <div className='col-xxl-3'>
             <StatisticWidgets
                className='card-xl-stretch mb-5 mb-xl-8'
                svgIcon='abstract-11'
                color='danger'
                iconColor='white'
                titleColor='white'
                description='Inactive Customers'
                descriptionColor='white'
                url='/admin/dashboard/customer_count'
                value="2"
              />
          </div>
           <div className='col-xxl-3'>
             <StatisticWidgets
                className='card-xl-stretch mb-5 mb-xl-8'
                svgIcon='basket-ok'
                color='success'
                iconColor='white'
                titleColor='white'
                description='Active Products'
                descriptionColor='white'
                url='/admin/dashboard/product_count'
                value="1"
              />
          </div>
          <div className='col-xxl-3'>
             <StatisticWidgets
                className='card-xl-stretch mb-5 mb-xl-8'
                svgIcon='abstract-11'
                color='warning'
                iconColor='white'
                titleColor='white'
                description='Inactive Products'
                descriptionColor='white'
                url='/admin/dashboard/product_count'
                value="2"
              />
          </div>
          {/* end::Col  */}
          {/* begin::Col  */}
          {/* <div className='col-xxl-8'>
            <ProductStocksTable
                data={table.data}
                loading={table.loading}
                setRefreshTable={table.setRefreshTable}
              />
          </div> */}
          {/* end::Col  */}
        {/* begin::Col  */}
          {/* <div className='col-xl-4'>
            <FeedbackMixed
              className='card-xl-stretch mb-5 mb-xl-8'
              chartColor='primary'
              chartHeight='225px'
            />
          </div> */}
        {/* end::Col  */}
        </div>
        {/* end::Row  */}

        {/* begin::Row  */}
        <div className='row gy-5 g-xl-8'>
          {/* begin::Col  */}
          {/* <div className='col-xl-12'>
            <ForecastSalesChart/>
          </div> */}
          {/* end::Col  */}
        </div>
        {/* end::Row  */}

      </Content>  
    </>
  )
}

const DashboardWrapper = () => {
  const intl = useIntl()
  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.DASHBOARD'})}</PageTitle>
      <DashboardPage />
    </>
  )
}

export {DashboardWrapper}
