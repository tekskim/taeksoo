interface DosDontsProps {
  doItems?: string[];
  dontItems?: string[];
}

export function DosDonts({ doItems, dontItems }: DosDontsProps) {
  if (!doItems?.length && !dontItems?.length) return null;

  return (
    <div className="grid grid-cols-2 gap-4">
      {doItems && doItems.length > 0 && (
        <div className="p-4 bg-[var(--color-state-success-bg)] rounded-[var(--primitive-radius-md)] border border-[var(--color-border-default)]">
          <h4 className="text-heading-h6 text-[var(--color-state-success)] mb-3">Do</h4>
          <ul className="list-disc pl-5 text-body-md text-[var(--color-text-default)] space-y-1">
            {doItems.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}
      {dontItems && dontItems.length > 0 && (
        <div className="p-4 bg-[var(--color-state-danger-bg)] rounded-[var(--primitive-radius-md)] border border-[var(--color-border-default)]">
          <h4 className="text-heading-h6 text-[var(--color-state-danger)] mb-3">Don't</h4>
          <ul className="list-disc pl-5 text-body-md text-[var(--color-text-default)] space-y-1">
            {dontItems.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
