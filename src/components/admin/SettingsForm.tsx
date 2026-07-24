import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { Save, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/hooks/use-toast'
import { useSettings } from '@/hooks/use-settings'
import { fetchSettings, updateSettings } from '@/lib/api'
import type { SiteSettings, SiteSettingsInput } from '@/types'

export interface SettingsField {
  /** English (primary) column name in site_settings */
  name: keyof SiteSettings
  label: string
  type?: 'input' | 'textarea'
  rows?: number
  placeholder?: string
  /** Optional Tamil column name — when set, a Tamil field is rendered too */
  taName?: keyof SiteSettings
  taLabel?: string
  taPlaceholder?: string
}

export interface SettingsGroup {
  title: string
  description?: string
  icon?: React.ElementType
  /** Render fields in a horizontal grid (used for short stat inputs) */
  columns?: boolean
  fields: SettingsField[]
}

interface SettingsFormProps {
  groups: SettingsGroup[]
  submitLabel?: string
}

/**
 * Renders and saves a subset of the site_settings row. Because updateSettings
 * performs a partial update, several pages can each edit their own group of
 * fields without overwriting each other.
 */
export function SettingsForm({ groups, submitLabel = 'Save Changes' }: SettingsFormProps) {
  const { toast } = useToast()
  const { refresh } = useSettings()
  const [loading, setLoading] = useState(true)

  const fieldNames: string[] = []
  groups.forEach((g) =>
    g.fields.forEach((f) => {
      fieldNames.push(f.name as string)
      if (f.taName) fieldNames.push(f.taName as string)
    })
  )

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<Record<string, string>>({
    defaultValues: Object.fromEntries(fieldNames.map((n) => [n, ''])),
  })

  useEffect(() => {
    fetchSettings()
      .then((data) => {
        if (data) {
          const values: Record<string, string> = {}
          fieldNames.forEach((n) => { values[n] = ((data as unknown as Record<string, unknown>)[n] as string) ?? '' })
          reset(values)
        }
      })
      .catch((err) => {
        console.error('Failed to load settings:', err)
        toast({ title: 'Error', description: 'Failed to load settings', variant: 'destructive' })
      })
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSubmit = async (data: Record<string, string>) => {
    const input: Partial<SiteSettingsInput> = {}
    fieldNames.forEach((n) => { (input as Record<string, string>)[n] = data[n] ?? '' })
    try {
      await updateSettings(input)
      toast({ title: 'Saved', description: 'Your changes have been saved successfully.', variant: 'success' })
      refresh()
    } catch (err) {
      console.error('Save error:', err)
      toast({ title: 'Error', description: 'Failed to save changes', variant: 'destructive' })
    }
  }

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-64 rounded-lg" />)}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {groups.map((group, gi) => (
        <motion.div key={group.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: gi * 0.05 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                {group.icon && <group.icon className="h-5 w-5" />}{group.title}
              </CardTitle>
              {group.description && <CardDescription>{group.description}</CardDescription>}
            </CardHeader>
            <CardContent className="space-y-4">
              {group.columns ? (
                <div className="grid gap-4 sm:grid-cols-3">
                  {group.fields.map((field) => (
                    <div key={field.name as string} className="space-y-2">
                      <Label htmlFor={field.name as string}>{field.label}</Label>
                      <Input id={field.name as string} placeholder={field.placeholder} {...register(field.name as string)} />
                    </div>
                  ))}
                </div>
              ) : (
                group.fields.map((field) => (
                  <div key={field.name as string} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={field.name as string}>{field.label}</Label>
                      {field.type === 'textarea'
                        ? <Textarea id={field.name as string} rows={field.rows ?? 3} placeholder={field.placeholder} {...register(field.name as string)} />
                        : <Input id={field.name as string} placeholder={field.placeholder} {...register(field.name as string)} />}
                    </div>
                    {field.taName && (
                      <div className="space-y-2">
                        <Label htmlFor={field.taName as string}>{field.taLabel ?? `${field.label} (Tamil)`}</Label>
                        {field.type === 'textarea'
                          ? <Textarea id={field.taName as string} rows={field.rows ?? 3} placeholder={field.taPlaceholder} className="font-tamil" {...register(field.taName as string)} />
                          : <Input id={field.taName as string} placeholder={field.taPlaceholder} className="font-tamil" {...register(field.taName as string)} />}
                      </div>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting} size="lg">
          {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" />Saving...</> : <><Save className="h-4 w-4" />{submitLabel}</>}
        </Button>
      </div>
    </form>
  )
}
