import { Link } from 'react-router-dom';
import { labNavGroups } from './labNavigationData';

export function LabHomePage() {
  const totalItems = labNavGroups.reduce((acc, g) => acc + g.items.length, 0);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-10">
      <div className="text-center space-y-3">
        <h1 className="text-heading-h3 text-[var(--color-text-default)]">Lab</h1>
        <p className="text-body-md text-[var(--color-text-muted)] max-w-[400px]">
          디자인 시스템의 실험적인 아이디어, 프로토타입, 감사 도구들을 탐색하는 공간입니다.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 w-full max-w-[560px]">
        {labNavGroups.map((group) => (
          <Link
            key={group.title}
            to={group.items[0]?.path ?? '/lab'}
            className="group px-4 py-3 rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)] hover:border-[var(--color-action-primary)] hover:shadow-sm transition-all"
          >
            <div className="text-label-sm font-semibold text-[var(--color-text-default)] group-hover:text-[var(--color-action-primary)] transition-colors">
              {group.title}
            </div>
            <div className="text-body-xs text-[var(--color-text-muted)] mt-0.5">
              {group.items.length} items
            </div>
          </Link>
        ))}
      </div>

      <p className="text-body-xs text-[var(--color-text-disabled)]">
        {labNavGroups.length} categories &middot; {totalItems} pages
      </p>
    </div>
  );
}

export default LabHomePage;
