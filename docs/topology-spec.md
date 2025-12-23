# 🌐 Network Topology Visualization

> 클라우드 네트워크 인프라를 시각적으로 표현하고 관리하는 토폴로지 뷰어

---

## 📋 개요

### 목적
- 복잡한 네트워크 인프라 구조를 직관적으로 시각화
- 리소스 간 연결 관계를 한눈에 파악
- 장애 발생 시 영향 범위 빠르게 식별

### 대상 사용자
- 클라우드 인프라 관리자
- 네트워크 엔지니어
- DevOps 팀

---

## 🏗️ 네트워크 계층 구조

```
┌─────────────────────────────────────────────────────────────┐
│                    External Network                          │
│                  (ISP/Cloud Provider)                        │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                        Router                                │
│              (Edge Router / Internal Router)                 │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    VPC (Network)                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                     Subnet                            │   │
│  │         (Web / App / Data / Management)               │   │
│  └─────────────────────────┬────────────────────────────┘   │
│                            │                                 │
│                            ▼                                 │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                  Load Balancer                        │   │
│  │            (HTTP/HTTPS/TCP Traffic)                   │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 노드 타입별 디자인

### 1. External Network (외부 네트워크)
| 속성 | 값 |
|------|-----|
| 아이콘 | 🌐 Globe |
| 노드 크기 | 64px |
| 색상 (Active) | `#3b82f6` (Blue) |
| 색상 (Inactive) | `#93c5fd` (Light Blue) |
| 색상 (Error) | `#ef4444` (Red) |

### 2. Router (라우터)
| 속성 | 값 |
|------|-----|
| 아이콘 | ↔️ Arrows |
| 노드 크기 | 56px |
| 색상 (Active) | `#6366f1` (Indigo) |
| 색상 (Inactive) | `#a5b4fc` (Light Indigo) |
| 색상 (Error) | `#ef4444` (Red) |

### 3. Subnet (서브넷)
| 속성 | 값 |
|------|-----|
| 아이콘 | ⬡ Dots |
| 노드 크기 | 48px |
| 색상 (Active) | `#14b8a6` (Teal) |
| 색상 (Inactive) | `#5eead4` (Light Teal) |
| 색상 (Error) | `#ef4444` (Red) |

### 4. Load Balancer (로드밸런서)
| 속성 | 값 |
|------|-----|
| 아이콘 | ⚖️ Balance |
| 노드 크기 | 40px |
| 색상 (Active) | `#eab308` (Yellow) |
| 색상 (Inactive) | `#fde047` (Light Yellow) |
| 색상 (Error) | `#ef4444` (Red) |

### 5. VPC Panel (VPC 영역)
| 속성 | 값 |
|------|-----|
| 배경색 (Active) | `#f0fdfa` (Light Teal BG) |
| 테두리 (Active) | `#5eead4` (Teal Border) |
| 테두리 스타일 | Dashed (6,4) |
| 라운드 | 12px |

---

## 🔍 Semantic Zoom (레벨별 상세도)

줌 레벨에 따라 표시 정보량을 자동 조절하여 성능과 가독성 최적화

| 줌 레벨 | 표시 내용 | 상태 표시 |
|---------|----------|----------|
| **≥ 100%** | 아이콘 + 이름 + 상태 + CIDR/VIP | 🟢 Full |
| **60-100%** | 아이콘 + 이름만 | 🟡 Medium |
| **< 60%** | 아이콘만 (Compact) | ⚪ Compact |

### 구현 세부사항
- 줌 범위: 0.3x ~ 2.0x
- 전환 애니메이션: 150ms
- CSS 클래스 기반 표시/숨김 제어

---

## 💬 팝오버 (Popover) 상세

### 공통 구조
```
┌─────────────────────────────────────┐
│ [이름]                          ✕  │  ← 드래그 가능한 헤더
├─────────────────────────────────────┤
│ Status:              Available      │
│ Name:                [링크] ↗       │
│ ID:                  abc123 📋      │
│ Admin State:         Up             │
├─────────────────────────────────────┤
│ ▼ [섹션명] (N)         View detail  │  ← 접이식 섹션
│ ─────────────────────────────────── │
│ 🟢 info        item-name ↗         │
│ 🔴 info        item-name ↗         │
│ ⚪ info        item-name ↗         │
└─────────────────────────────────────┘
```

### 노드 타입별 팝오버 내용

#### External Network
| 필드 | 설명 |
|------|------|
| Status | Available / Inactive / Error |
| Name | 네트워크 이름 (링크) |
| ID | 고유 식별자 (복사 가능) |
| Admin State | Up / Down |
| **▼ Routers** | 연결된 라우터 목록 |

#### Router
| 필드 | 설명 |
|------|------|
| Status | Available / Inactive / Error |
| Name | 라우터 이름 (링크) |
| ID | 고유 식별자 (복사 가능) |
| SNAT | On / Off |
| External Gateway | 연결된 외부 네트워크 |
| **▼ Subnets** | 연결된 서브넷 목록 (CIDR 포함) |

#### Subnet
| 필드 | 설명 |
|------|------|
| Status | Available / Inactive / Error |
| Name | 서브넷 이름 (링크) |
| ID | 고유 식별자 (복사 가능) |
| Gateway IP | 게이트웨이 IP (복사 가능) |
| CIDR | 네트워크 대역 (복사 가능) |
| **▼ Routers** | 연결된 라우터 목록 |
| **▼ Instances** | 서브넷 내 인스턴스 목록 (IP 포함) |
| **▼ Load Balancers** | 연결된 LB 목록 (VIP 포함) |

