export interface Course {
  id: string
  title: string
  description: string
  duration: string
  fees: string
  eligibility: string
  thumbnail_url: string
  status: 'active' | 'inactive'
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Blog {
  id: string
  title: string
  description: string
  content: string
  author: string
  thumbnail_url: string
  published: boolean
  published_at: string
  created_at: string
  updated_at: string
}

export interface EventItem {
  id: string
  title: string
  description: string
  event_date: string | null
  cover_image_url: string
  image_gallery_urls: string[]
  video_gallery_urls: string[]
  created_at: string
  updated_at: string
}

export interface Testimonial {
  id: string
  author_name: string
  author_role: string
  content: string
  rating: number
  avatar_url: string
  sort_order: number
  created_at: string
  updated_at: string
}

export type MediaType = 'image' | 'video' | 'audio' | 'document' | 'folder'

export interface MediaItem {
  id: string
  name: string
  type: MediaType
  url: string
  thumbnail_url: string
  created_at: string
  updated_at: string
}

export interface SiteSettings {
  id: number
  hero_title: string
  hero_subtitle: string
  about: string
  vision: string
  mission: string
  phone: string
  email: string
  address: string
  footer_text: string
  google_map_url: string
  logo_url: string
  academy_name: string
  facebook_url: string
  twitter_url: string
  instagram_url: string
  youtube_url: string
  linkedin_url: string
  stat_students: string
  stat_courses: string
  stat_years: string
  updated_at: string
}

export type CourseInput = Omit<Course, 'id' | 'created_at' | 'updated_at'>
export type BlogInput = Omit<Blog, 'id' | 'created_at' | 'updated_at'>
export type EventInput = Omit<EventItem, 'id' | 'created_at' | 'updated_at'>
export type TestimonialInput = Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>
export type MediaInput = Omit<MediaItem, 'id' | 'created_at' | 'updated_at'>
export type SiteSettingsInput = Omit<SiteSettings, 'id' | 'updated_at'>
