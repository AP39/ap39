import styles from './page.module.css';
import Link from 'next/link';
import SiteLinks from '@/app/SiteLinks';

export default function Contact() {
  return (
    <main className={styles.main}>
      <nav className="siteNav">
        <Link href="/" className="siteBrand"><img src="/crown.png" alt="" className="siteCrown" width={26} height={26} />AP39.</Link>
        <SiteLinks />
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
