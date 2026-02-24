import { useState } from 'react';
import { VStack, HStack } from '@/design-system';

export interface PropDef {
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  description: string;
}

interface PropsTableProps {
  props: PropDef[];
  name?: string;
}

export function PropsTable({ props, name }: PropsTableProps) {
  const [expandedTypes, setExpandedTypes] = useState<Set<string>>(new Set());

  const toggleType = (propName: string) => {
    setExpandedTypes((prev) => {
      const next = new Set(prev);
      if (next.has(propName)) next.delete(propName);
      else next.add(propName);
      return next;
    });
  };

  const isLongType = (type: string) => type.length > 40;

  return (
    <VStack gap={3} align="stretch">
      {name && (
        <HStack gap={2} align="center">
          <code className="text-label-md text-[var(--color-text-default)] font-mono">{name}</code>
        </HStack>
      )}
      <div className="overflow-x-auto rounded-[var(--primitive-radius-lg)] border border-[var(--color-border-default)]">
        <table className="w-full text-body-sm">
          <thead>
            <tr className="bg-[var(--color-surface-subtle)] border-b border-[var(--color-border-default)]">
              <th className="text-left py-2.5 px-3 font-medium text-[var(--color-text-subtle)] w-[160px]">
                Prop
              </th>
              <th className="text-left py-2.5 px-3 font-medium text-[var(--color-text-subtle)]">
                Type
              </th>
              <th className="text-left py-2.5 px-3 font-medium text-[var(--color-text-subtle)] w-[100px]">
                Default
              </th>
              <th className="text-left py-2.5 px-3 font-medium text-[var(--color-text-subtle)]">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {props.map((prop) => (
              <tr
                key={prop.name}
                className="border-b border-[var(--color-border-subtle)] last:border-b-0 hover:bg-[var(--color-surface-subtle)] transition-colors"
              >
                <td className="py-2.5 px-3 align-top">
                  <HStack gap={1} align="center">
                    <code className="text-body-sm font-mono text-[var(--color-state-info)]">
                      {prop.name}
                    </code>
                    {prop.required && (
                      <span className="text-[var(--color-state-danger)] text-body-xs">*</span>
                    )}
                  </HStack>
                </td>
                <td className="py-2.5 px-3 align-top">
                  {isLongType(prop.type) ? (
                    <button
                      onClick={() => toggleType(prop.name)}
                      className="text-left font-mono text-body-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-default)] transition-colors"
                    >
                      {expandedTypes.has(prop.name) ? (
                        <code className="whitespace-pre-wrap break-all">{prop.type}</code>
                      ) : (
                        <code>{prop.type.slice(0, 40)}…</code>
                      )}
                    </button>
                  ) : (
                    <code className="font-mono text-body-xs text-[var(--color-text-muted)]">
                      {prop.type}
                    </code>
                  )}
                </td>
                <td className="py-2.5 px-3 align-top">
                  {prop.default ? (
                    <code className="font-mono text-body-xs text-[var(--color-text-subtle)]">
                      {prop.default}
                    </code>
                  ) : (
                    <span className="text-[var(--color-text-disabled)]">—</span>
                  )}
                </td>
                <td className="py-2.5 px-3 align-top text-body-sm text-[var(--color-text-muted)]">
                  {prop.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </VStack>
  );
}
