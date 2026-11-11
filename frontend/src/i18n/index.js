import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import ar from './locales/ar.json'

const STORAGE_KEY = 'lang'
export const SUPPORTED_LANGUAGES = ['en', 'ar']

const readSavedLanguage = () => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY)
        return SUPPORTED_LANGUAGES.includes(saved) ? saved : 'en'
    } catch {
        return 'en'
    }
}

// <html> is the one place direction lives: Tailwind's logical classes, the rtl: variant
// and portaled dialogs all read it from there, so the whole app mirrors from this single switch
const applyLanguage = (lng) => {
    document.documentElement.lang = lng
    document.documentElement.dir = i18n.dir(lng)
    try {
        localStorage.setItem(STORAGE_KEY, lng)
    } catch {
        // Private mode can block storage; the language still applies for this visit
    }
}

i18n.on('languageChanged', applyLanguage)

i18n.use(initReactI18next).init({
    resources: { en: { translation: en }, ar: { translation: ar } },
    lng: readSavedLanguage(),
    fallbackLng: 'en',
    supportedLngs: SUPPORTED_LANGUAGES,
    // Inline resources, so init can finish synchronously and set dir before the first paint
    initAsync: false,
    // React already escapes output
    interpolation: { escapeValue: false },
})

export default i18n
