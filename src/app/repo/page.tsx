import Link from 'next/link';
import SiteLinks from '@/app/SiteLinks';
import styles from './page.module.css';
import repo from '../../data/repo.json';
import FrontierRow from './FrontierRow';

export default function RepoIndex() {
  const { frontier, apps } = repo;

  return (
    <main className={styles.main}>
      <nav className="siteNav">
        <Link href="/" className="siteBrand"><img src="/crown.png" alt="" className="siteCrown" width={26} height={26} />AP39.</Link>
        <SiteLinks />
      </nav>

      <div className={styles.container}>
        <section className={styles.section}>
          <h2 className={styles.sectionLabel}>CURRENT FRONTIER</h2>
          <FrontierRow items={frontier} />
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionLabel}>APPS</h2>
          <div className={styles.appGrid}>
            {apps.map((app) => (
              <div key={app.name} className={`${styles.app} ${styles.appLive}`}>
                <img src={app.icon} alt="" className={styles.appIcon} loading="lazy" />
                <span className={styles.appName}>{app.name}</span>
                <span className={styles.appBlurb}>{app.blurb}</span>
                <div className={styles.links}>
                  {app.play && <a href={app.play} className={styles.link}>Play</a>}
                  {app.itch && <a href={app.itch} className={styles.link}>itch.io</a>}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
