const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-heading-h4 text-[var(--color-text-default)] pb-2 border-b border-[var(--color-border-default)] mb-6">
    {children}
  </h2>
);

const SubTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-heading-h6 text-[var(--color-text-default)] mb-3">{children}</h3>
);

const ColorSwatch = ({ name, token, value }: { name: string; token: string; value: string }) => (
  <div className="flex flex-col items-center gap-1.5">
    <div
      className="w-16 h-16 rounded-[var(--primitive-radius-md)] border border-[var(--color-border-default)]"
      style={{ backgroundColor: value }}
    />
    <span className="text-body-xs text-[var(--color-text-default)] font-medium">{name}</span>
    <span className="text-body-xs text-[var(--color-text-subtle)]">{value}</span>
    <span className="text-body-xs text-[var(--color-text-subtle)] break-all text-center max-w-[80px]">
      {token}
    </span>
  </div>
);

const SemanticSwatch = ({ label, cssVar }: { label: string; cssVar: string }) => (
  <div className="flex items-center gap-3">
    <div
      className="w-10 h-10 rounded-[var(--primitive-radius-sm)] border border-[var(--color-border-default)] shrink-0"
      style={{ backgroundColor: `var(${cssVar})` }}
    />
    <div className="flex flex-col">
      <span className="text-body-sm text-[var(--color-text-default)] font-medium">{label}</span>
      <span className="text-body-xs text-[var(--color-text-subtle)]">{cssVar}</span>
    </div>
  </div>
);

const primitiveColors = {
  Blue: [
    { name: '50', value: '#eff6ff' },
    { name: '100', value: '#dbeafe' },
    { name: '200', value: '#bfdbfe' },
    { name: '300', value: '#93c5fd' },
    { name: '400', value: '#60a5fa' },
    { name: '500', value: '#3b82f6' },
    { name: '600', value: '#2563eb' },
    { name: '700', value: '#1d4ed8' },
    { name: '800', value: '#1e40af' },
    { name: '900', value: '#1e3a8a' },
  ],
  Red: [
    { name: '50', value: '#fef2f2' },
    { name: '100', value: '#fee2e2' },
    { name: '200', value: '#fecaca' },
    { name: '300', value: '#fca5a5' },
    { name: '400', value: '#f87171' },
    { name: '500', value: '#ef4444' },
    { name: '600', value: '#dc2626' },
    { name: '700', value: '#b91c1c' },
    { name: '800', value: '#991b1b' },
    { name: '900', value: '#7f1d1d' },
  ],
  Green: [
    { name: '50', value: '#f0fdf4' },
    { name: '100', value: '#dcfce7' },
    { name: '200', value: '#bbf7d0' },
    { name: '300', value: '#86efac' },
    { name: '400', value: '#4ade80' },
    { name: '500', value: '#22c55e' },
    { name: '600', value: '#16a34a' },
    { name: '700', value: '#15803d' },
    { name: '800', value: '#166534' },
    { name: '900', value: '#14532d' },
  ],
  Orange: [
    { name: '50', value: '#fff7ed' },
    { name: '100', value: '#ffedd5' },
    { name: '200', value: '#fed7aa' },
    { name: '300', value: '#fdba74' },
    { name: '400', value: '#fb923c' },
    { name: '500', value: '#f97316' },
    { name: '600', value: '#ea580c' },
    { name: '700', value: '#c2410c' },
    { name: '800', value: '#9a3412' },
    { name: '900', value: '#7c2d12' },
  ],
  Yellow: [
    { name: '50', value: '#fefce8' },
    { name: '100', value: '#fef9c3' },
    { name: '200', value: '#fef08a' },
    { name: '300', value: '#fde047' },
    { name: '400', value: '#facc15' },
    { name: '500', value: '#eab308' },
    { name: '600', value: '#ca8a04' },
    { name: '700', value: '#a16207' },
    { name: '800', value: '#854d0e' },
    { name: '900', value: '#713f12' },
  ],
  'Blue Gray': [
    { name: '50', value: '#f8fafc' },
    { name: '100', value: '#f1f5f9' },
    { name: '200', value: '#e2e8f0' },
    { name: '300', value: '#cbd5e1' },
    { name: '400', value: '#94a3b8' },
    { name: '500', value: '#64748b' },
    { name: '600', value: '#475569' },
    { name: '700', value: '#334155' },
    { name: '800', value: '#1e293b' },
    { name: '900', value: '#0f172a' },
  ],
};

