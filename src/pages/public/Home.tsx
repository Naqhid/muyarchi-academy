import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight, Eye, Target, BookOpen,
  Calendar, Award, TrendingUp, ChevronRight,
  Clock,
} from 'lucide-react'
import { Section, FadeIn } from '@/components/shared/Section'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { useSettings } from '@/hooks/use-settings'
import { useLanguage, pickLang } from '@/hooks/use-language'
import { fetchActiveCourses, fetchPublishedBlogs, fetchEvents } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import type { Course, Blog, EventItem } from '@/types'

const safeString = (val: unknown, fallback = ''): string => {
  if (typeof val === 'string') return val
  if (val && typeof val === 'object') return JSON.stringify(val)
  return fallback
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3 inline-flex items-center gap-2 rounded-md border border-secondary/30 bg-secondary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-secondary">
      {children}
    </div>
  )
}

function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.5 }}
      className="mb-12 text-center"
    >
      <h2 className="font-display text-3xl font-semibold tracking-tight text-primary md:text-4xl">{title}</h2>
      <div className="mx-auto mt-3 h-0.5 w-12 bg-secondary" />
      {subtitle && <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>}
    </motion.div>
  )
}

function EmptyState({ icon: Icon, message }: { icon: React.ElementType; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <Icon className="h-8 w-8 opacity-40" />
      </div>
      <p className="text-sm">{message}</p>
    </div>
  )
}

