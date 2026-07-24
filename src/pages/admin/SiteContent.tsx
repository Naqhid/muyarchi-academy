import { LayoutTemplate } from 'lucide-react'
import { TranslationSection } from '@/components/admin/TranslationSection'

export default function SiteContent() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold flex items-center gap-2">
          <LayoutTemplate className="h-6 w-6" /> Site Content
        </h2>
        <p className="text-sm text-muted-foreground">
          Manage global text that appears on every page — the navigation menu, footer, and SEO meta tags.
        </p>
      </div>

      <TranslationSection
        prefix="nav"
        title="Navigation Menu"
        description="Menu links shown in the site header"
      />
      <TranslationSection
        prefix="footer"
        title="Footer"
        description="Footer links and labels"
      />
      <TranslationSection
        prefix="seo"
        title="SEO / Meta"
        description="Page titles and meta descriptions used for search engines"
      />
    </div>
  )
}