const semanticColors = [
  { label: 'Primary', cssVar: '--semantic-color-primary' },
  { label: 'Primary Hover', cssVar: '--semantic-color-primary-hover' },
  { label: 'On Primary', cssVar: '--semantic-color-on-primary' },
  { label: 'Secondary', cssVar: '--semantic-color-secondary' },
  { label: 'Tertiary', cssVar: '--semantic-color-tertiary' },
  { label: 'Surface', cssVar: '--semantic-color-surface' },
  { label: 'Surface Muted', cssVar: '--semantic-color-surface-muted' },
  { label: 'Text', cssVar: '--semantic-color-text' },
  { label: 'Text Muted', cssVar: '--semantic-color-text-muted' },
  { label: 'Text Subtle', cssVar: '--semantic-color-text-subtle' },
  { label: 'Text Disabled', cssVar: '--semantic-color-text-disabled' },
  { label: 'Border', cssVar: '--semantic-color-border' },
  { label: 'Border Strong', cssVar: '--semantic-color-border-strong' },
  { label: 'State Info', cssVar: '--semantic-color-state-info' },
  { label: 'State Info BG', cssVar: '--semantic-color-state-info-bg' },
  { label: 'State Success', cssVar: '--semantic-color-state-success' },
  { label: 'State Success BG', cssVar: '--semantic-color-state-success-bg' },
  { label: 'State Warning', cssVar: '--semantic-color-state-warning' },
  { label: 'State Warning BG', cssVar: '--semantic-color-state-warning-bg' },
  { label: 'State Danger', cssVar: '--semantic-color-state-danger' },
  { label: 'State Danger BG', cssVar: '--semantic-color-state-danger-bg' },
];

const spacingScale = [
  { token: '0', value: '0' },
  { token: '0.5', value: '2px' },
  { token: '1', value: '4px' },
  { token: '1.5', value: '6px' },
  { token: '2', value: '8px' },
  { token: '2.5', value: '10px' },
  { token: '3', value: '12px' },
  { token: '4', value: '16px' },
  { token: '5', value: '20px' },
  { token: '6', value: '24px' },
  { token: '7', value: '28px' },
  { token: '8', value: '32px' },
  { token: '9', value: '36px' },
  { token: '10', value: '40px' },
  { token: '12', value: '48px' },
  { token: '16', value: '64px' },
  { token: '20', value: '80px' },
  { token: '24', value: '96px' },
];

const radiusScale = [
  { name: 'none', value: '0' },
  { name: 'sm', value: '4px' },
  { name: 'md', value: '6px' },
  { name: 'lg', value: '8px' },
  { name: 'xl', value: '16px' },
  { name: 'full', value: '9999px' },
];

const shadows = [
  { name: 'xs', value: '0 1px 2px 0 rgba(0,0,0,0.05)' },
  { name: 'sm', value: '0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)' },
  { name: 'md', value: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)' },
  { name: 'lg', value: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)' },
  { name: 'xl', value: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)' },
];

