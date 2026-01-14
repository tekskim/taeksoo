#!/bin/bash

# main 브랜치 동기화 상태 확인 스크립트

REPO_PATH="/Users/taeksoo.kim/Documents/planning_files/myRepository"

echo "=== Main 브랜치 동기화 상태 확인 ==="
echo ""

cd "$REPO_PATH" || exit 1

# LaunchAgent 상태 확인
echo "📋 LaunchAgent 상태:"
if launchctl list | grep -q com.auto-pull-main; then
    echo "  ✅ 자동 동기화 서비스 실행 중"
    LAUNCHCTL_INFO=$(launchctl list com.auto-pull-main)
    if echo "$LAUNCHCTL_INFO" | grep -q '"LastExitStatus" = 0'; then
        echo "  ✅ 마지막 실행 성공"
    else
        LAST_EXIT=$(echo "$LAUNCHCTL_INFO" | grep -o '"LastExitStatus" = [0-9]*' | grep -o '[0-9]*')
        if [ -n "$LAST_EXIT" ] && [ "$LAST_EXIT" != "0" ]; then
            echo "  ⚠️  마지막 실행 상태: $LAST_EXIT (로그 확인 필요)"
        fi
    fi
else
    echo "  ❌ 자동 동기화 서비스가 실행되지 않음"
fi

# plist 파일 확인
if [ -f ~/Library/LaunchAgents/com.auto-pull-main.plist ]; then
    INTERVAL=$(grep -A 1 "StartInterval" ~/Library/LaunchAgents/com.auto-pull-main.plist | grep -o '<integer>[0-9]*</integer>' | grep -o '[0-9]*')
    if [ -n "$INTERVAL" ]; then
        HOURS=$((INTERVAL / 3600))
        MINUTES=$(((INTERVAL % 3600) / 60))
        if [ $HOURS -gt 0 ]; then
            echo "  ⏰ 실행 주기: ${HOURS}시간"
        else
            echo "  ⏰ 실행 주기: ${MINUTES}분"
        fi
    fi
fi

echo ""

# 로그 파일 확인
echo "📝 최근 동기화 로그:"
if [ -f "$REPO_PATH/scripts/auto-pull-main.log" ]; then
    echo "  마지막 5줄:"
    tail -5 "$REPO_PATH/scripts/auto-pull-main.log" | sed 's/^/    /'
    
    # 마지막 성공한 동기화 시간 확인
    LAST_SUCCESS=$(grep "✅ Pull 성공" "$REPO_PATH/scripts/auto-pull-main.log" | tail -1 | grep -o '\[.*\]' | tr -d '[]')
    if [ -n "$LAST_SUCCESS" ]; then
        echo ""
        echo "  마지막 성공한 동기화: $LAST_SUCCESS"
    fi
else
    echo "  ⚠️  로그 파일이 없습니다"
fi

echo ""

# Git 상태 확인
echo "🔍 Git 상태:"
CURRENT_BRANCH=$(git branch --show-current)
echo "  현재 브랜치: $CURRENT_BRANCH"

# origin/main과 로컬 main 비교
git fetch origin main --quiet 2>/dev/null

# main 브랜치로 전환하여 확인
git checkout main --quiet 2>/dev/null
if [ $? -eq 0 ]; then
    LOCAL_COMMIT=$(git rev-parse HEAD 2>/dev/null)
    REMOTE_COMMIT=$(git rev-parse origin/main 2>/dev/null)
    
    if [ "$LOCAL_COMMIT" = "$REMOTE_COMMIT" ]; then
        echo "  ✅ 로컬 main과 origin/main이 동기화됨"
    else
        BEHIND=$(git rev-list --count HEAD..origin/main 2>/dev/null || echo "0")
        AHEAD=$(git rev-list --count origin/main..HEAD 2>/dev/null || echo "0")
        
        if [ "$BEHIND" != "0" ]; then
            echo "  ⚠️  로컬 main이 origin/main보다 $BEHIND개 커밋 뒤처짐"
        fi
        if [ "$AHEAD" != "0" ]; then
            echo "  ℹ️  로컬 main이 origin/main보다 $AHEAD개 커밋 앞서 있음"
        fi
    fi
    
    # 원래 브랜치로 복귀
    git checkout "$CURRENT_BRANCH" --quiet 2>/dev/null
else
    echo "  ⚠️  main 브랜치로 전환할 수 없습니다 (uncommitted changes 가능)"
fi

echo ""
echo "=== 확인 완료 ==="
