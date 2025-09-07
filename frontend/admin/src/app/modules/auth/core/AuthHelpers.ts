/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiResponse } from '@@@@/types';
import {AuthModel} from './_models'
import { setAuthToken } from '@@@@/api';

const AUTH_LOCAL_STORAGE_KEY = import.meta.env.VITE_APP_TOKEN_NAME;

const getAuth = (): ApiResponse<AuthModel> | undefined => {
  if (!localStorage) {
    return
  }

  const lsValue: string | null = localStorage.getItem(AUTH_LOCAL_STORAGE_KEY)
  if (!lsValue) {
    return
  }

  try {
    const auth: ApiResponse<AuthModel> = JSON.parse(lsValue) as ApiResponse<AuthModel>
    if (auth) {
      // You can easily check auth_token expiration also
      return auth
    }
  } catch (error) {
    console.error('AUTH LOCAL STORAGE PARSE ERROR', error)
  }
}

const setAuth = (auth: ApiResponse<AuthModel>) => {
  if (!localStorage) {
    return
  }

  try {
    const lsValue = JSON.stringify(auth.result.api_token)
    setAuthToken(lsValue);
    localStorage.setItem(AUTH_LOCAL_STORAGE_KEY, lsValue)
  } catch (error) {
    console.error('AUTH LOCAL STORAGE SAVE ERROR', error)
  }
}

const removeAuth = () => {
  if (!localStorage) {
    return
  }

  try {
    localStorage.removeItem(AUTH_LOCAL_STORAGE_KEY)
  } catch (error) {
    console.error('AUTH LOCAL STORAGE REMOVE ERROR', error)
  }
}

export function setupAxios(axios: any) {
  axios.defaults.headers.Accept = 'application/json'
  axios.interceptors.request.use(
    (config: {headers: {Authorization: string}}) => {
      const auth = getAuth()
      if (auth) {
        config.headers.Authorization = `Bearer ${auth}`
      }

      return config
    },
    (err: any) => Promise.reject(err)
  )
}

export {getAuth, setAuth, removeAuth, AUTH_LOCAL_STORAGE_KEY}
