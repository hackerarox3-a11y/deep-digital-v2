import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Deep Digital — Personnalisez votre identité",
  description: "Atelier de personnalisation textile haut de gamme à Abidjan : impression DTF, sérigraphie et broderie.",
  metadataBase: new URL("https://deep-digit.vercel.app"),
  openGraph: { title: "Deep Digital", description: "Personnalisez votre identité.", type: "website", locale: "fr_FR" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body>{children}</body></html>;
}
