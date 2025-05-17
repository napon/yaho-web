import { Toaster } from "@/components/ui/sonner";
import { ClerkProvider, SignedIn, UserButton } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TranslationProvider } from "./TranslationContext";
import { getTranslations } from "./translations";
import { zhTW, enUS } from "@clerk/localizations";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yaho Product Search",
  description: "Search for products for YAHO TW",
  // Add viewport meta tag for responsiveness
  viewport: "width=device-width, initial-scale=1",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: "en" | "zh" }>;
}>) {
  const { lang } = await params;
  const localeKey = lang === "en" ? enUS : zhTW;
  const translatedStrings = await getTranslations(lang);
  return (
    <ClerkProvider
      localization={localeKey}
      appearance={{
        elements: {
          footer: "hidden",
        },
      }}
    >
      <html lang={lang}>
        <body
          className={`min-h-screen bg-background ${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <header className="flex justify-end items-center p-4 gap-4 h-16">
            <SignedIn>
              <UserButton />
            </SignedIn>
          </header>
          <TranslationProvider translation={translatedStrings}>
            {children}
            <Toaster />
          </TranslationProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
