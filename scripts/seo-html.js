import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { metadata, pages, localizedPath } from '../src/seo.js'
const escape = (value) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
export const routes = pages.flatMap(page => ['en', 'mk'].map(language => localizedPath(page, language)))
export function seoHead(path) {
  const data = metadata(path)
  const tags = { description: data.description, 'theme-color': '#4f5734', 'twitter:card': 'summary_large_image', 'twitter:image': data.image, 'twitter:image:alt': data.imageAlt, 'twitter:title': data.title, 'twitter:description': data.description }
  const og = { image: data.image, 'image:secure_url': data.image, 'image:type': 'image/png', 'image:width': String(data.imageWidth), 'image:height': String(data.imageHeight), 'image:alt': data.imageAlt, type: 'website', site_name: 'DreamLab', title: data.title, description: data.description, url: data.url, locale: data.locale, 'locale:alternate': data.alternateLocale }
  return `<title>${escape(data.title)}</title>
` +
    Object.entries(tags).map(([name, value]) => `<meta name="${name}" content="${escape(value)}" />`).join('\n') + '\n' +
    Object.entries(og).map(([name, value]) => `<meta property="og:${name}" content="${escape(value)}" />`).join('\n') + '\n' +
    `<link rel="canonical" href="${data.url}" />\n` +
    Object.entries(data.alternates).map(([language, url]) => `<link rel="alternate" hreflang="${language}" href="${url}" />`).join('\n')
}
export function renderHtml(html, path) {
  return html.replace(/<html lang="[^"]*">/, `<html lang="${metadata(path).language}">`).replace(/<!-- seo:start -->[\s\S]*?<!-- seo:end -->/, `<!-- seo:start -->\n${seoHead(path)}\n<!-- seo:end -->`)
}
export function localizedSeo() {
  return {
    name: 'dreamlab-localized-seo',
    transformIndexHtml: { order: 'pre', handler(html, context) { return renderHtml(html, (context.originalUrl || context.path).split('?')[0]) } },
    writeBundle(options) {
      const output = resolve(options.dir || 'dist')
      const index = readFileSync(resolve(output, 'index.html'), 'utf8')
      for (const route of routes.filter(route => route !== '/')) {
        const file = resolve(output, route.slice(1) + 'index.html')
        mkdirSync(dirname(file), { recursive: true })
        writeFileSync(file, renderHtml(index, route))
      }
    },
  }
}
