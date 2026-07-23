import { Outlet, Link, useLocation } from 'react-router-dom'
import { useState, useEffect, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSettings } from '@/hooks/use-settings'
import { useLanguage, pickLang } from '@/hooks/use-language'
import { cn } from '@/lib/utils'
import { PublicFooter } from './PublicFooter'

const navLinks = [
  { to: '/', key: 'nav.home' },
  { to: '/courses', key: 'nav.courses' },
  { to: '/scholarship', key: 'nav.scholarship' },
  { to: '/free-demo', key: 'nav.freeDemo' },
  { to: '/blog', key: 'nav.blog' },
  { to: '/events', key: 'nav.events' },
  { to: '/contact', key: 'nav.contact' },
]

const LazyLanguageSwitcher = lazy(() => import('@/components/LanguageSwitcher'))

function LanguageSwitcherFallback() {
  return (
    <Button variant="ghost" size="icon" aria-label="Select language" disabled>
      <span className="text-lg">EN</span>
    </Button>
  )
}

export default function PublicLayout() {
  const { settings } = useSettings()
  const { t, language } = useLanguage()

  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDark(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleDark = () => {
    const next = !dark
    setDark(next)
    if (next) { document.documentElement.classList.add('dark'); localStorage.setItem('theme', 'dark') }
    else { document.documentElement.classList.remove('dark'); localStorage.setItem('theme', 'light') }
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  const academyName = (() => {
    const en = (() => {
      const val = settings?.academy_name
      if (typeof val === 'string') return val
      return 'Muyarchi Academy'
    })()
    return pickLang(en, settings?.academy_name_ta || '', language)
  })()

  const logoUrl = (() => {
    const val = settings?.logo_url
    if (typeof val === 'string') return val
    return undefined
  })()

  return (
    <div className="flex min-h-screen flex-col">
      <header className={cn('fixed top-0 z-50 w-full transition-all duration-300', scrolled ? 'bg-background/95 backdrop-blur-md shadow-md border-b border-border' : 'bg-transparent')}>
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            {logoUrl ? (
              <img src={logoUrl} alt={academyName} className="h-9 w-9 rounded-lg object-cover" />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-display font-bold">{academyName.charAt(0)}</div>
            )}
            <span className="font-display text-lg font-bold text-foreground">{academyName}</span>
          </Link>
          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} className={cn('px-5 py-2.5 text-base font-bold rounded-lg transition-all duration-200 transform hover:scale-105', location.pathname === link.to ? 'bg-gradient-to-r from-primary via-secondary to-accent text-white shadow-lg' : 'text-foreground/80 hover:text-white hover:bg-gradient-to-r hover:from-primary/80 hover:to-secondary/80')}>{t(link.key)}</Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Suspense fallback={<LanguageSwitcherFallback />}>
              <LazyLanguageSwitcher />
            </Suspense>
            <Button variant="ghost" size="icon" onClick={toggleDark} aria-label="Toggle theme">{dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}</Button>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">{mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</Button>
          </div>
        </div>
        <AnimatePresence>
          {mobileOpen && (
            <motion.nav initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden overflow-hidden bg-background border-b border-border">
              <div className="container mx-auto flex flex-col gap-2 px-4 py-4">
                {navLinks.map((link) => (
                  <Link key={link.to} to={link.to} className={cn('px-4 py-3 text-base font-bold rounded-lg transition-all duration-200', location.pathname === link.to ? 'bg-gradient-to-r from-primary via-secondary to-accent text-white shadow-lg' : 'text-foreground/80 hover:text-white hover:bg-gradient-to-r hover:from-primary/80 hover:to-secondary/80')}>{t(link.key)}</Link>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
      <main className="flex-1 pt-16"><Outlet /></main>
      <PublicFooter />
    </div>
  )
}
