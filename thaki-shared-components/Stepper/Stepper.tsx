// React 훅, 타입
import { useEffect, useRef, useState } from 'react';
import type { MouseEvent } from 'react';
// Stepper 타입, 아코디언, 스타일, 헬퍼
import type { StepperProps, StepId, StepperLocaleText } from './Stepper.types';
import { TcAccordion } from '../TcAccordion/TcAccordion';
import { useTcAccordionContext } from '../TcAccordion/TcAccordion.context';
import { cn } from '../../services';
import { Button } from '../Button/Button';
import { EditIcon } from '../Icon/svg/wrapped';
import {
  stepperItemBaseClassnames,
  stepperItemActiveClassnames,
  stepperItemDefaultClassnames,
  stepperHeaderClassnames,
  stepperLabelBaseClassnames,
  stepperLabelActiveClassnames,
  stepperLabelDisabledClassnames,
} from './Stepper.styles';
import {
  addManyToSet,
  createOpenedStateForFocus,
  filterStepSetByValidKeys,
  findCurrentEditingStepId,
  getCancelFocusStepId,
  getDependentClearedIds,
  getInitialCompletedStepIds,
  isStepAccessible,
  removeManyFromSet,
  toStepKey,
} from './Stepper.helpers';

const DEFAULT_LOCALE_TEXT: Readonly<StepperLocaleText> = {
  writing: 'writing...',
  autoFilled: 'Auto-Filled',
  notConfigured: 'Not configured',
  skip: 'Skip',
  cancel: 'Cancel',
  done: 'Done',
  next: 'Next',
  edit: 'Edit',
};

// 스텝 진행 상태를 관리하는 로컬 상태 타입
interface StepperLocalState {
  completedStepIds: Set<StepId>;
  everCompletedStepIds: Set<StepId>;
  writingStepIds: Set<StepId>;
}

