
import { KTIcon } from '@/helpers'
import api from '@@@@/api'
import React, { useEffect, useState } from 'react'
import { Smile, Frown, Meh } from "lucide-react"


type Props = {
  className: string
  color: string
  svgIcon: string
  iconColor: string
  titleColor?: string
  description: string
  descriptionColor?: string
  url:string
  value:any
  refreshStat:number
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
  refreshStat
}) => {

  const [data, setData] = useState(0)

const getSentimentIcon = () => {
    if (description.toLowerCase() === 'positive') {
        return <span className="fs-3x">😊</span>
    }
    if (description.toLowerCase() === 'negative') {
        return <span className="fs-3x">😞</span>
    }
    if (description.toLowerCase() === 'neutral') {
        return <span className="fs-3x">😐</span>
    }
    return <KTIcon iconName={svgIcon} className={`text-${iconColor} fs-3x ms-n1`} />
}

useEffect(() => {
    const getCount = async () => {
        try {
            if(value.extraFilter){
                const response = await api.post(url, value)
                setData(response.data)
            }
        } catch (err) {
            console.error("Failed to fetch stats:", err)
            setData(0)
        }
    }
    getCount()
}, [refreshStat])

  return (
    <a href='#' className={`card bg-${color} hoverable ${className} shadow p-3 mb-5 rounded`}>
      <div className='card-body'>

        {getSentimentIcon()}

        <div className={`text-${titleColor} fw-bold fs-2 mb-2 mt-5`}>{data}</div>

        <div className={`fw-semibold text-${descriptionColor}`}>{description}</div>
      </div>
    </a>
  )
}

export {StatisticWidgets}
