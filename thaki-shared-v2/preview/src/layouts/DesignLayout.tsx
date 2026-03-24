import { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const NAV_ITEMS = [
  { id: 'form-controls', label: 'Form Controls', path: '/design/form-controls' },
  { id: 'data-display', label: 'Data Display', path: '/design/data-display' },
  { id: 'overlays', label: 'Overlays', path: '/design/overlays' },
  { id: 'navigation', label: 'Navigation', path: '/design/navigation' },
  { id: 'layout', label: 'Layout', path: '/design/layout' },
  { id: 'feedback', label: 'Feedback', path: '/design/feedback' },
];

export function DesignLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    mainRef.current?.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-surface-subtle">
      {/* Sidebar */}
      <aside
        className="flex flex-col bg-surface border-r border-border transition-all duration-200 flex-shrink-0"
        style={{ width: collapsed ? 0 : 220 }}
      >
        {!collapsed && (
          <>
            <div className="h-12 flex items-center gap-2 px-4 border-b border-border flex-shrink-0">
              <div className="w-6 h-6 rounded-md bg-[#8b5cf6] flex items-center justify-center text-white text-[11px] font-bold">
                D
              </div>
              <span className="text-14 font-semibold text-text">Design System</span>
              <button
                type="button"
                onClick={() => setCollapsed(true)}
                className="ml-auto p-1 hover:bg-surface-hover rounded transition-colors cursor-pointer bg-transparent border-none"
                aria-label="Collapse sidebar"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-text-muted"
                >
                  <path d="M4 4v16M8 12h12M14 6l6 6-6 6" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-2 px-2">
              <div className="flex flex-col gap-0.5">
                <button
                  type="button"
                  onClick={() => navigate('/design')}
                  className={`w-full text-left px-3 py-2 rounded-md text-13 font-medium transition-colors cursor-pointer border-none ${
                    location.pathname === '/design'
                      ? 'bg-[color:var(--semantic-color-info-weak,#eff6ff)] text-primary'
                      : 'bg-transparent text-text hover:bg-surface-hover'
                  }`}
                >
                  Overview
                </button>
                <div className="h-px bg-border-subtle mx-2 my-1" />
                <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-text-muted m-0">
                  Components
                </p>
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => navigate(item.path)}
                    className={`w-full text-left px-3 py-2 rounded-md text-13 transition-colors cursor-pointer border-none ${
                      location.pathname === item.path
                        ? 'bg-[color:var(--semantic-color-info-weak,#eff6ff)] text-primary font-medium'
                        : 'bg-transparent text-text hover:bg-surface-hover'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="px-3 py-3 border-t border-border">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="w-full text-left px-3 py-2 rounded-md text-12 text-text-muted hover:text-text hover:bg-surface-hover transition-colors cursor-pointer bg-transparent border-none"
              >
                &larr; Back to apps
              </button>
            </div>
          </>
        )}
      </aside>

      {/* Expand button when collapsed */}
      {collapsed && (
        <button
          type="button"
          onClick={() => setCollapsed(false)}
          className="fixed top-3 left-3 z-10 p-2 bg-surface border border-border rounded-md hover:bg-surface-hover transition-colors cursor-pointer"
          aria-label="Expand sidebar"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-text-muted"
          >
            <path d="M20 4v16M16 12H4M10 6l-6 6 6 6" />
          </svg>
        </button>
      )}

      {/* Main content */}
      <main ref={mainRef} className="flex-1 overflow-y-auto">
        <div className="max-w-[1200px] mx-auto px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
