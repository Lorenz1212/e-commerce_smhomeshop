import {Suspense} from 'react'
import {Outlet} from 'react-router-dom'
import { LoaderProvider } from './components/LoaderContext'
import { DefinersProvider } from './components/DefinersContext'
import { AuthInit } from './modules/Authentication/core/Auth'
import FullPageLoader from './components/loader/pageloader/FullPageLoader'
import Popup from './modules/PopupBanner/Popup'
import ScrollToTop from './modules/ScrollButton/ScrollToTop'
import Header from "./modules/Header/Navbar";
import Footer from './modules/Footer/Footer'
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import store from "./App/store";
import "./App.css";

const App = () => {
  return (
    <Suspense fallback={<FullPageLoader />}>
       <Provider store={store}>
        <LoaderProvider>
          <DefinersProvider>
            <AuthInit>
              {/* <Popup /> */}
              <ScrollToTop />
               <Header />
              <Outlet />
              <Footer/>
              <Toaster />
            </AuthInit>
          </DefinersProvider>
        </LoaderProvider>
        </Provider>
    </Suspense>
  )
}

export {App}