export default function Home() {
  const { settings } = useSettings()
  const { t, language } = useLanguage()
  const [courses, setCourses] = useState<Course[]>([])
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)

  const academyName = pickLang(safeString(settings?.academy_name, 'Muyarchi Academy'), safeString(settings?.academy_name_ta), language)
  const heroSubtitle = pickLang(safeString(settings?.hero_subtitle, 'Empowering students in Vaniyambadi with quality education and coaching for a brighter future.'), safeString(settings?.hero_subtitle_ta), language)

  useEffect(() => {
    Promise.all([fetchActiveCourses(), fetchPublishedBlogs(), fetchEvents()])
      .then(([c, b, e]) => {
        setCourses(c.slice(0, 6)); setBlogs(b.slice(0, 3))
        setEvents(e.slice(0, 3))
      })
      .catch((err) => console.error('Home fetch error:', err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
        <div className="absolute inset-0 opacity-[0.02]" />

        <div className="container relative mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }} className="mx-auto max-w-4xl"
          >
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
              <h1 className="font-display text-5xl font-bold leading-tight tracking-tight text-primary sm:text-6xl lg:text-7xl">
                {academyName}
              </h1>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-8">
              <p className="font-serif text-2xl font-light text-secondary md:text-3xl">
                {t('home.kural', 'முயற்சி திருவினையாக்கும்')}
              </p>
              <div className="mx-auto mt-4 h-0.5 w-24 bg-secondary" />
            </motion.div>

            <p className="mt-8 text-lg text-foreground/80 md:text-xl max-w-2xl mx-auto leading-relaxed">
              {heroSubtitle}
            </p>

            <div className="mt-12 flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="gap-2 rounded-md px-8 bg-secondary text-white hover:bg-secondary/90 font-semibold">
                <Link to="/scholarship">{t('home.bookDemo', 'Register for the Scholarship Test')}</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="gap-2 rounded-md px-8">
                <Link to="/free-demo">{t('freeDemo.title', 'Book a free demo class')}</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── ABOUT ─────────────────────────────────────────────── */}
      <Section id="about" className="mt-6 bg-primary text-white">
        <FadeIn>
          <div className="mx-auto flex max-w-4xl flex-col items-center text-center py-8">
            <h2 className="font-display text-4xl font-semibold md:text-5xl mb-6">{t('home.visionHeading', 'Our Vision')}</h2>
            <p className="text-xl leading-relaxed font-light">
              {pickLang(safeString(settings?.vision, "In Vaniyambadi and the villages around it, a child's talent and effort — not family income or location — decide how far they go."), safeString(settings?.vision_ta), language)}
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="mx-auto max-w-3xl text-center mt-12 pt-8 border-t border-white/20">
            <h3 className="font-display text-2xl font-semibold mb-4">{t('home.aboutHeading', 'About the Academy')}</h3>
            <p className="text-lg leading-relaxed font-light">
              {pickLang(safeString(settings?.about, "Muyarchi Academy is a new coaching institute in Vaniyambadi, started with a simple belief: a student here should not need to travel to Vellore or Chennai — or pay city fees — to get serious coaching. We teach strong fundamentals from Class 8, prepare senior students for medical and engineering entrance examinations, build spoken English from Class 1, and coach working professionals for CMA. Small batches, monthly tests with ranked results shared with parents, and teachers selected through live demonstration classes — that is how we work."), safeString(settings?.about_ta), language)}
            </p>
            <Button asChild className="mt-8 bg-secondary text-white hover:bg-secondary/90 font-semibold rounded-md px-8">
              <Link to="/contact">{t('home.aboutCta', 'Get in Touch')} <ChevronRight className="h-4 w-4" /></Link>
            </Button>
          </div>
        </FadeIn>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Target, title: pickLang('Our Mission', safeString(settings?.mission_ta), language), text: pickLang(safeString(settings?.mission, "To bring city-standard coaching to our town at fees families can afford — without compromising on teaching quality or student outcomes."), safeString(settings?.mission_ta), language) },
            { icon: TrendingUp, title: t('home.valuesTitle', 'Honesty. Discipline. Care.'), text: t('home.valuesText', 'How we run every classroom, every test, and every fee receipt.') },
            { icon: Award, title: t('home.qualityTitle', 'Our Quality'), text: t('home.qualityText', 'Monthly tests with ranked results shared with parents, small batches of around 40, and teachers selected through live demonstration classes.') },
          ].map(({ icon: Icon, title, text }, i) => (
            <FadeIn key={title} delay={i * 0.1}>
              <div className="rounded-lg border border-white/20 bg-white/5 p-6 transition-all hover:bg-white/10 hover:border-white/40">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-md bg-secondary/20">
                  <Icon className="h-5 w-5 text-secondary" />
                </div>
                <h3 className="font-display font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed font-light">{text}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* ── COURSES ───────────────────────────────────────────── */}
      <Section>
        <SectionHeading title={t('home.ourCourses', 'Our Courses')} subtitle={t('home.coursesSubtitle', 'Expertly crafted programs designed to help you excel in your career')} />
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-80 rounded-2xl" />)}
          </div>
        ) : courses.length === 0 ? (
          <EmptyState icon={BookOpen} message={t('courses.noCourses', 'No courses available yet')} />
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course, i) => (
                <FadeIn key={course.id} delay={i * 0.08}>
                  <Link to={`/courses/${course.id}`} className="block h-full">
                    <Card className="group h-full overflow-hidden rounded-2xl border-0 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1.5 cursor-pointer">
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
                        <h3 className="font-display text-base font-semibold leading-snug transition-colors group-hover:text-primary">{pickLang(course.title, course.title_ta, language)}</h3>
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{pickLang(course.description, course.description_ta, language)}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {course.duration && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                              <Clock className="h-3.5 w-3.5" /> {pickLang(course.duration, course.duration_ta, language)}
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </FadeIn>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Button asChild variant="outline" className="gap-2 rounded-full px-8">
                <Link to="/courses">{t('home.viewAllCourses', 'View All Courses')} <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </div>
          </>
        )}
      </Section>

      {/* ── EVENTS ──────────────────────────────────────────────── */}
      <Section>
        <SectionHeading title={t('home.upcomingEvents', 'Latest Events')} subtitle={t('home.eventsSubtitle', 'Stay updated with our upcoming and past events')} />
        {loading ? (
          <div className="grid gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-80 rounded-2xl" />)}
          </div>
        ) : events.length === 0 ? (
          <EmptyState icon={Calendar} message={t('events.noEvents', 'No events to show')} />
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-3">
              {events.map((event, i) => (
                <FadeIn key={event.id} delay={i * 0.1}>
                  <Link to={`/events/${event.id}`} className="block h-full">
                    <Card className="group h-full overflow-hidden rounded-2xl border-0 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1.5 cursor-pointer">
                      <div className="relative aspect-video overflow-hidden bg-accent">
                        {event.cover_image_url
                          ? <img src={event.cover_image_url} alt={event.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                          : <div className="flex h-full items-center justify-center bg-accent" />
                        }
                        {event.event_date && (
                          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1 text-xs text-white backdrop-blur-sm">
                            <Calendar className="h-3 w-3" /> {formatDate(event.event_date)}
                          </div>
                        )}
                      </div>
                      <CardContent className="p-5">
                        <h3 className="font-display text-base font-semibold leading-snug transition-colors group-hover:text-primary">{pickLang(event.title, event.title_ta, language)}</h3>
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{pickLang(event.description, event.description_ta, language)}</p>
                      </CardContent>
                    </Card>
                  </Link>
                </FadeIn>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Button asChild variant="outline" className="gap-2 rounded-full px-8">
                <Link to="/events">{t('home.viewAllEvents', 'View All Events')} <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </div>
          </>
        )}
      </Section>

      {/* ── BLOGS ─────────────────────────────────────────────── */}
      <Section>
        <SectionHeading title={t('home.latestBlog', 'Latest Blogs')} subtitle={t('home.blogSubtitle', 'Insights, stories and updates from our academy')} />
        {loading ? (
          <div className="grid gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-80 rounded-2xl" />)}
          </div>
        ) : blogs.length === 0 ? (
          <EmptyState icon={BookOpen} message={t('blog.noArticles', 'No blog posts yet')} />
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-3">
              {blogs.map((blog, i) => (
                <FadeIn key={blog.id} delay={i * 0.1}>
                  <Link to={`/blog/${blog.id}`}>
                    <Card className="group h-full overflow-hidden rounded-2xl border-0 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1.5 cursor-pointer">
                      <div className="relative aspect-video overflow-hidden bg-muted">
                        {blog.thumbnail_url
                          ? <img src={blog.thumbnail_url} alt={blog.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                          : <div className="flex h-full items-center justify-center bg-accent" />
                        }
                      </div>
                      <CardContent className="p-5">
                        <h3 className="font-display text-base font-semibold leading-snug">{pickLang(blog.title, blog.title_ta, language)}</h3>
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{pickLang(blog.description, blog.description_ta, language)}</p>
                        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-[10px]">
                            {blog.author.charAt(0)}
                          </div>
                          <span>{blog.author}</span>
                          <span className="ml-auto">{formatDate(blog.published_at || blog.created_at)}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </FadeIn>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Button asChild variant="outline" className="gap-2 rounded-full px-8">
                <Link to="/blog">{t('home.viewAllBlogs', 'View All Posts')} <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </div>
          </>
        )}
      </Section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-primary">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.12, 0.08] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-white/5 blur-3xl"
        />
        <div className="container relative mx-auto px-4 py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
          >
            <Badge className="mb-6 border border-white/20 bg-white/10 px-5 py-2 text-sm text-white">
              <TrendingUp className="mr-2 h-4 w-4" /> {t('home.learnMore', 'Start Today')}
            </Badge>
            <h2 className="font-display text-3xl font-bold text-white md:text-5xl">
              {t('home.ctaTitle', 'Ready to Start Your Journey?')}
            </h2>
            <p className="mt-4 text-lg text-white/75 max-w-xl mx-auto">
              {t('home.ctaText', 'Join Muyarchi Academy today and take the first step toward a brighter future.')}
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" variant="secondary" className="rounded-full px-8 shadow-lg">
                <Link to="/courses">{t('home.viewAllCourses', 'View All Courses')}</Link>
              </Button>
              <Button asChild size="lg"
                className="rounded-full border border-white/30 bg-white/10 px-8 text-white backdrop-blur-sm hover:bg-white/20"
                variant="outline">
                <Link to="/contact">{t('home.ctaButton', 'Get in Touch')}</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
