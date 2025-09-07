import {useEffect, useRef, FC, useState} from 'react'
import ApexCharts, {ApexOptions} from 'apexcharts'
import { getCSSVariableValue } from '@/assets/ts/_utils'
import { KTIcon } from '@/helpers'
import { useThemeMode } from '@/partials/layout/theme-mode/ThemeModeProvider'
import api from '@@@@/api'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

type Props = {
  className: string
  chartColor: string
  chartHeight: string
}

type FeedbackModel = {
  total: number
  positive: number
  negative: number
  neutral:number
}

type FeedbackItem = {
  id:string
  rating: number
  comment: string
  author_name:string
  date_posted:string
  source: string
}

const FeedbackMixed: FC<Props> = ({className, chartColor, chartHeight}) => {
  const chartRef = useRef<HTMLDivElement | null>(null)
  const {mode} = useThemeMode();

  const [data, setData] = useState<FeedbackModel>()
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([])
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null)


  const getFeedbackStats  = async ()=>{
     const formData = new FormData()
     const response = await api.post('/admin/dashboard/feedback_stats',formData);
     setData(response.data)
  }

  const getFeedback = async ()=>{
     const response = await api.post('/admin/dashboard/recent_feedback', new FormData());
     setFeedbacks(response.data)
  }

  const openModal = (feedback: FeedbackItem) => {
    setSelectedFeedback(feedback)
  }

  const closeModal = () => {
    setSelectedFeedback(null)
  }

  const refreshChart = () => {
    if (!chartRef.current || !data) {
      return
    }

    const chart = new ApexCharts(chartRef.current, chartOptions(data, chartHeight))
    if (chart) {
      chart.render()
    }

    return chart
  }

  useEffect(() => {
    getFeedbackStats();
    getFeedback();
  }, [])

  useEffect(() => {
    const chart = refreshChart()
    return () => {
      if (chart) {
        chart.destroy()
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartRef, mode, data])

  return (
    <div className={`card ${className} shadow`}>
      {/* begin::Header  */}
      <div className={`card-header border-0 bg-${chartColor} py-5`}>
        <h3 className='card-title fw-bold text-white'>Sentiment Distribution</h3>
      </div>
      {/* end::Header  */}

      {/* begin::Body  */}
      <div className='card-body p-0'>
        {/* begin::Chart  */}
        <div
          ref={chartRef}
          className={`mixed-widget-12-chart card-rounded-bottom bg-${chartColor}`}
        ></div>
        {/* end::Chart  */}

        {/* begin::Stats  */}
        <div className='card-rounded bg-body mt-n10 position-relative card-px py-15'>
          {/* begin::Row  */}
          <div className='row g-0 mb-7'>
            <div className='col mx-5'>
              <div className='fs-6 text-gray-500'><KTIcon iconName='arrow-mix' className='fs-2' /> Total</div>
              <div className='fs-2 fw-bold text-gray-800'>{data?.total??0}</div>
            </div>

            <div className='col mx-5'>
              <div className='fs-6 text-gray-500'><KTIcon iconName='double-check-circle' className='fs-2' /> Positive</div>
              <div className='fs-2 fw-bold text-gray-800'>{data?.positive??0}</div>
            </div>
          </div>

          <div className='row g-0'>
            <div className='col mx-5'>
              <div className='fs-6 text-gray-500'><KTIcon iconName='cross-circle' className='fs-2' /> Negative</div>
              <div className='fs-2 fw-bold text-gray-800'>{data?.negative??0}</div>
            </div>

            <div className='col mx-5'>
              <div className='fs-6 text-gray-500'><KTIcon iconName='arrows-circle' className='fs-2' /> Neutral</div>
              <div className='fs-2 fw-bold text-gray-800'>{data?.neutral??0}</div>
            </div>
          </div>
          
        </div>
          {/* Feedback Slides */}
          {feedbacks.length > 0 && (
            <div className="px-5 pb-5">
              <h4 className="fw-bold mb-3">Recent Feedbacks</h4>
              <Swiper spaceBetween={16} slidesPerView={1}>
                {feedbacks.map(fb => (
                  <SwiperSlide key={fb.id}>
                    <div className="p-5 border rounded bg-light">
                      {/* Author + Stars */}
                      <div className="mb-2 d-flex justify-content-between align-items-center">
                        <div className="fw-semibold text-success">
                          {fb.author_name}<small className='text-gray-400'>  {fb.date_posted}</small>
                          <div>
                            <small className='text-gray-400'>  {fb.source}</small>
                          
                          </div>
                          
                          </div>
                        <div>
                          {Array.from({ length: fb.rating }).map((_, i) => (
                            <KTIcon
                              key={i}
                              iconName="star"
                              className="fs-3 me-1 text-warning"
                            />
                          ))}
                        </div>
                      </div>
                      {/* Comment */}
                      <p className="text-gray-700">
                        {fb.comment.length > 120 ? fb.comment.substring(0,120)+"..." : fb.comment}
                      </p>
                      <a onClick={() => openModal(fb)}  className="text-primary fw-semibold cursor-pointer">View Feedback</a>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
        {/* end::Stats  */}
      </div>
      {/* end::Body  */}
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
                  <div><span className="ms-3">({selectedFeedback.source})</span></div>
                  <div><span className="ms-3">{selectedFeedback.date_posted}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const chartOptions = (data: FeedbackModel, chartHeight: string): ApexOptions => {
  const labelColor = getCSSVariableValue('--bs-gray-500')
  const borderColor = getCSSVariableValue('--bs-gray-200')

  return {
    series: [
      data?.positive ?? 0,
      data?.negative ?? 0,
      data?.neutral ?? 0,
    ],
    chart: {
      fontFamily: 'inherit',
      type: 'donut', // or 'pie'
      height: chartHeight,
    },
    labels: ['Positive', 'Negative', 'Neutral'],
    legend: {
      show: true,
      position: 'bottom',
      labels: {
        colors: labelColor,
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '12px',
      },
      formatter: (val: number) => `${val.toFixed(1)}%`,
    },
    stroke: {
      show: true,
      width: 1,
      colors: [borderColor],
    },
    colors: ['#16a34a', '#dc2626', '#facc15'], // green, red, yellow
    tooltip: {
      y: {
        formatter: function (val) {
          return val + ' feedbacks'
        },
      },
    },
  }
}

export {FeedbackMixed}
