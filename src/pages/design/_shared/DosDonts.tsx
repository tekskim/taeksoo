import { IconCheck, IconX } from '@tabler/icons-react';

interface DosDontsProps {
  doItems?: string[];
  dontItems?: string[];
}

export function DosDonts({ doItems, dontItems }: DosDontsProps) {
  if (!doItems?.length && !dontItems?.length) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {doItems && doItems.length > 0 && (
        <div className="p-4 rounded-[var(--radius-lg)] border border-[var(--color-state-success)] bg-[var(--color-state-success-bg)]">
          <div className="flex items-center gap-2 mb-3">
            <IconCheck size={16} stroke={2} className="text-[var(--color-state-success)]" />
            <span className="text-label-md text-[var(--color-state-success)]">Do</span>
          </div>
          <ul className="flex flex-col gap-2">
            {doItems.map((item, i) => (
              <li key={i} className="text-body-md text-[var(--color-text-default)] pl-1">
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
      {dontItems && dontItems.length > 0 && (
        <div className="p-4 rounded-[var(--radius-lg)] border border-[var(--color-state-danger)] bg-[var(--color-state-danger-bg)]">
          <div className="flex items-center gap-2 mb-3">
            <IconX size={16} stroke={2} className="text-[var(--color-state-danger)]" />
            <span className="text-label-md text-[var(--color-state-danger)]">Don't</span>
          </div>
          <ul className="flex flex-col gap-2">
            {dontItems.map((item, i) => (
              <li key={i} className="text-body-md text-[var(--color-text-default)] pl-1">
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
