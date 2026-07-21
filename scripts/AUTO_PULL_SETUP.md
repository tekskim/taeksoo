# Main 브랜치 자동 Pull 설정 가이드

이 문서는 main 브랜치를 주기적으로 자동으로 pull하는 설정 방법을 설명합니다.

## 📋 개요

- **tekskim 브랜치**: 수동으로 `git pull` 실행
- **main 브랜치**: 자동으로 `origin/main`에서 pull (현재 설정: 1시간마다)

## 🚀 설정 방법

### 1. 스크립트 실행 권한 확인

스크립트는 이미 실행 권한이 부여되어 있습니다. 확인하려면:

```bash
ls -l scripts/auto-pull-main.sh
```

### 2. Launchd 서비스 등록

터미널에서 다음 명령어를 실행하세요:

```bash
# LaunchAgent 디렉토리 확인 (이미 생성되어 있음)
ls ~/Library/LaunchAgents/

# plist 파일 확인
ls ~/Library/LaunchAgents/com.auto-pull-main.plist

# 서비스 로드
launchctl load ~/Library/LaunchAgents/com.auto-pull-main.plist

# 서비스 시작
launchctl start com.auto-pull-main
```

### 3. 서비스 상태 확인

```bash
# 서비스 목록에서 확인
launchctl list | grep com.auto-pull-main

# 로그 확인
tail -f scripts/auto-pull-main.log
```

## ⚙️ 실행 주기 변경

### 추천 주기

| 주기 | 초 | 용도 |
|------|-----|------|
| **30분** | 1800 | 개발 중 빠른 피드백 필요 |
| **1시간** | 3600 | 일반적인 사용 (현재 설정) ⭐ |
| **2시간** | 7200 | 덜 자주 확인해도 될 때 |
| **24시간** | 86400 | 하루에 한 번만 확인 |

### 주기 변경 방법

1. `~/Library/LaunchAgents/com.auto-pull-main.plist` 파일 열기
2. `<integer>3600</integer>` 값을 원하는 초 단위로 변경
3. 서비스 재시작:

```bash
# 서비스 언로드
launchctl unload ~/Library/LaunchAgents/com.auto-pull-main.plist

# 서비스 다시 로드
launchctl load ~/Library/LaunchAgents/com.auto-pull-main.plist
```

## 🔔 알림 기능

스크립트는 다음 상황에서 macOS 알림을 표시합니다:

- ✅ **Pull 성공 + 변경사항 있음**: "main 브랜치 업데이트 완료 (N개 커밋)"
- ⚠️ **Uncommitted changes**: "Uncommitted changes로 인해 pull 건너뜀"
- ❌ **Pull 실패**: "main 브랜치 pull 실패 - 로그 확인 필요"
- ⚠️ **브랜치 복귀 실패**: "원래 브랜치로 복귀 실패"

> **참고**: 변경사항이 없을 때는 알림을 보내지 않습니다 (불필요한 알림 방지).

## 📝 로그 파일

- **상세 로그**: `scripts/auto-pull-main.log`
- **표준 출력**: `scripts/auto-pull-main.out.log`
- **에러 로그**: `scripts/auto-pull-main.err.log`

모든 로그 파일은 `.gitignore`에 추가되어 Git에 커밋되지 않습니다.

## 🛠️ 서비스 관리 명령어

```bash
# 서비스 상태 확인
launchctl list | grep com.auto-pull-main

# 서비스 중지
launchctl stop com.auto-pull-main

# 서비스 시작
launchctl start com.auto-pull-main

# 서비스 언로드 (제거)
launchctl unload ~/Library/LaunchAgents/com.auto-pull-main.plist

# 서비스 다시 로드
launchctl load ~/Library/LaunchAgents/com.auto-pull-main.plist
```

## ⚠️ 주의사항

1. **Uncommitted changes**: 
   - 현재 브랜치에 커밋되지 않은 변경사항이 있으면 main 브랜치로 체크아웃할 수 없습니다.
   - 이 경우 pull을 건너뛰고 알림을 보냅니다.

2. **브랜치 전환**:
   - 스크립트는 main 브랜치로 체크아웃 → pull → 원래 브랜치로 복귀합니다.
   - tekskim 브랜치에서 작업 중이어도 자동으로 원래 브랜치로 돌아옵니다.

3. **충돌 발생 시**:
   - Pull 중 충돌이 발생하면 수동으로 해결해야 합니다.
   - 로그 파일을 확인하여 문제를 파악하세요.

## 🧪 테스트

스크립트를 수동으로 테스트하려면:

```bash
# 스크립트 직접 실행
./scripts/auto-pull-main.sh

# 로그 확인
tail -f scripts/auto-pull-main.log
```

## 📚 참고

- Launchd는 macOS의 시스템 레벨 작업 스케줄러입니다.
- `~/Library/LaunchAgents/`는 사용자 레벨 서비스를 위한 디렉토리입니다.
- 서비스는 로그인 시 자동으로 시작됩니다.
