import * as React from 'react'
import { supabase } from '@/lib/supabase'

export type Language = 'en' | 'ta'

interface UiTranslation {
  key: string
  en: string
  ta: string
}

interface LanguageContextValue {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string, fallback?: string) => string
  translations: Record<string, UiTranslation>
  loading: boolean
}

const LanguageContext = React.createContext<LanguageContextValue | null>(null)

const STORAGE_KEY = 'muyarchi-language'

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = React.useState<Language>(() => {
    if (typeof window === 'undefined') return 'en'
    return (localStorage.getItem(STORAGE_KEY) as Language) || 'en'
  })
  const [translations, setTranslations] = React.useState<Record<string, UiTranslation>>({})
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    supabase
      .from('ui_translations')
      .select('key, en, ta')
      .then(({ data, error }) => {
        if (error) {
          console.error('Failed to load UI translations:', error)
        } else if (data) {
          const map: Record<string, UiTranslation> = {}
          for (const row of data) {
            map[row.key] = { key: row.key, en: row.en, ta: row.ta }
          }
          setTranslations(map)
        }
        setLoading(false)
      })
  }, [])

  const setLanguage = React.useCallback((lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem(STORAGE_KEY, lang)
  }, [])

  const t = React.useCallback(
    (key: string, fallback?: string) => {
      const entry = translations[key]
      if (!entry) return fallback ?? key
      if (language === 'ta' && entry.ta) return entry.ta
      return entry.en || fallback || key
    },
    [language, translations]
  )

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translations, loading }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = React.useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}

export function pickLang(en: string, ta: string, lang: Language): string {
  if (lang === 'ta' && ta) return ta
  return en
}
