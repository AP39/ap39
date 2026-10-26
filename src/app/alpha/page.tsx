import type { Metadata } from 'next';
import { getPosts } from '@/lib/posts';
import { PostList } from '@/components/Cards';

export const metadata: Metadata = { title: 'Writing | AP39', description: 'Engineering write-ups by AP39: what was measured, what it cost and what changed.', alternates: { canonical: '/alpha' } };

export default function Writing() {
  return (
    <div className="wrap">
      <section className="page-title">
        <h1>Writing</h1>
        <p>Engineering write-ups: what was measured, what it cost, and what changed because of it.</p>
      </section>
      <section className="section"><PostList posts={getPosts('alpha')} base="/alpha" /></section>
    </div>
  );
}
