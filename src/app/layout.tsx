import type { Metadata, Viewport } from "next";
import { Inter_Tight, Instrument_Serif } from "next/font/google";
import { site } from "@/content/site";
import { organizationJsonLd, websiteJsonLd, JsonLd } from "@/lib/seo";
import { Providers } from "@/components/providers/Providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ConsentManager } from "@/components/consent/ConsentManager";
import { motionBootScript } from "@/lib/reveal";
import "./globals.css";

const sans = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
});

// Seule l'italique est utilisée (mots mis en valeur).
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-instrument-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: "/",
    siteName: site.name,
    title: site.title,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false, email: false, address: false },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: "#05060a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${sans.variable} ${serif.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionBootScript }} />
      </head>
      <body>
        <a
          href="#contenu"
          className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-full bg-ivory px-5 py-3 text-sm font-medium text-ink-950 transition-transform focus-visible:translate-y-0"
        >
          Aller au contenu
        </a>
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        <Providers>
          <Header />
          <main id="contenu" tabIndex={-1} className="relative">
            {children}
          </main>
          <Footer />
          <ConsentManager />
        </Providers>
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
