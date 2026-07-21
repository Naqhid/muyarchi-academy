import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { AuthProvider } from '@/hooks/use-auth'
import { SettingsProvider } from '@/hooks/use-settings'
import { ScholarshipProvider } from '@/hooks/use-scholarship'
import { ToastContextProvider } from '@/hooks/use-toast'
import App from '@/App'
import '@/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <ToastContextProvider>
        <AuthProvider>
          <SettingsProvider>
            <ScholarshipProvider>
              <App />
            </ScholarshipProvider>
          </SettingsProvider>
        </AuthProvider>
      </ToastContextProvider>
    </HashRouter>
  </StrictMode>
)
