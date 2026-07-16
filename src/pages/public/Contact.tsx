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
  const subject = encodeURIComponent(
    `Course Enquiry - ${data.name}`
  )

  const body = encodeURIComponent(
`Dear Muyarchi Academy Team,

I hope you are doing well.

I would like to enquire about Muyarchi Academy and would appreciate it if you could provide me with the relevant information. My details are given below for your reference.

My name is ${data.name}. You can reach me at ${data.phone} or email me at ${data.email}.

${data.message}

I look forward to hearing from you.

Kind regards,

${data.name}`
  )

  window.open(
    `https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=${encodeURIComponent(
      settings?.email || ""
    )}&su=${subject}&body=${body}`,
    "_blank"
  )

  toast({
    title: "Opening Gmail...",
    description: "A new Gmail compose window has been opened.",
    variant: "success",
  })

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

    <SectionHeader
      title="Let's Connect"
      subtitle="We're here to help you take the next step in your learning journey."
      centered={false}
    />

    {settings?.phone && (
      <Card className="group rounded-2xl border-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <CardContent className="flex items-center gap-5 p-6">

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg">
            <Phone className="h-6 w-6" />
          </div>

          <div className="flex-1">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Call Us
            </p>

            <a
              href={`tel:${settings.phone}`}
              className="text-lg font-semibold transition-colors hover:text-primary"
            >
              {settings.phone}
            </a>
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
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Email
            </p>

            <a
              href={`mailto:${settings.email}`}
              className="text-lg font-semibold transition-colors hover:text-primary break-all"
            >
              {settings.email}
            </a>
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
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Visit Us
            </p>

            <p className="mt-1 leading-7 text-muted-foreground">
              {settings.address}
            </p>
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
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              WhatsApp
            </p>

            <a
              href={`https://wa.me/${settings.phone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-semibold transition-colors hover:text-primary"
            >
              Chat with Us
            </a>
          </div>

        </CardContent>
      </Card>
    )}

    {settings?.google_map_url && (
      <Card className="overflow-hidden rounded-2xl border-0 shadow-lg">

        <div className="border-b bg-gradient-to-r from-primary to-blue-600 px-6 py-4 text-white">

          <h3 className="text-lg font-semibold">
            Find Us on Google Maps
          </h3>

        </div>

        <iframe
          src={settings.google_map_url}
          width="100%"
          height="340"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          title="Google Map"
        />

      </Card>
    )}

  </div>
</FadeIn>
         <FadeIn delay={0.2}>
  <div>

    <SectionHeader
      title="Send Us an Enquiry"
      subtitle="Fill in your details below. Your default email application will open with your enquiry pre-filled."
      centered={false}
    />

    <Card className="rounded-2xl border-0 shadow-lg">

      <CardContent className="p-8">

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          <div className="space-y-2">

            <Label htmlFor="name">
              Full Name
            </Label>

            <Input
              id="name"
              placeholder="Enter your full name"
              {...register("name")}
              aria-invalid={!!errors.name}
              className="h-12 rounded-xl"
            />

            {errors.name && (
              <p className="text-xs text-destructive">
                {errors.name.message}
              </p>
            )}

          </div>

          <div className="grid gap-5 md:grid-cols-2">

            <div className="space-y-2">

              <Label htmlFor="phone">
                Phone Number
              </Label>

              <Input
                id="phone"
                placeholder="+91 9876543210"
                {...register("phone")}
                aria-invalid={!!errors.phone}
                className="h-12 rounded-xl"
              />

              {errors.phone && (
                <p className="text-xs text-destructive">
                  {errors.phone.message}
                </p>
              )}

            </div>

            <div className="space-y-2">

              <Label htmlFor="email">
                Email Address
              </Label>

              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                aria-invalid={!!errors.email}
                className="h-12 rounded-xl"
              />

              {errors.email && (
                <p className="text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}

            </div>

          </div>

          <div className="space-y-2">

            <Label htmlFor="message">
              Your Message
            </Label>

            <Textarea
              id="message"
              rows={6}
              placeholder="Tell us how we can help you..."
              {...register("message")}
              aria-invalid={!!errors.message}
              className="rounded-xl"
            />

            {errors.message && (
              <p className="text-xs text-destructive">
                {errors.message.message}
              </p>
            )}

          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-12 w-full rounded-xl bg-gradient-to-r from-primary to-blue-600 text-base font-semibold shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl"
          >
            <Send className="mr-2 h-5 w-5" />
            Compose Email
          </Button>

          <div className="rounded-xl bg-primary/5 p-4 text-center">

            <p className="text-sm text-muted-foreground">
              Clicking <strong>Compose Email</strong> will open your default
              email application with your enquiry already filled in.
            </p>

          </div>

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
