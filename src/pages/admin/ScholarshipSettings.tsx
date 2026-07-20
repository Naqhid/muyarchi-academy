import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Save, Loader2, GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/hooks/use-toast'
import { useSettings } from '@/hooks/use-settings'
import { fetchSettings, updateSettings } from '@/lib/api'
import type { SiteSettingsInput } from '@/types'

const schema = z.object({
  scholarship_hero_title: z.string().optional().default(''),
  scholarship_hero_description: z.string().optional().default(''),
  scholarship_how_it_works_title: z.string().optional().default(''),
  scholarship_how_it_works_description: z.string().optional().default(''),
  scholarship_card1_title: z.string().optional().default(''),
  scholarship_card1_text: z.string().optional().default(''),
  scholarship_card2_title: z.string().optional().default(''),
  scholarship_card2_text: z.string().optional().default(''),
  scholarship_card3_title: z.string().optional().default(''),
  scholarship_card3_text: z.string().optional().default(''),
  scholarship_test_details_title: z.string().optional().default(''),
  scholarship_eligibility: z.string().optional().default(''),
  scholarship_duration: z.string().optional().default(''),
  scholarship_test_date: z.string().optional().default(''),
  scholarship_venues: z.string().optional().default(''),
  scholarship_sample_paper_link: z.string().optional().default(''),
})

type FormData = z.infer<typeof schema>

