import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Pencil, Trash2, Loader2, Star, Languages } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { fetchTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '@/lib/api'
import { TranslationSection } from '@/components/admin/TranslationSection'
import type { Testimonial, TestimonialInput } from '@/types'

const schema = z.object({
  author_name: z.string().min(1, 'Author name is required'),
  author_name_ta: z.string().optional().default(''),
  author_role: z.string().optional().default(''),
  author_role_ta: z.string().optional().default(''),
  content: z.string().min(1, 'Content is required'),
  content_ta: z.string().optional().default(''),
  rating: z.coerce.number().int().min(1, 'Rating is required').max(5, 'Rating must be 1-5'),
  avatar_url: z.string().optional().default(''),
  sort_order: z.coerce.number().int().default(0),
})
type FormData = z.infer<typeof schema>

export default function Testimonials() {
  const { toast } = useToast()
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Testimonial | null>(null)
  const [deleting, setDeleting] = useState<Testimonial | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [showTranslations, setShowTranslations] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, watch, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { author_name: '', author_name_ta: '', author_role: '', author_role_ta: '', content: '', content_ta: '', rating: 5, avatar_url: '', sort_order: 0 },
  })
  const ratingValue = watch('rating')

  const loadTestimonials = () => {
    setLoading(true)
    fetchTestimonials()
      .then((data) => setTestimonials(data))
      .catch((err) => { console.error('Failed to load testimonials:', err); toast({ title: 'Error', description: 'Failed to load testimonials', variant: 'destructive' }) })
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadTestimonials() }, [])

  const openAdd = () => {
    setEditing(null)
    reset({ author_name: '', author_name_ta: '', author_role: '', author_role_ta: '', content: '', content_ta: '', rating: 5, avatar_url: '', sort_order: 0 })
    setDialogOpen(true)
  }

  const openEdit = (t: Testimonial) => {
    setEditing(t)
    reset({ author_name: t.author_name, author_name_ta: t.author_name_ta || '', author_role: t.author_role, author_role_ta: t.author_role_ta || '', content: t.content, content_ta: t.content_ta || '', rating: t.rating, avatar_url: t.avatar_url, sort_order: t.sort_order })
    setDialogOpen(true)
  }

  const onSubmit = async (data: FormData) => {
    const input: TestimonialInput = {
      author_name: data.author_name,
      author_name_ta: data.author_name_ta || '',
      author_role: data.author_role || '',
      author_role_ta: data.author_role_ta || '',
      content: data.content,
      content_ta: data.content_ta || '',
      rating: data.rating,
      avatar_url: data.avatar_url || '',
      sort_order: data.sort_order,
    }
    try {
      if (editing) {
        await updateTestimonial(editing.id, input)
        toast({ title: 'Testimonial updated', description: 'The testimonial has been updated successfully.', variant: 'success' })
      } else {
        await createTestimonial(input)
        toast({ title: 'Testimonial created', description: 'The testimonial has been created successfully.', variant: 'success' })
      }
      setDialogOpen(false)
      loadTestimonials()
    } catch (err) {
      console.error('Save error:', err)
      toast({ title: 'Error', description: 'Failed to save testimonial', variant: 'destructive' })
    }
  }

  const confirmDelete = async () => {
    if (!deleting) return
    try {
      await deleteTestimonial(deleting.id)
      toast({ title: 'Testimonial deleted', description: 'The testimonial has been deleted successfully.', variant: 'success' })
      setDeleteOpen(false)
      setDeleting(null)
      loadTestimonials()
    } catch (err) {
      console.error('Delete error:', err)
      toast({ title: 'Error', description: 'Failed to delete testimonial', variant: 'destructive' })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold">Testimonials</h2>
          <p className="text-sm text-muted-foreground">Manage student and parent testimonials</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowTranslations(!showTranslations)}><Languages className="h-4 w-4" />{showTranslations ? 'Hide' : 'Show'} Translations</Button>
          <Button onClick={openAdd}><Plus className="h-4 w-4" />Add Testimonial</Button>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-56 rounded-lg" />)}
        </div>
      ) : testimonials.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <Star className="mb-3 h-12 w-12 opacity-40" />
          <p>No testimonials yet. Click "Add Testimonial" to create one.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div key={t.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <div className="flex h-full flex-col rounded-lg border bg-card p-5 text-card-foreground shadow-sm">
                <div className="flex items-start gap-3">
                  {t.avatar_url ? (
                    <img src={t.avatar_url} alt={t.author_name} className="h-12 w-12 rounded-full object-cover" loading="lazy" />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-lg">
                      {t.author_name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold truncate">{t.author_name}</p>
                    {t.author_role && <p className="text-sm text-muted-foreground truncate">{t.author_role}</p>}
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={idx} className={cn('h-4 w-4', idx < t.rating ? 'fill-warning text-warning' : 'text-muted-foreground/30')} />
                  ))}
                </div>
                <p className="mt-3 flex-1 text-sm text-muted-foreground line-clamp-4">{t.content}</p>
                <div className="mt-4 flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => openEdit(t)}><Pencil className="h-3.5 w-3.5" />Edit</Button>
                  <Button size="sm" variant="destructive" onClick={() => { setDeleting(t); setDeleteOpen(true) }}><Trash2 className="h-3.5 w-3.5" />Delete</Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Testimonial' : 'Add Testimonial'}</DialogTitle>
            <DialogDescription>{editing ? 'Update the testimonial details below.' : 'Fill in the details below to create a new testimonial.'}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="author_name">Author Name (English)</Label>
              <Input id="author_name" placeholder="John Doe" {...register('author_name')} aria-invalid={!!errors.author_name} />
              {errors.author_name && <p className="text-xs text-destructive" role="alert">{errors.author_name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="author_name_ta">Author Name (Tamil)</Label>
              <Input id="author_name_ta" placeholder="பெயர்" {...register('author_name_ta')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author_role">Author Role (English)</Label>
              <Input id="author_role" placeholder="Parent / Student" {...register('author_role')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author_role_ta">Author Role (Tamil)</Label>
              <Input id="author_role_ta" placeholder="பெற்றோர் / மாணவர்" {...register('author_role_ta')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content (English)</Label>
              <Textarea id="content" placeholder="Testimonial content..." rows={4} {...register('content')} aria-invalid={!!errors.content} />
              {errors.content && <p className="text-xs text-destructive" role="alert">{errors.content.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="content_ta">Content (Tamil)</Label>
              <Textarea id="content_ta" placeholder="சான்று உள்ளடக்கம்..." rows={4} {...register('content_ta')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rating">Rating</Label>
              <Select value={String(ratingValue)} onValueChange={(val) => setValue('rating', Number(val), { shouldValidate: true })}>
                <SelectTrigger><SelectValue placeholder="Select rating" /></SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((r) => (
                    <SelectItem key={r} value={String(r)}>{r} Star{r > 1 ? 's' : ''}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.rating && <p className="text-xs text-destructive" role="alert">{errors.rating.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="avatar_url">Avatar URL</Label>
              <Input id="avatar_url" placeholder="https://..." {...register('avatar_url')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sort_order">Sort Order</Label>
              <Input id="sort_order" type="number" placeholder="0" {...register('sort_order')} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={isSubmitting}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" />Saving...</> : editing ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Testimonial</DialogTitle>
            <DialogDescription>Are you sure you want to delete this testimonial? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          {deleting && (
            <div className="rounded-md border bg-muted/50 p-3">
              <p className="font-medium">{deleting.author_name}</p>
              {deleting.author_role && <p className="text-sm text-muted-foreground">{deleting.author_role}</p>}
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{deleting.content}</p>
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDeleteOpen(false)} disabled={isSubmitting}>Cancel</Button>
            <Button type="button" variant="destructive" onClick={confirmDelete} disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" />Deleting...</> : <><Trash2 className="h-4 w-4" />Delete</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Testimonial Translations */}
      {showTranslations && (
        <div className="mt-8 space-y-4">
          <div>
            <h3 className="font-display text-lg font-bold mb-2">Testimonial Page Translations</h3>
            <p className="text-sm text-muted-foreground mb-4">Edit text that appears on the testimonial section</p>
          </div>
          <TranslationSection
            prefix="testimonial"
            title="Testimonial Page Text"
            description="Manage testimonial section labels, headings, and other UI text"
          />
        </div>
      )}
    </div>
  )
}
