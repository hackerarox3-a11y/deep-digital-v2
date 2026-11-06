import type { Metadata } from "next";
import "@/app/globals.css";
import { site } from "@/constants/site";

export const metadata: Metadata = {
  title: "Deep Digital — Personnalisez votre identité",
  description: "Atelier de personnalisation textile haut de gamme à Abidjan : impression DTF, sérigraphie et broderie.",
  icons: { icon: "/brand-symbol.png" },
  metadataBase: new URL(site.url),
  openGraph: { title: "Deep Digital", description: "Personnalisez votre identité.", type: "website", locale: "fr_FR" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body>{children}</body></html>;
}
