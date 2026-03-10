import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FileListCard, FileListSection } from './FileListCard';
import type { FileItem } from './FileListCard';
import { IconUpload } from '@tabler/icons-react';

/**
 * # FileListCard
 *
 * 업로드된 파일 목록을 표시하는 카드 컴포넌트입니다.
 * FileListSection은 라벨, 업로드 버튼, 에러 메시지를 포함하는 상위 레이아웃 컴포넌트입니다.
 *
 * ## 언제 사용하나요?
 * - 파일 업로드 후 업로드된 파일 목록을 표시할 때
 * - 인증서, 이미지, 설정 파일 등의 첨부 파일 관리 시
 *
 * ## 기능
 * - **파일 목록 표시**: 파일 이름, 태그(크기/개수 등), 설명 표시
 * - **삭제 버튼**: onRemove 콜백으로 개별 파일 제거
 * - **빈 상태**: 파일이 없을 때 메시지 표시
 * - **FileListSection**: 라벨 + 업로드 버튼 + 에러 + FileListCard 조합
 */
const meta = {
  title: 'Components/FileListCard',
  component: FileListCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '업로드된 파일 목록을 표시하는 카드 컴포넌트입니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    emptyMessage: {
      control: 'text',
      description: '파일이 없을 때 표시할 메시지',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '"No files"' },
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FileListCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ----------------------------------------
   Sample Data
   ---------------------------------------- */

const sampleFiles: FileItem[] = [
  { id: '1', name: 'certificate.pem', tags: ['2.5 KB', 'PEM'] },
  { id: '2', name: 'private-key.pem', tags: ['1.8 KB', 'PEM'] },
  { id: '3', name: 'ca-bundle.crt', tags: ['4.1 KB', 'CRT'] },
];

const filesWithDescriptions: FileItem[] = [
  { id: '1', name: 'deployment.yaml', description: 'Kubernetes deployment manifest' },
  { id: '2', name: 'service.yaml', description: 'Service configuration' },
  { id: '3', name: 'configmap.yaml', description: 'ConfigMap with environment variables' },
];

/* ----------------------------------------
   Basic Examples
   ---------------------------------------- */

export const Default: Story = {
  args: {
    files: sampleFiles,
  },
};

export const WithDescriptions: Story = {
  name: 'With Descriptions',
  args: {
    files: filesWithDescriptions,
  },
};

export const SingleFile: Story = {
  name: 'Single File',
  args: {
    files: [{ id: '1', name: 'server.crt', tags: ['3.2 KB', 'Certificate'] }],
  },
};

export const Empty: Story = {
  args: {
    files: [],
    emptyMessage: 'No files uploaded',
  },
};

/* ----------------------------------------
   With Remove
   ---------------------------------------- */

export const Removable: Story = {
  render: function RemovableExample() {
    const [files, setFiles] = useState<FileItem[]>([...sampleFiles]);

    const handleRemove = (id: string) => {
      setFiles((prev) => prev.filter((f) => f.id !== id));
    };

    return <FileListCard files={files} onRemove={handleRemove} />;
  },
};

/* ----------------------------------------
   FileListSection
   ---------------------------------------- */

export const Section: Story = {
  name: 'FileListSection',
  render: function SectionExample() {
    const [files, setFiles] = useState<FileItem[]>([
      { id: '1', name: 'server.crt', tags: ['3.2 KB'] },
    ]);

    return (
      <FileListSection
        label="SSL Certificate"
        required
        files={files}
        onRemove={(id) => setFiles((prev) => prev.filter((f) => f.id !== id))}
        onUpload={() => {
          const newFile: FileItem = {
            id: String(Date.now()),
            name: `file-${files.length + 1}.pem`,
            tags: ['1.0 KB'],
          };
          setFiles((prev) => [...prev, newFile]);
        }}
        uploadLabel="Upload Certificate"
        uploadIcon={<IconUpload size={12} />}
      />
    );
  },
};

export const SectionWithError: Story = {
  name: 'FileListSection — Error',
  render: () => (
    <FileListSection
      label="Upload Files"
      required
      files={[]}
      onUpload={() => {}}
      uploadLabel="Choose file"
      uploadIcon={<IconUpload size={12} />}
      error="At least one file is required."
      emptyMessage="No files uploaded yet"
    />
  ),
};

export const SectionEmpty: Story = {
  name: 'FileListSection — Empty',
  render: () => (
    <FileListSection
      label="Attachments"
      files={[]}
      onUpload={() => {}}
      uploadLabel="Choose file"
      uploadIcon={<IconUpload size={12} />}
    />
  ),
};
