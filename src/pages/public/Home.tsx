import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight, GraduationCap, Eye, Target, BookOpen,
  Calendar, Star, Quote, Users, Award, TrendingUp, ChevronRight,
  Clock, IndianRupee,
} from 'lucide-react'
import { Section, FadeIn } from '@/components/shared/Section'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { useSettings } from '@/hooks/use-settings'
import { fetchActiveCourses, fetchPublishedBlogs, fetchEvents, fetchTestimonials } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import type { Course, Blog, EventItem, Testimonial } from '@/types'

/* ─── tiny helpers ─────────────────────────────────────────── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
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
      <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">{title}</h2>
      <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-primary" />
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

/* ─── main component ───────────────────────────────────────── */
export default function Home() {
  const { settings } = useSettings()
  const [courses, setCourses] = useState<Course[]>([])
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [events, setEvents] = useState<EventItem[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([fetchActiveCourses(), fetchPublishedBlogs(), fetchEvents(), fetchTestimonials()])
      .then(([c, b, e, t]) => {
        setCourses(c.slice(0, 6)); setBlogs(b.slice(0, 3))
        setEvents(e.slice(0, 3)); setTestimonials(t)
      })
      .catch((err) => console.error('Home fetch error:', err))
      .finally(() => setLoading(false))
  }, [])

  /* ── HERO ─────────────────────────────────────────────────── */
  return (
    <>
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[hsl(199,89%,12%)] via-[hsl(222,47%,11%)] to-[hsl(199,89%,8%)]">
        {/* soft ambient glows (kept low + symmetrical to avoid a harsh spotlight/torch look.) */}
        <motion.div
          animate={{ scale: [1, 1.12, 1], opacity: [0.12, 0.2, 0.12] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-primary/25 blur-[160px]"
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.16, 0.1] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute -top-40 -right-40 h-[520px] w-[520px] rounded-full bg-primary/20 blur-[160px]"
        />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.04]" />

        <div className="container relative mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }} className="mx-auto max-w-4xl"
          >
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
              <Badge className="mb-6 border border-primary/40 bg-primary/20 px-5 py-2 text-sm text-primary backdrop-blur-sm">
                <GraduationCap className="mr-2 h-4 w-4" />
                {settings?.academy_name || 'Muyirchi Academy'}
              </Badge>
            </motion.div>

            <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              {settings?.hero_title || 'Welcome to Muyirchi Academy'}
            </h1>

            <p className="mt-6 text-lg text-white/70 md:text-xl max-w-2xl mx-auto">
              {settings?.hero_subtitle || 'Empowering minds, shaping futures'}
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="gap-2 rounded-full px-8 shadow-lg shadow-primary/30">
                <Link to="/courses">Explore Courses <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline"
                className="rounded-full border-white/20 bg-white/10 px-8 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </motion.div>

          {/* stats strip */}
          {(settings?.stat_students || settings?.stat_courses || settings?.stat_years) && (
            <motion.div
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="mx-auto mt-20 grid max-w-3xl grid-cols-3 divide-x divide-slate-200 rounded-2xl border border-white bg-white shadow-2xl shadow-black/30"
            >
              {[
                { icon: Users, value: settings?.stat_students, label: 'Students' },
                { icon: BookOpen, value: settings?.stat_courses, label: 'Courses' },
                { icon: Award, value: settings?.stat_years, label: 'Years' },
              ].filter(s => s.value).map(({ icon: Icon, value, label }) => (
                <div key={label} className="group flex flex-col items-center gap-1 py-8 px-4 transition-colors">
                  <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-display text-3xl font-bold text-slate-900">{value}</span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</span>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ── ABOUT ─────────────────────────────────────────────── */}
      <Section id="about">
        {/* Row 1: label + heading + text + CTA */}
        <FadeIn>
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <SectionLabel><GraduationCap className="h-3.5 w-3.5" /> About Us</SectionLabel>
            <h2 className="font-display text-3xl font-bold md:text-4xl">About Our Academy</h2>
            <div className="mt-3 h-1 w-12 rounded-full bg-primary" />
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
              {settings?.about || ''}
            </p>
            <Button asChild variant="outline" className="mt-6 gap-2 rounded-full">
              <Link to="/contact">Get in Touch <ChevronRight className="h-4 w-4" /></Link>
            </Button>
          </div>
        </FadeIn>

        {/* Row 2: Vision + Mission */}
        {(settings?.vision || settings?.mission) && (
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {[
              { icon: Eye, title: 'Our Vision', text: settings?.vision },
              { icon: Target, title: 'Our Mission', text: settings?.mission },
            ].map(({ icon: Icon, title, text }, i) => (
              <FadeIn key={title} delay={i * 0.1}>
                <div className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/40 hover:shadow-md">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold">{title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{text}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        )}

        {/* Row 3: Growth + Quality */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {[
            { icon: TrendingUp, title: 'Our Growth', text: 'Continuously expanding our curriculum to meet industry demands and student aspirations.' },
            { icon: Award, title: 'Our Quality', text: 'Committed to excellence in education and outstanding student outcomes.' },
          ].map(({ icon: Icon, title, text }, i) => (
            <FadeIn key={title} delay={i * 0.1}>
              <div className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/40 hover:shadow-md">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{text}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* ── COURSES ───────────────────────────────────────────── */}
      <Section className="bg-muted/30">
        <SectionHeading title="Our Courses" subtitle="Expertly crafted programs designed to help you excel in your career" />
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-80 rounded-2xl" />)}
          </div>
        ) : courses.length === 0 ? (
          <EmptyState icon={BookOpen} message="No courses available yet" />
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course, i) => (
                <FadeIn key={course.id} delay={i * 0.08}>
                  <Card className="group h-full overflow-hidden rounded-2xl border-0 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1.5">
                    <div className="relative aspect-video overflow-hidden bg-muted">
                      {course.thumbnail_url
                        ? <img src={course.thumbnail_url} alt={course.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                        : <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5"><GraduationCap className="h-14 w-14 text-primary/30" /></div>
                      }
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <Badge className={`absolute left-3 top-3 text-xs capitalize ${course.status === 'active' ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'}`}>
                        {course.status}
                      </Badge>
                    </div>
                    <CardContent className="p-5">
                      <h3 className="font-display text-base font-semibold leading-snug transition-colors group-hover:text-primary">{course.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {course.duration && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                            <Clock className="h-3.5 w-3.5" /> {course.duration}
                          </span>
                        )}
                        {course.fees && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                            <IndianRupee className="h-3.5 w-3.5" /> {course.fees}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </FadeIn>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Button asChild variant="outline" className="gap-2 rounded-full px-8">
                <Link to="/courses">View All Courses <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </div>
          </>
        )}
      </Section>

      {/* ── TESTIMONIALS ──────────────────────────────────────── */}
      {(loading || testimonials.length > 0) && (
        <Section>
          <SectionHeading title="What Our Students Say" subtitle="Real stories from real students who transformed their careers" />
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-52 rounded-2xl" />)}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t, i) => (
                <FadeIn key={t.id} delay={i * 0.1}>
                  <div className="group relative h-full rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg">
                    <Quote className="mb-4 h-8 w-8 text-primary/20" />
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">{t.content}</p>
                    <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                      {t.avatar_url
                        ? <img src={t.avatar_url} alt={t.author_name} className="h-10 w-10 rounded-full object-cover ring-2 ring-primary/20" loading="lazy" />
                        : <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold ring-2 ring-primary/20">{t.author_name.charAt(0)}</div>
                      }
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{t.author_name}</p>
                        <p className="text-xs text-muted-foreground truncate">{t.author_role}</p>
                      </div>
                      <div className="flex shrink-0">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <Star key={j} className={`h-3.5 w-3.5 ${j < t.rating ? 'fill-warning text-warning' : 'text-muted-foreground/20'}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          )}
        </Section>
      )}

      {/* ── EVENTS ────────────────────────────────────────────── */}
      <Section className="bg-muted/30">
        <SectionHeading title="Latest Events" subtitle="Stay updated with our upcoming and past events" />
        {loading ? (
          <div className="grid gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-80 rounded-2xl" />)}
          </div>
        ) : events.length === 0 ? (
          <EmptyState icon={Calendar} message="No events to show" />
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-3">
              {events.map((event, i) => (
                <FadeIn key={event.id} delay={i * 0.1}>
                  <Card className="group h-full overflow-hidden rounded-2xl border-0 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1.5">
                    <div className="relative aspect-video overflow-hidden bg-muted">
                      {event.cover_image_url
                        ? <img src={event.cover_image_url} alt={event.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                        : <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5"><Calendar className="h-14 w-14 text-primary/30" /></div>
                      }
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      {event.event_date && (
                        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1 text-xs text-white backdrop-blur-sm">
                          <Calendar className="h-3 w-3" /> {formatDate(event.event_date)}
                        </div>
                      )}
                    </div>
                    <CardContent className="p-5">
                      <h3 className="font-display text-base font-semibold leading-snug transition-colors group-hover:text-primary">{event.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                    </CardContent>
                  </Card>
                </FadeIn>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Button asChild variant="outline" className="gap-2 rounded-full px-8">
                <Link to="/events">View All Events <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </div>
          </>
        )}
      </Section>

      {/* ── BLOGS ─────────────────────────────────────────────── */}
      <Section>
        <SectionHeading title="Latest Blogs" subtitle="Insights, stories and updates from our academy" />
        {loading ? (
          <div className="grid gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-80 rounded-2xl" />)}
          </div>
        ) : blogs.length === 0 ? (
          <EmptyState icon={BookOpen} message="No blog posts yet" />
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-3">
              {blogs.map((blog, i) => (
                <FadeIn key={blog.id} delay={i * 0.1}>
                  <Card className="group h-full overflow-hidden rounded-2xl border-0 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1.5">
                    <div className="relative aspect-video overflow-hidden bg-muted">
                      {blog.thumbnail_url
                        ? <img src={blog.thumbnail_url} alt={blog.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                        : <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5"><BookOpen className="h-14 w-14 text-primary/30" /></div>
                      }
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    </div>
                    <CardContent className="p-5">
                      <h3 className="font-display text-base font-semibold leading-snug">{blog.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{blog.description}</p>
                      <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-[10px]">
                          {blog.author.charAt(0)}
                        </div>
                        <span>{blog.author}</span>
                        <span className="ml-auto">{formatDate(blog.published_at || blog.created_at)}</span>
                      </div>
                    </CardContent>
                  </Card>
                </FadeIn>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Button asChild variant="outline" className="gap-2 rounded-full px-8">
                <Link to="/blog">View All Posts <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </div>
          </>
        )}
      </Section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-[hsl(199,89%,38%)] to-[hsl(199,89%,28%)]" />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-white/10 blur-3xl"
        />
        <div className="container relative mx-auto px-4 py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
          >
            <Badge className="mb-6 border border-white/20 bg-white/10 px-5 py-2 text-sm text-white">
              <TrendingUp className="mr-2 h-4 w-4" /> Start Today
            </Badge>
            <h2 className="font-display text-3xl font-bold text-white md:text-5xl">
              Ready to Start Your Journey?
            </h2>
            <p className="mt-4 text-lg text-white/75 max-w-xl mx-auto">
              Join Muyirchi Academy today and take the first step toward a brighter future.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" variant="secondary" className="rounded-full px-8 shadow-lg">
                <Link to="/courses">View All Courses</Link>
              </Button>
              <Button asChild size="lg"
                className="rounded-full border border-white/30 bg-white/10 px-8 text-white backdrop-blur-sm hover:bg-white/20"
                variant="outline">
                <Link to="/contact">Get in Touch</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