export function FigmaFoundationPage() {
  return (
    <div className="flex flex-col gap-16">
      {/* ─── Colors: Primitive ─── */}
      <section>
        <SectionTitle>Primitive Colors</SectionTitle>
        <div className="flex flex-col gap-10">
          {Object.entries(primitiveColors).map(([group, colors]) => (
            <div key={group}>
              <SubTitle>{group}</SubTitle>
              <div className="flex flex-wrap gap-4">
                {colors.map((c) => (
                  <ColorSwatch
                    key={`${group}-${c.name}`}
                    name={`${group} ${c.name}`}
                    token={`--primitive-color-${group.toLowerCase().replace(' ', '-')}${c.name}`}
                    value={c.value}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Colors: Semantic ─── */}
      <section>
        <SectionTitle>Semantic Colors</SectionTitle>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {semanticColors.map((c) => (
            <SemanticSwatch key={c.cssVar} label={c.label} cssVar={c.cssVar} />
          ))}
        </div>
      </section>

      {/* ─── Typography ─── */}
      <section>
        <SectionTitle>Typography</SectionTitle>

        <SubTitle>Heading (Semibold 600)</SubTitle>
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex items-baseline gap-4">
            <span className="w-24 text-body-xs text-[var(--color-text-subtle)]">H1 · 40/48</span>
            <span className="text-heading-h1">Heading 1</span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="w-24 text-body-xs text-[var(--color-text-subtle)]">H2 · 32/40</span>
            <span className="text-heading-h2">Heading 2</span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="w-24 text-body-xs text-[var(--color-text-subtle)]">H3 · 24/32</span>
            <span className="text-heading-h3">Heading 3</span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="w-24 text-body-xs text-[var(--color-text-subtle)]">H4 · 18/28</span>
            <span className="text-heading-h4">Heading 4</span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="w-24 text-body-xs text-[var(--color-text-subtle)]">H5 · 16/24</span>
            <span className="text-heading-h5">Heading 5</span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="w-24 text-body-xs text-[var(--color-text-subtle)]">H6 · 14/20</span>
            <span className="text-heading-h6">Heading 6</span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="w-24 text-body-xs text-[var(--color-text-subtle)]">H7 · 12/18</span>
            <span className="text-heading-h7">Heading 7</span>
          </div>
        </div>

        <SubTitle>Body (Regular 400)</SubTitle>
        <div className="flex flex-col gap-3 mb-8">
          <div className="flex items-baseline gap-4">
            <span className="w-24 text-body-xs text-[var(--color-text-subtle)]">LG · 14/20</span>
            <span className="text-body-lg">
              Body Large — The quick brown fox jumps over the lazy dog
            </span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="w-24 text-body-xs text-[var(--color-text-subtle)]">MD · 12/18</span>
            <span className="text-body-md">
              Body Medium — The quick brown fox jumps over the lazy dog
            </span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="w-24 text-body-xs text-[var(--color-text-subtle)]">SM · 11/16</span>
            <span className="text-body-sm">
              Body Small — The quick brown fox jumps over the lazy dog
            </span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="w-24 text-body-xs text-[var(--color-text-subtle)]">XS · 10/14</span>
            <span className="text-body-xs">
              Body Extra Small — The quick brown fox jumps over the lazy dog
            </span>
          </div>
        </div>

        <SubTitle>Label (Medium 500)</SubTitle>
        <div className="flex flex-col gap-3">
          <div className="flex items-baseline gap-4">
            <span className="w-24 text-body-xs text-[var(--color-text-subtle)]">LG · 13/18</span>
            <span className="text-label-lg">Label Large</span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="w-24 text-body-xs text-[var(--color-text-subtle)]">MD · 12/18</span>
            <span className="text-label-md">Label Medium</span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="w-24 text-body-xs text-[var(--color-text-subtle)]">SM · 11/16</span>
            <span className="text-label-sm">Label Small</span>
          </div>
        </div>
      </section>

      {/* ─── Spacing ─── */}
      <section>
        <SectionTitle>Spacing Scale</SectionTitle>
        <div className="flex flex-col gap-3">
          {spacingScale.map((s) => (
            <div key={s.token} className="flex items-center gap-4">
              <span className="w-12 text-right text-body-xs text-[var(--color-text-subtle)]">
                {s.token}
              </span>
              <div
                className="h-4 bg-[var(--color-action-primary)] rounded-sm"
                style={{ width: s.value === '0' ? '2px' : s.value }}
              />
              <span className="text-body-xs text-[var(--color-text-muted)]">{s.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Border Radius ─── */}
      <section>
        <SectionTitle>Border Radius</SectionTitle>
        <div className="flex flex-wrap gap-6">
          {radiusScale.map((r) => (
            <div key={r.name} className="flex flex-col items-center gap-2">
              <div
                className="w-20 h-20 bg-[var(--color-action-primary)] opacity-20"
                style={{ borderRadius: r.value }}
              />
              <span className="text-body-sm text-[var(--color-text-default)] font-medium">
                {r.name}
              </span>
              <span className="text-body-xs text-[var(--color-text-subtle)]">{r.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Shadows ─── */}
      <section>
        <SectionTitle>Shadows</SectionTitle>
        <div className="flex flex-wrap gap-8">
          {shadows.map((s) => (
            <div key={s.name} className="flex flex-col items-center gap-3">
              <div
                className="w-24 h-24 bg-white rounded-[var(--primitive-radius-lg)]"
                style={{ boxShadow: s.value }}
              />
              <span className="text-body-sm text-[var(--color-text-default)] font-medium">
                {s.name}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
