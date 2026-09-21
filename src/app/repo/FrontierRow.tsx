'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

interface Frontier {
  name: string;
  blurb: string;
  url?: string | null;
  icon?: string;
  featured?: boolean;
  status?: string;
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
      {items.map((item, i) => {
        const className = `${styles.frontierCard} ${item.featured ? styles.frontierFeatured : ''} ${activeIndex === i ? styles.activeMobile : ''} ${item.url ? styles.frontierLive : ''}`;
        const inner = (
          <>
            {item.icon && <img src={item.icon} alt="" className={styles.frontierIcon} />}
            <h3 className={styles.frontierName}>{item.name}</h3>
            <p className={styles.frontierBlurb}>{item.blurb}</p>
            {item.status && <span className={styles.frontierStatus}>{item.status}</span>}
            <div className={styles.scanline}></div>
          </>
        );
        return item.url ? (
          <a key={item.name} href={item.url} className={className}>{inner}</a>
        ) : (
          <div key={item.name} className={className}>{inner}</div>
        );
      })}
    </div>
  );
}
