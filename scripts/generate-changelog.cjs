#!/usr/bin/env node

/**
 * Git 커밋 로그를 파싱하여 changelog.json 생성
 * 
 * 커밋 메시지 컨벤션:
 * [App명] 변경 내용
 * 
 * 예시:
 * [Compute] HostDetailPage Device health 탭 수정
 * [Storage] BucketDetailPage 테이블 스타일 적용
 * [Cloud Builder] ListToolbar 버튼 위치 조정
 * [Design System] NotificationCenter 스크롤 스타일
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 앱별 색상 매핑
const APP_COLORS = {
  'Compute': 'from-blue-500 to-cyan-500',
  'Container': 'from-violet-500 to-purple-500',
  'Cloud Builder': 'from-orange-500 to-amber-500',
  'AI Platform': 'from-pink-500 to-rose-500',
  'AI Agent': 'from-emerald-500 to-teal-500',
  'Storage': 'from-indigo-500 to-blue-500',
  'Desktop': 'from-slate-500 to-zinc-500',
  'IAM': 'from-amber-500 to-yellow-500',
  'Design System': 'from-purple-500 to-fuchsia-500',
};

// 기본 색상
const DEFAULT_COLOR = 'from-gray-500 to-slate-500';

function getGitLog() {
  try {
    // 최근 100개 커밋 가져오기 (날짜, 해시, 메시지)
    const log = execSync(
      'git log --pretty=format:"%ad|%h|%s" --date=short -100',
      { encoding: 'utf-8' }
    );
    return log.trim().split('\n').filter(Boolean);
  } catch (error) {
    console.error('Git log 가져오기 실패:', error.message);
    return [];
  }
}

function parseCommitMessage(message) {
  // [App명] 패턴 매칭
  const match = message.match(/^\[([^\]]+)\]\s*(.+)$/);
  if (match) {
    return {
      app: match[1].trim(),
      change: match[2].trim(),
    };
  }
  return null;
}

function generateChangelog() {
  const logLines = getGitLog();
  const changesByDate = new Map();

  for (const line of logLines) {
    const [date, hash, ...messageParts] = line.split('|');
    const message = messageParts.join('|'); // 메시지에 | 있을 수 있음
    
    const parsed = parseCommitMessage(message);
    if (!parsed) continue; // 컨벤션 안 따르는 커밋은 스킵

    const key = `${date}|${parsed.app}`;
    
    if (!changesByDate.has(key)) {
      changesByDate.set(key, {
        date,
        app: parsed.app,
        appColor: APP_COLORS[parsed.app] || DEFAULT_COLOR,
        changes: [],
      });
    }
    
    // 중복 변경사항 방지
    if (!changesByDate.get(key).changes.includes(parsed.change)) {
      changesByDate.get(key).changes.push(parsed.change);
    }
  }

  // Map을 배열로 변환하고 날짜순 정렬 (최신순)
  const changelog = Array.from(changesByDate.values())
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 20) // 최근 20개만
    .map((item, index) => ({
      id: String(index + 1),
      ...item,
    }));

  return changelog;
}

function main() {
  console.log('📝 Changelog 생성 중...');
  
  const changelog = generateChangelog();
  
  // src/data 디렉토리 생성
  const dataDir = path.join(__dirname, '..', 'src', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  // JSON 파일 저장
  const outputPath = path.join(dataDir, 'changelog.json');
  fs.writeFileSync(outputPath, JSON.stringify(changelog, null, 2), 'utf-8');
  
  console.log(`✅ Changelog 생성 완료: ${changelog.length}개 항목`);
  console.log(`   저장 위치: ${outputPath}`);
}

main();

