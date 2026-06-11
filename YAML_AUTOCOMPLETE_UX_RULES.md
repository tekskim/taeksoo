# YAML 에디터 자동완성 화면 규칙

> App Catalog — Values.yaml 탭, 백엔드 알고 있는 값 기반 인라인 제안 UX

---

## 배경

- Basic Information에서 앱별 Config 폼 UI를 제거하고, 모든 앱별 설정은 Values.yaml 에디터에서 직접 편집하는 방향으로 확정
- 일부 필드(StorageClass, Kafka 버전 등)는 백엔드가 이미 알고 있는 값들이 존재하므로, 에디터 내 인라인 자동완성으로 UX를 보완

---

## 1. 제안 대상 필드 — 소스 분류

| 소스 유형             | 필드 예시                                              | 특징                                |
| --------------------- | ------------------------------------------------------ | ----------------------------------- |
| **Cluster 동적 조회** | `storageClass`, `namespace`                            | `kubectl get sc / ns`로 실시간 조회 |
| **Catalog 버전 목록** | `kafka.version`, `cluster.imageName`                   | Operator 지원 버전 목록             |
| **고정 Enum**         | `primaryUpdateStrategy`, `poolMode`, `imagePullPolicy` | 빌드타임 정적 목록                  |

> **자동완성 제외 대상**: 패스워드, 앱 이름, 커스텀 호스트명, S3 엔드포인트 등 사용자 정의값

---

## 2. 발동 규칙 (Trigger)

VS Code IntelliSense 패턴을 따름. 커서 위치 고정이 아니라 **타이핑 중 실시간 필터링**이 핵심.

| 발동 방식              | 조건                                                            |
| ---------------------- | --------------------------------------------------------------- |
| **자동 발동 (타이핑)** | 값 위치에서 첫 문자 입력 시 — suggestion schema 등록 key에 한함 |
| **수동 발동**          | `Ctrl+Space` — 빈 값에서 전체 목록 보기, 또는 동적 조회 강제    |
| **발동 안함**          | `password`, `secret`, `name` 관련 key                           |

**타이핑 중 동작:**

- 입력한 문자를 prefix로 목록 실시간 필터링
- 더 타이핑할수록 목록이 좁혀짐 (예: `lon` → `longhorn`만 남음)
- 일치하는 항목이 없으면 드롭다운 자동 닫힘
- 등록되지 않은 key는 일반 텍스트 편집 유지

---

## 3. 표시 규칙 (Display)

```
storageClass: "lon│ghorn"
              ┌──────────────────────────┐
              │ ● longhorn   [cluster]   │  ← 1순위 항목 (ghost text 미리보기)
              │   long-fast  [cluster]   │
              └──────────────────────────┘
```

**Ghost text (인라인 미리보기):**

- 드롭다운 1순위 항목이 커서 뒤에 흐릿하게 미리 표시 (VS Code 동일)
- `Tab` 누르면 ghost text가 실제 값으로 확정

**드롭다운:**

- 커서 라인 **바로 아래** 인라인 표시
- 최대 6개 표시, 이후 스크롤
- 각 항목: `값` + `출처 레이블` (cluster / catalog / enum)
- 타이핑으로 필터된 결과는 **매칭 문자 강조** (bold 또는 색상)
- 로딩 중: 스피너 + "목록 불러오는 중..."

---

## 4. 수락/거절 상호작용

| 키/동작         | 결과                                 |
| --------------- | ------------------------------------ |
| `Enter` / `Tab` | 선택 항목 삽입 (YAML 타입 자동 처리) |
| `↑` / `↓`       | 항목 이동                            |
| `Esc`           | 드롭다운 닫기, 원본 값 유지          |
| 영역 외 클릭    | 닫기                                 |

---

## 5. YAML 타입 자동 처리

값 삽입 시 YAML 타입에 맞게 자동 포맷:

```yaml
# string → 따옴표 감싸기
storageClass: 'standard'

# boolean → 따옴표 없음
enableSuperuserAccess: true

# integer → 따옴표 없음
instances: 3
```

> suggestion schema에 `type` 정보 포함 필수

---

## 6. 에러 / 엣지 케이스

| 상황                  | 표시                                            |
| --------------------- | ----------------------------------------------- |
| 클러스터 조회 실패    | "클러스터 연결이 필요합니다" (회색 안내 텍스트) |
| 목록이 비어있음       | "사용 가능한 옵션 없음"                         |
| 로딩 중               | 스피너 + "목록 불러오는 중..."                  |
| Target Cluster 미선택 | 동적 조회 비활성, Enum만 제공                   |

---

## 7. Backend 계약 — Suggestion Schema 구조

tenant-values.yaml과 함께 제공:

```json
{
  "STORAGE_CLASS": {
    "source": "cluster.storageClasses",
    "type": "string"
  },
  "KAFKA_VERSION": {
    "source": "catalog.kafka.supportedVersions",
    "type": "string"
  },
  "PRIMARY_UPDATE_STRATEGY": {
    "source": "enum",
    "values": ["unsupervised", "supervised"],
    "type": "string"
  }
}
```

---

## 핵심 원칙

1. **비침습적** — 자유 편집 방해 없음. 자동완성은 보조 수단
2. **범위 제한** — 백엔드가 이미 아는 값에만 제안. 사용자 정의 시크릿/이름 제외
3. **타입 안전** — 삽입 시 YAML 타입에 맞게 자동 포맷
4. **출처 투명성** — 어디서 온 값인지 레이블로 명시 (cluster / catalog / enum)
