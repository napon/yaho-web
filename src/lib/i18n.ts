import { useContext } from "react";
import TranslationContext from "../app/[lang]/TranslationContext";

export type Locale = "en" | "zh";

type TranslationKey = string;

export function useTranslation() {
  const { translation } = useContext(TranslationContext);

  const t = (key: TranslationKey, params?: Record<string, string | number>) => {
    const keys = key.split(".");
    let value: any = translation;

    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) return key;
    }

    if (typeof value !== "string") return key;

    if (params) {
      return Object.entries(params).reduce(
        (str, [key, val]) => str.replace(`{${key}}`, String(val)),
        value
      );
    }

    return value;
  };

  return { t };
}
