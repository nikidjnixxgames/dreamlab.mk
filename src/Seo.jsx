import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import i18n from './i18n.js'
import { metadata } from './seo.js'
export default function Seo() {
  const location = useLocation()
  useEffect(() => {
    const data = metadata(window.location.pathname)
    i18n.changeLanguage(data.language)
    document.documentElement.lang = data.language
    document.title = data.title
    const set = (selector, value) => document.querySelector(selector)?.setAttribute('content', value)
    set('meta[name="description"]', data.description)
    for (const [key, value] of Object.entries({ 'image:alt': data.imageAlt, title: data.title, description: data.description, url: data.url, locale: data.locale, 'locale:alternate': data.alternateLocale })) set(`meta[property="og:${key}"]`, value)
    set('meta[name="twitter:image:alt"]', data.imageAlt)
    set('meta[name="twitter:title"]', data.title)
    set('meta[name="twitter:description"]', data.description)
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', data.url)
    for (const [language, url] of Object.entries(data.alternates)) document.querySelector(`link[hreflang="${language}"]`)?.setAttribute('href', url)
  }, [location.pathname])
  return null
}
