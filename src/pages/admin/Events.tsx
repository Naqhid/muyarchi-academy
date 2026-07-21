import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Pencil, Trash2, X, Loader2, Calendar, ImageIcon, Video } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/hooks/use-toast'
import { formatDate } from '@/lib/utils'
import { fetchEvents, createEvent, updateEvent, deleteEvent } from '@/lib/api'
import type { EventItem, EventInput } from '@/types'

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional().default(''),
  event_date: z.string().optional().default(''),
  cover_image_url: z.string().optional().default(''),
})
type FormData = z.infer<typeof schema>

export default function Events() {
  const { toast } = useToast()
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<EventItem | null>(null)
  const [deleting, setDeleting] = useState<EventItem | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletingId, setDeletingId] = useState(false)
  const [imageGallery, setImageGallery] = useState<string[]>([])
  const [videoGallery, setVideoGallery] = useState<string[]>([])

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { title: '', description: '', event_date: '', cover_image_url: '' },
  })

  const load = () => {
    setLoading(true)
    fetchEvents()
      .then((data) => setEvents(data))
      .catch((err) => {
        console.error('Fetch events error:', err)
        toast({ title: 'Error', description: 'Failed to load events', variant: 'destructive' })
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openCreate = () => {
    setEditing(null)
    reset({ title: '', description: '', event_date: '', cover_image_url: '' })
    setImageGallery([])
    setVideoGallery([])
    setDialogOpen(true)
  }

  const openEdit = (event: EventItem) => {
    setEditing(event)
    reset({
      title: event.title,
      description: event.description,
      event_date: event.event_date ? event.event_date.split('T')[0] : '',
      cover_image_url: event.cover_image_url,
    })
    setImageGallery(event.image_gallery_urls && event.image_gallery_urls.length > 0 ? event.image_gallery_urls : [])
    setVideoGallery(event.video_gallery_urls && event.video_gallery_urls.length > 0 ? event.video_gallery_urls : [])
    setDialogOpen(true)
  }

  const onSubmit = async (data: FormData) => {
    try {
      const input: EventInput = {
        title: data.title,
        description: data.description ?? '',
        event_date: data.event_date ?? '',
        cover_image_url: data.cover_image_url ?? '',
        image_gallery_urls: imageGallery.filter((url) => url.trim() !== ''),
        video_gallery_urls: videoGallery.filter((url) => url.trim() !== ''),
      }
      if (editing) {
        await updateEvent(editing.id, input)
        toast({ title: 'Event updated', description: `"${input.title}" has been updated.`, variant: 'success' })
      } else {
        await createEvent(input)
        toast({ title: 'Event created', description: `"${input.title}" has been added.`, variant: 'success' })
      }
      setDialogOpen(false)
      setEditing(null)
      reset()
      setImageGallery([])
      setVideoGallery([])
      load()
    } catch (err) {
      console.error('Save event error:', err)
      toast({ title: 'Error', description: 'Failed to save event', variant: 'destructive' })
    }
  }

  const confirmDelete = async () => {
    if (!deleting) return
    setDeletingId(true)
    try {
      await deleteEvent(deleting.id)
      toast({ title: 'Event deleted', description: `"${deleting.title}" has been removed.`, variant: 'success' })
      setDeleteOpen(false)
      setDeleting(null)
      load()
    } catch (err) {
      console.error('Delete event error:', err)
      toast({ title: 'Error', description: 'Failed to delete event', variant: 'destructive' })
    } finally {
      setDeletingId(false)
    }
  }

  const addImageUrl = () => setImageGallery((prev) => [...prev, ''])
  const updateImageUrl = (index: number, value: string) => setImageGallery((prev) => prev.map((url, i) => (i === index ? value : url)))
  const removeImageUrl = (index: number) => setImageGallery((prev) => prev.filter((_, i) => i !== index))

  const addVideoUrl = () => setVideoGallery((prev) => [...prev, ''])
  const updateVideoUrl = (index: number, value: string) => setVideoGallery((prev) => prev.map((url, i) => (i === index ? value : url)))
  const removeVideoUrl = (index: number) => setVideoGallery((prev) => prev.filter((_, i) => i !== index))

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold">Events</h2>
          <p className="text-sm text-muted-foreground">Manage your academy events and galleries</p>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4" />Add Event</Button>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <Skeleton className="h-40 w-full rounded-none" />
              <CardContent className="p-5 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <Calendar className="mb-3 h-12 w-12 opacity-40" />
          <p className="mb-4 text-lg font-medium">No events yet</p>
          <Button onClick={openCreate}><Plus className="h-4 w-4" />Add your first event</Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event, i) => (
            <motion.div key={event.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="overflow-hidden">
                <div className="h-40 w-full overflow-hidden bg-muted">
                  {event.cover_image_url ? (
                    <img src={event.cover_image_url} alt={event.title} className="h-40 w-full object-cover" loading="lazy" />
                  ) : (
                    <div className="flex h-40 items-center justify-center bg-muted"><Calendar className="h-10 w-10 text-muted-foreground/40" /></div>
                  )}
                </div>
                <CardContent className="p-5 space-y-3">
                  <h3 className="font-display text-lg font-semibold leading-tight">{event.title}</h3>
                  {event.description && <p className="line-clamp-2 text-sm text-muted-foreground">{event.description}</p>}
                  {event.event_date && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 text-primary" />{formatDate(event.event_date)}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="gap-1"><ImageIcon className="h-3 w-3" />{event.image_gallery_urls?.length ?? 0} images</Badge>
                    <Badge variant="secondary" className="gap-1"><Video className="h-3 w-3" />{event.video_gallery_urls?.length ?? 0} videos</Badge>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" onClick={() => openEdit(event)}><Pencil className="h-4 w-4" />Edit</Button>
                    <Button variant="outline" size="sm" onClick={() => { setDeleting(event); setDeleteOpen(true) }}><Trash2 className="h-4 w-4" />Delete</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create / Edit Dialog. */}
      <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) { setEditing(null); reset(); setImageGallery([]); setVideoGallery([]) } }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Event' : 'Add Event'}</DialogTitle>
            <DialogDescription>{editing ? 'Update the event details below.' : 'Fill in the details to create a new event.'}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="Enter event title" {...register('title')} aria-invalid={!!errors.title} />
              {errors.title && <p className="text-xs text-destructive" role="alert">{errors.title.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Enter event description" {...register('description')} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="event_date">Event Date</Label>
                <Input id="event_date" type="date" {...register('event_date')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cover_image_url">Cover Image URL</Label>
                <Input id="cover_image_url" placeholder="https://..." {...register('cover_image_url')} />
              </div>
            </div>

            {/* Image Gallery URLs */}
            <div className="space-y-2">
              <Label>Image Gallery URLs</Label>
              <div className="space-y-2">
                {imageGallery.map((url, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      type="url"
                      placeholder="https://..."
                      value={url}
                      onChange={(e) => updateImageUrl(index, e.target.value)}
                    />
                    <Button type="button" variant="outline" size="icon" onClick={() => removeImageUrl(index)} aria-label="Remove image URL">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addImageUrl}><Plus className="h-4 w-4" />Add URL</Button>
              </div>
            </div>

            {/* Video Gallery URLs */}
            <div className="space-y-2">
              <Label>Video Gallery URLs</Label>
              <div className="space-y-2">
                {videoGallery.map((url, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      type="url"
                      placeholder="https://..."
                      value={url}
                      onChange={(e) => updateVideoUrl(index, e.target.value)}
                    />
                    <Button type="button" variant="outline" size="icon" onClick={() => removeVideoUrl(index)} aria-label="Remove video URL">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addVideoUrl}><Plus className="h-4 w-4" />Add URL</Button>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => { setDialogOpen(false); setEditing(null); reset(); setImageGallery([]); setVideoGallery([]) }}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" />{editing ? 'Updating...' : 'Creating...'}</> : editing ? 'Update Event' : 'Create Event'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onOpenChange={(open) => { setDeleteOpen(open); if (!open) setDeleting(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Event</DialogTitle>
            <DialogDescription>Are you sure you want to delete "{deleting?.title}"? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => { setDeleteOpen(false); setDeleting(null) }}>Cancel</Button>
            <Button type="button" variant="destructive" onClick={confirmDelete} disabled={deletingId}>
              {deletingId ? <><Loader2 className="h-4 w-4 animate-spin" />Deleting...</> : <><Trash2 className="h-4 w-4" />Delete</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
