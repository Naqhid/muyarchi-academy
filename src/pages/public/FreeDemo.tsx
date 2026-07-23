import { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Clock } from 'lucide-react'
import { Section, FadeIn } from '@/components/shared/Section'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { useLanguage } from '@/hooks/use-language'
import { createDemoRegistration } from '@/lib/api'

export default function FreeDemo() {
  const { toast } = useToast()
  const { t } = useLanguage()
  const [formData, setFormData] = useState({ studentName: '', class: '', phone: '', preferredTime: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await createDemoRegistration({ student_name: formData.studentName, class: formData.class, phone: formData.phone, preferred_time: formData.preferredTime, message: formData.message })
      toast({ title: t('freeDemo.successMsg', 'Demo Class Booked'), description: t('freeDemo.successMsg', "We'll contact you to schedule your free demo class soon.") })
      setFormData({ studentName: '', class: '', phone: '', preferredTime: '', message: '' })
    } catch (err) {
      console.error('Demo registration error:', err)
      toast({ title: "Registration Failed", description: "Please try again later.", variant: "destructive" })
    } finally { setLoading(false) }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))

  return (
    <>
      <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-primary">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#3b82f630,transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,#06b6d430,transparent_40%)]" />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.05]" />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="container relative mx-auto px-4 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-white backdrop-blur">
            <BookOpen className="h-4 w-4" /> {t('freeDemo.title', 'Free Demo Class')}
          </div>
          <h1 className="mx-auto max-w-4xl font-display text-4xl font-extrabold leading-tight tracking-tight text-white md:text-6xl">{t('freeDemo.title', 'Book a Free Demo Class')}</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">{t('freeDemo.subtitle', 'Experience our teaching methodology firsthand. No commitment, just quality education.')}</p>
        </motion.div>
      </section>

      <Section>
        <FadeIn>
          <div className="mx-auto max-w-2xl">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-primary md:text-4xl mb-8 text-center">{t('freeDemo.title', 'Register for Free Demo')}</h2>
            <Card className="border-0 shadow-sm"><CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2"><Label htmlFor="studentName">{t('freeDemo.studentName', 'Student Name')} *</Label><Input id="studentName" name="studentName" value={formData.studentName} onChange={handleChange} required placeholder="Enter student's full name" /></div>
                <div className="space-y-2"><Label htmlFor="class">{t('freeDemo.class', 'Class')} *</Label>
                  <select id="class" name="class" value={formData.class} onChange={handleChange} required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    <option value="">Select class</option><option value="8">Class 8</option><option value="9">Class 9</option><option value="10">Class 10</option><option value="11">Class 11</option><option value="12">Class 12</option>
                  </select>
                </div>
                <div className="space-y-2"><Label htmlFor="phone">{t('freeDemo.phone', 'Phone (WhatsApp)')} *</Label><Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required placeholder="10-digit mobile number" pattern="[0-9]{10}" /></div>
                <div className="space-y-2"><Label htmlFor="preferredTime">{t('freeDemo.preferredTime', 'Preferred Time')} *</Label><Input id="preferredTime" name="preferredTime" value={formData.preferredTime} onChange={handleChange} required placeholder="e.g., Morning 10 AM, Afternoon 3 PM, Evening 6 PM" /></div>
                <div className="space-y-2"><Label htmlFor="message">{t('freeDemo.message', 'Additional Message')}</Label><Textarea id="message" name="message" rows={4} value={formData.message} onChange={handleChange} placeholder="Any specific subjects or topics you'd like to cover in the demo?" /></div>
                <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Submitting...' : t('freeDemo.submit', 'Book Free Demo Class')}</Button>
              </form>
            </CardContent></Card>
          </div>
        </FadeIn>
      </Section>
    </>
  )
}
