import Link from 'next/link';
import { notFound } from 'next/navigation';
import { renderContent } from '@/lib/PostContent';
import { day, getPost, getPosts } from '@/lib/posts';
import styles from './page.module.css';

// These posts are also published at crystllabs.com/blog/<slug>.html. ap39 and
// crystllabs.com share a root domain, so two live copies of the same article read
// as duplicate content. The canonical names crystllabs.com as the original.
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost('alpha', slug);
  if (!post) return {};
  return { title: `${post.title} | AP39`, description: post.excerpt, alternates: { canonical: `https://crystllabs.com/blog/${slug}.html` } };
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getPosts('alpha').map((p) => ({ slug: p.slug }));
}

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost('alpha', slug);
  if (!post) return notFound();
  return (
    <div className="wrap">
      <article className={styles.article}>
        <Link href="/alpha" className={styles.back}>← All writing</Link>
        <header className={styles.header}>
          <time className={styles.meta} dateTime={post.date.split('T')[0]}>{day(post.date)}</time>
          <h1 className={styles.title}>{post.title}</h1>
          <p className={styles.byline}>By AP39</p>
        </header>
        <div className={styles.content}>{renderContent(post.content)}</div>
      </article>
    </div>
  );
}
