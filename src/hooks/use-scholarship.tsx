import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { fetchScholarship as fetchScholarshipAPI } from '@/lib/api'
import type { Scholarship } from '@/types'

interface ScholarshipContextType {
  scholarship: Scholarship | null
  loading: boolean
  refresh: () => Promise<void>
}

const ScholarshipContext = createContext<ScholarshipContextType | null>(null)

export function ScholarshipProvider({ children }: { children: ReactNode }) {
  const [scholarship, setScholarship] = useState<Scholarship | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = async () => {
    try {
      const data = await fetchScholarshipAPI()
      setScholarship(data)
    } catch (err) {
      console.error('Failed to fetch scholarship:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  return (
    <ScholarshipContext.Provider value={{ scholarship, loading, refresh }}>
      {children}
    </ScholarshipContext.Provider>
  )
}

export function useScholarship() {
  const context = useContext(ScholarshipContext)
  if (!context) {
    throw new Error('useScholarship must be used within ScholarshipProvider')
  }
  return context
}
