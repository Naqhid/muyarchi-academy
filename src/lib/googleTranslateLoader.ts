/**
 * Google Translate Loader Utility
 * Handles lazy-loading of Google Translate script and language switching
 */

import type {} from '@/types/google-translate'

const GOOGLE_TRANSLATE_SCRIPT_ID = 'google-translate-script'
const GOOGLE_TRANSLATE_COOKIE_NAME = 'googtrans'
const TRANSLATE_TIMEOUT = 12000 // 12 seconds

/**
 * Get the current language from googtrans cookie
 * Returns language code (e.g., 'ta', 'ur') or null for English
 */
export function getTranslateLangFromCookie(): string | null {
  const cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith(`${GOOGLE_TRANSLATE_COOKIE_NAME}=`))
    ?.split('=')[1]

  if (!cookieValue) return null

  // Cookie format is like: /en/ta or /auto/ta or /en/ur
  const match = cookieValue.match(/(?:\/en\/|\/auto\/)(ta|ur)/)
  return match ? match[1] : null
}

/**
 * Get language code for cookie from language code
 */
function getCookieValueForLang(langCode: string): string {
  const langMap: Record<string, string> = {
    en: '', // No cookie for English
    ta: '/en/ta',
    ur: '/en/ur'
  }
  return langMap[langCode] || ''
}

/**
 * Set the language cookie
 */
export function setLanguageCookie(langCode: string): void {
  const cookieValue = getCookieValueForLang(langCode)
  
  if (!cookieValue) {
    // Clear cookie for English
    document.cookie = 'googtrans=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
  } else {
    // Set cookie for Tamil/Urdu
    document.cookie = `googtrans=${cookieValue}; Path=/; max-age=${60 * 60 * 24 * 365}`
  }
}

/**
 * Inject Google Translate script into the DOM
 * Returns a Promise that resolves when the script is loaded
 */
export function loadGoogleTranslate(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (document.getElementById(GOOGLE_TRANSLATE_SCRIPT_ID)) {
      if (window.google?.translate?.TranslateElement) {
        resolve()
        return
      }
      const checkInterval = setInterval(() => {
        if (window.google?.translate?.TranslateElement) {
          clearInterval(checkInterval)
          resolve()
        }
      }, 100)
      setTimeout(() => {
        clearInterval(checkInterval)
        reject(new Error('Google Translate not ready'))
      }, TRANSLATE_TIMEOUT)
      return
    }

    // Check if online
    if (!navigator.onLine) {
      reject(new Error('Offline - Google Translate requires internet'))
      return
    }

    const script = document.createElement('script')
    script.id = GOOGLE_TRANSLATE_SCRIPT_ID
    // Add stdio=1 to suppress the popup
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit&stdio=1'
    script.async = true
    script.defer = true

    script.onerror = () => reject(new Error('Failed to load Google Translate script'))
    script.onload = () => {
      const checkInterval = setInterval(() => {
        if (window.google?.translate?.TranslateElement) {
          clearInterval(checkInterval)
          resolve()
        }
      }, 100)

      setTimeout(() => {
        clearInterval(checkInterval)
        reject(new Error('Google Translate script loaded but not ready'))
      }, TRANSLATE_TIMEOUT)
    }

    document.body.appendChild(script)

    setTimeout(() => {
      if (document.getElementById(GOOGLE_TRANSLATE_SCRIPT_ID)) {
        reject(new Error('Google Translate script load timeout'))
      }
    }, TRANSLATE_TIMEOUT)
  })
}

/**
 * Programmatically trigger language change in Google Translate
 * Uses the hidden .goog-te-combo select element
 */
export function applyGoogleTranslateLang(langCode: string): void {
  const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement | null
  if (combo) {
    combo.value = langCode
    const event = new Event('change', { bubbles: true })
    combo.dispatchEvent(event)
  }
}

/**
 * Initialize Google Translate element
 * This is called manually when a language is selected, NOT on script load
 */
export function initGoogleTranslateElement(): void {
  if (!window.google?.translate?.TranslateElement) return
  
  setTimeout(() => {
    try {
      new (window.google!.translate!.TranslateElement as any)(
        { 
          pageLanguage: 'en',
          includedLanguages: 'en,ta,ur',
          layout: (window.google!.translate!.TranslateElement as any).InlineLayout.SIMPLE,
          autoDisplay: false,
          gaTrack: false
        },
        'google-translate-element'
      )
    } catch (e) {
      console.error('Error initializing Google Translate:', e)
    }
  }, 100)
}

// Attach to window for Google Translate callback
// This will auto-initialize when script loads, but we hide the UI with CSS
window.googleTranslateElementInit = initGoogleTranslateElement
