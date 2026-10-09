import { readFileSync, writeFileSync } from 'node:fs'
import { renderHtml } from './seo-html.js'
writeFileSync('index.html', renderHtml(readFileSync('index.html', 'utf8'), '/'))
