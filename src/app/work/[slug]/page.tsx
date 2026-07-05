import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import styles from './page.module.css';

interface Work {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  links: { name: string; url: string }[];
}

async function getWork(slug: string): Promise<Work | null> {
  const filePath = path.join(process.cwd(), 'src/data/work', `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content) as Work;
}

export default async function WorkPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const work = await getWork(slug);
  
  if (!work) return notFound();

  return (
    <main className={styles.main}>
      <nav className={styles.nav}>
        <Link href="/work" className={styles.brand}>&lt; RETURN</Link>
        <span className={styles.status}>// DECRYPTED_ASSET</span>
      </nav>

      <article className={styles.article}>
        <header className={styles.header}>
          <h1 className={styles.title}>{work.title}</h1>
        </header>

        <div className={styles.content}>
          {work.content.split('\n').map((paragraph, idx) => (
            paragraph ? <p key={idx}>{paragraph}</p> : <br key={idx} />
          ))}
        </div>

        {work.links && work.links.length > 0 && (
          <div className={styles.links}>
            <h3 className={styles.linksHeader}>EXTERNAL_LINKS</h3>
            <div className={styles.linkGrid}>
              {work.links.map((link, i) => (
                <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className={styles.storeLink}>
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </article>
    </main>
  );
}
