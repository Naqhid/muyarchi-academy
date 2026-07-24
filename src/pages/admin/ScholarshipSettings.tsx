import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Save, Loader2, GraduationCap, Languages } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/hooks/use-toast'
import { useSettings } from '@/hooks/use-settings'
import { fetchScholarship, updateScholarship } from '@/lib/api'
import { TranslationSection } from '@/components/admin/TranslationSection'
import type { ScholarshipInput } from '@/types'

const schema = z.object({
  hero_title: z.string().optional().default(''),
  hero_title_ta: z.string().optional().default(''),
  hero_description: z.string().optional().default(''),
  hero_description_ta: z.string().optional().default(''),
  how_it_works_title: z.string().optional().default(''),
  how_it_works_title_ta: z.string().optional().default(''),
  how_it_works_description: z.string().optional().default(''),
  how_it_works_description_ta: z.string().optional().default(''),
  card1_title: z.string().optional().default(''),
  card1_title_ta: z.string().optional().default(''),
  card1_text: z.string().optional().default(''),
  card1_text_ta: z.string().optional().default(''),
  card2_title: z.string().optional().default(''),
  card2_title_ta: z.string().optional().default(''),
  card2_text: z.string().optional().default(''),
  card2_text_ta: z.string().optional().default(''),
  card3_title: z.string().optional().default(''),
  card3_title_ta: z.string().optional().default(''),
  card3_text: z.string().optional().default(''),
  card3_text_ta: z.string().optional().default(''),
  test_details_title: z.string().optional().default(''),
  test_details_title_ta: z.string().optional().default(''),
  eligibility: z.string().optional().default(''),
  eligibility_ta: z.string().optional().default(''),
  duration: z.string().optional().default(''),
  duration_ta: z.string().optional().default(''),
  test_date: z.string().optional().default(''),
  test_date_ta: z.string().optional().default(''),
  venues: z.string().optional().default(''),
  venues_ta: z.string().optional().default(''),
  sample_paper_link: z.string().optional().default(''),
})

type FormData = z.infer<typeof schema>

