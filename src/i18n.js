import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import kzTranslation from "./locales/kz/translation";
import ruTranslation from "./locales/ru/translation";

const resources = {
  ru: {
    translation: ruTranslation,
  },
  kz: {
    translation: kzTranslation,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "kz",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
