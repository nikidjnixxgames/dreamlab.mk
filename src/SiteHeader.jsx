import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import i18n from './i18n.js'

export function DreamLabMark({ small = false }) {
  return <img className={`dreamlab-wordmark${small ? ' dreamlab-wordmark--small' : ''}`} src="/dreamlab-wordmark.svg" width="1640" height="630" alt="DreamLab" decoding="async" />
}

export default function SiteHeader() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const go = (event, section) => {
    event.preventDefault()
    if (location.pathname !== '/') return navigate('/', { state: { scrollTo: section } })
    const target = document.getElementById(section)
    if (!target) return
    const headerHeight = document.querySelector('.site-header')?.getBoundingClientRect().height ?? 0
    window.scrollTo({ top: Math.max(0, target.getBoundingClientRect().top + window.scrollY - headerHeight - 16), behavior: 'smooth' })
  }
  const logo = (event) => { event.preventDefault(); location.pathname === '/' ? window.scrollTo({ top: 0, behavior: 'smooth' }) : navigate('/', { state: { scrollTo: 'top' } }) }
  return <header className="site-header"><div className="site-header-inner"><a className="brand" href="/" onClick={logo} aria-label={t('nav.home')}><DreamLabMark /></a><nav className="main-nav" aria-label={t('nav.main')}><a className="nav-link" href="/" onClick={(event) => go(event, 'products')}>{t('nav.products')}</a><a className="nav-link" href="/" onClick={(event) => go(event, 'ventures')}>{t('nav.about')}</a><a className="nav-link" href="/" onClick={(event) => go(event, 'contact')}>{t('nav.contact')}</a></nav><a className="availability" href="/" onClick={(event) => go(event, 'contact')}><span className="availability-dot" />{t('nav.availability')}</a><div className="site-header__language"><div className="language-switcher" aria-label={t('language.label')}><button type="button" className={`language-switcher__option ${i18n.language === 'en' ? 'is-active' : ''}`} onClick={() => i18n.changeLanguage('en')} aria-pressed={i18n.language === 'en'}><span aria-hidden="true">🇬🇧</span><span>EN</span></button><button type="button" className={`language-switcher__option ${i18n.language === 'mk' ? 'is-active' : ''}`} onClick={() => i18n.changeLanguage('mk')} aria-pressed={i18n.language === 'mk'}><span aria-hidden="true">🇲🇰</span><span>MK</span></button></div></div></div></header>
}
