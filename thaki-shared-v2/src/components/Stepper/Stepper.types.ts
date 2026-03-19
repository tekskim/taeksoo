import type { ReactNode } from "react";

export type StepId = string | number;

/** Stepper에서 렌더링되는 단일 스텝 설정. */
export interface StepperStepConfig<T extends StepId = StepId> {
  id: T;
  /** 완료 배지와 함께 TcAccordion 헤더에 렌더링된다. */
  label: ReactNode;
  /** 스텝이 활성(미완료) 상태일 때 표시된다. */
  editUI: ReactNode;
  /** 스텝 완료 후 사용자가 펼쳐 확인할 때 표시된다. */
  doneUI: ReactNode;
  /** true면 첫 렌더에서 완료(doneUI) 및 펼침 상태로 시작한다. */
  autoFilled?: boolean;
  /**
   * 현재 스텝 Apply/Complete 전에 실행되는 선택적 가드.
   * - undefined: 항상 완료
   * - defined: true를 반환해야 완료
   * - Promise를 반환하면 resolve된 boolean 값을 사용
   * - Skip 경로에서는 이 가드를 우회
   */
  onComplete?: () => boolean | Promise<boolean>;
  /** 이 스텝 편집 중 Cancel 클릭 시 호출된다. */
  onCancel?: () => void;
  /**
   * 목록에 지정된 스텝 id 중 하나가 다시 편집되면
   * 이 스텝은 완료 해제되고 재편집이 필요하다.
   */
  dependsOn?: T[];
  /**
   * 완료 후 이 스텝을 편집할 수 있는지 제어한다.
   * - undefined: 편집 가능(기본값)
   * - true: 편집 가능
   * - false: 편집 불가
   */
  editable?: boolean;
  /** true면 이 스텝에 "Skip" 버튼을 표시한다. */
  skippable?: boolean;
}

export interface StepperLocaleText {
  writing?: string;
  autoFilled?: string;
  notConfigured?: string;
  skip?: string;
  cancel?: string;
  done?: string;
  next?: string;
  edit?: string;
}

export interface StepperProps<
  TStepIds extends readonly StepId[] = readonly StepId[],
> {
  /** Stepper 전환/포커스 계산에 사용하는 순서 있는 id 목록. */
  stepIds: TStepIds;
  /**
   * 첫 렌더에서 열어둘 스텝 id.
   * 이 스텝 이전의 모든 스텝은 자동으로 완료 처리된다.
   * 생략하면 모든 스텝이 완료된 상태로 시작한다.
   */
  defaultOpenedId?: TStepIds[number];
  /** 모든 스텝이 완료 상태로 전환될 때 한 번 호출된다. */
  onAllStepsCompleted?: () => void;
  /**
   * 전환 후 Stepper가 현재 활성 스텝을 확정할 때 호출된다.
   * 이전 활성 스텝을 특정하기 어려운 경계 상황에서는
   * `prev`가 `current`로 정규화될 수 있다.
   */
  onStepChange?: ({
    prev,
    current,
  }: {
    prev: TStepIds[number];
    current: TStepIds[number];
  }) => void;
  /** Localized text for Stepper UI elements. */
  localeText?: StepperLocaleText;
  children: StepperStepConfig<TStepIds[number]>[];
}
