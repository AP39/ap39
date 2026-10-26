// Shared post renderer for /alpha and /blog: a light markdown subset (## headers, ``` code fences, tables,
// images, lists, **bold** and *italic*). Moved here from src/app/alpha/[slug]/page.tsx on 2026-10-27 unchanged.
import { Fragment, type ReactNode } from 'react';
import styles from '../app/alpha/[slug]/page.module.css';

// Inline bold/italic: **text** -> <strong>, *text* -> <em>
function renderInline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

// Splits a `| a | b |` row into trimmed cells, honoring `\|` as an escaped literal pipe.
function parseTableRow(line: string): string[] {
  const trimmed = line.trim().replace(/^\|/, '').replace(/\|$/, '');
  return trimmed.split(/(?<!\\)\|/).map((cell) => cell.trim().replace(/\\\|/g, '|'));
}

function isTableBlock(lines: string[]): boolean {
  return lines.length >= 2 && lines[0].trim().startsWith('|') && /^\|?[\s:|-]+\|?$/.test(lines[1].trim());
}

function renderTable(lines: string[], idx: number): ReactNode {
  const header = parseTableRow(lines[0]);
  const rows = lines.slice(2).map(parseTableRow);
  return (
    <div key={idx} className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>{header.map((h, i) => <th key={i}>{renderInline(h)}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>{row.map((c, ci) => <td key={ci}>{renderInline(c)}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Lightweight block renderer: ## headers, ``` code fences, tables, images, and paragraphs.
export function renderContent(content: string): ReactNode[] {
  return content.split('\n\n').map((block, idx) => {
    if (block.startsWith('```')) {
      const code = block.replace(/^```[^\n]*\n/, '').replace(/\n```\s*$/, '');
      return (
        <pre key={idx} className={styles.code}>
          <code>{code}</code>
        </pre>
      );
    }

    const lines = block.split('\n').filter(Boolean);
    if (isTableBlock(lines)) {
      return renderTable(lines, idx);
    }

    if (lines.length > 0 && lines.every((l) => l.trim().startsWith('- '))) {
      return (
        <ul key={idx} className={styles.list}>
          {lines.map((l, li) => <li key={li}>{renderInline(l.trim().slice(2))}</li>)}
        </ul>
      );
    }

    const imageMatch = block.trim().match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imageMatch) {
      const [, alt, src] = imageMatch;
      // eslint-disable-next-line @next/next/no-img-element
      return <img key={idx} src={src} alt={alt} className={styles.image} />;
    }

    if (block.startsWith('## ')) {
      return <h2 key={idx} className={styles.section}>{block.slice(3)}</h2>;
    }
    return <p key={idx}>{renderInline(block)}</p>;
  });
}

