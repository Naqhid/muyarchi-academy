# Muyarchi Academy Website Documentation

## Overview
The Muyarchi Academy website is a modern, responsive React application built with:
- **Frontend**: React, TypeScript, Vite
- **UI Library**: shadcn/ui, Tailwind CSS
- **Animations**: Framer Motion
- **Routing**: React Router DOM
- **State Management**: React Hooks (useState, useEffect)
- **Form Handling**: React Hook Form with Zod validation
- **Backend**: Supabase (implied by API structure)

---

## Public Pages
All public pages use a consistent `PublicLayout` wrapper that includes:
- Header with logo, navigation links, language switcher, dark mode toggle, and mobile menu
- Footer with contact info and social links

### 1. Home Page
**File**: `src/pages/public/Home.tsx`  
**Route**: `/`

#### Key Features:
- **Hero Section**: Displays academy name, subtitle, and CTA buttons for scholarship test and free demo
- **About Section**: Includes vision statement, about text, and mission/values/quality cards
- **Courses Grid**: Shows active courses with thumbnail, title, description, and duration
- **Events Preview**: Displays upcoming/past events with cover image
- **Blogs Preview**: Shows latest blog posts
- **CTA Section**: Encourages users to view courses or contact the academy

---

### 2. Courses Page
**File**: `src/pages/public/Courses.tsx`  
**Route**: `/courses`

#### Key Features:
- Hero section introducing courses
- Grid of all active courses, each showing:
  - Thumbnail image
  - Title
  - Description
  - Duration
  - Status badge (active/inactive)
- Skeleton loaders while fetching data
- Clicking a course navigates to Course Detail page

---

### 3. Course Detail Page
**File**: `src/pages/public/CourseDetail.tsx`  
**Route**: `/courses/:id`

#### Key Features:
- Hero with course title and status
- Detailed course information:
  - Full description
  - Duration
  - Fees
  - Eligibility criteria
- Course highlights
- CTA button to contact academy for enrollment
- Error state if course not found
- Back button to courses list

---

### 4. Scholarship Page
**File**: `src/pages/public/Scholarship.tsx`  
**Route**: `/scholarship`

#### Key Features:
- Hero section introducing the scholarship program
- "How It Works" section with 3 informative cards
- Test details:
  - Eligibility
  - Duration
  - Test date
  - Venues
  - Sample paper link
- Registration form with:
  - Student name
  - Class
  - School
  - Parent name
  - Parent phone
  - Town/village
- Zod schema validation
- Toast notifications on submission success/error

---

### 5. Free Demo Page
**File**: `src/pages/public/FreeDemo.tsx`  
**Route**: `/free-demo`

#### Key Features:
- Hero for free demo class
- Registration form with:
  - Student name
  - Class
  - Phone
  - Preferred time
  - Optional message
- Zod validation
- Toast notifications on submission

---

### 6. Blog Page
**File**: `src/pages/public/Blog.tsx`  
**Route**: `/blog`

#### Key Features:
- Hero introducing the blog
- Grid of published blog posts, each showing:
  - Thumbnail
  - Title
  - Description
  - Author name
  - Publication date
- Skeleton loaders while fetching
- Clicking a post navigates to Blog Detail page

---

### 7. Blog Detail Page
**File**: `src/pages/public/BlogDetail.tsx`  
**Route**: `/blog/:id`

#### Key Features:
- Hero with blog title, author, and publication date
- Full blog content (HTML-rendered)
- Back button to blog list
- Error state if post not found

---

### 8. Events & Gallery Page
**File**: `src/pages/public/Events.tsx`  
**Route**: `/events`

#### Key Features:
- Hero for events and gallery
- List of events with:
  - Cover image
  - Title
  - Description
  - Event date
  - Gallery stats (number of images/videos)
- Image gallery:
  - Grid of thumbnail images
  - Clicking opens a modal with full-size image
- Video gallery:
  - Links to video content
  - Play button indicator
- Framer Motion animations

---

### 9. Event Detail Page
**File**: `src/pages/public/EventDetail.tsx`  
**Route**: `/events/:id`

#### Key Features:
- Hero with event title and date
- Event details section:
  - Full description
  - Event date
  - Venue (if available)
- Image gallery grid
- Video gallery with embedded iframes
- CTA to contact academy for more info
- Back button to events list
- Error state if event not found

---

### 10. Contact Page
**File**: `src/pages/public/Contact.tsx`  
**Route**: `/contact`

#### Key Features:
- Hero introducing contact section
- Contact info cards:
  - Phone
  - Email
  - Address
  - WhatsApp
- Google Map embed
- Enquiry form with:
  - Name
  - Phone
  - Class/Course
  - Message
- Zod validation
- Toast notifications on submission

---

## Admin Pages
All admin pages (except login) are wrapped in `AdminLayout` and protected by `ProtectedRoute` requiring authentication.

### 11. Admin Login Page
**File**: `src/pages/admin/Login.tsx`  
**Route**: `/admin/login`

#### Key Features:
- Login form with email and password fields
- "Remember Me" checkbox
- Link back to public website
- Toast notifications for login success/error

---

### 12. Admin Dashboard Page
**File**: `src/pages/admin/Dashboard.tsx`  
**Route**: `/admin`

#### Key Features:
- Stats grid showing counts for:
  - Courses
  - Blogs
  - Events
  - Testimonials
  - Media items
  - Scholarship registrations
  - Demo registrations
  - Enquiries
