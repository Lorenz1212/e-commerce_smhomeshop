import React, { FC, useState, useEffect } from 'react'
import { Content } from '@/layout/components/Content'
import { useTableHook } from '@@@@@@/hooks/useTableHook'
import { KTIcon } from '@/helpers'
import { OnlineOrderListModel,WalkinOrderListModel } from './core/_model'
import SummaryReports from './components/charts/SummaryReports'
import { OnlineOrderReportTable } from './components/tables/OnlineOrderReportTable'
import { WalkInOrderReportTable } from './components/tables/WalkInOrderReportTable'
import { useOrder } from './core/_request'
import { ModalResponse } from '@@@@/types'
import { ViewOnlineOrderReceipt } from './components/modals/ViewOnlineOrderReceipt'
import { ViewWalkInOrderReceipt } from './components/modals/ViewWalkInOrderReceipt'
import ModalHandler from '@@@/ModalHandler'


const SalesContent: FC<{ title: string }> = ({ title }) => {

  const controller = useOrder()

  const today = new Date()
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)

  const [fromDate, setFromDate] = useState<Date>(startOfMonth)
  const [toDate, setToDate] = useState<Date>(endOfMonth)
  const [period, setPeriod] = useState<'daily' | 'monthly' | 'yearly' | 'date-range'>('daily')
  const [channel, setChannel] = useState<'both' | 'pos' | 'online'>('both')

  const [month, setMonth] = useState(today.getMonth() + 1) // JS month +1
  const [year, setYear] = useState(today.getFullYear())
  const [yearTo, setYearTo] = useState(today.getFullYear())
  const [tmpFrom, setTmpFrom] = useState(startOfMonth.toISOString().split('T')[0])
  const [tmpTo, setTmpTo] = useState(endOfMonth.toISOString().split('T')[0])
  const [summaryKey, setSummaryKey] = useState(0)

  const [extraFilter, setExtraFilter] = useState<any>(null);
    
  const table1 = useTableHook<OnlineOrderListModel>('/admin/reports/sales/online/list',extraFilter)  

  const table2 = useTableHook<WalkinOrderListModel>('/admin/reports/sales/walkin/list',extraFilter)  
    
  const [modalState, setModalState] = useState<ModalResponse>({
    visible: false,
    title: '',
    body: <></>,
    className:'modal-xl',
    alignment:'centered'
  })
  

  const handleOnlineOrderDetails = async  (order_id: string) => {
    const res = await controller.viewOrderDetails(order_id,'online')
    if (!res) return;
    setModalState({
      visible: true,
      title: 'View Receipt',
      body: <ViewOnlineOrderReceipt data={res} />,
      className:'modal-xl',
      alignment:'centered'
    })
  }

  const handleWalkinOrderDetails = async  (order_id: string) => {
    const res = await controller.viewOrderDetails(order_id,'walkin')
    if (!res) return;
    setModalState({
      visible: true,
      title: 'View Receipt',
      body: <ViewWalkInOrderReceipt data={res} />,
      className:'modal-xl',
      alignment:'centered'
    })
  }

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

    setExtraFilter({ start_date: fromDateStr, end_date: toDateStr, period:period, channel:channel });
    setSummaryKey(prev => prev + 1)
  };

  return (
    <Content>
      {/* 🔥 Filters */}
      <div className="row mb-4 align-items-end">
        <div className="col-md-2">
              <select
                className="form-select"
                onChange={(e) => setChannel(e.target.value as any)}
              >
              <option value="both">Both</option>
              <option value="pos">Online Order</option>
              <option value="online">In Store Order</option>
            </select>
        </div>
        {/* Period Select */}
        <div className="col-md-2">
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
            <div className="col-md-2">
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
            <div className="col-md-2">
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
          <div className="col-md-2">
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
            <div className="col-md-2">
              <input
                type="number"
                className="form-control"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
              />
            </div>
            <div className="col-md-2">
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
            <div className="col-md-2">
              <input
                type="date"
                className="form-control"
                value={tmpFrom}
                max={tmpTo}
                onChange={(e) => setTmpFrom(e.target.value)}
              />
            </div>
            <div className="col-md-2">
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
        <div className="col-md-2">
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
          <SummaryReports fromDate={fromDate} toDate={toDate} period={period} channel={channel} summaryKey={summaryKey}/>
        </div>
      </div>

      {/* Table */}
      <div className="row ">
        <div className="col-xxl-12">
          <div className="card mb-5 mb-xl-8  pt-10">
            <div className='card-header border-0 pt-5'>
              <h3 className='card-title align-items-start flex-column'>
                <span className='card-label fw-bold fs-3 mb-1'>Online Order</span>
              </h3>
            </div>
            <div className="card-body py-3">
              <div className="table-responsive">
               <OnlineOrderReportTable
                    data={table1.data}
                    loading={table1.loading}
                    pagination={table1.pagination}
                    sortColumn={table1.sortColumn}
                    sortDirection={table1.sortDirection}
                    onPageChange={table1.setPage}
                    onSortChange={(col, dir) => {
                      table1.setSortColumn(col)
                      table1.setSortDirection(dir)
                    }}
                    onView={handleOnlineOrderDetails}
                    onSearchChange={(val) => {
                      table1.setPage(1)
                      table1.setSearch(val)
                    }}
                    setRefreshTable={table1.setRefreshTable}
                  />
              </div>
            </div>
          </div>
        </div>
      </div>
       <div className="row ">
        <div className="col-xxl-12">
          <div className="card mb-5 mb-xl-8  pt-10">
            <div className='card-header border-0 pt-5'>
              <h3 className='card-title align-items-start flex-column'>
                <span className='card-label fw-bold fs-3 mb-1'>In Store Order</span>
              </h3>
            </div>
            <div className="card-body py-3">
              <div className="table-responsive">
               <WalkInOrderReportTable
                    data={table2.data}
                    loading={table2.loading}
                    pagination={table2.pagination}
                    sortColumn={table2.sortColumn}
                    sortDirection={table2.sortDirection}
                    onPageChange={table2.setPage}
                    onSortChange={(col, dir) => {
                      table1.setSortColumn(col)
                      table1.setSortDirection(dir)
                    }}
                    onView={handleWalkinOrderDetails}
                    onSearchChange={(val) => {
                      table1.setPage(1)
                      table1.setSearch(val)
                    }}
                    setRefreshTable={table1.setRefreshTable}
                  />
              </div>
            </div>
          </div>
        </div>
      </div>
      {modalState.visible && (
          <ModalHandler
            title={modalState.title}
            body={modalState.body}
            modalClass={modalState.className}
            alignment={modalState.alignment}
            onClose={() =>
              setModalState({
                visible: false,
                title: '',
                body: <></>,
                className: '',
                alignment: 'center',
              })
            }
          />
      )}
    </Content>
  )
}

export { SalesContent }
