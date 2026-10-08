import { DreamLabMark } from '../SiteHeader.jsx'
import { useTranslation } from 'react-i18next'

export default function SiteFooter(){const { t } = useTranslation(); return <footer className="site-footer" id="contact"><div className="site-footer__inner"><div className="site-footer__left"><a href="/" className="footer-brand-link" aria-label={t('nav.home')}><DreamLabMark small/></a><span>{t('footer.copyright')}</span></div><div className="site-footer__right">{t('footer.made')}</div></div></footer>}
