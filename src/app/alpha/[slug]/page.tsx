import fs from 'fs';
import path from 'path';
import Link from 'next/link';
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

// These posts are also published at crystllabs.com/blog/<slug>.html. ap39 and
// crystllabs.com share a root domain, so two live copies of the same article read
// as duplicate content. The canonical names crystllabs.com as the original.
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `https://crystllabs.com/blog/${slug}.html` },
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
        <Link href="/" className="siteBrand">AP39.</Link>
        <span className="siteStatus">// DECRYPTED_PAYLOAD</span>
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
