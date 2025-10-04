import { FC } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../modules/Authentication'

const PrivateRoutes: FC = () => {
  const { currentUser } = useAuth()

  if (!currentUser) return <Navigate to="/login-signup" replace />

  return <Outlet />
}

export { PrivateRoutes }
