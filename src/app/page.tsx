import Link from 'next/link';
import styles from './page.module.css';

const destinations = [
  { href: '/repo', label: 'REPO', code: '01', shape: 'repo' },
  { href: '/alpha', label: 'ALPHA', code: '02', shape: 'alpha' },
  { href: '/contact', label: 'PING', code: '03', shape: 'ping' },
] as const;

export default function Home() {
  return (
    <main className={styles.main}>
      <nav className="siteNav">
        <span className="siteBrand">AP39.</span>
        <span className="siteStatus"><i className={styles.statusDot} /> SECURE_CONNECTION</span>
      </nav>

      <section className={styles.selector} aria-label="Primary navigation">
        <p className={styles.prompt}>SELECT_DESTINATION</p>

        <div className={styles.icons}>
          {destinations.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.iconLink} ${styles[item.shape]}`}
              aria-label={`Open ${item.label}`}
            >
              <span className={styles.shape}>
                <span className={styles.shapeGraphic} aria-hidden="true">
                  {item.shape === 'repo' && <><i /><i /><i /></>}
                  {item.shape === 'alpha' && <><i /><b>α</b></>}
                  {item.shape === 'ping' && <><i /><i /><b /></>}
                </span>
              </span>
              <span className={styles.labelRow}>
                <small>/{item.code}</small>
                <strong>{item.label}</strong>
              </span>
            </Link>
          ))}
        </div>

        <p className={styles.hint}>HOVER TO INITIALIZE</p>
      </section>

      <div className={styles.systemMeta} aria-hidden="true">
        <span>SYS_039</span>
        <span>3 NODES ONLINE</span>
      </div>
    </main>
  );
}
