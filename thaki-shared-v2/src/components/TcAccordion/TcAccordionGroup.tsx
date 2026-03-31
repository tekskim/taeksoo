import { useMemo, useState } from 'react';

import type { TcAccordionGroupProps } from './TcAccordion.types';
import { TcAccordionContext } from './TcAccordion.context';
import { cn } from '../../services';
import { tcAccordionGroupClassnames } from './TcAccordion.styles';

/**
 * TcAccordionGroup은 여러 TcAccordion 항목들을 그룹화하여 상태를 관리합니다.
 * Context를 통해 자식 아코디언 항목들과 열림/닫힘 상태를 동기화합니다.
 *
 * @param multiple - true일 때 여러 아코디언을 동시에 열 수 있고,
 *                   false일 때는 하나씩만 열 수 있습니다. (기본값: true)
 *
 * 사용 예시:
 * ```
 * <TcAccordion.Group multiple={false}>
 *   <TcAccordion id="item1" header="첫 번째">내용 1</TcAccordion>
 *   <TcAccordion id="item2" header="두 번째">내용 2</TcAccordion>
 * </TcAccordion.Group>
 * ```
 */
export const TcAccordionGroup = ({
  className,
  children,
  multiple = true,
}: TcAccordionGroupProps) => {
  /** 현재 열려있는 아코디언 항목 id들을 관리하는 상태 */
  const [openedAccordionIds, setOpenedAccordionIds] = useState<Set<string | number>>(
    () => new Set()
  );

  /** Context에 제공될 값을 메모이제이션합니다. multiple 값 변경 시에만 재계산됩니다. */
  const value = useMemo(
    () => ({ openedAccordionIds, setOpenedAccordionIds, multiple, isGrouped: true }),
    [openedAccordionIds, multiple]
  );

  return (
    <TcAccordionContext.Provider value={value}>
      <div className={cn(tcAccordionGroupClassnames, className)}>{children}</div>
    </TcAccordionContext.Provider>
  );
};
