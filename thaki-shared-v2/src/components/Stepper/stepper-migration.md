# Legacy Step Flow -> Stepper 마이그레이션 가이드

> `UserGroupCreatePage` 실전 코드 기준의 단계별 전환 가이드.
> 대상: 수동 step 상태 관리(섹션 토글, 버튼 분기, 임시 원복 상태) 코드를 `Stepper`로 통합하려는 경우.

---

## 목차

1. [임포트 변경](#1-임포트-변경)
2. [Step 구조 정의](#2-step-구조-정의)
3. [onComplete 검증/커밋 패턴](#3-oncomplete-검증커밋-패턴)
4. [onCancel 원복 패턴](#4-oncancel-원복-패턴)
5. [dependsOn 무효화 연결](#5-dependson-무효화-연결)
6. [완료 UI와 편집 UI 분리](#6-완료-ui와-편집-ui-분리)
7. [RHF 입력 바인딩 패턴](#7-rhf-입력-바인딩-패턴)
8. [Step 변경 이벤트 사용](#8-step-변경-이벤트-사용)
9. [실전 주의사항 (시행착오 정리)](#9-실전-주의사항-시행착오-정리)
10. [체크리스트](#10-마이그레이션-체크리스트)
11. [강제 적용 프로토콜](#11-강제-적용-프로토콜)
12. [Props 요약](#12-props-요약)

---

## 1. 임포트 변경

`Stepper`는 반드시 shared public API에서 임포트한다.

```tsx
// Before (로컬/상대경로 직접 참조)
import { Stepper } from '../../../../../../thaki-shared/src/components';

// After (권장)
import { Stepper } from '@thaki/shared';
```

---

## 2. Step 구조 정의

핵심은 `stepIds` 순서 + `children` 설정의 일치다.

```tsx
<Stepper
  stepIds={['basicInfo', 'addUsers']}
  defaultOpenedId="basicInfo"
>
  {[
    {
      id: 'basicInfo',
      label: t('userGroupCreate.section.basicInfo'),
      onComplete: handleBasicInfoNext,
      onCancel: handleBasicInfoCancel,
      editUI: <BasicInformationForm ... />,
      doneUI: <DetailCard ... />,
    },
    {
      id: 'addUsers',
      label: t('userGroupCreate.section.addUsers'),
      onComplete: handleUsersNext,
      onCancel: handleUsersCancel,
      editUI: <AddUsersForm ... />,
      doneUI: <DetailCard ... />,
    },
  ]}
</Stepper>
```

규칙:

- `stepIds`와 `children[].id`는 반드시 1:1로 매칭
- `stepIds` 순서가 실제 진행 순서
- `defaultOpenedId` 이전 step은 초기 완료 상태로 간주됨
- 불필요한 중간 상수/타입(`SectionId`, `SECTION_ORDER`) 생성보다 `stepIds={['a', 'b']}` 리터럴 전달을 우선
- `children={...}` prop 패턴 대신 `<Stepper>...</Stepper>` 중첩 패턴을 사용

---

## 3. onComplete 검증/커밋 패턴

`onComplete`는 "현재 step을 완료할 수 있는가"를 반환하는 guard다.  
`Stepper`는 동기/비동기 모두 지원하므로 RHF 기반 폼에서는 `async + await trigger(...)`를 최종 게이트로 사용하는 것을 권장한다.

> **Rule:** RHF 기반 Stepper 단계에서 `onComplete`의 최종 validation 판정은 `await trigger(...)` 결과만 사용한다.  
> `getValues(...).trim()` 기반 수동 필수값 체크나, `getFieldState(...).invalid` 재판정으로 이중 검증하지 않는다.
>
> **Required Rule:** 검증 규칙은 반드시 `Controller`의 `rules`/`validate`에 선언한다.  
> `onComplete`에서는 검증 로직을 재구현하지 않고, `await trigger(...)`로 최종 확인만 수행한다.

```tsx
const handleBasicInfoNext = useCallback(async (): Promise<boolean> => {
  const isValid = await trigger(['name', 'description']);
  if (!isValid) return false;

  // "현재 값"을 commit 기준값으로 승격
  resetField('name', { defaultValue: getValues('name') ?? '' });
  resetField('description', { defaultValue: getValues('description') ?? '' });
  return true;
}, [getValues, resetField, trigger]);
```

권장:

- validation 실패 시 `false` 반환
- 성공 시 `resetField(...defaultValue)`로 cancel 기준점 갱신
- RHF 필드 검증의 최종 판정은 `await trigger(...)` 결과를 단일 소스로 사용

---

## 4. onCancel 원복 패턴

`Stepper`의 `onCancel`은 step 상태를 되돌리지만, 실제 form 데이터 원복은 호출자가 처리해야 한다.

```tsx
const handleUsersNext = useCallback((): boolean => {
  // commit 기준값 갱신 (react-hook-form defaultValue 재설정)
  resetField('userIds', { defaultValue: Object.keys(userSelections) });
  setValue('userIds', Object.keys(userSelections), { shouldValidate: true, shouldDirty: true });
  return true;
}, [resetField, setValue, userSelections]);

const handleUsersCancel = useCallback((): void => {
  // 직전 commit(default)으로 원복
  resetField('userIds');
}, [resetField, setValue]);
```

중요:

- `onCancel` 미구현 시 UI step은 닫히더라도 실제 form 값은 원복되지 않을 수 있음
- **react-hook-form 필드는 ref 없이 관리 가능**:  
  `onComplete`에서 `resetField(name, { defaultValue: current })`로 커밋하고,  
  `onCancel`에서 `resetField(name)`로 복원
- RHF 밖 상태(예: 독립 useState selection map)는 필요 시 별도 저장 전략이 필요

---

## 5. dependsOn 무효화 연결

앞 step 수정 시 뒤 step을 다시 입력받아야 하면 `dependsOn`을 사용한다.

> **주의 (중요): `dependsOn`은 기본값이 아니다.**  
> 명시된 요구사항(기획/QA 시나리오/사용자 지시)이 없는 경우 임의로 추가하지 않는다.

```tsx
{
  id: 'addUsers',
  dependsOn: ['basicInfo'],
  ...
}
```

동작:

- `basicInfo`를 다시 edit하면 `addUsers` 완료 상태가 해제됨
- 필요 시 `onCancel`에서 각 step의 데이터 원복 책임을 유지해야 함
- 요구사항에 "앞 step 변경 시 뒤 step 재입력"이 명시되지 않으면 `dependsOn` 없이 유지

---

## 6. 완료 UI와 편집 UI 분리

`Stepper`는 step별로 두 화면을 분리한다:

- `editUI`: 편집 중 화면
- `doneUI`: 완료 후 요약 화면

`UserGroupCreatePage`처럼 `doneUI`에 `DetailCard`를 사용하면 확인/재편집 UX를 단순하게 유지할 수 있다.

실전 권장:

- `editUI` 내부 폼 컴포넌트의 자체 Next/Cancel 버튼은 제거하고,
- Step 전환은 `Stepper` 헤더/푸터 액션(`Complete`, `Apply`, `Cancel`)을 단일 소스로 사용
- 즉, `editUI`는 입력 UI만 담당하고 이동 로직은 `Stepper`의 `onComplete`/`onCancel`로 집중

### `showActions` / `onComplete` 정리 기준

카드 컴포넌트가 재사용되는 경우(예: Stepper 화면 + 레거시 화면 공존)라면 다음 기준으로 유지한다.

- `showActions`:
  - Stepper `editUI`에서 **필수** (`showActions={false}`)  
    → 카드 내부 버튼과 Stepper 버튼 중복 방지
  - `doneUI`에서는 **불필요** (완료 화면에 액션 버튼이 없으면 전달하지 않아도 됨)
- `onComplete`:
  - `showActions=true` 경로(레거시/비-Stepper 화면)가 남아 있으면 **유지**
  - Stepper 전용으로 완전 전환되어 내부 액션이 영구 제거되면 **제거 가능**

---

## 7. RHF 입력 바인딩 패턴

Stepper 마이그레이션 시 취소/원복 안정성을 높이려면 RHF 표준 바인딩을 우선한다.

> **핵심 원칙 (중요): `Controller`를 기본값으로 사용한다.**  
> 특히 `Input`, `Dropdown`, `RadioGroup`, `Range`, 테이블 선택값처럼 제어형 입력은  
> `watch()+setValue` 직접 갱신보다 `Controller`/`useController`를 우선 적용한다.

### 왜 `Controller`를 기본값으로 쓰는가

- cancel/apply 시점의 원복 기준(`resetField`)이 안정적으로 동작함
- Stepper의 `onComplete`/`onCancel` 전이와 RHF 필드 상태가 쉽게 일치함
- 로컬 상태와 RHF 값의 이중 소스 드리프트를 줄일 수 있음
- 완료 화면(`doneUI`)과 편집 화면(`editUI`)의 값 불일치 회귀를 예방함
- FormProvider를 쓰는 페이지에서는 `useFormContext` 기반으로 제어해 prop drilling(`control`, `errors`)을 줄일 수 있음

### 권장 전환 순서

1. 기존 `watch + setValue` 기반 입력을 찾는다.
2. 입력을 `Controller`(또는 `useController`)로 감싼다.
3. 값 변경은 `field.onChange`, blur는 `field.onBlur`로 연결한다.
4. step 완료 시 `resetField(name, { defaultValue: current })`로 commit 기준을 갱신한다.
5. step 취소 시 `resetField(name)`으로 직전 commit 기준으로 복원한다.

```tsx
<Controller
  name="name"
  control={control}
  render={({ field }) => (
    <Input
      value={field.value ?? ''}
      onChange={(e) => field.onChange(e.target.value)}
      onBlur={field.onBlur}
      error={Boolean(errors.name)}
    />
  )}
/>
```

권장:

- 문자열/선택 입력은 `watch()+setValue` 직접 갱신보다 `Controller` + `field.onChange` **기본 적용**
- 숫자 입력은 `Controller`에서 변환 처리 (`'' -> undefined`, 숫자 변환) 후 `field.onChange` 호출
- `setValue`는 RHF 외부 상태 동기화가 필요한 경우(예: 독립 selection map)로 제한
- 레거시 `watch()+setValue`가 남아 있다면 Stepper 마이그레이션 완료 조건으로 보지 않음
- **선택 메타데이터(예: `{id, name}` 매핑)도 가능하면 RHF 필드로 관리**하고, 페이지 로컬 상태/`useRef` 이중 소스를 만들지 않음
- 동일 도메인 값을 RHF에 2개 이상 필드로 중복 저장하지 않음 (예: `userIds`와 `selectedUsers` 동시 canonical 관리 금지)
- 중복 필드가 불가피하면 canonical 1개를 명시하고, 나머지는 파생값으로만 계산
- FormProvider가 이미 감싸고 있다면 하위 폼은 `useFormContext`를 우선하고 `control` prop 주입은 예외 사유가 있을 때만 사용

---

## 8. Step 변경 이벤트 사용

`Stepper`는 `onStepChange`를 지원한다.

```tsx
<Stepper
  ...
  onStepChange={({ prev, current }) => {
    // analytics / side-effect
  }}
/>
```

보장:

- 실제로 step이 `prev -> current`로 바뀔 때만 호출
- all complete 시점(다음 step 없음)에는 호출되지 않음

---

## 9. 실전 주의사항 (시행착오 정리)

아래 항목은 실제 마이그레이션 중 자주 발생한 회귀 패턴이다.
각 항목은 체크리스트/프로토콜의 실패 케이스로 간주한다.

1. **`resetField`가 안 먹는 것처럼 보이는 경우**

- 원인: 필드를 RHF에 정식 등록하지 않고 `watch + setValue`로만 운용
- 증상: `onCancel`에서 `resetField(name)` 호출해도 UI가 이전 값으로 복원되지 않음
- 해결:
  - 입력 컴포넌트는 `Controller`/`useController`로 등록
  - 라디오/토글/테이블 선택값 같은 비표준 입력도 `useController({ name, control })`로 등록 후 사용

2. **RHF 값 + 로컬 `useState` 이중 소스**

- 원인: 동일 필드를 RHF와 로컬 상태가 동시에 관리
- 증상: cancel/apply 후 표시값 드리프트, step done 요약과 edit 값 불일치
- 해결:
  - 폼 값의 단일 소스를 RHF로 고정
  - 로컬 상태는 API 필터, UI 탭처럼 폼과 무관한 값에만 사용

3. **`onStepChange`에서 임의 후속 step 상태 변경**

- 원인: Stepper 내부 상태와 별도로 페이지 로컬 완료 상태를 과하게 조작
- 증상: 편집 후 cancel 시 생성 버튼 비활성화/요약 상태 불일치
- 해결:
  - `onStepChange`는 현재 step 관찰/부수효과 용도로 최소 사용
  - 후속 step 무효화가 요구사항에 명시된 경우에만 `dependsOn`을 사용
  - 요구사항 명시가 없으면 `dependsOn`을 추가하지 않고 step 독립성을 유지
  - 로컬 완료 상태가 필요하면 Stepper 전이 규칙과 동일하게만 갱신

4. **Stepper 액션과 카드 내부 액션 중복**

- 원인: `editUI` 내부 Next/Cancel 버튼 유지
- 증상: 동일 단계에 액션 버튼이 2세트 노출, 서로 다른 검증/커밋 경로
- 해결:
  - Stepper 전용 화면은 내부 액션 제거
  - 재사용이 필요하면 `showActions`로 legacy 경로만 유지하고 Stepper 경로는 비활성화

5. **FormProvider 사용 중 불필요한 prop 주입**

- 원인: 이미 `FormProvider`로 감싼 상태에서 `control`, `errors`를 여러 depth로 전달
- 증상: 컴포넌트 인터페이스 비대화, 마이그레이션 중 타입/props churn 증가
- 해결:
  - 하위 폼/위젯은 `useFormContext` + `Controller/useController`를 우선 사용
  - prop 주입이 필요한 경우(완전 독립 폼 컴포넌트 재사용 등) 예외 사유를 명시

6. **`dependsOn` 과사용**

- 원인: 요구사항 명시 없이 관성적으로 후속 step에 `dependsOn` 추가
- 증상: 사용자가 의도하지 않은 완료 해제/재입력 강제, UX 회귀
- 해결:
  - `dependsOn`은 "앞 step 수정 시 뒤 step 재입력"이 명시된 경우에만 적용
  - 명시가 없으면 step 독립성을 유지하고 `onCancel`/`resetField` 원복 규칙으로 처리

7. **체크리스트/프로토콜 미매핑 상태에서 바로 구현**

- 원인: 문서를 읽기만 하고 항목별 적용 위치를 사전 매핑하지 않음
- 증상: `Controller`, `useFormContext`, `dependsOn` 조건 같은 핵심 규칙 누락 반복
- 해결:
  - 코드 수정 전에 체크리스트 항목별 반영 위치를 먼저 기록
  - 구현/리뷰 완료 시 `적용됨 | 예외 | 해당없음` 기록이 없으면 완료로 처리하지 않음

8. **동일 값의 RHF 중복 canonical 관리**

- 원인: 같은 도메인 값을 서로 다른 RHF 필드에 동시에 source of truth로 저장
- 증상: 완료 화면 값과 submit payload 불일치, cancel/apply 시점 드리프트
- 해결:
  - canonical 필드 1개만 source of truth로 유지
  - 나머지 값은 렌더/submit 시점 파생 계산으로 처리
  - 중복 필드가 필요한 경우 canonical/derived 역할을 코드 코멘트로 명시

---

## 10. 마이그레이션 체크리스트

**게이트 체크 (필수): 아래 항목 중 하나라도 미충족이면 마이그레이션 완료로 판단하지 않는다.**

- [ ] `Stepper`를 `@thaki/shared`에서 임포트
- [ ] `stepIds`와 `children[].id` 1:1 정합성 확인
- [ ] `stepIds`는 불필요한 중간 상수/타입 없이 리터럴 전달 우선
- [ ] `children={...}` 대신 `<Stepper>...</Stepper>` 중첩 패턴 사용
- [ ] 각 step에 `onComplete` 추가 (검증 실패 시 `false`)
- [ ] 각 step에 `onCancel` 추가 (데이터 원복 책임 구현)
- [ ] commit 기준값이 필요한 필드는 `resetField(...defaultValue)` 반영
- [ ] `onCancel`은 `resetField(name)`로 직전 commit(default) 기준 원복 확인
- [ ] 검증 규칙은 `Controller`의 `rules`/`validate`에 선언하고, `onComplete`에서는 `await trigger(...)`로 최종 확인만 수행 (매우 중요!!!)
- [ ] `editUI`에서 내부 액션 버튼이 남아 있다면 `showActions={false}`로 중복 액션 방지
- [ ] `doneUI`의 불필요한 `showActions` 전달 제거(완료 화면에서 no-op인 경우)
- [ ] `onComplete`는 내부 액션 경로가 남은 카드만 유지, Stepper 전용 카드에서는 제거 검토
- [ ] **RHF 입력은 `Controller` + `field.onChange`로 연결 (`watch()+setValue` 직접 갱신 제거 또는 예외 사유 명시)**
- [ ] 선택 메타데이터(예: `{id, name}`)도 가능하면 RHF 필드로 관리하여 로컬 상태 이중 소스 방지
- [ ] 동일 도메인 값의 RHF canonical 필드는 1개만 유지 (중복 필드는 derived로만 사용)
- [ ] FormProvider 사용 시 하위 폼은 `useFormContext` 우선 (`control` prop 주입은 예외 사유 명시)
- [ ] 의존 관계 step은 요구사항에 명시된 경우에만 `dependsOn`으로 연결
- [ ] `doneUI`에서 `'-'` fallback 등 표시 정책 준수
- [ ] 필요 시 `onStepChange`로 전환 이벤트 수집
- [ ] lint/타입 에러 확인

---

## 11. 강제 적용 프로토콜

아래 프로토콜은 "권장"이 아니라 **필수**다.

1. **사전 매핑 (코드 수정 전)**

- 체크리스트 각 항목에 대해 "어느 파일/어느 필드에 어떻게 반영할지"를 먼저 매핑한다.

```md
### 사전 매핑 템플릿

- 항목:
- 적용 위치(파일/심볼):
- 적용 방식(핵심 구현):
- 예외 여부(없음/있음):
- 예외 사유:
```

2. **구현 (코드 수정 중)**

- 사전 매핑한 체크리스트 항목을 기준으로 순서대로 반영한다.
- 구현 중 설계가 바뀌면 체크리스트 매핑도 즉시 갱신한다.

3. **예외 처리**

- 체크리스트 항목을 그대로 충족하지 못하는 경우에만 예외를 사용한다.
- 예외를 쓸 때는 코드/리뷰 코멘트에 사유와 대체 통제를 함께 명시한다.

4. **완료 판정 (머지/리뷰 전)**

- 체크리스트 항목별로 `적용됨 | 예외(사유) | 해당없음(근거)`를 기록한다.
- 이 기록이 없으면 완료로 간주하지 않는다.

```md
### 완료 증빙 템플릿

- 항목:
  - 상태: 적용됨 | 예외 | 해당없음
  - 근거(파일/심볼):
  - 메모:
```

---

## 12. Props 요약

| Prop                  | 목적                                                          |
| --------------------- | ------------------------------------------------------------- |
| `stepIds`             | Step 진행 순서 정의                                           |
| `defaultOpenedId`     | 초기 진입 step 지정                                           |
| `children`            | step별 label/editUI/doneUI/onComplete/onCancel/dependsOn 구성 |
| `onAllStepsCompleted` | 모든 step 완료 전이 시 1회 호출                               |
| `onStepChange`        | step 스위칭 시 호출 (`prev`, `current`)                       |
