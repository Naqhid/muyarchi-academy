// Type declarations for Google Translate
declare global {
  interface Window {
    googleTranslateElementInit: () => void
    google?: {
      translate?: {
        TranslateElement?: {
          new (options: any, elementId: string): void
          InlineLayout?: {
            SIMPLE?: string
          }
        }
      }
    }
  }
}

export {}
