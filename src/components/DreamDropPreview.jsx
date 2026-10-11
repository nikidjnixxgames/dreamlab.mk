import { useTranslation } from 'react-i18next'

export default function DreamDropPreview({ compact = false }) {
  const { t } = useTranslation()
  return <div className={`drop-preview${compact ? ' drop-preview--compact' : ''}`}>
    <div className="drop-preview__phone">
      <span className="drop-preview__label">{t('products.dropUpload')}</span>
      <span className="drop-preview__brand">↓ DreamDrop</span>
      <div className="drop-preview__files">{compact ? <><img src="/dreamdrop/football-photo.jpg" alt={t('products.dropPhoto1')} /><img src="/dreamdrop/football-video.jpg" alt={t('products.dropPhoto2')} /></> : <><span>JPG</span><span>MOV</span></>}</div>
      <span className="drop-preview__upload" aria-hidden="true">↑</span>
    </div>
    <span className="drop-preview__arrow" aria-hidden="true">→</span>
    <div className="drop-preview__computer">
      <span className="drop-preview__label">{t('products.dropReceive')}</span>
      <span className="drop-preview__folder" aria-hidden="true">↓</span>
      <span className="drop-preview__file">{compact && <img src="/dreamdrop/football-photo.jpg" alt="" />}<span>{compact ? 'VID_1021.MOV' : 'IMG_4832.JPG'}</span><i>✓</i></span>
      <span className="drop-preview__file">{compact && <img src="/dreamdrop/football-video.jpg" alt="" />}<span>VID_1022.MOV</span><i>✓</i></span>
      <span className="drop-preview__received">✓ {t('products.dropOriginals')}</span>
    </div>
  </div>
}
