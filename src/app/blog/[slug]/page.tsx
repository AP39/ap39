import Link from 'next/link';
import { notFound } from 'next/navigation';
import { renderContent } from '@/lib/PostContent';
import { day, getPost, getPosts } from '@/lib/posts';
import styles from '../../alpha/[slug]/page.module.css';

// AP39 blog posts: originals, canonical on ap39.site.
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost('blog', slug);
  if (!post) return {};
  return { title: `${post.title} | AP39`, description: post.excerpt, alternates: { canonical: `/blog/${slug}` } };
}

export const dynamicParams = false;

// output: export refuses an empty list, so before the first post one placeholder path is built; it renders the
// not-found page and is in no sitemap or link.
export function generateStaticParams() {
  const slugs = getPosts('blog').map((p) => ({ slug: p.slug }));
  return slugs.length ? slugs : [{ slug: 'none' }];
}

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost('blog', slug);
  if (!post) return notFound();
  return (
    <div className="wrap">
      <article className={styles.article}>
        <Link href="/blog" className={styles.back}>← Blog</Link>
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
