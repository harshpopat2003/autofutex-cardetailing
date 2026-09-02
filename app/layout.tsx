import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Manrope, IBM_Plex_Mono } from "next/font/google";
import { shop } from "@/lib/content";
import "./globals.css";

/* Space Grotesk carries the display voice — engineered, slightly odd,
   the right amount of workshop in it. Manrope handles body copy at the
   sizes where Space Grotesk's quirks start to cost legibility. Plex
   Mono is the spec-sheet voice: microns, branch names, section numbers. */
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AutoFutex — 3M Paint Protection & Ceramic Coating in Muscat",
  description:
    "3M Pro Shop Dealer and authorised distributor in Oman since 2017. Paint protection film, ceramic coating, paint correction and interior detailing at our Ghala and Qurm branches in Muscat.",
  keywords: [
    "paint protection film Muscat",
    "PPF Oman",
    "ceramic coating Muscat",
    "3M Pro Shop Dealer Oman",
    "car detailing Muscat",
    "AutoFutex",
  ],
  openGraph: {
    title: "AutoFutex — 3M Authorised Car Care, Muscat",
    description:
      "Paint protection film, ceramic coating and correction on genuine 3M product. Ghala and Qurm, Muscat.",
    type: "website",
    locale: "en_OM",
  },
  other: {
    "format-detection": "telephone=no",
  },
};

/* The ember is the address bar colour too — the chrome should not
   break the room the page is lit in. */
export const viewport: Viewport = {
  themeColor: "#050607",
};

/** An auto shop lives or dies on local search. */
const schema = {
  "@context": "https://schema.org",
  "@type": "AutoDetailing",
  name: shop.name,
  description: `3M Pro Shop Dealer and authorised distributor in Oman. Paint protection film, ceramic coating, paint correction and interior detailing in Muscat since ${shop.since}.`,
  telephone: shop.phone,
  email: shop.email,
  foundingDate: String(shop.since),
  areaServed: "Muscat, Oman",
  address: [
    {
      "@type": "PostalAddress",
      streetAddress: "Ghala Industrial Area, Bousher",
      addressLocality: "Muscat",
      addressCountry: "OM",
    },
    {
      "@type": "PostalAddress",
      streetAddress: "Qurm",
      addressLocality: "Muscat",
      addressCountry: "OM",
    },
  ],
  openingHours: "Sa-Th 09:00-13:00,15:00-19:00",
  sameAs: Object.values(shop.social),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${manrope.variable} ${plexMono.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
        {children}
      </body>
    </html>
  );
}
