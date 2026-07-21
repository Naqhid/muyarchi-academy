import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, FileText, Calendar, Star, Image, TrendingUp, Plus, GraduationCap, PlayCircle, MessageSquare } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { fetchCourses, fetchBlogs, fetchEvents, fetchTestimonials, fetchMedia, fetchScholarshipRegistrations, fetchDemoRegistrations, fetchEnquiries } from '@/lib/api'

export default function Dashboard() {
  const [counts, setCounts] = useState({ courses: 0, blogs: 0, events: 0, testimonials: 0, media: 0, scholarshipRegistrations: 0, demoRegistrations: 0, enquiries: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([fetchCourses(), fetchBlogs(), fetchEvents(), fetchTestimonials(), fetchMedia(), fetchScholarshipRegistrations(), fetchDemoRegistrations(), fetchEnquiries()])
      .then(([c, b, e, t, m, sr, dr, enq]) => { setCounts({ courses: c.length, blogs: b.length, events: e.length, testimonials: t.length, media: m.length, scholarshipRegistrations: sr.length, demoRegistrations: dr.length, enquiries: enq.length }) })
      .catch((err) => console.error('Dashboard fetch error:', err))
      .finally(() => setLoading(false))
  }, [])

  const stats = [
    { label: 'Courses', value: counts.courses, icon: BookOpen, to: '/admin/courses', color: 'text-primary' },
    { label: 'Blogs', value: counts.blogs, icon: FileText, to: '/admin/blogs', color: 'text-success' },
    { label: 'Events', value: counts.events, icon: Calendar, to: '/admin/events', color: 'text-warning' },
    { label: 'Testimonials', value: counts.testimonials, icon: Star, to: '/admin/testimonials', color: 'text-destructive' },
    { label: 'Media Items', value: counts.media, icon: Image, to: '/admin/media', color: 'text-primary' },
    { label: 'Scholarship Registrations', value: counts.scholarshipRegistrations, icon: GraduationCap, to: '/admin/scholarship', color: 'text-violet-600' },
    { label: 'Demo Registrations', value: counts.demoRegistrations, icon: PlayCircle, to: '/admin/demo-registrations', color: 'text-cyan-600' },
    { label: 'Enquiries', value: counts.enquiries, icon: MessageSquare, to: '/admin/enquiries', color: 'text-rose-600' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold">Dashboard</h2>
        <p className="text-sm text-muted-foreground">Welcome back! Here's an overview of your academy.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Link to={stat.to}>
              <Card className="transition-all hover:shadow-lg hover:-translate-y-1">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      {loading ? <Skeleton className="h-8 w-12" /> : <p className="font-display text-3xl font-bold">{stat.value}</p>}
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                    <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-muted ${stat.color}`}><stat.icon className="h-6 w-6" /></div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
      <Card>
        <CardHeader><CardTitle className="text-xl">Quick Actions</CardTitle><CardDescription>Manage your website content</CardDescription></CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Button asChild variant="outline" className="justify-start"><Link to="/admin/courses"><Plus className="h-4 w-4" />Add New Course</Link></Button>
          <Button asChild variant="outline" className="justify-start"><Link to="/admin/blogs"><Plus className="h-4 w-4" />Write New Blog</Link></Button>
          <Button asChild variant="outline" className="justify-start"><Link to="/admin/events"><Plus className="h-4 w-4" />Add New Event</Link></Button>
          <Button asChild variant="outline" className="justify-start"><Link to="/admin/testimonials"><Plus className="h-4 w-4" />Add Testimonial</Link></Button>
          <Button asChild variant="outline" className="justify-start"><Link to="/admin/media"><Plus className="h-4 w-4" />Add Media Item</Link></Button>
          <Button asChild variant="outline" className="justify-start"><Link to="/admin/settings"><TrendingUp className="h-4 w-4" />Update Settings</Link></Button>
        </CardContent>
      </Card>
    </div>
  )
}
