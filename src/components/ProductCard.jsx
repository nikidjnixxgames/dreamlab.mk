import { useTranslation } from 'react-i18next'

export default function ProductCard({ kind, domain, title, description, cta, children }) {
  const { t } = useTranslation()
  const key = kind === 'pozari' ? 'pozari' : 'caption'
  return <article className={`product-card product-card--${kind}`} data-reveal="product-card">
    <div className="product-card__header"><span className="product-domain">{domain}</span><span className="product-status">{t('products.live')}</span></div>
    <div className="product-card__copy"><h3>{t(`products.${key}Title`)}</h3><p>{t(`products.${key}Description`)}</p></div>
    <div className="product-card__preview">{children}</div>
    <a className="product-card__footer" href={kind === 'pozari' ? 'https://www.pozari.mk' : 'https://www.captionlab.mk'} target="_blank" rel="noopener noreferrer" aria-label={t(`products.${key}Cta`)}><span>{t(`products.${key}Cta`)}</span><span aria-hidden="true">→</span></a>
  </article>
}
