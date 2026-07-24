import { useState, useEffect } from 'react'
import { Languages, Save, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/hooks/use-toast'
import type { UiTranslation } from '@/types'

interface TranslationSectionProps {
  prefix: string
  title: string
  description?: string
  onSaveComplete?: () => void
}

export function TranslationSection({ prefix, title, description, onSaveComplete }: TranslationSectionProps) {
  const { toast } = useToast()
  const [translations, setTranslations] = useState<UiTranslation[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [edits, setEdits] = useState<Record<string, Partial<Pick<UiTranslation, 'en' | 'ta'>>>>({})

  useEffect(() => {
    loadTranslations()
  }, [prefix])

  const loadTranslations = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('ui_translations')
        .select('*')
        .like('key', `${prefix}%`)
        .order('key', { ascending: true })

      if (error) {
        toast({ title: 'Failed to load translations', variant: 'destructive' })
      } else {
        setTranslations((data as UiTranslation[]) || [])
      }
    } catch (err) {
      console.error('Load translations error:', err)
      toast({ title: 'Failed to load translations', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const updates = Object.entries(edits).map(([key, values]) =>
        supabase.from('ui_translations').update(values).eq('key', key)
      )
      await Promise.all(updates)
      toast({ title: 'Translations saved', variant: 'success' })
      setEdits({})
      await loadTranslations()
      onSaveComplete?.()
    } catch (err) {
      console.error('Save error:', err)
      toast({ title: 'Failed to save translations', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const hasEdits = Object.keys(edits).length > 0

  if (loading) {
    return (
      <Card>
        <CardContent className="p-4 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-lg" />)}
        </CardContent>
      </Card>
    )
  }

  if (translations.length === 0) {
    return null
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="border-b bg-muted/50 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Languages className="h-4 w-4" />
            <div>
              <h3 className="text-sm font-semibold">{title}</h3>
              {description && <p className="text-xs text-muted-foreground">{description}</p>}
            </div>
          </div>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!hasEdits || saving}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            {saving ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                Saving...
              </>
            ) : (
              `Save${hasEdits ? ` (${Object.keys(edits).length})` : ''}`
            )}
          </Button>
        </div>

        <div className="divide-y">
          {translations.map((t) => (
            <div key={t.key} className="grid grid-cols-1 gap-3 p-4 md:grid-cols-3">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">{t.key}</Label>
                <Input
                  id={`en-${t.key}`}
                  value={edits[t.key]?.en ?? t.en}
                  onChange={(e) =>
                    setEdits((prev) => ({
                      ...prev,
                      [t.key]: { ...prev[t.key], en: e.target.value }
                    }))
                  }
                  placeholder="English text"
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <Label className="text-xs text-muted-foreground" htmlFor={`ta-${t.key}`}>
                  Tamil
                </Label>
                <Input
                  id={`ta-${t.key}`}
                  value={edits[t.key]?.ta ?? t.ta}
                  onChange={(e) =>
                    setEdits((prev) => ({
                      ...prev,
                      [t.key]: { ...prev[t.key], ta: e.target.value }
                    }))
                  }
                  placeholder="தமிழ் மொழிபெயர்ப்பு"
                  className="font-tamil"
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
