import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Youtube, Linkedin, Mail, Phone, MapPin } from 'lucide-react'
import { useSettings } from '@/hooks/use-settings'

export function PublicFooter() {
  const { settings } = useSettings()
  if (!settings) return null

  const socials = [
    { url: settings.facebook_url, icon: Facebook, label: 'Facebook' },
    { url: settings.twitter_url, icon: Twitter, label: 'Twitter' },
    { url: settings.instagram_url, icon: Instagram, label: 'Instagram' },
    { url: settings.youtube_url, icon: Youtube, label: 'YouTube' },
    { url: settings.linkedin_url, icon: Linkedin, label: 'LinkedIn' },
  ].filter((s) => s.url)

  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {settings.logo_url ? (
                <img src={settings.logo_url} alt={settings.academy_name} className="h-9 w-9 rounded-lg object-cover" />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-display font-bold">{settings.academy_name.charAt(0)}</div>
              )}
              <span className="font-display text-lg font-bold">{settings.academy_name}</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">Where every effort counts.</p>
          </div>
          <div>
            <h3 className="mb-4 font-display font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/courses" className="hover:text-primary transition-colors">Courses</Link></li>
              <li><Link to="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link to="/events" className="hover:text-primary transition-colors">Events & Gallery</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-display font-semibold">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {settings.phone && <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /><a href={`tel:${settings.phone}`} className="hover:text-primary transition-colors">{settings.phone}</a></li>}
              {settings.email && <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /><a href={`mailto:${settings.email}`} className="hover:text-primary transition-colors">{settings.email}</a></li>}
              {settings.address && <li className="flex items-start gap-2"><MapPin className="h-4 w-4 text-primary mt-0.5" /><span>{settings.address}</span></li>}
            </ul>
            {socials.length > 0 && (
              <div className="mt-4 flex gap-3">
                {socials.map((s) => (
                  <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                    <s.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {settings.academy_name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
