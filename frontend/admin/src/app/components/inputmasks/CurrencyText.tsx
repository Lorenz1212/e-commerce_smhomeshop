import React from 'react'

interface Props {
  value: any
}

export const CurrencyText: React.FC<Props> = ({ value }) => {

  const numericValue = typeof value === 'string' ? parseFloat(value) : value

  const formatted = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
  }).format(numericValue || 0)

  return formatted??0
}
