import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import mk from './locales/mk.json'

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, mk: { translation: mk } },
  lng: localStorage.getItem('dreamlab-language') || 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

i18n.on('languageChanged', (language) => localStorage.setItem('dreamlab-language', language))
export default i18n
