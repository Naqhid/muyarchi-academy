import { Mail, Phone, MapPin } from 'lucide-react'
import { SettingsForm, type SettingsGroup } from '@/components/admin/SettingsForm'
import { TranslationSection } from '@/components/admin/TranslationSection'

const groups: SettingsGroup[] = [
  {
    title: 'Contact Info',
    icon: Phone,
    description: 'Phone, email and address shown on the Contact page and in the footer.',
    fields: [
      { name: 'phone', label: 'Phone', placeholder: '+91 98765 43210' },
      { name: 'email', label: 'Email', placeholder: 'info@muyarchi.com' },
      { name: 'address', label: 'Address', type: 'textarea', placeholder: "Your academy's address..." },
    ],
  },
  {
    title: 'Google Map',
    icon: MapPin,
    description: 'Use a Google Maps Embed URL (Share → Embed a map → copy only the URL inside src="..."). Share links such as maps.app.goo.gl will not display.',
    fields: [
      { name: 'google_map_url', label: 'Google Maps Embed URL', placeholder: 'https://www.google.com/maps/embed?pb=...' },
    ],
  },
]

export default function ContactContent() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold flex items-center gap-2">
          <Mail className="h-6 w-6" /> Contact Page
        </h2>
        <p className="text-sm text-muted-foreground">
          Manage the Contact page — your phone, email, address and map, plus the page&apos;s headings and form labels.
        </p>
      </div>

      <SettingsForm groups={groups} submitLabel="Save Contact Info" />

      <TranslationSection
        prefix="contact"
        title="Contact Page Text"
        description="Headings, labels and form text on the contact page"
      />
    </div>
  )
}
