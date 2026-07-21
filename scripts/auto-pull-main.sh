#!/bin/bash

# main 브랜치 자동 pull 스크립트
# origin/main의 변경사항을 로컬 main 브랜치로 자동으로 가져옵니다.

REPO_PATH="/Users/taeksoo.kim/Documents/planning_files/myRepository"
LOG_FILE="$REPO_PATH/scripts/auto-pull-main.log"

# 로그 디렉토리 확인
mkdir -p "$(dirname "$LOG_FILE")"

# 로그 함수
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

# macOS 알림 함수
notify() {
    local title="$1"
    local message="$2"
    osascript -e "display notification \"$message\" with title \"$title\"" 2>/dev/null
}

log "=== Auto-pull 시작 ==="

cd "$REPO_PATH" || {
    log "❌ Repository 경로로 이동 실패: $REPO_PATH"
    notify "Git Auto-Pull" "Repository 경로 오류"
    exit 1
}

# 현재 브랜치 저장
CURRENT_BRANCH=$(git branch --show-current)
log "현재 브랜치: $CURRENT_BRANCH"

# Uncommitted changes 확인
if ! git diff-index --quiet HEAD -- 2>/dev/null; then
    log "⚠️  Uncommitted changes가 있습니다. main 브랜치로 체크아웃할 수 없습니다."
    log "   현재 작업 내용을 커밋하거나 stash하세요."
    notify "Git Auto-Pull" "Uncommitted changes로 인해 pull 건너뜀"
    exit 0
fi

# main 브랜치로 체크아웃
log "main 브랜치로 체크아웃 중..."
git checkout main 2>&1 | tee -a "$LOG_FILE"
if [ $? -ne 0 ]; then
    log "❌ main 브랜치로 체크아웃 실패"
    notify "Git Auto-Pull" "main 브랜치 체크아웃 실패"
    exit 1
fi

# Pull 전 커밋 해시 저장
BEFORE_COMMIT=$(git rev-parse HEAD)
BEFORE_COMMIT_SHORT=$(git rev-parse --short HEAD)

# origin/main에서 pull
log "origin/main에서 pull 중..."
PULL_OUTPUT=$(git pull origin main --no-rebase 2>&1)
PULL_EXIT_CODE=$?

echo "$PULL_OUTPUT" | tee -a "$LOG_FILE"

# Pull 후 커밋 해시 확인
AFTER_COMMIT=$(git rev-parse HEAD)
AFTER_COMMIT_SHORT=$(git rev-parse --short HEAD)

if [ $PULL_EXIT_CODE -eq 0 ]; then
    # 변경사항이 있는지 확인
    if [ "$BEFORE_COMMIT" != "$AFTER_COMMIT" ]; then
        # 새로운 커밋 개수 확인
        COMMIT_COUNT=$(git rev-list --count "$BEFORE_COMMIT".."$AFTER_COMMIT" 2>/dev/null || echo "?")
        log "✅ Pull 성공 - $COMMIT_COUNT개 커밋 가져옴"
        log "   이전: $BEFORE_COMMIT_SHORT"
        log "   현재: $AFTER_COMMIT_SHORT"
        
        # 변경된 파일 목록 (최대 5개)
        CHANGED_FILES=$(git diff --name-only "$BEFORE_COMMIT".."$AFTER_COMMIT" 2>/dev/null | head -5 | tr '\n' ', ' | sed 's/, $//')
        if [ -n "$CHANGED_FILES" ]; then
            log "   변경된 파일: $CHANGED_FILES"
            notify "Git Auto-Pull" "main 브랜치 업데이트 완료 ($COMMIT_COUNT개 커밋)"
        else
            notify "Git Auto-Pull" "main 브랜치 업데이트 완료"
        fi
    else
        log "ℹ️  Pull 성공 - 변경사항 없음 (이미 최신 상태)"
        # 변경사항이 없을 때는 알림을 보내지 않음 (선택사항)
    fi
else
    log "❌ Pull 실패"
    notify "Git Auto-Pull" "main 브랜치 pull 실패 - 로그 확인 필요"
fi

# 원래 브랜치로 복귀 (tekskim이었던 경우)
if [ "$CURRENT_BRANCH" != "main" ]; then
    log "원래 브랜치($CURRENT_BRANCH)로 복귀 중..."
    git checkout "$CURRENT_BRANCH" 2>&1 | tee -a "$LOG_FILE"
    if [ $? -eq 0 ]; then
        log "✅ 원래 브랜치로 복귀 완료"
    else
        log "⚠️  원래 브랜치로 복귀 실패 (현재 main 브랜치에 있음)"
        notify "Git Auto-Pull" "원래 브랜치로 복귀 실패"
    fi
fi

log "=== Auto-pull 완료 ==="
echo "" >> "$LOG_FILE"
