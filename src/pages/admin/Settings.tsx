import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Save, Loader2, Settings as SettingsIcon, Globe, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube, Linkedin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/hooks/use-toast'
import { useSettings } from '@/hooks/use-settings'
import { fetchSettings, updateSettings } from '@/lib/api'
import type { SiteSettingsInput } from '@/types'

const schema = z.object({
  academy_name: z.string().optional().default(''),
  academy_name_ta: z.string().optional().default(''),
  logo_url: z.string().optional().default(''),
  hero_title: z.string().optional().default(''),
  hero_title_ta: z.string().optional().default(''),
  hero_subtitle: z.string().optional().default(''),
  hero_subtitle_ta: z.string().optional().default(''),
  about: z.string().optional().default(''),
  about_ta: z.string().optional().default(''),
  vision: z.string().optional().default(''),
  vision_ta: z.string().optional().default(''),
  mission: z.string().optional().default(''),
  mission_ta: z.string().optional().default(''),
  phone: z.string().optional().default(''),
  email: z.string().optional().default(''),
  address: z.string().optional().default(''),
  footer_text: z.string().optional().default(''),
  footer_text_ta: z.string().optional().default(''),
  google_map_url: z.string().optional().default(''),
  stat_students: z.string().optional().default(''),
  stat_courses: z.string().optional().default(''),
  stat_years: z.string().optional().default(''),
  facebook_url: z.string().optional().default(''),
  twitter_url: z.string().optional().default(''),
  instagram_url: z.string().optional().default(''),
  youtube_url: z.string().optional().default(''),
  linkedin_url: z.string().optional().default(''),
})
type FormData = z.infer<typeof schema>

