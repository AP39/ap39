import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { renderContent } from '@/lib/PostContent';
import styles from '../../alpha/[slug]/page.module.css';

interface Post { title: string; slug: string; date: string; excerpt: string; content: string }

const DIR = path.join(process.cwd(), 'src/data/blog');

function getPost(slug: string): Post | null {
  const filePath = path.join(DIR, `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as Post;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return { title: `${post.title} | AP39.`, description: post.excerpt, alternates: { canonical: `/blog/${slug}` } };
}

export const dynamicParams = false;

// output: export refuses an empty list, so before the first post one placeholder path is built; it renders the
// not-found page and is in no sitemap or link.
export function generateStaticParams() {
  const slugs = fs.existsSync(DIR) ? fs.readdirSync(DIR).filter((f) => f.endsWith('.json')).map((f) => ({ slug: f.replace(/\.json$/, '') })) : [];
  return slugs.length ? slugs : [{ slug: 'none' }];
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return notFound();
  return (
    <main className={styles.main}>
      <nav className="siteNav">
        <Link href="/" className="siteBrand">AP39.</Link>
        <span className="siteStatus">// BLOG</span>
      </nav>
      <Link href="/blog" className="returnLink">&lt; RETURN</Link>
      <article className={styles.article}>
        <header className={styles.header}>
          <div className={styles.meta}>{post.date.split('T')[0]}</div>
          <h1 className={styles.title}>{post.title}</h1>
          <div className={styles.byline}>WRITTEN BY AP39</div>
        </header>
        <div className={styles.content}>{renderContent(post.content)}</div>
      </article>
    </main>
  );
}
