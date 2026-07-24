import { Mail } from 'lucide-react'
import { TranslationSection } from '@/components/admin/TranslationSection'

export default function ContactContent() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold flex items-center gap-2">
          <Mail className="h-6 w-6" /> Contact Page
        </h2>
        <p className="text-sm text-muted-foreground">
          Manage text shown on the Contact page. Phone, email, address and map are set in Settings &rarr; Contact Info.
        </p>
      </div>

      <TranslationSection
        prefix="contact"
        title="Contact Page Text"
        description="Headings, labels and form text on the contact page"
      />
    </div>
  )
}
