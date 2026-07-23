import { Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { useLanguage } from '@/hooks/use-language'

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" aria-label="Select language" className="text-sm font-semibold gap-2">
          <Globe className="h-4 w-4" />
          <span>{language === 'ta' ? 'TA' : 'EN'}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem
          onClick={() => setLanguage('en')}
          className={`cursor-pointer ${language === 'en' ? 'font-bold' : ''}`}
        >
          <span className="font-semibold mr-2">EN</span>
          <span>English</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLanguage('ta')}
          className={`cursor-pointer ${language === 'ta' ? 'font-bold' : ''}`}
        >
          <span className="font-semibold mr-2">TA</span>
          <span>தமிழ்</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