export default function ScholarshipSettings() {
  const { toast } = useToast()
  const { refresh } = useSettings()
  const [loading, setLoading] = useState(true)

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      scholarship_hero_title: '', scholarship_hero_description: '', scholarship_how_it_works_title: '',
      scholarship_how_it_works_description: '', scholarship_card1_title: '', scholarship_card1_text: '',
      scholarship_card2_title: '', scholarship_card2_text: '', scholarship_card3_title: '', scholarship_card3_text: '',
      scholarship_test_details_title: '', scholarship_eligibility: '', scholarship_duration: '',
      scholarship_test_date: '', scholarship_venues: '', scholarship_sample_paper_link: '',
    },
  })

  useEffect(() => {
    fetchSettings()
      .then((data) => {
        if (data) {
          reset({
            scholarship_hero_title: data.scholarship_hero_title || '',
            scholarship_hero_description: data.scholarship_hero_description || '',
            scholarship_how_it_works_title: data.scholarship_how_it_works_title || '',
            scholarship_how_it_works_description: data.scholarship_how_it_works_description || '',
            scholarship_card1_title: data.scholarship_card1_title || '',
            scholarship_card1_text: data.scholarship_card1_text || '',
            scholarship_card2_title: data.scholarship_card2_title || '',
            scholarship_card2_text: data.scholarship_card2_text || '',
            scholarship_card3_title: data.scholarship_card3_title || '',
            scholarship_card3_text: data.scholarship_card3_text || '',
            scholarship_test_details_title: data.scholarship_test_details_title || '',
            scholarship_eligibility: data.scholarship_eligibility || '',
            scholarship_duration: data.scholarship_duration || '',
            scholarship_test_date: data.scholarship_test_date || '',
            scholarship_venues: data.scholarship_venues || '',
            scholarship_sample_paper_link: data.scholarship_sample_paper_link || '',
          })
        }
      })
      .catch((err) => { console.error('Failed to load settings:', err); toast({ title: 'Error', description: 'Failed to load settings', variant: 'destructive' }) })
      .finally(() => setLoading(false))
  }, [reset, toast])

  const onSubmit = async (data: FormData) => {
    const input: Partial<SiteSettingsInput> = {
      scholarship_hero_title: data.scholarship_hero_title || '',
      scholarship_hero_description: data.scholarship_hero_description || '',
      scholarship_how_it_works_title: data.scholarship_how_it_works_title || '',
      scholarship_how_it_works_description: data.scholarship_how_it_works_description || '',
      scholarship_card1_title: data.scholarship_card1_title || '',
      scholarship_card1_text: data.scholarship_card1_text || '',
      scholarship_card2_title: data.scholarship_card2_title || '',
      scholarship_card2_text: data.scholarship_card2_text || '',
      scholarship_card3_title: data.scholarship_card3_title || '',
      scholarship_card3_text: data.scholarship_card3_text || '',
      scholarship_test_details_title: data.scholarship_test_details_title || '',
      scholarship_eligibility: data.scholarship_eligibility || '',
      scholarship_duration: data.scholarship_duration || '',
      scholarship_test_date: data.scholarship_test_date || '',
      scholarship_venues: data.scholarship_venues || '',
      scholarship_sample_paper_link: data.scholarship_sample_paper_link || '',
    }
    try {
      await updateSettings(input)
      toast({ title: 'Scholarship settings saved', description: 'Scholarship page content has been updated successfully.', variant: 'success' })
      refresh()
    } catch (err) {
      console.error('Save error:', err)
      toast({ title: 'Error', description: 'Failed to save scholarship settings', variant: 'destructive' })
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-display text-2xl font-bold">Scholarship Settings</h2>
          <p className="text-sm text-muted-foreground">Configure the scholarship test page</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-64 rounded-lg" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold">Scholarship Settings</h2>
        <p className="text-sm text-muted-foreground">Configure the scholarship test page content</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Hero Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl"><GraduationCap className="h-5 w-5" />Hero Section</CardTitle>
              <CardDescription>Main banner text on the scholarship page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="scholarship_hero_title">Hero Title</Label>
                <Input id="scholarship_hero_title" placeholder="Scholarship-cum-Admission Test" {...register('scholarship_hero_title')} />
                {errors.scholarship_hero_title && <p className="text-xs text-destructive" role="alert">{errors.scholarship_hero_title.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="scholarship_hero_description">Hero Description</Label>
                <Textarea id="scholarship_hero_description" rows={3} placeholder="Every student who joins Muyarchi Academy sits our scholarship test..." {...register('scholarship_hero_description')} />
                {errors.scholarship_hero_description && <p className="text-xs text-destructive" role="alert">{errors.scholarship_hero_description.message}</p>}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* How It Works Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl"><GraduationCap className="h-5 w-5" />How It Works Section</CardTitle>
              <CardDescription>Content explaining the scholarship process</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="scholarship_how_it_works_title">Section Title</Label>
                <Input id="scholarship_how_it_works_title" placeholder="How It Works" {...register('scholarship_how_it_works_title')} />
                {errors.scholarship_how_it_works_title && <p className="text-xs text-destructive" role="alert">{errors.scholarship_how_it_works_title.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="scholarship_how_it_works_description">Section Description</Label>
                <Textarea id="scholarship_how_it_works_description" rows={3} placeholder="The test rewards effort and ability, not background..." {...register('scholarship_how_it_works_description')} />
                {errors.scholarship_how_it_works_description && <p className="text-xs text-destructive" role="alert">{errors.scholarship_how_it_works_description.message}</p>}
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="scholarship_card1_title">Card 1 Title</Label>
                  <Input id="scholarship_card1_title" placeholder="Objective Test" {...register('scholarship_card1_title')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scholarship_card2_title">Card 2 Title</Label>
                  <Input id="scholarship_card2_title" placeholder="Merit-Based" {...register('scholarship_card2_title')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scholarship_card3_title">Card 3 Title</Label>
                  <Input id="scholarship_card3_title" placeholder="Fee Reduction" {...register('scholarship_card3_title')} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="scholarship_card1_text">Card 1 Text</Label>
                  <Textarea id="scholarship_card1_text" rows={2} placeholder="Mathematics, Science and mental ability" {...register('scholarship_card1_text')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scholarship_card2_text">Card 2 Text</Label>
                  <Textarea id="scholarship_card2_text" rows={2} placeholder="Scholarships awarded on performance" {...register('scholarship_card2_text')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scholarship_card3_text">Card 3 Text</Label>
                  <Textarea id="scholarship_card3_text" rows={2} placeholder="Every mark earned reduces the fee" {...register('scholarship_card3_text')} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Test Details Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl"><GraduationCap className="h-5 w-5" />Test Details</CardTitle>
              <CardDescription>Information about the scholarship test</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="scholarship_test_details_title">Section Title</Label>
                <Input id="scholarship_test_details_title" placeholder="Test Details" {...register('scholarship_test_details_title')} />
                {errors.scholarship_test_details_title && <p className="text-xs text-destructive" role="alert">{errors.scholarship_test_details_title.message}</p>}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="scholarship_eligibility">Eligibility</Label>
                  <Input id="scholarship_eligibility" placeholder="Students entering Classes 8–12" {...register('scholarship_eligibility')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scholarship_duration">Duration</Label>
                  <Input id="scholarship_duration" placeholder="Coming soon" {...register('scholarship_duration')} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="scholarship_test_date">Test Date</Label>
                  <Input id="scholarship_test_date" placeholder="Coming soon" {...register('scholarship_test_date')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scholarship_venues">Venues</Label>
                  <Input id="scholarship_venues" placeholder="Coming soon" {...register('scholarship_venues')} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="scholarship_sample_paper_link">Sample Paper Download Link</Label>
                <Input id="scholarship_sample_paper_link" placeholder="https://..." {...register('scholarship_sample_paper_link')} />
                {errors.scholarship_sample_paper_link && <p className="text-xs text-destructive" role="alert">{errors.scholarship_sample_paper_link.message}</p>}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting} size="lg">
            {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" />Saving...</> : <><Save className="h-4 w-4" />Save Scholarship Settings</>}
          </Button>
        </div>
      </form>
    </div>
  )
}
