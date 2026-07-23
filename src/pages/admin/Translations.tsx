import { useEffect, useState, useCallback } from 'react'
import { Languages, Save, Search } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/hooks/use-toast'
import type { UiTranslation } from '@/types'

export default function Translations() {
  const { toast } = useToast()
  const [translations, setTranslations] = useState<UiTranslation[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [edits, setEdits] = useState<Record<string, Partial<Pick<UiTranslation, 'en' | 'ta'>>>>({})

  const load = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase.from('ui_translations').select('*').order('key', { ascending: true })
    if (error) {
      toast({ title: 'Failed to load translations', variant: 'destructive' })
    } else {
      setTranslations(data as UiTranslation[])
    }
    setLoading(false)
  }, [toast])

  useEffect(() => { load() }, [load])

  const handleSave = async () => {
    setSaving(true)
    try {
      const updates = Object.entries(edits).map(([key, values]) =>
        supabase.from('ui_translations').update(values).eq('key', key)
      )
      await Promise.all(updates)
      toast({ title: 'Translations saved', variant: 'success' })
      setEdits({})
      await load()
    } catch (err) {
      console.error('Save error:', err)
      toast({ title: 'Failed to save translations', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const filtered = translations.filter((t) =>
    t.key.toLowerCase().includes(search.toLowerCase()) ||
    t.en.toLowerCase().includes(search.toLowerCase())
  )

  const grouped = filtered.reduce((acc, t) => {
    const group = t.key.split('.')[0]
    if (!acc[group]) acc[group] = []
    acc[group].push(t)
    return acc
  }, {} as Record<string, UiTranslation[]>)

  const hasEdits = Object.keys(edits).length > 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold flex items-center gap-2">
            <Languages className="h-6 w-6" /> UI Translations
          </h2>
          <p className="text-sm text-muted-foreground">Manage public English and Tamil text, form options, and SEO content.</p>
        </div>
        <Button onClick={handleSave} disabled={!hasEdits || saving} className="gap-2">
          <Save className="h-4 w-4" /> {saving ? 'Saving...' : `Save${hasEdits ? ` (${Object.keys(edits).length})` : ''}`}
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by key or English text..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-lg" />)}
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([group, items]) => (
            <Card key={group}>
              <CardContent className="p-0">
                <div className="border-b bg-muted/50 px-4 py-2">
                  <h3 className="text-sm font-semibold capitalize text-muted-foreground">{group}</h3>
                </div>
                <div className="divide-y">
                  {items.map((t) => (
                    <div key={t.key} className="grid grid-cols-1 gap-3 p-4 md:grid-cols-3">
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">{t.key}</Label>
                        <Input id={`en-${t.key}`} value={edits[t.key]?.en ?? t.en} onChange={(e) => setEdits((prev) => ({ ...prev, [t.key]: { ...prev[t.key], en: e.target.value } }))} placeholder="English text" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground" htmlFor={`ta-${t.key}`}>Tamil</Label>
                        <Input
                          id={`ta-${t.key}`}
                          value={edits[t.key]?.ta ?? t.ta}
                          onChange={(e) => setEdits((prev) => ({ ...prev, [t.key]: { ...prev[t.key], ta: e.target.value } }))}
                          placeholder="தமிழ் மொழிபெயர்ப்பு"
                          className="font-tamil"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
