import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

const locales = ["en", "zh"];
const defaultLocale = "en";

function getLocale(request: Request): string {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    negotiatorHeaders[key] = value;
  });
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  return match(languages, locales, defaultLocale);
}

export default clerkMiddleware(
  // Clerk will run first, then call this handler for every request
  async (auth, req) => {
    // Protect all routes (you can make this conditional with createRouteMatcher if needed)
    await auth.protect();

    const url = new URL(req.url);
    const { pathname } = url;

    // If URL already contains a locale or is an API route, just continue
    const hasLocale = locales.some(
      (l) =>
        pathname.startsWith(`/${l}/`) ||
        pathname === `/${l}` ||
        pathname.startsWith(`/api/`)
    );
    if (hasLocale) {
      return NextResponse.next();
    }

    // Otherwise detect the user’s preferred locale and redirect
    const locale = getLocale(req);
    url.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(url);
  }
);

export const config = {
  matcher: [
    // Skip Next.js internals & static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API/trpc
    "/(api|trpc)(.*)",
  ],
};
