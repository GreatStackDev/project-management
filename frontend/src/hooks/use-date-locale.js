import { useTranslation } from "react-i18next";
import { ar, enUS } from "date-fns/locale";

const locales = { en: enUS, ar };

// date-fns locale for the current UI language: pass it as format(date, pattern, { locale }).
// Only for dates people read; machine values (yyyy-MM-dd keys, input values) stay locale-free.
export function useDateLocale() {
    const { i18n } = useTranslation();
    return locales[i18n.language] ?? enUS;
}
