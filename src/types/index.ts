export interface Course {
  id: string
  title: string
  title_ta: string
  description: string
  description_ta: string
  duration: string
  duration_ta: string
  fees: string
  eligibility: string
  eligibility_ta: string
  thumbnail_url: string
  status: 'active' | 'inactive'
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Blog {
  id: string
  title: string
  title_ta: string
  description: string
  description_ta: string
  content: string
  content_ta: string
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
  title_ta: string
  description: string
  description_ta: string
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
  author_name_ta: string
  author_role: string
  author_role_ta: string
  content: string
  content_ta: string
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
  hero_title_ta: string
  hero_subtitle: string
  hero_subtitle_ta: string
  about: string
  about_ta: string
  vision: string
  vision_ta: string
  mission: string
  mission_ta: string
  mission_title: string
  mission_title_ta: string
  values_title: string
  values_title_ta: string
  values_text: string
  values_text_ta: string
  quality_title: string
  quality_title_ta: string
  quality_text: string
  quality_text_ta: string
  phone: string
  email: string
  address: string
  footer_text: string
  footer_text_ta: string
  google_map_url: string
  logo_url: string
  academy_name: string
  academy_name_ta: string
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
  hero_title_ta: string
  hero_description: string
  hero_description_ta: string
  how_it_works_title: string
  how_it_works_title_ta: string
  how_it_works_description: string
  how_it_works_description_ta: string
  card1_title: string
  card1_title_ta: string
  card1_text: string
  card1_text_ta: string
  card2_title: string
  card2_title_ta: string
  card2_text: string
  card2_text_ta: string
  card3_title: string
  card3_title_ta: string
  card3_text: string
  card3_text_ta: string
  test_details_title: string
  test_details_title_ta: string
  eligibility: string
  eligibility_ta: string
  duration: string
  duration_ta: string
  test_date: string
  test_date_ta: string
  venues: string
  venues_ta: string
  sample_paper_link: string
  updated_at: string
}

export interface UiTranslation {
  id: string
  key: string
  en: string
  ta: string
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
