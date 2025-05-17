"use client";

import { createContext } from "react";

export type TranslatedStrings = typeof import("../../translations/en.json");

interface TranslationContextProps {
  translation: TranslatedStrings;
}

const TranslationContext = createContext<TranslationContextProps>(
  {} as TranslationContextProps
);

export const TranslationProvider = ({
  children,
  translation,
}: {
  translation: TranslatedStrings;
  children: React.ReactNode | React.ReactNode[];
}) => (
  <TranslationContext.Provider value={{ translation: translation }}>
    {children}
  </TranslationContext.Provider>
);

export default TranslationContext;
