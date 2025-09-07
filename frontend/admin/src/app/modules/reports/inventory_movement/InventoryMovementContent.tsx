import React, { FC, useState, useEffect } from 'react'
import { Content } from '@/layout/components/Content'
import { useTableHook } from '@@@@@@/hooks/useTableHook'
import { InventoryMovementReportModel } from './core/_model'
import { InventoryMovementReportTable } from './components/tables/InventoryMovementReportTable'
import SummaryReports from './components/chart/SummaryReports'
import { KTIcon } from '@/helpers'

const InventoryMovementContent: FC<{ title: string }> = ({ title }) => {

  const today = new Date()
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)

  const [fromDate, setFromDate] = useState<Date>(startOfMonth)
  const [toDate, setToDate] = useState<Date>(endOfMonth)
  const [period, setPeriod] = useState<'daily' | 'monthly' | 'yearly' | 'date-range'>('daily')

  const [month, setMonth] = useState(today.getMonth() + 1) // JS month +1
  const [year, setYear] = useState(today.getFullYear())
  const [yearTo, setYearTo] = useState(today.getFullYear())
  const [tmpFrom, setTmpFrom] = useState(startOfMonth.toISOString().split('T')[0])
  const [tmpTo, setTmpTo] = useState(endOfMonth.toISOString().split('T')[0])
  const [summaryKey, setSummaryKey] = useState(0)


  const [extraFilter, setExtraFilter] = useState<any>(null);
    
  const table = useTableHook<InventoryMovementReportModel>('/admin/reports/inventory-movement/list',extraFilter)  

  useEffect(() => {
    handleFilter()
  }, [])

  const handleFilter = () => {
    let firstDay: Date, lastDay: Date;

    if (period === 'daily') {
      firstDay = new Date(year, month - 1, 1);
      lastDay = new Date(year, month, 0);
    } else if (period === 'monthly') {
      firstDay = new Date(year, 0, 1);
      lastDay = new Date(year, 11, 31);
    } else if (period === 'yearly') {
      firstDay = new Date(year, 0, 1);
      lastDay = new Date(yearTo, 11, 31);
    } else {
      // date-range
      firstDay = new Date(tmpFrom);
      lastDay = new Date(tmpTo);
    }

    setFromDate(firstDay);
    setToDate(lastDay);

    const pad = (n: number) => n.toString().padStart(2, '0');
    const fromDateStr = `${firstDay.getFullYear()}-${pad(firstDay.getMonth() + 1)}-${pad(firstDay.getDate())}`;
    const toDateStr = `${lastDay.getFullYear()}-${pad(lastDay.getMonth() + 1)}-${pad(lastDay.getDate())}`;

    setExtraFilter({ start_date: fromDateStr, end_date: toDateStr, period:period });
     setSummaryKey(prev => prev + 1)
  };

  return (
    <Content>
      {/* 🔥 Filters */}
      <div className="row mb-4 align-items-end">
        {/* Period Select */}
        <div className="col-md-3">
          <select
            className="form-select"
            value={period}
            onChange={(e) => setPeriod(e.target.value as any)}
          >
            <option value="daily">Daily</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
            <option value="date-range">Date Range</option>
          </select>
        </div>

        {/* Daily (month + year) */}
        {period === 'daily' && (
          <>
            <div className="col-md-3">
              <select
                className="form-select"
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(0, i).toLocaleString('default', {
                      month: 'long',
                    })}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <input
                type="number"
                className="form-control"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
              />
            </div>
          </>
        )}

        {/* Monthly (year only) */}
        {period === 'monthly' && (
          <div className="col-md-3">
            <input
              type="number"
              className="form-control"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            />
          </div>
        )}

        {/* Yearly (year range) */}
        {period === 'yearly' && (
          <>
            <div className="col-md-3">
              <input
                type="number"
                className="form-control"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
              />
            </div>
            <div className="col-md-3">
              <input
                type="number"
                className="form-control"
                value={yearTo}
                onChange={(e) => setYearTo(Number(e.target.value))}
              />
            </div>
          </>
        )}

        {/* Date Range */}
        {period === 'date-range' && (
          <>
            <div className="col-md-3">
              <input
                type="date"
                className="form-control"
                value={tmpFrom}
                max={tmpTo}
                onChange={(e) => setTmpFrom(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <input
                type="date"
                className="form-control"
                value={tmpTo}
                min={tmpFrom}
                onChange={(e) => setTmpTo(e.target.value)}
              />
            </div>
          </>
        )}

        {/* Filter button */}
        <div className="col-md-3">
          <button
            onClick={handleFilter}
            className="btn btn-xl btn-light-primary"
          >
            <KTIcon iconName="magnifier" className="fs-3" />
            Filter
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="row">
        <div className="col-xxl-12">
          <SummaryReports fromDate={fromDate} toDate={toDate} period={period} summaryKey={summaryKey}/>
        </div>
      </div>

      {/* Table */}
      <div className="row ">
        <div className="col-xxl-12">
          <div className="card mb-5 mb-xl-8  pt-10">
            <div className="card-body py-3">
              <div className="table-responsive">
                <InventoryMovementReportTable
                  data={table.data}
                  loading={table.loading}
                  pagination={table.pagination}
                  sortColumn={table.sortColumn}
                  sortDirection={table.sortDirection}
                  onPageChange={table.setPage}
                  onSortChange={(col, dir) => {
                    table.setSortColumn(col)
                    table.setSortDirection(dir)
                  }}
                  setRefreshTable={table.setRefreshTable}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Content>
  )
}

export { InventoryMovementContent }
