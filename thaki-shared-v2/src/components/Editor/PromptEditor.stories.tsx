import type { Meta, StoryObj } from '@storybook/react';
import { PromptEditor, PromptEditorRef } from './PromptEditor';
import { useRef } from 'react';

const meta: Meta<typeof PromptEditor> = {
  title: 'Form/PromptEditor',
  component: PromptEditor,
  parameters: {
    layout: 'centered',
    actions: { argTypesRegex: '^on.*' },
    docs: {
      description: {
        component: '언어 모델의 프롬프트를 편집할 수 있는 컴포넌트입니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof meta>;

const PromptEditorTemplate = (args: any) => {
  const promptEditorRef = useRef<PromptEditorRef>(null);

  const handleSetValue = () => {
    promptEditorRef.current?.setValue('test');
  };

  const handleGetValue = () => {
    window.alert(`현재 프롬프트 에디터의 값: ${promptEditorRef.current?.getValue()}`);
  };

  return (
    <div>
      <PromptEditor {...args} ref={promptEditorRef} />
      <div>
        <button onClick={handleSetValue}>set value</button>
        <button onClick={handleGetValue}>get value</button>
      </div>
    </div>
  );
};

export const Default: Story = {
  render: PromptEditorTemplate,
  args: {},
};