export const StepperInner = <const TStepIds extends readonly StepId[]>({
  stepIds,
  defaultOpenedId,
  onAllStepsCompleted,
  onStepChange,
  localeText = DEFAULT_LOCALE_TEXT,
  children,
}: StepperProps<TStepIds>) => {
  type T = TStepIds[number];
  // Merge provided localeText with defaults
  // 아코디언 열림 상태, children을 step 설정 배열로 사용
  const { openedAccordionIds, setOpenedAccordionIds } = useTcAccordionContext();
  const stepConfigs = children;
  const steps = stepIds;
  // id → step 설정, id → 인덱스, 자동완성 스텝 id 목록
  const stepConfigById = new Map(stepConfigs.map((step) => [step.id, step]));
  const stepIndexById = new Map(steps.map((id, index) => [id, index]));
  // steps에 포함된 autoFilled 스텝만 추출
  const autoFilledStepIds = stepConfigs
    .filter((step) => step.autoFilled && stepIndexById.has(step.id))
    .map((step) => step.id);

  // 기본값(defaultOpenedId) 기준으로 완료·자동채움 스텝 초기화
  const [stepState, setStepState] = useState<StepperLocalState>(() => {
    // defaultOpenedId 이전 + autoFilled를 초기 완료로 설정
    const initialCompleted = addManyToSet(
      getInitialCompletedStepIds(steps, defaultOpenedId),
      autoFilledStepIds
    );
    return {
      completedStepIds: initialCompleted,
      everCompletedStepIds: new Set(initialCompleted),
      writingStepIds: new Set<StepId>(),
    };
  });
  const { completedStepIds, everCompletedStepIds, writingStepIds } = stepState;
  // 사용자가 수정한 자동채움 스텝, 스킵한 스텝, 편집 시 해제할 의존 스텝
  const [editedAutoFilledStepIds, setEditedAutoFilledStepIds] = useState<Set<StepId>>(
    new Set<StepId>()
  );
  // "Skip"으로 완료된 스텝을 추적해 "Not configured" 표시와 스킵 전용 액션 분기에 사용한다.
  const [skippedStepIds, setSkippedStepIds] = useState<Set<StepId>>(new Set<StepId>());
  // 비동기 onComplete 실행 중인 스텝을 추적해 중복 실행을 방지한다.
  const [completingStepIds, setCompletingStepIds] = useState<Set<StepId>>(new Set<StepId>());
  // 편집 시 함께 해제된 의존 스텝 id를 저장해 Cancel 시 복구에 사용한다.
  const invalidatedDependentsByStepRef = useRef<Map<string, StepId[]>>(new Map());

  // 현재 활성 스텝 변경 시 onStepChange 콜백 호출
  const emitStepChange = (prev: T | undefined, current: T | undefined) => {
    // current 없으면 콜백 스킵
    if (current === undefined) {
      return;
    }
    // prev 없을 때 current로 대체
    const effectivePrev = prev ?? current;
    // 같은 스텝이면 중복 호출 방지
    if (prev !== undefined && effectivePrev === current) {
      return;
    }

    onStepChange?.({ prev: effectivePrev, current });
  };

  // 마운트 시 완료·defaultOpened 스텝을 아코디언으로 자동 펼침
  const hasMountedDefaultOpenRef = useRef(false);
  useEffect(() => {
    // 이미 초기 열림 적용했으면 스킵
    if (hasMountedDefaultOpenRef.current) return;
    hasMountedDefaultOpenRef.current = true;
    // 외부에서 이미 열림 설정되어 있으면 스킵
    if (openedAccordionIds.size > 0) {
      return;
    }
    // 완료 스텝 키로 초기 열림 Set 생성
    const initialOpened = new Set(Array.from(completedStepIds).map(toStepKey));
    // defaultOpenedId가 있으면 해당 스텝도 열림에 추가
    if (defaultOpenedId !== undefined && steps.includes(defaultOpenedId)) {
      initialOpened.add(toStepKey(defaultOpenedId));
    }

    setOpenedAccordionIds(initialOpened);
  }, [defaultOpenedId, openedAccordionIds.size, completedStepIds, setOpenedAccordionIds, steps]);

  // steps 변경 시 유효하지 않은 id는 완료/편집/열림 상태에서 제거
  useEffect(() => {
    // steps id 기준 유효 키 집합
    const validStepKeys = new Set(steps.map(toStepKey));
    setStepState((prev) => {
      // 완료/everCompleted/writing 각각 유효 키만 남김
      const nextCompletedStepIds = filterStepSetByValidKeys(prev.completedStepIds, validStepKeys);
      const nextEverCompletedStepIds = filterStepSetByValidKeys(
        prev.everCompletedStepIds,
        validStepKeys
      );
      const nextWritingStepIds = filterStepSetByValidKeys(prev.writingStepIds, validStepKeys);
      // 변경 없으면 prev 그대로 반환(불필요 리렌더 방지)
      if (
        nextCompletedStepIds === prev.completedStepIds &&
        nextEverCompletedStepIds === prev.everCompletedStepIds &&
        nextWritingStepIds === prev.writingStepIds
      ) {
        return prev;
      }
      return {
        completedStepIds: nextCompletedStepIds,
        everCompletedStepIds: nextEverCompletedStepIds,
        writingStepIds: nextWritingStepIds,
      };
    });
    // edited/skipped/opened도 유효 키만 유지
    setEditedAutoFilledStepIds((prev) => filterStepSetByValidKeys(prev, validStepKeys));
    setSkippedStepIds((prev) => filterStepSetByValidKeys(prev, validStepKeys));
    setOpenedAccordionIds((prev) => filterStepSetByValidKeys(prev, validStepKeys));
  }, [steps, setOpenedAccordionIds]);

  // onComplete 통과 시 해당 스텝을 완료 처리
  const handleApply = async (id: T) => {
    if (completingStepIds.has(id)) {
      return;
    }
    const config = stepConfigById.get(id);
    setCompletingStepIds((prev) => addManyToSet(prev, [id]));
    try {
      // onComplete 없으면 true, 있으면 sync/async 반환값 모두 지원
      const canComplete = config ? await Promise.resolve(config.onComplete?.() ?? true) : true;
      if (canComplete) {
        completeStep(id, false);
      }
    } catch (error) {
      console.error('[Stepper] onComplete failed:', {
        stepId: id,
        error,
      });
    } finally {
      setCompletingStepIds((prev) => removeManyFromSet(prev, [id]));
    }
  };

  // onComplete 무시하고 해당 스텝을 스킵 완료 처리 및 onCancel 호출
  const handleSkip = (id: T) => {
    stepConfigById.get(id)?.onCancel?.();
    completeStep(id, true);
  };

  // 스텝 완료/스킵 시 완료 목록 갱신, 다음 포커스, 아코디언 열림 상태 계산
  const completeStep = (id: T, isSkipped: boolean) => {
    const idx = stepIndexById.get(id) ?? -1;
    // 유효하지 않거나 이미 완료된 스텝이면 무시
    if (idx < 0 || completedStepIds.has(id)) return;
    // 현재 편집 중인 스텝, 이전 writing 스텝, 완료할 스텝 목록 계산
    const prevEditingId = findCurrentEditingStepId(steps, openedAccordionIds, completedStepIds);

    // 다른 writing 스텝이 있으면 해당 스텝만 완료, 없으면 이전 스텝들 포함
    const previousWritingStepId = steps.find(
      (stepId) => stepId !== id && writingStepIds.has(stepId)
    );
    const stepsToComplete = previousWritingStepId === undefined ? steps.slice(0, idx + 1) : [id];
    const nextCompleted = addManyToSet(completedStepIds, stepsToComplete);
    // 다음 포커스: writing 중이던 스텝 또는 첫 미완료 스텝
    const nextStepId = previousWritingStepId ?? steps.find((stepId) => !nextCompleted.has(stepId));

    // 다음 포커스 스텝 기준으로 아코디언 열림 상태 생성
    const nextOpenedIds = createOpenedStateForFocus(openedAccordionIds, nextCompleted, nextStepId);
    // 스킵 시 해당 스텝만 닫음, Apply 시 완료 스텝은 펼쳐둠
    if (isSkipped) {
      nextOpenedIds.delete(toStepKey(id));
    } else {
      stepsToComplete.forEach((stepId) => nextOpenedIds.add(toStepKey(stepId)));
    }
    // 완료 목록 갱신, writing에서 완료 스텝 제거
    setStepState((prev) => ({
      completedStepIds: nextCompleted,
      everCompletedStepIds: addManyToSet(prev.everCompletedStepIds, stepsToComplete),
      writingStepIds: removeManyFromSet(prev.writingStepIds, stepsToComplete),
    }));
    setOpenedAccordionIds(nextOpenedIds);
    // 스킵이면 skipped에 추가, 아니면 제거
    setSkippedStepIds((prev) =>
      isSkipped ? addManyToSet(prev, [id]) : removeManyFromSet(prev, [id])
    );
    invalidatedDependentsByStepRef.current.delete(toStepKey(id));
    emitStepChange(prevEditingId, nextStepId);
  };

  // 스텝 편집 진입 시 해당/의존 스텝 완료 해제, writing 등록
  const editStep = (id: T) => {
    const idx = stepIndexById.get(id) ?? -1;
    if (idx < 0) return;
    const config = stepConfigById.get(id);
    // 비편집 스텝이면 무시
    if (config?.editable === false) return;
    const prevEditingId = findCurrentEditingStepId(steps, openedAccordionIds, completedStepIds);

    // 이 스텝이 완료 해제될 때 같이 해제해야 할 의존 스텝들
    const dependentClearedIds = getDependentClearedIds(stepConfigs, id, completedStepIds);
    invalidatedDependentsByStepRef.current.set(toStepKey(id), dependentClearedIds);
    // 현재 스텝+의존 스텝을 완료 해제 대상으로
    const clearedIds = [
      ...new Set(completedStepIds.has(id) ? [id, ...dependentClearedIds] : dependentClearedIds),
    ];
    const nextCompleted = removeManyFromSet(completedStepIds, clearedIds);
    // 편집 타겟(id)에 포커스 맞춘 열림 상태
    const nextOpenedIds = createOpenedStateForFocus(openedAccordionIds, nextCompleted, id);
    // 이전 스텝 중 완료된 것만 펼침(미완료는 닫힘 유지)
    steps.slice(0, idx).forEach((stepId) => {
      if (nextCompleted.has(stepId)) {
        nextOpenedIds.add(toStepKey(stepId));
      }
    });
    // 이전 편집 스텝 + 현재 + 의존 스텝을 writing으로 등록
    const nextWriting = addManyToSet(
      writingStepIds,
      prevEditingId !== undefined && prevEditingId !== id
        ? [prevEditingId, id, ...dependentClearedIds]
        : [id, ...dependentClearedIds]
    );
    setStepState((prev) => ({
      ...prev,
      completedStepIds: nextCompleted,
      writingStepIds: nextWriting,
    }));
    // 자동채움 스텝을 수정했으면 edited 목록에 추가
    if (config?.autoFilled) {
      setEditedAutoFilledStepIds((prev) => addManyToSet(prev, [id]));
    }
    setOpenedAccordionIds(nextOpenedIds);
    emitStepChange(prevEditingId, id);
  };

  // 아코디언 헤더 클릭 시 해당 스텝을 열고, 이전 편집 중이던 스텝을 writing 유지
  const handleHeaderOpen = (id: T) => {
    const prevEditingId = findCurrentEditingStepId(steps, openedAccordionIds, completedStepIds);
    const nextOpenedIds = createOpenedStateForFocus(openedAccordionIds, completedStepIds, id);
    setOpenedAccordionIds(nextOpenedIds);
    // 다른 스텝 편집 중이었다면 해당 스텝을 writing으로 유지
    if (prevEditingId !== undefined && prevEditingId !== id) {
      setStepState((prev) => ({
        ...prev,
        writingStepIds: addManyToSet(prev.writingStepIds, [prevEditingId]),
      }));
    }
    emitStepChange(prevEditingId, id);
  };

  // Cancel 클릭 시 편집 스텝·의존 스텝을 다시 완료 처리, 포커스 이동
  const cancelEditing = (currentId: T) => {
    const currentKey = toStepKey(currentId);
    // editStep 시 저장해둔 의존 스텝 목록
    const dependentIds = invalidatedDependentsByStepRef.current.get(currentKey) ?? [];
    // 현재+의존 스텝을 다시 완료 처리
    const nextCompleted = addManyToSet(completedStepIds, [currentId, ...dependentIds]);
    const nextWriting = removeManyFromSet(writingStepIds, [currentId, ...dependentIds]);
    // Cancel 후 포커스할 스텝 결정
    const nextFocusId = getCancelFocusStepId(steps, currentId, nextWriting, nextCompleted);
    setStepState((prev) => ({
      ...prev,
      completedStepIds: nextCompleted,
      writingStepIds: nextWriting,
    }));
    setOpenedAccordionIds(
      createOpenedStateForFocus(openedAccordionIds, nextCompleted, nextFocusId)
    );
    invalidatedDependentsByStepRef.current.delete(currentKey);
    emitStepChange(currentId, nextFocusId);
  };

  // 아코디언 헤더 닫기 시, 미완료 스텝이면 writing 상태로 등록
  const handleHeaderClose = (id: T) => {
    // 열려 있고 미완료 스텝이면 writing 등록
    if (openedAccordionIds.has(toStepKey(id)) && !completedStepIds.has(id)) {
      // 이미 writing이면 유지, 아니면 추가
      setStepState((prev) =>
        prev.writingStepIds.has(id)
          ? prev
          : {
              ...prev,
              writingStepIds: addManyToSet(prev.writingStepIds, [id]),
            }
      );
    }
    // 열림 Set에서 해당 스텝 제거
    setOpenedAccordionIds((prev) => {
      const key = toStepKey(id);
      if (!prev.has(key)) return prev;
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
  };

  // 모든 스텝 완료 시 onAllStepsCompleted 한 번 호출
  const hasInitializedRef = useRef(false);
  const prevAllCompletedRef = useRef(false);
  const stepsLen = steps.length;

  useEffect(() => {
    // 스텝이 있고 전부 완료·writing 없음이면 allDone
    const allDone = stepsLen > 0 && completedStepIds.size === stepsLen && writingStepIds.size === 0;
    // 첫 렌더는 이전값만 저장하고 콜백 스킵
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;
      prevAllCompletedRef.current = allDone;
      return;
    }

    // allDone으로 전환되는 시점에만 한 번 호출
    if (allDone && !prevAllCompletedRef.current) onAllStepsCompleted?.();
    prevAllCompletedRef.current = allDone;
  }, [
    stepState.completedStepIds.size,
    stepsLen,
    stepState.writingStepIds.size,
    onAllStepsCompleted,
    completedStepIds.size,
    writingStepIds.size,
  ]);

  // 각 스텝을 아코디언으로 렌더, 완료/편집/열림/스킵 상태에 따라 UI 분기
  return (
    <>
      {stepConfigs.map((config, i) => {
        // 스텝별 상태 플래그
        const stepKey = toStepKey(config.id);
        const isCompleted = completedStepIds.has(config.id);
        const isWriting = writingStepIds.has(config.id);
        const isOpen = openedAccordionIds.has(stepKey);
        const isSkipped = skippedStepIds.has(config.id);
        // 완료 시 Edit 버튼, 스킵 완료·접힌 상태일 때 Not configured 배지
        const showEditButton = isCompleted;
        const showNotConfiguredBadge = isCompleted && isSkipped && !isOpen;

        /** 편집가능 여부 */
        const editable = config.editable ?? true;

        /** Auto-Filled 텍스트 표시 여부 (자동채움 스텝이 edit 되지 않은 경우) */
        const showAutoFilledBadge =
          Boolean(config.autoFilled) && isCompleted && !editedAutoFilledStepIds.has(config.id);

        // 열림·편집 중·미완료·이전 완료 이력 있음 → Apply/Cancel 표시
        const showHeaderApplyActions =
          isOpen && isWriting && !isCompleted && everCompletedStepIds.has(config.id);
        // 이전에 Skip으로 완료된 스텝을 다시 편집 중이면 Cancel 대신 Skip 버튼을 유지한다.
        const showHeaderSkipActions = showHeaderApplyActions && isSkipped;
        // 접힌 상태에서 작성 중임을 헤더 배지("writing...")로만 표시한다.
        const showWritingBadge = isWriting && !isOpen;
        const isCompleting = completingStepIds.has(config.id);
        // 이전 스텝 완료 시에만 접근 가능
        const isAccessible = isStepAccessible(config.id, i, steps, completedStepIds);

        const disabled = !isAccessible;

        /* 이미 완료된 단계는 닫을 수 없음 */
        const cannotBeClosed = completedStepIds.has(config.id);

        return (
          // 스텝별 아코디언, disabled/cannotBeClosed 시 비활성화
          <TcAccordion
            key={String(config.id)}
            id={String(config.id)}
            disabled={disabled || cannotBeClosed}
            onOpen={() => handleHeaderOpen(config.id)}
            onClose={() => handleHeaderClose(config.id)}
            // 미완료+열림이면 active, 아니면 default 스타일
            className={cn(
              stepperItemBaseClassnames,
              !isCompleted && isOpen ? stepperItemActiveClassnames : stepperItemDefaultClassnames
            )}
            header={
              <div className="w-full">
                <div className={stepperHeaderClassnames}>
                  {/* 라벨 접근 가능 여부에 따라 스타일 분기 */}
                  <div
                    className={cn(
                      stepperLabelBaseClassnames,
                      isAccessible ? stepperLabelActiveClassnames : stepperLabelDisabledClassnames
                    )}
                  >
                    {config.label}
                  </div>
                  {/* 배지(writing/Auto-Filled/Not configured) 및 버튼 영역 */}
                  <div className="flex items-center gap-3">
                    {showWritingBadge && (
                      <span className="text-primary text-sm font-semibold">
                        {localeText.writing}
                      </span>
                    )}
                    {showAutoFilledBadge && (
                      <span className="text-text-muted text-sm font-semibold">
                        {localeText.autoFilled}
                      </span>
                    )}
                    {showNotConfiguredBadge && (
                      <span className="text-text-muted text-xs font-normal leading-[18px]">
                        {localeText.notConfigured}
                      </span>
                    )}
                    {/* 스킵 이력 있으면 Skip, 없으면 Cancel 표시 */}
                    {showHeaderApplyActions && (
                      <>
                        {showHeaderSkipActions ? (
                          <Button
                            variant="secondary"
                            appearance="outline"
                            size="sm"
                            className="w-16"
                            onClick={(e: MouseEvent) => {
                              e.stopPropagation();
                              handleSkip(config.id);
                            }}
                          >
                            {localeText.skip}
                          </Button>
                        ) : (
                          <Button
                            variant="secondary"
                            appearance="outline"
                            size="sm"
                            className="w-16"
                            onClick={(e: MouseEvent) => {
                              e.stopPropagation();
                              config.onCancel?.();
                              cancelEditing(config.id);
                            }}
                          >
                            {localeText.cancel}
                          </Button>
                        )}
                        <Button
                          variant="primary"
                          size="sm"
                          className="w-16"
                          disabled={isCompleting}
                          onClick={(e: MouseEvent) => {
                            e.stopPropagation();
                            void handleApply(config.id);
                          }}
                        >
                          {localeText.done}
                        </Button>
                      </>
                    )}
                    {showEditButton && (
                      <Button
                        variant="secondary"
                        appearance="outline"
                        size="sm"
                        disabled={!editable}
                        onClick={(e: MouseEvent) => {
                          e.stopPropagation();
                          if (!editable) {
                            return;
                          }

                          editStep(config.id);
                        }}
                      >
                        <EditIcon size="xs" /> {localeText.edit}
                      </Button>
                    )}
                  </div>
                </div>
                {isOpen && (
                  <div className="mt-3">
                    <div className="h-px bg-border-muted" />
                  </div>
                )}
              </div>
            }
          >
            {/* 완료 시 doneUI, 미완료 시 editUI + 하단 버튼 */}
            {isCompleted ? (
              config.doneUI
            ) : (
              <>
                {config.editUI}
                {/* 헤더에 Apply가 없을 때만 하단 Complete/Skip 표시 */}
                {!showHeaderApplyActions && (
                  <div className="mt-4 border-t border-border-muted pt-4 flex items-center justify-end gap-2">
                    {/* skippable이면 Skip 버튼 표시 */}
                    {config.skippable && (
                      <Button
                        variant="secondary"
                        appearance="outline"
                        size="md"
                        className="w-20"
                        onClick={() => handleSkip(config.id)}
                      >
                        {localeText.skip}
                      </Button>
                    )}
                    <Button
                      variant="primary"
                      size="md"
                      className="w-20"
                      disabled={isCompleting}
                      onClick={() => {
                        void handleApply(config.id);
                      }}
                    >
                      {localeText.next}
                    </Button>
                  </div>
                )}
              </>
            )}
          </TcAccordion>
        );
      })}
    </>
  );
};

// 다중 아코디언 그룹으로 StepperInner 래핑
export const Stepper = <const TStepIds extends readonly StepId[]>(
  props: StepperProps<TStepIds>
) => (
  <TcAccordion.Group multiple={true}>
    <StepperInner {...props} />
  </TcAccordion.Group>
);
