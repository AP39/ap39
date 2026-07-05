import styles from './page.module.css';
import Link from 'next/link';

export default function Contact() {
  return (
    <main className={styles.main}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.brand}>AP39.</Link>
        <span className={styles.status}>// LINK_ESTABLISHED</span>
      </nav>
      
      <div className={styles.center}>
        <div className={`${styles.buttonWrapper} ${styles.buttonEmail}`}>
          <a href="https://t.me/ap39ap39" target="_blank" rel="noopener noreferrer" className={styles.insaneButton}>
            <span className={styles.buttonText}>@ap39ap39</span>
            <div className={styles.buttonGlow}></div>
            <div className={styles.buttonBorder}></div>
          </a>
        </div>
      </div>
    </main>
  );
}
