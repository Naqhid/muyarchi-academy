import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trash2, Loader2, Users, Calendar, Phone, MapPin, GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/hooks/use-toast'
import { fetchScholarshipRegistrations, deleteScholarshipRegistration } from '@/lib/api'
import type { ScholarshipRegistration } from '@/types'
import { ExportRecords } from '@/components/admin/ExportRecords'

export default function ScholarshipRegistrations() {
  const { toast } = useToast()
  const [registrations, setRegistrations] = useState<ScholarshipRegistration[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<ScholarshipRegistration | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const loadRegistrations = () => {
    setLoading(true)
    fetchScholarshipRegistrations()
      .then((data) => setRegistrations(data))
      .catch((err) => { console.error('Failed to load registrations:', err); toast({ title: 'Error', description: 'Failed to load registrations', variant: 'destructive' }) })
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadRegistrations() }, [])

  const confirmDelete = async () => {
    if (!deleting) return
    try {
      await deleteScholarshipRegistration(deleting.id)
      toast({ title: 'Registration deleted', description: 'The registration has been deleted successfully.', variant: 'success' })
      setDeleteOpen(false)
      setDeleting(null)
      loadRegistrations()
    } catch (err) {
      console.error('Delete error:', err)
      toast({ title: 'Error', description: 'Failed to delete registration', variant: 'destructive' })
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
          <h2 className="font-display text-2xl font-bold">Scholarship Registrations</h2>
          <p className="text-sm text-muted-foreground">View and manage scholarship test registrations</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ExportRecords title="Scholarship Registrations" rows={registrations} columns={[
            { label: 'Student', value: (item) => item.student_name }, { label: 'Class', value: (item) => item.class },
            { label: 'School', value: (item) => item.school }, { label: 'Parent', value: (item) => item.parent_name },
            { label: 'Parent phone', value: (item) => item.parent_phone }, { label: 'Town / Village', value: (item) => item.town_village },
            { label: 'Registered', value: (item) => formatDate(item.created_at) },
          ]} />
          <Users className="h-4 w-4" />
          <span>{registrations.length} total</span>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-lg" />)}
        </div>
      ) : registrations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <GraduationCap className="mb-3 h-12 w-12 opacity-40" />
          <p>No scholarship registrations yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {registrations.map((reg, i) => (
            <motion.div key={reg.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <div className="rounded-lg border bg-card p-5 text-card-foreground shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{reg.student_name}</h3>
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">Class {reg.class}</span>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <GraduationCap className="h-4 w-4" />
                        <span className="truncate">{reg.school}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{reg.parent_name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{reg.parent_phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span className="truncate">{reg.town_village}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>Registered on {formatDate(reg.created_at)}</span>
                    </div>
                  </div>
                  <Button size="sm" variant="destructive" onClick={() => { setDeleting(reg); setDeleteOpen(true) }}>
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
            <DialogTitle>Delete Registration</DialogTitle>
            <DialogDescription>Are you sure you want to delete this scholarship registration? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          {deleting && (
            <div className="rounded-md border bg-muted/50 p-3 space-y-2">
              <p className="font-medium">{deleting.student_name}</p>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Class: {deleting.class}</p>
                <p>School: {deleting.school}</p>
                <p>Parent: {deleting.parent_name}</p>
                <p>Phone: {deleting.parent_phone}</p>
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
