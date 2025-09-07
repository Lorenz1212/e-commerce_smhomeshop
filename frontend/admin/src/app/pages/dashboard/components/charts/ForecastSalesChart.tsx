import React, {useEffect, useRef, useState} from 'react'
import ApexCharts, {ApexOptions} from 'apexcharts'
import {getCSSVariableValue} from '@/assets/ts/_utils'
import {useThemeMode} from '@/partials/layout/theme-mode/ThemeModeProvider'
import clsx from 'clsx'
import {KTIcon} from '@/helpers'
import {DropdownFilter} from './filter/DropdownFilter'
import api from '@@@@/api'

// Types
type Forecast = {
  day: string
  forecast: number
}

type Historical = {
  date: string
  total_sales: number
}

// 👉 helper para makuha start at end of current month
const getDefaultDateRange = () => {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), 1) // unang araw ng buwan
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0) // huling araw ng buwan
  return {start, end}
}

const ForecastSalesChart: React.FC = () => {
  const chartRef = useRef<HTMLDivElement | null>(null)
  const {mode} = useThemeMode()

  const [historicalData, setHistoricalData] = useState<Historical[]>([])
  const [forecastData, setForecastData] = useState<Forecast[]>([])
  const [loading, setLoading] = useState(false)

  // Filters with defaults (always Date, never undefined)
  const {start, end} = getDefaultDateRange()
  const [storeId, setStoreId] = useState<number>(1)
  const [fromDate, setFromDate] = useState<Date>(start)
  const [toDate, setToDate] = useState<Date>(end)
  const [channel, setChannel] = useState<'pos' | 'online' | 'both'>('both')

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await api.post('/admin/dashboard/forcasting_sales', {
        store_id: storeId,
        from_date: fromDate, // laging Date
        to_date: toDate,     // laging Date
        channel: channel,
      })

      setHistoricalData(response.data.historical_sales)
      setForecastData(response.data.forecast)
    } catch (error) {
      console.error('Failed to fetch forecast data', error)
    } finally {
      setLoading(false)
    }
  }

  const renderChart = () => {
    if (!chartRef.current) return

    const allDates = [
      ...historicalData.map(d => d.date),
      ...forecastData.map(f => f.day),
    ]

    const historicalSales = historicalData.map(d => d.total_sales)
    const forecastSales = forecastData.map(f => f.forecast)

    const options: ApexOptions = {
      chart: {
        type: 'line',
        height: 350,
        toolbar: {show: false},
        fontFamily: 'inherit',
      },
      stroke: {
        curve: 'smooth',
        width: 3,
      },
      xaxis: {
        categories: allDates,
        labels: {
          rotate: -45,
          style: {
            colors: getCSSVariableValue('--bs-gray-500'),
            fontSize: '12px',
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: getCSSVariableValue('--bs-gray-500'),
            fontSize: '12px',
          },
        },
      },
      colors: [
        getCSSVariableValue('--bs-primary'),
        getCSSVariableValue('--bs-warning'),
      ],
      tooltip: {
        y: {
          formatter: val => `₱${val}`,
        },
      },
      series: [
        {
          name: 'Historical Sales',
          data: historicalSales,
        },
        {
          name: 'Forecast',
          data: [
            ...Array(historicalSales.length).fill(0),
            ...forecastSales,
          ],
        },
      ],
    }

    const chart = new ApexCharts(chartRef.current, options)
    chart.render()

    return chart
  }

  // 🔥 fetch agad on load + every time filters change
  useEffect(() => {
    fetchData()
  }, [storeId, fromDate, toDate, channel])

  // 🔥 redraw chart kapag data/mode nagbago
  useEffect(() => {
    const chart = renderChart()
    return () => chart?.destroy()
  }, [historicalData, forecastData, mode])

  return (
    <div className='card shadow p-3 mb-5 rounded'>
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title fw-bold fs-3 mb-1'>Sales Forecasting</h3>
        <div className='card-toolbar'>
          {/* begin::Menu  */}
          <button
            type='button'
            className={clsx(
              'btn btn-sm btn-icon btn-active-success',
              'border-0 me-n3'
            )}
            data-kt-menu-trigger='click'
            data-kt-menu-placement='bottom-end'
            data-kt-menu-flip='top-end'
          >
            <KTIcon iconName='category' className='fs-2' />
          </button>
          <DropdownFilter
            onApply={(filters) => {
              setStoreId(Number(filters.store_id))
              setFromDate(new Date(filters.from_date || start))
              setToDate(new Date(filters.to_date || end))
              setChannel(filters.channel)
            }}
          />
          {/* end::Menu  */}
        </div>
      </div>

      <div className='card-body'>
        {loading ? (
          <div className='text-center py-10'>Loading chart...</div>
        ) : (
          <> 
          <div className='mt-6 text-center border-top pt-4'>
              <h4 className='fw-bold fs-4'>
                Total Sales:{' '}
                <span className='text-primary'>
                  ₱
                  {historicalData
                    .reduce((sum, d) => sum + d.total_sales, 0)
                    .toLocaleString()}
                </span>
              </h4>
            </div>
          <div ref={chartRef} style={{height: 350}} />
          </>
        )}
      </div>
    </div>
  )
}

export default ForecastSalesChart
