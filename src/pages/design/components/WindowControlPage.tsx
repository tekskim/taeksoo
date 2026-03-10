import { ComponentPageTemplate } from '../_shared/ComponentPageTemplate';
import { DosDonts } from '../_shared/DosDonts';
import { ComponentPreview } from '../_shared/ComponentPreview';
import { WindowControl, WindowControls, VStack } from '@/design-system';

function TableWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-body-md text-[var(--color-text-default)] border-collapse">
        {children}
      </table>
    </div>
  );
}

function Th({ children, className = '' }: { children?: React.ReactNode; className?: string }) {
  return (
    <th
      className={`text-left text-label-md font-medium p-3 bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] ${className}`}
    >
      {children}
    </th>
  );
}

function Td({ children, className = '' }: { children?: React.ReactNode; className?: string }) {
  return (
    <td className={`p-3 border border-[var(--color-border-default)] align-top ${className}`}>
      {children}
    </td>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-heading-h4 text-[var(--color-text-default)]">{children}</h3>;
}

function SubSectionTitle({ children }: { children: React.ReactNode }) {
  return <h4 className="text-heading-h5 text-[var(--color-text-default)]">{children}</h4>;
}

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-body-md text-[var(--color-text-muted)] leading-relaxed space-y-2">
      {children}
    </div>
  );
}

function WindowControlGuidelines() {
  return (
    <VStack gap={10}>
      {/* Composition */}
      <VStack gap={4}>
        <SectionTitle>Composition</SectionTitle>
        <Prose>
          <p>
            컨트롤 버튼이 <strong>Title Bar 영역에 그룹 형태로 배치된다.</strong>
          </p>
        </Prose>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[200px]">요소</Th>
              <Th>설명</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <strong>① Minimize Button</strong>
              </Td>
              <Td>창을 최소화 상태로 전환</Td>
            </tr>
            <tr>
              <Td>
                <strong>② Maximize/Restore Button</strong>
              </Td>
              <Td>창을 최대화/일반(이전 크기) 상태로 전환 → 토글</Td>
            </tr>
            <tr>
              <Td>
                <strong>③ Close Button</strong>
              </Td>
              <Td>현재 창을 닫음</Td>
            </tr>
          </tbody>
        </TableWrapper>

        <SubSectionTitle>Design Token</SubSectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[200px]">속성</Th>
              <Th>값</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <code>size</code>
              </Td>
              <Td>24×24px</Td>
            </tr>
            <tr>
              <Td>
                <code>icon</code>
              </Td>
              <Td>12px</Td>
            </tr>
            <tr>
              <Td>
                <code>radius</code>
              </Td>
              <Td>4px</Td>
            </tr>
            <tr>
              <Td>
                <code>gap</code>
              </Td>
              <Td>4px</Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* States */}
      <VStack gap={4}>
        <SectionTitle>States</SectionTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th className="w-[140px]">상태</Th>
              <Th>설명</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <strong>Default</strong>
              </Td>
              <Td>기본 상태</Td>
            </tr>
            <tr>
              <Td>
                <strong>Hover</strong>
              </Td>
              <Td>마우스 포인터가 버튼 위에 위치</Td>
            </tr>
            <tr>
              <Td>
                <strong>Pressed</strong>
              </Td>
              <Td>버튼이 클릭되는 상태</Td>
            </tr>
            <tr>
              <Td>
                <strong>Maximized</strong>
              </Td>
              <Td>창이 최대화된 상태</Td>
            </tr>
            <tr>
              <Td>
                <strong>Normal</strong>
              </Td>
              <Td>창이 일반(비최대화/비최소화) 상태</Td>
            </tr>
          </tbody>
        </TableWrapper>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* Behavior */}
      <VStack gap={6}>
        <SectionTitle>Behavior</SectionTitle>

        <VStack gap={3}>
          <SubSectionTitle>1) Minimize 버튼</SubSectionTitle>
          <Prose>
            <p>
              <strong>역할</strong>: 현재 창을 최소화 상태로 전환한다.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>클릭 시 창이 최소화된다.</li>
              <li>최소화된 창은 Desktop UI의 작업 표시 영역(Top bar)에서 다시 열 수 있다.</li>
              <li>최소화 상태에서는 창 콘텐츠가 화면에서 보이지 않는다.</li>
            </ul>
          </Prose>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>2) Maximize/Restore 버튼</SubSectionTitle>
          <Prose>
            <p>
              <strong>역할</strong>: 창을 최대화하거나 이전 크기로 복원한다.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                창이 Normal 상태일 때 클릭하면 <strong>Maximize</strong>된다.
              </li>
              <li>
                창이 Maximized 상태일 때 클릭하면 <strong>Restore</strong>된다.
              </li>
              <li>
                Restore 시 창은 <strong>최대화 직전의 크기와 위치</strong>로 복원된다(Last known
                bounds).
              </li>
              <li>창의 상태에 따라 아이콘도 바뀐다.</li>
            </ul>
          </Prose>
          <TableWrapper>
            <thead>
              <tr>
                <Th className="w-[200px]">상태</Th>
                <Th>아이콘</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td>Normal</Td>
                <Td>Maximize icon</Td>
              </tr>
              <tr>
                <Td>Maximized</Td>
                <Td>Restore icon</Td>
              </tr>
            </tbody>
          </TableWrapper>
        </VStack>

        <VStack gap={3}>
          <SubSectionTitle>3) Close 버튼</SubSectionTitle>
          <Prose>
            <p>
              <strong>역할</strong>: 현재 창을 닫는다.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                클릭 시 <strong>현재 창만 닫는다.</strong>
              </li>
              <li>멀티 윈도우를 지원하는 앱은 해당 창만 닫히며, 앱의 다른 창은 유지된다.</li>
              <li>
                &quot;창 닫기&quot;와 &quot;앱 종료&quot;는 구분한다. (앱 종료는 Top bar에서 가능)
              </li>
            </ul>
          </Prose>
        </VStack>
      </VStack>

      <div className="w-full h-px bg-[var(--color-border-default)]" />

      {/* Usage Guidelines */}
      <VStack gap={4}>
        <SectionTitle>Usage Guidelines</SectionTitle>
        <DosDonts
          doItems={[
            '동일 OS 내에서 버튼 위치/순서/아이콘을 모든 앱 창에서 일관되게 유지한다.',
            'Maximize/Restore 토글 동작과 아이콘 전환을 일관되게 적용한다.',
          ]}
          dontItems={['OS 관습과 반대로 버튼 순서를 변경하지 않는다.']}
        />
      </VStack>
    </VStack>
  );
}

