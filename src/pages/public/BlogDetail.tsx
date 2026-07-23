import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, User, Calendar, BookOpen } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { fetchBlogById } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import { useLanguage, pickLang } from '@/hooks/use-language'
import type { Blog } from '@/types'

export default function BlogDetail() {
  const { id } = useParams<{ id: string }>()
  const { t, language } = useLanguage()
  const [blog, setBlog] = useState<Blog | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    fetchBlogById(id).then((data) => setBlog(data)).catch((err) => { console.error('Error fetching blog:', err); setError('Failed to load blog post') }).finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (<div className="container mx-auto px-4 py-12"><div className="mx-auto max-w-4xl"><Skeleton className="mb-6 h-8 w-32" /><Skeleton className="mb-4 h-12 w-3/4" /><Skeleton className="mb-8 h-6 w-1/2" /><Skeleton className="mb-4 h-96 w-full" /><Skeleton className="h-6 w-full" /><Skeleton className="mt-2 h-6 w-full" /><Skeleton className="mt-2 h-6 w-3/4" /></div></div>)
  }

  if (error || !blog) {
    return (<div className="container mx-auto px-4 py-12"><div className="mx-auto max-w-4xl text-center"><BookOpen className="mx-auto mb-4 h-16 w-16 text-muted-foreground opacity-40" /><h2 className="mb-2 text-2xl font-semibold">Blog Not Found</h2><p className="mb-6 text-muted-foreground">{error || 'The blog post you are looking for does not exist.'}</p><Button asChild variant="outline"><Link to="/blog">{t('blogDetail.back', 'Back to Blogs')}</Link></Button></div></div>)
  }

  const title = pickLang(blog.title, blog.title_ta, language)
  const description = pickLang(blog.description, blog.description_ta, language)
  const content = pickLang(blog.content, blog.content_ta, language)

  return (
    <>
      <section className="relative flex min-h-[40vh] items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-primary">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#3b82f630,transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,#06b6d430,transparent_40%)]" />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.05]" />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="container relative mx-auto px-4 text-center">
          <Badge className="mb-6 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-white backdrop-blur">
            <BookOpen className="mr-2 h-4 w-4" /> {t('nav.blog', 'Blog Post')}
          </Badge>
          <h1 className="mx-auto max-w-4xl font-display text-4xl font-extrabold leading-tight tracking-tight text-white md:text-6xl">{title}</h1>
          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-slate-300">
            <span className="flex items-center gap-2"><User className="h-4 w-4" />{blog.author}</span>
            <span className="flex items-center gap-2"><Calendar className="h-4 w-4" />{formatDate(blog.published_at || blog.created_at)}</span>
          </div>
        </motion.div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <Button asChild variant="ghost" className="mb-8 gap-2"><Link to="/blog"><ArrowLeft className="h-4 w-4" />{t('blogDetail.back', 'Back to Blogs')}</Link></Button>
          {blog.thumbnail_url && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8 overflow-hidden rounded-xl">
              <img src={blog.thumbnail_url} alt={title} className="h-auto w-full object-cover" />
            </motion.div>
          )}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <Card className="border-0 shadow-none"><CardContent className="p-0">
              {description && <p className="mb-6 text-xl font-medium leading-relaxed text-muted-foreground">{description}</p>}
              <div className="prose prose-slate max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: content }} />
            </CardContent></Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="mt-12 flex items-center justify-between border-t pt-8">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-2"><User className="h-4 w-4" />{t('blogDetail.by', 'By')} {blog.author}</span>
              <span className="flex items-center gap-2"><Calendar className="h-4 w-4" />{formatDate(blog.published_at || blog.created_at)}</span>
            </div>
            <Button asChild variant="outline" className="gap-2"><Link to="/blog"><ArrowLeft className="h-4 w-4" />{t('blogDetail.back', 'Back to Blogs')}</Link></Button>
          </motion.div>
        </div>
      </section>
    </>
  )
}
