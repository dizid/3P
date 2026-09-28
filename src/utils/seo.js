/**
 * Per-route SEO: keeps <title>, description, canonical, robots and social tags
 * in sync with the current route. Content comes from seo-pages.json, which is
 * also used at build time by scripts/prerender.mjs (single source of truth).
 */
import seo from '@/data/seo-pages.json'

const { site, pages, noindex } = seo
const pagesByPath = new Map(pages.map((page) => [page.path, page]))

// Find an existing <meta>/<link> by selector, or create it in <head>
const upsertTag = (tagName, selector, attrs) => {
  let element = document.head.querySelector(selector)
  if (!element) {
    element = document.createElement(tagName)
    document.head.appendChild(element)
  }
  Object.entries(attrs).forEach(([key, value]) => element.setAttribute(key, value))
}

const setMetaName = (name, content) => upsertTag('meta', `meta[name="${name}"]`, { name, content })
const setMetaProperty = (property, content) => upsertTag('meta', `meta[property="${property}"]`, { property, content })

const isNoindexPath = (path) => noindex.some((prefix) => path === prefix || path.startsWith(`${prefix}/`))

/**
 * Apply SEO tags for a route path. Unknown public paths fall back to the home page copy.
 * @param {string} path - route path without query/hash
 */
export const applySeo = (path) => {
  const normalizedPath = path.length > 1 ? path.replace(/\/+$/, '') : path
  const knownPage = pagesByPath.get(normalizedPath)
  const page = knownPage || pagesByPath.get('/')
  const canonicalUrl = `${site.url}${page.path === '/' ? '/' : page.path}`
  // App-only pages (history, shared links, auth) and unknown paths stay out of the index
  const shouldIndex = Boolean(knownPage) && !isNoindexPath(normalizedPath)

  document.title = page.title
  setMetaName('description', page.description)
  setMetaName('robots', shouldIndex ? 'index, follow, max-image-preview:large' : 'noindex, follow')
  upsertTag('link', 'link[rel="canonical"]', { rel: 'canonical', href: canonicalUrl })

  setMetaProperty('og:url', canonicalUrl)
  setMetaProperty('og:title', page.title)
  setMetaProperty('og:description', page.description)
  setMetaName('twitter:title', page.title)
  setMetaName('twitter:description', page.description)
}
