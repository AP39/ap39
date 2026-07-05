'use client';

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  useEffect(() => {
    const delay = setTimeout(() => {
      setActiveIndex(0);
    }, 1000);

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % 3);
    }, 3000);

    return () => {
      clearTimeout(delay);
      clearInterval(interval);
    };
  }, []);

  return (
    <main className={styles.main}>
      <nav className={styles.nav}>
        <span className={styles.brand}>AP39.</span>
        <span className={styles.status}>SECURE_CONNECTION</span>
      </nav>

      <div className={styles.centerStage}>
        <div className={styles.buttonStack}>
          
          <div className={`${styles.buttonWrapper} ${styles.buttonWork} ${activeIndex === 0 ? styles.activeMobile : ""}`}>
            <Link href="/work" className={styles.insaneButton}>
              <span className={styles.buttonText}>REPO</span>
              <div className={styles.buttonGlow}></div>
              <div className={styles.buttonBorder}></div>
            </Link>
          </div>

          <div className={`${styles.buttonWrapper} ${styles.buttonAlpha} ${activeIndex === 1 ? styles.activeMobile : ""}`}>
            <Link href="/alpha" className={styles.insaneButton}>
              <span className={styles.buttonText}>ALPHA</span>
              <div className={styles.buttonGlow}></div>
              <div className={styles.buttonBorder}></div>
            </Link>
          </div>

          <div className={`${styles.buttonWrapper} ${styles.buttonContact} ${activeIndex === 2 ? styles.activeMobile : ""}`}>
            <Link href="/contact" className={styles.insaneButton}>
              <span className={styles.buttonText}>PING</span>
              <div className={styles.buttonGlow}></div>
              <div className={styles.buttonBorder}></div>
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}
