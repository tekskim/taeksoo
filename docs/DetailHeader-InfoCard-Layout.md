# DetailHeader InfoCard 배치 규칙

## 개요

DetailHeader 컴포넌트 내 InfoCard들의 배치 규칙을 정의합니다.  
최대 12개의 카드를 지원하며, 카드 수에 따라 자동으로 레이아웃이 조정됩니다.

---

## 기본 원칙

1. **최대 4열** - 한 행에 최대 4개 카드 배치
2. **5개 예외** - 5개만 균등 분배 (3/2)
3. **첫 행 우선** - 6개 이상은 첫 행 4개 고정
4. **상단 밀집** - 3행일 때 상단 2행에 카드 집중 배치

---

## 디자인 토큰

| 속성 | 값 | CSS 변수 |
|---|---|---|
| 카드 간격 | 12px | `var(--primitive-spacing-3)` |
| 행 간격 | 12px | `var(--primitive-spacing-3)` |
| 카드 최소 너비 | 277px | - |
| 카드 패딩 | 12px 16px | `var(--primitive-spacing-3) var(--primitive-spacing-4)` |

---

## 배치 규칙

### 배치 표

| 카드 수 | 배치 | 규칙 |
|---|---|---|
| 1개 | `1` | 단일 |
| 2개 | `2` | 단일 |
| 3개 | `3` | 단일 |
| 4개 | `4` | 단일 (최대) |
| 5개 | `3 / 2` | 균등 분배 |
| 6개 | `4 / 2` | 첫 행 우선 |
| 7개 | `4 / 3` | 첫 행 우선 |
| 8개 | `4 / 4` | 첫 행 우선 |
| 9개 | `4 / 3 / 2` | 첫 행 우선 + 내림차순 |
| 10개 | `4 / 4 / 2` | 첫 행 우선 + 상단 밀집 |
| 11개 | `4 / 4 / 3` | 첫 행 우선 + 상단 밀집 |
| 12개 | `4 / 4 / 4` | 완전 균등 (3행) |

---

## 상세 규칙

### 1-4개: 단일 행
- 카드 수만큼 열 생성
- 모든 카드 동일 너비 (균등 분배)

### 5개: 균등 2행 분배
- 행 간 카드 수 차이 최소화
- **5개**: 3개 + 2개

### 6개: 첫 행 우선
- 첫 행 4개 고정
- **6개**: 4개 + 2개

### 7-8개: 첫 행 4개 우선
- 첫 행 4개 고정
- 나머지 두 번째 행에 배치
- **7개**: 4개 + 3개
- **8개**: 4개 + 4개 (완전 균등)

### 9-12개: 3행 분배
- 첫 행 4개 고정
- **9개**: 4/3/2 (내림차순 계단형)
- **10개**: 4/4/2 (상단 2행 밀집)
- **11개**: 4/4/3 (상단 2행 밀집)
- **12개**: 4/4/4 (완전 균등)

---

## 구현

### 배치 계산 함수

```typescript
/**
 * InfoCard 수에 따른 행별 배치를 계산합니다.
 * @param cardCount - 총 카드 수 (1-12)
 * @returns 각 행의 카드 수 배열
 */
function getInfoCardRowDistribution(cardCount: number): number[] {
  const distributions: Record<number, number[]> = {
    1: [1],
    2: [2],
    3: [3],
    4: [4],
    5: [3, 2],
    6: [4, 2],
    7: [4, 3],
    8: [4, 4],
    9: [4, 3, 2],
    10: [4, 4, 2],
    11: [4, 4, 3],
    12: [4, 4, 4],
  };
  
  return distributions[Math.min(cardCount, 12)] ?? [4, 4, 4];
}
```

### React 컴포넌트 예시

```tsx
interface InfoCard {
  id: string;
  label: string;
  value?: string;
  status?: 'active' | 'error' | 'muted' | 'building';
  copyable?: boolean;
}

interface InfoCardGridProps {
  cards: InfoCard[];
}

function InfoCardGrid({ cards }: InfoCardGridProps) {
  const distribution = getInfoCardRowDistribution(cards.length);
  let cardIndex = 0;
  
  return (
    <div className="flex flex-col gap-3">
      {distribution.map((count, rowIndex) => {
        const rowCards = cards.slice(cardIndex, cardIndex + count);
        cardIndex += count;
        
        return (
          <div 
            key={rowIndex}
            className="grid gap-3"
            style={{ gridTemplateColumns: `repeat(${count}, 1fr)` }}
          >
            {rowCards.map(card => (
              <DetailHeader.InfoCard 
                key={card.id}
                label={card.label}
                value={card.value}
                status={card.status}
                copyable={card.copyable}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}
```

### CSS 스타일

```css
.info-card-grid {
  display: flex;
  flex-direction: column;
  gap: 12px; /* var(--primitive-spacing-3) */
}

.info-card-row {
  display: grid;
  gap: 12px; /* var(--primitive-spacing-3) */
}

.info-card {
  min-width: 277px;
  padding: 12px 16px; /* var(--primitive-spacing-3) var(--primitive-spacing-4) */
}
```

---

## 사용 예시

### 기본 사용

```tsx
<DetailHeader>
  <DetailHeader.Title>Instance Name</DetailHeader.Title>
  
  <DetailHeader.InfoGrid>
    <DetailHeader.InfoCard label="Status" status="active" />
    <DetailHeader.InfoCard label="ID" value="i-1234567890" copyable />
    <DetailHeader.InfoCard label="Type" value="t3.medium" />
    <DetailHeader.InfoCard label="Region" value="ap-northeast-2" />
  </DetailHeader.InfoGrid>
</DetailHeader>
```

### 많은 카드 (10개)

```tsx
<DetailHeader.InfoGrid>
  <DetailHeader.InfoCard label="Status" status="active" />
  <DetailHeader.InfoCard label="ID" value="i-1234567890" copyable />
  <DetailHeader.InfoCard label="Type" value="t3.medium" />
  <DetailHeader.InfoCard label="Region" value="ap-northeast-2" />
  <DetailHeader.InfoCard label="VPC" value="vpc-12345" />
  <DetailHeader.InfoCard label="Subnet" value="subnet-67890" />
  <DetailHeader.InfoCard label="Security Group" value="sg-abcdef" />
  <DetailHeader.InfoCard label="Created" value="2024-01-15" />
  <DetailHeader.InfoCard label="Owner" value="admin@example.com" />
  <DetailHeader.InfoCard label="Cost" value="$45.00/month" />
</DetailHeader.InfoGrid>
```

위 예시는 4/4/2 배치로 렌더링됩니다:
- 1행: Status, ID, Type, Region
- 2행: VPC, Subnet, Security Group, Created
- 3행: Owner, Cost

---

## 버전 히스토리

| 버전 | 날짜 | 변경 내용 |
|---|---|---|
| 1.0.0 | 2026-02-03 | 초기 규칙 정의 |
| 1.0.1 | 2026-02-03 | 6개(4/2), 10개(4/4/2) 규칙 변경 |
| 1.1.0 | 2026-02-03 | 11개(4/4/3), 12개(4/4/4) 추가 |
| 1.1.1 | 2026-02-03 | 시각화 섹션 삭제 |
| 1.1.2 | 2026-02-03 | 기본 원칙 수정 |
| 1.1.3 | 2026-02-03 | 10개 사용 예시 수정 (4/4/2) |
