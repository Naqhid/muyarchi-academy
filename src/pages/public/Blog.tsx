import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, User, Calendar } from 'lucide-react'
import { Section, SectionHeader, FadeIn } from '@/components/shared/Section'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { fetchPublishedBlogs } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import type { Blog } from '@/types'

export default function Blog() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPublishedBlogs().then((data) => setBlogs(data)).catch((err) => console.error(err)).finally(() => setLoading(false))
  }, [])

  return (
    <>
      <section className="relative flex min-h-[40vh] items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="container relative mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-4"><BookOpen className="mr-1.5 h-4 w-4" />Blog</Badge>
          <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">Our Blog</h1>
          <p className="mt-4 text-lg text-muted-foreground">Insights, stories, and updates from our academy</p>
        </motion.div>
      </section>
      <Section>
        <SectionHeader title="Latest Posts" subtitle="Read our latest articles and updates" />
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-80 rounded-lg" />)}</div>
        ) : blogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground"><BookOpen className="mb-3 h-12 w-12 opacity-40" /><p>No blog posts yet</p></div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog, i) => (
              <FadeIn key={blog.id} delay={i * 0.05}>
                <Card className="group h-full overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
                  <div className="aspect-video overflow-hidden bg-muted">
                    {blog.thumbnail_url ? <img src={blog.thumbnail_url} alt={blog.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" loading="lazy" /> : <div className="flex h-full items-center justify-center"><BookOpen className="h-12 w-12 text-muted-foreground/40" /></div>}
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-display text-lg font-semibold">{blog.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{blog.description}</p>
                    <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" />{blog.author}</span>
                      <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{formatDate(blog.published_at || blog.created_at)}</span>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        )}
      </Section>
    </>
  )
}