#### Load Balancer
| 필드 | 설명 |
|------|------|
| Status | Available / Inactive / Error |
| Name | LB 이름 (링크) |
| ID | 고유 식별자 (복사 가능) |
| VIP | Virtual IP (복사 가능) |
| Floating IP | 플로팅 IP (복사 가능) |
| **▼ Listeners** | 리스너 목록 (Protocol:Port) |
| **▼ Health Monitor** | 멤버 상태 요약 + Pool 목록 |

#### VPC (Network)
| 필드 | 설명 |
|------|------|
| Status | Available / Inactive / Error |
| Name | VPC 이름 (링크) |
| ID | 고유 식별자 (복사 가능) |
| Shared | On / Off |
| MTU | Maximum Transmission Unit |
| **▼ Subnets** | 라우터별 그룹화된 서브넷 목록 |

---

## 🔎 필터링 기능

### 필터 UI
```
┌──────────────────────────────────────────────────────────────────────┐
│ [🔍 Search subnets, VPCs, CIDRs...]  [Router ▼]  [VPC ▼]  [Status ▼] │
└──────────────────────────────────────────────────────────────────────┘
```

| 필터 | 타입 | 너비 | 설명 |
|------|------|------|------|
| Search | 텍스트 입력 | 240px | 서브넷, VPC, CIDR 검색 |
| Router | 드롭다운 | 160px | 특정 라우터 필터 |
| VPC | 드롭다운 | 160px | 특정 VPC 필터 |
| Status | 드롭다운 | 120px | Active / Inactive / Error |

### 필터 동작
- **OR 조건**: 검색어는 이름, CIDR 모두에 적용
- **AND 조건**: 필터 간에는 AND 조건으로 결합
- **실시간 반영**: 필터 변경 즉시 토폴로지 업데이트
- **Reset 버튼**: 필터 적용 시 초기화 버튼 표시

---

## 🗺️ 미니맵

### 기능
- 전체 토폴로지의 축소 뷰 제공
- 현재 뷰포트 위치 표시 (점선 사각형)
- 줌/패닝에 따라 실시간 업데이트

### 사양
| 속성 | 값 |
|------|-----|
| 크기 | 180px × 120px |
| 위치 | 우측 하단 고정 |
| 배경 | 반투명 흰색 |
| 테두리 | 1px solid slate-200 |

---

## ⚡ 인터랙션

### 줌 & 패닝
| 동작 | 인터랙션 |
|------|---------|
| 줌 인/아웃 | 마우스 휠 스크롤 |
| 패닝 | 드래그 앤 드롭 |
| 초기 뷰 | 자동 Fit to Content |

### 노드 인터랙션
| 동작 | 인터랙션 |
|------|---------|
| Hover | 노드 확대 (1.08x) + 툴팁 표시 |
| Click | 팝오버 표시 |
| 팝오버 드래그 | 헤더 영역 드래그로 이동 |

### 툴팁
- 노드 호버 시 표시
- 내용: 이름, 타입, 상태, 추가 정보 (CIDR/VIP)
- 마우스 따라다니는 위치

---

## 🎯 상태 표시

### 상태별 색상
| 상태 | 색상 | Hex |
|------|------|-----|
| Active | 🟢 Green | `#22c55e` |
| Inactive | ⚪ Gray | `#94a3b8` |
| Error | 🔴 Red | `#ef4444` |

### Health Monitor 상태 (Load Balancer)
| 상태 | 색상 | 설명 |
|------|------|------|
| Healthy | 🟢 Green | 정상 동작 |
| Degraded | 🟠 Orange | 일부 이상 |
| Error | 🔴 Red | 장애 발생 |

---

## 📊 통계 표시

상단 헤더에 필터링된 결과 통계 표시:

```
Network Topology
Showing 25 of 30 subnets across 11 VPCs • 23 active • 2 error • 5 LBs
```

---

## 🔧 기술 스택

| 영역 | 기술 |
|------|------|
| 렌더링 | D3.js |
| 레이아웃 | 커스텀 계층 레이아웃 |
| 상태 관리 | React useState/useMemo |
| 스타일링 | Tailwind CSS |
| 아이콘 | Tabler Icons |

---

## 📱 반응형 고려사항

| 뷰포트 | 동작 |
|--------|------|
| Desktop | 전체 기능 지원 |
| Tablet | 미니맵 축소, 터치 줌/패닝 |
| Mobile | 가로 스크롤, 단순화된 뷰 |

---

## 🚀 향후 개선 사항

### Phase 2
- [ ] 실시간 상태 업데이트 (WebSocket)
- [ ] 노드 선택 및 다중 선택
- [ ] 연결 경로 하이라이트
- [ ] 검색 결과 노드 하이라이트

### Phase 3
- [ ] 토폴로지 내보내기 (PNG/SVG)
- [ ] 커스텀 레이아웃 저장
- [ ] 알람 연동 및 시각화
- [ ] 트래픽 플로우 애니메이션

---

## 📝 네이밍 컨벤션

### 리소스 네이밍 패턴
```
[env]-[region]-[type]-[purpose]-[az/seq]
```

| 세그먼트 | 예시 | 설명 |
|----------|------|------|
| env | prod, stg, dev | 환경 |
| region | apne2, usw2 | 리전 코드 |
| type | web, app, data | 용도 |
| purpose | edge, int | 세부 용도 |
| seq | 001, a | 시퀀스/AZ |

### 예시
- `prod-apne2-web-001` - 프로덕션 서울 웹 서브넷
- `rtr-prod-apne2-edge-001` - 프로덕션 서울 엣지 라우터
- `vpc-stg-apne2-001` - 스테이징 서울 VPC




