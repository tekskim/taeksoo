import { VStack } from '@/design-system';
import { IconCopy, IconCheck, IconArrowLeft } from '@tabler/icons-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

/* ----------------------------------------
   Linear Dark Mode Color Palette
   Extracted from UI Screenshot
   ---------------------------------------- */

interface ColorSwatch {
  name: string;
  hex: string;
  rgb: string;
  usage: string;
}

interface ColorGroup {
  title: string;
  description: string;
  colors: ColorSwatch[];
}

const colorPalette: ColorGroup[] = [
  {
    title: 'Backgrounds',
    description: '배경 및 서피스 컬러 (Linear Dark Mode)',
    colors: [
      { name: 'bg-base', hex: '#101010', rgb: 'rgb(16, 16, 16)', usage: '앱 전체 배경' },
      { name: 'bg-surface', hex: '#171717', rgb: 'rgb(23, 23, 23)', usage: '사이드바/패널 배경' },
      { name: 'bg-elevated', hex: '#1c1c1c', rgb: 'rgb(28, 28, 28)', usage: '카드/드롭다운 배경' },
      { name: 'bg-hover', hex: '#262626', rgb: 'rgb(38, 38, 38)', usage: '호버 상태' },
      { name: 'bg-active', hex: '#2d2d2d', rgb: 'rgb(45, 45, 45)', usage: '선택/활성 상태' },
      { name: 'bg-input', hex: '#1a1a1a', rgb: 'rgb(26, 26, 26)', usage: '입력 필드 배경' },
    ],
  },
  {
    title: 'Text',
    description: '텍스트 및 타이포그래피 컬러',
    colors: [
      {
        name: 'text-primary',
        hex: '#f5f5f5',
        rgb: 'rgb(245, 245, 245)',
        usage: '주요 텍스트 (이슈 제목)',
      },
      {
        name: 'text-secondary',
        hex: '#a1a1a1',
        rgb: 'rgb(161, 161, 161)',
        usage: '보조 텍스트 (날짜, ID)',
      },
      { name: 'text-tertiary', hex: '#6b6b6b', rgb: 'rgb(107, 107, 107)', usage: '힌트 텍스트' },
      { name: 'text-muted', hex: '#4a4a4a', rgb: 'rgb(74, 74, 74)', usage: '비활성 텍스트' },
      { name: 'text-link', hex: '#b3b3ff', rgb: 'rgb(179, 179, 255)', usage: '링크 텍스트' },
    ],
  },
  {
    title: 'Borders & Dividers',
    description: '테두리 및 구분선 컬러',
    colors: [
      { name: 'border-subtle', hex: '#222222', rgb: 'rgb(34, 34, 34)', usage: '미묘한 구분선' },
      { name: 'border-default', hex: '#2a2a2a', rgb: 'rgb(42, 42, 42)', usage: '기본 테두리' },
      { name: 'border-strong', hex: '#363636', rgb: 'rgb(54, 54, 54)', usage: '강조 테두리' },
      { name: 'border-focus', hex: '#5c5cff', rgb: 'rgb(92, 92, 255)', usage: '포커스 링 (보라)' },
    ],
  },
  {
    title: 'Brand & Accent',
    description: 'Linear 브랜드 및 강조 컬러',
    colors: [
      {
        name: 'linear-purple',
        hex: '#5e6ad2',
        rgb: 'rgb(94, 106, 210)',
        usage: 'Linear 브랜드 컬러',
      },
      {
        name: 'linear-purple-light',
        hex: '#7c85de',
        rgb: 'rgb(124, 133, 222)',
        usage: '브랜드 라이트',
      },
      { name: 'linear-purple-dark', hex: '#4850b8', rgb: 'rgb(72, 80, 184)', usage: '브랜드 다크' },
      { name: 'accent-violet', hex: '#8b5cf6', rgb: 'rgb(139, 92, 246)', usage: '특별 강조' },
      { name: 'team-green', hex: '#26b562', rgb: 'rgb(38, 181, 98)', usage: '팀 아이콘 (Pbpbp)' },
    ],
  },
  {
    title: 'Issue Status',
    description: '이슈 상태별 컬러',
    colors: [
      {
        name: 'status-todo',
        hex: '#6b6b6b',
        rgb: 'rgb(107, 107, 107)',
        usage: 'Todo 상태 (회색 원)',
      },
      {
        name: 'status-in-progress',
        hex: '#f2c94c',
        rgb: 'rgb(242, 201, 76)',
        usage: 'In Progress (노랑)',
      },
      { name: 'status-done', hex: '#5e6ad2', rgb: 'rgb(94, 106, 210)', usage: 'Done (보라)' },
      {
        name: 'status-cancelled',
        hex: '#6b6b6b',
        rgb: 'rgb(107, 107, 107)',
        usage: 'Cancelled (회색)',
      },
      {
        name: 'status-duplicate',
        hex: '#6b6b6b',
        rgb: 'rgb(107, 107, 107)',
        usage: 'Duplicate (회색)',
      },
    ],
  },
  {
    title: 'Priority Colors',
    description: '우선순위별 컬러',
    colors: [
      { name: 'priority-urgent', hex: '#fc7840', rgb: 'rgb(252, 120, 64)', usage: 'Urgent (주황)' },
      { name: 'priority-high', hex: '#f2c94c', rgb: 'rgb(242, 201, 76)', usage: 'High (노랑)' },
      { name: 'priority-medium', hex: '#5e6ad2', rgb: 'rgb(94, 106, 210)', usage: 'Medium (보라)' },
      { name: 'priority-low', hex: '#4ea7fc', rgb: 'rgb(78, 167, 252)', usage: 'Low (파랑)' },
      {
        name: 'priority-none',
        hex: '#6b6b6b',
        rgb: 'rgb(107, 107, 107)',
        usage: 'No Priority (회색)',
      },
    ],
  },
  {
    title: 'Feedback Colors',
    description: '피드백 및 알림 컬러',
    colors: [
      { name: 'success', hex: '#26b562', rgb: 'rgb(38, 181, 98)', usage: '성공/완료' },
      { name: 'warning', hex: '#f2c94c', rgb: 'rgb(242, 201, 76)', usage: '경고' },
      { name: 'error', hex: '#eb5757', rgb: 'rgb(235, 87, 87)', usage: '에러/삭제' },
      { name: 'info', hex: '#4ea7fc', rgb: 'rgb(78, 167, 252)', usage: '정보' },
    ],
  },
  {
    title: 'Labels',
    description: '레이블 컬러 팔레트',
    colors: [
      { name: 'label-red', hex: '#eb5757', rgb: 'rgb(235, 87, 87)', usage: 'Bug, Critical' },
      { name: 'label-orange', hex: '#fc7840', rgb: 'rgb(252, 120, 64)', usage: 'Improvement' },
      { name: 'label-yellow', hex: '#f2c94c', rgb: 'rgb(242, 201, 76)', usage: 'Feature' },
      { name: 'label-green', hex: '#26b562', rgb: 'rgb(38, 181, 98)', usage: 'Enhancement' },
      { name: 'label-blue', hex: '#4ea7fc', rgb: 'rgb(78, 167, 252)', usage: 'Documentation' },
      { name: 'label-purple', hex: '#5e6ad2', rgb: 'rgb(94, 106, 210)', usage: 'Design' },
      { name: 'label-pink', hex: '#f075e2', rgb: 'rgb(240, 117, 226)', usage: 'Question' },
    ],
  },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1 rounded hover:bg-white/10 transition-colors"
      title="Copy to clipboard"
    >
      {copied ? (
        <IconCheck size={14} className="text-green-400" />
      ) : (
        <IconCopy size={14} className="text-white/40 hover:text-white/70" />
      )}
    </button>
  );
}

