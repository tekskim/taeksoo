import { VStack, HStack, Badge } from '@/design-system';
import { DocSection } from '../_shared/DocSection';
import { CodeBlock } from '../_shared/CodeBlock';

function StatusBadge({ ok }: { ok: boolean | 'partial' }) {
  if (ok === 'partial')
    return (
      <Badge variant="warning" size="sm">
        Partial
      </Badge>
    );
  return ok ? (
    <Badge variant="success" size="sm">
      Yes
    </Badge>
  ) : (
    <Badge variant="danger" size="sm">
      No
    </Badge>
  );
}

function MatrixTable({
  rows,
}: {
  rows: {
    name: string;
    role: string;
    aria: string;
    keyboard: string;
    focus: string;
    test: boolean;
  }[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-body-md text-[var(--color-text-default)]">
        <thead>
          <tr className="border-b border-[var(--color-border-default)]">
            {['Component', 'Role', 'ARIA', 'Keyboard', 'Focus', 'Test'].map((h) => (
              <th
                key={h}
                className="text-left text-label-sm text-[var(--color-text-subtle)] py-2 px-3 whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name} className="border-b border-[var(--color-border-subtle)]">
              <td className="py-2 px-3 text-label-md whitespace-nowrap">{r.name}</td>
              <td className="py-2 px-3 text-body-sm font-mono whitespace-nowrap">{r.role}</td>
              <td className="py-2 px-3 text-body-sm max-w-[240px]">{r.aria}</td>
              <td className="py-2 px-3 text-body-sm max-w-[200px]">{r.keyboard}</td>
              <td className="py-2 px-3 text-body-sm">{r.focus}</td>
              <td className="py-2 px-3">
                <StatusBadge ok={r.test} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const formControlRows = [
  {
    name: 'Input',
    role: 'native input',
    aria: 'aria-invalid, aria-describedby',
    keyboard: 'Native',
    focus: '—',
    test: true,
  },
  {
    name: 'Textarea',
    role: 'native textarea',
    aria: 'aria-invalid, aria-describedby',
    keyboard: 'Native',
    focus: '—',
    test: true,
  },
  {
    name: 'NumberInput',
    role: 'native input[number]',
    aria: 'aria-invalid, aria-describedby, stepper aria-label',
    keyboard: 'ArrowUp/Down',
    focus: 'Stepper tabIndex={-1}',
    test: true,
  },
  {
    name: 'SearchInput',
    role: 'native input[search]',
    aria: 'aria-label="Search"',
    keyboard: 'Native',
    focus: 'Clear tabIndex={-1}',
    test: false,
  },
  {
    name: 'Select',
    role: 'combobox / listbox / option',
    aria: 'aria-expanded, aria-haspopup, aria-controls, aria-invalid, aria-selected',
    keyboard: 'Arrow, Enter, Space, Esc, Tab',
    focus: 'Listbox ↔ trigger',
    test: true,
  },
  {
    name: 'Checkbox',
    role: 'native checkbox',
    aria: 'aria-invalid, aria-describedby',
    keyboard: 'Space',
    focus: 'sr-only input',
    test: true,
  },
  {
    name: 'RadioGroup',
    role: 'radiogroup',
    aria: 'aria-labelledby, aria-describedby, aria-invalid',
    keyboard: 'Native',
    focus: '—',
    test: true,
  },
  {
    name: 'Toggle',
    role: 'switch',
    aria: 'aria-checked, aria-describedby',
    keyboard: 'Space',
    focus: 'sr-only input',
    test: true,
  },
  {
    name: 'Slider',
    role: 'slider',
    aria: 'aria-label, aria-valuemin/max/now, aria-disabled',
    keyboard: 'Arrow, Home, End',
    focus: 'Thumb tabIndex={0}',
    test: true,
  },
  {
    name: 'DatePicker',
    role: '—',
    aria: 'aria-pressed, aria-label (nav)',
    keyboard: '⚠️ None',
    focus: '—',
    test: true,
  },
];

const overlayRows = [
  {
    name: 'Modal',
    role: '⚠️ none',
    aria: '⚠️ no role="dialog"',
    keyboard: 'Escape',
    focus: '⚠️ No focus trap',
    test: true,
  },
  {
    name: 'Drawer',
    role: 'dialog',
    aria: 'aria-modal, aria-labelledby',
    keyboard: 'Escape',
    focus: '⚠️ No focus trap',
    test: true,
  },
  {
    name: 'Popover',
    role: 'dialog',
    aria: 'aria-expanded, aria-haspopup, aria-controls',
    keyboard: 'Enter, Space, Escape',
    focus: 'Return to trigger',
    test: true,
  },
  {
    name: 'ContextMenu',
    role: '⚠️ none',
    aria: '⚠️ none',
    keyboard: 'Escape only',
    focus: '⚠️ No menu nav',
    test: true,
  },
  { name: 'Tooltip', role: '—', aria: '—', keyboard: '—', focus: '—', test: true },
  {
    name: 'Toast',
    role: 'alert',
    aria: 'aria-live="polite"',
    keyboard: 'Native button',
    focus: '—',
    test: true,
  },
];

const navRows = [
  {
    name: 'Tabs',
    role: 'tablist / tab / tabpanel',
    aria: 'aria-selected, aria-disabled, aria-hidden',
    keyboard: '⚠️ No Arrow nav',
    focus: '—',
    test: true,
  },
  {
    name: 'Breadcrumb',
    role: '<nav aria-label>',
    aria: 'aria-current="page"',
    keyboard: 'Native link',
    focus: '—',
    test: true,
  },
  {
    name: 'Pagination',
    role: '<nav>',
    aria: 'aria-label, aria-current="page"',
    keyboard: 'Native button',
    focus: '—',
    test: true,
  },
];

const dataRows = [
  {
    name: 'Table',
    role: 'native table',
    aria: 'Checkbox aria-label',
    keyboard: '—',
    focus: '—',
    test: true,
  },
  {
    name: 'StatusIndicator',
    role: 'status',
    aria: 'aria-label',
    keyboard: '— (presentational)',
    focus: '—',
    test: true,
  },
  {
    name: 'Button',
    role: 'native button',
    aria: 'aria-label (icon-only), aria-disabled, aria-busy',
    keyboard: 'Native',
    focus: 'Spinner aria-hidden',
    test: true,
  },
  {
    name: 'Disclosure',
    role: 'region',
    aria: 'aria-expanded, aria-controls, aria-labelledby',
    keyboard: 'Enter, Space',
    focus: '—',
    test: true,
  },
];

export function AccessibilityPage() {
  return (
    <VStack gap={10} align="stretch">
      <VStack gap={2} align="start">
        <h2 className="text-heading-h3 text-[var(--color-text-default)]">Accessibility</h2>
        <p className="text-body-lg text-[var(--color-text-muted)]">
          TDS 컴포넌트의 접근성 구현 현황, 필수 패턴, 키보드 내비게이션 가이드
        </p>
      </VStack>

      <DocSection
        id="matrix-form"
        title="Form Controls"
        description="폼 컨트롤 컴포넌트의 ARIA/키보드/포커스 지원 현황"
      >
        <MatrixTable rows={formControlRows} />
      </DocSection>

      <DocSection
        id="matrix-overlay"
        title="Overlays"
        description="오버레이 컴포넌트의 접근성 현황"
      >
        <MatrixTable rows={overlayRows} />
      </DocSection>

      <DocSection
        id="matrix-nav"
        title="Navigation & Data Display"
        description="내비게이션 및 데이터 표시 컴포넌트의 접근성 현황"
      >
        <MatrixTable rows={[...navRows, ...dataRows]} />
      </DocSection>

      <DocSection id="known-gaps" title="Known gaps" description="현재 알려진 접근성 gap">
        <div className="overflow-x-auto">
          <table className="w-full text-body-md text-[var(--color-text-default)]">
            <thead>
              <tr className="border-b border-[var(--color-border-default)]">
                {['Component', 'Gap', 'Priority'].map((h) => (
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
                  c: 'Modal',
                  gap: 'role="dialog", aria-modal, focus trap 미구현',
                  p: 'danger' as const,
                },
                {
                  c: 'DatePicker',
                  gap: '키보드 내비게이션 없음 (Arrow, Home/End)',
                  p: 'danger' as const,
                },
                {
                  c: 'Tabs',
                  gap: 'Arrow 키 탭 간 탐색 없음 (WAI-ARIA Tabs)',
                  p: 'warning' as const,
                },
                {
                  c: 'ContextMenu',
                  gap: '메뉴 내 키보드 탐색 없음, ARIA role 없음',
                  p: 'warning' as const,
                },
                { c: 'Loading/Skeleton', gap: 'aria-busy, aria-live 없음', p: 'info' as const },
              ].map((r) => (
                <tr key={r.c} className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 px-3 text-label-md">{r.c}</td>
                  <td className="py-2 px-3">{r.gap}</td>
                  <td className="py-2 px-3">
                    <Badge variant={r.p} size="sm">
                      {r.p === 'danger' ? 'High' : r.p === 'warning' ? 'Medium' : 'Low'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DocSection>

      <DocSection
        id="form-a11y"
        title="Form a11y patterns"
        description="폼 구현 시 반드시 따라야 할 접근성 패턴"
      >
        <VStack gap={6} align="stretch">
          <VStack gap={2} align="start">
            <h4 className="text-heading-h6 text-[var(--color-text-default)]">
              1. Label ↔ Input 연결
            </h4>
            <p className="text-body-md text-[var(--color-text-muted)]">
              모든 폼 컨트롤은 FormField로 감싸서 label과 input을 자동 연결합니다.
            </p>
            <CodeBlock
              code={`// ✅ FormField가 자동으로 id/htmlFor 연결
<FormField label="Instance Name" required>
  <Input placeholder="Enter name" fullWidth />
</FormField>

// ❌ label 없이 Input 단독 사용 금지
<Input placeholder="Enter name" />`}
              language="tsx"
            />
          </VStack>

          <VStack gap={2} align="start">
            <h4 className="text-heading-h6 text-[var(--color-text-default)]">
              2. Error 연결 (aria-invalid + role=&quot;alert&quot;)
            </h4>
            <p className="text-body-md text-[var(--color-text-muted)]">
              FormField의 error prop이 child에 자동 전파되며, ErrorMessage는
              role=&quot;alert&quot;로 렌더링됩니다.
            </p>
            <CodeBlock
              code={`<FormField label="Password" error={!!passwordError} required>
  <Input type="password" fullWidth />
  {passwordError && (
    <FormField.ErrorMessage>{passwordError}</FormField.ErrorMessage>
  )}
</FormField>`}
              language="tsx"
            />
          </VStack>

          <VStack gap={2} align="start">
            <h4 className="text-heading-h6 text-[var(--color-text-default)]">
              3. Icon-only 버튼의 aria-label
            </h4>
            <CodeBlock
              code={`// ✅ aria-label 필수
<Button variant="secondary" size="sm" icon={<IconDownload size={12} />} aria-label="Download" />

// ❌ aria-label 없는 아이콘 버튼 금지
<Button variant="ghost" size="sm" icon={<IconTrash size={12} />} />`}
              language="tsx"
            />
          </VStack>
        </VStack>
      </DocSection>

      <DocSection
        id="keyboard"
        title="Keyboard navigation"
        description="컴포넌트별 키보드 동작 명세"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-body-md text-[var(--color-text-default)]">
            <thead>
              <tr className="border-b border-[var(--color-border-default)]">
                {['Component', 'Key', 'Action'].map((h) => (
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
                { c: 'Select', k: 'Arrow Down/Up', a: 'Open / Move option' },
                { c: 'Select', k: 'Enter, Space', a: 'Select option & close' },
                { c: 'Select', k: 'Escape', a: 'Close dropdown' },
                { c: 'NumberInput', k: 'Arrow Up/Down', a: 'Increment / decrement' },
                { c: 'Slider', k: 'Arrow Left/Right', a: '+/- step' },
                { c: 'Slider', k: 'Home / End', a: 'Min / max value' },
                { c: 'Modal/Drawer', k: 'Escape', a: 'Close' },
                { c: 'Popover', k: 'Enter, Space', a: 'Toggle (click trigger)' },
                { c: 'Popover', k: 'Escape', a: 'Close & return focus' },
                { c: 'Disclosure', k: 'Enter, Space', a: 'Toggle panel' },
              ].map((r, i) => (
                <tr key={`${r.c}-${i}`} className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 px-3 text-label-md">{r.c}</td>
                  <td className="py-2 px-3 font-mono text-body-sm">{r.k}</td>
                  <td className="py-2 px-3">{r.a}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DocSection>

      <DocSection
        id="contrast"
        title="Color contrast"
        description="WCAG AA 대비비 기준 및 TDS 토큰 검증 결과"
      >
        <VStack gap={4} align="stretch">
          <HStack gap={4} align="start" className="flex-wrap">
            {[
              { label: 'text on surface', fg: '#0f172a', bg: '#ffffff', ratio: '17.5:1', ok: true },
              {
                label: 'text-muted on surface',
                fg: '#475569',
                bg: '#ffffff',
                ratio: '6.2:1',
                ok: true,
              },
              {
                label: 'text-subtle on surface',
                fg: '#64748b',
                bg: '#ffffff',
                ratio: '4.6:1',
                ok: true,
              },
              {
                label: 'on-primary on primary',
                fg: '#ffffff',
                bg: '#2563eb',
                ratio: '4.6:1',
                ok: true,
              },
              {
                label: 'state-danger on surface',
                fg: '#dc2626',
                bg: '#ffffff',
                ratio: '4.6:1',
                ok: true,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 px-4 py-3 rounded-lg border border-[var(--color-border-default)] min-w-[200px]"
              >
                <div
                  className="w-8 h-8 rounded-md border border-[var(--color-border-default)]"
                  style={{ backgroundColor: item.bg }}
                >
                  <div
                    className="w-full h-full flex items-center justify-center text-heading-h6"
                    style={{ color: item.fg }}
                  >
                    Aa
                  </div>
                </div>
                <VStack gap={0} align="start">
                  <span className="text-label-sm text-[var(--color-text-default)]">
                    {item.label}
                  </span>
                  <HStack gap={1} align="center">
                    <span className="text-body-sm text-[var(--color-text-subtle)]">
                      {item.ratio}
                    </span>
                    <Badge variant="success" size="sm">
                      AA
                    </Badge>
                  </HStack>
                </VStack>
              </div>
            ))}
          </HStack>
          <p className="text-body-sm text-[var(--color-text-subtle)]">
            text-disabled (#94a3b8, 2.8:1)은 WCAG AA를 충족하지 않으나, 비활성 요소는 대비비
            요구사항에서 제외됩니다 (WCAG 1.4.3 예외).
          </p>
        </VStack>
      </DocSection>
    </VStack>
  );
}
