import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://deep-digital.vercel.app"),

  title: {
    default: "Deep Digital — Personnalisation Textile Premium",
    template: "%s | Deep Digital",
  },

  description:
    "Personnalisez vos vêtements premium avec Deep Digital. T-shirts, Hoodies, Tote Bags, Polos, Casquettes, Impression DTF, Sérigraphie et Broderie.",

  keywords: [
    "Deep Digital",
    "T-shirt personnalisé",
    "Hoodie",
    "DTF",
    "Sérigraphie",
    "Broderie",
    "Textile",
    "Abidjan",
    "Côte d'Ivoire",
    "Streetwear",
  ],

  authors: [
    {
      name: "Deep Digital",
    },
  ],

  creator: "Deep Digital",

  openGraph: {
    title: "Deep Digital",
    description:
      "Studio de personnalisation textile haut de gamme.",

    url: "https://deep-digital.vercel.app",

    siteName: "Deep Digital",

    locale: "fr_FR",

    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Deep Digital",
    description:
      "Personnalisation textile premium.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${inter.variable} bg-[#0A0A0A] text-white antialiased overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
