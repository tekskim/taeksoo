import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import Layout from '../Layout';
import { TagInput } from './TagInput';
import type { Tag } from '../../services/utils/tagValidation';

const meta: Meta<typeof TagInput> = {
  title: 'Form/TagInput',
  component: TagInput,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Default
// ---------------------------------------------------------------------------

const DefaultTemplate = () => {
  const [tags, setTags] = useState<Tag[]>([
    { key: 'environment', value: 'production' },
    { key: 'team', value: 'platform' },
  ]);

  return (
    <div style={{ maxWidth: 640 }}>
      <TagInput tags={tags} onTagsChange={setTags}>
        <Layout.VStack gap="md">
          <TagInput.AddButton />
          <TagInput.Form />
        </Layout.VStack>
      </TagInput>
    </div>
  );
};

export const Default: Story = {
  render: () => <DefaultTemplate />,
};
