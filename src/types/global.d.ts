interface I18nManager {
  lang: string | null;
  t: (key: string) => string;
  init: () => void;
  applyTranslations: () => void;
  getLang: () => string | null;
  setLang: (lang: string) => void;
  has: (key: string) => boolean;
  getAvailableLangs: () => string[];
}

interface Window {
  i18n: I18nManager;
}
