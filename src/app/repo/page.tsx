import Link from 'next/link';
import styles from './page.module.css';
import repo from '../../data/repo.json';
import FrontierRow from './FrontierRow';

export default function RepoIndex() {
  const { frontier, apps } = repo;

  return (
    <main className={styles.main}>
      <nav className="siteNav">
        <Link href="/" className="siteBrand">AP39.</Link>
        <span className="siteStatus">// DECRYPT_REPO</span>
      </nav>

      <div className={styles.container}>
        <section className={styles.section}>
          <h2 className={styles.sectionLabel}>CURRENT FRONTIER</h2>
          <FrontierRow items={frontier} />
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionLabel}>APPS</h2>
          <div className={styles.appGrid}>
            {apps.map((app) => {
              const inner = (
                <>
                  <img src={app.icon} alt="" className={styles.appIcon} loading="lazy" />
                  <span className={styles.appName}>{app.name}</span>
                </>
              );
              return app.url ? (
                <a key={app.name} href={app.url} className={`${styles.app} ${styles.appLive}`}>{inner}</a>
              ) : (
                <div key={app.name} className={styles.app}>{inner}</div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
