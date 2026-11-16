import Link from 'next/link';
import type { Metadata } from 'next';

// /alpha was the old Writing page. Everything is on /blog now (owner 2026-11-16: one page, not two);
// this address only forwards there. The essays keep their /alpha/<slug> pages.
export const metadata: Metadata = {
  title: 'Writing | AP39.',
  alternates: { canonical: '/blog' },
  robots: { index: false, follow: true },
};

export default function AlphaIndex() {
  return (
    <main style={{ padding: '2rem' }}>
      <meta httpEquiv="refresh" content="0; url=/blog" />
      <Link href="/blog">Writing has moved to /blog</Link>
    </main>
  );
}
