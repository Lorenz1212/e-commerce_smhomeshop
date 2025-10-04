import { FC } from 'react'
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom'
import { PrivateRoutes } from './PrivateRoutes'

import { App } from '../App'
import Error from '../modules/Error/Error'
import { Logout, useAuth } from '../modules/Authentication'

import NotFound from '../Pages/NotFound'
import BlogDetails from '../modules/Blog/BlogDetails/BlogDetails'
import TermsConditions from '../Pages/TermsConditions'
import ProductDetails from '../Pages/ProductDetails'
import Contact from '../Pages/Contact'
import Blog from '../Pages/Blog'
import Home from '../Pages/Home'
import About from '../Pages/About'
import Shop from '../Pages/Shop'
import Authentication from '../Pages/Authentication'
import ResetPass from '../modules/Authentication/Reset/ResetPass'
import ShoppingCart from '@/modules/ShoppingCart/ShoppingCart'

const { BASE_URL } = import.meta.env

const AppRoutes: FC = () => {
  const { currentUser } = useAuth()

  return (
    <BrowserRouter basename={BASE_URL}>
      <Routes>
        {/* Main layout */}
        <Route element={<App />}>
          {/* Public routes */}
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="error/*" element={<Error />} />
          <Route path="logout" element={<Logout />} />
          <Route path="blogDetails" element={<BlogDetails />} />
          <Route path="terms" element={<TermsConditions />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="contact" element={<Contact />} />
          <Route path="blog" element={<Blog />} />
          <Route path="about" element={<About />} />
          <Route path="shop/:category" element={<Shop />} />
          <Route path="/resetPassword" element={<ResetPass />} />
          {/* Auth route */}
          {!currentUser && <Route path="login-signup" element={<Authentication />} />}

          {/* Private routes */}
          {currentUser && (
            <Route element={<PrivateRoutes />}>
              {/* Protected paths live INSIDE PrivateRoutes */}
              <Route path="cart" element={<ShoppingCart/>}/>
              <Route path="resetPassword" />
            </Route>
          )}

          {/* 404 Fallback */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export { AppRoutes }
