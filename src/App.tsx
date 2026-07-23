import { Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Toaster } from '@/components/ui/toaster'
import { Skeleton } from '@/components/ui/skeleton'

const PublicLayout = lazy(() => import('@/layouts/PublicLayout'))
const Home = lazy(() => import('@/pages/public/Home'))
const Courses = lazy(() => import('@/pages/public/Courses'))
const CourseDetail = lazy(() => import('@/pages/public/CourseDetail'))
const Scholarship = lazy(() => import('@/pages/public/Scholarship'))
const FreeDemo = lazy(() => import('@/pages/public/FreeDemo'))
const Blog = lazy(() => import('@/pages/public/Blog'))
const BlogDetail = lazy(() => import('@/pages/public/BlogDetail'))
const Events = lazy(() => import('@/pages/public/Events'))
const EventDetail = lazy(() => import('@/pages/public/EventDetail'))
const Contact = lazy(() => import('@/pages/public/Contact'))

const AdminLayout = lazy(() => import('@/layouts/AdminLayout'))
const Login = lazy(() => import('@/pages/admin/Login'))
const Dashboard = lazy(() => import('@/pages/admin/Dashboard'))
const AdminCourses = lazy(() => import('@/pages/admin/Courses'))
const AdminBlogs = lazy(() => import('@/pages/admin/Blogs'))
const AdminEvents = lazy(() => import('@/pages/admin/Events'))
const AdminTestimonials = lazy(() => import('@/pages/admin/Testimonials'))
const AdminMedia = lazy(() => import('@/pages/admin/Media'))
const AdminScholarship = lazy(() => import('@/pages/admin/Scholarship'))
const AdminEnquiries = lazy(() => import('@/pages/admin/Enquiries'))
const AdminDemoRegistrations = lazy(() => import('@/pages/admin/DemoRegistrations'))
const AdminSettings = lazy(() => import('@/pages/admin/Settings'))
const AdminTranslations = lazy(() => import('@/pages/admin/Translations'))

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
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/scholarship" element={<Scholarship />} />
            <Route path="/free-demo" element={<FreeDemo />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/events" element={<Events />} />
            <Route path="/contact" element={<Contact />} />
          </Route>
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="blogs" element={<AdminBlogs />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="media" element={<AdminMedia />} />
            <Route path="scholarship" element={<AdminScholarship />} />
            <Route path="demo-registrations" element={<AdminDemoRegistrations />} />
            <Route path="enquiries" element={<AdminEnquiries />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="translations" element={<AdminTranslations />} />
          </Route>
        </Routes>
      </Suspense>
      <Toaster />
    </>
  )
}
