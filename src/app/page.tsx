'use client';

import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <main className={styles.main}>
      <nav className="siteNav">
        <span className="siteBrand"><img src="/crown.png" alt="" className="siteCrown" width={26} height={26} />AP39.</span>
        <span className="siteStatus">SECURE_CONNECTION</span>
      </nav>

      <div className={styles.centerStage}>
        <div className={styles.buttonStack}>
          
          <div className={`${styles.buttonWrapper} ${styles.buttonWork}`}>
            <Link href="/repo" className={styles.insaneButton}>
              <span className={styles.buttonText}>WORK</span>
              <div className={styles.buttonGlow}></div>
              <div className={styles.buttonBorder}></div>
            </Link>
          </div>

          <div className={`${styles.buttonWrapper} ${styles.buttonAlpha}`}>
            <Link href="/alpha" className={styles.insaneButton}>
              <span className={styles.buttonText}>WRITING</span>
              <div className={styles.buttonGlow}></div>
              <div className={styles.buttonBorder}></div>
            </Link>
          </div>

          <div className={`${styles.buttonWrapper} ${styles.buttonContact}`}>
            <Link href="/contact" className={styles.insaneButton}>
              <span className={styles.buttonText}>CONTACT</span>
              <div className={styles.buttonGlow}></div>
              <div className={styles.buttonBorder}></div>
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}
