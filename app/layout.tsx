import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { BRAND_NAME, BRAND_TAGLINE, SITE_URL } from "@/lib/config";

// Fonts are self-hosted from app/fonts, so the build never depends on Google Fonts.
const fraunces = localFont({
  src: "./fonts/fraunces.woff2",
  variable: "--font-fraunces",
  display: "swap",
  weight: "100 900",
});
const manrope = localFont({
  src: "./fonts/manrope.woff2",
  variable: "--font-manrope",
  display: "swap",
  weight: "200 800",
});
const tiro = localFont({
  src: "./fonts/tiro-devanagari.woff2",
  variable: "--font-tiro",
  display: "swap",
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BRAND_NAME} – Villas at Jaipur Vatika`,
    template: `%s – ${BRAND_NAME}`,
  },
  description: `${BRAND_TAGLINE}. We buy plots in and around Vatika, Jaipur, plan them and build villas on them. A registered private limited company.`,
  openGraph: {
    type: "website",
    siteName: BRAND_NAME,
    locale: "en_IN",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f6e6da",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${manrope.variable} ${tiro.variable}`}>
      <body className="min-h-dvh flex flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-cream"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
