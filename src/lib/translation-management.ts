import { supabase } from '@/lib/supabase'
import type { UiTranslation } from '@/types'

export async function loadTranslationsByPrefix(prefix: string): Promise<UiTranslation[]> {
  const { data, error } = await supabase
    .from('ui_translations')
    .select('*')
    .like('key', `${prefix}%`)
    .order('key', { ascending: true })

  if (error) throw error
  return (data as UiTranslation[]) || []
}

export async function loadAllTranslations(): Promise<UiTranslation[]> {
  const { data, error } = await supabase
    .from('ui_translations')
    .select('*')
    .order('key', { ascending: true })

  if (error) throw error
  return (data as UiTranslation[]) || []
}

export async function saveTranslations(edits: Record<string, Partial<Pick<UiTranslation, 'en' | 'ta'>>>): Promise<void> {
  const updates = Object.entries(edits).map(([key, values]) =>
    supabase.from('ui_translations').update(values).eq('key', key)
  )
  await Promise.all(updates)
}

export function filterTranslationsByPrefix(translations: UiTranslation[], prefix: string): UiTranslation[] {
  return translations.filter((t) => t.key.startsWith(`${prefix}.`))
}

export function groupTranslationsByPrefix(translations: UiTranslation[]): Record<string, UiTranslation[]> {
  return translations.reduce((acc, t) => {
    const group = t.key.split('.')[0]
    if (!acc[group]) acc[group] = []
    acc[group].push(t)
    return acc
  }, {} as Record<string, UiTranslation[]>)
}
