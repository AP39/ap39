import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import SiteLinks from '@/app/SiteLinks';
import { notFound } from 'next/navigation';
import { renderContent } from '@/lib/PostContent';
import styles from './page.module.css';

interface Post {
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  content: string;
}

async function getPost(slug: string): Promise<Post | null> {
  const filePath = path.join(process.cwd(), 'src/data/alpha', `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content) as Post;
}

// Alpha posts live only here since 2026-10-27 (the cycling write-ups; everything else is on crystllabs.com only),
// so each one is its own canonical.
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/alpha/${slug}` },
  };
}

export function generateStaticParams() {
  const dir = path.join(process.cwd(), 'src/data/alpha');
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => ({ slug: f.replace(/\.json$/, '') }));
}

export default async function AlphaPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) return notFound();

  return (
    <main className={styles.main}>
      <nav className="siteNav">
        <Link href="/" className="siteBrand"><img src="/crown.png" alt="" className="siteCrown" width={26} height={26} />AP39.</Link>
        <SiteLinks />
      </nav>

      <Link href="/alpha" className="returnLink">&lt; RETURN</Link>

      <article className={styles.article}>
        <header className={styles.header}>
          <div className={styles.meta}>
             {post.date.split('T')[0]}
          </div>
          <h1 className={styles.title}>{post.title}</h1>
          <div className={styles.byline}>WRITTEN BY AP39</div>
        </header>

        <div className={styles.content}>
          {renderContent(post.content)}
        </div>
      </article>
    </main>
  );
}
