import { useState, useEffect } from 'react';
import { notionContent } from '@/content/notion';
import { notionMapping, getNotionEditUrl } from '@/content/notion/mapping';

export interface NotionContentData {
  title: string;
  markdown: string;
  lastSynced: string;
  editUrl: string;
}

interface UseNotionContentResult {
  data: NotionContentData | null;
  isLoading: boolean;
  error: string | null;
}

const isDev = import.meta.env.DEV;

/**
 * Notion 콘텐츠를 가져오는 훅
 *
 * - 프로덕션: 빌드 시 번들된 정적 JSON에서 즉시 반환
 * - 개발 환경: Vite 프록시를 통해 Notion API 실시간 호출 (토큰이 설정된 경우)
 *   토큰 미설정 시 정적 JSON fallback
 *
 * @param slugOrPageId - 매핑 slug (예: 'button') 또는 Notion 페이지 ID
 */
export function useNotionContent(slugOrPageId?: string): UseNotionContentResult {
  const [data, setData] = useState<NotionContentData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slugOrPageId) return;

    const pageId = notionMapping[slugOrPageId] || slugOrPageId;
    const slug =
      Object.entries(notionMapping).find(([, id]) => id === slugOrPageId)?.[0] || slugOrPageId;

    const staticData = notionContent[slug];
    if (staticData) {
      setData({
        title: staticData.title,
        markdown: staticData.markdown,
        lastSynced: staticData.lastSynced,
        editUrl: staticData.editUrl,
      });
    }

    if (!isDev) return;

    let cancelled = false;
    setIsLoading(true);

    fetchFromProxy(pageId)
      .then((result) => {
        if (!cancelled && result) {
          setData(result);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slugOrPageId]);

  return { data, isLoading, error };
}

async function fetchFromProxy(pageId: string): Promise<NotionContentData | null> {
  try {
    const blocksRes = await fetch(`/api/notion/blocks/${pageId}/children?page_size=100`);
    if (!blocksRes.ok) {
      if (blocksRes.status === 401 || blocksRes.status === 403) {
        return null;
      }
      throw new Error(`Notion API error: ${blocksRes.status}`);
    }

    const blocksData = await blocksRes.json();
    const markdown = blocksToMarkdown(blocksData.results || []);

    return {
      title: '',
      markdown,
      lastSynced: new Date().toISOString(),
      editUrl: getNotionEditUrl(pageId),
    };
  } catch {
    return null;
  }
}

function blocksToMarkdown(blocks: NotionBlock[]): string {
  return blocks.map(blockToMarkdown).filter(Boolean).join('\n\n');
}

interface NotionBlock {
  type: string;
  [key: string]: unknown;
}

interface RichText {
  plain_text: string;
  annotations?: {
    bold?: boolean;
    italic?: boolean;
    code?: boolean;
    strikethrough?: boolean;
    underline?: boolean;
  };
  href?: string;
}

function richTextToMarkdown(richTexts: RichText[]): string {
  if (!richTexts) return '';
  return richTexts
    .map((rt) => {
      let text = rt.plain_text;
      if (rt.annotations?.bold) text = `**${text}**`;
      if (rt.annotations?.italic) text = `*${text}*`;
      if (rt.annotations?.code) text = `\`${text}\``;
      if (rt.annotations?.strikethrough) text = `~~${text}~~`;
      if (rt.href) text = `[${text}](${rt.href})`;
      return text;
    })
    .join('');
}

function blockToMarkdown(block: NotionBlock): string {
  const type = block.type;
  const data = block[type] as Record<string, unknown>;
  if (!data) return '';

  switch (type) {
    case 'paragraph':
      return richTextToMarkdown(data.rich_text as RichText[]);
    case 'heading_1':
      return `# ${richTextToMarkdown(data.rich_text as RichText[])}`;
    case 'heading_2':
      return `## ${richTextToMarkdown(data.rich_text as RichText[])}`;
    case 'heading_3':
      return `### ${richTextToMarkdown(data.rich_text as RichText[])}`;
    case 'bulleted_list_item':
      return `- ${richTextToMarkdown(data.rich_text as RichText[])}`;
    case 'numbered_list_item':
      return `1. ${richTextToMarkdown(data.rich_text as RichText[])}`;
    case 'code':
      return `\`\`\`${(data.language as string) || ''}\n${richTextToMarkdown(data.rich_text as RichText[])}\n\`\`\``;
    case 'divider':
      return '---';
    case 'quote':
      return `> ${richTextToMarkdown(data.rich_text as RichText[])}`;
    case 'callout':
      return `> ${richTextToMarkdown(data.rich_text as RichText[])}`;
    case 'table':
      return '[Table]';
    default:
      return '';
  }
}
