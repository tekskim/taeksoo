# TDS Design Sync (Orchestrator)

TDS 디자인을 thaki-shared 컴포넌트에 반영하는 전체 파이프라인을 자동 실행하는 오케스트레이터 스킬입니다.
단일 컴포넌트 또는 배치 모드(복수 컴포넌트)를 지원합니다.

## 트리거

- "디자인 싱크", "design sync", "싱크해줘", "배치 싱크"
- 컴포넌트명과 함께: "Button 싱크해줘", "Button, Badge, Chip 디자인 싱크해줘"

## 입력

- **컴포넌트명**: 1개 또는 콤마 구분 리스트
- 예: `"Button"` 또는 `"Button, Badge, Chip, StatusIndicator"`

## 참조 파일

- `component-map.md`: 이 폴더 내 TDS ↔ thaki-shared 매핑
- `token-map.md`: 이 폴더 내 토큰 네이밍 매핑
- `specs/`: 추출된 디자인 스펙 저장 위치

## 동작 절차

### Step 1: 입력 파싱

사용자 메시지에서 컴포넌트명 추출:

- 단일: "Button 싱크해줘" → `["Button"]`
- 배치: "Button, Badge, Chip 싱크해줘" → `["Button", "Badge", "Chip"]`
- Phase 단위: "Phase 1 싱크해줘" → component-map.md의 Phase 1 컴포넌트 목록

### Step 2: 매핑 확인

`component-map.md`에서 각 컴포넌트의:

- TDS 경로 확인
- thaki-shared 대응 경로 확인
- 매핑 상태 확인 (1:1 / partial / none)

미대응(`none`) 컴포넌트는 경고 후 건너뛰기.

### Step 3: 컴포넌트별 순차 실행

각 컴포넌트에 대해 3단계를 순차 실행합니다:

#### (a) Extract — tds-design-extract 스킬 절차 실행

1. `.cursor/skills/tds-design-extract/SKILL.md` 절차에 따라 실행
2. TDS 컴포넌트의 디자인 스펙 추출
3. `specs/{ComponentName}.md` 생성
4. 추출 완료 알림 (자동 진행)

#### (b) Apply — tds-design-apply 스킬 절차 실행

1. `.cursor/skills/tds-design-apply/SKILL.md` 절차에 따라 실행
2. Pre-flight 리포트 생성
3. **사용자 확인 대기** ← 유일한 수동 개입 포인트
4. 승인 시 적용 실행

#### (c) Evaluate — tds-design-evaluate 스킬 절차 실행

1. `.cursor/skills/tds-design-evaluate/SKILL.md` 절차에 따라 실행
2. 시각적 비교 Canvas 생성
3. 금지 변경 검증
4. 기능 검증 (빌드, 타입 체크)
5. 평가 리포트 출력

### Step 4: 결과 처리

#### PASS인 경우

- 다음 컴포넌트로 자동 진행
- 진행 상황 표시: `[2/5] Badge 시작...`

#### FAIL인 경우

사용자에게 선택지 제시:

1. **수정 후 재시도**: 문제 수정 → Evaluate 재실행
2. **건너뛰기**: 해당 컴포넌트 SKIP 처리 → 다음으로
3. **중단**: 전체 배치 중단

### Step 5: 전체 완료 리포트

모든 컴포넌트 처리 후:

```markdown
## Batch Sync Report

### 처리 결과

| #   | 컴포넌트        | 결과    | 비고                           |
| --- | --------------- | ------- | ------------------------------ |
| 1   | Button          | ✅ PASS |                                |
| 2   | Badge           | ✅ PASS |                                |
| 3   | Chip            | ⏭️ SKIP | 시각적 불일치 — 수동 조정 필요 |
| 4   | StatusIndicator | ✅ PASS |                                |

### 변경 파일 총 목록

- `src/components/Button/Button.styles.ts`
- `src/components/Badge/Badge.styles.ts`
- `src/components/StatusIndicator/StatusIndicator.styles.ts`
- `tokens/light.json` (3개 토큰 값 변경)

### 다음 단계

- SKIP된 컴포넌트: Chip — 수동 확인 후 개별 싱크 필요
```

## 진행 상황 표시

배치 실행 중 진행 상황을 지속적으로 알립니다:

```
[1/4] Button — Extract 진행 중...
[1/4] Button — Extract 완료. Apply Pre-flight 리포트:
(Pre-flight 리포트 표시)
→ 확인해주세요.

(사용자 확인 후)
[1/4] Button — Apply 완료. Evaluate 진행 중...
[1/4] Button — ✅ PASS

[2/4] Badge — Extract 진행 중...
...
```

## 개별 스킬 독립 실행

오케스트레이터 없이도 각 스킬을 독립 실행할 수 있습니다:

| 명령                            | 실행 스킬             |
| ------------------------------- | --------------------- |
| "Button 디자인 추출해줘"        | tds-design-extract만  |
| "Button 디자인 적용해줘"        | tds-design-apply만    |
| "Button 디자인 검증해줘"        | tds-design-evaluate만 |
| "Button 디자인 싱크해줘"        | 오케스트레이터 (전체) |
| "Button, Badge 디자인 싱크해줘" | 오케스트레이터 (배치) |
