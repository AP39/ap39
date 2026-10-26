import Link from 'next/link';

// The three sections, on every inner page's top bar (in place of the old status text), so nobody has to go home to move on.
export default function SiteLinks() {
  return (
    <span className="siteLinks">
      <Link href="/repo">Repo</Link>
      <Link href="/alpha">Alpha</Link>
      <Link href="/contact">Ping</Link>
    </span>
  );
}
