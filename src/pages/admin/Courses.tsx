import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Pencil, Trash2, Loader2, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/hooks/use-toast'
import { fetchCourses, createCourse, updateCourse, deleteCourse } from '@/lib/api'
import type { Course, CourseInput } from '@/types'

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  title_ta: z.string().optional().default(''),
  description: z.string().optional().default(''),
  description_ta: z.string().optional().default(''),
  duration: z.string().optional().default(''),
  duration_ta: z.string().optional().default(''),
  fees: z.string().optional().default(''),
  eligibility: z.string().optional().default(''),
  eligibility_ta: z.string().optional().default(''),
  thumbnail_url: z.string().optional().default(''),
  status: z.enum(['active', 'inactive']).default('active'),
  sort_order: z.coerce.number().int().default(0),
})
type FormData = z.infer<typeof schema>

export default function Courses() {
  const { toast } = useToast()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Course | null>(null)
  const [deleting, setDeleting] = useState<Course | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletingId, setDeletingId] = useState(false)

  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { title: '', title_ta: '', description: '', description_ta: '', duration: '', duration_ta: '', fees: '', eligibility: '', eligibility_ta: '', thumbnail_url: '', status: 'active', sort_order: 0 },
  })

  const load = () => {
    setLoading(true)
    fetchCourses()
      .then((data) => setCourses(data))
      .catch((err) => {
        console.error('Fetch courses error:', err)
        toast({ title: 'Error', description: 'Failed to load courses', variant: 'destructive' })
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openCreate = () => {
    setEditing(null)
    reset({ title: '', title_ta: '', description: '', description_ta: '', duration: '', duration_ta: '', fees: '', eligibility: '', eligibility_ta: '', thumbnail_url: '', status: 'active', sort_order: 0 })
    setDialogOpen(true)
  }

  const openEdit = (course: Course) => {
    setEditing(course)
    reset({
      title: course.title,
      title_ta: course.title_ta || '',
      description: course.description,
      description_ta: course.description_ta || '',
      duration: course.duration,
      duration_ta: course.duration_ta || '',
      fees: course.fees,
      eligibility: course.eligibility,
      eligibility_ta: course.eligibility_ta || '',
      thumbnail_url: course.thumbnail_url,
      status: course.status,
      sort_order: course.sort_order,
    })
    setDialogOpen(true)
  }

  const onSubmit = async (data: FormData) => {
    try {
      const input: CourseInput = {
        title: data.title,
        title_ta: data.title_ta ?? '',
        description: data.description ?? '',
        description_ta: data.description_ta ?? '',
        duration: data.duration ?? '',
        duration_ta: data.duration_ta ?? '',
        fees: data.fees ?? '',
        eligibility: data.eligibility ?? '',
        eligibility_ta: data.eligibility_ta ?? '',
        thumbnail_url: data.thumbnail_url ?? '',
        status: data.status,
        sort_order: data.sort_order,
      }
      if (editing) {
        await updateCourse(editing.id, input)
        toast({ title: 'Course updated', description: `"${input.title}" has been updated.`, variant: 'success' })
      } else {
        await createCourse(input)
        toast({ title: 'Course created', description: `"${input.title}" has been added.`, variant: 'success' })
      }
      setDialogOpen(false)
      setEditing(null)
      reset()
      load()
    } catch (err) {
      console.error('Save course error:', err)
      toast({ title: 'Error', description: 'Failed to save course', variant: 'destructive' })
    }
  }

  const confirmDelete = async () => {
    if (!deleting) return
    setDeletingId(true)
    try {
      await deleteCourse(deleting.id)
      toast({ title: 'Course deleted', description: `"${deleting.title}" has been removed.`, variant: 'success' })
      setDeleteOpen(false)
      setDeleting(null)
      load()
    } catch (err) {
      console.error('Delete course error:', err)
      toast({ title: 'Error', description: 'Failed to delete course', variant: 'destructive' })
    } finally {
      setDeletingId(false)
    }
  }

  const statusValue = watch('status')

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold">Courses</h2>
          <p className="text-sm text-muted-foreground">Manage your academy courses</p>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4" />Add Course</Button>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <Skeleton className="h-40 w-full rounded-none" />
              <CardContent className="p-6 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <BookOpen className="mb-3 h-12 w-12 opacity-40" />
          <p className="mb-4 text-lg font-medium">No courses yet</p>
          <Button onClick={openCreate}><Plus className="h-4 w-4" />Add your first course</Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course, i) => (
            <motion.div key={course.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="overflow-hidden">
                <div className="h-40 w-full overflow-hidden bg-muted">
                  {course.thumbnail_url ? (
                    <img src={course.thumbnail_url} alt={course.title} className="h-40 w-full object-cover" loading="lazy" />
                  ) : (
                    <div className="flex h-40 items-center justify-center bg-muted"><BookOpen className="h-10 w-10 text-muted-foreground/40" /></div>
                  )}
                </div>
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display text-lg font-semibold leading-tight">{course.title}</h3>
                    <Badge variant={course.status === 'active' ? 'success' : 'secondary'} className="capitalize shrink-0">{course.status}</Badge>
                  </div>
                  {course.description && <p className="line-clamp-2 text-sm text-muted-foreground">{course.description}</p>}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    {course.duration && <span>Duration: {course.duration}</span>}
                    {course.fees && <span>Fees: {course.fees}</span>}
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" onClick={() => openEdit(course)}><Pencil className="h-4 w-4" />Edit</Button>
                    <Button variant="outline" size="sm" onClick={() => { setDeleting(course); setDeleteOpen(true) }}><Trash2 className="h-4 w-4" />Delete</Button>
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
            <DialogTitle>{editing ? 'Edit Course' : 'Add Course'}</DialogTitle>
            <DialogDescription>{editing ? 'Update the course details below.' : 'Fill in the details to create a new course.'}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title (English)</Label>
              <Input id="title" placeholder="Enter course title" {...register('title')} aria-invalid={!!errors.title} />
              {errors.title && <p className="text-xs text-destructive" role="alert">{errors.title.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="title_ta">Title (Tamil)</Label>
              <Input id="title_ta" placeholder="பாடநெறி தலைப்பு" {...register('title_ta')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (English)</Label>
              <Textarea id="description" placeholder="Enter course description" {...register('description')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description_ta">Description (Tamil)</Label>
              <Textarea id="description_ta" placeholder="பாடநெறி விளக்கம்" {...register('description_ta')} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (English)</Label>
                <Input id="duration" placeholder="e.g. 6 months" {...register('duration')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration_ta">Duration (Tamil)</Label>
                <Input id="duration_ta" placeholder="காலம்" {...register('duration_ta')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fees">Fees</Label>
                <Input id="fees" placeholder="e.g. ₹10,000" {...register('fees')} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="eligibility">Eligibility (English)</Label>
              <Input id="eligibility" placeholder="e.g. 10th pass" {...register('eligibility')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eligibility_ta">Eligibility (Tamil)</Label>
              <Input id="eligibility_ta" placeholder="தகுதி" {...register('eligibility_ta')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="thumbnail_url">Thumbnail URL</Label>
              <Input id="thumbnail_url" placeholder="https://..." {...register('thumbnail_url')} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={statusValue} onValueChange={(v) => setValue('status', v as 'active' | 'inactive')}>
                  <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sort_order">Sort Order</Label>
                <Input id="sort_order" type="number" placeholder="0" {...register('sort_order')} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => { setDialogOpen(false); setEditing(null); reset() }}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" />{editing ? 'Updating...' : 'Creating...'}</> : editing ? 'Update Course' : 'Create Course'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onOpenChange={(open) => { setDeleteOpen(open); if (!open) setDeleting(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Course</DialogTitle>
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
