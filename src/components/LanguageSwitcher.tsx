import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Globe, Loader2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu'
import {
  loadGoogleTranslate,
  getTranslateLangFromCookie,
  applyGoogleTranslateLang,
  setLanguageCookie
} from '@/lib/googleTranslateLoader'

// Language options
const LANGUAGES = [
  { code: 'en', label: 'English', display: 'EN' },
  { code: 'ta', label: 'Tamil', display: 'TA' },
  { code: 'ur', label: 'Urdu', display: 'UR' },
] as const

type Language = typeof LANGUAGES[number]

/**
 * LanguageSwitcher component for Google Translate integration
 * Features:
 * - Shows dropdown with language codes and globe icon
 * - Sets googtrans cookie and reloads on language change
 * - Checks navigator.onLine before loading Tamil/Urdu
 * - Lazy loads Google Translate script only when needed
 * - Uses stdio=1 to suppress Google Translate popup
 * - Language codes: en (English), ta (Tamil), ur (Urdu)
 * - Optimized with lazy loading and loading states
 */
export default function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState<string>('en')
  const [isLoading, setIsLoading] = useState(false)

  // Read language from cookie on mount
  useEffect(() => {
    const cookieLang = getTranslateLangFromCookie()
    if (cookieLang) {
      setCurrentLang(cookieLang)
      loadAndApplyTranslate(cookieLang)
    }
  }, [])

  // Load Google Translate and apply language
  const loadAndApplyTranslate = async (langCode: string) => {
    if (langCode === 'en') return

    try {
      await loadGoogleTranslate()
      // Wait a bit for the widget to initialize, then apply the language
      setTimeout(() => {
        applyGoogleTranslateLang(langCode)
        // Force re-translation by setting the cookie value in the combo
        const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement | null
        if (combo) {
          combo.value = langCode
          combo.dispatchEvent(new Event('change', { bubbles: true }))
        }
      }, 800)
    } catch (error) {
      console.error('Failed to load Google Translate:', error)
    }
  }

  const handleLanguageChange = (lang: Language) => {
    // Check if online before attempting to load Tamil/Urdu
    if (lang.code !== 'en' && !navigator.onLine) {
      alert('Please connect to the internet to use translation')
      return
    }

    // Set the cookie (handles clearing for English)
    setLanguageCookie(lang.code)
    setCurrentLang(lang.code)
    setIsLoading(true)

    // Reload the page to apply the new language
    window.location.reload()
  }

  // Find current language info
  const currentLanguage = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" aria-label="Select language" disabled={isLoading} className="text-sm font-semibold gap-2">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Globe className="h-4 w-4" />
          )}
          <span>{currentLanguage.display}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang)}
            className="cursor-pointer"
          >
            <span className="font-semibold mr-2">{lang.display}</span>
            <span>{lang.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
