import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, BookOpen, FileText, Calendar, Star, Image, Settings, LogOut, Menu, X, GraduationCap, ExternalLink, Users, MessageSquare, PlayCircle, Languages, Home, Mail, LayoutTemplate } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { useSettings } from '@/hooks/use-settings'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/home', label: 'Home Page', icon: Home },
  { to: '/admin/courses', label: 'Courses', icon: BookOpen },
  { to: '/admin/blogs', label: 'Blogs', icon: FileText },
  { to: '/admin/events', label: 'Events', icon: Calendar },
  { to: '/admin/testimonials', label: 'Testimonials', icon: Star },
  { to: '/admin/media', label: 'Media Library', icon: Image },
  { to: '/admin/scholarship', label: 'Scholarship', icon: GraduationCap },
  { to: '/admin/contact', label: 'Contact Page', icon: Mail },
  { to: '/admin/site-content', label: 'Site Content', icon: LayoutTemplate },
  { to: '/admin/translations', label: 'UI Translations', icon: Languages },
  { to: '/admin/demo-registrations', label: 'Demo Registrations', icon: PlayCircle },
  { to: '/admin/enquiries', label: 'Enquiries', icon: MessageSquare },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminLayout() {
  const { user, signOut } = useAuth()
  const { settings } = useSettings()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleSignOut = async () => { await signOut(); navigate('/admin/login') }
  const academyName = settings?.academy_name || 'Muyarchi Academy'

  return (
    <div className="flex min-h-screen bg-muted/30">
      <aside className="hidden w-64 flex-col border-r border-border bg-card md:flex">
        <div className="flex h-16 items-center gap-2 border-b border-border px-6">
          {settings?.logo_url ? (
            <img src={settings.logo_url} alt={academyName} className="h-8 w-8 rounded-lg object-cover" />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"><GraduationCap className="h-5 w-5" /></div>
          )}
          <span className="font-display text-sm font-bold truncate">{academyName}</span>
        </div>
        <nav className="flex-1 space-y-2 overflow-y-auto p-4">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => cn('flex items-center gap-3 rounded-lg px-3 py-3 text-base font-bold transition-all duration-200 transform hover:scale-105', isActive ? 'bg-gradient-to-r from-primary via-secondary to-accent text-white shadow-lg' : 'text-muted-foreground hover:text-white hover:bg-gradient-to-r hover:from-primary/70 hover:to-secondary/70')}>
              <item.icon className="h-5 w-5" />{item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setSidebarOpen(false)} />
            <motion.aside initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'tween', duration: 0.2 }} className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card md:hidden">
              <div className="flex h-16 items-center justify-between border-b border-border px-6">
                <span className="font-display text-sm font-bold">{academyName}</span>
                <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}><X className="h-5 w-5" /></Button>
              </div>
              <nav className="flex-1 space-y-2 overflow-y-auto p-4">
                {navItems.map((item) => (
                  <NavLink key={item.to} to={item.to} end={item.end} onClick={() => setSidebarOpen(false)} className={({ isActive }) => cn('flex items-center gap-3 rounded-lg px-3 py-3 text-base font-bold transition-all duration-200', isActive ? 'bg-gradient-to-r from-primary via-secondary to-accent text-white shadow-lg' : 'text-muted-foreground hover:text-white hover:bg-gradient-to-r hover:from-primary/70 hover:to-secondary/70')}>
                    <item.icon className="h-5 w-5" />{item.label}
                  </NavLink>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
      <div className="flex-1">
        <header className="flex h-16 items-center gap-4 border-b border-border bg-background/95 px-4 backdrop-blur-md md:px-6">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(true)}><Menu className="h-5 w-5" /></Button>
          <h1 className="font-display text-lg font-semibold">Admin Panel</h1>
          <div className="ml-auto flex items-center gap-3">
            <Link to="/" target="_blank"><Button variant="outline" size="sm"><ExternalLink className="h-4 w-4" />View Site</Button></Link>
            <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">{user?.email?.charAt(0).toUpperCase() || 'A'}</div>
              <span className="truncate max-w-[150px]">{user?.email || 'Admin'}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut}><LogOut className="h-4 w-4" />Logout</Button>
          </div>
        </header>
        <main className="p-4 md:p-6"><Outlet /></main>
      </div>
    </div>
  )
}
