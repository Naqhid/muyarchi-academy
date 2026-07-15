import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, BookOpen, FileText, Calendar, Star, Image, Settings, LogOut, Menu, X, GraduationCap, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { useSettings } from '@/hooks/use-settings'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/courses', label: 'Courses', icon: BookOpen },
  { to: '/admin/blogs', label: 'Blogs', icon: FileText },
  { to: '/admin/events', label: 'Events', icon: Calendar },
  { to: '/admin/testimonials', label: 'Testimonials', icon: Star },
  { to: '/admin/media', label: 'Media Library', icon: Image },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminLayout() {
  const { user, signOut } = useAuth()
  const { settings } = useSettings()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleSignOut = async () => { await signOut(); navigate('/admin/login') }
  const academyName = settings?.academy_name || 'Muyirchi Academy'

  return (
    <div className="flex min-h-screen bg-muted/30">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border bg-card md:flex">
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
        <div className="border-t border-border p-4 space-y-2">
          <Link to="/" target="_blank" className="flex items-center gap-2 rounded-md px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <ExternalLink className="h-3.5 w-3.5" />View Website
          </Link>
          <div className="flex items-center gap-2 rounded-md px-3 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">{user?.email?.charAt(0).toUpperCase() || 'A'}</div>
            <div className="flex-1 truncate"><p className="text-xs font-medium truncate">{user?.email || 'Admin'}</p></div>
          </div>
          <Button variant="outline" size="sm" className="w-full" onClick={handleSignOut}><LogOut className="h-4 w-4" />Logout</Button>
        </div>
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
              <div className="border-t border-border p-4"><Button variant="outline" size="sm" className="w-full" onClick={handleSignOut}><LogOut className="h-4 w-4" />Logout</Button></div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
      <div className="flex-1 md:ml-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/95 px-4 backdrop-blur-md md:px-6">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(true)}><Menu className="h-5 w-5" /></Button>
          <h1 className="font-display text-lg font-semibold">Admin Panel</h1>
          <div className="ml-auto">
            <Link to="/" target="_blank"><Button variant="outline" size="sm"><ExternalLink className="h-4 w-4" />View Site</Button></Link>
          </div>
        </header>
        <main className="p-4 md:p-6"><Outlet /></main>
      </div>
    </div>
  )
}
