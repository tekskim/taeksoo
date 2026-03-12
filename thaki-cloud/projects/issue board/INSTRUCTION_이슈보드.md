# Issue Board 문서 작성 Instruction

## 목적

**Thaki Cloud Product Requirement**에 맞춰 업무 보드의 **Epic**, **Story**, **Task**를 작성합니다.

---

## 계층 구조

| 레벨 | 설명 |
|------|------|
| **Epic** | 큰 단위의 기능/목표. 배경·목적과 핵심 요구사항으로 정의합니다. |
| **Story** | 사용자 관점의 기능 단위. 인수 조건(Acceptance Criteria)으로 완료를 판단합니다. |
| **Task** | Story를 구현하기 위한 구체 작업. 한 명이 수행 가능한 단위입니다. |

---

## Epic 템플릿

업무 보드에 등록할 Epic은 아래 필드를 채워 작성합니다.

| 필드 | 설명 |
|------|------|
| Work type | epic |
| Feature | 소속 기능/영역 |
| Status | Backlog / To Do / In Progress / Done 등 |
| Reporter | 담당자 |
| Label | 태그(선택) |

**본문 필수 항목**

1. **배경 및 목적**  
   이 Epic이 왜 필요한지, 어떤 문제를 해결하는지 간단히 씁니다.

2. **핵심 요구사항**  
   반드시 만족해야 할 요구사항을 나열합니다.

**관련 문서**  
   기획서, 정책서, 기능 명세서 등 링크 또는 경로를 적습니다.

---

### Epic 마크다운 예시

```markdown
# [Epic명] Epic

## 메타정보
| 항목 | 내용 |
|------|------|
| Work type | epic |
| Feature | (기능 영역) |
| Status | Backlog |
| Reporter | (담당자) |
| Label | (선택) |

## 1. 배경 및 목적
(2~4문장)

## 2. 핵심 요구사항
- 요구사항 1
- 요구사항 2

## 관련 문서
- (문서명 또는 링크)
```

---

## Story 템플릿

Story는 Epic 하위의 사용자 가치 단위입니다.

| 필드 | 설명 |
|------|------|
| Work type | story |
| Feature | 소속 기능/영역 |
| Status | Backlog / To Do / In Progress / Done 등 |
| Reporter | 담당자 |
| Label | 태그(선택) |

**본문 필수 항목**

- **요구사항 (Acceptance Criteria)**  
  “~이면 완료”라고 판단할 수 있는 조건을 나열합니다.

- **기획 문서**  
  해당 Story와 연결된 기획서/명세 링크 또는 경로를 적습니다.

---

### Story 마크다운 예시

```markdown
# [Story명] Story

## 메타정보
| 항목 | 내용 |
|------|------|
| Work type | story |
| Feature | (기능 영역) |
| Status | Backlog |
| Reporter | (담당자) |
| Label | (선택) |

## 요구사항 (Acceptance Criteria)
- [ ] 조건 1
- [ ] 조건 2
- [ ] 조건 3

## 기획 문서
- (문서명 또는 링크)
```

---

## Task 템플릿

Task는 Story를 구현하기 위한 구체 작업입니다. 한 사람이 맡아 수행할 수 있는 크기로 나눕니다.

| 필드 | 설명 |
|------|------|
| Work type | task |
| Feature | 소속 기능/영역 |
| Status | Backlog / To Do / In Progress / Done 등 |
| Reporter | 담당자 |
| Parent | 상위 Story (또는 Epic) |

**본문 필수 항목**

- **작업 내용**  
  무엇을 할지 한 문장으로 요약합니다.

- **상세 절차 또는 체크리스트**  
  단계별로 무엇을 하면 되는지 나열합니다.

---

### Task 마크다운 예시

```markdown
# [Task명] Task

## 메타정보
| 항목 | 내용 |
|------|------|
| Work type | task |
| Feature | (기능 영역) |
| Status | Backlog |
| Reporter | (담당자) |
| Parent | (Story명 또는 링크) |

## 작업 내용
(한 문장 요약)

## 상세 절차 / 체크리스트
- [ ] 단계 1
- [ ] 단계 2
```

---

## 작성 원칙

1. **Product Requirement 정렬**  
   Epic·Story·Task는 Thaki Cloud 제품 요구사항 및 기획 문서와 맞춰 작성합니다.

2. **계층 유지**  
   Epic → Story → Task 순으로 포함 관계를 명시합니다. Task에는 Parent(Story)를 반드시 적습니다.

3. **완료 기준 명확화**  
   Story는 Acceptance Criteria, Task는 체크리스트로 “완료”를 판단할 수 있게 씁니다.

4. **문서 연결**  
   Epic/Story에는 관련 기획 문서를 “관련 문서” 또는 “기획 문서”에 링크해 둡니다.

---

## 참고

- Epic·Story 필드 구조: `story.pdf`, `epic.pdf` 템플릿 기준
- 저장 위치: `thaki-cloud/projects/issue board/` 내 마크다운(.md) 파일
