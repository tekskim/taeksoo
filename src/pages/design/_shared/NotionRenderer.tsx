import { Fragment, useMemo } from 'react';

interface NotionRendererProps {
  markdown: string;
  className?: string;
}

/**
 * Notion에서 동기화된 마크다운을 디자인 시스템 토큰 기반으로 렌더링합니다.
 * notion-to-md가 생성하는 마크다운 포맷을 지원합니다.
 */
export function NotionRenderer({ markdown, className = '' }: NotionRendererProps) {
  const elements = useMemo(() => parseMarkdown(markdown), [markdown]);

  if (!markdown.trim()) return null;

  return (
    <div className={`notion-content space-y-3 ${className}`}>
      {elements.map((el, i) => (
        <MarkdownElement key={i} element={el} />
      ))}
    </div>
  );
}

// --- Parser ---

interface MdElement {
  type:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'paragraph'
    | 'ul'
    | 'ol'
    | 'code'
    | 'divider'
    | 'blockquote'
    | 'table';
  content: string;
  items?: string[];
  language?: string;
  rows?: string[][];
}

function parseMarkdown(md: string): MdElement[] {
  const lines = md.split('\n');
  const elements: MdElement[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('# ')) {
      elements.push({ type: 'h1', content: line.slice(2) });
      i++;
    } else if (line.startsWith('## ')) {
      elements.push({ type: 'h2', content: line.slice(3) });
      i++;
    } else if (line.startsWith('### ')) {
      elements.push({ type: 'h3', content: line.slice(4) });
      i++;
    } else if (line.startsWith('---')) {
      elements.push({ type: 'divider', content: '' });
      i++;
    } else if (line.startsWith('> ')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith('> ')) {
        quoteLines.push(lines[i].slice(2));
        i++;
      }
      elements.push({ type: 'blockquote', content: quoteLines.join('\n') });
    } else if (line.startsWith('- ')) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith('- ')) {
        items.push(lines[i].slice(2));
        i++;
      }
      elements.push({ type: 'ul', content: '', items });
    } else if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s/, ''));
        i++;
      }
      elements.push({ type: 'ol', content: '', items });
    } else if (line.startsWith('```')) {
      const language = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      elements.push({ type: 'code', content: codeLines.join('\n'), language });
    } else if (line.startsWith('|')) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].startsWith('|')) {
        const row = lines[i]
          .split('|')
          .slice(1, -1)
          .map((cell) => cell.trim());
        if (!row.every((cell) => /^-+$/.test(cell))) {
          rows.push(row);
        }
        i++;
      }
      elements.push({ type: 'table', content: '', rows });
    } else if (line.trim()) {
      elements.push({ type: 'paragraph', content: line });
      i++;
    } else {
      i++;
    }
  }

  return elements;
}

// --- Renderer ---

function MarkdownElement({ element }: { element: MdElement }) {
  switch (element.type) {
    case 'h1':
      return (
        <h3 className="text-heading-h4 text-[var(--color-text-default)]">
          <InlineMarkdown text={element.content} />
        </h3>
      );
    case 'h2':
      return (
        <h4 className="text-heading-h5 text-[var(--color-text-default)]">
          <InlineMarkdown text={element.content} />
        </h4>
      );
    case 'h3':
      return (
        <h5 className="text-heading-h6 text-[var(--color-text-default)]">
          <InlineMarkdown text={element.content} />
        </h5>
      );
    case 'paragraph':
      return (
        <p className="text-body-md text-[var(--color-text-muted)] leading-relaxed">
          <InlineMarkdown text={element.content} />
        </p>
      );
    case 'ul':
      return (
        <ul className="list-disc pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
          {element.items?.map((item, i) => (
            <li key={i}>
              <InlineMarkdown text={item} />
            </li>
          ))}
        </ul>
      );
    case 'ol':
      return (
        <ol className="list-decimal pl-5 text-body-md text-[var(--color-text-muted)] space-y-1">
          {element.items?.map((item, i) => (
            <li key={i}>
              <InlineMarkdown text={item} />
            </li>
          ))}
        </ol>
      );
    case 'code':
      return (
        <pre className="p-3 bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[var(--primitive-radius-md)] overflow-x-auto">
          <code className="text-body-sm text-[var(--color-text-default)] font-mono">
            {element.content}
          </code>
        </pre>
      );
    case 'divider':
      return <div className="w-full h-px bg-[var(--color-border-default)]" />;
    case 'blockquote':
      return (
        <blockquote className="pl-4 border-l-2 border-[var(--color-border-strong)] text-body-md text-[var(--color-text-muted)] italic">
          <InlineMarkdown text={element.content} />
        </blockquote>
      );
    case 'table':
      if (!element.rows || element.rows.length === 0) return null;
      return (
        <div className="overflow-x-auto">
          <table className="w-full text-body-md text-[var(--color-text-default)] border-collapse">
            <thead>
              <tr>
                {element.rows[0].map((cell, j) => (
                  <th
                    key={j}
                    className="text-left text-label-md font-medium p-2 bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)]"
                  >
                    <InlineMarkdown text={cell} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {element.rows.slice(1).map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className="p-2 border border-[var(--color-border-default)] align-top"
                    >
                      <InlineMarkdown text={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    default:
      return null;
  }
}

function InlineMarkdown({ text }: { text: string }) {
  const parts = parseInline(text);
  return (
    <>
      {parts.map((part, i) => {
        if (part.type === 'bold') return <strong key={i}>{part.text}</strong>;
        if (part.type === 'italic') return <em key={i}>{part.text}</em>;
        if (part.type === 'strikethrough') return <del key={i}>{part.text}</del>;
        if (part.type === 'link')
          return (
            <a
              key={i}
              href={part.href}
              className="text-[var(--color-state-info)] hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {part.text}
            </a>
          );
        return <Fragment key={i}>{part.text}</Fragment>;
      })}
    </>
  );
}

interface InlinePart {
  type: 'text' | 'bold' | 'italic' | 'code' | 'strikethrough' | 'link';
  text: string;
  href?: string;
}

function parseInline(text: string): InlinePart[] {
  const parts: InlinePart[] = [];
  const regex = /(\*\*(.+?)\*\*)|(\*(.+?)\*)|(`(.+?)`)|(\[(.+?)\]\((.+?)\))|(~~(.+?)~~)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', text: text.slice(lastIndex, match.index) });
    }

    if (match[1]) parts.push({ type: 'bold', text: match[2] });
    else if (match[3]) parts.push({ type: 'italic', text: match[4] });
    else if (match[5]) parts.push({ type: 'code', text: match[6] });
    else if (match[7]) parts.push({ type: 'link', text: match[8], href: match[9] });
    else if (match[10]) parts.push({ type: 'strikethrough', text: match[11] });

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push({ type: 'text', text: text.slice(lastIndex) });
  }

  return parts.length > 0 ? parts : [{ type: 'text', text }];
}
