# Planning Mockup — Claude Code Instructions

이 프로젝트에서 작업하기 전에 반드시 **[prerequisite.md](prerequisite.md)** 를 읽으세요.

TDS 컴포넌트 사용 규칙, 테이블 컬럼 너비 정책, 페이지 레이아웃 패턴, 참조 페이지 목록이 정리되어 있습니다.

---

## 개발 흐름 라우팅 (어느 도구가 어느 단계를 맡나)

**핵심 규칙**: 계획→구현→검증이 도는 **실행 루프는 GSD 하나로 통일**한다. superpowers·gstack은 GSD가 약한 앞단(리서치·발산)만 보조한다. **세 도구를 실행 루프 안에서 섞지 않는다** — 겹치면 지시가 충돌한다.

| 단계                          | 주도 도구         | 부르는 법                                               | 메모                                                                                                                                                                        |
| ----------------------------- | ----------------- | ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 리서치 (경쟁·기술 조사)       | **deep-research** | `/deep-research`                                        | 넓은 웹 조사+교차검증(Rancher 등 참고 제품). 아는 페이지의 표적 수집만 gstack `scrape`/`browse`. ⚠gstack `investigate`는 리서치가 아니라 버그 디버깅 스킬(2026-07-21 확인). |
| 발산 (무엇을 왜 만드나)       | **superpowers**   | `/brainstorming`                                        | 요구사항이 흐릿할 때만. 질문을 하나씩 던져 정리 → 짧은 설계 문서.                                                                                                           |
| 계획 심문 (협의 전 모의 반박) | **gstack**        | `/plan-ceo-review` · `/plan-eng-review` (+design/devex) | 세운 가설·계획을 CEO/개발 리더 관점에서 두들겨 약점을 미리 찾는다. 수집(리서치)이 아니라 검증.                                                                              |
| 로드맵·페이즈 계획            | **GSD**           | `/gsd:plan-phase`                                       | 이미 `.planning/ROADMAP.md`로 진행 중.                                                                                                                                      |
| 스펙 명확화                   | **GSD**           | `/gsd:spec-phase` · `/gsd:discuss-phase`                | 무엇을 만들지 확정.                                                                                                                                                         |
| 프로토타입 구현               | **GSD**           | `/gsd:execute-phase`                                    | 목업 + inline TS mock + TDS.                                                                                                                                                |
| 검증 (목업 실제 확인)         | **GSD**           | `/gsd:verify-work`                                      | 화면을 실제로 띄워 눈으로 확인.                                                                                                                                             |
| 디버깅                        | **GSD**           | `/gsd:debug`                                            | superpowers의 systematic-debugging과 겹치므로 GSD로 통일.                                                                                                                   |
| 회고·학습                     | **GSD**           | `/gsd:extract-learnings`                                | 배운 걸 규칙으로.                                                                                                                                                           |

**주의**: superpowers를 켜두면 착수할 때마다 `brainstorming`이 먼저 튀어나오려 한다. 이 프로젝트는 GSD가 실행을 주도하므로, **발산이 필요할 때만 직접 `/brainstorming`을 부르고**, 나머지 단계는 위 표의 GSD 슬래시 명령으로 지정한다.
