import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import styles from './page.module.css';

interface Post {
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  content: string;
}

async function getPost(slug: string): Promise<Post | null> {
  const filePath = path.join(process.cwd(), 'src/data/alpha', `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content) as Post;
}

export default async function AlphaPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  
  if (!post) return notFound();

  return (
    <main className={styles.main}>
      <nav className={styles.nav}>
        <Link href="/alpha" className={styles.brand}>&lt; RETURN</Link>
        <span className={styles.status}>// DECRYPTED_PAYLOAD</span>
      </nav>

      <article className={styles.article}>
        <header className={styles.header}>
          <div className={styles.meta}>
             {post.date.split('T')[0]}
          </div>
          <h1 className={styles.title}>{post.title}</h1>
        </header>

        <div className={styles.content}>
          {post.content.split('\n').map((paragraph, idx) => (
            paragraph ? <p key={idx}>{paragraph}</p> : <br key={idx} />
          ))}
        </div>
      </article>
    </main>
  );
}
