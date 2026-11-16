import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import SiteLinks from '@/app/SiteLinks';
import styles from './page.module.css';

import AlphaList from './AlphaList';

interface Post {
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  basePath?: string;
}

// "Writing" (/alpha) is the page the front page's WRITING button and the top bar open, so it lists
// every post: the four Jul-Aug essays here plus the weekly blog posts in src/data/blog (owner
// 2026-11-16: the blog was only reachable from the footer, so Writing looked dead after 18 Aug).
// Each post keeps its own address (/alpha/... or /blog/...).
function readDir(dir: string, basePath: string): Post[] {
  const dataDir = path.join(process.cwd(), dir);
  if (!fs.existsSync(dataDir)) return [];
  return fs.readdirSync(dataDir)
    .filter(file => file.endsWith('.json'))
    .map(file => {
      const post = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf-8')) as Post;
      return { title: post.title, slug: post.slug, date: post.date, excerpt: post.excerpt, basePath };
    });
}

async function getPosts(): Promise<Post[]> {
  const posts = [...readDir('src/data/alpha', '/alpha'), ...readDir('src/data/blog', '/blog')];
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export default async function AlphaIndex() {
  const posts = await getPosts();
  
  return (
    <main className={styles.main}>
      <nav className="siteNav">
        <Link href="/" className="siteBrand"><img src="/crown.png" alt="" className="siteCrown" width={26} height={26} />AP39.</Link>
        <SiteLinks />
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
