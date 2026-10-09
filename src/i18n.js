import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import mk from './locales/mk.json'
import { languageFromPath } from './seo.js'

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, mk: { translation: mk } },
  lng: languageFromPath(window.location.pathname),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})


export default i18n
