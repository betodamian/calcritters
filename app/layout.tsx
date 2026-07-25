import type { Metadata } from "next";
import { Fraunces, Space_Grotesk, Space_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { SITE_URL } from "@/lib/site";

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const title = "CalCritters · Campus AR Adventure";
const description =
  "An interactive campus alternate reality game. Scan QR codes around campus to meet AI-driven critters, each with its own personality and home.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  openGraph: {
    title,
    description,
    url: SITE_URL,
    siteName: "CalCritters",
    type: "website",
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fraunces.variable} ${spaceGrotesk.variable} ${spaceMono.variable} antialiased`}
      >
        <div className="site-shell">
          <header className="site-header">
            <Link href="/" className="brand">
              <span className="brand-mark" aria-hidden="true">
                ✦
              </span>
              CalCritters
            </Link>
            <nav className="site-nav">
              <Link href="/critters">Critterdex</Link>
              <Link href="/qr">Organizers</Link>
            </nav>
          </header>
          <main className="site-main">{children}</main>
          <footer className="site-footer">
            <span>CalCritters</span>
            <span className="footer-dot" aria-hidden="true">
              •
            </span>
            <span>A campus alternate reality game</span>
          </footer>
        </div>
      </body>
    </html>
  );
}
