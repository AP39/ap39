import type { Metadata } from 'next';
import { getPosts } from '@/lib/posts';
import { PostList } from '@/components/Cards';

// The AP39 blog (owner 2026-10-27). Posts are src/data/blog/<slug>.json (see the README there). Unlike the alpha
// write-ups these are originals with their canonical on ap39.site. While empty the page stays out of search.
export function generateMetadata(): Metadata {
  return {
    title: 'Blog | AP39',
    description: 'Notes from AP39.',
    alternates: { canonical: '/blog' },
    robots: getPosts('blog').length ? undefined : { index: false, follow: true },
  };
}

export default function Blog() {
  return (
    <div className="wrap">
      <section className="page-title"><h1>Blog</h1><p>Notes from AP39.</p></section>
      <section className="section"><PostList posts={getPosts('blog')} base="/blog" /></section>
    </div>
  );
}
