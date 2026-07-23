import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, ImageIcon, Video, PlayCircle } from 'lucide-react'
import { Section, SectionHeader, FadeIn } from '@/components/shared/Section'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { fetchEvents } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import { useLanguage, pickLang } from '@/hooks/use-language'
import type { EventItem } from '@/types'

export default function Events() {
  const { t, language } = useLanguage()
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvents().then((data) => setEvents(data)).catch((err) => console.error(err)).finally(() => setLoading(false))
  }, [])

  return (
    <>
      <section className="relative flex min-h-[55vh] items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-primary">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#3b82f630,transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,#06b6d430,transparent_40%)]" />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.05]" />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="container relative mx-auto px-4 text-center">
          <Badge className="mb-6 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-white backdrop-blur">
            <Calendar className="mr-2 h-4 w-4" /> {t('nav.events', 'Academy Events')}
          </Badge>
          <h1 className="mx-auto max-w-4xl font-display text-5xl font-extrabold leading-tight tracking-tight text-white md:text-7xl">
            <span className="text-white">{t('events.heroPrefix', 'Events & ')} </span>
            <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">{t('events.heroHighlight', 'Gallery')}</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
            {t('events.heroSubtitle', 'Discover memorable moments from our seminars, workshops, competitions, celebrations, and student activities.')}
          </p>
        </motion.div>
      </section>

      <Section>
        <SectionHeader title={t('events.listTitle', 'Our Events')} subtitle={t('events.listSubtitle', 'Stay updated with our academy events')} />
        {loading ? (
          <div className="space-y-8">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-80 rounded-lg" />)}</div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground"><Calendar className="mb-3 h-12 w-12 opacity-40" /><p>{t('events.noEvents', 'No events to show')}</p></div>
        ) : (
          <div className="space-y-8">
            {events.map((event, i) => (
              <FadeIn key={event.id} delay={i * 0.05}>
                <Link to={`/events/${event.id}`} className="block">
                  <Card className="group overflow-hidden rounded-3xl border-0 bg-background shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl cursor-pointer">
                    <div className="relative aspect-[21/9] overflow-hidden">
                      {event.cover_image_url ? (
                        <img src={event.cover_image_url} alt={event.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" loading="lazy" />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200"><Calendar className="h-16 w-16 text-muted-foreground/40" /></div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      {event.event_date && (
                        <Badge className="absolute left-5 top-5 rounded-full bg-white text-primary shadow-lg">
                          <Calendar className="mr-2 h-4 w-4" />{formatDate(event.event_date)}
                        </Badge>
                      )}
                      <div className="absolute bottom-5 right-5 flex gap-2">
                        {event.image_gallery_urls && event.image_gallery_urls.length > 0 && (
                          <Badge className="bg-black/60 text-white backdrop-blur"><ImageIcon className="mr-1 h-4 w-4" />{event.image_gallery_urls.length}</Badge>
                        )}
                        {event.video_gallery_urls && event.video_gallery_urls.length > 0 && (
                          <Badge className="bg-black/60 text-white backdrop-blur"><Video className="mr-1 h-4 w-4" />{event.video_gallery_urls.length}</Badge>
                        )}
                      </div>
                    </div>
                    <CardContent className="space-y-5 p-8">
                      <h3 className="font-display text-3xl font-bold">{pickLang(event.title, event.title_ta, language)}</h3>
                      <p className="text-base leading-7 text-muted-foreground">{pickLang(event.description, event.description_ta, language)}</p>
                      {event.image_gallery_urls && event.image_gallery_urls.length > 0 && (
                        <div>
                          <h4 className="mb-4 flex items-center gap-2 text-lg font-semibold"><ImageIcon className="h-5 w-5 text-primary" />{t('events.photoGallery', 'Photo Gallery')}</h4>
                          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
                            {event.image_gallery_urls.map((url, j) => (
                              <Dialog key={j}>
                                <DialogTrigger asChild>
                                  <button className="group relative aspect-square overflow-hidden rounded-2xl shadow-md transition hover:shadow-xl">
                                    <img src={url} alt={`Gallery ${j + 1}`} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" loading="lazy" />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/40 group-hover:opacity-100"><ImageIcon className="h-8 w-8 text-white" /></div>
                                  </button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl"><img src={url} alt={`Gallery ${j + 1}`} className="w-full rounded-xl" /></DialogContent>
                              </Dialog>
                            ))}
                          </div>
                        </div>
                      )}
                      {event.video_gallery_urls && event.video_gallery_urls.length > 0 && (
                        <div>
                          <h4 className="mb-4 flex items-center gap-2 text-lg font-semibold"><Video className="h-5 w-5 text-primary" />{t('events.videoGallery', 'Video Gallery')}</h4>
                          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {event.video_gallery_urls.map((url, j) => (
                              <a key={j} href={url} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 rounded-2xl border bg-accent/40 p-4 transition-all hover:bg-primary hover:text-white hover:shadow-lg">
                                <PlayCircle className="h-8 w-8 text-primary transition group-hover:text-white" />
                                <div><p className="font-semibold">{t('events.videoLabel', 'Video')} {j + 1}</p><p className="text-xs opacity-70">{t('events.clickToWatch', 'Click to watch')}</p></div>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
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
