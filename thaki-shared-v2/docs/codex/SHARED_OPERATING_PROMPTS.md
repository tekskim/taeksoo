# Shared 운영 프롬프트

아래 프롬프트 블록 중 하나를 복사한 뒤 자리표시자를 바꿔서 사용한다. 이 문서의 프롬프트는 `thaki-shared`에서 직접 디자인 시스템 작업을 할 때 쓰는 용도다.

## 기본 Shared 저장소 프롬프트

```text
당신은 `thaki-shared` 저장소에서 직접 작업 중이다.

작업: <요청 붙여넣기>

규칙
- 먼저 `AGENTS.md`를 읽고, 그다음 수정 대상과 가장 가까운 관련 파일들을 확인한다.
- 이 저장소를 `@ThakiCloud/shared`로 배포되고 보통 `@thaki/shared`로 소비되는 독립적인 디자인 시스템 및 공용 유틸리티 패키지로 취급한다.
- public surface의 기준 문서는 `package.json` `exports`와 저장소 barrel 파일이다.
- 작업이 명시적으로 저장소 간 변경을 포함하지 않는 한 하위 소비자인 `thaki-ui` 변경을 지어내지 않는다.
- 경로는 저장소 상대 경로만 사용한다.

출력 계약
- 먼저 영향을 받는 대상이 component, token, provider, utility, export, Storybook 중 무엇인지 적는다.
- 확인한 파일과 수행한 변경을 요약한다.
- 소비자 영향, 배포 영향, `[unknown]` 항목을 함께 적는다.
- 각 검증 명령은 `pass | fail | skip + 이유` 형식으로 보고한다.

완결성 계약
- 작업이 요구하는 모든 로컬 레이어를 함께 반영한다: 구현, 스타일, 스토리, export, 문서, 생성 산출물.
- 근거 없이 새로운 패턴을 들여오기보다 기존 패키지 규칙을 유지한다.

검증 루프
- `pnpm lint`부터 시작한다.
- 소스, token, utility, provider, export 변경이 있으면 `pnpm build`를 실행한다.
- Storybook 화면이나 export된 UI 동작에 영향이 있으면 `pnpm build-storybook`을 실행한다.
- 무엇을 실행했고 왜 skip했는지 정확히 보고한다.
```

## 디자인 시스템 변경 프롬프트

```text
당신은 `thaki-shared`에서 직접 디자인 시스템 변경을 수행하고 있다.

작업: <component, token, style, provider, utility, Storybook 변경 내용 붙여넣기>

규칙
- `AGENTS.md`를 읽고, 수정 전에 가장 가까운 barrel/index, 대상 source 파일, 대응되는 `*.styles.ts`, 관련 story를 확인한다.
- 스타일링 또는 테마 동작이 바뀌면 `tokens/*.json`, `src/styles/tokens/tokens-*.css`, `tailwind.preset.js`, 그리고 이를 생성하는 generator script를 확인한다.
- public import는 `package.json` `exports`와 barrel 파일에 맞춘다.
- 토큰 우선 스타일링, CVA variant, `cn()`을 우선 사용한다.
- 이 저장소에 문서화된 provider 계약을 유지한다.

출력 계약
- 변경된 디자인 시스템 대상, 영향을 받는 소비자 동작, 수정한 파일, export/배포 영향을 반환한다.
- Storybook이나 생성된 token 산출물이 바뀌었는지도 적는다.
- 각 검증 명령은 `pass | fail | skip + 이유` 형식으로 보고한다.

완결성 계약
- 변경에 스타일, 스토리, token 원본, 생성 산출물, export, 문서가 함께 필요하면 한 component 파일만 수정하고 멈추지 않는다.
- 작업 범위는 `thaki-shared`로 유지한다. 하위 앱 수정은 명시적 요청이 없는 한 범위 밖이다.

검증 루프
- `pnpm lint`를 실행한다.
- `pnpm build`를 실행한다.
- 변경이 component, provider, Storybook에 보이는 동작에 영향을 주면 `pnpm build-storybook`을 실행한다.
```

## 공개 API 검토 프롬프트

```text
당신은 `thaki-shared`의 공개 표면 또는 배포 영향 변경을 검토하고 있다.

작업: <export, prop, CSS entrypoint, utility, 배포 영향 검토 요청 붙여넣기>

규칙
- 먼저 `AGENTS.md`, `package.json`, `src/index.ts`, 관련 barrel 파일을 읽는다.
- 변경이 배포나 소비자 채택에 영향을 줄 수 있으면 Storybook과 release workflow 파일도 확인한다.
- 확인된 로컬 패키지 변경과 추론한 하위 앱 영향을 분리해서 적는다.
- 경로는 저장소 상대 경로만 사용한다.

출력 계약
- 변경된 export 경로, 변경된 props/types, 변경된 CSS entrypoint, 변경된 utility를 포함한 공개 API 맵으로 시작한다.
- semver 위험도를 patch, minor, major, `[unknown]` 중 하나로 명시한다.
- Storybook 커버리지, 문서 공백, 하위 소비자 위험을 적는다.
- 각 검증 명령은 `pass | fail | skip + 이유` 형식으로 보고한다.

완결성 계약
- 변경이 닿는 전체 로컬 공개 표면을 검토한다: export, barrel 파일, story, 문서, 배포 관련 설정.
- 이 저장소 안에 직접 근거가 없으면 하위 호환성이 검증되었다고 말하지 않는다.

검증 루프
- `pnpm lint`를 실행한다.
- `pnpm build`를 실행한다.
- export된 UI 동작이나 CSS entrypoint에 영향이 있으면 `pnpm build-storybook`을 실행한다.
```
