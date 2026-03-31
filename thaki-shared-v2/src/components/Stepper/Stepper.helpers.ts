import type { StepId, StepperStepConfig } from './Stepper.types';

/** Step id를 Set/Map 비교용 문자열 키로 변환한다. (id: 원본 스텝 식별자) */
export const toStepKey = (id: StepId): string => String(id);
type OpenedStepId = string | number;

/**
 * 초기 완료 스텝 집합을 계산한다.
 * - steps: 전체 스텝 순서
 * - defaultOpenedId: 최초 오픈 스텝 id
 */
export const getInitialCompletedStepIds = (
  steps: readonly StepId[],
  defaultOpenedId?: StepId
): Set<StepId> => {
  // 기본 오픈 step이 없으면 edit 화면으로 간주해 모든 step을 완료 상태로 시작한다.
  if (defaultOpenedId === undefined) {
    return new Set<StepId>(steps);
  }

  const defaultIndex = steps.findIndex((id) => id === defaultOpenedId);

  if (defaultIndex <= 0) {
    return new Set<StepId>();
  }

  return new Set<StepId>(steps.slice(0, defaultIndex));
};

/**
 * 유효 키(validStepKeys)에 없는 id를 Set에서 제거한다.
 * - prev: 기존 스텝 Set
 * - validStepKeys: 허용되는 문자열 키 Set
 */
export const filterStepSetByValidKeys = (
  prev: Set<StepId>,
  validStepKeys: Set<string>
): Set<StepId> => {
  const filtered = Array.from(prev).filter((id) => validStepKeys.has(toStepKey(id)));
  if (filtered.length === prev.size) return prev;
  return new Set(filtered);
};

/** Set에 여러 id를 추가한다. (prev: 기존 Set, ids: 추가할 스텝 id 목록) */
export const addManyToSet = (prev: Set<StepId>, ids: readonly StepId[]): Set<StepId> => {
  if (ids.length === 0) return prev;
  const next = new Set(prev);
  ids.forEach((id) => next.add(id));
  return next;
};

/** Set에서 여러 id를 제거한다. (prev: 기존 Set, ids: 제거할 스텝 id 목록) */
export const removeManyFromSet = (prev: Set<StepId>, ids: readonly StepId[]): Set<StepId> => {
  if (ids.length === 0) return prev;
  const next = new Set(prev);
  ids.forEach((id) => next.delete(id));
  return next;
};

/**
 * 현재 편집 중인 스텝 id를 찾는다.
 * - steps: 스텝 순서
 * - openedStepIds: 열린 아코디언 id
 * - completedStepIds: 완료 스텝 id
 */
export const findCurrentEditingStepId = (
  steps: readonly StepId[],
  openedStepIds: Set<OpenedStepId>,
  completedStepIds: Set<StepId>
): StepId | undefined =>
  steps.find((stepId) => openedStepIds.has(toStepKey(stepId)) && !completedStepIds.has(stepId));

/**
 * editedId를 dependsOn으로 참조하는 완료 스텝 id 목록을 반환한다.
 * - steps: 스텝 설정 목록
 * - editedId: 재편집된 스텝 id
 * - completedStepIds: 현재 완료 스텝 id
 */
export const getDependentClearedIds = (
  steps: StepperStepConfig[],
  editedId: StepId,
  completedStepIds: Set<StepId>
): StepId[] => {
  return steps
    .filter(
      (step) =>
        step.id !== editedId && completedStepIds.has(step.id) && step.dependsOn?.includes(editedId)
    )
    .map((step) => step.id);
};

/**
 * Cancel 이후 포커스할 다음 스텝 id를 계산한다.
 * - steps: 스텝 순서
 * - currentId: 현재 취소한 스텝 id
 * - writingStepIds/completedStepIds: 현재 상태 Set
 */
export const getCancelFocusStepId = (
  steps: readonly StepId[],
  currentId: StepId,
  writingStepIds: Set<StepId>,
  completedStepIds: Set<StepId>
): StepId | undefined => {
  const writingFirst = steps.find((stepId) => stepId !== currentId && writingStepIds.has(stepId));
  if (writingFirst !== undefined) return writingFirst;

  const currentIndex = steps.indexOf(currentId);
  if (currentIndex < 0) return undefined;

  return steps
    .slice(currentIndex + 1)
    .find((stepId) => !completedStepIds.has(stepId) && !writingStepIds.has(stepId));
};

/**
 * 포커스 대상(focusId) 기준으로 열림 상태 Set을 재계산한다.
 * 완료되지 않은 스텝은 focusId가 아니면 닫는다.
 */
export const createOpenedStateForFocus = (
  currentOpened: Set<OpenedStepId>,
  completedStepIds: Set<StepId>,
  focusId?: StepId
): Set<OpenedStepId> => {
  const allowedOpenId = focusId !== undefined ? toStepKey(focusId) : undefined;
  const completedKeys = new Set(Array.from(completedStepIds).map(toStepKey));
  const nextOpened = new Set(currentOpened);
  for (const openId of Array.from(nextOpened)) {
    if (!completedKeys.has(toStepKey(openId)) && toStepKey(openId) !== allowedOpenId) {
      nextOpened.delete(openId);
    }
  }
  if (focusId !== undefined) {
    nextOpened.add(toStepKey(focusId));
  }
  return nextOpened;
};

/**
 * 스텝 접근 가능 여부를 판단한다.
 * - stepId/index: 대상 스텝
 * - steps: 전체 스텝 순서
 * - completedStepIds: 완료 스텝 id
 */
export const isStepAccessible = (
  stepId: StepId,
  index: number,
  steps: readonly StepId[],
  completedStepIds: Set<StepId>
): boolean => {
  // 접근 가능 조건:
  // 1) 이미 완료된 스텝
  // 2) 첫 번째 스텝
  // 3) 이전 스텝이 모두 완료된 경우
  // 4) 뒤쪽 스텝이 이미 완료된 경우(앞 스텝 재진입 허용)

  if (completedStepIds.has(stepId) || index === 0) {
    return true;
  }

  // 뒤쪽 스텝 중 완료된 항목이 있으면 현재 스텝도 접근 가능으로 본다.
  const hasLaterCompletedStep = steps.slice(index + 1).some((id) => completedStepIds.has(id));
  if (hasLaterCompletedStep) {
    return true;
  }

  return steps.slice(0, index).every((id) => completedStepIds.has(id));
};
