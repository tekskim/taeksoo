import { NavLink } from 'react-router-dom';
import {
  IconServer,
  IconNetwork,
  IconDatabase,
  IconKey,
  IconShieldLock,
} from '@tabler/icons-react';

const navItems = [
  { label: 'Instances', path: '/', icon: <IconServer size={16} stroke={1.5} /> },
  { label: 'Networks', path: '/networks', icon: <IconNetwork size={16} stroke={1.5} /> },
  { label: 'Volumes', path: '/volumes', icon: <IconDatabase size={16} stroke={1.5} /> },
  { label: 'Key Pairs', path: '/key-pairs', icon: <IconKey size={16} stroke={1.5} /> },
  {
    label: 'Security Groups',
    path: '/security-groups',
    icon: <IconShieldLock size={16} stroke={1.5} />,
  },
];

export function MockSidebar() {
  return (
    <div
      className="flex flex-col h-full bg-[var(--color-surface-default)] border-r border-[var(--color-border-default)]"
      style={{ width: 200 }}
    >
      <div className="px-4 py-3 border-b border-[var(--color-border-default)]">
        <span className="text-heading-h6 text-[var(--color-text-default)]">Compute</span>
      </div>
      <nav className="flex-1 px-2 py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              [
                'flex items-center gap-2 px-2 py-1.5 rounded-[var(--radius-md)] text-body-lg transition-colors',
                isActive
                  ? 'bg-[var(--color-action-primary-subtle)] text-[var(--color-action-primary)]'
                  : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-default)]',
              ].join(' ')
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
