import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <main className={styles.main}>
      <nav className={styles.nav}>
        <span className={styles.brand}>AP39.</span>
        <span className={styles.status}>SECURE_CONNECTION</span>
      </nav>

      <div className={styles.centerStage}>
        <div className={styles.buttonStack}>
          
          <div className={`${styles.buttonWrapper} ${styles.buttonWork}`}>
            <Link href="/work" className={styles.insaneButton}>
              <span className={styles.buttonText}>WORK</span>
              <div className={styles.buttonGlow}></div>
              <div className={styles.buttonBorder}></div>
            </Link>
          </div>

          <div className={`${styles.buttonWrapper} ${styles.buttonAlpha}`}>
            <Link href="/alpha" className={styles.insaneButton}>
              <span className={styles.buttonText}>ALPHA</span>
              <div className={styles.buttonGlow}></div>
              <div className={styles.buttonBorder}></div>
            </Link>
          </div>

          <div className={`${styles.buttonWrapper} ${styles.buttonContact}`}>
            <Link href="/contact" className={styles.insaneButton}>
              <span className={styles.buttonText}>LINK</span>
              <div className={styles.buttonGlow}></div>
              <div className={styles.buttonBorder}></div>
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}
