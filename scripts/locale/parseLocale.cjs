const fs = require('fs');
const path = require('path');

// 명령줄 인자에서 경로 가져오기
const getTargetDirectory = () => {
  const targetDir = process.argv[2];

  if (!targetDir) {
    console.error('❌ 사용법: node parseLocale.cjs <target-directory>');
    console.error('   예시: node parseLocale.cjs locales');
    process.exit(1);
  }

  const absolutePath = path.resolve(process.cwd(), targetDir);

  if (!fs.existsSync(absolutePath)) {
    console.log(`⏭️  디렉토리가 없습니다. 스킵합니다: ${absolutePath}`);
    process.exit(0);
  }

  return absolutePath;
};

const TARGET_DIR = getTargetDirectory();
const CSV_FILE_PATH = path.join(TARGET_DIR, 'locales.csv');
const OUTPUT_DIR = TARGET_DIR;

// ============================================================================
// CSV 파일 읽기 & 검증
// ============================================================================

const readCSVFile = () => {
  if (!fs.existsSync(CSV_FILE_PATH)) {
    console.log(`⏭️  CSV 파일이 없습니다. 스킵합니다: ${CSV_FILE_PATH}`);
    process.exit(0);
  }

  try {
    return fs.readFileSync(CSV_FILE_PATH, 'utf-8');
  } catch (error) {
    console.error('❌ CSV 파일 읽기 실패:', error.message);
    process.exit(1);
  }
};

const parseCSVLines = csvContent => {
  const lines = csvContent.trim().split('\n');

  if (lines.length < 2) {
    console.error('❌ CSV 파일이 비어있거나 헤더만 존재합니다.');
    process.exit(1);
  }

  return lines;
};

// ============================================================================
// CSV 라인 파싱 (따옴표 처리 포함)
// ============================================================================

const parseCSVLine = line => {
  const values = [];
  let currentValue = '';
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        // 이스케이프된 따옴표 ("" -> ")
        currentValue += '"';
        i++; // 다음 따옴표 건너뛰기
      } else {
        // 따옴표 시작/종료
        insideQuotes = !insideQuotes;
      }
    } else if (char === '\\' && insideQuotes && nextChar === ',') {
      // 이스케이프된 쉼표 (\, -> ,)
      currentValue += ',';
      i++; // 다음 쉼표 건너뛰기
    } else if (char === ',' && !insideQuotes) {
      // 따옴표 밖의 쉼표 = 필드 구분자
      values.push(currentValue.trim());
      currentValue = '';
    } else {
      currentValue += char;
    }
  }

  // 마지막 값 추가
  values.push(currentValue.trim());

  return values;
};

// ============================================================================
// 헤더 파싱
// ============================================================================

const parseHeaders = headerLine => {
  const headers = parseCSVLine(headerLine);
  const keyIndex = headers.indexOf('key');

  if (keyIndex === -1) {
    console.error('❌ CSV 헤더에 "key" 컬럼이 없습니다.');
    process.exit(1);
  }

  const languages = headers.slice(1).map(lang => lang.toLowerCase());

  return { keyIndex, languages };
};

// ============================================================================
// 키 파싱
// ============================================================================

const parseKey = (fullKey, lineNumber) => {
  const [namespace, ...keyParts] = fullKey.split(':');

  if (keyParts.length === 0) {
    console.warn(`⚠️  잘못된 키 형식: ${fullKey} (라인 ${lineNumber})`);
    return null;
  }

  const keyPath = keyParts.join(':').split('.');
  return [namespace, ...keyPath];
};

// ============================================================================
// 중첩 객체 생성
// ============================================================================

const setNestedValue = (obj, keys, value) => {
  const lastKey = keys[keys.length - 1];
  const parentKeys = keys.slice(0, -1);

  const target = parentKeys.reduce((current, key) => {
    if (!current[key]) {
      current[key] = {};
    }
    return current[key];
  }, obj);

  target[lastKey] = value;
};

// ============================================================================
// 데이터 행 처리
// ============================================================================

const initializeResults = languages => {
  return languages.reduce((acc, lang) => {
    acc[lang] = {};
    return acc;
  }, {});
};

const processDataLine = (line, keyIndex, languages, results, lineNumber) => {
  if (!line.trim()) return;

  const values = parseCSVLine(line);
  const fullKey = values[keyIndex];

  if (!fullKey) return;

  const fullPath = parseKey(fullKey, lineNumber);
  if (!fullPath) return;

  languages.forEach((lang, langIndex) => {
    const value = values[langIndex + 1] || '';
    if (value) {
      setNestedValue(results[lang], fullPath, value);
    }
  });
};

// ============================================================================
// CSV 파싱 메인
// ============================================================================

const parseCSV = () => {
  const csvContent = readCSVFile();
  const lines = parseCSVLines(csvContent);

  const { keyIndex, languages } = parseHeaders(lines[0]);
  const results = initializeResults(languages);

  lines.slice(1).forEach((line, index) => {
    processDataLine(line, keyIndex, languages, results, index + 2);
  });

  return { results, languages };
};

// ============================================================================
// JSON 파일 저장
// ============================================================================

const ensureOutputDirectory = () => {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
};

const saveLanguageFile = (lang, data) => {
  const outputPath = path.join(OUTPUT_DIR, `${lang}.json`);
  const jsonContent = JSON.stringify(data, null, 2);

  fs.writeFileSync(outputPath, jsonContent + '\n', 'utf-8');
  console.log(`✅ ${lang}.json 생성 완료`);
};

const saveJSONFiles = (results, languages) => {
  ensureOutputDirectory();
  languages.forEach(lang => saveLanguageFile(lang, results[lang]));
};

// ============================================================================
// 메인 실행
// ============================================================================

const main = () => {
  console.log('🚀 다국어 파일 생성 시작...\n');
  console.log(`📁 대상 디렉토리: ${TARGET_DIR}`);
  console.log(`📄 CSV 파일: ${CSV_FILE_PATH}\n`);

  const { results, languages } = parseCSV();

  console.log(`📊 처리된 언어: ${languages.join(', ')}\n`);

  saveJSONFiles(results, languages);

  console.log('\n✨ 다국어 파일 생성 완료!');
};

main();
