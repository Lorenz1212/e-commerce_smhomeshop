import { FC } from 'react'

type Props = {
  color?: string
  title?: string
}

const StatusCell: FC<Props> = ({ color, title }) => {
  return (
    <span className={`badge badge-light-${color} fs-7 fw-semibold`}>
      {title}
    </span>
  )
}

export { StatusCell }
