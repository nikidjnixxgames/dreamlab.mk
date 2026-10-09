import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { routes } from './seo-html.js'
import { metadata } from '../src/seo.js'
for (const route of routes) {
  const html = readFileSync(`dist${route}index.html`, 'utf8')
  const data = metadata(route)
  assert(html.includes(`<html lang="${data.language}">`), route)
  assert(html.includes(`<title>${data.title}</title>`), route)
  assert.equal((html.match(/rel="canonical"/g) || []).length, 1, route)
  assert(html.includes(`rel="canonical" href="${data.url}"`), route)
  assert(html.includes(`property="og:url" content="${data.url}"`), route)
  assert(html.includes(`property="og:locale" content="${data.locale}"`), route)
  assert(html.includes(`name="description" content="${data.description}"`), route)
  assert(html.includes(`name="twitter:title" content="${data.title}"`), route)
  for (const [lang, url] of Object.entries(data.alternates)) assert(html.includes(`hreflang="${lang}" href="${url}"`), route)
  assert(html.includes(`property="og:image" content="${data.image}"`), route)
  assert(html.includes(`property="og:image:alt" content="${data.imageAlt}"`), route)
  assert(html.includes(`name="twitter:card" content="summary_large_image"`), route)
  assert(!html.includes('content="/og-image.png"'), 'No unrelated Pozari preview')
  for (const asset of [...html.matchAll(/(?:src|href)="(\/[^"?]+)(?:\?[^" ]*)?"/g)]) assert(existsSync(`dist${asset[1]}`), `${route}: ${asset[1]}`)
}
const manifest = JSON.parse(readFileSync('dist/manifest.webmanifest', 'utf8'))
for (const icon of manifest.icons) assert(existsSync(`dist${icon.src}`))
assert.equal(manifest.theme_color, '#4f5734')
assert(existsSync('dist/.htaccess'))
console.log(`Verified ${routes.length} initial HTML pages, language metadata, canonical/alternate URLs, bundled assets and manifest icons.`)
