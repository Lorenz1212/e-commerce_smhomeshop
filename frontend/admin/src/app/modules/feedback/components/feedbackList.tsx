
import { Content } from '@/layout/components/Content'
import {KTIcon, toAbsoluteUrl} from '@/helpers'
import React, { FC,  useEffect, useState  } from 'react'

import { FeedbackModel } from '../core/_model'
import { FeedbackTable } from './tables/FeedbackTable'
import { useTableHook } from '@@@@@@/hooks/useTableHook'
import { StatisticWidgets } from '@@@/StatisticWidgets'

const FeedbackList: FC<{title:string}> = ({title}) => {

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

  const [extraFilter, setExtraFilter] = useState<any>(null);
  const [refreshStat, setRefreshStat] = useState(0)

  const table = useTableHook<FeedbackModel>('/admin/feedback/list',extraFilter)  
 
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackModel | null>(null)
  
  const openModal = (feedback: FeedbackModel) => {
    setSelectedFeedback(feedback)
  }

  const closeModal = () => {
    setSelectedFeedback(null)
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

    setExtraFilter({ start_date: fromDateStr, end_date: toDateStr, period:period });
    setRefreshStat(prev => prev + 1)
  };

  

  return (
    <>
      <Content>
         <div className='row g-5 g-xl-8'>
          {/* begin::Col  */}
          <div className='col-xxl-4'>
             <StatisticWidgets
                className='card-xl-stretch mb-5 mb-xl-8'
                svgIcon='user-tick'
                color='success'
                iconColor='white'
                titleColor='white'
                description='Positive'
                descriptionColor='white'
                url='/admin/feedback/count'
                value={{status:'POSITIVE',extraFilter}}
                refreshStat={refreshStat}
              />
          </div>
           <div className='col-xxl-4'>
             <StatisticWidgets
                className='card-xl-stretch mb-5 mb-xl-8'
                svgIcon='basket-ok'
                color='danger'
                iconColor='white'
                titleColor='white'
                description='Negative'
                descriptionColor='white'
                url='/admin/feedback/count'
                value={{status:'NEGATIVE',extraFilter}}
                refreshStat={refreshStat}
              />
          </div>
          <div className='col-xxl-4'>
             <StatisticWidgets
                className='card-xl-stretch mb-5 mb-xl-8'
                svgIcon='abstract-11'
                color='primary'
                iconColor='white'
                titleColor='white'
                description='Neutral'
                descriptionColor='white'
                url='/admin/feedback/count'
                value={{status:'NEUTRAL',extraFilter}}
                refreshStat={refreshStat}
              />
          </div>
          {/* end::Col  */}
        </div>
         <div className='card mb-5 mb-xl-8'>
          {/* begin::Header */}
          <div className='card-header border-0 pt-5'>
            <h3 className='card-title align-items-start flex-column'>
              <span className='card-label fw-bold fs-3 mb-1'>{title}s</span>
            </h3>
            <div className="card-toolbar ms-auto d-flex justify-content-end">
               <div className="d-flex align-items-end gap-2 mb-4 flex-row-reverse">
                  {/* Filter button (lagi nasa pinaka kanan) */}
                  <button
                    onClick={handleFilter}
                     className="btn btn-xl btn-light-primary d-flex align-items-center gap-2"
                  >
                    <KTIcon iconName="magnifier" className="fs-3" />
                    Filter
                  </button>

                  {/* Date Range */}
                  {period === 'date-range' && (
                    <>
                      <input
                        type="date"
                        className="form-control"
                        value={tmpTo}
                        min={tmpFrom}
                        onChange={(e) => setTmpTo(e.target.value)}
                      />
                      <input
                        type="date"
                        className="form-control"
                        value={tmpFrom}
                        max={tmpTo}
                        onChange={(e) => setTmpFrom(e.target.value)}
                      />
                    </>
                  )}

                  {/* Yearly */}
                  {period === 'yearly' && (
                    <>
                      <input
                        type="number"
                        className="form-control"
                        value={yearTo}
                        onChange={(e) => setYearTo(Number(e.target.value))}
                      />
                      <input
                        type="number"
                        className="form-control"
                        value={year}
                        onChange={(e) => setYear(Number(e.target.value))}
                      />
                    </>
                  )}

                  {/* Monthly */}
                  {period === 'monthly' && (
                    <input
                      type="number"
                      className="form-control"
                      value={year}
                      onChange={(e) => setYear(Number(e.target.value))}
                    />
                  )}

                  {/* Daily */}
                  {period === 'daily' && (
                    <>
                      <input
                        type="number"
                        className="form-control"
                        value={year}
                        onChange={(e) => setYear(Number(e.target.value))}
                      />
                      <select
                        className="form-select"
                        value={month}
                        onChange={(e) => setMonth(Number(e.target.value))}
                      >
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {new Date(0, i).toLocaleString('default', { month: 'long' })}
                          </option>
                        ))}
                      </select>
                    </>
                  )}

                  {/* Period Select (lagi nasa kaliwa ng filter controls) */}
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
            </div>
          </div>
          {/* end::Header */}
          {/* begin::Body */}
          <div className='card-body py-3'>
            {/* begin::Table container */}
            <div className='table-responsive'>
              {/* begin::Table */}
              <FeedbackTable
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
                onView={openModal}
                setRefreshTable={table.setRefreshTable}
              />
              {/* end::Table */}
            </div>
            {/* end::Table container */}
          </div>
          {/* begin::Body */}
        </div>
       {selectedFeedback && (
        <div 
          className="modal fade show d-block" 
          tabIndex={-1} 
          role="dialog" 
          style={{background: "rgba(0,0,0,0.5)"}}
        >
          <div className="modal-dialog modal-md modal-dialog-centered" role="document">
             <div className="modal-content border-0 shadow-lg rounded-3">
                <div className="modal-header border-0">
                  <button type="button" className="btn-close" onClick={closeModal}></button>
                </div>
              <div className="modal-body mb-20 text-center">
                {/* Rating */}
                <div className="mb-10 text-warning fw-bold">
                  {Array.from({length: selectedFeedback.rating}).map((_, i) => (
                    <KTIcon key={i} iconName="star" className="fs-3 me-1 text-warning" />
                  ))}
                </div>

                {/* Full Comment */}
                <p className="text-gray-800">{selectedFeedback.comment}</p>

                {/* Author + Source */}
                <div className="text-muted small mt-10">
                  <div><span>By <strong>{selectedFeedback.author_name}</strong></span></div>
                  <div><span className="ms-3">({selectedFeedback.source.name})</span></div>
                  <div><span className="ms-3">{selectedFeedback.date_posted_format}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </Content>
    </>
  )
}

export {FeedbackList}
