import React, {createContext, useContext, useState} from 'react'
import FullPageLoader from './loader/FullPageLoader'

const LoaderContext = createContext({
  showLoader: () => {},
  hideLoader: () => {},
})

export const useLoader = () => useContext(LoaderContext)

export const LoaderProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [visible, setVisible] = useState(false)

  const showLoader = () => setVisible(true)
  const hideLoader = () => setVisible(false)

  return (
    <LoaderContext.Provider value={{showLoader, hideLoader}}>
      {children}
      {visible && <FullPageLoader />}
    </LoaderContext.Provider>
  )
}