function ColorCard({ color }: { color: ColorSwatch }) {
  const isLightColor = color.hex === '#ffffff';

  return (
    <div className="group relative">
      {/* Color Swatch */}
      <div
        className="h-20 rounded-t-lg border border-white/10 transition-transform group-hover:scale-[1.02]"
        style={{ backgroundColor: color.hex }}
      >
        {isLightColor && (
          <div className="absolute inset-0 rounded-t-lg border border-neutral-700" />
        )}
      </div>

      {/* Color Info */}
      <div className="bg-neutral-900 rounded-b-lg p-3 border border-t-0 border-white/10">
        <div className="flex items-center justify-between mb-1">
          <span className="text-white text-sm font-medium">{color.name}</span>
          <CopyButton text={color.hex} />
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-400">HEX</span>
            <code className="text-neutral-300 font-mono">{color.hex}</code>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-400">RGB</span>
            <code className="text-neutral-300 font-mono text-[10px]">{color.rgb}</code>
          </div>
          <div className="text-[10px] text-neutral-500 mt-2">{color.usage}</div>
        </div>
      </div>
    </div>
  );
}

function ColorGroup({ group }: { group: ColorGroup }) {
  return (
    <div className="mb-10">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-white">{group.title}</h2>
        <p className="text-sm text-neutral-400">{group.description}</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {group.colors.map((color) => (
          <ColorCard key={color.hex + color.name} color={color} />
        ))}
      </div>
    </div>
  );
}

