import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import styles from './page.module.css';

import AlphaList from './AlphaList';

interface Post {
  title: string;
  slug: string;
  date: string;
  excerpt: string;
}

async function getPosts(): Promise<Post[]> {
  const dataDir = path.join(process.cwd(), 'src/data/alpha');
  if (!fs.existsSync(dataDir)) return [];
  
  const files = fs.readdirSync(dataDir);
  const posts = files
    .filter(file => file.endsWith('.json'))
    .map(file => {
      const filePath = path.join(dataDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content) as Post;
    });
    
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export default async function AlphaIndex() {
  const posts = await getPosts();
  
  return (
    <main className={styles.main}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.brand}>AP39.</Link>
        <span className={styles.status}>// ALPHA_STREAM</span>
      </nav>

      <div className={styles.container}>
        {posts.length > 0 ? (
          <AlphaList posts={posts} />
        ) : (
          <p className={styles.empty}>NO_DATA_FOUND // AWAITING_INPUT</p>
        )}
      </div>
    </main>
  );
}
