import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  IconEdit,
  IconTrash,
  IconCopy,
  IconDownload,
  IconShare,
  IconSettings,
  IconFolder,
  IconFile,
} from '@tabler/icons-react';
import { ContextMenu } from './ContextMenu';
import { Button } from '../Button/Button';

/**
 * # ContextMenu
 *
 * 우클릭 또는 클릭으로 열리는 컨텍스트 메뉴 컴포넌트입니다.
 *
 * ## 언제 사용하나요?
 * - 테이블 행이나 카드에서 추가 액션 제공
 * - 파일/폴더 관리 메뉴
 * - 편집기에서 컨텍스트 액션
 * - 드롭다운 메뉴 대체
 *
 * ## 기능
 * - **trigger**: 'contextmenu' (우클릭) 또는 'click' (클릭)
 * - **submenu**: 중첩 서브메뉴 지원
 * - **divider**: 항목 구분선
 * - **status**: 'default' 또는 'danger' (삭제 등)
 * - **tooltip**: 항목에 툴팁 추가
 * - **icon**: 항목 앞에 아이콘 표시
 *
 * ## 접근성
 * - Escape 키로 메뉴 닫기
 * - 외부 클릭으로 메뉴 닫기
 * - 포커스 트랩 지원
 */
const meta = {
  title: 'Components/ContextMenu',
  component: ContextMenu,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '우클릭 또는 클릭으로 열리는 컨텍스트 메뉴 컴포넌트입니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    trigger: {
      control: 'select',
      options: ['contextmenu', 'click'],
      description: '트리거 유형',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태',
    },
    align: {
      control: 'select',
      options: ['left', 'right'],
      description: '메뉴 정렬 (click 트리거)',
    },
  },
} satisfies Meta<typeof ContextMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ----------------------------------------
   Basic Examples
   ---------------------------------------- */

const basicItems = [
  { id: 'edit', label: 'Edit', onClick: () => console.log('Edit clicked') },
  { id: 'copy', label: 'Copy', onClick: () => console.log('Copy clicked') },
  { id: 'paste', label: 'Paste', onClick: () => console.log('Paste clicked') },
  {
    id: 'delete',
    label: 'Delete',
    status: 'danger' as const,
    onClick: () => console.log('Delete clicked'),
  },
];

export const Default: Story = {
  args: {
    items: basicItems,
    trigger: 'contextmenu',
    children: (
      <div className="w-64 h-32 bg-gray-100 rounded-lg flex items-center justify-center text-sm text-gray-600 border-2 border-dashed border-gray-300">
        Right-click here
      </div>
    ),
  },
};

export const ClickTrigger: Story = {
  name: 'Click Trigger',
  args: {
    items: basicItems,
    trigger: 'click',
    children: <Button variant="secondary">Click for menu</Button>,
  },
};

/* ----------------------------------------
   With Icons
   ---------------------------------------- */

const itemsWithIcons = [
  { id: 'edit', label: 'Edit', icon: <IconEdit size={14} />, onClick: () => {} },
  { id: 'copy', label: 'Copy', icon: <IconCopy size={14} />, onClick: () => {} },
  { id: 'download', label: 'Download', icon: <IconDownload size={14} />, onClick: () => {} },
  { id: 'share', label: 'Share', icon: <IconShare size={14} />, divider: true, onClick: () => {} },
  {
    id: 'delete',
    label: 'Delete',
    icon: <IconTrash size={14} />,
    status: 'danger' as const,
    onClick: () => {},
  },
];

export const WithIcons: Story = {
  name: 'With Icons',
  args: {
    items: itemsWithIcons,
    trigger: 'click',
    children: <Button variant="secondary">Menu with icons</Button>,
  },
};

/* ----------------------------------------
   With Dividers
   ---------------------------------------- */

const itemsWithDividers = [
  { id: 'cut', label: 'Cut', onClick: () => {} },
  { id: 'copy', label: 'Copy', onClick: () => {} },
  { id: 'paste', label: 'Paste', divider: true, onClick: () => {} },
  { id: 'select-all', label: 'Select All', divider: true, onClick: () => {} },
  { id: 'settings', label: 'Settings', icon: <IconSettings size={14} />, onClick: () => {} },
];

export const WithDividers: Story = {
  name: 'With Dividers',
  args: {
    items: itemsWithDividers,
    trigger: 'click',
    children: <Button variant="secondary">Menu with dividers</Button>,
  },
};

/* ----------------------------------------
   With Submenu
   ---------------------------------------- */

const itemsWithSubmenu = [
  {
    id: 'new',
    label: 'New',
    submenu: [
      {
        id: 'new-file',
        label: 'File',
        icon: <IconFile size={14} />,
        onClick: () => console.log('New File'),
      },
      {
        id: 'new-folder',
        label: 'Folder',
        icon: <IconFolder size={14} />,
        onClick: () => console.log('New Folder'),
      },
    ],
  },
  { id: 'open', label: 'Open', onClick: () => {} },
  { id: 'save', label: 'Save', divider: true, onClick: () => {} },
  {
    id: 'export',
    label: 'Export',
    submenu: [
      { id: 'export-pdf', label: 'PDF', onClick: () => console.log('Export PDF') },
      { id: 'export-png', label: 'PNG', onClick: () => console.log('Export PNG') },
      { id: 'export-svg', label: 'SVG', onClick: () => console.log('Export SVG') },
    ],
  },
];

