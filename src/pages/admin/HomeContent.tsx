import { Home as HomeIcon } from 'lucide-react'
import { TranslationSection } from '@/components/admin/TranslationSection'

export default function HomeContent() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold flex items-center gap-2">
          <HomeIcon className="h-6 w-6" /> Home Page
        </h2>
        <p className="text-sm text-muted-foreground">
          Manage text shown across the homepage — hero, vision, mission, courses, events, blog and call-to-action
          sections. The vision, mission and about body text (with Tamil) are set in Settings &rarr; About Section.
        </p>
      </div>

      <TranslationSection
        prefix="home"
        title="Homepage Text"
        description="Headings, labels and buttons across the homepage, including the Our Mission heading"
      />
    </div>
  )
}
