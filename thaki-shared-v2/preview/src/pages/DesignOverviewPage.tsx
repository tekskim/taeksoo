import { Link } from 'react-router-dom';

const categories = [
  {
    title: 'Form Controls',
    description: 'Buttons, inputs, selects, checkboxes, toggles, and form fields',
    path: '/design/form-controls',
    count: 13,
    color: '#2563eb',
  },
  {
    title: 'Data Display',
    description: 'Tables, badges, status indicators, pagination, and section cards',
    path: '/design/data-display',
    count: 10,
    color: '#059669',
  },
  {
    title: 'Overlays',
    description: 'Modals, drawers, tooltips, and context menus',
    path: '/design/overlays',
    count: 6,
    color: '#d97706',
  },
  {
    title: 'Navigation',
    description: 'Tabs, tab bars, breadcrumbs, sidebars, and toolbars',
    path: '/design/navigation',
    count: 6,
    color: '#7c3aed',
  },
  {
    title: 'Layout',
    description: 'Stacks, containers, fieldsets, detail headers, and empty states',
    path: '/design/layout',
    count: 8,
    color: '#dc2626',
  },
  {
    title: 'Feedback',
    description: 'Inline messages, toasts, loading spinners, skeletons, and errors',
    path: '/design/feedback',
    count: 5,
    color: '#0891b2',
  },
];

export function DesignOverviewPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-[28px] leading-[36px] font-semibold text-text m-0">
          shared-v2 Components
        </h1>
        <p className="text-14 leading-20 text-text-muted m-0">
          Visual catalog of all @ThakiCloud/shared components. Each section shows live examples with
          different variants and states.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.path}
            to={cat.path}
            className="flex gap-4 p-5 rounded-xl border border-border bg-surface hover:border-[color:var(--color-border-strong)] hover:shadow-sm transition-all no-underline"
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-[16px] font-bold flex-shrink-0"
              style={{ backgroundColor: cat.color }}
            >
              {cat.title[0]}
            </div>
            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-14 font-semibold leading-20 text-text">{cat.title}</span>
                <span className="text-11 leading-16 text-text-muted bg-surface-muted px-1.5 py-0.5 rounded">
                  {cat.count}
                </span>
              </div>
              <span className="text-12 leading-18 text-text-muted">{cat.description}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