export const WithSubmenu: Story = {
  name: 'With Submenu',
  args: {
    items: itemsWithSubmenu,
    trigger: 'click',
    children: <Button variant="secondary">Menu with submenu</Button>,
  },
};

/* ----------------------------------------
   With Disabled Items
   ---------------------------------------- */

const itemsWithDisabled = [
  { id: 'edit', label: 'Edit', onClick: () => {} },
  { id: 'copy', label: 'Copy', disabled: true, onClick: () => {} },
  { id: 'paste', label: 'Paste', disabled: true, onClick: () => {} },
  { id: 'delete', label: 'Delete', status: 'danger' as const, onClick: () => {} },
];

export const WithDisabledItems: Story = {
  name: 'With Disabled Items',
  args: {
    items: itemsWithDisabled,
    trigger: 'click',
    children: <Button variant="secondary">Menu with disabled items</Button>,
  },
};

/* ----------------------------------------
   With Tooltips
   ---------------------------------------- */

const itemsWithTooltips = [
  {
    id: 'edit',
    label: 'Edit',
    tooltip: 'Edit this item',
    tooltipPosition: 'right' as const,
    onClick: () => {},
  },
  {
    id: 'copy',
    label: 'Copy',
    tooltip: 'Copy to clipboard',
    tooltipPosition: 'right' as const,
    onClick: () => {},
  },
  {
    id: 'delete',
    label: 'Delete',
    tooltip: 'This action cannot be undone',
    tooltipPosition: 'right' as const,
    status: 'danger' as const,
    onClick: () => {},
  },
];

export const WithTooltips: Story = {
  name: 'With Tooltips',
  args: {
    items: itemsWithTooltips,
    trigger: 'click',
    children: <Button variant="secondary">Menu with tooltips</Button>,
  },
};

/* ----------------------------------------
   Alignment
   ---------------------------------------- */

export const RightAligned: Story = {
  name: 'Right Aligned',
  args: {
    items: basicItems,
    trigger: 'click',
    align: 'right',
    children: <Button variant="secondary">Right-aligned menu</Button>,
  },
};

/* ----------------------------------------
   Disabled Menu
   ---------------------------------------- */

export const Disabled: Story = {
  args: {
    items: basicItems,
    trigger: 'click',
    disabled: true,
    children: (
      <Button variant="secondary" disabled>
        Disabled menu
      </Button>
    ),
  },
};

/* ----------------------------------------
   Use Cases
   ---------------------------------------- */

export const TableRowMenu: Story = {
  name: 'Use Case - Table Row',
  render: () => {
    const rowMenuItems = [
      { id: 'view', label: 'View Details', onClick: () => {} },
      { id: 'edit', label: 'Edit', onClick: () => {} },
      { id: 'duplicate', label: 'Duplicate', divider: true, onClick: () => {} },
      { id: 'delete', label: 'Delete', status: 'danger' as const, onClick: () => {} },
    ];

    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden w-96">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {['Item 1', 'Item 2', 'Item 3'].map((item, i) => (
              <tr key={i} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{item}</td>
                <td className="px-4 py-2">Active</td>
                <td className="px-4 py-2">
                  <ContextMenu items={rowMenuItems} trigger="click">
                    <button className="p-1 hover:bg-gray-100 rounded">⋮</button>
                  </ContextMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  },
};

export const FileExplorerMenu: Story = {
  name: 'Use Case - File Explorer',
  render: () => {
    const fileMenuItems = [
      { id: 'open', label: 'Open', onClick: () => {} },
      {
        id: 'open-with',
        label: 'Open With...',
        submenu: [
          { id: 'vscode', label: 'VS Code', onClick: () => {} },
          { id: 'sublime', label: 'Sublime Text', onClick: () => {} },
          { id: 'notepad', label: 'Notepad', onClick: () => {} },
        ],
      },
      { id: 'rename', label: 'Rename', divider: true, onClick: () => {} },
      { id: 'copy', label: 'Copy', icon: <IconCopy size={14} />, onClick: () => {} },
      { id: 'cut', label: 'Cut', onClick: () => {} },
      { id: 'paste', label: 'Paste', divider: true, onClick: () => {} },
      {
        id: 'delete',
        label: 'Move to Trash',
        icon: <IconTrash size={14} />,
        status: 'danger' as const,
        onClick: () => {},
      },
    ];

    return (
      <ContextMenu items={fileMenuItems} trigger="contextmenu">
        <div className="w-80 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3 p-3 bg-white rounded border hover:bg-gray-50 cursor-default">
            <IconFile size={24} className="text-blue-500" />
            <div>
              <p className="font-medium">document.pdf</p>
              <p className="text-xs text-gray-500">2.4 MB • Modified today</p>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3 text-center">Right-click on the file</p>
        </div>
      </ContextMenu>
    );
  },
};
