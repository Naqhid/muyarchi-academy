import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { GraduationCap, Clock, DollarSign, CheckCircle2, BookOpen } from 'lucide-react'
import { Section, SectionHeader, FadeIn } from '@/components/shared/Section'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { fetchActiveCourses } from '@/lib/api'
import type { Course } from '@/types'

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchActiveCourses().then((data) => setCourses(data)).catch((err) => console.error(err)).finally(() => setLoading(false))
  }, [])

  return (
    <>
      <section className="relative flex min-h-[40vh] items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="container relative mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-4"><GraduationCap className="mr-1.5 h-4 w-4" />Our Courses</Badge>
          <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">Explore Our Courses</h1>
          <p className="mt-4 text-lg text-muted-foreground">Professional courses designed to help you excel in your career</p>
        </motion.div>
      </section>
      <Section>
        <SectionHeader title="Available Courses" subtitle="Browse our comprehensive course catalog" />
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-96 rounded-lg" />)}</div>
        ) : courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground"><BookOpen className="mb-3 h-12 w-12 opacity-40" /><p>No courses available yet</p></div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course, i) => (
              <FadeIn key={course.id} delay={i * 0.05}>
                <Card className="group h-full overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
                  <div className="aspect-video overflow-hidden bg-muted">
                    {course.thumbnail_url ? <img src={course.thumbnail_url} alt={course.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" loading="lazy" /> : <div className="flex h-full items-center justify-center"><GraduationCap className="h-12 w-12 text-muted-foreground/40" /></div>}
                  </div>
                  <CardContent className="p-5">
                    <Badge variant={course.status === 'active' ? 'success' : 'secondary'} className="mb-2">{course.status}</Badge>
                    <h3 className="font-display text-lg font-semibold">{course.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{course.description}</p>
                    <div className="mt-4 space-y-2 text-sm">
                      {course.duration && <div className="flex items-center gap-2 text-muted-foreground"><Clock className="h-4 w-4 text-primary" /><span>{course.duration}</span></div>}
                      {course.fees && <div className="flex items-center gap-2 text-muted-foreground"><DollarSign className="h-4 w-4 text-primary" /><span>{course.fees}</span></div>}
                      {course.eligibility && <div className="flex items-center gap-2 text-muted-foreground"><CheckCircle2 className="h-4 w-4 text-primary" /><span>{course.eligibility}</span></div>}
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        )}
      </Section>
    </>
  )
}
