import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, User, Calendar } from 'lucide-react'
import { Section, SectionHeader, FadeIn } from '@/components/shared/Section'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { fetchPublishedBlogs } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import { useLanguage, pickLang } from '@/hooks/use-language'
import type { Blog } from '@/types'

export default function Blog() {
  const { t, language } = useLanguage()
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPublishedBlogs().then((data) => setBlogs(data)).catch((err) => console.error(err)).finally(() => setLoading(false))
  }, [])

  return (
    <>
      <section className="relative flex min-h-[55vh] items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-primary">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#3b82f630,transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,#06b6d430,transparent_40%)]" />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.05]" />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="container relative mx-auto px-4 text-center">
          <Badge className="mb-6 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-white backdrop-blur">
            <BookOpen className="mr-2 h-4 w-4" /> {t('nav.blog', 'Academy Blog')}
          </Badge>
          <h1 className="mx-auto max-w-4xl font-display text-5xl font-extrabold leading-tight tracking-tight text-white md:text-7xl">
            Insights & <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">{t('blog.title', 'Success Stories')}</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
            {t('blog.title', 'Stay updated with the latest educational insights, examination tips, academy news, and inspiring success stories.')}
          </p>
        </motion.div>
      </section>

      <Section>
        <SectionHeader title={t('blog.title', 'Latest Posts')} subtitle={t('blog.title', 'Read our latest articles and updates')} />
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-80 rounded-lg" />)}</div>
        ) : blogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground"><BookOpen className="mb-3 h-12 w-12 opacity-40" /><p>{t('blog.noArticles', 'No blog posts yet')}</p></div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog, i) => (
              <FadeIn key={blog.id} delay={i * 0.05}>
                <Link to={`/blog/${blog.id}`}>
                  <Card className="group h-full overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer">
                    <div className="aspect-video overflow-hidden bg-muted">
                      {blog.thumbnail_url ? <img src={blog.thumbnail_url} alt={blog.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" /> : <div className="flex h-full items-center justify-center bg-accent" />}
                    </div>
                    <CardContent className="p-5">
                      <h3 className="font-display text-lg font-semibold">{pickLang(blog.title, blog.title_ta, language)}</h3>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{pickLang(blog.description, blog.description_ta, language)}</p>
                      <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" />{blog.author}</span>
                        <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{formatDate(blog.published_at || blog.created_at)}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </FadeIn>
            ))}
          </div>
        )}
      </Section>
    </>
  )
}
