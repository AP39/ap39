import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import styles from './page.module.css';

import WorkLinks from './WorkLinks';

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

export function generateStaticParams() {
  const dir = path.join(process.cwd(), 'src/data/work');
  return fs.readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => ({ slug: f.replace(/\.json$/, '') }));
}

export default async function WorkPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const work = await getWork(slug);
  
  if (!work) return notFound();

  return (
    <main className={styles.main}>
      <nav className="siteNav">
        <Link href="/" className="siteBrand">AP39.</Link>
        <span className="siteStatus">// DECRYPTED_ASSET</span>
      </nav>

      <Link href="/work" className="returnLink">&lt; RETURN</Link>

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
            <WorkLinks links={work.links} />
          </div>
        )}
      </article>
    </main>
  );
}
