'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

interface Work {
  title: string;
  slug: string;
  excerpt: string;
}

export default function WorkGrid({ works }: { works: Work[] }) {
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  useEffect(() => {
    if (works.length === 1) {
      setActiveIndex(0);
      return;
    }

    if (works.length > 1) {
      setActiveIndex(0);
      const interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % works.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [works.length]);

  return (
    <div className={styles.grid}>
      {works.map((work, i) => (
        <Link
          href={`/work/${work.slug}`}
          key={work.slug}
          className={`${styles.card} ${activeIndex === i ? styles.activeMobile : ''}`}
        >
          <h2 className={styles.cardTitle}>{work.title}</h2>
          <p className={styles.cardExcerpt}>{work.excerpt}</p>
          <div className={styles.scanline}></div>
        </Link>
      ))}
    </div>
  );
}
