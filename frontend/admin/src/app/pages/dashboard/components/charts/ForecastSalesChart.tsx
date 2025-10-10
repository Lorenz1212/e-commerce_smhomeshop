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
  date: string
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

  // 🔥 Fetch data from backend
  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await api.post('/admin/dashboard/forcasting_sales', {
        store_id: storeId,
        from_date: fromDate,
        to_date: toDate,
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

  // 🔥 Render chart
  const renderChart = () => {
    if (!chartRef.current) return

    const allDates = Array.from(
      new Set([
        ...historicalData.map(d => d.date),
        ...forecastData.map(f => f.date),
      ])
    ).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    const historicalSales = historicalData.map(d => d.total_sales)
    const forecastSales = forecastData.map(f => f.forecast)

    // Find kung saan sa allDates nagsisimula ang unang forecast date
    const forecastStartDate = forecastData[0]?.date
    const forecastStartIndex = allDates.findIndex(date => date === forecastStartDate)

    // Build forecast series na aligned sa tamang date
   const forecastSeries = allDates.map(date => {
      const forecastItem = forecastData.find(f => f.date === date)
      return forecastItem ? forecastItem.forecast : 0
    })
     console.log(forecastSeries);

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
        getCSSVariableValue('--bs-primary'), // blue
        getCSSVariableValue('--bs-warning'), // yellow
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
          data: forecastSeries,
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

  // 👉 compute total + simple interpretation
  const totalSales = historicalData.reduce((sum, d) => sum + d.total_sales, 0)
  const avgForecast =
    forecastData.reduce((sum, f) => sum + f.forecast, 0) /
    (forecastData.length || 1)
  const trend =
    avgForecast > 0
      ? avgForecast > totalSales / historicalData.length
        ? 'expected to increase'
        : 'expected to slightly decrease'
      : 'not enough data for forecasting'

  return (
    <div className='card shadow p-3 mb-5 rounded'>
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title fw-bold fs-3 mb-1'>Sales Forecasting</h3>
        <div className='card-toolbar'>
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
                  ₱{totalSales.toLocaleString()}
                </span>
              </h4>
            </div>
            <div ref={chartRef} style={{height: 350}} />

            {/* 🧠 Interpretation Section */}
           {forecastData.length > 0 && (
              <div className="mt-6 p-4 bg-light rounded border">
                <h5 className="fw-bold mb-2">Sales Forecast Interpretation</h5>
                {(() => {
                  const first = forecastData[0].forecast
                  const last = forecastData[forecastData.length - 1].forecast

                  let trend = ''
                  if (last > first) {
                    trend = 'increasing trend'
                  } else if (last < first) {
                    trend = 'decreasing trend'
                  } else {
                    trend = 'steady trend'
                  }

                  return (
                    <p className="mb-0">
                      Based on your recent sales data, the forecast shows a <b>{trend} </b> 
                      for the next {forecastData.length} days — starting from 
                      <b> ₱{first.toLocaleString()}</b> on 
                      <b> {forecastData[0].date}</b> to 
                      <b> ₱{last.toLocaleString()}</b> by 
                      <b> {forecastData[forecastData.length - 1].date}</b>.
                      <br />
                      {trend === 'increasing trend'
                        ? 'Great job! Keep the momentum going by maintaining strong promotions and product availability.'
                        : trend === 'decreasing trend'
                        ? 'Sales are expected to slow down — consider re-engaging customers through discounts or campaigns.'
                        : 'Sales are projected to remain stable — continue monitoring for upcoming changes.'}
                    </p>
                  )
                })()}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default ForecastSalesChart
