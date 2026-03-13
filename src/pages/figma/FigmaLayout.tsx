import { Outlet, Link, useLocation } from 'react-router-dom';

const navItems = [
  { label: 'Foundation', path: '/figma/foundation' },
  { label: 'Components', path: '/figma/components' },
  { label: 'Cloud Builder', path: '/figma/cloudbuilder' },
];

export function FigmaLayout() {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-50 bg-white border-b border-[var(--color-border-default)] px-8 py-3 flex items-center gap-6">
        <span className="text-heading-h6 text-[var(--color-text-default)]">TDS Figma Capture</span>
        <div className="flex gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3 py-1.5 rounded-md text-label-sm transition-colors ${
                pathname === item.path
                  ? 'bg-[var(--color-action-primary)] text-white'
                  : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-subtle)]'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
      <main className="max-w-[1200px] mx-auto px-8 py-10">
        <Outlet />
      </main>
    </div>
  );
}
