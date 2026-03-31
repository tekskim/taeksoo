import { FunctionComponent } from 'react';
import { create, StoreApi } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

/**
 * @type 오버레이 컴포넌트의 props 타입을 추론하는 타입
 */
type PropsOf<T> = T extends FunctionComponent<infer P> ? P : never;

/**
 * @description
 * OverlayOptions는 오버레이(모달, 드로어)의 동작과 표시를 제어하는 옵션들을 정의합니다.
 *
 * 주요 기능:
 * - 오버레이 타입과 레이아웃을 제어합니다.
 * - 사용자 상호작용(딤 클릭, 키보드)에 대한 동작을 설정합니다.
 * - 오버레이의 표시/숨김과 애니메이션을 관리합니다.
 * - 전역 렌더링 여부와 포털 위치를 결정합니다.
 *
 * @param type - 오버레이 타입 (기본값: 'drawer-horizontal')
 * @param showDim - 배경 딤 표시 여부 (기본값: true)
 * @param closeOnDimClick - 딤 클릭 시 오버레이 닫기 여부 (기본값: true)
 * @param title - 오버레이 제목
 * @param description - 오버레이 설명 텍스트
 * @param confirmUI - 확인 버튼 텍스트/컴포넌트 (기본값: 'confirm')
 * @param cancelUI - 취소 버튼 텍스트/컴포넌트 (기본값: 'cancel')
 * @param isGlobal - 전역 포털 렌더링 여부 (기본값: false)
 * @param duration - 오버레이 애니메이션 지속 시간(ms) (기본값: 300)
 * @param footer - 오버레이 푸터
 * @param rejectOnCancel - 취소 버튼 클릭 시 Promise를 아예 실패시켜 openOverlay를 호출한 함수의 실행을 중단시키는 옵션
 * @returns 오버레이 옵션 인터페이스
 */
interface OverlayOptions {
  /** 오버레이 타입: 수평 드로어, 수직 드로어, 모달 */
  type?: 'drawer-horizontal' | 'drawer-vertical' | 'modal';
  /** 드로어 크기 (drawer-horizontal에만 적용) */
  size?: 'sm' | 'md';
  /** 배경 딤 표시 여부 */
  showDim?: boolean;
  /** 딤 클릭 시 오버레이 닫기 여부 */
  closeOnDimClick?: boolean;
  /** 오버레이 제목 */
  title?: React.ReactNode;
  /** 오버레이 설명 텍스트 */
  description?: React.ReactNode;
  /** 오버레이 푸터 */
  footer?: React.ReactElement;
  /** 확인 버튼 텍스트/컴포넌트 */
  confirmUI?: React.ReactNode;
  /** 취소 버튼 텍스트/컴포넌트 */
  cancelUI?: React.ReactNode;
  /** 전역 포털 렌더링 여부 */
  isGlobal?: boolean;
  /** 오버레이 애니메이션 지속 시간(ms) */
  duration?: number;
  /** 취소 버튼 클릭 시 Promise를 아예 실패시켜 openOverlay를 호출한 함수의 실행을 중단시키는 옵션 */
  rejectOnCancel?: boolean;
}

/*
 * openOverlay 함수가 요구하는 파라미터 타입
 */
interface IOverlay<T extends FunctionComponent<PropsOf<T>>> {
  component: T;
  props: Omit<PropsOf<T>, 'onConfirm' | 'onCancel' | 'children' | 'appeared'>;
  options?: OverlayOptions;
}

/**
 * IOverlay 함수를 확장하여 내부적으로 Promise의 resolve, reject 핸들러를 추가한 타입
 */
interface IOverlayPrivate<T extends FunctionComponent<PropsOf<T>>> extends IOverlay<T> {
  id: string;
  resolve: (result: unknown) => void;
  reject: () => void;
}

/**
 * 스토어의 addOverlay 메소드 타입
 */
type AddOverlay = <T extends FunctionComponent<PropsOf<T>>>(overlay: IOverlayPrivate<T>) => void;

/**
 * 스토어의 closeOverlay 메소드 타입
 */
type CloseOverlayById = (overlayId: string) => void;

interface OverlayStore {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  overlays: IOverlayPrivate<any>[];
  addOverlay: AddOverlay;
  closeOverlayById: CloseOverlayById;
}

type OverlayStoreApi = StoreApi<OverlayStore>;

/**
 * 각 패키지 앱별로 오버레이 스토어를 만들어서 개별 오버레이 컨텍스트를 가질 수 있게 해주는 함수 (각 앱의 App.tsx에서 사용하세요.)
 *
 * @returns 오버레이 스토어
 */
const createOverlayStore = (): OverlayStoreApi => {
  const overlayStore: OverlayStoreApi = create<OverlayStore>()(
    subscribeWithSelector((set) => ({
      overlays: [],
      addOverlay: (overlay) => {
        set((state) => ({
          overlays: [...state.overlays, overlay],
        }));
      },
      closeOverlayById: (overlayId: string) => {
        set((state) => ({
          overlays: state.overlays.filter((overlay) => overlay.id !== overlayId),
        }));
      },
    }))
  );

  return overlayStore;
};

export default createOverlayStore;
export type { IOverlay, IOverlayPrivate, OverlayOptions, OverlayStore, OverlayStoreApi, PropsOf };
