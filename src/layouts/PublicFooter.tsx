import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Youtube, Linkedin, Mail, Phone, MapPin } from 'lucide-react'
import { useSettings } from '@/hooks/use-settings'
import { useLanguage, pickLang } from '@/hooks/use-language'

const safeString = (val: unknown): string => {
  if (typeof val === 'string') return val
  if (val && typeof val === 'object') return JSON.stringify(val)
  return ''
}

export function PublicFooter() {
  const { settings } = useSettings()
  const { t, language } = useLanguage()
  if (!settings) return null

  const academyName = pickLang(safeString(settings.academy_name) || 'Muyarchi Academy', safeString(settings.academy_name_ta), language)
  const footerText = pickLang(safeString(settings.footer_text) || 'Where every effort counts.', safeString(settings.footer_text_ta), language)
  const logoUrl = safeString(settings.logo_url)
  const phone = safeString(settings.phone)
  const email = safeString(settings.email)
  const address = pickLang(safeString(settings.address), safeString(settings.address), language)

  const socials = [
    { url: safeString(settings.facebook_url), icon: Facebook, label: 'Facebook' },
    { url: safeString(settings.twitter_url), icon: Twitter, label: 'Twitter' },
    { url: safeString(settings.instagram_url), icon: Instagram, label: 'Instagram' },
    { url: safeString(settings.youtube_url), icon: Youtube, label: 'YouTube' },
    { url: safeString(settings.linkedin_url), icon: Linkedin, label: 'LinkedIn' },
  ].filter((s) => s.url)

  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {logoUrl ? (
                <img src={logoUrl} alt={academyName} className="h-9 w-9 rounded-lg object-cover" />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-display font-bold">{academyName.charAt(0)}</div>
              )}
              <span className="font-display text-lg font-bold">{academyName}</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">{footerText}</p>
          </div>
          <div>
            <h3 className="mb-4 font-display font-semibold">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-primary transition-colors">{t('nav.home')}</Link></li>
              <li><Link to="/courses" className="hover:text-primary transition-colors">{t('nav.courses')}</Link></li>
              <li><Link to="/blog" className="hover:text-primary transition-colors">{t('nav.blog')}</Link></li>
              <li><Link to="/events" className="hover:text-primary transition-colors">{t('nav.events')}</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">{t('nav.contact')}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-display font-semibold">{t('footer.contactUs')}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {phone && <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /><a href={`tel:${phone}`} className="hover:text-primary transition-colors">{phone}</a></li>}
              {email && <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /><a href={`mailto:${email}`} className="hover:text-primary transition-colors">{email}</a></li>}
              {address && <li className="flex items-start gap-2"><MapPin className="h-4 w-4 text-primary mt-0.5" /><span>{address}</span></li>}
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
          <p>&copy; {new Date().getFullYear()} {academyName}. {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  )
}
