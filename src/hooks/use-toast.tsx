import * as React from 'react'
import type { ToastProps } from '@/components/ui/toast'

type Variant = NonNullable<ToastProps['variant']>

export interface ToastMessage {
  id: string
  title?: string
  description?: string
  variant?: Variant
}

interface ToastContextValue {
  toasts: ToastMessage[]
  toast: (t: Omit<ToastMessage, 'id'>) => void
  dismiss: (id: string) => void
}

const ToastContext = React.createContext<ToastContextValue | null>(null)

export function ToastContextProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastMessage[]>([])
  const dismiss = React.useCallback((id: string) => setToasts((prev) => prev.filter((t) => t.id !== id)), [])
  const toast = React.useCallback((t: Omit<ToastMessage, 'id'>) => {
    const id = crypto.randomUUID()
    setToasts((prev) => [...prev, { ...t, id }])
    setTimeout(() => dismiss(id), 4000)
  }, [dismiss])

  return <ToastContext.Provider value={{ toasts, toast, dismiss }}>{children}</ToastContext.Provider>
}

export function useToast() {
  const ctx = React.useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastContextProvider')
  return ctx
}
