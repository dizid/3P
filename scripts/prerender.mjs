/**
 * Post-build SEO prerender (no dependencies, no headless browser).
 *
 * For every public page in src/data/seo-pages.json this writes a static HTML file
 * with page-specific <head> tags, JSON-LD, and readable content inside #app.
 * Vue replaces that content on mount, so users see the normal app, while crawlers
 * that don't run JavaScript (most AI/GEO crawlers) still get real content.
 *
 * Also generates: dist/app-shell.html (noindex SPA fallback), sitemap.xml, llms.txt.
 * Run after `vite build` (see package.json "build").
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..')
const distDir = join(rootDir, 'dist')
const { site, pages } = JSON.parse(readFileSync(join(rootDir, 'src/data/seo-pages.json'), 'utf8'))
const template = readFileSync(join(distDir, 'index.html'), 'utf8')
const buildDate = new Date().toISOString().slice(0, 10)

const TITLE_MAX = 60
const DESCRIPTION_MAX = 160

// --- Helpers ---------------------------------------------------------------

const escapeHtml = (text) =>
  String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const pageUrl = (path) => `${site.url}${path === '/' ? '/' : path}`

// Replace exactly one occurrence of a pattern, or fail the build
const replaceOnce = (html, pattern, replacement, label) => {
  const matches = html.match(new RegExp(pattern.source, 'g')) || []
  if (matches.length !== 1) {
    throw new Error(`prerender: expected 1 match for ${label}, found ${matches.length}`)
  }
  return html.replace(pattern, replacement)
}

const setHeadTags = (html, { title, description, url, robots }) => {
  const safeTitle = escapeHtml(title)
  const safeDescription = escapeHtml(description)
  let out = html
  out = replaceOnce(out, /<title>[^<]*<\/title>/, `<title>${safeTitle}</title>`, 'title')
  out = replaceOnce(out, /<meta name="description" content="[^"]*">/, `<meta name="description" content="${safeDescription}">`, 'description')
  out = replaceOnce(out, /<meta name="robots" content="[^"]*">/, `<meta name="robots" content="${robots}">`, 'robots')
  out = replaceOnce(out, /<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${url}">`, 'canonical')
  out = replaceOnce(out, /<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${url}">`, 'og:url')
  out = replaceOnce(out, /<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${safeTitle}">`, 'og:title')
  out = replaceOnce(out, /<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${safeDescription}">`, 'og:description')
  out = replaceOnce(out, /<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${safeTitle}">`, 'twitter:title')
  out = replaceOnce(out, /<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${safeDescription}">`, 'twitter:description')
  return out
}

// --- JSON-LD ---------------------------------------------------------------

const buildJsonLd = (page) => {
  const url = pageUrl(page.path)
  const graph = [
    {
      '@type': 'WebPage',
      '@id': `${url}#webpage`,
      url,
      name: page.title,
      description: page.description,
      inLanguage: 'en',
      isPartOf: { '@id': `${site.url}/#website` },
      primaryImageOfPage: site.image,
      dateModified: buildDate
    }
  ]

  if (page.path !== '/') {
    const crumbs = [{ name: 'Home', url: `${site.url}/` }]
    if (page.path.startsWith('/tools/')) crumbs.push({ name: 'Decision Tools', url: `${site.url}/tools` })
    crumbs.push({ name: page.h1, url })
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: crumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: crumb.url
      }))
    })
  }

  if (page.steps) {
    graph.push({
      '@type': 'HowTo',
      name: `How to use ${page.name || page.h1}`,
      description: page.description,
      tool: { '@type': 'HowToTool', name: page.name || page.h1 },
      step: page.steps.map((step, index) => ({
        '@type': 'HowToStep',
        position: index + 1,
        name: step.name,
        text: step.text,
        url: `${url}#step-${index + 1}`
      }))
    })
  }

  if (page.faq) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: page.faq.map(({ q, a }) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a }
      }))
    })
  }

  // Escape "<" so content can never close the <script> tag early
  const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c')
  return `<script type="application/ld+json">${json}</script>`
}

// --- Static crawler content (replaced by Vue on mount) ---------------------

const toolPages = pages.filter((page) => page.tool)

const buildStaticContent = (page) => {
  const parts = []
  parts.push('<div style="max-width:48rem;margin:0 auto;padding:2rem 1rem;font-family:system-ui,-apple-system,sans-serif;line-height:1.6">')
  parts.push(`<nav aria-label="Main"><a href="/">${escapeHtml(site.name)}</a> · <a href="/tools">Decision Tools</a> · <a href="/help">Help</a> · <a href="/pricing">Pricing</a></nav>`)
  parts.push('<main>')
  parts.push(`<h1>${escapeHtml(page.h1)}</h1>`)
  page.intro.forEach((paragraph) => parts.push(`<p>${escapeHtml(paragraph)}</p>`))

  if (page.steps) {
    parts.push('<h2>How it works</h2><ol>')
    page.steps.forEach((step, index) => {
      parts.push(`<li id="step-${index + 1}"><strong>${escapeHtml(step.name)}:</strong> ${escapeHtml(step.text)}</li>`)
    })
    parts.push('</ol>')
  }

  if (page.faq) {
    parts.push('<h2>Frequently asked questions</h2>')
    page.faq.forEach(({ q, a }) => parts.push(`<h3>${escapeHtml(q)}</h3><p>${escapeHtml(a)}</p>`))
  }

  // Internal links help crawlers discover every tool
  if (page.linksToTools || page.path === '/' || page.tool) {
    parts.push(`<h2>${page.tool ? 'More decision tools' : 'All decision tools'}</h2><ul>`)
    toolPages
      .filter((tool) => tool.path !== page.path)
      .forEach((tool) => parts.push(`<li><a href="${tool.path}">${escapeHtml(tool.name)}</a>: ${escapeHtml(tool.description)}</li>`))
    parts.push('</ul>')
  }

  parts.push('</main></div>')
  return parts.join('')
}

// --- Write pages -----------------------------------------------------------

const warnings = []

pages.forEach((page) => {
  if (page.title.length > TITLE_MAX) warnings.push(`title ${page.title.length} chars: ${page.path}`)
  if (page.description.length > DESCRIPTION_MAX) warnings.push(`description ${page.description.length} chars: ${page.path}`)

  let html = setHeadTags(template, {
    title: page.title,
    description: page.description,
    url: pageUrl(page.path),
    robots: 'index, follow, max-image-preview:large'
  })
  html = replaceOnce(html, /<!--SEO_PAGE_JSONLD-->/, buildJsonLd(page), 'JSON-LD marker')
  html = replaceOnce(html, /<!--SEO_STATIC_CONTENT-->/, buildStaticContent(page), 'static content marker')

  // "/tools/pmi" -> dist/tools/pmi.html (Netlify serves it at /tools/pmi without a trailing-slash redirect)
  const outFile = page.path === '/' ? join(distDir, 'index.html') : join(distDir, `${page.path.slice(1)}.html`)
  mkdirSync(dirname(outFile), { recursive: true })
  writeFileSync(outFile, html)
})

// SPA fallback for app-only routes (history, shared links, auth) and unknown URLs: never indexed
let shell = setHeadTags(template, {
  title: pages[0].title,
  description: pages[0].description,
  url: `${site.url}/`,
  robots: 'noindex, follow'
})
shell = shell.replace('<!--SEO_PAGE_JSONLD-->', '').replace('<!--SEO_STATIC_CONTENT-->', '')
writeFileSync(join(distDir, 'app-shell.html'), shell)

// --- sitemap.xml -----------------------------------------------------------

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...pages.map((page) => `  <url><loc>${pageUrl(page.path)}</loc><lastmod>${buildDate}</lastmod></url>`),
  '</urlset>',
  ''
].join('\n')
writeFileSync(join(distDir, 'sitemap.xml'), sitemap)

// --- llms.txt (https://llmstxt.org) for AI answer engines ------------------

const otherPages = pages.filter((page) => !page.tool && page.path !== '/')
const llms = [
  `# ${site.name}`,
  '',
  `> ${site.description}`,
  '',
  'All tools are free to use in the browser without signing up. Each tool guides the user step by step and returns a scored recommendation.',
  '',
  '## Decision tools',
  '',
  ...toolPages.map((page) => `- [${page.name}](${pageUrl(page.path)}): ${page.description}`),
  '',
  '## Frequently asked questions',
  '',
  ...pages.flatMap((page) => (page.faq || []).map(({ q, a }) => `### ${q}\n\n${a}\n`)),
  '## Other pages',
  '',
  ...otherPages.map((page) => `- [${page.h1}](${pageUrl(page.path)}): ${page.description}`),
  ''
].join('\n')
writeFileSync(join(distDir, 'llms.txt'), llms)

// Build log for the deploy output (not shipped to the browser)
process.stdout.write(`prerender: ${pages.length} pages, app-shell.html, sitemap.xml, llms.txt\n`)
if (warnings.length) process.stdout.write(`prerender warnings:\n  ${warnings.join('\n  ')}\n`)
