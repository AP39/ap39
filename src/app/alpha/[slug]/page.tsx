import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Fragment, type ReactNode } from 'react';
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

export function generateStaticParams() {
  const dir = path.join(process.cwd(), 'src/data/alpha');
  return fs.readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => ({ slug: f.replace(/\.json$/, '') }));
}

// Inline bold: **text** -> <strong>text</strong>
function renderInline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

// Lightweight block renderer: ## headers, ``` code fences, and paragraphs.
function renderContent(content: string): ReactNode[] {
  return content.split('\n\n').map((block, idx) => {
    if (block.startsWith('```')) {
      const code = block.replace(/^```[^\n]*\n/, '').replace(/\n```\s*$/, '');
      return (
        <pre key={idx} className={styles.code}>
          <code>{code}</code>
        </pre>
      );
    }
    if (block.startsWith('## ')) {
      return <h2 key={idx} className={styles.section}>{block.slice(3)}</h2>;
    }
    return <p key={idx}>{renderInline(block)}</p>;
  });
}

export default async function AlphaPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) return notFound();

  return (
    <main className={styles.main}>
      <nav className="siteNav">
        <Link href="/" className="siteBrand">AP39.</Link>
        <span className="siteStatus">// DECRYPTED_PAYLOAD</span>
      </nav>

      <Link href="/alpha" className="returnLink">&lt; RETURN</Link>

      <article className={styles.article}>
        <header className={styles.header}>
          <div className={styles.meta}>
             {post.date.split('T')[0]}
          </div>
          <h1 className={styles.title}>{post.title}</h1>
          <div className={styles.byline}>WRITTEN BY AP39</div>
        </header>

        <div className={styles.content}>
          {renderContent(post.content)}
        </div>
      </article>
    </main>
  );
}
