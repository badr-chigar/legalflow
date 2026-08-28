import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

import { ToastProvider } from "@/components/ui/toast";

// Titres — Fraunces (serif à caractère). design-system.md §3.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

// Texte / UI — IBM Plex Sans.
const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-sans",
  display: "swap",
});

// Mono — n° de dossier, montants, codes OTP.
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LegalFlow — Espace professionnel",
  description:
    "Accompagnement juridique à la création d'entreprise : sociétés, documents légaux, signature électronique.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${fraunces.variable} ${plexSans.variable} ${plexMono.variable} h-full`}
    >
      <body className="min-h-full bg-page text-ink">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
