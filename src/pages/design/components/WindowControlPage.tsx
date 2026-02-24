import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { WindowControl, WindowControls, VStack } from '@/design-system';

export function WindowControlPage() {
  return (
    <ComponentPageTemplate
      title="Window control"
      description="Window control buttons for minimize, maximize, and close actions"
      preview={
        <ComponentPreview code={`<WindowControls />`}>
          <div className="flex items-center justify-between w-full max-w-[400px] h-10 px-3 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-md)]">
            <span className="text-[length:var(--font-size-12)] font-medium">Application Title</span>
            <WindowControls />
          </div>
        </ComponentPreview>
      }
      examples={
        <VStack gap={8}>
          <VStack gap={3}>
            <span className="text-label-md text-[var(--color-text-default)]">
              Individual controls
            </span>
            <div className="flex gap-6 items-center">
              <VStack gap={1}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  Minimize
                </span>
                <WindowControl type="minimize" />
              </VStack>
              <VStack gap={1}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  Maximize
                </span>
                <WindowControl type="maximize" />
              </VStack>
              <VStack gap={1}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  Close
                </span>
                <WindowControl type="close" />
              </VStack>
            </div>
          </VStack>

          <VStack gap={3}>
            <span className="text-label-md text-[var(--color-text-default)]">Controls group</span>
            <div className="flex gap-6 items-center">
              <VStack gap={1}>
                <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">
                  All Controls
                </span>
                <WindowControls />
              </VStack>
            </div>
          </VStack>

          <VStack gap={3}>
            <span className="text-label-md text-[var(--color-text-default)]">
              In Context (Header Bar)
            </span>
            <div className="flex items-center justify-between w-full max-w-[400px] h-10 px-3 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-md)]">
              <span className="text-[length:var(--font-size-12)] font-medium">
                Application Title
              </span>
              <WindowControls />
            </div>
          </VStack>
        </VStack>
      }
      guidelines={
        <div className="p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
          <VStack gap={2}>
            <h4 className="text-heading-h6 text-[var(--color-text-default)]">사용 규칙</h4>
            <ul className="list-disc pl-5 text-body-sm text-[var(--color-text-muted)] space-y-1">
              <li>데스크톱 앱(Electron 등) 환경에서 윈도우 제어 버튼을 제공합니다.</li>
              <li>최소화/최대화/닫기 아이콘 버튼을 우측에 배치합니다.</li>
              <li>모든 OS에서 동일한 스타일이 적용됩니다.</li>
            </ul>
          </VStack>
        </div>
      }
      tokens={
        <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
          <code>size: 24×24px</code> · <code>icon: 12px</code> · <code>radius: 4px</code> ·{' '}
          <code>gap: 4px</code>
        </div>
      }
      relatedLinks={[
        { label: 'TopBar', path: '/design/components/topbar', description: 'Top navigation bar' },
        {
          label: 'Button',
          path: '/design/components/button',
          description: 'Interactive button component',
        },
      ]}
    />
  );
}
