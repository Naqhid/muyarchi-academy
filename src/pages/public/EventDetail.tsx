import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Clock, MapPin } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Section, SectionHeader } from '@/components/shared/Section'
import { fetchEventById } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import type { EventItem } from '@/types'

export default function EventDetail() {
  const { id } = useParams<{ id: string }>()
  const [event, setEvent] = useState<EventItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    fetchEventById(id)
      .then((data) => setEvent(data))
      .catch((err) => {
        console.error('Error fetching event:', err)
        setError('Failed to load event')
      })
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
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl text-center">
          <Calendar className="mx-auto mb-4 h-16 w-16 text-muted-foreground opacity-40" />
          <h2 className="mb-2 text-2xl font-semibold">Event Not Found</h2>
          <p className="mb-6 text-muted-foreground">{error || 'The event you are looking for does not exist.'}</p>
          <Button asChild variant="outline">
            <Link to="/events">Back to Events</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative flex min-h-[40vh] items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-primary">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#3b82f630,transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,#06b6d430,transparent_40%)]" />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.05]" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="container relative mx-auto px-4 text-center"
        >
          <div className="mb-6">
            <Button asChild variant="ghost" size="lg" className="text-white hover:text-white hover:bg-white/10">
              <Link to="/events">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to Events
              </Link>
            </Button>
          </div>
          {event.event_date && (
            <Badge className="mb-6 bg-white/10 text-white backdrop-blur">
              <Calendar className="mr-2 h-4 w-4" />
              {formatDate(event.event_date)}
            </Badge>
          )}
          <h1 className="mx-auto max-w-4xl font-display text-4xl font-extrabold leading-tight tracking-tight text-white md:text-5xl">
            {event.title}
          </h1>
        </motion.div>
      </section>

      {/* Event Details Section */}
      <Section>
        <SectionHeader
          title="Event Overview"
          subtitle="Complete details about this event"
          centered={false}
        />
        
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Event Image */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-1">
            <Card className="overflow-hidden rounded-2xl border-0 shadow-lg">
              <div className="aspect-video overflow-hidden bg-accent">
                {event.cover_image_url ? (
                  <img
                    src={event.cover_image_url}
                    alt={event.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-accent">
                    <Calendar className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Event Info */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2">
            <Card className="rounded-2xl border-0 shadow-sm">
              <CardContent className="p-8">
                <p className="text-lg leading-relaxed text-muted-foreground mb-8">
                  {event.description}
                </p>

                <div className="grid gap-6 sm:grid-cols-2">
                  {event.event_date && (
                    <div className="rounded-xl bg-primary/5 p-4">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-6 w-6 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Event Date</p>
                          <p className="font-semibold">{formatDate(event.event_date)}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {event.venues && (
                    <div className="rounded-xl bg-green-50 p-4">
                      <div className="flex items-center gap-3">
                        <MapPin className="h-6 w-6 text-green-600" />
                        <div>
                          <p className="text-sm text-muted-foreground">Venue</p>
                          <p className="font-semibold">{event.venues}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </Section>

      {/* Image Gallery */}
      {event.image_gallery_urls && event.image_gallery_urls.length > 0 && (
        <Section className="bg-muted/50">
          <SectionHeader
            title="Image Gallery"
            subtitle="A visual journey through the event"
            centered={false}
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {event.image_gallery_urls.map((url, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card className="overflow-hidden rounded-2xl border-0 shadow-sm">
                  <div className="aspect-video overflow-hidden bg-accent">
                    <img
                      src={url}
                      alt={`Event gallery ${i + 1}`}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </Section>
      )}

      {/* Video Gallery */}
      {event.video_gallery_urls && event.video_gallery_urls.length > 0 && (
        <Section>
          <SectionHeader
            title="Video Gallery"
            subtitle="Watch highlights from the event"
            centered={false}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {event.video_gallery_urls.map((url, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card className="overflow-hidden rounded-2xl border-0 shadow-sm">
                  <div className="aspect-video overflow-hidden bg-accent">
                    <iframe
                      src={url}
                      className="h-full w-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </Section>
      )}

      {/* CTA Section */}
      <Section>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-primary md:text-4xl">
            Interested in this Event?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Get in touch with us for more information about this event.
          </p>
          <div className="mt-8">
            <Button asChild size="lg" className="bg-gradient-to-r from-primary to-blue-600">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </motion.div>
      </Section>
    </>
  )
}
