export const origin = 'https://dreamlab.mk'
export const pages = ['/', '/products/konobar/']
export const languageFromPath = (path) => /^\/mk(?:\/|$)/.test(path) ? 'mk' : 'en'
export const pageFromPath = (path) => path.replace(/^\/mk(?=\/|$)/, '').replace(/\/+$/, '') === '/products/konobar' ? '/products/konobar/' : '/'
export const localizedPath = (page, language) => language === 'mk' ? `/mk${page}` : page
export function metadata(path) {
  const language = languageFromPath(path)
  const page = pageFromPath(path)
  const product = page !== '/'
  return {
    language,
    image: origin + '/dreamlab-signature-green-dl.png',
    imageAlt: language === 'mk' ? 'Потписно лого на DreamLab во маслинеста зелена боја.' : 'DreamLab signature logo with olive green lettering.',
    imageWidth: 2043,
    imageHeight: 770,
    url: origin + localizedPath(page, language),
    title: product ? (language === 'mk' ? 'Konobar — NFC дигитален келнер | DreamLab' : 'Konobar — NFC Digital Waiter | DreamLab') : (language === 'mk' ? 'DreamLab | Од идеи до решенија' : 'DreamLab | From Ideas to Solutions'),
    description: product ? (language === 'mk' ? 'NFC систем преку веб за побрза услуга во угостителски објекти.' : 'A browser-based NFC hospitality system for faster table service.') : (language === 'mk' ? 'Дизајнираме и развиваме фокусирани софтверски решенија за луѓе, бизниси и градови.' : 'We design and build focused software that helps people, businesses and cities through thoughtful digital products.'),
    locale: language === 'mk' ? 'mk_MK' : 'en_US',
    alternateLocale: language === 'mk' ? 'en_US' : 'mk_MK',
    alternates: { en: origin + page, mk: origin + localizedPath(page, 'mk'), 'x-default': origin + page },
  }
}
