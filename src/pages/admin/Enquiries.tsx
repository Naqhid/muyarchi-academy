import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trash2, Loader2, MessageSquare, Calendar, Phone, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/hooks/use-toast'
import { fetchEnquiries, deleteEnquiry } from '@/lib/api'
import type { Enquiry } from '@/types'
import { ExportRecords } from '@/components/admin/ExportRecords'

export default function Enquiries() {
  const { toast } = useToast()
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<Enquiry | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const loadEnquiries = () => {
    setLoading(true)
    fetchEnquiries()
      .then((data) => setEnquiries(data))
      .catch((err) => { console.error('Failed to load enquiries:', err); toast({ title: 'Error', description: 'Failed to load enquiries', variant: 'destructive' }) })
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadEnquiries() }, [])

  const confirmDelete = async () => {
    if (!deleting) return
    try {
      await deleteEnquiry(deleting.id)
      toast({ title: 'Enquiry deleted', description: 'The enquiry has been deleted successfully.', variant: 'success' })
      setDeleteOpen(false)
      setDeleting(null)
      loadEnquiries()
    } catch (err) {
      console.error('Delete error:', err)
      toast({ title: 'Error', description: 'Failed to delete enquiry', variant: 'destructive' })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold">Enquiries</h2>
          <p className="text-sm text-muted-foreground">View and manage contact form enquiries</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ExportRecords title="Enquiries" rows={enquiries} columns={[
            { label: 'Name', value: (item) => item.name }, { label: 'Phone', value: (item) => item.phone },
            { label: 'Class / Course', value: (item) => item.class_course }, { label: 'Message', value: (item) => item.message },
            { label: 'Submitted', value: (item) => formatDate(item.created_at) },
          ]} />
          <MessageSquare className="h-4 w-4" />
          <span>{enquiries.length} total</span>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-lg" />)}
        </div>
      ) : enquiries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <MessageSquare className="mb-3 h-12 w-12 opacity-40" />
          <p>No enquiries yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {enquiries.map((enquiry, i) => (
            <motion.div key={enquiry.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <div className="rounded-lg border bg-card p-5 text-card-foreground shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{enquiry.name}</h3>
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{enquiry.class_course}</span>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{enquiry.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <BookOpen className="h-4 w-4" />
                        <span className="truncate">{enquiry.class_course}</span>
                      </div>
                    </div>
                    <div className="rounded-md bg-muted/50 p-3">
                      <p className="text-sm text-muted-foreground">{enquiry.message}</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>Submitted on {formatDate(enquiry.created_at)}</span>
                    </div>
                  </div>
                  <Button size="sm" variant="destructive" onClick={() => { setDeleting(enquiry); setDeleteOpen(true) }}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Enquiry</DialogTitle>
            <DialogDescription>Are you sure you want to delete this enquiry? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          {deleting && (
            <div className="rounded-md border bg-muted/50 p-3 space-y-2">
              <p className="font-medium">{deleting.name}</p>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Phone: {deleting.phone}</p>
                <p>Course: {deleting.class_course}</p>
                <p className="line-clamp-2">{deleting.message}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button type="button" variant="destructive" onClick={confirmDelete}>
              <Trash2 className="h-4 w-4 mr-2" />Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
