import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Phone, Mail, MapPin, MessageSquare, Send } from 'lucide-react'
import { Section, SectionHeader, FadeIn } from '@/components/shared/Section'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useSettings } from '@/hooks/use-settings'
import { useToast } from '@/hooks/use-toast'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  email: z.string().email('Please enter a valid email'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type FormData = z.infer<typeof schema>

export default function Contact() {
  const { settings } = useSettings()
  const { toast } = useToast()
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = (data: FormData) => {
    const subject = encodeURIComponent(`Enquiry from ${data.name}`)
    const body = encodeURIComponent(`Name: ${data.name}\nPhone: ${data.phone}\nEmail: ${data.email}\n\nMessage:\n${data.message}`)
    window.location.href = `mailto:${settings?.email || ''}?subject=${subject}&body=${body}`
    toast({ title: 'Opening mail client...', description: 'Your email client should open shortly.', variant: 'success' })
    reset()
  }

  return (
    <>
      <section className="relative flex min-h-[40vh] items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="container relative mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-4"><MessageSquare className="mr-1.5 h-4 w-4" />Contact</Badge>
          <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">Get in Touch</h1>
          <p className="mt-4 text-lg text-muted-foreground">We'd love to hear from you</p>
        </motion.div>
      </section>
      <Section>
        <div className="grid gap-8 lg:grid-cols-2">
          <FadeIn>
            <div className="space-y-6">
              <SectionHeader title="Contact Information" centered={false} />
              {settings?.phone && (
                <Card><CardContent className="flex items-center gap-4 p-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10"><Phone className="h-6 w-6 text-primary" /></div>
                  <div><p className="text-sm font-semibold">Phone</p><a href={`tel:${settings.phone}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">{settings.phone}</a></div>
                </CardContent></Card>
              )}
              {settings?.email && (
                <Card><CardContent className="flex items-center gap-4 p-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10"><Mail className="h-6 w-6 text-primary" /></div>
                  <div><p className="text-sm font-semibold">Email</p><a href={`mailto:${settings.email}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">{settings.email}</a></div>
                </CardContent></Card>
              )}
              {settings?.address && (
                <Card><CardContent className="flex items-start gap-4 p-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10"><MapPin className="h-6 w-6 text-primary" /></div>
                  <div><p className="text-sm font-semibold">Address</p><p className="text-sm text-muted-foreground">{settings.address}</p></div>
                </CardContent></Card>
              )}
              {settings?.google_map_url && (
                <div className="overflow-hidden rounded-lg border border-border">
                  <iframe src={settings.google_map_url} width="100%" height="300" style={{ border: 0 }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Google Map" allowFullScreen />
                </div>
              )}
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div>
              <SectionHeader title="Send Us a Message" centered={false} />
              <Card><CardContent className="p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" {...register('name')} aria-invalid={!!errors.name} />
                    {errors.name && <p className="text-xs text-destructive" role="alert">{errors.name.message}</p>}
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" {...register('phone')} aria-invalid={!!errors.phone} />
                      {errors.phone && <p className="text-xs text-destructive" role="alert">{errors.phone.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" {...register('email')} aria-invalid={!!errors.email} />
                      {errors.email && <p className="text-xs text-destructive" role="alert">{errors.email.message}</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" rows={5} {...register('message')} aria-invalid={!!errors.message} />
                    {errors.message && <p className="text-xs text-destructive" role="alert">{errors.message.message}</p>}
                  </div>
                  <Button type="submit" disabled={isSubmitting} className="w-full"><Send className="h-4 w-4" />Send Message</Button>
                </form>
              </CardContent></Card>
            </div>
          </FadeIn>
        </div>
      </Section>
    </>
  )
}
