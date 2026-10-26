import Link from 'next/link';
import type { Post } from '@/lib/posts';
import { day } from '@/lib/posts';

export interface Project { name: string; blurb: string; site?: string | null; play?: string | null; itch?: string | null; icon?: string; status?: string }

export function ProjectCard({ p, site = false }: { p: Project; site?: boolean }) {
  return (
    <div className={site ? 'card site' : 'card'}>
      <div className="card-top">
        {p.icon && <img src={p.icon} alt="" loading="lazy" />}
        <div>
          <h3>{p.name}</h3>
          {p.status && <span className="tag">{p.status}</span>}
        </div>
      </div>
      <p>{p.blurb}</p>
      <div className="links">
        {p.site && <a href={p.site}>Website</a>}
        {p.play && <a href={p.play}>Google Play</a>}
        {p.itch && <a href={p.itch}>itch.io</a>}
      </div>
    </div>
  );
}

export function PostList({ posts, base }: { posts: Post[]; base: string }) {
  if (!posts.length) return <p className="empty">The first post is on its way.</p>;
  return (
    <ul className="posts">
      {posts.map((p) => (
        <li key={p.slug}>
          <Link href={`${base}/${p.slug}`}>
            <time dateTime={p.date.split('T')[0]}>{day(p.date)}</time>
            <h3>{p.title}</h3>
            <p>{p.excerpt}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
