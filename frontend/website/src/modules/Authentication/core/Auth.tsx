/* eslint-disable react-refresh/only-export-components */
import {FC, useState, useEffect, createContext, useContext, Dispatch, SetStateAction, ReactNode } from 'react'
import {AuthModel, UserModel} from './_models'
import * as authHelper from './AuthHelpers'
import {getUserByToken} from './_requests'
import { ApiResponse } from 'src/utils/types'
import FullPageLoader from '@/components/loader/pageloader/FullPageLoader'

type WithChildren = { children?: ReactNode }

type AuthContextProps = {
  auth: ApiResponse<AuthModel> | undefined
  saveAuth: (auth: ApiResponse<AuthModel> | undefined) => void
  currentUser: UserModel | undefined
  setCurrentUser: Dispatch<SetStateAction<UserModel | undefined>>
  logout: () => void
  requestUser: (apiToken: any) => Promise<void>
}

const initAuthContextPropsState = {
  auth: authHelper.getAuth(),
  saveAuth: () => {},
  currentUser: undefined,
  setCurrentUser: () => {},
  logout: () => {},
  requestUser: async () => {}
}

const AuthContext = createContext<AuthContextProps>(initAuthContextPropsState)

const useAuth = () => {
  return useContext(AuthContext)
}

const AuthProvider: FC<WithChildren> = ({children}) => {
  const [auth, setAuth] = useState<ApiResponse<AuthModel> | undefined>(authHelper.getAuth())
  const [currentUser, setCurrentUser] = useState<UserModel | undefined>()
  const saveAuth = (auth: ApiResponse<AuthModel> | undefined) => {
    setAuth(auth)
    if (auth) {
      authHelper.setAuth(auth)
    } else {
      authHelper.removeAuth()
    }
  }

  const logout = () => {
    saveAuth(undefined)
    setCurrentUser(undefined)
  }

  const requestUser = async (apiToken: any) => {
    try {
      const { data } = await getUserByToken(apiToken)
      if (data) {
        setCurrentUser(data?.user)
      }
    } catch (error) {
      if (currentUser) logout()
    }
  }

  return (
    <AuthContext.Provider value={{auth, saveAuth, currentUser, setCurrentUser, logout, requestUser}}>
      {children}
    </AuthContext.Provider>
  )
}

const AuthInit: FC<WithChildren> = ({children}) => {
  const {auth, currentUser, logout, setCurrentUser} = useAuth()
  const [showSplashScreen, setShowSplashScreen] = useState(true)
  const [loadingUser, setLoadingUser] = useState(true)


  // We should request user by authToken (IN OUR EXAMPLE IT'S API_TOKEN) before rendering the application
  useEffect(() => {
    const requestUser = async (apiToken: any) => {
      try {
        if (!currentUser) {
          const {data} = await getUserByToken(apiToken)
          if (data) {
            setCurrentUser(data?.user)
          }
        }
      } catch (error) {
        if (typeof currentUser == 'undefined' || currentUser) {
          logout()
        }
      } finally {
        setLoadingUser(false)
        setShowSplashScreen(false)
      }
    }
    if (auth) {
      requestUser(auth)
    } else {
      logout()
      setShowSplashScreen(false)
      setLoadingUser(false)

    }
    // eslint-disable-next-line
  }, [])

  return auth && (showSplashScreen || !currentUser) ? <FullPageLoader /> : <>{children}</>
}

export {AuthProvider, AuthInit, useAuth}