- Quick action buttons to add new content or update settings

---

### 13. Admin Courses Page
**File**: `src/pages/admin/Courses.tsx`  
**Route**: `/admin/courses`

#### Key Features:
- Grid of courses showing thumbnail, title, status, description, and duration
- Modal to **Create** new course:
  - Title
  - Description
  - Duration
  - Fees
  - Eligibility
  - Thumbnail URL
  - Status (active/inactive)
  - Sort order
- Modal to **Edit** existing course
- Delete confirmation modal
- Skeleton loaders while fetching data

---

### 14. Admin Blogs Page
**File**: `src/pages/admin/Blogs.tsx`  
**Route**: `/admin/blogs`

#### Key Features:
- Grid of blog posts showing thumbnail, title, published status, description, author, and date
- Modal to **Create** new post:
  - Title
  - Description
  - Content (HTML supported)
  - Author
  - Thumbnail URL
  - Published status
  - Published date
- Modal to **Edit** existing post
- Delete confirmation modal

---

### 15. Admin Events Page
**File**: `src/pages/admin/Events.tsx`  
**Route**: `/admin/events`

#### Key Features:
- Grid of events showing cover image, title, description, date, and gallery stats
- Modal to **Create** new event:
  - Title
  - Description
  - Event date
  - Cover image URL
  - Image gallery URLs (multiple)
  - Video gallery URLs (multiple)
- Modal to **Edit** existing event
- Delete confirmation modal

---

### 16. Admin Testimonials Page
**File**: `src/pages/admin/Testimonials.tsx`  
**Route**: `/admin/testimonials`

#### Key Features:
- Grid of testimonials showing avatar, author name/role, rating, and content
- Modal to **Create** new testimonial:
  - Author name
  - Role
  - Content
  - Rating (1-5)
  - Avatar URL
  - Sort order
- Modal to **Edit** existing testimonial
- Delete confirmation modal

---

### 17. Admin Media Library Page
**File**: `src/pages/admin/Media.tsx`  
**Route**: `/admin/media`

#### Key Features:
- Filterable media library by type:
  - All
  - Image
  - Video
  - Audio
  - Document
  - Folder
- Grid of media items with preview, name, type, and URL
- Modal to **Create** new media:
  - Name
  - Type
  - URL
  - Thumbnail URL
- Modal to **Edit** existing media
- "Copy URL" button with toast notification
- Delete confirmation modal

---

### 18. Admin Scholarship Page
**File**: `src/pages/admin/Scholarship.tsx`  
**Route**: `/admin/scholarship`

#### Key Features:
- Tabbed interface for two sections:

#### Section 1: Scholarship Settings
- Hero section content (title, description)
- "How It Works" section:
  - Title, description
  - 3 configurable cards
- Test details:
  - Title
  - Eligibility
  - Duration
  - Test date
  - Venues
  - Sample paper link

#### Section 2: Scholarship Registrations
- List of registrations with:
  - Student name
  - Class
  - School
  - Parent name
  - Parent phone
  - Town/village
- Delete functionality

---

### 19. Admin Demo Registrations Page
**File**: `src/pages/admin/DemoRegistrations.tsx`  
**Route**: `/admin/demo-registrations`

#### Key Features:
- List of demo class registrations showing:
  - Student name
  - Class
  - Phone
  - Preferred time
  - Message
- Total registration count display
- Delete confirmation modal for each registration

---

### 20. Admin Enquiries Page
**File**: `src/pages/admin/Enquiries.tsx`  
**Route**: `/admin/enquiries`

#### Key Features:
- List of contact form enquiries showing:
  - Name
  - Phone
  - Class/Course
  - Message
- Total enquiry count display
- Delete confirmation modal for each enquiry

---

### 21. Admin Settings Page
**File**: `src/pages/admin/Settings.tsx`  
**Route**: `/admin/settings`

#### Key Features:
- **General Settings**: Academy name, logo URL
- **Hero Section**: Hero title, hero subtitle
- **About Section**: About text, vision, mission
- **Contact Info**: Phone, email, address
- **Footer Text**: Custom footer content
- **Stats**: Number of students, courses, years
- **Google Map**: Embed URL
- **Social Links**: Facebook, Twitter, Instagram, YouTube, LinkedIn
- Save button with toast notification on success

---

## Shared Components & Features

### Language Switcher
**File**: `src/components/LanguageSwitcher.tsx`
- Globe icon with current language code (EN/TA/UR)
- Dropdown menu to switch languages
- Uses Google Translate for localization
- Loading spinner when switching languages
- Requires internet connection for Tamil/Urdu translations

### Dark Mode Toggle
- Available in PublicLayout header
- Saves theme preference to localStorage
- Persists across sessions

### Google Translate Integration
- Supports English (default), Tamil, and Urdu
- Lazy loads Google Translate script
- Sets language cookie
- Reloads page to apply translations

### Toast Notifications
- Used for form submissions, errors, and success messages
- Styled with shadcn/ui toast component

---

## Project Structure Summary
```
src/
├── components/         # Reusable UI components (shared, ui, etc.)
├── layouts/            # PublicLayout, AdminLayout
├── lib/                # API functions, utilities, Google Translate loader
├── pages/
│   ├── admin/          # Admin dashboard pages
│   └── public/         # Public website pages
├── hooks/              # Custom hooks (useSettings, etc.)
├── types/              # TypeScript interfaces and types
└── App.tsx, main.tsx   # Root component and entry point
```
