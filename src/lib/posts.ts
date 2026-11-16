import fs from 'fs';
import path from 'path';

// ONE writing page (owner 2026-11-16): /blog lists every post, newest first. The four Jul-Aug essays
// stay in src/data/alpha at their old /alpha/<slug> addresses; the weekly posts are src/data/blog.
// /alpha itself only forwards to /blog.
export interface PostSummary {
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  basePath: string;
}

function readDir(dir: string, basePath: string): PostSummary[] {
  const dataDir = path.join(process.cwd(), dir);
  if (!fs.existsSync(dataDir)) return [];
  return fs.readdirSync(dataDir)
    .filter((file) => file.endsWith('.json'))
    .map((file) => {
      const post = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf-8')) as PostSummary;
      return { title: post.title, slug: post.slug, date: post.date, excerpt: post.excerpt, basePath };
    });
}

export function getAllPosts(): PostSummary[] {
  return [...readDir('src/data/alpha', '/alpha'), ...readDir('src/data/blog', '/blog')]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
