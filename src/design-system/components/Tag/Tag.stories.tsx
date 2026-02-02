import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Tag, TagGroup } from './Tag';
import { IconTag, IconUser, IconStar } from '@tabler/icons-react';

const meta: Meta<typeof Tag> = {
  title: 'Components/Tag',
  component: Tag,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'primary', 'success', 'warning', 'danger', 'info'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tag>;

/* ----------------------------------------
   Basic Stories
   ---------------------------------------- */

export const Default: Story = {
  args: {
    children: 'Tag',
  },
};

/* ----------------------------------------
   Variants
   ---------------------------------------- */

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Tag variant="default">Default</Tag>
      <Tag variant="primary">Primary</Tag>
      <Tag variant="success">Success</Tag>
      <Tag variant="warning">Warning</Tag>
      <Tag variant="danger">Danger</Tag>
      <Tag variant="info">Info</Tag>
    </div>
  ),
};

export const OutlineVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Tag variant="default" outline>
        Default
      </Tag>
      <Tag variant="primary" outline>
        Primary
      </Tag>
      <Tag variant="success" outline>
        Success
      </Tag>
      <Tag variant="warning" outline>
        Warning
      </Tag>
      <Tag variant="danger" outline>
        Danger
      </Tag>
      <Tag variant="info" outline>
        Info
      </Tag>
    </div>
  ),
};

/* ----------------------------------------
   Sizes
   ---------------------------------------- */

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Tag size="sm">Small</Tag>
      <Tag size="md">Medium</Tag>
      <Tag size="lg">Large</Tag>
    </div>
  ),
};

/* ----------------------------------------
   Shapes
   ---------------------------------------- */

export const Rounded: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Tag rounded>Default</Tag>
      <Tag variant="primary" rounded>
        Primary
      </Tag>
      <Tag variant="success" rounded>
        Success
      </Tag>
      <Tag variant="danger" rounded outline>
        Danger Outline
      </Tag>
    </div>
  ),
};

/* ----------------------------------------
   With Icons
   ---------------------------------------- */

export const WithIcon: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Tag icon={<IconTag size={12} />}>Category</Tag>
      <Tag variant="primary" icon={<IconUser size={12} />}>
        User
      </Tag>
      <Tag variant="success" icon={<IconStar size={12} />}>
        Featured
      </Tag>
    </div>
  ),
};

/* ----------------------------------------
   Closable
   ---------------------------------------- */

export const Closable: Story = {
  render: () => {
    const [tags, setTags] = useState(['React', 'TypeScript', 'Tailwind', 'Vite']);

    const handleClose = (tagToRemove: string) => {
      setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    return (
      <TagGroup>
        {tags.map((tag) => (
          <Tag key={tag} closable onClose={() => handleClose(tag)}>
            {tag}
          </Tag>
        ))}
        {tags.length === 0 && (
          <span className="text-body-sm text-[var(--color-text-muted)]">No tags</span>
        )}
      </TagGroup>
    );
  },
};

export const ClosableVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Tag variant="default" closable onClose={() => {}}>
        Default
      </Tag>
      <Tag variant="primary" closable onClose={() => {}}>
        Primary
      </Tag>
      <Tag variant="success" closable onClose={() => {}}>
        Success
      </Tag>
      <Tag variant="danger" closable onClose={() => {}}>
        Danger
      </Tag>
    </div>
  ),
};

/* ----------------------------------------
   Clickable
   ---------------------------------------- */

export const Clickable: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>(['react']);

    const toggleTag = (tag: string) => {
      setSelected((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
    };

    const tags = ['react', 'vue', 'angular', 'svelte'];

    return (
      <div className="flex flex-col gap-4">
        <TagGroup>
          {tags.map((tag) => (
            <Tag
              key={tag}
              variant={selected.includes(tag) ? 'primary' : 'default'}
              onClick={() => toggleTag(tag)}
              clickable
            >
              {tag}
            </Tag>
          ))}
        </TagGroup>
        <p className="text-body-sm text-[var(--color-text-muted)]">
          Selected: {selected.join(', ') || 'None'}
        </p>
      </div>
    );
  },
};

/* ----------------------------------------
   States
   ---------------------------------------- */

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Tag disabled>Disabled</Tag>
      <Tag variant="primary" disabled>
        Disabled Primary
      </Tag>
      <Tag closable disabled onClose={() => {}}>
        Disabled Closable
      </Tag>
    </div>
  ),
};

/* ----------------------------------------
   TagGroup Examples
   ---------------------------------------- */

export const TagGroupExample: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div>
        <h4 className="text-label-sm text-[var(--color-text-subtle)] mb-2">Small Gap</h4>
        <TagGroup gap="sm">
          <Tag>Tag 1</Tag>
          <Tag>Tag 2</Tag>
          <Tag>Tag 3</Tag>
        </TagGroup>
      </div>
      <div>
        <h4 className="text-label-sm text-[var(--color-text-subtle)] mb-2">Medium Gap (default)</h4>
        <TagGroup gap="md">
          <Tag>Tag 1</Tag>
          <Tag>Tag 2</Tag>
          <Tag>Tag 3</Tag>
        </TagGroup>
      </div>
      <div>
        <h4 className="text-label-sm text-[var(--color-text-subtle)] mb-2">Large Gap</h4>
        <TagGroup gap="lg">
          <Tag>Tag 1</Tag>
          <Tag>Tag 2</Tag>
          <Tag>Tag 3</Tag>
        </TagGroup>
      </div>
    </div>
  ),
};

/* ----------------------------------------
   Real World Examples
   ---------------------------------------- */

export const SkillTags: Story = {
  render: () => (
    <div className="p-4 bg-[var(--color-surface-subtle)] rounded-lg">
      <h3 className="text-heading-h6 text-[var(--color-text-default)] mb-3">Skills</h3>
      <TagGroup>
        <Tag variant="primary">JavaScript</Tag>
        <Tag variant="primary">TypeScript</Tag>
        <Tag variant="primary">React</Tag>
        <Tag variant="info">Node.js</Tag>
        <Tag variant="info">Python</Tag>
        <Tag variant="success">AWS</Tag>
        <Tag variant="success">Docker</Tag>
      </TagGroup>
    </div>
  ),
};

export const StatusTags: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="text-body-md text-[var(--color-text-default)] w-24">Production:</span>
        <Tag variant="success" size="sm">
          Healthy
        </Tag>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-body-md text-[var(--color-text-default)] w-24">Staging:</span>
        <Tag variant="warning" size="sm">
          Deploying
        </Tag>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-body-md text-[var(--color-text-default)] w-24">Development:</span>
        <Tag variant="danger" size="sm">
          Failed
        </Tag>
      </div>
    </div>
  ),
};

export const FilterTags: Story = {
  render: () => {
    const [filters, setFilters] = useState(['Status: Active', 'Type: VM', 'Region: US-East']);

    const removeFilter = (filter: string) => {
      setFilters(filters.filter((f) => f !== filter));
    };

    return (
      <div className="flex flex-col gap-2">
        <div className="text-label-sm text-[var(--color-text-subtle)]">Active Filters</div>
        <TagGroup>
          {filters.map((filter) => (
            <Tag
              key={filter}
              variant="primary"
              outline
              closable
              onClose={() => removeFilter(filter)}
            >
              {filter}
            </Tag>
          ))}
          {filters.length > 0 && (
            <button
              className="text-body-sm text-[var(--color-action-primary)] hover:underline"
              onClick={() => setFilters([])}
            >
              Clear all
            </button>
          )}
        </TagGroup>
      </div>
    );
  },
};
