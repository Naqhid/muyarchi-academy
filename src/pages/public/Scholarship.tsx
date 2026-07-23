import { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, GraduationCap, CheckCircle } from 'lucide-react'
import { Section, FadeIn } from '@/components/shared/Section'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { useScholarship } from '@/hooks/use-scholarship'
import { useLanguage, pickLang } from '@/hooks/use-language'
import { createScholarshipRegistration } from '@/lib/api'

const safeString = (val: unknown, fallback = ''): string => {
  if (typeof val === 'string') return val || fallback
  if (val && typeof val === 'object') return JSON.stringify(val)
  return fallback
}

export default function Scholarship() {
  const { toast } = useToast()
  const { scholarship } = useScholarship()
  const { t, language } = useLanguage()
  const [formData, setFormData] = useState({ studentName: '', class: '', school: '', parentName: '', parentPhone: '', townVillage: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await createScholarshipRegistration({ student_name: formData.studentName, class: formData.class, school: formData.school, parent_name: formData.parentName, parent_phone: formData.parentPhone, town_village: formData.townVillage })
      toast({ title: t('scholarship.successMsg', 'Registration Submitted'), description: t('scholarship.successMsg', "We'll contact you with scholarship test details soon.") })
      setFormData({ studentName: '', class: '', school: '', parentName: '', parentPhone: '', townVillage: '' })
    } catch (err) {
      console.error('Registration error:', err)
      toast({ title: "Registration Failed", description: "Please try again later.", variant: "destructive" })
    } finally { setLoading(false) }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const heroTitle = pickLang(safeString(scholarship?.hero_title, 'Scholarship Programme'), safeString(scholarship?.hero_title_ta), language)
  const heroDesc = pickLang(safeString(scholarship?.hero_description, 'Content coming soon'), safeString(scholarship?.hero_description_ta), language)
  const howItWorksTitle = pickLang(safeString(scholarship?.how_it_works_title, 'How It Works'), safeString(scholarship?.how_it_works_title_ta), language)
  const howItWorksDesc = pickLang(safeString(scholarship?.how_it_works_description, 'Content coming soon'), safeString(scholarship?.how_it_works_description_ta), language)
  const testDetailsTitle = pickLang(safeString(scholarship?.test_details_title, 'Test Details'), safeString(scholarship?.test_details_title_ta), language)
  const cards = [
    { icon: BookOpen, title: pickLang(safeString(scholarship?.card1_title, 'Card 1'), safeString(scholarship?.card1_title_ta), language), text: pickLang(safeString(scholarship?.card1_text, 'Content coming soon'), safeString(scholarship?.card1_text_ta), language) },
    { icon: CheckCircle, title: pickLang(safeString(scholarship?.card2_title, 'Card 2'), safeString(scholarship?.card2_title_ta), language), text: pickLang(safeString(scholarship?.card2_text, 'Content coming soon'), safeString(scholarship?.card2_text_ta), language) },
    { icon: GraduationCap, title: pickLang(safeString(scholarship?.card3_title, 'Card 3'), safeString(scholarship?.card3_title_ta), language), text: pickLang(safeString(scholarship?.card3_text, 'Content coming soon'), safeString(scholarship?.card3_text_ta), language) },
  ]
  const classOptions = t('form.classOptions', '8|9|10|11|12').split('|').map((item) => item.trim()).filter(Boolean)

  return (
    <>
      <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-primary">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#3b82f630,transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,#06b6d430,transparent_40%)]" />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.05]" />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="container relative mx-auto px-4 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-white backdrop-blur">
            <GraduationCap className="h-4 w-4" /> {t('nav.scholarship', 'Scholarship Programme')}
          </div>
          <h1 className="mx-auto max-w-4xl font-display text-4xl font-extrabold leading-tight tracking-tight text-white md:text-6xl">{heroTitle}</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">{heroDesc}</p>
        </motion.div>
      </section>

      <Section>
        <FadeIn>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-primary md:text-4xl mb-6">{howItWorksTitle}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">{howItWorksDesc}</p>
            <div className="grid gap-6 md:grid-cols-3">
              {cards.map((item, i) => (
                <FadeIn key={i} delay={i * 0.1}>
                  <Card className="border-0 shadow-sm"><CardContent className="p-6 text-center">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mx-auto"><item.icon className="h-6 w-6" /></div>
                    <h3 className="font-display font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.text}</p>
                  </CardContent></Card>
                </FadeIn>
              ))}
            </div>
          </div>
        </FadeIn>
      </Section>

      <Section className="bg-muted/50">
        <FadeIn>
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-primary md:text-4xl mb-8 text-center">{testDetailsTitle}</h2>
            <Card className="border-0 shadow-sm"><CardContent className="p-8">
              <div className="grid gap-6 md:grid-cols-2">
                <div><h3 className="font-semibold mb-2">{t('scholarship.eligibility', 'Eligibility')}</h3><p className="text-muted-foreground">{pickLang(safeString(scholarship?.eligibility, 'Content coming soon'), safeString(scholarship?.eligibility_ta), language)}</p></div>
                <div><h3 className="font-semibold mb-2">{t('scholarship.duration', 'Duration')}</h3><p className="text-muted-foreground">{pickLang(safeString(scholarship?.duration, 'Content coming soon'), safeString(scholarship?.duration_ta), language)}</p></div>
                <div><h3 className="font-semibold mb-2">{t('scholarship.testDate', 'Test Date')}</h3><p className="text-muted-foreground">{pickLang(safeString(scholarship?.test_date, 'Content coming soon'), safeString(scholarship?.test_date_ta), language)}</p></div>
                <div><h3 className="font-semibold mb-2">{t('scholarship.venues', 'Venues')}</h3><p className="text-muted-foreground">{pickLang(safeString(scholarship?.venues, 'Content coming soon'), safeString(scholarship?.venues_ta), language)}</p></div>
              </div>
              {scholarship?.sample_paper_link && (
                <div className="mt-6 pt-6 border-t text-center">
                  <Button asChild variant="outline"><a href={scholarship.sample_paper_link} target="_blank" rel="noopener noreferrer">{t('scholarship.samplePaper', 'Download Sample Paper')}</a></Button>
                </div>
              )}
            </CardContent></Card>
          </div>
        </FadeIn>
      </Section>

      <Section>
        <FadeIn>
          <div className="mx-auto max-w-2xl">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-primary md:text-4xl mb-8 text-center">{t('scholarship.formTitle', 'Register for the Test')}</h2>
            <Card className="border-0 shadow-sm"><CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2"><Label htmlFor="studentName">{t('scholarship.studentName', 'Student Name')} *</Label><Input id="studentName" name="studentName" value={formData.studentName} onChange={handleChange} required placeholder={t('form.studentNamePlaceholder', "Enter student's full name")} /></div>
                <div className="space-y-2"><Label htmlFor="class">{t('scholarship.class', 'Class (2025-26)')} *</Label>
                  <select id="class" name="class" value={formData.class} onChange={handleChange} required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    <option value="">{t('form.selectClass', 'Select class')}</option>{classOptions.map((option) => <option key={option} value={option}>{t('form.classPrefix', 'Class')} {option}</option>)}
                  </select>
                </div>
                <div className="space-y-2"><Label htmlFor="school">{t('scholarship.school', 'School')} *</Label><Input id="school" name="school" value={formData.school} onChange={handleChange} required placeholder={t('form.schoolPlaceholder', 'Current school name')} /></div>
                <div className="space-y-2"><Label htmlFor="parentName">{t('scholarship.parentName', 'Parent Name')} *</Label><Input id="parentName" name="parentName" value={formData.parentName} onChange={handleChange} required placeholder={t('form.parentNamePlaceholder', 'Father/Mother/Guardian name')} /></div>
                <div className="space-y-2"><Label htmlFor="parentPhone">{t('scholarship.parentPhone', 'Parent Phone (WhatsApp)')} *</Label><Input id="parentPhone" name="parentPhone" type="tel" value={formData.parentPhone} onChange={handleChange} required placeholder={t('form.phonePlaceholder', '10-digit mobile number')} pattern="[0-9]{10}" /></div>
                <div className="space-y-2"><Label htmlFor="townVillage">{t('scholarship.townVillage', 'Town/Village')} *</Label><Input id="townVillage" name="townVillage" value={formData.townVillage} onChange={handleChange} required placeholder={t('form.townPlaceholder', 'Your town or village')} /></div>
                <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Submitting...' : t('scholarship.submit', 'Register for Scholarship Test')}</Button>
              </form>
            </CardContent></Card>
          </div>
        </FadeIn>
      </Section>
    </>
  )
}
