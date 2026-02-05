import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, SectionCard } from '@/design-system';
import { IconDownload, IconArrowLeft, IconCopy, IconCheck } from '@tabler/icons-react';

/* ----------------------------------------
   Code Block Component ---------------------------------------- */

interface CodeBlockProps {
  code: string;
  language?: string;
}

function CodeBlock({ code, language = 'typescript' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-lg overflow-hidden">
      <div className="absolute top-2 right-2 z-10">
        <button
          onClick={handleCopy}
          className="p-1.5 rounded-md bg-[var(--color-surface-subtle)] hover:bg-[var(--color-surface-muted)] transition-colors"
        >
          {copied ? (
            <IconCheck size={14} className="text-[var(--color-state-success)]" />
          ) : (
            <IconCopy size={14} className="text-[var(--color-text-subtle)]" />
          )}
        </button>
      </div>
      <pre className="bg-[var(--color-surface-subtle)] p-4 rounded-lg overflow-x-auto text-body-md leading-relaxed">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  );
}

/* ----------------------------------------
   Table Component for Guide ---------------------------------------- */

interface GuideTableProps {
  headers: string[];
  rows: string[][];
}

function GuideTable({ headers, rows }: GuideTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-body-md">
        <thead>
          <tr className="border-b border-[var(--color-border-default)]">
            {headers.map((header, i) => (
              <th
                key={i}
                className="text-left py-2 px-3 font-medium text-[var(--color-text-default)] bg-[var(--color-surface-subtle)]"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-[var(--color-border-subtle)]">
              {row.map((cell, j) => (
                <td key={j} className="py-2 px-3 text-[var(--color-text-default)]">
                  {cell.startsWith('`') && cell.endsWith('`') ? (
                    <code className="px-1.5 py-0.5 rounded bg-[var(--color-surface-subtle)] text-body-sm font-mono">
                      {cell.slice(1, -1)}
                    </code>
                  ) : (
                    cell
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ----------------------------------------
   TableStyleGuidePage ---------------------------------------- */

export function TableStyleGuidePage() {
  const navigate = useNavigate();

  const handleDownloadFile = async (filename: string, mimeType: string) => {
    try {
      const response = await fetch(`/${filename}`);
      const content = await response.text();

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download file:', error);
    }
  };

  const tocItems = [
    { id: 'overview', label: '1. 개요' },
    { id: 'column-width', label: '2. 컬럼 너비 정책' },
    { id: 'row-height', label: '3. 행 높이 정책' },
    { id: 'column-alignment', label: '4. 컬럼 정렬 정책' },
    { id: 'text-handling', label: '5. 텍스트 처리 정책' },
    { id: 'comparison', label: '6. thaki-ui 비교' },
    { id: 'migration', label: '7. 마이그레이션 가이드' },
    { id: 'faq', label: '8. FAQ' },
    { id: 'appendix', label: '부록' },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="fixed inset-0 overflow-auto bg-[var(--color-surface-subtle)]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[var(--color-surface-default)] border-b border-[var(--color-border-default)]">
        <div className="max-w-6xl mx-auto px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<IconArrowLeft size={14} />}
              onClick={() => navigate('/')}
            >
              Back{' '}
            </Button>
            <h1 className="text-heading-h5 text-[var(--color-text-default)]">Table Style Guide </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<IconDownload size={14} />}
              onClick={() => handleDownloadFile('TABLE_STYLE_GUIDE.md', 'text/markdown')}
            >
              Guide (.md)
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<IconDownload size={14} />}
              onClick={() => handleDownloadFile('columnWidths.ts', 'text/typescript')}
            >
              Presets (.ts)
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-8 py-8 flex gap-8">
        {/* Sidebar TOC */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <div className="sticky top-24">
            <nav className="space-y-1">
              <p className="text-label-sm text-[var(--color-text-subtle)] uppercase tracking-wide mb-3">
                목차{' '}
              </p>
              {tocItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left text-body-md py-1.5 px-2 rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-text-default)] hover:bg-[var(--color-surface-default)] transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0 space-y-8">
          {/* Version Info */}
          <div className="flex items-center gap-4 text-body-md text-[var(--color-text-subtle)]">
            <span>버전: 1.0</span>
            <span>•</span>
            <span>최종 업데이트: 2026-01-27</span>
          </div>

          {/* Section 1: Overview */}
          <SectionCard id="overview">
            <SectionCard.Header title="1. 개요" />
            <SectionCard.Content className="space-y-4">
              <p className="text-[13px] text-[var(--color-text-default)]">
                이 문서는 TDS(THAKI Design System)의 테이블 컴포넌트 스타일링에 대한 통합
                가이드입니다.
              </p>

              <div>
                <h4 className="text-[13px] font-medium mb-2">적용 대상</h4>
                <ul className="list-disc list-inside text-body-md text-[var(--color-text-muted)] space-y-1">
                  <li>모든 리스트 페이지 테이블</li>
                  <li>상세 페이지 내 탭 테이블</li>
                  <li>모달/Drawer 내 테이블</li>
                  <li>Wizard 단계 내 테이블</li>
                </ul>
              </div>

              <div>
                <h4 className="text-[13px] font-medium mb-2">핵심 원칙</h4>
                <GuideTable
                  headers={['영역', '원칙']}
                  rows={[
                    ['너비', '고정 컬럼(아이콘/버튼)과 유연 컬럼(텍스트) 이원화'],
                    ['높이', '기본 48px, 밀집 레이아웃 40px'],
                    ['텍스트', '단일행 + truncate + 툴팁 패턴 (브라우저 기본 title 속성 사용)'],
                  ]}
                />
              </div>
            </SectionCard.Content>
          </SectionCard>

          {/* Section 2: Column Width */}
          <SectionCard id="column-width">
            <SectionCard.Header title="2. 컬럼 너비 정책" />
            <SectionCard.Content className="space-y-6">
              <div>
                <h4 className="text-[13px] font-medium mb-2">2.1 컬럼 이원화</h4>
                <GuideTable
                  headers={['분류', '설명', '사용법']}
                  rows={[
                    [
                      '완전 고정 컬럼',
                      '아이콘/버튼만 표시, 크기 불변',
                      '`width: fixedColumns.xxx`',
                    ],
                    [
                      '유연 컬럼',
                      '텍스트/데이터 표시, 공간에 따라 확장',
                      '`flex: 1, minWidth: columnMinWidths.xxx`',
                    ],
                  ]}
                />
              </div>

              <div>
                <h4 className="text-[13px] font-medium mb-2">2.2 Import</h4>
                <CodeBlock
                  code={`import { fixedColumns, columnMinWidths } from '@/design-system';`}
                />
              </div>

              <div>
                <h4 className="text-[13px] font-medium mb-2">2.3 완전 고정 컬럼 (fixedColumns)</h4>
                <p className="text-body-md text-[var(--color-text-muted)] mb-3">
                  아이콘이나 버튼만 표시되어 크기가 변할 필요 없는 컬럼{' '}
                </p>
                <GuideTable
                  headers={['키', '너비', '용도', '예시']}
                  rows={[
                    ['`status`', '64px', '상태 아이콘', 'StatusIndicator'],
                    ['`select`', '40px', '선택 체크박스', 'Checkbox'],
                    ['`checkbox`', '40px', '체크박스', 'Checkbox'],
                    ['`radio`', '40px', '라디오 버튼', 'Radio'],
                    ['`favorite`', '40px', '즐겨찾기 아이콘', 'IconStar'],
                    ['`locked`', '64px', '잠금 아이콘', 'IconLock'],
                    ['`actions`', '64px', '액션 메뉴', 'ContextMenu'],
                    ['`action`', '64px', '액션 메뉴 (단수)', 'ContextMenu'],
                    ['`actionWide`', '72px', '액션 메뉴 (넓은 버전)', '-'],
                    ['`identify`', '80px', '식별 버튼', 'Identify 버튼'],
                  ]}
                />
              </div>

              <div>
                <h4 className="text-[13px] font-medium mb-2">2.4 유연 컬럼 (columnMinWidths)</h4>
                <p className="text-body-md text-[var(--color-text-muted)] mb-3">
                  텍스트나 데이터를 표시하며 공간에 따라 늘어나야 하는 컬럼{' '}
                </p>
                <GuideTable
                  headers={['카테고리', '키', 'minWidth', '용도']}
                  rows={[
                    ['이름/식별자', '`name`', '180px', '리소스 이름'],
                    ['', '`nameLg`', '240px', '긴 리소스 이름'],
                    ['', '`hostname`', '150px', '호스트명'],
                    ['', '`username`', '150px', '사용자명'],
                    ['날짜/시간', '`createdAt`', '140px', '생성일'],
                    ['', '`updatedAt`', '140px', '수정일'],
                    ['', '`expiresAt`', '120px', '만료일'],
                    ['', '`lastSignIn`', '120px', '마지막 로그인'],
                    ['IP/주소', '`ipAddress`', '130px', 'IP 주소'],
                    ['', '`fixedIp`', '130px', '고정 IP'],
                    ['', '`floatingIp`', '130px', '유동 IP'],
                    ['', '`macAddress`', '150px', 'MAC 주소'],
                    ['', '`cidr`', '130px', 'CIDR 블록'],
                    ['타입/분류', '`type`', '100px', '유형'],
                    ['', '`category`', '140px', '카테고리'],
                    ['', '`protocol`', '90px', '프로토콜'],
                    ['리소스', '`vcpu`', '80px', 'vCPU'],
                    ['', '`ram`', '80px', 'RAM'],
                    ['', '`disk`', '80px', '디스크'],
                    ['기타', '`description`', '200px', '설명'],
                    ['', '`role`', '100px', '역할'],
                    ['', '`mfa`', '80px', 'MFA 상태'],
                    ['', '`fingerprint`', '360px', 'SSH 키 fingerprint'],
                  ]}
                />
              </div>

              <div>
                <h4 className="text-[13px] font-medium mb-2">2.5 장점</h4>
                <ul className="list-decimal list-inside text-body-md text-[var(--color-text-muted)] space-y-1">
                  <li>
                    <strong>여백 문제 해결</strong>: 어떤 컬럼을 숨겨도 남은 flex 컬럼들이 공간을
                    채움{' '}
                  </li>
                  <li>
                    <strong>최소 가독성 보장</strong>: minWidth로 컬럼이 너무 좁아지는 것 방지{' '}
                  </li>
                  <li>
                    <strong>일관성</strong>: 고정 컬럼(status, actions)은 항상 동일한 크기 유지{' '}
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-[13px] font-medium mb-2">2.6 가로 스크롤 정책</h4>
                <p className="text-body-md text-[var(--color-text-muted)] mb-3">
                  테이블에 가로 스크롤이 발생하는 조건:
                </p>
                <div className="p-3 rounded-lg bg-[var(--color-surface-subtle)] mb-4">
                  <code className="text-body-sm font-mono">
                    (고정 컬럼들의 width 합) + (유연 컬럼들의 minWidth 합) &gt; 컨테이너 너비{' '}
                  </code>
                </div>

                <p className="text-body-md text-[var(--color-text-muted)] mb-2">
                  <strong>예시:</strong> status(64) + name(180) + ip(130) + createdAt(140) +
                  actions(64) = 578px <br />→ 컨테이너가 578px보다 좁으면 가로 스크롤 발생{' '}
                </p>

                <div className="mt-4">
                  <h5 className="text-label-md mb-2">의도된 동작</h5>
                  <GuideTable
                    headers={['상황', '가로 스크롤 없음', '가로 스크롤 있음']}
                    rows={[
                      ['결과', '컬럼이 과도하게 좁아짐', 'minWidth 보장'],
                      ['가독성', '❌ truncate 과다', '✅ 최소 가독성 유지'],
                      ['UX', '텍스트 읽기 어려움', '스크롤로 전체 확인 가능'],
                    ]}
                  />
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <p className="text-label-sm text-red-700 dark:text-red-400 mb-1">
                      minWidth가 없으면{' '}
                    </p>
                    <code className="text-body-xs font-mono text-red-600 dark:text-red-300">
                      | status | ins... | 192... | 20... | ⋮ |
                    </code>
                    <p className="text-body-xs text-red-500 mt-1">← 내용 알아볼 수 없음</p>
                  </div>
                  <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                    <p className="text-label-sm text-green-700 dark:text-green-400 mb-1">
                      minWidth가 있으면{' '}
                    </p>
                    <code className="text-body-xs font-mono text-green-600 dark:text-green-300">
                      | status | instance-na... | 192.168.1.10 | ⋮ |
                    </code>
                    <p className="text-body-xs text-green-500 mt-1">← 가로 스크롤로 확인 가능</p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-body-md text-[var(--color-text-muted)]">
                    <strong>테이블 컨테이너:</strong> Table 컴포넌트는 자동으로{' '}
                    <code className="px-1 py-0.5 rounded bg-[var(--color-surface-subtle)] text-body-sm">
                      overflow-x-auto{' '}
                    </code>
                    가 적용되어 가로 스크롤을 지원합니다.
                  </p>
                </div>
              </div>
            </SectionCard.Content>
          </SectionCard>

          {/* Section 3: Row Height */}
          <SectionCard id="row-height">
            <SectionCard.Header title="3. 행 높이 정책" />
            <SectionCard.Content className="space-y-6">
              <div>
                <h4 className="text-[13px] font-medium mb-2">3.1 기본 규칙</h4>
                <GuideTable
                  headers={['용도', '높이', 'rowHeight prop']}
                  rows={[
                    ['기본 테이블', '48px', '생략 (기본값)'],
                    ['밀집 테이블', '40px', '`rowHeight="40px"`'],
                  ]}
                />
              </div>

              <div>
                <h4 className="text-[13px] font-medium mb-2">3.2 사용 기준</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-[var(--color-surface-subtle)]">
                    <h5 className="text-label-md mb-2">기본 높이 (48px) 사용</h5>
                    <ul className="text-body-sm text-[var(--color-text-muted)] space-y-1">
                      <li>• 메인 리스트 페이지</li>
                      <li>• 데이터가 많지 않은 테이블</li>
                      <li>• 가독성이 중요한 테이블</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg bg-[var(--color-surface-subtle)]">
                    <h5 className="text-label-md mb-2">밀집 높이 (40px) 사용</h5>
                    <ul className="text-body-sm text-[var(--color-text-muted)] space-y-1">
                      <li>• 설정 페이지 내 테이블</li>
                      <li>• 모니터링/대시보드 테이블</li>
                      <li>• 공간이 제한된 영역의 테이블</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-[13px] font-medium mb-2">3.3 예시</h4>
                <CodeBlock
                  code={`// 기본 리스트 페이지 - 48px
<Table columns={instanceColumns} data={instances} rowKey="id" />

// 설정 페이지 테이블 - 40px
<Table columns={settingsColumns} data={settings} rowKey="id" rowHeight="40px" />

// 모니터링 대시보드 테이블 - 40px
<Table columns={metricsColumns} data={metrics} rowKey="id" rowHeight="40px" />`}
                />
              </div>
            </SectionCard.Content>
          </SectionCard>

          {/* Section 4: Column Alignment */}
          <SectionCard id="column-alignment">
            <SectionCard.Header title="4. 컬럼 정렬 정책" />
            <SectionCard.Content className="space-y-6">
              <div>
                <h4 className="text-[13px] font-medium mb-2">4.1 정렬 유형</h4>
                <GuideTable
                  headers={['정렬', '적용 대상', '예시 컬럼']}
                  rows={[
                    [
                      '중앙',
                      '고정 너비 컬럼 (아이콘/버튼)',
                      'status, locked, actions, select, checkbox',
                    ],
                    [
                      '왼쪽',
                      '유연 컬럼 (텍스트/데이터) - 기본값',
                      'name, description, type, count',
                    ],
                    ['오른쪽', '연관 리소스 표시', 'attachedTo, associatedTo'],
                  ]}
                />
              </div>

              <div>
                <h4 className="text-[13px] font-medium mb-2">4.2 적용 규칙</h4>
                <ul className="list-decimal list-inside text-body-md text-[var(--color-text-muted)] space-y-2">
                  <li>
                    <strong>고정 컬럼은 중앙 정렬</strong>: fixedColumns에 정의된 모든 컬럼은 align:
                    'center' 적용{' '}
                  </li>
                  <li>
                    <strong>유연 컬럼은 왼쪽 정렬</strong>: 텍스트, 숫자 등 데이터 컬럼은 명시적
                    설정 불필요 (기본값)
                  </li>
                  <li>
                    <strong>오른쪽 정렬은 특수 케이스만</strong>: 연관 리소스 참조 컬럼에만
                    사용{' '}
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-[13px] font-medium mb-2">4.3 코드 예시</h4>
                <CodeBlock
                  code={`// 고정 컬럼 - 중앙 정렬
{ key: 'status', label: 'Status', width: fixedColumns.status, align: 'center' }
{ key: 'locked', label: 'Locked', width: fixedColumns.locked, align: 'center' }
{ key: 'actions', label: 'Action', width: fixedColumns.actions, align: 'center' }

// 유연 컬럼 - 왼쪽 정렬 (기본값, 명시 불필요)
{ key: 'name', label: 'Name', flex: 1, minWidth: columnMinWidths.name }
{ key: 'count', label: 'Count', flex: 1, minWidth: columnMinWidths.count }

// 연관 리소스 - 오른쪽 정렬
{ key: 'attachedTo', label: 'Attached to', flex: 1, align: 'center' }`}
                />
              </div>
            </SectionCard.Content>
          </SectionCard>

          {/* Section 5: Text Handling */}
          <SectionCard id="text-handling">
            <SectionCard.Header title="5. 텍스트 처리 정책" />
            <SectionCard.Content className="space-y-6">
              <div>
                <h4 className="text-[13px] font-medium mb-2">5.1 핵심 원칙</h4>
                <GuideTable
                  headers={['원칙', '설명']}
                  rows={[
                    ['단일행 유지', '테이블 셀은 항상 한 줄로 표시 (서브텍스트 패턴 제외)'],
                    ['Truncate 적용', 'minWidth 내에서 긴 텍스트는 말줄임표(...)로 잘림'],
                    ['툴팁 제공', '잘린 텍스트는 hover 시 전체 내용 표시'],
                    ['서브텍스트 패턴', '이름 + ID 조합 시 ID를 작은 서브텍스트로 표시 (2줄 허용)'],
                  ]}
                />
              </div>

              <div>
                <h4 className="text-[13px] font-medium mb-2">5.2 커스텀 render 시 처리</h4>
                <CodeBlock
                  code={`// ✅ 올바른 패턴
{
  key: 'name',
  label: 'Name',
  flex: 1,
  minWidth: columnMinWidths.name,
  render: (_, row) => (
    <span className="truncate" title={row.name}>
      {row.name}
    </span>
  ),
}

// ✅ 링크에 truncate 적용
{
  key: 'name',
  label: 'Name',
  flex: 1,
  minWidth: columnMinWidths.name,
  render: (_, row) => (
    <Link to={\`/items/\${row.id}\`}
      className="text-[var(--color-action-primary)] hover:underline truncate block"
      title={row.name}
    >
      {row.name}
    </Link>
  ),
}`}
                />
              </div>

              <div>
                <h4 className="text-[13px] font-medium mb-2">5.3 복합 셀 처리</h4>
                <CodeBlock
                  code={`// 이름 + 서브텍스트 조합 (min-w-0 필수!)
{
  key: 'name',
  label: 'Name',
  flex: 1,
  minWidth: columnMinWidths.name,
  render: (_, row) => (
    <div className="flex flex-col min-w-0">
      <span className="font-medium text-[var(--color-action-primary)] hover:underline truncate"
        title={row.name}
      >
        {row.name}
      </span>
      <span className="text-body-sm text-[var(--color-text-subtle)] truncate"
        title={row.id}
      >
        {row.id}
      </span>
    </div>
  ),
}`}
                />
              </div>

              <div>
                <h4 className="text-[13px] font-medium mb-2">4.4 금지 패턴</h4>
                <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <CodeBlock
                    code={`// ❌ 줄바꿈 허용 (테이블 행 높이가 깨짐)
<span className="whitespace-pre-wrap">{row.description}</span>

// ❌ line-clamp 사용 (여러 줄 표시)
<span className="line-clamp-2">{row.description}</span>

// ❌ min-w-0 없이 flex 컨테이너 사용 (truncate 안 됨)
<div className="flex flex-col">  {/* min-w-0 필요! */}
  <span className="truncate">{row.name}</span>
</div>`}
                  />
                </div>
              </div>
            </SectionCard.Content>
          </SectionCard>

          {/* Section 6: Comparison with thaki-ui */}
          <SectionCard id="comparison">
            <SectionCard.Header title="6. thaki-ui와의 비교" />
            <SectionCard.Content className="space-y-6">
              <div>
                <h4 className="text-[13px] font-medium mb-2">6.1 컬럼 사이징 방식 비교</h4>
                <GuideTable
                  headers={['항목', 'TDS (SSOT)', 'thaki-ui']}
                  rows={[
                    ['사이징 방식', 'flex + minWidth 조합', 'width 고정값만 사용'],
                    ['고정 컬럼', 'width: fixedColumns.xxx', 'width: 60 등 하드코딩'],
                    [
                      '유연 컬럼',
                      'flex: 1, minWidth: columnMinWidths.xxx',
                      'width 없으면 자동 분배',
                    ],
                    ['테이블 레이아웃', 'flexbox 기반', 'table-fixed (CSS table)'],
                    ['minWidth 지원', '✅ 지원', '❌ 미지원'],
                    ['maxWidth 지원', '✅ 지원', '❌ 미지원'],
                  ]}
                />
              </div>

              <div>
                <h4 className="text-[13px] font-medium mb-2">6.2 컬럼 정의 비교</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-label-sm text-[var(--color-text-muted)] mb-2">TDS (SSOT)</p>
                    <CodeBlock
                      code={`const columns = [
  { key: 'status', width: fixedColumns.status, align: 'center' },
  { key: 'name', flex: 1, minWidth: columnMinWidths.name },
  { key: 'createdAt', flex: 1, minWidth: columnMinWidths.createdAt },
  { key: 'actions', width: fixedColumns.actions, align: 'center' },
];`}
                    />
                  </div>
                  <div>
                    <p className="text-label-sm text-[var(--color-text-muted)] mb-2">thaki-ui </p>
                    <CodeBlock
                      code={`const columns = [
  { key: 'status', width: 60, align: 'center' },
  { key: 'username' },  // width 없음 → 자동 분배 { key: 'groups' },
  { key: 'actions', width: 80, align: 'center' },
];`}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-[13px] font-medium mb-2">6.3 thaki-ui 문제점과 TDS 해결책</h4>
                <GuideTable
                  headers={['문제', 'thaki-ui', 'TDS 해결책']}
                  rows={[
                    [
                      'minWidth 미지원',
                      '컬럼이 과도하게 좁아질 수 있음',
                      'minWidth로 최소 너비 보장',
                    ],
                    ['비율 제어 불가', '자동 균등 분배만 가능', 'flex 값으로 비율 조정 가능'],
                    ['값 일관성', '하드코딩된 값 분산', '중앙 프리셋으로 일관성 보장'],
                    ['가로 스크롤 정책', '고정 min-w-[600px]', '컬럼 합계 기반 동적 스크롤'],
                  ]}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <p className="text-label-md text-red-700 dark:text-red-400 mb-2">
                    thaki-ui: 비율 제어 불가{' '}
                  </p>
                  <CodeBlock
                    code={`{ key: 'name' }   // 1/3
{ key: 'email' }  // 1/3
{ key: 'role' }   // 1/3
// 모두 균등 분배만 가능`}
                  />
                </div>
                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                  <p className="text-label-md text-green-700 dark:text-green-400 mb-2">
                    TDS: flex로 비율 제어{' '}
                  </p>
                  <CodeBlock
                    code={`{ key: 'name', flex: 2 }   // 2/4 (더 넓게)
{ key: 'email', flex: 1 }  // 1/4
{ key: 'role', flex: 1 }   // 1/4
// 원하는 비율로 조정 가능`}
                  />
                </div>
              </div>
            </SectionCard.Content>
          </SectionCard>

          {/* Section 7: Migration */}
          <SectionCard id="migration">
            <SectionCard.Header title="7. 마이그레이션 가이드" />
            <SectionCard.Content className="space-y-6">
              <div>
                <h4 className="text-[13px] font-medium mb-2">7.1 Import 변경</h4>
                <CodeBlock
                  code={`// Before
import { columnWidths } from '@/design-system';

// After
import { fixedColumns, columnMinWidths } from '@/design-system';`}
                />
              </div>

              <div>
                <h4 className="text-[13px] font-medium mb-2">7.2 고정 컬럼 변환</h4>
                <CodeBlock
                  code={`// Before
{
  key: 'status',
  label: 'Status',
  width: columnWidths.status,  // ❌ 기존 방식
}

// After
{
  key: 'status',
  label: 'Status',
  width: fixedColumns.status,  // ✅ 새 방식
}`}
                />
              </div>

              <div>
                <h4 className="text-[13px] font-medium mb-2">7.3 유연 컬럼 변환</h4>
                <CodeBlock
                  code={`// Before
{
  key: 'createdAt',
  label: 'Created at',
  width: columnWidths.createdAt,  // ❌ 기존 방식
}

// After
{
  key: 'createdAt',
  label: 'Created at',
  flex: 1,                              // ✅ 유연하게 늘어남 minWidth: columnMinWidths.createdAt,  // ✅ 최소 너비 보장
}`}
                />
              </div>
            </SectionCard.Content>
          </SectionCard>

          {/* Section 8: FAQ */}
          <SectionCard id="faq">
            <SectionCard.Header title="8. FAQ" />
            <SectionCard.Content className="space-y-4">
              {[
                {
                  q: 'minWidth 값이 프리셋에 없는 경우는?',
                  a: "가장 유사한 프리셋을 사용하거나, 직접 값을 지정할 수 있습니다: minWidth: '120px'",
                },
                {
                  q: 'flex 값을 1이 아닌 다른 값으로 설정해도 되나요?',
                  a: '네, 특정 컬럼에 더 많은 공간을 할당하려면 flex: 2 등을 사용할 수 있습니다.',
                },
                {
                  q: '테이블 셀에서 여러 줄을 표시해야 하는 경우는?',
                  a: '테이블 셀은 항상 단일행이어야 합니다. Drawer나 Modal로 상세 정보를 표시하거나, Tooltip을 사용하세요.',
                },
                {
                  q: 'truncate가 적용되지 않는 이유는?',
                  a: 'flex 컨테이너 내부인 경우 부모에 min-w-0 클래스가 필요합니다.',
                },
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-lg bg-[var(--color-surface-subtle)]">
                  <p className="text-[13px] font-medium text-[var(--color-text-default)] mb-1">
                    Q: {item.q}
                  </p>
                  <p className="text-body-md text-[var(--color-text-muted)]">A: {item.a}</p>
                </div>
              ))}
            </SectionCard.Content>
          </SectionCard>

          {/* Appendix */}
          <SectionCard id="appendix">
            <SectionCard.Header title="부록: 프리셋 전체 목록" />
            <SectionCard.Content className="space-y-6">
              <div>
                <h4 className="text-[13px] font-medium mb-2">A. fixedColumns</h4>
                <CodeBlock
                  code={`export const fixedColumns = {
  select: '40px',
  checkbox: '40px',
  radio: '40px',
  favorite: '40px',
  status: '64px',
  locked: '64px',
  actions: '64px',
  action: '64px',
  actionWide: '72px',
  identify: '80px',
} as const;`}
                />
              </div>

              <div>
                <h4 className="text-[13px] font-medium mb-2">B. columnMinWidths (주요 항목)</h4>
                <CodeBlock
                  code={`export const columnMinWidths = {
  // 이름/식별자 name: '180px',
  nameLg: '240px',
  hostname: '150px',
  username: '150px',
  
  // 날짜/시간 createdAt: '140px',
  updatedAt: '140px',
  expiresAt: '120px',
  lastSignIn: '120px',
  
  // IP/주소 ipAddress: '130px',
  fixedIp: '130px',
  floatingIp: '130px',
  macAddress: '150px',
  cidr: '130px',
  
  // 타입/분류 type: '100px',
  category: '140px',
  protocol: '90px',
  
  // 리소스 vcpu: '80px',
  ram: '80px',
  disk: '80px',
  
  // 기타 description: '200px',
  role: '100px',
  mfa: '80px',
  fingerprint: '360px',
  // ... (전체 목록은 columnWidths.ts 참조)
} as const;`}
                />
              </div>

              <div>
                <h4 className="text-[13px] font-medium mb-2">C. 행 높이</h4>
                <GuideTable
                  headers={['타입', '값', '사용']}
                  rows={[
                    ['기본', '48px', 'rowHeight 생략'],
                    ['밀집', '40px', '`rowHeight="40px"`'],
                  ]}
                />
              </div>
            </SectionCard.Content>
          </SectionCard>

          {/* Checklist */}
          <SectionCard>
            <SectionCard.Header title="체크리스트" />
            <SectionCard.Content>
              <p className="text-body-md text-[var(--color-text-muted)] mb-3">
                새 테이블 구현 시 확인 사항:
              </p>
              <ul className="space-y-2">
                {[
                  'fixedColumns, columnMinWidths import 확인',
                  '아이콘/버튼 컬럼에 width: fixedColumns.xxx 적용',
                  '텍스트 컬럼에 flex: 1, minWidth: columnMinWidths.xxx 적용',
                  '상세 페이지/모달 테이블에 rowHeight="40px" 적용',
                  '커스텀 render 함수에 truncate 클래스 적용',
                  '복합 셀에 min-w-0 클래스 적용',
                  '긴 텍스트에 title 속성 또는 Tooltip 적용',
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-body-md text-[var(--color-text-muted)]"
                  >
                    <input type="checkbox" className="rounded" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </SectionCard.Content>
          </SectionCard>
        </main>
      </div>
    </div>
  );
}

export default TableStyleGuidePage;
