import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Phone, Mail, MapPin, MessageSquare, Send, ExternalLink } from 'lucide-react'
import { Section, SectionHeader, FadeIn } from '@/components/shared/Section'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useSettings } from '@/hooks/use-settings'
import { useToast } from '@/hooks/use-toast'
import { useLanguage, pickLang } from '@/hooks/use-language'
import { createEnquiry } from '@/lib/api'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  classCourse: z.string().min(1, 'Please select a class or course'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})
type FormData = z.infer<typeof schema>

const safeString = (val: unknown): string => {
  if (typeof val === 'string') return val
  if (val && typeof val === 'object') return JSON.stringify(val)
  return ''
}

const getMapEmbedUrl = (mapUrl: string, address: string) => {
  // Google short/share links cannot be embedded. An address can always be used
  // to create a supported Google Maps embed URL instead.
  if (mapUrl.includes('maps.app.goo.gl') || mapUrl.includes('goo.gl/maps')) {
    return address ? `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed` : null
  }
  if (mapUrl.includes('/embed') || mapUrl.includes('output=embed')) return mapUrl
  if (address) return `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`
  return null
}

export default function Contact() {
  const { settings } = useSettings()
  const { toast } = useToast()
  const { t, language } = useLanguage()
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    try {
      await createEnquiry({ name: data.name, phone: data.phone, class_course: data.classCourse, message: data.message })
      toast({ title: t('contact.successMsg', 'Enquiry Submitted'), description: t('contact.successMsg', "We'll get back to you within one working day."), variant: "success" })
      reset()
    } catch (err) {
      console.error('Enquiry error:', err)
      toast({ title: "Submission Failed", description: "Please try again later.", variant: "destructive" })
    }
  }

  const hasContactInfo = safeString(settings?.phone) || safeString(settings?.email) || safeString(settings?.address)
  const mapUrl = safeString(settings?.google_map_url)
  const mapEmbedUrl = getMapEmbedUrl(mapUrl, safeString(settings?.address))

  return (
    <>
      <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-primary to-slate-800 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#ffffff20,transparent_45%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,#3b82f620,transparent_40%)]" />
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }} className="container relative mx-auto px-4 text-center"
        >
          <Badge className="mb-5 rounded-full bg-white/10 px-5 py-2 text-white backdrop-blur">
            <MessageSquare className="mr-2 h-4 w-4" /> {t('contact.title', 'Contact Us')}
          </Badge>
          <h1 className="mx-auto max-w-5xl font-display text-5xl font-extrabold leading-tight tracking-tight text-white md:text-7xl">
            Get in <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">Touch</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-xl leading-relaxed text-white/80">
            {t('contact.subtitle', 'We would love to hear from you. Reach out with any questions.')}
          </p>
        </motion.div>
      </section>

      <Section>
        <div className="grid gap-8 lg:grid-cols-1 max-w-4xl mx-auto">
          <FadeIn>
            <div className="space-y-6">
              <SectionHeader title={t('contact.title', "Let's Connect")} subtitle={t('contact.subtitle', "We're here to help you take the next step in your learning journey.")} centered={false} />

              {!hasContactInfo && (
                <Card className="rounded-2xl border-dashed">
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                    <MessageSquare className="mb-3 h-10 w-10 opacity-40" />
                    <p>{t('contact.noContactInfo', 'Contact information will be available soon.')}</p>
                  </CardContent>
                </Card>
              )}

              {settings?.phone && (
                <Card className="group rounded-2xl border-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <CardContent className="flex items-center gap-5 p-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg">
                      <Phone className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">{t('contact.phoneLabel', 'Call Us')}</p>
                      <a href={`tel:${safeString(settings.phone)}`} className="text-lg font-semibold transition-colors hover:text-primary">{safeString(settings.phone)}</a>
                    </div>
                  </CardContent>
                </Card>
              )}

              {settings?.email && (
                <Card className="group rounded-2xl border-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <CardContent className="flex items-center gap-5 p-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">{t('contact.emailLabel', 'Email')}</p>
                      <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(safeString(settings.email))}`} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold transition-colors hover:text-primary break-all">{safeString(settings.email)}</a>
                    </div>
                  </CardContent>
                </Card>
              )}

              {settings?.address && (
                <Card className="group rounded-2xl border-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <CardContent className="flex items-start gap-5 p-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">{t('contact.addressLabel', 'Visit Us')}</p>
                      <p className="mt-1 leading-7 text-muted-foreground">{pickLang(safeString(settings.address), safeString(settings.address), language)}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {settings?.phone && (
                <Card className="group rounded-2xl border-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <CardContent className="flex items-center gap-5 p-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg">
                      <MessageSquare className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">WhatsApp</p>
                      <a href={`https://wa.me/${safeString(settings.phone).replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold transition-colors hover:text-primary">{t('contact.phoneLabel', 'Chat with Us')}</a>
                    </div>
                  </CardContent>
                </Card>
              )}

              {mapUrl && (
                <Card className="overflow-hidden rounded-2xl border-0 shadow-lg">
                  <div className="border-b bg-gradient-to-r from-primary to-blue-600 px-6 py-4 text-white">
                    <h3 className="text-lg font-semibold">{t('contact.mapLabel', 'Find Us on Google Maps')}</h3>
                  </div>
                  {mapEmbedUrl ? (
                    <iframe src={mapEmbedUrl} width="100%" height="340" style={{ border: 0 }} loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade" title="Google Map" />
                  ) : (
                    <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
                      <MapPin className="h-10 w-10 text-primary" />
                      <p className="text-muted-foreground">Open our location in Google Maps.</p>
                      <Button asChild><a href={mapUrl} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4" />Open Google Maps</a></Button>
                    </CardContent>
                  )}
                </Card>
              )}
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div>
              <SectionHeader title={t('contact.formTitle', 'Send Us an Enquiry')} subtitle={t('contact.subtitle', "Fill in your details below. We'll get back to you within one working day.")} centered={false} />
              <Card className="rounded-2xl border-0 shadow-lg">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t('contact.name', 'Your Name')} *</Label>
                      <Input id="name" placeholder={t('contact.name', 'Enter your name')} {...register("name")} aria-invalid={!!errors.name} className="h-12 rounded-xl" />
                      {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t('contact.phone', 'Phone Number')} *</Label>
                      <Input id="phone" placeholder="10-digit mobile number" {...register("phone")} aria-invalid={!!errors.phone} className="h-12 rounded-xl" />
                      {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="classCourse">{t('contact.classCourse', 'Class / Course of Interest')} *</Label>
                      <select id="classCourse" {...register("classCourse")} aria-invalid={!!errors.classCourse} className="flex h-12 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                        <option value="">Select class or course</option>
                        <option value="Class 8">Class 8</option><option value="Class 9">Class 9</option><option value="Class 10">Class 10</option><option value="Class 11">Class 11</option><option value="Class 12">Class 12</option>
                        <option value="NEET">NEET</option><option value="Engineering">Engineering</option><option value="Foundation">Foundation</option><option value="Spoken English">Spoken English</option><option value="CMA">CMA</option><option value="Government Exams">Government Exams</option>
                      </select>
                      {errors.classCourse && <p className="text-xs text-destructive">{errors.classCourse.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">{t('contact.message', 'Message')} *</Label>
                      <Textarea id="message" rows={6} placeholder={t('contact.message', 'Tell us how we can help you...')} {...register("message")} aria-invalid={!!errors.message} className="rounded-xl" />
                      {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
                    </div>
                    <Button type="submit" disabled={isSubmitting} className="h-12 w-full rounded-xl bg-gradient-to-r from-primary to-blue-600 text-base font-semibold shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl">
                      <Send className="mr-2 h-5 w-5" /> {t('contact.submit', 'Send Enquiry')}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </FadeIn>
        </div>
      </Section>
    </>
  )
}
