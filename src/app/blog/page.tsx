import Link from 'next/link';
import SiteLinks from '@/app/SiteLinks';
import type { Metadata } from 'next';
import styles from '../alpha/page.module.css';
import AlphaList from '../alpha/AlphaList';
import { getAllPosts } from '@/lib/posts';

// The one writing page (owner 2026-11-16): the weekly posts plus the four Jul-Aug essays, newest first.
// WRITING on the front page and the top bar open this page. Posts: src/lib/posts.ts.
const getPosts = getAllPosts;

export function generateMetadata(): Metadata {
  return {
    title: 'Writing | AP39.',
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
