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
        <a href="mailto:ap39ap39@gmail.com" className={styles.email}>
          ap39ap39@gmail.com
        </a>
      </div>
    </main>
  );
}
