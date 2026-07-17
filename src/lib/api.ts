import { supabase } from '@/lib/supabase'
import type {
  Course, Blog, EventItem, Testimonial, MediaItem, SiteSettings,
  CourseInput, BlogInput, EventInput, TestimonialInput, MediaInput, SiteSettingsInput,
} from '@/types'

// === Courses ===
export async function fetchCourses() {
  const { data, error } = await supabase.from('courses').select('*').order('sort_order', { ascending: true })
  if (error) throw error
  return data as Course[]
}
export async function fetchActiveCourses() {
  const { data, error } = await supabase.from('courses').select('*').eq('status', 'active').order('sort_order', { ascending: true })
  if (error) throw error
  return data as Course[]
}
export async function createCourse(input: CourseInput) {
  const { data, error } = await supabase.from('courses').insert(input).select().single()
  if (error) throw error
  return data as Course
}
export async function updateCourse(id: string, input: Partial<CourseInput>) {
  const { data, error } = await supabase.from('courses').update(input).eq('id', id).select().single()
  if (error) throw error
  return data as Course
}
export async function deleteCourse(id: string) {
  const { error } = await supabase.from('courses').delete().eq('id', id)
  if (error) throw error
}

// === Blogs ===
export async function fetchBlogs() {
  const { data, error } = await supabase.from('blogs').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data as Blog[]
}
export async function fetchPublishedBlogs() {
  const { data, error } = await supabase.from('blogs').select('*').eq('published', true).order('published_at', { ascending: false })
  if (error) throw error
  return data as Blog[]
}
export async function createBlog(input: BlogInput) {
  const { data, error } = await supabase.from('blogs').insert(input).select().single()
  if (error) throw error
  return data as Blog
}
export async function updateBlog(id: string, input: Partial<BlogInput>) {
  const { data, error } = await supabase.from('blogs').update(input).eq('id', id).select().single()
  if (error) throw error
  return data as Blog
}
export async function deleteBlog(id: string) {
  const { error } = await supabase.from('blogs').delete().eq('id', id)
  if (error) throw error
}
export async function fetchBlogById(id: string) {
  const { data, error } = await supabase.from('blogs').select('*').eq('id', id).single()
  if (error) throw error
  return data as Blog
}

// === Events ===
export async function fetchEvents() {
  const { data, error } = await supabase.from('events').select('*').order('event_date', { ascending: false })
  if (error) throw error
  return data as EventItem[]
}
export async function createEvent(input: EventInput) {
  const { data, error } = await supabase.from('events').insert(input).select().single()
  if (error) throw error
  return data as EventItem
}
export async function updateEvent(id: string, input: Partial<EventInput>) {
  const { data, error } = await supabase.from('events').update(input).eq('id', id).select().single()
  if (error) throw error
  return data as EventItem
}
export async function deleteEvent(id: string) {
  const { error } = await supabase.from('events').delete().eq('id', id)
  if (error) throw error
}

// === Testimonials ===
export async function fetchTestimonials() {
  const { data, error } = await supabase.from('testimonials').select('*').order('sort_order', { ascending: true })
  if (error) throw error
  return data as Testimonial[]
}
export async function createTestimonial(input: TestimonialInput) {
  const { data, error } = await supabase.from('testimonials').insert(input).select().single()
  if (error) throw error
  return data as Testimonial
}
export async function updateTestimonial(id: string, input: Partial<TestimonialInput>) {
  const { data, error } = await supabase.from('testimonials').update(input).eq('id', id).select().single()
  if (error) throw error
  return data as Testimonial
}
export async function deleteTestimonial(id: string) {
  const { error } = await supabase.from('testimonials').delete().eq('id', id)
  if (error) throw error
}

// === Media Library ===
export async function fetchMedia() {
  const { data, error } = await supabase.from('media_library').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data as MediaItem[]
}
export async function createMedia(input: MediaInput) {
  const { data, error } = await supabase.from('media_library').insert(input).select().single()
  if (error) throw error
  return data as MediaItem
}
export async function updateMedia(id: string, input: Partial<MediaInput>) {
  const { data, error } = await supabase.from('media_library').update(input).eq('id', id).select().single()
  if (error) throw error
  return data as MediaItem
}
export async function deleteMedia(id: string) {
  const { error } = await supabase.from('media_library').delete().eq('id', id)
  if (error) throw error
}

// === Site Settings ===
export async function fetchSettings() {
  const { data, error } = await supabase.from('site_settings').select('*').eq('id', 1).maybeSingle()
  if (error) throw error
  return data as SiteSettings | null
}
export async function updateSettings(input: Partial<SiteSettingsInput>) {
  const { data, error } = await supabase.from('site_settings').update(input).eq('id', 1).select().single()
  if (error) throw error
  return data as SiteSettings
}
