import { Home as HomeIcon, Globe, Target, BarChart3 } from 'lucide-react'
import { SettingsForm, type SettingsGroup } from '@/components/admin/SettingsForm'
import { TranslationSection } from '@/components/admin/TranslationSection'

const groups: SettingsGroup[] = [
  {
    title: 'Hero Section',
    icon: Globe,
    description: 'The main banner text shown at the top of the homepage.',
    fields: [
      { name: 'hero_title', taName: 'hero_title_ta', label: 'Hero Title (English)', taLabel: 'Hero Title (Tamil)', placeholder: 'Welcome to Muyarchi Academy', taPlaceholder: 'தலைப்பு' },
      { name: 'hero_subtitle', taName: 'hero_subtitle_ta', label: 'Hero Subtitle (English)', taLabel: 'Hero Subtitle (Tamil)', placeholder: 'Empowering students through quality education', taPlaceholder: 'துணைத் தலைப்பு' },
    ],
  },
  {
    title: 'About, Vision & Mission',
    icon: Target,
    description: 'The "Our Vision / About / Our Mission" section of the homepage. Fill in both English and Tamil — leave Tamil blank to reuse the English text.',
    fields: [
      { name: 'about', taName: 'about_ta', label: 'About (English)', taLabel: 'About (Tamil)', type: 'textarea', rows: 4, placeholder: 'About your academy...', taPlaceholder: 'அகாடமி பற்றி...' },
      { name: 'vision', taName: 'vision_ta', label: 'Vision (English)', taLabel: 'Vision (Tamil)', type: 'textarea', placeholder: "Your academy's vision...", taPlaceholder: 'கல்வி நோக்கம்...' },
      { name: 'mission', taName: 'mission_ta', label: 'Mission (English)', taLabel: 'Mission (Tamil)', type: 'textarea', placeholder: 'Our mission is to support talented students...', taPlaceholder: 'எங்கள் நோக்கம்...' },
      { name: 'values_title', taName: 'values_title_ta', label: 'Values Title (English)', taLabel: 'Values Title (Tamil)', placeholder: 'Honesty. Discipline. Care.', taPlaceholder: 'நேர்மை. கட்டுப்பாடு. அக்கறை.' },
      { name: 'values_text', taName: 'values_text_ta', label: 'Values Text (English)', taLabel: 'Values Text (Tamil)', type: 'textarea', placeholder: 'How we run every classroom...', taPlaceholder: 'ஒவ்வொரு வகுப்பறையிலும்...' },
      { name: 'quality_title', taName: 'quality_title_ta', label: 'Quality Title (English)', taLabel: 'Quality Title (Tamil)', placeholder: 'Our Quality', taPlaceholder: 'எங்கள் தரம்' },
      { name: 'quality_text', taName: 'quality_text_ta', label: 'Quality Text (English)', taLabel: 'Quality Text (Tamil)', type: 'textarea', placeholder: 'Monthly tests with ranked results...', taPlaceholder: 'மாதாந்திர தேர்வுகள்...' },
    ],
  },
  {
    title: 'Hero Stats',
    icon: BarChart3,
    columns: true,
    description: 'Numbers shown in the hero section stats strip.',
    fields: [
      { name: 'stat_students', label: 'Students', placeholder: '500+' },
      { name: 'stat_courses', label: 'Courses', placeholder: '20+' },
      { name: 'stat_years', label: 'Years', placeholder: '10+' },
    ],
  },
]

export default function HomeContent() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold flex items-center gap-2">
          <HomeIcon className="h-6 w-6" /> Home Page
        </h2>
        <p className="text-sm text-muted-foreground">
          Manage everything shown on the homepage — the hero banner, the Our Vision / About / Our Mission
          section (with Tamil), and the stats strip. Section headings and button labels are managed under
          &ldquo;Homepage Labels &amp; Buttons&rdquo; at the bottom.
        </p>
      </div>

      <SettingsForm groups={groups} submitLabel="Save Homepage Content" />

      <TranslationSection
        prefix="home"
        title="Homepage Labels & Buttons"
        description="Section headings and buttons (e.g. the 'Our Mission' heading and the 'View All Courses' button)"
      />
    </div>
  )
}
