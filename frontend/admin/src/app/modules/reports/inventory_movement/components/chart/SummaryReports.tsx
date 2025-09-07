import React, { useEffect, useRef, useState, FC } from 'react'
import ApexCharts, { ApexOptions } from 'apexcharts'
import { getCSSVariableValue } from '@/assets/ts/_utils'
import { useThemeMode } from '@/partials/layout/theme-mode/ThemeModeProvider'
import api from '@@@@/api'

type ReportSummary = {
  period: string
  in: number
  out: number
}

interface Props {
  fromDate: Date
  toDate: Date
  period: string
  summaryKey: number
}

const SummaryReports: FC<Props> = ({ fromDate, toDate, period, summaryKey }) => {
  const chartRef = useRef<HTMLDivElement | null>(null)
  const chartInstance = useRef<ApexCharts | null>(null)
  const { mode } = useThemeMode()
  const [data, setData] = useState<ReportSummary[]>([])
  const [loading, setLoading] = useState(false)
  const [noDataAvailable, setNoDataAvailable] = useState(0)

  const pad = (n: number) => n.toString().padStart(2, '0')
  const fromDateStr = `${fromDate.getFullYear()}-${pad(fromDate.getMonth() + 1)}-${pad(fromDate.getDate())}`
  const toDateStr = `${toDate.getFullYear()}-${pad(toDate.getMonth() + 1)}-${pad(toDate.getDate())}`

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await api.get('/admin/reports/inventory-movement/summary', {
          params: { start_date: fromDateStr, end_date: toDateStr, period }
        })
        
        const processed: ReportSummary[] = (response.data ?? []).map((d: any) => ({
          period: d.period ?? '',
          in: d.in ?? 0,
          out: d.out ?? 0,
        }))
        if (processed.length === 0) {
          setData([])
          setNoDataAvailable(0)

          // destroy old chart agad
          chartInstance.current?.destroy()
          chartInstance.current = null
        } else {
          setData(processed)
          setNoDataAvailable(processed.length)
        }
        
      } catch (err) {
          setData([])
          setNoDataAvailable(0)

          chartInstance.current?.destroy()
          chartInstance.current = null
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [fromDateStr, toDateStr, period, summaryKey]) // ← kasama refreshKey

  // Chart effect
  useEffect(() => {
    chartInstance.current?.destroy()
    chartInstance.current = null
    
    if (!chartRef.current || data.length === 0 || !data) return

    const height = 350
    const labelColor = getCSSVariableValue('--bs-gray-500')
    const borderColor = getCSSVariableValue('--bs-gray-200')
    const baseColor = getCSSVariableValue('--bs-success')
    const secondaryColor = getCSSVariableValue('--bs-danger')

    const options: ApexOptions = {
      chart: {
        type: 'bar',
        height,
        toolbar: { show: false },
        fontFamily: 'inherit',
      },
      plotOptions: { bar: { horizontal: false, columnWidth: '50%', borderRadius: 5 } },
      series: [
        { name: 'Stock In', data: data.map(d => d.in) },
        { name: 'Stock Out', data: data.map(d => d.out) },
      ],
      xaxis: {
        categories: data.map(d => d.period),
        labels: { style: { colors: labelColor, fontSize: '12px' } },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: { labels: { style: { colors: labelColor, fontSize: '12px' } } },
      colors: [baseColor, secondaryColor],
      dataLabels: { enabled: true },
      stroke: { show: true, width: 2, colors: ['transparent'] },
      tooltip: { y: { formatter: (val) => val.toString() } },
      grid: {
        borderColor,
        strokeDashArray: 4,
        yaxis: { lines: { show: true } },
      },
      legend: { show: true },
      fill: { opacity: 1 },
    }

    chartInstance.current = new ApexCharts(chartRef.current, options)
    chartInstance.current.render()

    return () => {
      chartInstance.current?.destroy()
      chartInstance.current = null
    }
  }, [data, mode, noDataAvailable])

  return (
    <div className="card shadow p-3 mb-5 rounded">
      <div className="card-header border-0 pt-5 d-flex justify-content-between">
        <h3 className="card-title fw-bold fs-3 mb-1">Inventory Movement Summary</h3>
      </div>
      <div className="card-body">
        {loading ? (
          <div className="text-center py-10">Loading...</div>
        ) : noDataAvailable === 0 ? (
          <div className="text-center py-10 text-muted">
            No data available for selected period
          </div>
        ) : (
          <div ref={chartRef} style={{ height: 350 }} />
        )}
      </div>
    </div>
  )
}

export default SummaryReports