export default function Settings() {
  const { toast } = useToast()
  const { refresh } = useSettings()
  const [loading, setLoading] = useState(true)

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      academy_name: '', academy_name_ta: '', logo_url: '', hero_title: '', hero_title_ta: '', hero_subtitle: '', hero_subtitle_ta: '', about: '', about_ta: '', vision: '', vision_ta: '', mission: '', mission_ta: '',
      phone: '', email: '', address: '', footer_text: '', footer_text_ta: '', google_map_url: '',
      stat_students: '', stat_courses: '', stat_years: '',
      facebook_url: '', twitter_url: '', instagram_url: '', youtube_url: '', linkedin_url: '',
    },
  })

  useEffect(() => {
    fetchSettings()
      .then((data) => {
        if (data) {
          reset({
            academy_name: data.academy_name || '',
            academy_name_ta: data.academy_name_ta || '',
            logo_url: data.logo_url || '',
            hero_title: data.hero_title || '',
            hero_title_ta: data.hero_title_ta || '',
            hero_subtitle: data.hero_subtitle || '',
            hero_subtitle_ta: data.hero_subtitle_ta || '',
            about: data.about || '',
            about_ta: data.about_ta || '',
            vision: data.vision || '',
            vision_ta: data.vision_ta || '',
            mission: data.mission || '',
            mission_ta: data.mission_ta || '',
            phone: data.phone || '',
            email: data.email || '',
            address: data.address || '',
            footer_text: data.footer_text || '',
            footer_text_ta: data.footer_text_ta || '',
            google_map_url: data.google_map_url || '',
            stat_students: data.stat_students || '',
            stat_courses: data.stat_courses || '',
            stat_years: data.stat_years || '',
            facebook_url: data.facebook_url || '',
            twitter_url: data.twitter_url || '',
            instagram_url: data.instagram_url || '',
            youtube_url: data.youtube_url || '',
            linkedin_url: data.linkedin_url || '',
          })
        }
      })
      .catch((err) => { console.error('Failed to load settings:', err); toast({ title: 'Error', description: 'Failed to load settings', variant: 'destructive' }) })
      .finally(() => setLoading(false))
  }, [reset, toast])

  const onSubmit = async (data: FormData) => {
    const input: Partial<SiteSettingsInput> = {
      academy_name: data.academy_name || '',
      academy_name_ta: data.academy_name_ta || '',
      logo_url: data.logo_url || '',
      hero_title: data.hero_title || '',
      hero_title_ta: data.hero_title_ta || '',
      hero_subtitle: data.hero_subtitle || '',
      hero_subtitle_ta: data.hero_subtitle_ta || '',
      about: data.about || '',
      about_ta: data.about_ta || '',
      vision: data.vision || '',
      vision_ta: data.vision_ta || '',
      mission: data.mission || '',
      mission_ta: data.mission_ta || '',
      phone: data.phone || '',
      email: data.email || '',
      address: data.address || '',
      footer_text: data.footer_text || '',
      footer_text_ta: data.footer_text_ta || '',
      google_map_url: data.google_map_url || '',
      stat_students: data.stat_students || '',
      stat_courses: data.stat_courses || '',
      stat_years: data.stat_years || '',
      facebook_url: data.facebook_url || '',
      twitter_url: data.twitter_url || '',
      instagram_url: data.instagram_url || '',
      youtube_url: data.youtube_url || '',
      linkedin_url: data.linkedin_url || '',
    }
    try {
      await updateSettings(input)
      toast({ title: 'Settings saved', description: 'Website settings have been updated successfully.', variant: 'success' })
      refresh()
    } catch (err) {
      console.error('Save error:', err)
      toast({ title: 'Error', description: 'Failed to save settings', variant: 'destructive' })
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-display text-2xl font-bold">Website Settings</h2>
          <p className="text-sm text-muted-foreground">Configure your academy website</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-64 rounded-lg" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold">Website Settings</h2>
        <p className="text-sm text-muted-foreground">Configure your academy website</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* General */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl"><SettingsIcon className="h-5 w-5" />General</CardTitle>
              <CardDescription>Basic information about your academy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="academy_name">Academy Name (English)</Label>
                <Input id="academy_name" placeholder="Muyarchi Academy" {...register('academy_name')} />
                {errors.academy_name && <p className="text-xs text-destructive" role="alert">{errors.academy_name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="academy_name_ta">Academy Name (Tamil)</Label>
                <Input id="academy_name_ta" placeholder="முயற்சி அகாடமி" {...register('academy_name_ta')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="logo_url">Logo URL</Label>
                <Input id="logo_url" placeholder="https://..." {...register('logo_url')} />
                {errors.logo_url && <p className="text-xs text-destructive" role="alert">{errors.logo_url.message}</p>}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Hero Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl"><Globe className="h-5 w-5" />Hero Section</CardTitle>
              <CardDescription>The main banner text on your homepage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hero_title">Hero Title (English)</Label>
                <Input id="hero_title" placeholder="Welcome to Muyarchi Academy" {...register('hero_title')} />
                {errors.hero_title && <p className="text-xs text-destructive" role="alert">{errors.hero_title.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="hero_title_ta">Hero Title (Tamil)</Label>
                <Input id="hero_title_ta" placeholder="தலைப்பு" {...register('hero_title_ta')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hero_subtitle">Hero Subtitle (English)</Label>
                <Input id="hero_subtitle" placeholder="Empowering students through quality education" {...register('hero_subtitle')} />
                {errors.hero_subtitle && <p className="text-xs text-destructive" role="alert">{errors.hero_subtitle.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="hero_subtitle_ta">Hero Subtitle (Tamil)</Label>
                <Input id="hero_subtitle_ta" placeholder="துணைத் தலைப்பு" {...register('hero_subtitle_ta')} />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* About Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl"><SettingsIcon className="h-5 w-5" />About Section</CardTitle>
              <CardDescription>Information about your academy's mission and vision</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="about">About (English)</Label>
                <Textarea id="about" rows={4} placeholder="About your academy..." {...register('about')} />
                {errors.about && <p className="text-xs text-destructive" role="alert">{errors.about.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="about_ta">About (Tamil)</Label>
                <Textarea id="about_ta" rows={4} placeholder="அகாடமி பற்றி..." {...register('about_ta')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vision">Vision (English)</Label>
                <Textarea id="vision" rows={3} placeholder="Your academy's vision..." {...register('vision')} />
                {errors.vision && <p className="text-xs text-destructive" role="alert">{errors.vision.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="vision_ta">Vision (Tamil)</Label>
                <Textarea id="vision_ta" rows={3} placeholder="கல்வி நோக்கம்..." {...register('vision_ta')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mission">Mission (English)</Label>
                <Textarea id="mission" rows={3} placeholder="Your academy's mission..." {...register('mission')} />
                {errors.mission && <p className="text-xs text-destructive" role="alert">{errors.mission.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="mission_ta">Mission (Tamil)</Label>
                <Textarea id="mission_ta" rows={3} placeholder="கல்வி பணி..." {...register('mission_ta')} />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.15 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl"><Phone className="h-5 w-5" />Contact Info</CardTitle>
              <CardDescription>How people can reach your academy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" />Phone</Label>
                <Input id="phone" placeholder="+91 98765 43210" {...register('phone')} />
                {errors.phone && <p className="text-xs text-destructive" role="alert">{errors.phone.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />Email</Label>
                <Input id="email" type="email" placeholder="info@Muyarchi.com" {...register('email')} />
                {errors.email && <p className="text-xs text-destructive" role="alert">{errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />Address</Label>
                <Textarea id="address" rows={3} placeholder="Your academy's address..." {...register('address')} />
                {errors.address && <p className="text-xs text-destructive" role="alert">{errors.address.message}</p>}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl"><SettingsIcon className="h-5 w-5" />Footer</CardTitle>
              <CardDescription>Text displayed in the website footer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="footer_text">Footer Text (English)</Label>
                <Textarea id="footer_text" rows={3} placeholder="© 2024 Muyarchi Academy. All rights reserved." {...register('footer_text')} />
                {errors.footer_text && <p className="text-xs text-destructive" role="alert">{errors.footer_text.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="footer_text_ta">Footer Text (Tamil)</Label>
                <Textarea id="footer_text_ta" rows={3} placeholder="அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை." {...register('footer_text_ta')} />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Hero Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.22 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl"><Globe className="h-5 w-5" />Hero Stats</CardTitle>
              <CardDescription>Numbers shown in the hero section stats strip</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="stat_students">Students</Label>
                <Input id="stat_students" placeholder="500+" {...register('stat_students')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stat_courses">Courses</Label>
                <Input id="stat_courses" placeholder="20+" {...register('stat_courses')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stat_years">Years</Label>
                <Input id="stat_years" placeholder="10+" {...register('stat_years')} />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Google Map */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.25 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl"><MapPin className="h-5 w-5" />Google Map</CardTitle>
              <CardDescription>Use a Google Maps Embed URL. Google Maps share links (such as maps.app.goo.gl) cannot be displayed in the website.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="google_map_url">Google Maps Embed URL</Label>
                <Input id="google_map_url" placeholder="https://www.google.com/maps/embed?pb=..." {...register('google_map_url')} />
                <p className="text-xs text-muted-foreground">In Google Maps: Share → Embed a map → Copy HTML, then paste only the URL inside <code>src="..."</code>.</p>
                {errors.google_map_url && <p className="text-xs text-destructive" role="alert">{errors.google_map_url.message}</p>}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Social Links */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.3 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl"><Globe className="h-5 w-5" />Social Links</CardTitle>
              <CardDescription>Your academy's social media profiles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="facebook_url" className="flex items-center gap-1.5"><Facebook className="h-3.5 w-3.5" />Facebook URL</Label>
                <Input id="facebook_url" placeholder="https://facebook.com/..." {...register('facebook_url')} />
                {errors.facebook_url && <p className="text-xs text-destructive" role="alert">{errors.facebook_url.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter_url" className="flex items-center gap-1.5"><Twitter className="h-3.5 w-3.5" />Twitter URL</Label>
                <Input id="twitter_url" placeholder="https://twitter.com/..." {...register('twitter_url')} />
                {errors.twitter_url && <p className="text-xs text-destructive" role="alert">{errors.twitter_url.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram_url" className="flex items-center gap-1.5"><Instagram className="h-3.5 w-3.5" />Instagram URL</Label>
                <Input id="instagram_url" placeholder="https://instagram.com/..." {...register('instagram_url')} />
                {errors.instagram_url && <p className="text-xs text-destructive" role="alert">{errors.instagram_url.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="youtube_url" className="flex items-center gap-1.5"><Youtube className="h-3.5 w-3.5" />YouTube URL</Label>
                <Input id="youtube_url" placeholder="https://youtube.com/..." {...register('youtube_url')} />
                {errors.youtube_url && <p className="text-xs text-destructive" role="alert">{errors.youtube_url.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin_url" className="flex items-center gap-1.5"><Linkedin className="h-3.5 w-3.5" />LinkedIn URL</Label>
                <Input id="linkedin_url" placeholder="https://linkedin.com/..." {...register('linkedin_url')} />
                {errors.linkedin_url && <p className="text-xs text-destructive" role="alert">{errors.linkedin_url.message}</p>}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting} size="lg">
            {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" />Saving...</> : <><Save className="h-4 w-4" />Save Settings</>}
          </Button>
        </div>
      </form>
    </div>
  )
}
