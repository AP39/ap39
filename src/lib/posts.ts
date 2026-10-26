// Reads the JSON posts in src/data/<folder> (alpha: the crystllabs.com write-ups; blog: AP39's own posts).
import fs from 'fs';
import path from 'path';

export interface Post { title: string; slug: string; date: string; excerpt: string; content: string }

const dir = (folder: string) => path.join(process.cwd(), 'src/data', folder);

export function getPosts(folder: 'alpha' | 'blog'): Post[] {
  if (!fs.existsSync(dir(folder))) return [];
  return fs.readdirSync(dir(folder))
    .filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(fs.readFileSync(path.join(dir(folder), f), 'utf-8')) as Post)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPost(folder: 'alpha' | 'blog', slug: string): Post | null {
  const file = path.join(dir(folder), `${slug}.json`);
  return fs.existsSync(file) ? (JSON.parse(fs.readFileSync(file, 'utf-8')) as Post) : null;
}

export const day = (iso: string) => new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
