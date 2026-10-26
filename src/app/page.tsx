import Link from 'next/link';
import repo from '../data/repo.json';
import { getPosts } from '@/lib/posts';
import { PostList, ProjectCard } from '@/components/Cards';

export default function Home() {
  const { frontier, apps } = repo;
  const writing = getPosts('alpha').slice(0, 3);
  return (
    <div className="wrap">
      <section className="hero">
        <h1>AP39</h1>
        <p>
          Senior lead developer at Crystl Labs. I design, build and ship products end to end: {apps.length} released apps
          and games, and the sites below.
        </p>
        <div className="actions">
          <Link href="/repo" className="btn">See the work</Link>
          <Link href="/contact" className="btn ghost">Get in touch</Link>
        </div>
      </section>

      <section className="section">
        <div className="section-head"><h2>Selected work</h2></div>
        <div className="grid wide">
          {frontier.map((p) => <ProjectCard key={p.name} p={p} site />)}
        </div>
      </section>

      <section className="section">
        <div className="section-head"><h2>Released apps</h2><Link href="/repo">All {apps.length} →</Link></div>
        <div className="grid">
          {apps.slice(0, 6).map((p) => <ProjectCard key={p.name} p={p} />)}
        </div>
      </section>

      <section className="section">
        <div className="section-head"><h2>Writing</h2><Link href="/alpha">All posts →</Link></div>
        <PostList posts={writing} base="/alpha" />
      </section>
    </div>
  );
}
