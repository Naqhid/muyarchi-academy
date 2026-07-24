import { Settings as SettingsIcon, Globe } from 'lucide-react'
import { SettingsForm, type SettingsGroup } from '@/components/admin/SettingsForm'

const groups: SettingsGroup[] = [
  {
    title: 'General',
    icon: SettingsIcon,
    description: 'Academy name and logo used across the whole site.',
    fields: [
      { name: 'academy_name', taName: 'academy_name_ta', label: 'Academy Name (English)', taLabel: 'Academy Name (Tamil)', placeholder: 'Muyarchi Academy', taPlaceholder: 'முயற்சி அகாடமி' },
      { name: 'logo_url', label: 'Logo URL', placeholder: 'https://...' },
    ],
  },
  {
    title: 'Footer',
    icon: SettingsIcon,
    description: 'Text displayed in the website footer.',
    fields: [
      { name: 'footer_text', taName: 'footer_text_ta', label: 'Footer Text (English)', taLabel: 'Footer Text (Tamil)', type: 'textarea', placeholder: '© 2024 Muyarchi Academy. All rights reserved.', taPlaceholder: 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.' },
    ],
  },
  {
    title: 'Social Links',
    icon: Globe,
    description: "Your academy's social media profiles.",
    fields: [
      { name: 'facebook_url', label: 'Facebook URL', placeholder: 'https://facebook.com/...' },
      { name: 'twitter_url', label: 'Twitter URL', placeholder: 'https://twitter.com/...' },
      { name: 'instagram_url', label: 'Instagram URL', placeholder: 'https://instagram.com/...' },
      { name: 'youtube_url', label: 'YouTube URL', placeholder: 'https://youtube.com/...' },
      { name: 'linkedin_url', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/...' },
    ],
  },
]

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold">Website Settings</h2>
        <p className="text-sm text-muted-foreground">
          Global branding and links. Homepage text lives under <strong>Home Page</strong>, and contact
          details under <strong>Contact Page</strong>.
        </p>
      </div>

      <SettingsForm groups={groups} submitLabel="Save Settings" />
    </div>
  )
}