export function WindowControlPage() {
  return (
    <ComponentPageTemplate
      title="Window Control"
      description="데스크탑 UI에서 창(Window)을 제어하기 위한 기본 컨트롤 컴포넌트이다. 사용자는 최소화(Minimize), 최대화/복원(Maximize/Restore), 닫기(Close) 버튼을 통해 현재 앱 창을 제어한다."
      whenToUse={['Desktop UI 내에서 앱이 "독립 창" 형태로 동작하는 경우(멀티 윈도우 포함)']}
      whenNotToUse={['OS 네이티브 창을 그대로 사용하는 경우(이 문서는 불필요)']}
      preview={
        <ComponentPreview code={`<WindowControls />`}>
          <VStack gap={6} className="w-full items-center">
            <div className="flex items-center justify-between w-full max-w-[400px] h-10 px-3 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--primitive-radius-md)]">
              <span className="text-body-md font-medium text-[var(--color-text-default)]">
                Application Title
              </span>
              <WindowControls />
            </div>
          </VStack>
        </ComponentPreview>
      }
      examples={
        <VStack gap={8}>
          <VStack gap={3}>
            <VStack gap={1}>
              <span className="text-label-md text-[var(--color-text-default)]">
                Individual controls
              </span>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                각 버튼은 독립적으로 사용 가능. size: 24×24px, icon: 12px, radius: 4px.
              </span>
            </VStack>
            <div className="flex gap-6 items-center">
              <VStack gap={1} align="center">
                <span className="text-body-xs text-[var(--color-text-subtle)]">Minimize</span>
                <WindowControl type="minimize" />
              </VStack>
              <VStack gap={1} align="center">
                <span className="text-body-xs text-[var(--color-text-subtle)]">Maximize</span>
                <WindowControl type="maximize" />
              </VStack>
              <VStack gap={1} align="center">
                <span className="text-body-xs text-[var(--color-text-subtle)]">Close</span>
                <WindowControl type="close" />
              </VStack>
            </div>
          </VStack>

          <VStack gap={3}>
            <VStack gap={1}>
              <span className="text-label-md text-[var(--color-text-default)]">Controls group</span>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                3개 버튼이 gap: 4px 간격으로 그룹 배치. Title Bar 우측에 위치.
              </span>
            </VStack>
            <WindowControls />
          </VStack>

          <VStack gap={3}>
            <VStack gap={1}>
              <span className="text-label-md text-[var(--color-text-default)]">
                Title Bar 컨텍스트
              </span>
              <span className="text-body-sm text-[var(--color-text-subtle)]">
                실제 사용 시 Title Bar 영역에 앱 타이틀과 함께 그룹으로 배치된다.
              </span>
            </VStack>
            <div className="flex items-center justify-between w-full max-w-[400px] h-10 px-3 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--primitive-radius-md)]">
              <span className="text-body-md font-medium text-[var(--color-text-default)]">
                Application Title
              </span>
              <WindowControls />
            </div>
          </VStack>
        </VStack>
      }
      guidelines={<WindowControlGuidelines />}
      tokens={
        <div className="text-body-sm text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-subtle)] rounded-[var(--primitive-radius-md)]">
          <code>size: 24×24px</code> · <code>icon: 12px</code> · <code>radius: 4px</code> ·{' '}
          <code>gap: 4px</code>
        </div>
      }
      relatedLinks={[
        {
          label: 'Tab Bar',
          path: '/design/components/tabbar',
          description: 'Window Controls가 배치되는 영역',
        },
        {
          label: 'App Window',
          path: '/design/components/app-window',
          description: '윈도우 컨트롤이 적용되는 윈도우 전체 레이아웃',
        },
      ]}
    />
  );
}
