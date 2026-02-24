import { useState, useEffect } from 'react';
import { IconBrandNotion } from '@tabler/icons-react';
import { VStack } from '@/design-system';
import { DocSection } from './DocSection';
import { NotionRenderer } from './NotionRenderer';
import { notionContent } from '@/content/notion';
import { notionMapping, getNotionEditUrl } from '@/content/notion/mapping';

interface NotionDesignNotesProps {
  notionPageId: string;
}

interface NotionData {
  title: string;
  markdown: string;
  lastSynced: string;
  editUrl: string;
}

export function NotionDesignNotes({ notionPageId }: NotionDesignNotesProps) {
  const [data, setData] = useState<NotionData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const pageId = notionMapping[notionPageId] || notionPageId;
    const slug =
      Object.entries(notionMapping).find(([, id]) => id === notionPageId)?.[0] || notionPageId;

    const staticData = notionContent[slug];
    if (staticData) {
      setData({
        title: staticData.title,
        markdown: staticData.markdown,
        lastSynced: staticData.lastSynced,
        editUrl: staticData.editUrl,
      });
      return;
    }

    if (!import.meta.env.DEV) return;

    let cancelled = false;
    setIsLoading(true);

    fetch(`/api/notion/blocks/${pageId}/children?page_size=100`)
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((blocksData) => {
        if (cancelled || !blocksData) return;
        const markdown = blocksToSimpleMarkdown(blocksData.results || []);
        setData({
          title: '',
          markdown,
          lastSynced: new Date().toISOString(),
          editUrl: getNotionEditUrl(pageId),
        });
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [notionPageId]);

  if (data?.markdown) {
    return (
      <DocSection id="design-notes" title="정책 문서">
        <VStack gap={3} align="stretch">
          <NotionRenderer markdown={data.markdown} />
          <div className="flex items-center gap-2 pt-2 border-t border-[var(--color-border-subtle)]">
            <a
              href={data.editUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-body-sm text-[var(--color-text-subtle)] hover:text-[var(--color-state-info)] transition-colors"
            >
              <IconBrandNotion size={14} stroke={1.5} />
              Notion에서 편집
            </a>
            {data.lastSynced && (
              <span className="text-body-xs text-[var(--color-text-disabled)]">
                · {new Date(data.lastSynced).toLocaleDateString('ko-KR')} 동기화
              </span>
            )}
            {isLoading && (
              <span className="text-body-xs text-[var(--color-text-disabled)]">
                · 실시간 로딩 중...
              </span>
            )}
          </div>
        </VStack>
      </DocSection>
    );
  }

  if (isLoading) return null;

  return (
    <DocSection id="design-notes" title="정책 문서">
      <div className="flex items-center gap-2 p-4 bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-md)]">
        <IconBrandNotion size={16} stroke={1.5} className="text-[var(--color-text-subtle)]" />
        <span className="text-body-sm text-[var(--color-text-subtle)]">
          Notion 콘텐츠를 불러오려면{' '}
          <code className="px-1 py-0.5 bg-[var(--color-surface-default)] rounded text-body-xs">
            npm run sync-notion
          </code>{' '}
          을 실행하세요.
        </span>
      </div>
    </DocSection>
  );
}

function blocksToSimpleMarkdown(blocks: Array<Record<string, unknown>>): string {
  return blocks
    .map((block) => {
      const type = block.type as string;
      const data = block[type] as Record<string, unknown>;
      if (!data) return '';
      const richText = data.rich_text as Array<{ plain_text: string }>;
      const text = richText?.map((rt) => rt.plain_text).join('') || '';

      switch (type) {
        case 'heading_1':
          return `# ${text}`;
        case 'heading_2':
          return `## ${text}`;
        case 'heading_3':
          return `### ${text}`;
        case 'paragraph':
          return text;
        case 'bulleted_list_item':
          return `- ${text}`;
        case 'numbered_list_item':
          return `1. ${text}`;
        case 'divider':
          return '---';
        case 'quote':
        case 'callout':
          return `> ${text}`;
        default:
          return '';
      }
    })
    .filter(Boolean)
    .join('\n\n');
}
