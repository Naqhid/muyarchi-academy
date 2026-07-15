import { Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Toaster } from '@/components/ui/toaster'
import { Skeleton } from '@/components/ui/skeleton'

const PublicLayout = lazy(() => import('@/layouts/PublicLayout'))
const Home = lazy(() => import('@/pages/public/Home'))
const Courses = lazy(() => import('@/pages/public/Courses'))
const Blog = lazy(() => import('@/pages/public/Blog'))
const Events = lazy(() => import('@/pages/public/Events'))
const Contact = lazy(() => import('@/pages/public/Contact'))

const AdminLayout = lazy(() => import('@/layouts/AdminLayout'))
const Login = lazy(() => import('@/pages/admin/Login'))
const ForgotPassword = lazy(() => import('@/pages/admin/ForgotPassword'))
const Dashboard = lazy(() => import('@/pages/admin/Dashboard'))
const AdminCourses = lazy(() => import('@/pages/admin/Courses'))
const AdminBlogs = lazy(() => import('@/pages/admin/Blogs'))
const AdminEvents = lazy(() => import('@/pages/admin/Events'))
const AdminTestimonials = lazy(() => import('@/pages/admin/Testimonials'))
const AdminMedia = lazy(() => import('@/pages/admin/Media'))
const AdminSettings = lazy(() => import('@/pages/admin/Settings'))

function PageLoader() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Skeleton className="h-8 w-8 rounded-full" />
    </div>
  )
}

export default function App() {
  return (
    <>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/events" element={<Events />} />
            <Route path="/contact" element={<Contact />} />
          </Route>
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/forgot-password" element={<ForgotPassword />} />
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="blogs" element={<AdminBlogs />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="media" element={<AdminMedia />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </Suspense>
      <Toaster />
    </>
  )
}
