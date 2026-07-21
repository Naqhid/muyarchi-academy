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
  cover_image_url?: string
  image_gallery_urls?: string[]
  video_gallery_urls?: string[]
  venues?: string
  image_url?: string
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

export interface Scholarship {
  id: number
  hero_title: string
  hero_description: string
  how_it_works_title: string
  how_it_works_description: string
  card1_title: string
  card1_text: string
  card2_title: string
  card2_text: string
  card3_title: string
  card3_text: string
  test_details_title: string
  eligibility: string
  duration: string
  test_date: string
  venues: string
  sample_paper_link: string
  updated_at: string
}

export interface ScholarshipRegistration {
  id: string
  student_name: string
  class: string
  school: string
  parent_name: string
  parent_phone: string
  town_village: string
  created_at: string
}

export interface Enquiry {
  id: string
  name: string
  phone: string
  class_course: string
  message: string
  created_at: string
}

export interface DemoRegistration {
  id: string
  student_name: string
  class: string
  phone: string
  preferred_time: string
  message: string
  created_at: string
}

export type CourseInput = Omit<Course, 'id' | 'created_at' | 'updated_at'>
export type BlogInput = Omit<Blog, 'id' | 'created_at' | 'updated_at'>
export type EventInput = Omit<EventItem, 'id' | 'created_at' | 'updated_at'>
export type TestimonialInput = Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>
export type MediaInput = Omit<MediaItem, 'id' | 'created_at' | 'updated_at'>
export type SiteSettingsInput = Omit<SiteSettings, 'id' | 'updated_at'>
export type ScholarshipInput = Omit<Scholarship, 'id' | 'updated_at'>
export type ScholarshipRegistrationInput = Omit<ScholarshipRegistration, 'id' | 'created_at'>
export type EnquiryInput = Omit<Enquiry, 'id' | 'created_at'>
export type DemoRegistrationInput = Omit<DemoRegistration, 'id' | 'created_at'>
