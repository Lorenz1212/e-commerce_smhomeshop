import { createRoot } from 'react-dom/client'
import axios from 'axios'
import "./index.css";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { AppRoutes } from './routing/AppRoutes'
import { AuthProvider } from './modules/Authentication/core/Auth'

const queryClient = new QueryClient()
const container = document.getElementById('root')
if (container) {
  const root = createRoot(container)
  root.render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>

      {/* ✅ Devtools must be inside the provider */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