// Preview Components - Linear Dark Mode UI Recreation
function PreviewSidebar() {
  return (
    <div className="w-52 bg-[#171717] border-r border-[#222222] py-2 rounded-l-lg flex flex-col">
      {/* Workspace Header */}
      <div className="flex items-center gap-2 px-3 py-2 mb-1">
        <div className="w-5 h-5 rounded bg-gradient-to-br from-[#f87171] to-[#dc2626] flex items-center justify-center text-white text-[10px] font-bold">
          P
        </div>
        <span className="text-[#f5f5f5] text-sm font-medium">pbpbp</span>
        <svg className="w-3 h-3 text-[#6b6b6b] ml-auto" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          />
        </svg>
      </div>

      {/* Navigation */}
      <div className="space-y-0.5 px-2">
        <div className="flex items-center gap-2 px-2 py-1.5 rounded text-[#a1a1a1] text-[13px] hover:bg-[#262626] cursor-pointer">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          Inbox
        </div>
        <div className="flex items-center gap-2 px-2 py-1.5 rounded text-[#a1a1a1] text-[13px] hover:bg-[#262626] cursor-pointer">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          My issues
        </div>
      </div>

      {/* Workspace Section */}
      <div className="mt-4 px-2">
        <div className="text-[11px] text-[#4a4a4a] uppercase tracking-wider mb-1 px-2 font-medium">
          Workspace
        </div>
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 px-2 py-1.5 rounded text-[#a1a1a1] text-[13px] hover:bg-[#262626] cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
              />
            </svg>
            Projects
          </div>
          <div className="flex items-center gap-2 px-2 py-1.5 rounded text-[#a1a1a1] text-[13px] hover:bg-[#262626] cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 6h16M4 10h16M4 14h16M4 18h16"
              />
            </svg>
            Views
          </div>
        </div>
      </div>

      {/* Teams Section */}
      <div className="mt-4 px-2">
        <div className="text-[11px] text-[#4a4a4a] uppercase tracking-wider mb-1 px-2 font-medium">
          Your teams
        </div>
        <div className="flex items-center gap-2 px-2 py-1.5 rounded bg-[#262626]">
          <div className="w-4 h-4 rounded bg-[#26b562]" />
          <span className="text-[#f5f5f5] text-[13px]">Pbpbp</span>
        </div>
      </div>

      {/* Try Section */}
      <div className="mt-auto px-2 pt-4">
        <div className="text-[11px] text-[#4a4a4a] uppercase tracking-wider mb-1 px-2 font-medium">
          Try
        </div>
        <div className="space-y-1 text-[12px]">
          <div className="px-2 py-1 text-[#a1a1a1] hover:text-[#f5f5f5] cursor-pointer">
            Import issues
          </div>
          <div className="px-2 py-1 text-[#a1a1a1] hover:text-[#f5f5f5] cursor-pointer">
            Invite to pbpbp…
          </div>
          <div className="px-2 py-1 text-[#a1a1a1] hover:text-[#f5f5f5] cursor-pointer">
            Link GitHub
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewContent() {
  const issues = [
    { id: 'PBP-4', title: 'Import your data', date: 'Dec 17' },
    { id: 'PBP-2', title: 'Set up your teams', date: 'Dec 17' },
    { id: 'PBP-1', title: 'Get familiar with Linear', date: 'Dec 17' },
    { id: 'PBP-3', title: 'Connect your tools', date: 'Dec 17' },
  ];

  return (
    <div className="flex-1 bg-[#101010] rounded-r-lg flex flex-col">
      {/* Header Tabs */}
      <div className="flex items-center gap-1 px-4 pt-3 border-b border-[#222222]">
        <div className="px-3 py-2 text-[#a1a1a1] text-[13px] hover:text-[#f5f5f5] cursor-pointer">
          All issues
        </div>
        <div className="px-3 py-2 text-[#f5f5f5] text-[13px] font-medium border-b-2 border-[#5e6ad2]">
          Active
        </div>
        <div className="px-3 py-2 text-[#a1a1a1] text-[13px] hover:text-[#f5f5f5] cursor-pointer">
          Backlog
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-[#222222]">
        <button className="flex items-center gap-1 px-2 py-1 text-[12px] text-[#a1a1a1] hover:bg-[#262626] rounded">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          Filter
        </button>
        <button className="flex items-center gap-1 px-2 py-1 text-[12px] text-[#a1a1a1] hover:bg-[#262626] rounded ml-auto">
          Display
        </button>
      </div>

      {/* Issue Group */}
      <div className="flex-1 p-2">
        {/* Group Header */}
        <div className="flex items-center gap-2 px-2 py-1.5">
          <svg className="w-3 h-3 text-[#6b6b6b]" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            />
          </svg>
          <div className="w-3.5 h-3.5 rounded-full border-2 border-[#6b6b6b]" />
          <span className="text-[#a1a1a1] text-[13px]">Todo</span>
          <span className="text-[#4a4a4a] text-[12px]">4</span>
        </div>

        {/* Issues */}
        <div className="space-y-0.5 mt-1">
          {issues.map((issue) => (
            <div
              key={issue.id}
              className="flex items-center gap-3 px-2 py-1.5 rounded hover:bg-[#1c1c1c] cursor-pointer group"
            >
              {/* Priority (No Priority) */}
              <svg className="w-4 h-4 text-[#4a4a4a]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
              </svg>
              {/* Issue ID */}
              <span className="text-[#6b6b6b] text-[12px] font-mono w-12">{issue.id}</span>
              {/* Status */}
              <div className="w-3.5 h-3.5 rounded-full border-2 border-[#6b6b6b]" />
              {/* Title */}
              <span className="text-[#f5f5f5] text-[13px] flex-1">{issue.title}</span>
              {/* Date */}
              <span className="text-[#4a4a4a] text-[12px]">{issue.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ColorPalettePage() {
  return (
    <VStack className="min-h-screen w-full bg-neutral-950">
      {/* Simple Header */}
      <div className="sticky top-0 z-10 bg-neutral-900/80 backdrop-blur-sm border-b border-neutral-800 px-6 py-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
        >
          <IconArrowLeft size={16} />
          <span className="text-sm">Back to Entry page</span>
        </Link>
      </div>

      <VStack className="flex-1 overflow-auto p-6 gap-6">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-white mb-2">Linear Dark Mode Color Palette</h1>
          <p className="text-neutral-400">Linear 앱 다크모드 UI에서 추출한 컬러 팔레트입니다.</p>
        </div>

        {/* Live Preview */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Live Preview</h2>
          <div className="flex rounded-lg overflow-hidden border border-neutral-800 max-w-3xl">
            <PreviewSidebar />
            <PreviewContent />
          </div>
        </div>

        {/* Color Palette Groups */}
        {colorPalette.map((group) => (
          <ColorGroup key={group.title} group={group} />
        ))}

        {/* CSS Variables */}
        <div className="mt-8 p-6 bg-[#171717] rounded-lg border border-[#222222]">
          <h2 className="text-xl font-semibold text-white mb-4">
            CSS Variables (Linear Dark Mode)
          </h2>
          <pre className="text-sm text-neutral-300 font-mono overflow-x-auto">
            {`:root {
  /* =========================
     LINEAR DARK MODE PALETTE
     ========================= */

  /* Backgrounds */
  --linear-bg-base: #101010;
  --linear-bg-surface: #171717;
  --linear-bg-elevated: #1c1c1c;
  --linear-bg-hover: #262626;
  --linear-bg-active: #2d2d2d;
  --linear-bg-input: #1a1a1a;

  /* Text */
  --linear-text-primary: #f5f5f5;
  --linear-text-secondary: #a1a1a1;
  --linear-text-tertiary: #6b6b6b;
  --linear-text-muted: #4a4a4a;
  --linear-text-link: #b3b3ff;

  /* Borders */
  --linear-border-subtle: #222222;
  --linear-border-default: #2a2a2a;
  --linear-border-strong: #363636;
  --linear-border-focus: #5e6ad2;

  /* Brand */
  --linear-purple: #5e6ad2;
  --linear-purple-light: #7c85de;
  --linear-purple-dark: #4850b8;

  /* Issue Status */
  --linear-status-todo: #6b6b6b;
  --linear-status-in-progress: #f2c94c;
  --linear-status-done: #5e6ad2;

  /* Priority */
  --linear-priority-urgent: #fc7840;
  --linear-priority-high: #f2c94c;
  --linear-priority-medium: #5e6ad2;
  --linear-priority-low: #4ea7fc;
  --linear-priority-none: #6b6b6b;

  /* Feedback */
  --linear-success: #26b562;
  --linear-warning: #f2c94c;
  --linear-error: #eb5757;
  --linear-info: #4ea7fc;

  /* Labels */
  --linear-label-red: #eb5757;
  --linear-label-orange: #fc7840;
  --linear-label-yellow: #f2c94c;
  --linear-label-green: #26b562;
  --linear-label-blue: #4ea7fc;
  --linear-label-purple: #5e6ad2;
  --linear-label-pink: #f075e2;
}`}
          </pre>
        </div>

        {/* Tailwind Config */}
        <div className="mt-4 p-6 bg-[#171717] rounded-lg border border-[#222222]">
          <h2 className="text-xl font-semibold text-white mb-4">Tailwind Config</h2>
          <pre className="text-sm text-neutral-300 font-mono overflow-x-auto">
            {`// tailwind.config.js - Linear Dark Mode Theme
module.exports = {
  theme: {
    extend: {
      colors: {
        linear: {
          // Backgrounds
          bg: {
            base: '#101010',
            surface: '#171717',
            elevated: '#1c1c1c',
            hover: '#262626',
            active: '#2d2d2d',
            input: '#1a1a1a',
          },
          // Text
          text: {
            primary: '#f5f5f5',
            secondary: '#a1a1a1',
            tertiary: '#6b6b6b',
            muted: '#4a4a4a',
            link: '#b3b3ff',
          },
          // Borders
          border: {
            subtle: '#222222',
            DEFAULT: '#2a2a2a',
            strong: '#363636',
            focus: '#5e6ad2',
          },
          // Brand
          purple: {
            DEFAULT: '#5e6ad2',
            light: '#7c85de',
            dark: '#4850b8',
          },
          // Status
          status: {
            todo: '#6b6b6b',
            'in-progress': '#f2c94c',
            done: '#5e6ad2',
          },
          // Priority
          priority: {
            urgent: '#fc7840',
            high: '#f2c94c',
            medium: '#5e6ad2',
            low: '#4ea7fc',
            none: '#6b6b6b',
          },
          // Feedback
          success: '#26b562',
          warning: '#f2c94c',
          error: '#eb5757',
          info: '#4ea7fc',
          // Labels
          label: {
            red: '#eb5757',
            orange: '#fc7840',
            yellow: '#f2c94c',
            green: '#26b562',
            blue: '#4ea7fc',
            purple: '#5e6ad2',
            pink: '#f075e2',
          },
        },
      },
    },
  },
}`}
          </pre>
        </div>
      </VStack>
    </VStack>
  );
}
