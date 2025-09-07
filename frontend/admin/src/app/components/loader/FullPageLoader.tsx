import React from 'react'
import styles from '@/assets/sass/pageloaders/LoadingSpinner.module.scss'

const FullPageLoader = () => {
  return (
    <div className={styles['fullscreen-loader']}>
      <div className={styles.loader}></div>
    </div>
  )
}

export default FullPageLoader
