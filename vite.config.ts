import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

const defaults = { title: 'Muyarchi Academy — Coaching Institute, Vaniyambadi', description: 'City-standard coaching in Vaniyambadi at fees families can afford.', keywords: 'Muyarchi Academy, coaching institute, Vaniyambadi', image: '' }

function staticSeoPlugin(env: Record<string, string>): Plugin {
  return { name: 'static-supabase-seo', apply: 'build', async transformIndexHtml(html) {
    let seo = { ...defaults }
    if (env.VITE_SUPABASE_URL && env.VITE_SUPABASE_ANON_KEY) try {
      const response = await fetch(`${env.VITE_SUPABASE_URL}/rest/v1/ui_translations?key=in.(seo.title,seo.description,seo.keywords,seo.ogImage)&select=key,en`, { headers: { apikey: env.VITE_SUPABASE_ANON_KEY, Authorization: `Bearer ${env.VITE_SUPABASE_ANON_KEY}` } })
      if (response.ok) for (const row of await response.json() as Array<{ key: string; en: string }>) {
        if (row.key === 'seo.title' && row.en) seo.title = row.en
        if (row.key === 'seo.description' && row.en) seo.description = row.en
        if (row.key === 'seo.keywords' && row.en) seo.keywords = row.en
        if (row.key === 'seo.ogImage' && row.en) seo.image = row.en
      }
    } catch { /* Keep safe defaults if Supabase is unavailable during a build. */ }
    return html.replaceAll('__SEO_TITLE__', seo.title).replaceAll('__SEO_DESCRIPTION__', seo.description).replaceAll('__SEO_KEYWORDS__', seo.keywords).replaceAll('__SEO_IMAGE__', seo.image)
  } }
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // GitHub Pages serves this project from https://naqhid.github.io/muyarchi-academy/
  // rather than the domain root. This prefixes all built asset URLs correctly.
  base: '/muyarchi-academy/',
  plugins: [react(), staticSeoPlugin(loadEnv(mode, process.cwd(), ''))],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
}));
