import Link from 'next/link';
import styles from './page.module.css';
import repo from '../../data/repo.json';
import FrontierRow from './FrontierRow';

export default function WorkIndex() {
  const { frontier, sites, apps } = repo;

  return (
    <main className={styles.main}>
      <nav className="siteNav">
        <Link href="/" className="siteBrand">AP39.</Link>
        <span className="siteStatus">// DECRYPT_WORK</span>
      </nav>

      <div className={styles.container}>
        <section className={styles.section}>
          <h2 className={styles.sectionLabel}>CURRENT FRONTIER</h2>
          <FrontierRow items={frontier} />
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionLabel}>SITES</h2>
          <ul className={styles.siteList}>
            {sites.map((site) => (
              <li key={site.name} className={styles.siteItem}>
                {site.url ? (
                  <a href={site.url} className={styles.siteLink}>{site.name}</a>
                ) : (
                  <span className={styles.siteDead}>{site.name}</span>
                )}
              </li>
            ))}
          </ul>
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
