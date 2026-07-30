'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

interface Frontier {
  name: string;
  blurb: string;
}

export default function FrontierRow({ items }: { items: Frontier[] }) {
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  useEffect(() => {
    if (items.length === 1) {
      setActiveIndex(0);
      return;
    }

    if (items.length > 1) {
      setActiveIndex(0);
      const interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % items.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [items.length]);

  return (
    <div className={styles.frontierGrid}>
      {items.map((item, i) => (
        <div
          key={item.name}
          className={`${styles.frontierCard} ${activeIndex === i ? styles.activeMobile : ''}`}
        >
          <h3 className={styles.frontierName}>{item.name}</h3>
          <p className={styles.frontierBlurb}>{item.blurb}</p>
          <div className={styles.scanline}></div>
        </div>
      ))}
    </div>
  );
}
