import * as React from 'react'
import { fetchSettings } from '@/lib/api'
import type { SiteSettings } from '@/types'

interface SettingsContextValue {
  settings: SiteSettings | null
  loading: boolean
  refresh: () => Promise<void>
}

const SettingsContext = React.createContext<SettingsContextValue | null>(null)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = React.useState<SiteSettings | null>(null)
  const [loading, setLoading] = React.useState(true)

  const refresh = React.useCallback(async () => {
    try {
      const data = await fetchSettings()
      console.log('Fetched settings data:', data)
      // Let's also stringify each field to see what's inside
      if (data) {
        Object.entries(data).forEach(([key, value]) => {
          console.log(`settings.${key}:`, value, 'type:', typeof value)
        })
      }
      setSettings(data)
    } catch (err) {
      console.error('Failed to load settings:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => { refresh() }, [refresh])

  return <SettingsContext.Provider value={{ settings, loading, refresh }}>{children}</SettingsContext.Provider>
}

export function useSettings() {
  const ctx = React.useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}
