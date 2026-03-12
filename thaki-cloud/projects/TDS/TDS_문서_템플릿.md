# TDS 문서 템플릿 (복사용)

아래는 Foundation / Component / Pattern별 **마크다운 템플릿**입니다.  
문서 유형에 맞는 블록을 복사한 뒤 내용을 채워 넣고, 조건부 섹션은 필요 시만 포함하세요.

---

## A. Foundation — 원칙형

```markdown
# [항목명] (원칙형 Foundation)

## 메타정보
| 항목 | 내용 |
|------|------|
| 구분 | Foundation (원칙형) |
| 상태 | |
| 담당 | |

## Overview
(해당 Foundation의 정의와 목적을 2~4문장으로 작성)

## Principles
(설계 의사결정 근거, 원칙 나열)

## Usage Guidelines
(해당 시에만) Do / Don't

## Related
- (관련 Foundation / Component / Pattern)
```

---

## B. Foundation — 스펙형

```markdown
# [항목명] (스펙형 Foundation)

## 메타정보
| 항목 | 내용 |
|------|------|
| 구분 | Foundation (스펙형) |
| 상태 | |
| 담당 | |

## Overview
(해당 Foundation의 정의와 목적)

## Principles
(해당 시) 설계 의사결정 근거

## Tokens / Scale
(수치·토큰·색상값·스케일 표 등)

## Usage Guidelines
Do / Don't

## Related
- (관련 문서)
```

---

## C. Component

```markdown
# [컴포넌트명]

## 메타정보
| 항목 | 내용 |
|------|------|
| 구분 | Component |
| 기획 담당 | |
| 디자인 담당자 | |
| 상태 | |
| 우선순위 | |

## Overview
(정의)  
(When to use / When not to use)

## Variants
(조건부: 2가지 이상 형태가 있을 때)

| 구분 | 설명 |
|------|------|
| | |

## Composition (구성 요소)
| 요소 | 설명 |
|------|------|
| | |

## States
(조건부: 사용자 상호작용이 있을 때)

## Behavior
(조건부: 전환·반응형 등 시간적 변화가 있을 때)

## Usage Guidelines (Do / Don't)
- Do: …
- Don't: …

## Content Guidelines
(조건부: 레이블·텍스트 결정이 있을 때)

## Related
- (관련 Component / Pattern)
```

---

## D. Pattern

```markdown
# [패턴명]

## 메타정보
| 항목 | 내용 |
|------|------|
| 구분 | Pattern |
| 상태 | |
| 담당 | |

## Overview
(문제 정의)  
(When to use / When not to use)

## Composition (구성 요소)
| 요소 | 설명 |
|------|------|
| | |

## Behavior & Flow
(사용자 흐름 + 엣지 케이스)

## Usage Guidelines (Do / Don't + 안티패턴)
- Do: …
- Don't: …
- 안티패턴: …

## Accessibility
(접근성 요구사항)

## Content Guidelines
(조건부: 사용자 읽기/작성 텍스트가 있을 때)

## Related
- (관련 문서)
```

---

*가이드라인: `INSTRUCTION_TDS_문서가이드라인.md` 참고*
