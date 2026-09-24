import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AP39.",
  description: "AP39. Selected Works.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <div className="bg-watermark" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
