import { VStack } from '@/design-system';
import { DocSection } from '../_shared/DocSection';
import { CodeBlock } from '../_shared/CodeBlock';

export function ThemingPage() {
  return (
    <VStack gap={10} align="stretch">
      <VStack gap={2} align="start">
        <h2 className="text-heading-h3 text-[var(--color-text-default)]">Theming</h2>
        <p className="text-body-lg text-[var(--color-text-muted)]">
          TDS 토큰 커스터마이징, 다크 모드 구현, 커스텀 테마 만들기 가이드
        </p>
      </VStack>

      <DocSection
        id="token-arch"
        title="Token architecture"
        description="3-tier 토큰 구조와 빌드 파이프라인"
      >
        <VStack gap={6} align="stretch">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: 'Primitive',
                desc: 'Raw design values',
                items: [
                  'Colors (blueGray, blue, red...)',
                  'Spacing (0–32)',
                  'Font size (10–40px)',
                  'Radius, Duration',
                ],
                bg: 'var(--color-state-info-bg)',
              },
              {
                title: 'Semantic',
                desc: 'Purpose-driven tokens',
                items: [
                  'primary, surface, text, border',
                  'state-info, state-danger',
                  'spacing (component, layout)',
                  'radius (field, button, card)',
                ],
                bg: 'var(--color-state-success-bg)',
              },
              {
                title: 'Component',
                desc: 'Component-specific',
                items: [
                  'button (height, padding, radius)',
                  'input (height, padding)',
                  'badge (radius, gap)',
                  'modal (radius, padding)',
                ],
                bg: 'var(--color-state-warning-bg)',
              },
            ].map((tier) => (
              <div
                key={tier.title}
                className="p-4 rounded-lg border border-[var(--color-border-default)]"
                style={{ backgroundColor: tier.bg }}
              >
                <h4 className="text-heading-h6 text-[var(--color-text-default)] mb-1">
                  {tier.title}
                </h4>
                <p className="text-body-sm text-[var(--color-text-muted)] mb-3">{tier.desc}</p>
                <ul className="text-body-sm text-[var(--color-text-default)] space-y-1">
                  {tier.items.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <VStack gap={2} align="start">
            <h4 className="text-heading-h6 text-[var(--color-text-default)]">Build pipeline</h4>
            <CodeBlock
              code={`tokens/light.json ──┐
                    ├── scripts/build-tokens.js ──┬── src/styles/tokens/light.css
tokens/dark.json ───┘                            ├── src/styles/tokens/dark.css
                                                  ├── src/styles/tokens/compatibility.css
                                                  ├── src/styles/tokens/index.css
                                                  └── tailwind.preset.js

# 실행: pnpm tokens`}
              language="bash"
            />
          </VStack>

          <VStack gap={2} align="start">
            <h4 className="text-heading-h6 text-[var(--color-text-default)]">Naming convention</h4>
            <CodeBlock
              code={`// JSON (camelCase)
{ "primitive": { "color": { "blueGray50": "#f8fafc" } } }

// CSS (kebab-case, auto-converted)
--primitive-color-blue-gray50: #f8fafc;`}
              language="css"
            />
          </VStack>
        </VStack>
      </DocSection>

      <DocSection
        id="typography-units"
        title="Typography units (px vs rem)"
        description="Figma 토큰과 런타임 CSS의 타이포그래피 단위 차이"
      >
        <VStack gap={4} align="stretch">
          <div className="overflow-x-auto">
            <table className="w-full text-body-md text-[var(--color-text-default)]">
              <thead>
                <tr className="border-b border-[var(--color-border-default)]">
                  {['파일', '변수명', '단위', '예시'].map((h) => (
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
                    file: 'light.css (Figma build)',
                    varName: '--primitive-font-size-12',
                    unit: 'rem',
                    example: '0.75rem',
                  },
                  {
                    file: 'src/index.css (runtime)',
                    varName: '--font-size-12',
                    unit: 'px',
                    example: '12px',
                  },
                  {
                    file: 'Utility class',
                    varName: '.text-body-md',
                    unit: 'CSS var 참조',
                    example: 'font-size: var(--font-size-12)',
                  },
                ].map((r) => (
                  <tr key={r.file} className="border-b border-[var(--color-border-subtle)]">
                    <td className="py-2 px-3 text-label-sm">{r.file}</td>
                    <td className="py-2 px-3 font-mono text-body-sm">{r.varName}</td>
                    <td className="py-2 px-3">{r.unit}</td>
                    <td className="py-2 px-3 font-mono text-body-sm">{r.example}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <VStack gap={2} align="start">
            <h4 className="text-heading-h6 text-[var(--color-text-default)]">의도</h4>
            <p className="text-body-md text-[var(--color-text-muted)]">
              Figma 토큰 빌드는 디자인 도구의 관례에 따라 rem 단위를 출력합니다. 그러나 TDS 런타임
              CSS(<code className="text-body-sm">src/index.css</code>)는 px 단위로 재정의하여,
              엔터프라이즈 대시보드 환경에서 브라우저 기본 폰트 크기 설정에 관계없이 일관된
              레이아웃을 보장합니다. Spacing과 Radius도 동일한 이유로 px 단위를 사용합니다.
            </p>
          </VStack>
        </VStack>
      </DocSection>

      <DocSection
        id="dark-mode"
        title="Dark mode"
        description="다크 모드 동작 방식과 DarkModeProvider"
      >
        <VStack gap={6} align="stretch">
          <div className="overflow-x-auto">
            <table className="w-full text-body-md text-[var(--color-text-default)]">
              <thead>
                <tr className="border-b border-[var(--color-border-default)]">
                  {['Mechanism', 'Selector', 'When'].map((h) => (
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
                  { m: 'data-theme attribute', s: '[data-theme="dark"]', w: 'Explicit dark mode' },
                  { m: '.dark class', s: '.dark', w: 'DarkModeProvider toggle' },
                  {
                    m: 'System preference',
                    s: '@media (prefers-color-scheme: dark)',
                    w: 'data-theme not set',
                  },
                ].map((r) => (
                  <tr key={r.m} className="border-b border-[var(--color-border-subtle)]">
                    <td className="py-2 px-3 text-label-md">{r.m}</td>
                    <td className="py-2 px-3 font-mono text-body-sm">{r.s}</td>
                    <td className="py-2 px-3">{r.w}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <CodeBlock
            code={`import { DarkModeProvider, useDarkMode } from '@/hooks/useDarkMode';

// App root
<DarkModeProvider>
  <App />
</DarkModeProvider>

// In components
const { theme, isDark, setTheme, toggleDarkMode } = useDarkMode();
// theme: 'light' | 'dark' | 'system'
// Storage: localStorage key 'tds-theme'`}
            language="tsx"
          />

          <CodeBlock
            code={`import { DarkModeToggle } from '@/components/DarkModeToggle';

// 3-mode selector (Light / Dark / System)
<DarkModeToggle size="md" showLabel />

// Simple toggle button (Light ↔ Dark)
<DarkModeToggleButton size="md" />`}
            language="tsx"
          />
        </VStack>
      </DocSection>

      <DocSection
        id="custom-theme"
        title="Custom theming"
        description="TDS 토큰을 오버라이드하여 커스텀 테마를 만드는 3가지 방법"
      >
        <VStack gap={6} align="stretch">
          <VStack gap={2} align="start">
            <h4 className="text-heading-h6 text-[var(--color-text-default)]">
              Method 1: CSS variable override (simple)
            </h4>
            <p className="text-body-md text-[var(--color-text-muted)]">
              별도 빌드 없이 CSS 변수만 오버라이드합니다. Compatibility 레이어가 var() 참조이므로
              자동 반영됩니다.
            </p>
            <CodeBlock
              code={`/* custom-theme.css */
:root, [data-theme="light"] {
  --semantic-color-primary: #7c3aed;        /* violet-600 */
  --semantic-color-primary-hover: #6d28d9;  /* violet-700 */
}

[data-theme="dark"] {
  --semantic-color-primary: #a78bfa;        /* violet-400 */
  --semantic-color-primary-hover: #c4b5fd;  /* violet-300 */
}

/* import AFTER tokens */
import '@/styles/tokens/index.css';
import './custom-theme.css';`}
              language="css"
            />
          </VStack>

          <VStack gap={2} align="start">
            <h4 className="text-heading-h6 text-[var(--color-text-default)]">
              Method 2: Token JSON edit (full customization)
            </h4>
            <CodeBlock
              code={`# 1. Edit tokens
vi tokens/light.json   # Change semantic.color.primary etc.
vi tokens/dark.json    # Dark values

# 2. Build
pnpm tokens

# 3. Results: light.css, dark.css, compatibility.css, tailwind.preset.js updated`}
              language="bash"
            />
          </VStack>

          <VStack gap={2} align="start">
            <h4 className="text-heading-h6 text-[var(--color-text-default)]">
              Method 3: Tailwind preset extension
            </h4>
            <p className="text-body-md text-[var(--color-text-muted)]">
              tailwind.preset.js는 자동 생성이므로 직접 수정하지 마세요. tailwind.config.js에서
              확장합니다.
            </p>
            <CodeBlock
              code={`// tailwind.config.js
import tdsPreset from './tailwind.preset.js';

export default {
  presets: [tdsPreset],
  theme: { extend: { colors: { brand: 'var(--custom-brand-color)' } } },
};`}
              language="js"
            />
          </VStack>
        </VStack>
      </DocSection>

      <DocSection
        id="overridable-tokens"
        title="Overridable tokens"
        description="커스터마이징에 주로 사용되는 semantic 토큰 목록"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-body-md text-[var(--color-text-default)]">
            <thead>
              <tr className="border-b border-[var(--color-border-default)]">
                {['Category', 'Token', 'Light default', 'Description'].map((h) => (
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
                  cat: 'Brand',
                  token: '--semantic-color-primary',
                  val: '#2563eb',
                  desc: 'Primary action color',
                },
                {
                  cat: 'Brand',
                  token: '--semantic-color-primary-hover',
                  val: '#1d4ed8',
                  desc: 'Primary hover',
                },
                {
                  cat: 'Surface',
                  token: '--semantic-color-surface',
                  val: '#ffffff',
                  desc: 'Default background',
                },
                {
                  cat: 'Surface',
                  token: '--semantic-color-surface-muted',
                  val: '#f8fafc',
                  desc: 'Muted background',
                },
                {
                  cat: 'Text',
                  token: '--semantic-color-text',
                  val: '#0f172a',
                  desc: 'Default text',
                },
                {
                  cat: 'Text',
                  token: '--semantic-color-text-muted',
                  val: '#475569',
                  desc: 'Secondary text',
                },
                {
                  cat: 'Border',
                  token: '--semantic-color-border',
                  val: '#e2e8f0',
                  desc: 'Default border',
                },
                {
                  cat: 'Border',
                  token: '--semantic-color-border-focus',
                  val: '#3b82f6',
                  desc: 'Focus ring',
                },
                {
                  cat: 'State',
                  token: '--semantic-color-state-danger',
                  val: '#dc2626',
                  desc: 'Error/danger',
                },
                {
                  cat: 'State',
                  token: '--semantic-color-state-success',
                  val: '#16a34a',
                  desc: 'Success',
                },
                {
                  cat: 'Component',
                  token: '--component-button-radius',
                  val: '0.375rem',
                  desc: 'Button radius',
                },
                {
                  cat: 'Component',
                  token: '--component-input-radius',
                  val: '0.375rem',
                  desc: 'Input radius',
                },
                {
                  cat: 'Component',
                  token: '--component-card-radius',
                  val: '0.5rem',
                  desc: 'Card radius',
                },
              ].map((r) => (
                <tr key={r.token} className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 px-3 text-label-sm">{r.cat}</td>
                  <td className="py-2 px-3 font-mono text-body-sm whitespace-nowrap">{r.token}</td>
                  <td className="py-2 px-3">
                    <span className="inline-flex items-center gap-1.5">
                      {r.val.startsWith('#') && (
                        <span
                          className="w-3 h-3 rounded-sm border border-[var(--color-border-default)]"
                          style={{ backgroundColor: r.val }}
                        />
                      )}
                      <code className="text-body-sm">{r.val}</code>
                    </span>
                  </td>
                  <td className="py-2 px-3 text-body-sm text-[var(--color-text-muted)]">
                    {r.desc}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DocSection>

      <DocSection
        id="compat"
        title="Compatibility layer"
        description="코드에서 사용하는 --color-* 별칭과 semantic 토큰의 관계"
      >
        <VStack gap={6} align="stretch">
          <VStack gap={2} align="start">
            <h4 className="text-heading-h6 text-[var(--color-text-default)]">역할</h4>
            <p className="text-body-md text-[var(--color-text-muted)]">
              <code className="text-body-sm">compatibility.css</code>는 토큰 빌드 시 자동 생성되는
              브릿지 파일입니다. Figma 토큰 빌드 산출물(
              <code className="text-body-sm">light.css</code>
              )이 사용하는 <code className="text-body-sm">--semantic-color-*</code> 네이밍을, 코드
              에서 실제로 사용하는 <code className="text-body-sm">--color-*</code> 별칭으로
              매핑합니다.
            </p>
          </VStack>

          <VStack gap={2} align="start">
            <h4 className="text-heading-h6 text-[var(--color-text-default)]">
              왜 이중 네이밍인가?
            </h4>
            <p className="text-body-md text-[var(--color-text-muted)]">
              Figma 토큰 JSON은 <code className="text-body-sm">semantic.color.primary</code> 구조를
              사용하며, 빌드 시 <code className="text-body-sm">--semantic-color-primary</code>로
              변환됩니다. 그러나 실제 코드에서는{' '}
              <code className="text-body-sm">--color-action-primary</code> 같은 역할 기반 이름이 더
              직관적이므로, compatibility.css가 이 두 네이밍을 연결합니다.
            </p>
          </VStack>

          <VStack gap={2} align="start">
            <h4 className="text-heading-h6 text-[var(--color-text-default)]">매핑 구조</h4>
            <CodeBlock
              code={`/* compatibility.css (auto-generated — DO NOT EDIT) */
:root, [data-theme="light"], [data-theme="dark"] {
  /* Text */
  --color-text-default: var(--semantic-color-text);
  --color-text-muted: var(--semantic-color-text-muted);
  --color-text-subtle: var(--semantic-color-text-subtle);

  /* Action */
  --color-action-primary: var(--semantic-color-primary);
  --color-action-primary-hover: var(--semantic-color-primary-hover);

  /* Surface */
  --color-surface-default: var(--semantic-color-surface);
  --color-surface-subtle: var(--semantic-color-surface-muted);

  /* Border */
  --color-border-default: var(--semantic-color-border);
  --color-border-focus: var(--semantic-color-border-focus);

  /* State */
  --color-state-info: var(--semantic-color-state-info);
  --color-state-danger: var(--semantic-color-state-danger);
  /* ... */
}`}
              language="css"
            />
          </VStack>

          <div className="p-3 rounded-[var(--radius-md)] bg-[var(--color-state-warning-bg)] border border-[var(--color-border-default)]">
            <p className="text-body-md text-[var(--color-text-default)]">
              <strong>커스텀 테마 적용 시:</strong> 별칭(
              <code className="text-body-sm">--color-*</code>
              )을 직접 오버라이드하지 마세요. 항상{' '}
              <code className="text-body-sm">--semantic-color-*</code>를 오버라이드하면
              compatibility.css의 <code className="text-body-sm">var()</code> 참조를 통해 별칭도
              자동 반영됩니다.
            </p>
          </div>
        </VStack>
      </DocSection>
    </VStack>
  );
}
