import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Pencil, Trash2, Loader2, Image, Video, FileAudio, FileText, Folder, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/hooks/use-toast'
import { fetchMedia, createMedia, updateMedia, deleteMedia } from '@/lib/api'
import type { MediaItem, MediaInput, MediaType } from '@/types'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['image', 'video', 'audio', 'document', 'folder']),
  url: z.string().min(1, 'URL is required'),
  thumbnail_url: z.string().optional().default(''),
})
type FormData = z.infer<typeof schema>

const typeFilters: ('all' | MediaType)[] = ['all', 'image', 'video', 'audio', 'document', 'folder']

const typeIcon: Record<MediaType, typeof Image> = {
  image: Image,
  video: Video,
  audio: FileAudio,
  document: FileText,
  folder: Folder,
}

const typeBadgeVariant: Record<MediaType, 'default' | 'secondary' | 'success' | 'warning' | 'outline'> = {
  image: 'default',
  video: 'secondary',
  audio: 'success',
  document: 'warning',
  folder: 'outline',
}

export default function Media() {
  const { toast } = useToast()
  const [media, setMedia] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | MediaType>('all')
  const [editing, setEditing] = useState<MediaItem | null>(null)
  const [deleting, setDeleting] = useState<MediaItem | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, watch, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', type: 'image', url: '', thumbnail_url: '' },
  })
  const typeValue = watch('type')

  const loadMedia = () => {
    setLoading(true)
    fetchMedia()
      .then((data) => setMedia(data))
      .catch((err) => { console.error('Failed to load media:', err); toast({ title: 'Error', description: 'Failed to load media library', variant: 'destructive' }) })
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadMedia() }, [])

  const filtered = filter === 'all' ? media : media.filter((m) => m.type === filter)

  const openAdd = () => {
    setEditing(null)
    reset({ name: '', type: 'image', url: '', thumbnail_url: '' })
    setDialogOpen(true)
  }

  const openEdit = (m: MediaItem) => {
    setEditing(m)
    reset({ name: m.name, type: m.type, url: m.url, thumbnail_url: m.thumbnail_url })
    setDialogOpen(true)
  }

  const onSubmit = async (data: FormData) => {
    const input: MediaInput = {
      name: data.name,
      type: data.type,
      url: data.url,
      thumbnail_url: data.thumbnail_url || '',
    }
    try {
      if (editing) {
        await updateMedia(editing.id, input)
        toast({ title: 'Media updated', description: 'The media item has been updated successfully.', variant: 'success' })
      } else {
        await createMedia(input)
        toast({ title: 'Media created', description: 'The media item has been created successfully.', variant: 'success' })
      }
      setDialogOpen(false)
      loadMedia()
    } catch (err) {
      console.error('Save error:', err)
      toast({ title: 'Error', description: 'Failed to save media item', variant: 'destructive' })
    }
  }

  const confirmDelete = async () => {
    if (!deleting) return
    try {
      await deleteMedia(deleting.id)
      toast({ title: 'Media deleted', description: 'The media item has been deleted successfully.', variant: 'success' })
      setDeleteOpen(false)
      setDeleting(null)
      loadMedia()
    } catch (err) {
      console.error('Delete error:', err)
      toast({ title: 'Error', description: 'Failed to delete media item', variant: 'destructive' })
    }
  }

  const copyUrl = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiedId(id)
      toast({ title: 'URL copied', description: 'The URL has been copied to clipboard.', variant: 'success' })
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error('Copy error:', err)
      toast({ title: 'Error', description: 'Failed to copy URL', variant: 'destructive' })
    }
  }

  const truncateUrl = (url: string, max = 40) => {
    if (url.length <= max) return url
    return url.slice(0, max) + '...'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold">Media Library</h2>
          <p className="text-sm text-muted-foreground">Manage images, videos, and documents</p>
        </div>
        <Button onClick={openAdd}><Plus className="h-4 w-4" />Add Media</Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {typeFilters.map((f) => (
          <Button key={f} size="sm" variant={filter === f ? 'default' : 'outline'} onClick={() => setFilter(f)} className="capitalize">
            {f === 'all' ? 'All' : f}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-56 rounded-lg" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <Image className="mb-3 h-12 w-12 opacity-40" />
          <p>No media items found. Click "Add Media" to upload one.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((m, i) => {
            const Icon = typeIcon[m.type]
            return (
              <motion.div key={m.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <div className="flex h-full flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm">
                  <div className="flex aspect-video items-center justify-center overflow-hidden bg-muted">
                    {m.type === 'image' && m.url ? (
                      <img src={m.url} alt={m.name} className="h-full w-full object-cover" loading="lazy" />
                    ) : m.type === 'image' && m.thumbnail_url ? (
                      <img src={m.thumbnail_url} alt={m.name} className="h-full w-full object-cover" loading="lazy" />
                    ) : (
                      <Icon className="h-12 w-12 text-muted-foreground/50" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium truncate flex-1">{m.name}</p>
                      <Badge variant={typeBadgeVariant[m.type]} className="capitalize shrink-0">{m.type}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground truncate" title={m.url}>{truncateUrl(m.url)}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEdit(m)}><Pencil className="h-3.5 w-3.5" />Edit</Button>
                      <Button size="sm" variant="ghost" onClick={() => copyUrl(m.url, m.id)}>
                        {copiedId === m.id ? <><Check className="h-3.5 w-3.5" />Copied</> : <><Copy className="h-3.5 w-3.5" />Copy</>}
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => { setDeleting(m); setDeleteOpen(true) }}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Media Item' : 'Add Media Item'}</DialogTitle>
            <DialogDescription>{editing ? 'Update the media item details below.' : 'Fill in the details below to add a new media item.'}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Image name" {...register('name')} aria-invalid={!!errors.name} />
              {errors.name && <p className="text-xs text-destructive" role="alert">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={typeValue} onValueChange={(val) => setValue('type', val as MediaType, { shouldValidate: true })}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                  <SelectItem value="document">Document</SelectItem>
                  <SelectItem value="folder">Folder</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && <p className="text-xs text-destructive" role="alert">{errors.type.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input id="url" placeholder="https://..." {...register('url')} aria-invalid={!!errors.url} />
              {errors.url && <p className="text-xs text-destructive" role="alert">{errors.url.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="thumbnail_url">Thumbnail URL</Label>
              <Input id="thumbnail_url" placeholder="https://..." {...register('thumbnail_url')} />
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
            <DialogTitle>Delete Media Item</DialogTitle>
            <DialogDescription>Are you sure you want to delete this media item? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          {deleting && (
            <div className="rounded-md border bg-muted/50 p-3">
              <p className="font-medium">{deleting.name}</p>
              <p className="text-sm text-muted-foreground truncate">{deleting.url}</p>
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
    </div>
  )
}
