import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    lng: "ru", // Язык по умолчанию
    fallbackLng: "ru", // Резервный язык
    supportedLngs: ["ru", "kz", "en"],
    interpolation: { escapeValue: false },
    backend: { loadPath: "/locales/{{lng}}/common.json" },
    initImmediate: false, // Ждать полной загрузки переводов
    detection: { order: ["path", "cookie", "localStorage"], caches: [] }, // Отключаем кэширование и автоопределение
  })
  .then(() => {
    console.log("i18n initialized with language:", i18n.language);
    if (i18n.language !== "ru") {
      i18n.changeLanguage("ru"); // Принудительно устанавливаем "ru" после инициализации
    }
  })
  .catch((err) => {
    console.error("Failed to initialize i18n:", err);
  });

export default i18n;