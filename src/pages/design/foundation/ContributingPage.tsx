import { VStack, Badge } from '@/design-system';
import { DocSection } from '../_shared/DocSection';
import { CodeBlock } from '../_shared/CodeBlock';

export function ContributingPage() {
  return (
    <VStack gap={10} align="stretch">
      <VStack gap={2} align="start">
        <h2 className="text-heading-h3 text-[var(--color-text-default)]">Contributing</h2>
        <p className="text-body-lg text-[var(--color-text-muted)]">
          TDS에 기여하기 위한 환경 셋업, 컴포넌트 개발, 토큰 변경, 릴리스 가이드
        </p>
      </VStack>

      <DocSection id="setup" title="Development setup" description="개발 환경 설정 및 주요 명령어">
        <VStack gap={4} align="stretch">
          <CodeBlock
            code={`# Prerequisites: Node.js ≥ 22.14.0, pnpm ≥ 10.8.0
nvm use
pnpm install
pnpm tokens      # Design token build
pnpm dev         # Dev server → http://localhost:5173
pnpm storybook   # Storybook → http://localhost:6006`}
            language="bash"
          />
          <div className="overflow-x-auto">
            <table className="w-full text-body-md text-[var(--color-text-default)]">
              <thead>
                <tr className="border-b border-[var(--color-border-default)]">
                  {['Command', 'Description'].map((h) => (
                    <th
                      key={h}
                      className="text-left text-label-sm text-[var(--color-text-subtle)] py-2 px-3"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { c: 'pnpm dev', d: 'Rspack dev server' },
                  { c: 'pnpm build', d: 'Production build' },
                  { c: 'pnpm build:lib', d: 'Library build (npm)' },
                  { c: 'pnpm tokens', d: 'Token build' },
                  { c: 'pnpm test', d: 'Tests (watch)' },
                  { c: 'pnpm test:run', d: 'Tests (single)' },
                  { c: 'pnpm lint', d: 'ESLint check' },
                  { c: 'pnpm format', d: 'Prettier format' },
                  { c: 'pnpm storybook', d: 'Storybook' },
                ].map((r) => (
                  <tr key={r.c} className="border-b border-[var(--color-border-subtle)]">
                    <td className="py-2 px-3 font-mono text-body-sm">{r.c}</td>
                    <td className="py-2 px-3">{r.d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </VStack>
      </DocSection>

      <DocSection
        id="new-component"
        title="New component checklist"
        description="새 컴포넌트 추가 시 필수 체크리스트"
      >
        <VStack gap={3} align="stretch">
          {[
            {
              step: '1',
              label: 'Component',
              desc: 'src/design-system/components/{Name}/{Name}.tsx',
              detail: 'Props interface export, twMerge, CSS 변수 사용, ARIA 속성',
            },
            {
              step: '2',
              label: 'Export',
              desc: 'src/design-system/index.ts에 추가',
              detail: 'export { Name } + export type { NameProps }',
            },
            {
              step: '3',
              label: 'Story',
              desc: '{Name}.stories.tsx',
              detail: 'Default + variant별 스토리',
            },
            {
              step: '4',
              label: 'A11y test',
              desc: '{Name}.a11y.test.tsx',
              detail: 'vitest-axe로 접근성 테스트',
            },
            {
              step: '5',
              label: 'Design page',
              desc: 'src/pages/design/components/{Name}Page.tsx',
              detail: 'ComponentPageTemplate 사용',
            },
            {
              step: '6',
              label: 'Cursor rules',
              desc: '.cursor/rules/tds-design-system.mdc 업데이트',
              detail: '컴포넌트 목록, 토큰, 사용법',
            },
            {
              step: '7',
              label: 'Changelog',
              desc: 'CHANGELOG.md에 기록',
              detail: '[Unreleased] > Added',
            },
          ].map((item) => (
            <div
              key={item.step}
              className="flex items-start gap-3 p-3 rounded-lg border border-[var(--color-border-default)]"
            >
              <span className="shrink-0 w-6 h-6 rounded-full bg-[var(--color-action-primary)] text-[var(--color-text-on-primary)] text-label-sm flex items-center justify-center">
                {item.step}
              </span>
              <VStack gap={0.5} align="start" className="min-w-0">
                <span className="text-label-md text-[var(--color-text-default)]">{item.label}</span>
                <code className="text-body-sm text-[var(--color-text-subtle)]">{item.desc}</code>
                <span className="text-body-sm text-[var(--color-text-muted)]">{item.detail}</span>
              </VStack>
            </div>
          ))}
        </VStack>
      </DocSection>

      <DocSection
        id="a11y-test"
        title="A11y test template"
        description="접근성 테스트 파일 작성 패턴"
      >
        <CodeBlock
          code={`import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'vitest-axe';
import { ComponentName } from './ComponentName';

expect.extend(toHaveNoViolations);

describe('ComponentName a11y', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<ComponentName />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});`}
          language="tsx"
        />
      </DocSection>

      <DocSection
        id="token-change"
        title="Token change process"
        description="디자인 토큰 추가/수정 프로세스"
      >
        <VStack gap={3} align="stretch">
          {[
            { step: '1', label: 'Edit JSON', desc: 'tokens/light.json + tokens/dark.json 수정' },
            { step: '2', label: 'Build', desc: 'pnpm tokens → CSS + Tailwind preset 재생성' },
            {
              step: '3',
              label: 'Compatibility',
              desc: '새 semantic 토큰의 --color-* 별칭 필요 시 build-tokens.js 업데이트',
            },
            { step: '4', label: 'Sync rules', desc: '.cursor/rules/tds-design-system.mdc 동기화' },
            { step: '5', label: 'Changelog', desc: 'CHANGELOG.md 기록' },
          ].map((item) => (
            <div
              key={item.step}
              className="flex items-center gap-3 py-2 px-3 rounded-lg border border-[var(--color-border-subtle)]"
            >
              <span className="shrink-0 text-label-md text-[var(--color-action-primary)]">
                {item.step}.
              </span>
              <span className="text-label-md text-[var(--color-text-default)]">{item.label}</span>
              <span className="text-body-sm text-[var(--color-text-muted)]">— {item.desc}</span>
            </div>
          ))}
        </VStack>
      </DocSection>

      <DocSection
        id="versioning"
        title="Versioning & release"
        description="Semantic Versioning 규칙 및 릴리스 프로세스"
      >
        <VStack gap={4} align="stretch">
          <div className="overflow-x-auto">
            <table className="w-full text-body-md text-[var(--color-text-default)]">
              <thead>
                <tr className="border-b border-[var(--color-border-default)]">
                  {['Type', 'When', 'Examples'].map((h) => (
                    <th
                      key={h}
                      className="text-left text-label-sm text-[var(--color-text-subtle)] py-2 px-3"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    type: 'MAJOR',
                    theme: 'white' as const,
                    when: 'Breaking changes',
                    ex: 'Component removal, prop rename/delete, token rename/delete',
                  },
                  {
                    type: 'MINOR',
                    theme: 'blue' as const,
                    when: 'New features (backward compatible)',
                    ex: 'New component, new prop, new variant, new token',
                  },
                  {
                    type: 'PATCH',
                    theme: 'green' as const,
                    when: 'Bug fixes (no API change)',
                    ex: 'Style fix, docs, type fix, performance',
                  },
                ].map((r) => (
                  <tr key={r.type} className="border-b border-[var(--color-border-subtle)]">
                    <td className="py-2 px-3">
                      <Badge theme={r.theme} type="subtle" size="sm">
                        {r.type}
                      </Badge>
                    </td>
                    <td className="py-2 px-3">{r.when}</td>
                    <td className="py-2 px-3 text-body-sm text-[var(--color-text-muted)]">
                      {r.ex}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <CodeBlock
            code={`# Release flow
1. Update CHANGELOG.md (version, date, changes)
2. Update package.json version
3. pnpm build:lib && pnpm test:run
4. git commit -m "release: v1.2.0" && git tag v1.2.0
5. git push origin main --tags
6. pnpm publish`}
            language="bash"
          />
        </VStack>
      </DocSection>
    </VStack>
  );
}
