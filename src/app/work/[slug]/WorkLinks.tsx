'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

interface LinkItem {
  name: string;
  url: string;
}

export default function WorkLinks({ links }: { links: LinkItem[] }) {
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  useEffect(() => {
    if (links.length === 1) {
      setActiveIndex(0);
      return;
    }

    if (links.length > 1) {
      setActiveIndex(0);
      const interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % links.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [links.length]);

  return (
    <div className={styles.linkGrid}>
      {links.map((link, i) => {
        const isPlay = link.name.toLowerCase().includes('play');
        const isActive = activeIndex === i;
        const btnClass = isPlay ? styles.btnPlay : styles.btnPreview;
        const activeClass = isActive ? styles.activeMobile : '';

        return (
          <a
            key={i}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.storeLink} ${btnClass} ${activeClass}`}
          >
            <span className={styles.linkText}>{link.name}</span>
            <div className={styles.linkGlow}></div>
            <div className={styles.linkBorder}></div>
          </a>
        );
      })}
    </div>
  );
}
