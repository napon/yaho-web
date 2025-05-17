import "server-only";

const transations = {
  en: () =>
    import("../../translations/en.json").then((module) => module.default),
  zh: () =>
    import("../../translations/zh.json").then((module) => module.default),
};

export const getTranslations = async (locale: "en" | "zh") =>
  transations[locale]();
