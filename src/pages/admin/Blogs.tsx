import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Pencil, Trash2, Loader2, FileText, Languages } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import { formatDate } from '@/lib/utils'
import { fetchBlogs, createBlog, updateBlog, deleteBlog } from '@/lib/api'
import { TranslationSection } from '@/components/admin/TranslationSection'
import type { Blog, BlogInput } from '@/types'

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  title_ta: z.string().optional().default(''),
  description: z.string().optional().default(''),
  description_ta: z.string().optional().default(''),
  content: z.string().optional().default(''),
  content_ta: z.string().optional().default(''),
  author: z.string().min(1, 'Author is required'),
  thumbnail_url: z.string().optional().default(''),
  published: z.boolean().default(false),
  published_at: z.string().optional().default(''),
})
type FormData = z.infer<typeof schema>

export default function Blogs() {
  const { toast } = useToast()
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Blog | null>(null)
  const [deleting, setDeleting] = useState<Blog | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletingId, setDeletingId] = useState(false)
  const [showTranslations, setShowTranslations] = useState(false)

  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { title: '', title_ta: '', description: '', description_ta: '', content: '', content_ta: '', author: '', thumbnail_url: '', published: false, published_at: '' },
  })

  const load = () => {
    setLoading(true)
    fetchBlogs()
      .then((data) => setBlogs(data))
      .catch((err) => {
        console.error('Fetch blogs error:', err)
        toast({ title: 'Error', description: 'Failed to load blogs', variant: 'destructive' })
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openCreate = () => {
    setEditing(null)
    reset({ title: '', title_ta: '', description: '', description_ta: '', content: '', content_ta: '', author: '', thumbnail_url: '', published: false, published_at: '' })
    setDialogOpen(true)
  }

  const openEdit = (blog: Blog) => {
    setEditing(blog)
    reset({
      title: blog.title,
      title_ta: blog.title_ta || '',
      description: blog.description,
      description_ta: blog.description_ta || '',
      content: blog.content,
      content_ta: blog.content_ta || '',
      author: blog.author,
      thumbnail_url: blog.thumbnail_url,
      published: blog.published,
      published_at: blog.published_at ? blog.published_at.split('T')[0] : '',
    })
    setDialogOpen(true)
  }

  const onSubmit = async (data: FormData) => {
    try {
      const input: BlogInput = {
        title: data.title,
        title_ta: data.title_ta ?? '',
        description: data.description ?? '',
        description_ta: data.description_ta ?? '',
        content: data.content ?? '',
        content_ta: data.content_ta ?? '',
        author: data.author,
        thumbnail_url: data.thumbnail_url ?? '',
        published: data.published,
        published_at: data.published_at ?? '',
      }
      if (editing) {
        await updateBlog(editing.id, input)
        toast({ title: 'Blog updated', description: `"${input.title}" has been updated.`, variant: 'success' })
      } else {
        await createBlog(input)
        toast({ title: 'Blog created', description: `"${input.title}" has been added.`, variant: 'success' })
      }
      setDialogOpen(false)
      setEditing(null)
      reset()
      load()
    } catch (err) {
      console.error('Save blog error:', err)
      toast({ title: 'Error', description: 'Failed to save blog', variant: 'destructive' })
    }
  }

  const confirmDelete = async () => {
    if (!deleting) return
    setDeletingId(true)
    try {
      await deleteBlog(deleting.id)
      toast({ title: 'Blog deleted', description: `"${deleting.title}" has been removed.`, variant: 'success' })
      setDeleteOpen(false)
      setDeleting(null)
      load()
    } catch (err) {
      console.error('Delete blog error:', err)
      toast({ title: 'Error', description: 'Failed to delete blog', variant: 'destructive' })
    } finally {
      setDeletingId(false)
    }
  }

  const publishedValue = watch('published')

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold">Blogs</h2>
          <p className="text-sm text-muted-foreground">Manage your blog posts</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowTranslations(!showTranslations)}><Languages className="h-4 w-4" />{showTranslations ? 'Hide' : 'Show'} Translations</Button>
          <Button onClick={openCreate}><Plus className="h-4 w-4" />Add Blog</Button>
        </div>
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
      ) : blogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <FileText className="mb-3 h-12 w-12 opacity-40" />
          <p className="mb-4 text-lg font-medium">No blogs yet</p>
          <Button onClick={openCreate}><Plus className="h-4 w-4" />Add your first blog</Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog, i) => (
            <motion.div key={blog.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="overflow-hidden">
                <div className="h-40 w-full overflow-hidden bg-muted">
                  {blog.thumbnail_url ? (
                    <img src={blog.thumbnail_url} alt={blog.title} className="h-40 w-full object-cover" loading="lazy" />
                  ) : (
                    <div className="flex h-40 items-center justify-center bg-muted"><FileText className="h-10 w-10 text-muted-foreground/40" /></div>
                  )}
                </div>
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display text-lg font-semibold leading-tight">{blog.title}</h3>
                    <Badge variant={blog.published ? 'success' : 'secondary'} className="shrink-0">{blog.published ? 'Published' : 'Draft'}</Badge>
                  </div>
                  {blog.description && <p className="line-clamp-2 text-sm text-muted-foreground">{blog.description}</p>}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    {blog.author && <span>By {blog.author}</span>}
                    {blog.published_at && <span>{formatDate(blog.published_at)}</span>}
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" onClick={() => openEdit(blog)}><Pencil className="h-4 w-4" />Edit</Button>
                    <Button variant="outline" size="sm" onClick={() => { setDeleting(blog); setDeleteOpen(true) }}><Trash2 className="h-4 w-4" />Delete</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) { setEditing(null); reset() } }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Blog' : 'Add Blog'}</DialogTitle>
            <DialogDescription>{editing ? 'Update the blog details below.' : 'Fill in the details to create a new blog post.'}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title (English)</Label>
              <Input id="title" placeholder="Enter blog title" {...register('title')} aria-invalid={!!errors.title} />
              {errors.title && <p className="text-xs text-destructive" role="alert">{errors.title.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="title_ta">Title (Tamil)</Label>
              <Input id="title_ta" placeholder="வலைப்பதிவு தலைப்பு" {...register('title_ta')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (English)</Label>
              <Textarea id="description" placeholder="Enter blog description" {...register('description')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description_ta">Description (Tamil)</Label>
              <Textarea id="description_ta" placeholder="வலைப்பதிவு விளக்கம்" {...register('description_ta')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content (English)</Label>
              <Textarea id="content" rows={8} placeholder="Enter blog content" {...register('content')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content_ta">Content (Tamil)</Label>
              <Textarea id="content_ta" rows={8} placeholder="வலைப்பதிவு உள்ளடக்கம்" {...register('content_ta')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input id="author" placeholder="Enter author name" {...register('author')} aria-invalid={!!errors.author} />
              {errors.author && <p className="text-xs text-destructive" role="alert">{errors.author.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="thumbnail_url">Thumbnail URL</Label>
              <Input id="thumbnail_url" placeholder="https://..." {...register('thumbnail_url')} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="published_at">Published Date</Label>
                <Input id="published_at" type="date" {...register('published_at')} />
              </div>
              <div className="flex items-center gap-3 pt-7">
                <Switch id="published" checked={publishedValue} onCheckedChange={(checked) => setValue('published', checked)} />
                <Label htmlFor="published">Published</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => { setDialogOpen(false); setEditing(null); reset() }}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" />{editing ? 'Updating...' : 'Creating...'}</> : editing ? 'Update Blog' : 'Create Blog'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onOpenChange={(open) => { setDeleteOpen(open); if (!open) setDeleting(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Blog</DialogTitle>
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

      {/* Blog Translations */}
      {showTranslations && (
        <div className="mt-8 space-y-4">
          <div>
            <h3 className="font-display text-lg font-bold mb-2">Blog Page Translations</h3>
            <p className="text-sm text-muted-foreground mb-4">Edit text that appears on the blog listing and detail pages</p>
          </div>
          <TranslationSection
            prefix="blog"
            title="Blog Page Text"
            description="Manage blog page labels, headings, and other UI text"
          />
        </div>
      )}
    </div>
  )
}
