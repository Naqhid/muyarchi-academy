import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/hooks/use-auth'
import { SettingsProvider } from '@/hooks/use-settings'
import { ToastContextProvider } from '@/hooks/use-toast'
import App from '@/App'
import '@/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ToastContextProvider>
        <AuthProvider>
          <SettingsProvider>
            <App />
          </SettingsProvider>
        </AuthProvider>
      </ToastContextProvider>
    </BrowserRouter>
  </StrictMode>
)
