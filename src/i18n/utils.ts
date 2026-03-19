import es from "../locales/es.json";
import en from "../locales/en.json";

type TranslationKeys = keyof typeof es;

const translations: Record<string, Record<string, string>> = { es, en };

declare global {
  interface Window {
    __I18N_CONFIG?: { lang: "es" | "en" };
  }
}

export function getLang(): "es" | "en" {
  if (typeof window !== "undefined" && window.__I18N_CONFIG?.lang) {
    const clientLang = window.__I18N_CONFIG.lang;
    if (clientLang === "es" || clientLang === "en") {
      return clientLang;
    }
  }

  const browserLang = navigator?.language?.toLowerCase() ?? null;
  if (browserLang?.startsWith("es")) return "es";
  return "en";
}

export function useTranslations(lang: "es" | "en") {
  return function t(key: TranslationKeys): string {
    return translations[lang][key] ?? translations["es"][key] ?? key;
  };
}
