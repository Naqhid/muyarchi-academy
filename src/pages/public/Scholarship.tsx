import { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, GraduationCap, CheckCircle } from 'lucide-react'
import { Section, FadeIn } from '@/components/shared/Section'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { useSettings } from '@/hooks/use-settings'

export default function Scholarship() {
  const { toast } = useToast()
  const { settings } = useSettings()
  const [formData, setFormData] = useState({
    studentName: '',
    class: '',
    school: '',
    parentName: '',
    parentPhone: '',
    townVillage: '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate form submission
    setTimeout(() => {
      setLoading(false)
      toast({
        title: "Registration Submitted",
        description: "We'll contact you with scholarship test details soon.",
      })
      setFormData({
        studentName: '',
        class: '',
        school: '',
        parentName: '',
        parentPhone: '',
        townVillage: '',
      })
    }, 1500)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-primary">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#3b82f630,transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,#06b6d430,transparent_40%)]" />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.05]" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="container relative mx-auto px-4 text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-white backdrop-blur">
            <GraduationCap className="h-4 w-4" />
            Scholarship Programme
          </div>
          <h1 className="mx-auto max-w-4xl font-display text-4xl font-extrabold leading-tight tracking-tight text-white md:text-6xl">
            {settings?.scholarship_hero_title || 'Scholarship-cum-Admission Test'}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            {settings?.scholarship_hero_description || 'Every student who joins Muyarchi Academy sits our scholarship test — and every mark earned reduces the fee.'}
          </p>
        </motion.div>
      </section>

      {/* About Section */}
      <Section>
        <FadeIn>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-primary md:text-4xl mb-6">
              {settings?.scholarship_how_it_works_title || 'How It Works'}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              {settings?.scholarship_how_it_works_description || 'The test rewards effort and ability, not background: a simple objective paper appropriate to the student\'s class, covering Mathematics, Science and mental ability. Scholarships are awarded on merit, and the registration amount is fully adjusted against admission for every student who takes the test.'}
            </p>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                { icon: BookOpen, title: settings?.scholarship_card1_title || 'Objective Test', text: settings?.scholarship_card1_text || 'Mathematics, Science and mental ability' },
                { icon: CheckCircle, title: settings?.scholarship_card2_title || 'Merit-Based', text: settings?.scholarship_card2_text || 'Scholarships awarded on performance' },
                { icon: GraduationCap, title: settings?.scholarship_card3_title || 'Fee Reduction', text: settings?.scholarship_card3_text || 'Every mark earned reduces the fee' },
              ].map((item, i) => (
                <FadeIn key={i} delay={i * 0.1}>
                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-6 text-center">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mx-auto">
                        <item.icon className="h-6 w-6" />
                      </div>
                      <h3 className="font-display font-semibold mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.text}</p>
                    </CardContent>
                  </Card>
                </FadeIn>
              ))}
            </div>
          </div>
        </FadeIn>
      </Section>

      {/* Test Details Section */}
      <Section className="bg-muted/50">
        <FadeIn>
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-primary md:text-4xl mb-8 text-center">
              {settings?.scholarship_test_details_title || 'Test Details'}
            </h2>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="font-semibold mb-2">Eligibility</h3>
                    <p className="text-muted-foreground">{settings?.scholarship_eligibility || 'Students entering Classes 8–12'}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Duration</h3>
                    <p className="text-muted-foreground">{settings?.scholarship_duration || 'Coming soon'}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Test Date</h3>
                    <p className="text-muted-foreground">{settings?.scholarship_test_date || 'Coming soon'}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Venues</h3>
                    <p className="text-muted-foreground">{settings?.scholarship_venues || 'Coming soon'}</p>
                  </div>
                </div>
                {settings?.scholarship_sample_paper_link && (
                  <div className="mt-6 pt-6 border-t text-center">
                    <Button asChild variant="outline">
                      <a href={settings.scholarship_sample_paper_link} target="_blank" rel="noopener noreferrer">
                        Download Sample Paper
                      </a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </FadeIn>
      </Section>

      {/* Registration Form Section */}
      <Section>
        <FadeIn>
          <div className="mx-auto max-w-2xl">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-primary md:text-4xl mb-8 text-center">
              Register for the Test
            </h2>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="studentName">Student Name *</Label>
                    <Input
                      id="studentName"
                      name="studentName"
                      value={formData.studentName}
                      onChange={handleChange}
                      required
                      placeholder="Enter student's full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="class">Class (2025-26) *</Label>
                    <select
                      id="class"
                      name="class"
                      value={formData.class}
                      onChange={handleChange}
                      required
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select class</option>
                      <option value="8">Class 8</option>
                      <option value="9">Class 9</option>
                      <option value="10">Class 10</option>
                      <option value="11">Class 11</option>
                      <option value="12">Class 12</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="school">School *</Label>
                    <Input
                      id="school"
                      name="school"
                      value={formData.school}
                      onChange={handleChange}
                      required
                      placeholder="Current school name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="parentName">Parent Name *</Label>
                    <Input
                      id="parentName"
                      name="parentName"
                      value={formData.parentName}
                      onChange={handleChange}
                      required
                      placeholder="Father/Mother/Guardian name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="parentPhone">Parent Phone (WhatsApp) *</Label>
                    <Input
                      id="parentPhone"
                      name="parentPhone"
                      type="tel"
                      value={formData.parentPhone}
                      onChange={handleChange}
                      required
                      placeholder="10-digit mobile number"
                      pattern="[0-9]{10}"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="townVillage">Town/Village *</Label>
                    <Input
                      id="townVillage"
                      name="townVillage"
                      value={formData.townVillage}
                      onChange={handleChange}
                      required
                      placeholder="Your town or village"
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Submitting...' : 'Register for Scholarship Test'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </FadeIn>
      </Section>
    </>
  )
}
