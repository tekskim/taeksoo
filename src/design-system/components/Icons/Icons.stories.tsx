import type { Meta, StoryObj } from '@storybook/react';
import { Icons, type IconName } from './index';

const meta: Meta = {
  title: 'Components/Icons',
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj;

/* ----------------------------------------
   Icon Grid Component
   ---------------------------------------- */

interface IconGridProps {
  icons: { name: string; Icon: React.ComponentType<{ size?: number; stroke?: number }> }[];
  title: string;
}

function IconGrid({ icons, title }: IconGridProps) {
  return (
    <div className="mb-[var(--primitive-spacing-8)]">
      <h3 className="text-heading-h6 text-[var(--color-text-default)] mb-[var(--primitive-spacing-4)]">
        {title}
      </h3>
      <div className="grid grid-cols-6 gap-[var(--primitive-spacing-4)]">
        {icons.map(({ name, Icon }) => (
          <div
            key={name}
            className="flex flex-col items-center gap-[var(--primitive-spacing-2)] p-[var(--primitive-spacing-3)] rounded-[var(--primitive-radius-lg)] hover:bg-[var(--color-surface-subtle)] transition-colors"
          >
            <Icon size={24} stroke={1.5} />
            <span className="text-body-sm text-[var(--color-text-muted)] text-center truncate w-full">
              {name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ----------------------------------------
   All Icons
   ---------------------------------------- */

export const AllIcons: Story = {
  render: () => {
    const iconEntries = Object.entries(Icons) as [IconName, (typeof Icons)[IconName]][];
    const icons = iconEntries.map(([name, Icon]) => ({ name, Icon }));

    return (
      <div className="p-[var(--primitive-spacing-4)]">
        <h2 className="text-heading-h5 text-[var(--color-text-default)] mb-[var(--primitive-spacing-6)]">
          TDS Icons ({icons.length} icons)
        </h2>
        <p className="text-body-md text-[var(--color-text-muted)] mb-[var(--primitive-spacing-8)]">
          사용법:{' '}
          <code className="bg-[var(--color-surface-subtle)] px-[var(--primitive-spacing-2)] py-[var(--primitive-spacing-1)] rounded-[var(--primitive-radius-md)]">
            {'<Icons.ChevronDown size={12} />'}
          </code>
        </p>
        <div className="grid grid-cols-8 gap-[var(--primitive-spacing-3)]">
          {icons.map(({ name, Icon }) => (
            <div
              key={name}
              className="flex flex-col items-center gap-[var(--primitive-spacing-2)] p-[var(--primitive-spacing-3)] rounded-[var(--primitive-radius-lg)] hover:bg-[var(--color-surface-subtle)] transition-colors cursor-pointer"
              title={name}
            >
              <Icon size={20} stroke={1.5} />
              <span className="text-body-xs text-[var(--color-text-muted)] text-center truncate w-full">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  },
};

/* ----------------------------------------
   By Category
   ---------------------------------------- */

export const ByCategory: Story = {
  render: () => {
    const categories = {
      'Navigation & UI': [
        'ChevronLeft',
        'ChevronRight',
        'ChevronDown',
        'ChevronUp',
        'Add',
        'Edit',
        'Delete',
        'Search',
        'Copy',
        'MoreKebab',
        'MoreMeatball',
        'Setting',
        'Home',
      ],
      'Media Controls': ['Play', 'Stop', 'Paused', 'Refresh'],
      'Status & State': [
        'Error',
        'Alert',
        'Info',
        'Warning',
        'Check',
        'CheckCircle',
        'Active',
        'Deactivated',
        'Lock',
      ],
      'Cloud Infrastructure': [
        'Instances',
        'Server',
        'Storage',
        'Networks',
        'Routers',
        'LoadBalancer',
        'Security',
        'Key',
        'Images',
      ],
      'AI & ML': ['Brain', 'Robot', 'Chatbot', 'Puzzle'],
    };

    return (
      <div className="p-[var(--primitive-spacing-4)]">
        <h2 className="text-heading-h5 text-[var(--color-text-default)] mb-[var(--primitive-spacing-6)]">
          Icons by Category
        </h2>
        {Object.entries(categories).map(([category, iconNames]) => (
          <IconGrid
            key={category}
            title={category}
            icons={iconNames
              .filter((name) => name in Icons)
              .map((name) => ({
                name,
                Icon: Icons[name as IconName],
              }))}
          />
        ))}
      </div>
    );
  },
};

/* ----------------------------------------
   Sizes
   ---------------------------------------- */

export const Sizes: Story = {
  render: () => {
    const sizes = [12, 14, 16, 20, 24, 32];

    return (
      <div className="p-[var(--primitive-spacing-4)]">
        <h2 className="text-heading-h5 text-[var(--color-text-default)] mb-[var(--primitive-spacing-6)]">
          Icon Sizes
        </h2>
        <div className="flex items-end gap-[var(--primitive-spacing-6)]">
          {sizes.map((size) => (
            <div key={size} className="flex flex-col items-center gap-[var(--primitive-spacing-2)]">
              <Icons.Settings size={size} stroke={1.5} />
              <span className="text-body-sm text-[var(--color-text-muted)]">{size}px</span>
            </div>
          ))}
        </div>
      </div>
    );
  },
};

/* ----------------------------------------
   Stroke Width
   ---------------------------------------- */

export const StrokeWidth: Story = {
  render: () => {
    const strokes = [1, 1.5, 2, 2.5];

    return (
      <div className="p-[var(--primitive-spacing-4)]">
        <h2 className="text-heading-h5 text-[var(--color-text-default)] mb-[var(--primitive-spacing-6)]">
          Stroke Width
        </h2>
        <div className="flex items-center gap-[var(--primitive-spacing-8)]">
          {strokes.map((stroke) => (
            <div
              key={stroke}
              className="flex flex-col items-center gap-[var(--primitive-spacing-2)]"
            >
              <Icons.Settings size={24} stroke={stroke} />
              <span className="text-body-sm text-[var(--color-text-muted)]">stroke={stroke}</span>
            </div>
          ))}
        </div>
      </div>
    );
  },
};

/* ----------------------------------------
   Colors
   ---------------------------------------- */

export const Colors: Story = {
  render: () => {
    const colors = [
      { name: 'Default', class: 'text-[var(--color-text-default)]' },
      { name: 'Muted', class: 'text-[var(--color-text-muted)]' },
      { name: 'Primary', class: 'text-[var(--color-action-primary)]' },
      { name: 'Success', class: 'text-[var(--color-state-success)]' },
      { name: 'Warning', class: 'text-[var(--color-state-warning)]' },
      { name: 'Danger', class: 'text-[var(--color-state-danger)]' },
    ];

    return (
      <div className="p-[var(--primitive-spacing-4)]">
        <h2 className="text-heading-h5 text-[var(--color-text-default)] mb-[var(--primitive-spacing-6)]">
          Icon Colors
        </h2>
        <div className="flex items-center gap-[var(--primitive-spacing-6)]">
          {colors.map(({ name, class: colorClass }) => (
            <div key={name} className="flex flex-col items-center gap-[var(--primitive-spacing-2)]">
              <Icons.CheckCircle size={24} stroke={1.5} className={colorClass} />
              <span className="text-body-sm text-[var(--color-text-muted)]">{name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  },
};

/* ----------------------------------------
   Usage Example
   ---------------------------------------- */

export const UsageExample: Story = {
  render: () => (
    <div className="p-[var(--primitive-spacing-4)] flex flex-col gap-[var(--primitive-spacing-6)]">
      <h2 className="text-heading-h5 text-[var(--color-text-default)]">Usage Examples</h2>

      {/* In Button */}
      <div>
        <h3 className="text-label-md text-[var(--color-text-muted)] mb-[var(--primitive-spacing-3)]">
          In Button
        </h3>
        <button className="inline-flex items-center gap-[var(--primitive-spacing-2)] px-[var(--primitive-spacing-4)] py-[var(--primitive-spacing-2)] bg-[var(--color-action-primary)] text-[var(--color-on-primary)] rounded-[var(--primitive-radius-md)]">
          <Icons.Add size={12} stroke={2} />
          <span>Create New</span>
        </button>
      </div>

      {/* Status Indicator */}
      <div>
        <h3 className="text-label-md text-[var(--color-text-muted)] mb-[var(--primitive-spacing-3)]">
          Status Indicators
        </h3>
        <div className="flex items-center gap-[var(--primitive-spacing-4)]">
          <span className="inline-flex items-center gap-[var(--primitive-spacing-1)] text-[var(--color-state-success)]">
            <Icons.CheckCircle size={12} /> Active
          </span>
          <span className="inline-flex items-center gap-[var(--primitive-spacing-1)] text-[var(--color-state-warning)]">
            <Icons.Warning size={12} /> Warning
          </span>
          <span className="inline-flex items-center gap-[var(--primitive-spacing-1)] text-[var(--color-state-danger)]">
            <Icons.Error size={12} /> Error
          </span>
        </div>
      </div>

      {/* Navigation */}
      <div>
        <h3 className="text-label-md text-[var(--color-text-muted)] mb-[var(--primitive-spacing-3)]">
          Navigation
        </h3>
        <div className="flex items-center gap-[var(--primitive-spacing-2)] text-[var(--color-text-muted)]">
          <Icons.Home size={12} />
          <Icons.ChevronRight size={12} />
          <span>Settings</span>
          <Icons.ChevronRight size={12} />
          <span className="text-[var(--color-text-default)]">Profile</span>
        </div>
      </div>
    </div>
  ),
};
