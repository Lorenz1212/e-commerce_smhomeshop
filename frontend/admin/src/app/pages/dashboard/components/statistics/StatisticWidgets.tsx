
import { KTIcon } from '@/helpers'
import api from '@@@@/api'
import axios from 'axios'
import React, { useEffect, useState } from 'react'


type Props = {
  className: string
  color: string
  svgIcon: string
  iconColor: string
  titleColor?: string
  description: string
  descriptionColor?: string
  url:string
  value:string
}

const StatisticWidgets: React.FC<Props> = ({
  className,
  color,
  svgIcon,
  iconColor,
  titleColor,
  description,
  descriptionColor,
  url,
  value,
}) => {

  const [data, setData] = useState(0)

  const getCount = async ()=>{
     const formData = new FormData()
     formData.append('status', value);
     const response = await api.post(url,formData);
     setData(response.data)
  }

  useEffect(() => {
    getCount()
  }, [])

  return (
    <a href='#' className={`card bg-${color} hoverable ${className} shadow p-3 mb-5 rounded`}>
      <div className='card-body'>
        <KTIcon iconName={svgIcon} className={`text-${iconColor} fs-3x ms-n1`} />

        <div className={`text-${titleColor} fw-bold fs-2 mb-2 mt-5`}>{data}</div>

        <div className={`fw-semibold text-${descriptionColor}`}>{description}</div>
      </div>
    </a>
  )
}

export {StatisticWidgets}
