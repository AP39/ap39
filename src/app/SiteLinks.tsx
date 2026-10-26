import Link from 'next/link';

// The three sections, on every inner page's top bar (in place of the old status text), so nobody has to go home to move on.
export default function SiteLinks() {
  return (
    <span className="siteLinks">
      <Link href="/repo">Work</Link>
      <Link href="/alpha">Writing</Link>
      <Link href="/contact">Contact</Link>
    </span>
  );
}
