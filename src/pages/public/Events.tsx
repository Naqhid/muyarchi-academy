import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, ImageIcon, Video, PlayCircle } from 'lucide-react'
import { Section, SectionHeader, FadeIn } from '@/components/shared/Section'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { fetchEvents } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import type { EventItem } from '@/types'

export default function Events() {
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvents().then((data) => setEvents(data)).catch((err) => console.error(err)).finally(() => setLoading(false))
  }, [])

  return (
    <>
      <section className="relative flex min-h-[40vh] items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="container relative mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-4"><Calendar className="mr-1.5 h-4 w-4" />Events</Badge>
          <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">Events & Gallery</h1>
          <p className="mt-4 text-lg text-muted-foreground">Explore our past events and photo galleries</p>
        </motion.div>
      </section>
      <Section>
        <SectionHeader title="Our Events" subtitle="Stay updated with our academy events" />
        {loading ? (
          <div className="space-y-8">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-80 rounded-lg" />)}</div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground"><Calendar className="mb-3 h-12 w-12 opacity-40" /><p>No events to show</p></div>
        ) : (
          <div className="space-y-8">
            {events.map((event, i) => (
              <FadeIn key={event.id} delay={i * 0.05}>
                <Card className="overflow-hidden">
                  <div className="aspect-[21/9] overflow-hidden bg-muted">
                    {event.cover_image_url ? <img src={event.cover_image_url} alt={event.title} className="h-full w-full object-cover" loading="lazy" /> : <div className="flex h-full items-center justify-center"><Calendar className="h-12 w-12 text-muted-foreground/40" /></div>}
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-display text-xl font-semibold">{event.title}</h3>
                    {event.event_date && <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground"><Calendar className="h-4 w-4 text-primary" />{formatDate(event.event_date)}</div>}
                    <p className="mt-3 text-sm text-muted-foreground">{event.description}</p>
                    {event.image_gallery_urls.length > 0 && (
                      <div className="mt-6">
                        <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold"><ImageIcon className="h-4 w-4 text-primary" />Image Gallery</h4>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                          {event.image_gallery_urls.map((url, j) => (
                            <Dialog key={j}>
                              <DialogTrigger asChild>
                                <button className="group relative aspect-square overflow-hidden rounded-lg bg-muted">
                                  <img src={url} alt={`Gallery ${j + 1}`} className="h-full w-full object-cover transition-transform group-hover:scale-105" loading="lazy" />
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/30 group-hover:opacity-100"><ImageIcon className="h-6 w-6 text-white" /></div>
                                </button>
                              </DialogTrigger>
                              <DialogContent className="max-w-3xl"><img src={url} alt={`Gallery ${j + 1}`} className="w-full rounded-lg" /></DialogContent>
                            </Dialog>
                          ))}
                        </div>
                      </div>
                    )}
                    {event.video_gallery_urls.length > 0 && (
                      <div className="mt-6">
                        <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold"><Video className="h-4 w-4 text-primary" />Video Gallery</h4>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                          {event.video_gallery_urls.map((url, j) => (
                            <a key={j} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-lg border border-border p-3 text-sm hover:bg-accent transition-colors">
                              <PlayCircle className="h-5 w-5 text-primary" /><span className="truncate">Video {j + 1}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
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
