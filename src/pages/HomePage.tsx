import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TopBar,
  TopBarAction,
  Breadcrumb,
  VStack,
} from '@/design-system';
import {
  IconMessagePlus,
  IconRobotFace,
  IconSquarePlus,
  IconPuzzle,
  IconBell,
  IconPalette,
  IconCheck,
  IconCopy,
} from '@tabler/icons-react';

/* ----------------------------------------
   Card Component
   ---------------------------------------- */
interface CardProps {
  title?: string;
  bgColor?: string;
  className?: string;
  children: React.ReactNode;
}

function Card({ title, bgColor = 'bg-[var(--color-surface-default)]', className = '', children }: CardProps) {
  return (
    <div className={`${bgColor} rounded-lg p-6 ${className}`}>
      {title && (
        <h4 className="text-[10px] font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-4">
          {title}
        </h4>
      )}
      {children}
    </div>
  );
}

/* ----------------------------------------
   Stat Card Component
   ---------------------------------------- */
interface StatCardProps {
  value: number;
  label: string;
}

function StatCard({ value, label }: StatCardProps) {
  return (
    <div className="bg-[var(--color-surface-subtle)] flex flex-[1_0_0] flex-col items-start justify-center min-h-px min-w-px p-4 rounded-lg">
      <div className="flex flex-col items-start pb-1 pt-0 px-0 relative shrink-0 w-full">
        <p className="font-medium text-[20px] leading-normal text-[var(--color-text-default)]">{value}</p>
      </div>
      <div className="flex flex-col items-start relative shrink-0 w-full">
        <p className="text-[length:var(--font-size-11)] leading-[var(--line-height-16)] text-[var(--color-text-muted)]">{label}</p>
      </div>
    </div>
  );
}

/* ----------------------------------------
   Quick Action Card Component
   ---------------------------------------- */
interface QuickActionCardProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

function QuickActionCard({ icon, label, onClick }: QuickActionCardProps) {
  return (
    <button
      onClick={onClick}
      className="bg-[var(--color-surface-subtle)] flex flex-[1_0_0] flex-col items-start justify-center min-h-px min-w-px p-4 rounded-lg transition-colors hover:bg-[var(--color-surface-muted)] border-2 border-transparent hover:border-[var(--color-action-primary)]"
    >
      <div className="flex flex-col items-start pb-1 pt-0 px-0 relative shrink-0 w-full">
        <div className="flex items-start justify-start shrink-0">
          {icon}
        </div>
      </div>
      <div className="flex flex-col items-start relative shrink-0 w-full">
        <p className="text-[length:var(--font-size-11)] leading-[var(--line-height-16)] text-[var(--color-text-muted)] text-left">{label}</p>
      </div>
    </button>
  );
}

/* ----------------------------------------
   Chat Item Component
   ---------------------------------------- */
interface ChatItemProps {
  title: string;
  description: string;
  createdAt: string;
}

function ChatItem({ title, description, createdAt, onClick }: ChatItemProps & { onClick?: () => void }) {
  return (
    <div 
      onClick={onClick}
      className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] flex flex-col gap-3 items-start px-4 py-3 rounded-lg cursor-pointer hover:border-[var(--color-border-focus)] transition-colors"
    >
      <div className="flex flex-col gap-1 items-start relative shrink-0 w-full">
        <p className="font-medium text-[length:var(--font-size-14)] leading-[var(--line-height-20)] text-[var(--color-text-default)]">
          {title}
        </p>
        <p className="text-[length:var(--font-size-11)] leading-[var(--line-height-16)] text-[var(--color-text-subtle)] line-clamp-2">
          {description}
        </p>
      </div>
      <div className="flex gap-0 items-center relative shrink-0">
        <p className="font-medium text-[length:var(--font-size-11)] leading-[var(--line-height-16)] text-[var(--color-text-subtle)]">Created at: {createdAt}</p>
      </div>
    </div>
  );
}

/* ----------------------------------------
   Main HomePage Component
   ---------------------------------------- */
