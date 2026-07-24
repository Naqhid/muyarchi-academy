import { Home as HomeIcon, Globe, Target, BarChart3, Award, Heart, Info } from 'lucide-react'
import { SettingsForm, type SettingsGroup } from '@/components/admin/SettingsForm'
import { TranslationSection } from '@/components/admin/TranslationSection'

// Groups are ordered top-to-bottom to mirror the live homepage:
// Hero banner → hero stats strip → About/Vision → the three cards (Mission, Values, Quality).
const groups: SettingsGroup[] = [
  {
    title: '1. Hero Section',
    icon: Globe,
    description: 'The main banner text shown at the very top of the homepage.',
    fields: [
      { name: 'hero_title', taName: 'hero_title_ta', label: 'Hero Title (English)', taLabel: 'Hero Title (Tamil)', placeholder: 'Welcome to Muyarchi Academy', taPlaceholder: 'தலைப்பு' },
      { name: 'hero_subtitle', taName: 'hero_subtitle_ta', label: 'Hero Subtitle (English)', taLabel: 'Hero Subtitle (Tamil)', placeholder: 'Empowering students through quality education', taPlaceholder: 'துணைத் தலைப்பு' },
    ],
  },
  {
    title: '2. Hero Stats',
    icon: BarChart3,
    columns: true,
    description: 'The numbers strip shown just under the hero banner.',
    fields: [
      { name: 'stat_students', label: 'Students', placeholder: '500+' },
      { name: 'stat_courses', label: 'Courses', placeholder: '20+' },
      { name: 'stat_years', label: 'Years', placeholder: '10+' },
    ],
  },
  {
    title: '3. About & Vision',
    icon: Info,
    description: 'The "About / Our Vision" intro section. Fill in both English and Tamil — leave Tamil blank to reuse the English text.',
    fields: [
      { name: 'about', taName: 'about_ta', label: 'About (English)', taLabel: 'About (Tamil)', type: 'textarea', rows: 4, placeholder: 'About your academy...', taPlaceholder: 'அகாடமி பற்றி...' },
      { name: 'vision', taName: 'vision_ta', label: 'Vision (English)', taLabel: 'Vision (Tamil)', type: 'textarea', placeholder: "Your academy's vision...", taPlaceholder: 'கல்வி நோக்கம்...' },
    ],
  },
  {
    title: '4. Card 1 — Our Mission',
    icon: Target,
    description: 'The first card in the three-card strip. Title appears as the heading, text as the body.',
    fields: [
      { name: 'mission_title', taName: 'mission_title_ta', label: 'Mission Title (English)', taLabel: 'Mission Title (Tamil)', placeholder: 'Our Mission', taPlaceholder: 'எங்கள் நோக்கம்' },
      { name: 'mission', taName: 'mission_ta', label: 'Mission Text (English)', taLabel: 'Mission Text (Tamil)', type: 'textarea', placeholder: 'Our mission is to support talented students...', taPlaceholder: 'எங்கள் நோக்கம்...' },
    ],
  },
  {
    title: '5. Card 2 — Values',
    icon: Heart,
    description: 'The middle card in the three-card strip.',
    fields: [
      { name: 'values_title', taName: 'values_title_ta', label: 'Values Title (English)', taLabel: 'Values Title (Tamil)', placeholder: 'Honesty. Discipline. Care.', taPlaceholder: 'நேர்மை. கட்டுப்பாடு. அக்கறை.' },
      { name: 'values_text', taName: 'values_text_ta', label: 'Values Text (English)', taLabel: 'Values Text (Tamil)', type: 'textarea', placeholder: 'How we run every classroom...', taPlaceholder: 'ஒவ்வொரு வகுப்பறையிலும்...' },
    ],
  },
  {
    title: '6. Card 3 — Our Quality',
    icon: Award,
    description: 'The last card in the three-card strip.',
    fields: [
      { name: 'quality_title', taName: 'quality_title_ta', label: 'Quality Title (English)', taLabel: 'Quality Title (Tamil)', placeholder: 'Our Quality', taPlaceholder: 'எங்கள் தரம்' },
      { name: 'quality_text', taName: 'quality_text_ta', label: 'Quality Text (English)', taLabel: 'Quality Text (Tamil)', type: 'textarea', placeholder: 'Monthly tests with ranked results...', taPlaceholder: 'மாதாந்திர தேர்வுகள்...' },
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
          The sections below are ordered exactly as they appear on the live homepage, top to bottom.
          Fill in English and Tamil for each — use the language toggle to preview how each section reads.
          Only the small shared button labels are managed under &ldquo;Homepage Labels &amp; Buttons&rdquo; at the bottom.
        </p>
      </div>

      <SettingsForm groups={groups} submitLabel="Save Homepage Content" />

      <TranslationSection
        prefix="home"
        title="Homepage Labels & Buttons"
        description="Section headings and buttons (e.g. the 'Our Vision' heading and the 'View All Courses' button)"
      />
    </div>
  )
}