export default function ScholarshipSettings() {
  const { toast } = useToast()
  const { refresh } = useSettings()
  const [loading, setLoading] = useState(true)
  const [showTranslations, setShowTranslations] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      hero_title: '', hero_title_ta: '', hero_description: '', hero_description_ta: '',
      how_it_works_title: '', how_it_works_title_ta: '', how_it_works_description: '', how_it_works_description_ta: '',
      card1_title: '', card1_title_ta: '', card1_text: '', card1_text_ta: '',
      card2_title: '', card2_title_ta: '', card2_text: '', card2_text_ta: '',
      card3_title: '', card3_title_ta: '', card3_text: '', card3_text_ta: '',
      test_details_title: '', test_details_title_ta: '',
      eligibility: '', eligibility_ta: '', duration: '', duration_ta: '',
      test_date: '', test_date_ta: '', venues: '', venues_ta: '', sample_paper_link: '',
    },
  })

  useEffect(() => {
    fetchScholarship()
      .then((data) => {
        if (data) {
          reset({
            hero_title: data.hero_title || '',
            hero_title_ta: data.hero_title_ta || '',
            hero_description: data.hero_description || '',
            hero_description_ta: data.hero_description_ta || '',
            how_it_works_title: data.how_it_works_title || '',
            how_it_works_title_ta: data.how_it_works_title_ta || '',
            how_it_works_description: data.how_it_works_description || '',
            how_it_works_description_ta: data.how_it_works_description_ta || '',
            card1_title: data.card1_title || '',
            card1_title_ta: data.card1_title_ta || '',
            card1_text: data.card1_text || '',
            card1_text_ta: data.card1_text_ta || '',
            card2_title: data.card2_title || '',
            card2_title_ta: data.card2_title_ta || '',
            card2_text: data.card2_text || '',
            card2_text_ta: data.card2_text_ta || '',
            card3_title: data.card3_title || '',
            card3_title_ta: data.card3_title_ta || '',
            card3_text: data.card3_text || '',
            card3_text_ta: data.card3_text_ta || '',
            test_details_title: data.test_details_title || '',
            test_details_title_ta: data.test_details_title_ta || '',
            eligibility: data.eligibility || '',
            eligibility_ta: data.eligibility_ta || '',
            duration: data.duration || '',
            duration_ta: data.duration_ta || '',
            test_date: data.test_date || '',
            test_date_ta: data.test_date_ta || '',
            venues: data.venues || '',
            venues_ta: data.venues_ta || '',
            sample_paper_link: data.sample_paper_link || '',
          })
        }
      })
      .catch((err) => { console.error('Failed to load scholarship settings:', err); toast({ title: 'Error', description: 'Failed to load scholarship settings', variant: 'destructive' }) })
      .finally(() => setLoading(false))
  }, [reset, toast])

  const onSubmit = async (data: FormData) => {
    const input: Partial<ScholarshipInput> = {
      hero_title: data.hero_title || '',
      hero_title_ta: data.hero_title_ta || '',
      hero_description: data.hero_description || '',
      hero_description_ta: data.hero_description_ta || '',
      how_it_works_title: data.how_it_works_title || '',
      how_it_works_title_ta: data.how_it_works_title_ta || '',
      how_it_works_description: data.how_it_works_description || '',
      how_it_works_description_ta: data.how_it_works_description_ta || '',
      card1_title: data.card1_title || '',
      card1_title_ta: data.card1_title_ta || '',
      card1_text: data.card1_text || '',
      card1_text_ta: data.card1_text_ta || '',
      card2_title: data.card2_title || '',
      card2_title_ta: data.card2_title_ta || '',
      card2_text: data.card2_text || '',
      card2_text_ta: data.card2_text_ta || '',
      card3_title: data.card3_title || '',
      card3_title_ta: data.card3_title_ta || '',
      card3_text: data.card3_text || '',
      card3_text_ta: data.card3_text_ta || '',
      test_details_title: data.test_details_title || '',
      test_details_title_ta: data.test_details_title_ta || '',
      eligibility: data.eligibility || '',
      eligibility_ta: data.eligibility_ta || '',
      duration: data.duration || '',
      duration_ta: data.duration_ta || '',
      test_date: data.test_date || '',
      test_date_ta: data.test_date_ta || '',
      venues: data.venues || '',
      venues_ta: data.venues_ta || '',
      sample_paper_link: data.sample_paper_link || '',
    }
    try {
      await updateScholarship(input)
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
                <Label htmlFor="hero_title">Hero Title (English)</Label>
                <Input id="hero_title" placeholder="Scholarship-cum-Admission Test" {...register('hero_title')} />
                {errors.hero_title && <p className="text-xs text-destructive" role="alert">{errors.hero_title.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="hero_title_ta">Hero Title (Tamil)</Label>
                <Input id="hero_title_ta" placeholder="உதவித்தொகை தேர்வு" {...register('hero_title_ta')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hero_description">Hero Description (English)</Label>
                <Textarea id="hero_description" rows={3} placeholder="Every student who joins Muyarchi Academy sits our scholarship test..." {...register('hero_description')} />
                {errors.hero_description && <p className="text-xs text-destructive" role="alert">{errors.hero_description.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="hero_description_ta">Hero Description (Tamil)</Label>
                <Textarea id="hero_description_ta" rows={3} placeholder="விளக்கம்..." {...register('hero_description_ta')} />
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
                <Label htmlFor="how_it_works_title">Section Title (English)</Label>
                <Input id="how_it_works_title" placeholder="How It Works" {...register('how_it_works_title')} />
                {errors.how_it_works_title && <p className="text-xs text-destructive" role="alert">{errors.how_it_works_title.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="how_it_works_title_ta">Section Title (Tamil)</Label>
                <Input id="how_it_works_title_ta" placeholder="எப்படி இயங்குகிறது" {...register('how_it_works_title_ta')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="how_it_works_description">Section Description (English)</Label>
                <Textarea id="how_it_works_description" rows={3} placeholder="The test rewards effort and ability, not background..." {...register('how_it_works_description')} />
                {errors.how_it_works_description && <p className="text-xs text-destructive" role="alert">{errors.how_it_works_description.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="how_it_works_description_ta">Section Description (Tamil)</Label>
                <Textarea id="how_it_works_description_ta" rows={3} placeholder="விளக்கம்..." {...register('how_it_works_description_ta')} />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="card1_title">Card 1 Title (English)</Label>
                  <Input id="card1_title" placeholder="Objective Test" {...register('card1_title')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="card2_title">Card 2 Title (English)</Label>
                  <Input id="card2_title" placeholder="Merit-Based" {...register('card2_title')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="card3_title">Card 3 Title (English)</Label>
                  <Input id="card3_title" placeholder="Fee Reduction" {...register('card3_title')} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="card1_title_ta">Card 1 Title (Tamil)</Label>
                  <Input id="card1_title_ta" placeholder="தலைப்பு" {...register('card1_title_ta')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="card2_title_ta">Card 2 Title (Tamil)</Label>
                  <Input id="card2_title_ta" placeholder="தலைப்பு" {...register('card2_title_ta')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="card3_title_ta">Card 3 Title (Tamil)</Label>
                  <Input id="card3_title_ta" placeholder="தலைப்பு" {...register('card3_title_ta')} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="card1_text">Card 1 Text (English)</Label>
                  <Textarea id="card1_text" rows={2} placeholder="Mathematics, Science and mental ability" {...register('card1_text')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="card2_text">Card 2 Text (English)</Label>
                  <Textarea id="card2_text" rows={2} placeholder="Scholarships awarded on performance" {...register('card2_text')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="card3_text">Card 3 Text (English)</Label>
                  <Textarea id="card3_text" rows={2} placeholder="Every mark earned reduces the fee" {...register('card3_text')} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="card1_text_ta">Card 1 Text (Tamil)</Label>
                  <Textarea id="card1_text_ta" rows={2} placeholder="உரை" {...register('card1_text_ta')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="card2_text_ta">Card 2 Text (Tamil)</Label>
                  <Textarea id="card2_text_ta" rows={2} placeholder="உரை" {...register('card2_text_ta')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="card3_text_ta">Card 3 Text (Tamil)</Label>
                  <Textarea id="card3_text_ta" rows={2} placeholder="உரை" {...register('card3_text_ta')} />
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
                <Label htmlFor="test_details_title">Section Title (English)</Label>
                <Input id="test_details_title" placeholder="Test Details" {...register('test_details_title')} />
                {errors.test_details_title && <p className="text-xs text-destructive" role="alert">{errors.test_details_title.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="test_details_title_ta">Section Title (Tamil)</Label>
                <Input id="test_details_title_ta" placeholder="தேர்வு விவரங்கள்" {...register('test_details_title_ta')} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="eligibility">Eligibility (English)</Label>
                  <Input id="eligibility" placeholder="Students entering Classes 8–12" {...register('eligibility')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eligibility_ta">Eligibility (Tamil)</Label>
                  <Input id="eligibility_ta" placeholder="தகுதி" {...register('eligibility_ta')} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (English)</Label>
                  <Input id="duration" placeholder="Coming soon" {...register('duration')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration_ta">Duration (Tamil)</Label>
                  <Input id="duration_ta" placeholder="காலம்" {...register('duration_ta')} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="test_date">Test Date (English)</Label>
                  <Input id="test_date" placeholder="Coming soon" {...register('test_date')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="test_date_ta">Test Date (Tamil)</Label>
                  <Input id="test_date_ta" placeholder="தேர்வு தேதி" {...register('test_date_ta')} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="venues">Venues (English)</Label>
                  <Input id="venues" placeholder="Coming soon" {...register('venues')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="venues_ta">Venues (Tamil)</Label>
                  <Input id="venues_ta" placeholder="தேர்வு மையங்கள்" {...register('venues_ta')} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sample_paper_link">Sample Paper Download Link</Label>
                <Input id="sample_paper_link" placeholder="https://..." {...register('sample_paper_link')} />
                {errors.sample_paper_link && <p className="text-xs text-destructive" role="alert">{errors.sample_paper_link.message}</p>}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => setShowTranslations(!showTranslations)}><Languages className="h-4 w-4" />{showTranslations ? 'Hide' : 'Show'} Translations</Button>
          <Button type="submit" disabled={isSubmitting} size="lg">
            {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" />Saving...</> : <><Save className="h-4 w-4" />Save Scholarship Settings</>}
          </Button>
        </div>
      </form>

      {/* Scholarship Translations */}
      {showTranslations && (
        <div className="mt-8 space-y-4">
          <div>
            <h3 className="font-display text-lg font-bold mb-2">Scholarship Page Translations</h3>
            <p className="text-sm text-muted-foreground mb-4">Edit text that appears on the scholarship page beyond the settings above</p>
          </div>
          <TranslationSection
            prefix="scholarship"
            title="Scholarship Page Text"
            description="Manage scholarship page labels, headings, and other UI text"
          />
        </div>
      )}
    </div>
  )
}
