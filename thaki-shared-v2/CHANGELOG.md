# [1.9.0](https://github.com/ThakiCloud/thaki-shared/compare/v1.8.3...v1.9.0) (2026-03-17)

### Bug Fixes

- **Stepper,TcAccordion:** minor updates ([d3e74e1](https://github.com/ThakiCloud/thaki-shared/commit/d3e74e1894c4048a6e40458109d5929c16c583a7))
- **Stepper:** accessibility, editStep state, onComplete mount guard ([7e67634](https://github.com/ThakiCloud/thaki-shared/commit/7e676346dba9c8a95e8750cb968cf3b0f91f7773))
- **Stepper:** call onCancel on Skip ([403bf12](https://github.com/ThakiCloud/thaki-shared/commit/403bf123c6acc252cd94132e958e78a2c68face6))
- **Stepper:** cancel edit reverts step, focuses next writing/uncompleted ([319862f](https://github.com/ThakiCloud/thaki-shared/commit/319862fccb9db590a0b5f9d63f0b5a7af404312c))
- **Stepper:** open completed steps on mount with defaultOpenedId ([3e2f987](https://github.com/ThakiCloud/thaki-shared/commit/3e2f98705083b318eed4c114b282714ce208146a))
- **Stepper:** use span for label instead of Typography.Text ([a758005](https://github.com/ThakiCloud/thaki-shared/commit/a75800533414f1981d4d2fa03e7a2fbca372a63b))
- **TcAccordion:** improve controlled mode initialization and sync ([58ccbb7](https://github.com/ThakiCloud/thaki-shared/commit/58ccbb72bf5211287ef323edce91176a6cf738ca))
- **TcAccordion:** refine content transition and handle scrollHeight edge case ([78ea133](https://github.com/ThakiCloud/thaki-shared/commit/78ea13305cce7baff8386d1230d552515ab7b2e8))
- **TcAccordion:** refine group sync and controlled mode logic ([b3ddd8c](https://github.com/ThakiCloud/thaki-shared/commit/b3ddd8c0a79be7d16efd73d6c85d0ab89f042316))
- **TcAccordion:** require id in group, document single-select init behavior ([4fe2fd9](https://github.com/ThakiCloud/thaki-shared/commit/4fe2fd981f4f87918ffa03686337c5b617eeb33e))
- **TcAccordion:** use state for content height to ensure correct animation ([e93be43](https://github.com/ThakiCloud/thaki-shared/commit/e93be43b4a763dd1e3bfac0756737375a93f4208))

### Features

- **Stepper:** add default styles and Edit button ([d1034f9](https://github.com/ThakiCloud/thaki-shared/commit/d1034f9ea3ba6f8fe4cca629b40679ae70b8325a))
- **Stepper:** add isStepAccessible to gate step navigation ([dba764a](https://github.com/ThakiCloud/thaki-shared/commit/dba764a53d745bc48219d387b4b5a944c55d0640))
- **Stepper:** add localeText prop for i18n ([9027801](https://github.com/ThakiCloud/thaki-shared/commit/90278016173a8ca1b42f2dcad249252c4c90cee1))
- **Stepper:** add multi-step form component with accordion ([127dcd0](https://github.com/ThakiCloud/thaki-shared/commit/127dcd080eb8d55e016837d3ecca5fd87dad056f))
- **Stepper:** add skip step support and not configured badge ([70acf14](https://github.com/ThakiCloud/thaki-shared/commit/70acf14da5f91b7347bd002925f91b046b81a19e))
- **Stepper:** multi-open mode, simplify callbacks, refine styles ([98751b3](https://github.com/ThakiCloud/thaki-shared/commit/98751b3b962a50e02fda63be2a4ea8a215872b01))
- **Stepper:** skip-completed mode — fill gaps, broader accessibility ([bf6446b](https://github.com/ThakiCloud/thaki-shared/commit/bf6446bfb46f5ebd869545dc0eafb1e923097c1f))
- **TcAccordion:** add default visual styles and polish animations ([0569955](https://github.com/ThakiCloud/thaki-shared/commit/0569955136a82d6309180f2f7e66070a074d114a))
- **TcAccordion:** add single-select mode and improve animations ([78a301f](https://github.com/ThakiCloud/thaki-shared/commit/78a301f8deb37d90558191398cb632b1c7cf57be))
- **TcAccordion:** add TcAccordion component ([84551d1](https://github.com/ThakiCloud/thaki-shared/commit/84551d19daa3df68d65be083b67edd6b96062ff8))

## [1.8.3](https://github.com/ThakiCloud/thaki-shared/compare/v1.8.2...v1.8.3) (2026-03-16)

### Bug Fixes

- 버그 수정 ([085e408](https://github.com/ThakiCloud/thaki-shared/commit/085e40828bb48eed8683001750c86a5c6be529f3))

## [1.8.2](https://github.com/ThakiCloud/thaki-shared/compare/v1.8.1...v1.8.2) (2026-03-16)

### Bug Fixes

- dropdpwn 수정 ([9af98c2](https://github.com/ThakiCloud/thaki-shared/commit/9af98c2d1ecd7a48a2e14dee44cbd4590b8f807b))

## [1.8.1](https://github.com/ThakiCloud/thaki-shared/compare/v1.8.0...v1.8.1) (2026-03-16)

### Bug Fixes

- **security:** escape html in chartTooltipHtml and upgrade DOMPurify to 3.3.3 ([df7faff](https://github.com/ThakiCloud/thaki-shared/commit/df7faff223678f2a7347ca38656cc291802540b4))

# [1.8.0](https://github.com/ThakiCloud/thaki-shared/compare/v1.7.0...v1.8.0) (2026-03-16)

### Features

- **auth:** add logout intent helpers for LoginPage redirect prevention ([d4f8638](https://github.com/ThakiCloud/thaki-shared/commit/d4f8638d8a4fa8d3e406f4e97b51c04d9f4bd409))

# [1.7.0](https://github.com/ThakiCloud/thaki-shared/compare/v1.6.0...v1.7.0) (2026-03-13)

### Features

- **Portal:** migrate to native Popover API + CSS Anchor Positioning ([87f25f1](https://github.com/ThakiCloud/thaki-shared/commit/87f25f14b355455872fe613e0b406997571429fa))

# [1.6.0](https://github.com/ThakiCloud/thaki-shared/compare/v1.5.1...v1.6.0) (2026-03-12)

### Bug Fixes

- **auth:** add silentOnError to logout mutation ([fd5e7bd](https://github.com/ThakiCloud/thaki-shared/commit/fd5e7bd25a86d5d5d91d10ca17451bf719d23db4))
- **auth:** restore optional params for refresh token and logout for hybrid auth ([7d20a09](https://github.com/ThakiCloud/thaki-shared/commit/7d20a09ca156fe8d7bbc1fa80727c01ffaf2de47))

### Features

- **auth:** restore storage handling for login and logout ([2ce75e3](https://github.com/ThakiCloud/thaki-shared/commit/2ce75e320ee349184136d2999683f09d36f3b875))
- **auth:** switch auth client to cookie-based, update logout and refresh token ([743f559](https://github.com/ThakiCloud/thaki-shared/commit/743f5596be517047079059c7ea393ef719341dc7))

## [1.5.1](https://github.com/ThakiCloud/thaki-shared/compare/v1.5.0...v1.5.1) (2026-03-12)

### Bug Fixes

- make action modal autofocus opt-in ([bd8d554](https://github.com/ThakiCloud/thaki-shared/commit/bd8d55427a6a3e8eac8d778b7661a2abaa93933a))
- restore action modal autofocus default ([30fbcb4](https://github.com/ThakiCloud/thaki-shared/commit/30fbcb4994cc86f8b547daa16e16eb0b1b838386))
- sidebar 수정 ([271fcc7](https://github.com/ThakiCloud/thaki-shared/commit/271fcc7942af6c14bdbcb1286bf21631a9a2e3a7))

# [1.5.0](https://github.com/ThakiCloud/thaki-shared/compare/v1.4.2...v1.5.0) (2026-03-12)

### Bug Fixes

- **Tabs:** keep default size as md ([81ab491](https://github.com/ThakiCloud/thaki-shared/commit/81ab491fb88197a6d6286376e1c239139372d755))

### Features

- **Tabs:** refine button variant sizing and design tokens ([21086ed](https://github.com/ThakiCloud/thaki-shared/commit/21086ed7a9bc32dfe2f2ab73baf090e5151f8fff))

## [1.4.2](https://github.com/ThakiCloud/thaki-shared/compare/v1.4.1...v1.4.2) (2026-03-12)

### Bug Fixes

- remove development export conditions pointing to unpublished src/ ([0025c93](https://github.com/ThakiCloud/thaki-shared/commit/0025c93d314e97fad09feeeaffae60fbb62af699))

## [1.4.1](https://github.com/ThakiCloud/thaki-shared/compare/v1.4.0...v1.4.1) (2026-03-10)

### Bug Fixes

- **Input:** restore design token for input border ([ca27470](https://github.com/ThakiCloud/thaki-shared/commit/ca27470f6d64beeee9e04bbac797b0d4e19b25c4))

# [1.4.0](https://github.com/ThakiCloud/thaki-shared/compare/v1.3.1...v1.4.0) (2026-03-10)

### Features

- agents 개발 ([f946b63](https://github.com/ThakiCloud/thaki-shared/commit/f946b6354d83118f54c03dc04ab151b3edcfebc9))

## [1.3.1](https://github.com/ThakiCloud/thaki-shared/compare/v1.3.0...v1.3.1) (2026-03-09)

### Bug Fixes

- **auth:** disable throwOnError for MFA OTP setup mutation ([58865a6](https://github.com/ThakiCloud/thaki-shared/commit/58865a6e9250ae68f55731e58c3aca492ec743b3))

# [1.3.0](https://github.com/ThakiCloud/thaki-shared/compare/v1.2.0...v1.3.0) (2026-03-09)

### Features

- **TcTable:** add sticky last column option ([ed5cd05](https://github.com/ThakiCloud/thaki-shared/commit/ed5cd05ac6b5374377e06b76aea5ad9e04d76fe3))

# [1.2.0](https://github.com/ThakiCloud/thaki-shared/compare/v1.1.1...v1.2.0) (2026-03-05)

### Features

- **icon:** migrate SVG pipeline to @svgr/webpack build-time compilation ([142ef1c](https://github.com/ThakiCloud/thaki-shared/commit/142ef1c17938feb1a823df5ad7e91c2d5c8a4900))

## [1.1.1](https://github.com/ThakiCloud/thaki-shared/compare/v1.1.0...v1.1.1) (2026-02-27)

### Bug Fixes

- **TcTable:** guard against undefined selectedValues in sync ([045bbb3](https://github.com/ThakiCloud/thaki-shared/commit/045bbb3e9bf27d72e6adcd4edcf520ef46fd00d4))

# [1.1.0](https://github.com/ThakiCloud/thaki-shared/compare/v1.0.6...v1.1.0) (2026-02-26)

### Bug Fixes

- **ci:** correct dispatch target repo name ([8438133](https://github.com/ThakiCloud/thaki-shared/commit/843813349c87498e7737b3da367e1a90dfe3b236))

### Features

- **ci:** migrate from changesets to semantic-release with commitlint ([423c456](https://github.com/ThakiCloud/thaki-shared/commit/423c4560aabe945b326ee94c09bf57d94b85ab80))

# @ThakiCloud/shared

## 1.0.6

### Patch Changes

- [#13](https://github.com/ThakiCloud/thaki-shared/pull/13) [`c9436e8`](https://github.com/ThakiCloud/thaki-shared/commit/c9436e8ae923619acb7b7c64f3803543e259cb0a) Thanks [@byunghoon-kang](https://github.com/byunghoon-kang)! - Include xterm CSS in core.css so Terminal renders correctly in published package consumers

## 1.0.5

### Patch Changes

- [#11](https://github.com/ThakiCloud/thaki-shared/pull/11) [`fe64e74`](https://github.com/ThakiCloud/thaki-shared/commit/fe64e7482b8fe252ad43cd1c3c9753cc1cc33218) Thanks [@seoyeonkkk](https://github.com/seoyeonkkk)! - Floating Card Icon 수정

## 1.0.4

### Patch Changes

- [#7](https://github.com/ThakiCloud/thaki-shared/pull/7) [`98f3158`](https://github.com/ThakiCloud/thaki-shared/commit/98f315808de76192bdfb764f75870bb1a8cdf3bc) Thanks [@byunghoon-kang](https://github.com/byunghoon-kang)! - Rename WebSocket auth query parameter from `token` to `wsstoken`

## 1.0.3

### Patch Changes

- [`d55595b`](https://github.com/ThakiCloud/thaki-shared/commit/d55595b31452e9e327e2495ce7ab32c12f407676) Thanks [@byunghoon-kang](https://github.com/byunghoon-kang)! - Fix authClient to resolve API_GATEWAY_URL lazily at runtime instead of at module load time. This prevents crashes when the package is consumed as a pre-built npm package where build-time env vars are not available.
