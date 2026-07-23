import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, CheckCircle2, GraduationCap, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Section, SectionHeader } from '@/components/shared/Section'
import { fetchCourseById } from '@/lib/api'
import { useLanguage, pickLang } from '@/hooks/use-language'
import type { Course } from '@/types'

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>()
  const { t, language } = useLanguage()
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    fetchCourseById(id)
      .then((data) => setCourse(data))
      .catch((err) => { console.error('Error fetching course:', err); setError('Failed to load course') })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <Skeleton className="mb-6 h-8 w-48" />
          <Skeleton className="mb-4 h-12 w-3/4" />
          <Skeleton className="mb-8 h-6 w-1/2" />
          <Skeleton className="mb-4 h-96 w-full" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-full" /><Skeleton className="h-6 w-full" /><Skeleton className="h-6 w-3/4" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl text-center">
          <GraduationCap className="mx-auto mb-4 h-16 w-16 text-muted-foreground opacity-40" />
          <h2 className="mb-2 text-2xl font-semibold">Course Not Found</h2>
          <p className="mb-6 text-muted-foreground">{error || 'The course you are looking for does not exist.'}</p>
          <Button asChild variant="outline"><Link to="/courses">{t('courseDetail.backToCourses', 'Back to Courses')}</Link></Button>
        </div>
      </div>
    )
  }

  const title = pickLang(course.title, course.title_ta, language)
  const description = pickLang(course.description, course.description_ta, language)
  const duration = pickLang(course.duration, course.duration_ta, language)
  const eligibility = pickLang(course.eligibility, course.eligibility_ta, language)

  return (
    <>
      <section className="relative flex min-h-[40vh] items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-primary">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#3b82f630,transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,#06b6d430,transparent_40%)]" />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.05]" />
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }} className="container relative mx-auto px-4 text-center"
        >
          <div className="mb-6">
            <Button asChild variant="ghost" size="lg" className="text-white hover:text-white hover:bg-white/10">
              <Link to="/courses"><ArrowLeft className="mr-2 h-5 w-5" />{t('courseDetail.backToCourses', 'Back to Courses')}</Link>
            </Button>
          </div>
          <Badge className={`mb-6 text-sm font-medium ${course.status === 'active' ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'}`}>
            {course.status}
          </Badge>
          <h1 className="mx-auto max-w-4xl font-display text-4xl font-extrabold leading-tight tracking-tight text-white md:text-5xl">{title}</h1>
        </motion.div>
      </section>

      <Section>
        <SectionHeader title={t('courseDetail.aboutCourse', 'Course Overview')} subtitle={t('courseDetail.aboutCourse', 'Everything you need to know about this course')} centered={false} />
        <div className="grid gap-8 lg:grid-cols-3">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-1">
            <Card className="overflow-hidden rounded-2xl border-0 shadow-lg">
              <div className="aspect-video overflow-hidden bg-accent">
                {course.thumbnail_url ? (
                  <img src={course.thumbnail_url} alt={title} className="h-full w-full object-cover" loading="lazy" />
                ) : (
                  <div className="flex h-full items-center justify-center bg-accent"><GraduationCap className="h-16 w-16 text-muted-foreground" /></div>
                )}
              </div>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2">
            <Card className="rounded-2xl border-0 shadow-sm">
              <CardContent className="p-8">
                <p className="text-lg leading-relaxed text-muted-foreground mb-8">{description}</p>
                <div className="grid gap-6 sm:grid-cols-2">
                  {duration && (
                    <div className="rounded-xl bg-primary/5 p-4">
                      <div className="flex items-center gap-3">
                        <Clock className="h-6 w-6 text-primary" />
                        <div><p className="text-sm text-muted-foreground">{t('courseDetail.duration', 'Duration')}</p><p className="font-semibold">{duration}</p></div>
                      </div>
                    </div>
                  )}
                  {course.fees && (
                    <div className="rounded-xl bg-green-50 p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 font-bold text-green-700">₹</div>
                        <div><p className="text-sm text-muted-foreground">{t('courseDetail.fees', 'Fees')}</p><p className="font-semibold">{course.fees}</p></div>
                      </div>
                    </div>
                  )}
                  {eligibility && (
                    <div className="rounded-xl bg-blue-50 p-4">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-6 w-6 text-blue-600" />
                        <div><p className="text-sm text-muted-foreground">{t('courseDetail.eligibility', 'Eligibility')}</p><p className="font-semibold">{eligibility}</p></div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </Section>

      <Section className="bg-muted/50">
        <SectionHeader title="Course Highlights" subtitle="Key features of this program" centered={false} />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="rounded-2xl border-0 shadow-sm"><CardContent className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary"><Users className="h-6 w-6" /></div>
              <h3 className="font-semibold text-lg">Target Audience</h3>
              <p className="mt-2 text-sm text-muted-foreground">Suitable for students aiming for {title} preparation</p>
            </CardContent></Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="rounded-2xl border-0 shadow-sm"><CardContent className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-success"><GraduationCap className="h-6 w-6" /></div>
              <h3 className="font-semibold text-lg">Learning Outcomes</h3>
              <p className="mt-2 text-sm text-muted-foreground">Comprehensive preparation with expert guidance and practice tests</p>
            </CardContent></Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="rounded-2xl border-0 shadow-sm"><CardContent className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-warning/10 text-warning"><CheckCircle2 className="h-6 w-6" /></div>
              <h3 className="font-semibold text-lg">Certification</h3>
              <p className="mt-2 text-sm text-muted-foreground">Certificate provided upon successful completion</p>
            </CardContent></Card>
          </motion.div>
        </div>
      </Section>

      <Section>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-primary md:text-4xl">Ready to Enroll?</h2>
          <p className="mt-4 text-lg text-muted-foreground">Join this course and start your journey towards academic excellence.</p>
          <div className="mt-8">
            <Button asChild size="lg" className="bg-gradient-to-r from-primary to-blue-600">
              <Link to="/contact">{t('courseDetail.enrollNow', 'Contact Us to Enroll')}</Link>
            </Button>
          </div>
        </motion.div>
      </Section>
    </>
  )
}
