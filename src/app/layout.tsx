import type { Metadata } from "next";
import Link from "next/link";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ap39.site"),
  title: "AP39 | Senior lead developer",
  description: "AP39, senior lead developer at Crystl Labs: released apps and games, CrystlQuant, Underfolio and The Kimchi Premium.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <header className="header">
          <div className="wrap">
            <Link href="/" className="brand"><img src="/crown.png" alt="" width={34} height={34} />AP39</Link>
            <nav className="nav" aria-label="Site">
              <Link href="/repo">Work</Link>
              <Link href="/alpha">Writing</Link>
              <Link href="/contact">Contact</Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="footer">
          <div className="wrap">
            <span>AP39 · Crystl Labs · <Link href="/blog">Blog</Link></span>
            <span>Also by us: <a href="https://crystlquant.com/">CrystlQuant</a> - a number before the game, graded after.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
