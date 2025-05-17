import { useRouter } from "next/router";
import { useTranslation, type Locale } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

export function LanguageSwitcher() {
  // const router = useRouter();
  // const { t } = useTranslation();
  // const switchLanguage = (newLocale: Locale) => {
  //   const { pathname, asPath, query } = router;
  //   router.push({ pathname, query }, asPath, { locale: newLocale });
  // };
  // return (
  //   <div className="flex items-center gap-2">
  //     <Button
  //       variant={locale === "en" ? "default" : "outline"}
  //       onClick={() => switchLanguage("en")}
  //       className="min-w-[60px]"
  //     >
  //       EN
  //     </Button>
  //     <Button
  //       variant={locale === "zh" ? "default" : "outline"}
  //       onClick={() => switchLanguage("zh")}
  //       className="min-w-[60px]"
  //     >
  //       中文
  //     </Button>
  //   </div>
  // );
}