export function HomePage() {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  
  const projectId = 'proj-abc123-def456';
  
  const handleCopyId = () => {
    navigator.clipboard.writeText(projectId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <TopBar
            showSidebarToggle={false}
            showNavigation={true}
            onBack={() => window.history.back()}
            onForward={() => window.history.forward()}
            breadcrumb={
              <Breadcrumb
                items={[
                  { label: 'Home' },
                ]}
              />
            }
            actions={
              <>
                <TopBarAction
                  icon={<IconPalette size={16} stroke={1} />}
                  aria-label="Design System"
                  onClick={() => navigate('/design-system')}
                />
                <TopBarAction
                  icon={<IconBell size={16} stroke={1} />}
                  aria-label="Notifications"
                  badge={true}
                />
              </>
            }
          />

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto min-w-[var(--layout-content-min-width)] overscroll-contain sidebar-scroll">
          {/* EntryPage Content */}
          <div className="px-8 py-6">
          {/* PROJECT INFO Card */}
          <div className="bg-[var(--color-surface-subtle)] rounded-lg p-4 flex flex-col justify-between mb-6">
            <div className="text-[10px] font-medium text-[var(--color-text-muted)] mb-2 uppercase">PROJECT INFO</div>
            <div>
              <h3 className="text-[32px] font-semibold text-[var(--color-text-default)] mb-4">proj-1</h3>
            </div>
            <div className="space-y-4">
              <div>
                <div className="text-[10px] text-[var(--color-text-muted)] mb-1">ID</div>
                <div className="flex items-center gap-1">
                  <span className="text-[12px] text-[var(--color-text-default)]">{projectId}</span>
                  <button 
                    onClick={handleCopyId}
                    className="p-1.5 -m-1 rounded-md hover:bg-[var(--color-surface-muted)] active:bg-[var(--color-surface-subtle)] transition-colors"
                    title={copied ? 'Copied!' : 'Copy ID'}
                  >
                    {copied ? (
                      <IconCheck size={12} className="text-[var(--color-state-success)]" />
                    ) : (
                      <IconCopy size={12} className="text-[var(--color-action-primary)]" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <div className="text-[10px] text-[var(--color-text-muted)] mb-1">Description</div>
                <p className="text-[12px] text-[var(--color-text-default)]">
                  Development environment for the 'service' backend services.
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
              <div className="flex gap-2 items-center relative shrink-0 w-full">
                <StatCard value={10} label="Chat sessions" />
                <StatCard value={6} label="Agents" />
                <StatCard value={12} label="Data sources" />
                <StatCard value={4} label="Tools (My Servers)" />
              </div>

              {/* Quick Action Section */}
              <div className="flex flex-col gap-4 items-start min-w-[1176px] relative shrink-0 w-full mt-4">
                <div className="flex flex-col items-start justify-center relative shrink-0">
                  <div className="flex items-center relative shrink-0">
                    <p className="font-semibold text-[length:var(--font-size-18)] leading-[var(--line-height-28)] text-[var(--color-text-default)]">
                      Quick action
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 items-center relative shrink-0 w-full">
                  <QuickActionCard
                    icon={<IconMessagePlus size={20} stroke={1.5} />}
                    label="New chat"
                    onClick={() => navigate('/chat')}
                  />
                  <QuickActionCard
                    icon={<IconRobotFace size={20} stroke={1.5} />}
                    label="New agent"
                  />
                  <QuickActionCard
                    icon={<IconSquarePlus size={20} stroke={1.5} />}
                    label="New data source"
                  />
                  <QuickActionCard
                    icon={<IconPuzzle size={20} stroke={1.5} />}
                    label="Manage tools"
                  />
                </div>
              </div>

              {/* Recent Chats Section */}
              <div className="flex flex-col gap-4 items-start min-w-[1176px] relative shrink-0 w-full mt-4">
                <div className="flex flex-col items-start justify-center relative shrink-0">
                  <div className="flex items-center relative shrink-0">
                    <p className="font-semibold text-[length:var(--font-size-18)] leading-[var(--line-height-28)] text-[var(--color-text-default)]">
                      Recent chats
                    </p>
                  </div>
                </div>

                {/* Today Section */}
                <div className="flex flex-col gap-2 items-start relative shrink-0 w-full">
                  <p className="text-[length:var(--font-size-11)] leading-[var(--line-height-16)] text-[var(--color-text-subtle)]">
                    Today
                  </p>
                  <VStack gap={2} className="w-full">
                    <ChatItem
                      title="Kubernetes 클러스터 모니터링 설정"
                      description="Prometheus와 Grafana를 활용한 K8s 클러스터 모니터링 대시보드 구성 방법에 대해 논의했습니다. 메트릭 수집, 알림 설정, 커스텀 대시보드 생성 등을 다뤘습니다."
                      createdAt="Jan 8, 2026"
                      onClick={() => navigate('/chat')}
                    />
                    <ChatItem
                      title="React Query vs SWR 비교 분석"
                      description="서버 상태 관리 라이브러리 선택을 위한 비교 분석입니다. 캐싱 전략, 자동 재검증, 에러 핸들링 등 주요 기능을 비교하고 프로젝트에 적합한 선택을 도출했습니다."
                      createdAt="Jan 8, 2026"
                    />
                  </VStack>
                </div>

                {/* Last 7 days Section */}
                <div className="flex flex-col gap-2 items-start relative shrink-0 w-full">
                  <p className="text-[length:var(--font-size-11)] leading-[var(--line-height-16)] text-[var(--color-text-subtle)]">
                    Last 7 days
                  </p>
                  <VStack gap={2} className="w-full">
                    <ChatItem
                      title="PostgreSQL 인덱스 최적화"
                      description="대용량 테이블의 쿼리 성능 개선을 위한 인덱스 전략을 분석했습니다. EXPLAIN ANALYZE를 통한 실행 계획 분석과 복합 인덱스 설계 방안을 검토했습니다."
                      createdAt="Jan 5, 2026"
                    />
                    <ChatItem
                      title="CI/CD 파이프라인 구축 가이드"
                      description="GitHub Actions를 활용한 자동화된 빌드, 테스트, 배포 파이프라인 구성입니다. Docker 이미지 빌드, AWS ECS 배포, 슬랙 알림 연동까지 전체 워크플로우를 설정했습니다."
                      createdAt="Jan 4, 2026"
                    />
                    <ChatItem
                      title="TypeScript 5.0 새로운 기능 정리"
                      description="데코레이터 표준화, const 타입 파라미터, satisfies 연산자 개선 등 TypeScript 5.0의 주요 변경사항과 마이그레이션 가이드를 정리했습니다."
                      createdAt="Jan 3, 2026"
                    />
                    <ChatItem
                      title="API 보안 취약점 점검 결과"
                      description="OWASP Top 10 기준 보안 점검 결과입니다. SQL Injection, XSS, CSRF 등 주요 취약점 분석과 수정 권고사항을 포함합니다."
                      createdAt="Jan 2, 2026"
                    />
                  </VStack>
                </div>
              </div>
          </div>
        </div>
    </>
  );
}

export default HomePage;
