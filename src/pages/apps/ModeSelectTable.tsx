import React from 'react';
import type { DeployModeOption } from './appsTypes';

const COL_HEADER: React.CSSProperties = {
  fontSize: 'var(--font-size-12)',
  fontWeight: 'var(--font-weight-medium)',
  color: 'var(--color-text-subtle)',
  padding: '6px 12px',
  textAlign: 'left' as const,
  whiteSpace: 'nowrap' as const,
  background: 'var(--color-surface-subtle)',
};

const COL_CELL: React.CSSProperties = {
  fontSize: 'var(--font-size-13)',
  color: 'var(--color-text-default)',
  padding: '10px 12px',
  verticalAlign: 'middle' as const,
};

export function ModeSelectTable({
  modes,
  value,
  onChange,
}: {
  modes: DeployModeOption[];
  value: string;
  onChange: (v: string) => void;
}) {
  const hasSummary = modes.some((m) => m.summary);
  const hasReplicas = modes.some((m) => m.replicas);
  const hasPersistence = modes.some((m) => m.persistence);
  const hasServiceType = modes.some((m) => m.serviceType);
  const hasTemplate = modes.some((m) => m.template);

  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{ border: '1px solid var(--color-border-default)' }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={COL_HEADER}>Mode</th>
            {hasSummary && <th style={COL_HEADER}>Summary</th>}
            {hasReplicas && <th style={{ ...COL_HEADER, textAlign: 'center' }}>Replicas</th>}
            {hasPersistence && <th style={{ ...COL_HEADER, textAlign: 'center' }}>Persistence</th>}
            {hasServiceType && <th style={COL_HEADER}>Service</th>}
            {hasTemplate && <th style={COL_HEADER}>Template</th>}
          </tr>
        </thead>
        <tbody>
          {modes.map((mode, idx) => {
            const selected = value === mode.value;
            const rowBg = selected
              ? 'var(--color-primary-subtle, #eff6ff)'
              : 'var(--color-surface-default)';
            return (
              <tr
                key={mode.value}
                onClick={() => onChange(mode.value)}
                style={{
                  background: rowBg,
                  cursor: 'pointer',
                  borderTop: idx === 0 ? 'none' : '1px solid var(--color-border-default)',
                  outline: selected ? '1.5px solid var(--color-primary-default, #3b82f6)' : 'none',
                  outlineOffset: '-1.5px',
                }}
              >
                {/* Mode column: radio + label + badge */}
                <td style={COL_CELL}>
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={selected}
                      onChange={() => onChange(mode.value)}
                      onClick={(e) => e.stopPropagation()}
                      style={{ accentColor: 'var(--color-primary-default, #3b82f6)', marginTop: 1 }}
                    />
                    <div className="flex flex-col gap-0.5">
                      <span style={{ fontWeight: 'var(--font-weight-medium)' }}>{mode.label}</span>
                      {mode.badge && (
                        <span
                          className="inline-block px-1.5 py-0.5 rounded text-[11px] font-medium"
                          style={{
                            background:
                              mode.badge === 'Default'
                                ? 'var(--color-primary-subtle, #eff6ff)'
                                : 'var(--color-surface-muted)',
                            color:
                              mode.badge === 'Default'
                                ? 'var(--color-primary-default, #3b82f6)'
                                : 'var(--color-text-subtle)',
                            width: 'fit-content',
                          }}
                        >
                          {mode.badge}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                {hasSummary && (
                  <td style={{ ...COL_CELL, color: 'var(--color-text-subtle)' }}>
                    {mode.summary ?? '—'}
                  </td>
                )}
                {hasReplicas && (
                  <td style={{ ...COL_CELL, textAlign: 'center' }}>{mode.replicas ?? '—'}</td>
                )}
                {hasPersistence && (
                  <td style={{ ...COL_CELL, textAlign: 'center' }}>
                    <span
                      style={{
                        color:
                          mode.persistence === 'enabled'
                            ? 'var(--color-success-default, #16a34a)'
                            : 'var(--color-text-subtle)',
                      }}
                    >
                      {mode.persistence ?? '—'}
                    </span>
                  </td>
                )}
                {hasServiceType && <td style={COL_CELL}>{mode.serviceType ?? '—'}</td>}
                {hasTemplate && (
                  <td
                    style={{
                      ...COL_CELL,
                      fontFamily: 'monospace',
                      fontSize: 'var(--font-size-12)',
                      color: 'var(--color-text-subtle)',
                    }}
                  >
                    {mode.template ?? '—'}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
