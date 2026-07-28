'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

interface Post {
  title: string;
  slug: string;
  date: string;
  excerpt: string;
}

export default function AlphaList({ posts }: { posts: Post[] }) {
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  useEffect(() => {
    if (posts.length === 1) {
      setActiveIndex(0);
      return;
    }

    if (posts.length > 1) {
      setActiveIndex(0);
      const interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % posts.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [posts.length]);

  return (
    <div className={styles.postList}>
      {posts.map((post, i) => (
        <Link
          href={`/alpha/${post.slug}`}
          key={post.slug}
          className={`${styles.postCard} ${activeIndex === i ? styles.activeMobile : ''}`}
        >
          <div className={styles.postMeta}>
            <span className={styles.postIndex}>{String(posts.length - i).padStart(3, '0')}</span>
            {post.date.split('T')[0]}
          </div>
          <h2 className={styles.postTitle}>{post.title}</h2>
          <p className={styles.postExcerpt}>{post.excerpt}</p>
          <div className={styles.scanline}></div>
        </Link>
      ))}
    </div>
  );
}
