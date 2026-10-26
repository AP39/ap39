import type { Metadata } from 'next';
import repo from '../../data/repo.json';
import { ProjectCard } from '@/components/Cards';

export const metadata: Metadata = { title: 'Work | AP39', description: 'Sites and released apps and games built by AP39 at Crystl Labs.', alternates: { canonical: '/repo' } };

export default function Work() {
  const { frontier, apps } = repo;
  return (
    <div className="wrap">
      <section className="page-title">
        <h1>Work</h1>
        <p>Live sites first, then every released app and game, with links to Google Play and itch.io.</p>
      </section>
      <section className="section">
        <div className="section-head"><h2>Sites</h2></div>
        <div className="grid wide">{frontier.map((p) => <ProjectCard key={p.name} p={p} site />)}</div>
      </section>
      <section className="section">
        <div className="section-head"><h2>Released apps and games</h2><span className="tag">{apps.length}</span></div>
        <div className="grid">{apps.map((p) => <ProjectCard key={p.name} p={p} />)}</div>
      </section>
    </div>
  );
}
