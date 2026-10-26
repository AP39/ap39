import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import SiteLinks from '@/app/SiteLinks';
import type { Metadata } from 'next';
import styles from '../alpha/page.module.css';
import AlphaList from '../alpha/AlphaList';

// The AP39 blog (owner 2026-10-27). Posts are src/data/blog/<slug>.json with title, slug, date, excerpt and
// content (same format and markdown subset as the alpha posts). Unlike alpha, these are originals: their
// canonical is ap39.site. While there are no posts the page stays out of search and the sitemap.
interface Post { title: string; slug: string; date: string; excerpt: string }

function getPosts(): Post[] {
  const dir = path.join(process.cwd(), 'src/data/blog');
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf-8')) as Post)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function generateMetadata(): Metadata {
  return {
    title: 'Blog | AP39.',
    description: 'Notes from AP39.',
    alternates: { canonical: '/blog' },
    robots: getPosts().length ? undefined : { index: false, follow: true },
  };
}

export default function BlogIndex() {
  const posts = getPosts();
  return (
    <main className={styles.main}>
      <nav className="siteNav">
        <Link href="/" className="siteBrand"><img src="/crown.png" alt="" className="siteCrown" width={26} height={26} />AP39.</Link>
        <SiteLinks />
      </nav>
      <div className={styles.container}>
        {posts.length > 0 ? (
          <AlphaList posts={posts} basePath="/blog" />
        ) : (
          <p className={styles.empty}>FIRST_POST // INCOMING</p>
        )}
      </div>
    </main>
  );
}
