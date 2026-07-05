import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import styles from './page.module.css';

interface Work {
  title: string;
  slug: string;
  excerpt: string;
}

import WorkGrid from './WorkGrid';

interface Work {
  title: string;
  slug: string;
  excerpt: string;
}

async function getWorks(): Promise<Work[]> {
  const dataDir = path.join(process.cwd(), 'src/data/work');
  if (!fs.existsSync(dataDir)) return [];
  
  const files = fs.readdirSync(dataDir);
  return files
    .filter(file => file.endsWith('.json'))
    .map(file => {
      const content = fs.readFileSync(path.join(dataDir, file), 'utf-8');
      return JSON.parse(content) as Work;
    });
}

export default async function WorkIndex() {
  const works = await getWorks();
  
  return (
    <main className={styles.main}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.brand}>AP39.</Link>
        <span className={styles.status}>// DECRYPT_WORK</span>
      </nav>

      <div className={styles.container}>
        {works.length > 0 ? (
          <WorkGrid works={works} />
        ) : (
          <p className={styles.empty}>NO_WORK_FOUND</p>
        )}
      </div>
    </main>
  );
}
