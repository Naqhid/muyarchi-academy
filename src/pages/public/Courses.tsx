import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { GraduationCap, Clock, CheckCircle2, BookOpen } from 'lucide-react'
import { Section, SectionHeader, FadeIn } from '@/components/shared/Section'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { fetchActiveCourses } from '@/lib/api'
import { useLanguage, pickLang } from '@/hooks/use-language'
import type { Course } from '@/types'

export default function Courses() {
  const { t, language } = useLanguage()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchActiveCourses().then((data) => setCourses(data)).catch((err) => console.error(err)).finally(() => setLoading(false))
  }, [])

  return (
    <>
      <section className="relative flex min-h-[55vh] items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-primary">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#3b82f630,transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,#06b6d430,transparent_40%)]" />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.05]" />
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }} className="container relative mx-auto px-4 text-center"
        >
          <Badge className="mb-6 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-white backdrop-blur">
            <GraduationCap className="mr-2 h-4 w-4" /> {t('nav.courses')}
          </Badge>
          <h1 className="mx-auto max-w-4xl font-display text-5xl font-extrabold leading-tight tracking-tight text-white md:text-7xl">
            {t('courses.title', 'Our Courses')}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
            {t('courses.subtitle', 'Quality coaching programs designed to help students excel')}
          </p>
        </motion.div>
      </section>

      <Section>
        {loading ? (
          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-[520px] rounded-3xl" />)}
          </div>
        ) : courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed py-20 text-muted-foreground">
            <BookOpen className="mb-5 h-16 w-16 opacity-40" />
            <h3 className="text-xl font-semibold">{t('courses.noCourses', 'No Courses Available')}</h3>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {courses.map((course, i) => (
              <FadeIn key={course.id} delay={i * 0.05}>
                <Link to={`/courses/${course.id}`} className="block h-full">
                  <Card className="group h-full overflow-hidden rounded-2xl border-0 shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl cursor-pointer">
                    <div className="relative aspect-video overflow-hidden bg-accent">
                      {course.thumbnail_url
                        ? <img src={course.thumbnail_url} alt={course.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                        : <div className="flex h-full items-center justify-center bg-accent" />
                      }
                      <Badge className={`absolute left-3 top-3 text-xs capitalize ${course.status === 'active' ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'}`}>
                        {course.status}
                      </Badge>
                    </div>
                    <CardContent className="p-5">
                      <h3 className="font-display text-xl font-semibold leading-snug transition-colors group-hover:text-primary">
                        {pickLang(course.title, course.title_ta, language)}
                      </h3>
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
                        {pickLang(course.description, course.description_ta, language)}
                      </p>
                      <div className="mt-5 space-y-3 text-sm">
                        {course.duration && (
                          <div className="flex items-center gap-3 rounded-xl bg-primary/5 p-3">
                            <Clock className="h-5 w-5 text-primary" />
                            <div>
                              <p className="text-xs text-muted-foreground">{t('courses.duration', 'Duration')}</p>
                              <p className="font-medium">{pickLang(course.duration, course.duration_ta, language)}</p>
                            </div>
                          </div>
                        )}
                        {course.eligibility && (
                          <div className="flex items-center gap-3 rounded-xl bg-blue-50 p-3">
                            <CheckCircle2 className="h-5 w-5 text-blue-600" />
                            <div>
                              <p className="text-xs text-muted-foreground">{t('courses.eligibility', 'Eligibility')}</p>
                              <p className="font-medium">{pickLang(course.eligibility, course.eligibility_ta, language)}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </FadeIn>
            ))}
          </div>
        )}
      </Section>
    </>
  )
}
