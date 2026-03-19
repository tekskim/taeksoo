import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
// lodash 제거: 소규모 유틸 대체
import { generateCSSVarsFromObject } from './token-utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 지정된 경로에서 토큰 파일들을 로드하는 공통 함수
 */
function loadTokensFromPath(tokensPath) {
  if (!fs.existsSync(tokensPath)) {
    return {};
  }

  const jsonFiles = fs
    .readdirSync(tokensPath)
    .filter(file => file.endsWith('.json'));

  return Object.fromEntries(
    jsonFiles.map(file => {
      const themeName = path.basename(file, '.json');
      const filePath = path.join(tokensPath, file);
      const tokens = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      return [themeName, tokens];
    })
  );
}

/**
 * Base tokens (shared에서) 로드
 */
const loadBaseTokens = loadTokensFromPath;

/**
 * Custom tokens (consuming package에서) 로드
 */
const loadCustomTokens = loadTokensFromPath;

/**
 * 토큰 깊은 병합 (custom이 base를 override)
 */
function deepMerge(target, source) {
  if (typeof target !== 'object' || target === null) return source;
  const output = { ...target };
  for (const key of Object.keys(source)) {
    const value = source[key];
    if (Array.isArray(value)) {
      output[key] = value.slice();
    } else if (typeof value === 'object' && value !== null) {
      output[key] = deepMerge(target[key] ?? {}, value);
    } else {
      output[key] = value;
    }
  }
  return output;
}

function mergeTokens(baseTokens, customTokens) {
  const result = { ...baseTokens };
  for (const [themeName, customToken] of Object.entries(customTokens)) {
    result[themeName] = baseTokens[themeName]
      ? deepMerge(baseTokens[themeName], customToken)
      : customToken;
  }
  return result;
}

/**
 * 토큰 타입별 CSS 생성
 */
function generateTokenTypeCSS(
  token,
  tokenTypes = ['primitive', 'semantic', 'component']
) {
  return tokenTypes.map(tokenType =>
    token[tokenType]
      ? generateCSSVarsFromObject(token[tokenType], tokenType, token)
      : ''
  ).join('');
}

/**
 * Override CSS 생성
 */
function generateOverrideCSS(tokens, outputPath, namespace) {
  const header = [
    `/* Auto-generated custom tokens for ${namespace} */`,
    `/* This file overrides shared tokens with custom values */`,
    '',
  ].join('\n');

  const themeSections = Object.entries(tokens).map(([themeName, token]) => {
    const selector =
      themeName === 'light' ? ':root' : `[data-theme="${themeName}"]`;
    const themeTitle = `/* ${themeName.charAt(0).toUpperCase()}${themeName.slice(1)} Theme Override */`;
    const tokenCSS = generateTokenTypeCSS(token);

    return [themeTitle, `${selector} {`, tokenCSS, '}', ''].join('\n');
  });

  const css = [header, ...themeSections].join('\n');

  // 출력 디렉토리 생성
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, css, 'utf8');
}

/**
 * Consuming package에서 사용할 수 있는 토큰 override 시스템
 * 사용 예: packages/platform에서 자체 토큰으로 shared 토큰을 확장/override
 */
export function generateCustomTokens(options = {}) {
  const {
    baseTokensPath = path.join(__dirname, '../tokens'),
    customTokensPath = null, // consuming package의 tokens 경로
    outputPath = null, // 생성될 CSS 파일 경로
    namespace = 'custom', // 네임스페이스 (platform, suite 등)
  } = options;

  if (!customTokensPath || !outputPath) {
    throw new Error('customTokensPath and outputPath are required');
  }

  try {
    // 1. Base tokens 로드 (shared에서)
    const baseTokens = loadBaseTokens(baseTokensPath);

    // 2. Custom tokens 로드 (consuming package에서)
    const customTokens = loadCustomTokens(customTokensPath);

    // 3. 토큰 병합 (custom이 base를 override)
    const mergedTokens = mergeTokens(baseTokens, customTokens);

    // 4. CSS 생성
    generateOverrideCSS(mergedTokens, outputPath, namespace);

    console.log(`✅ Custom tokens generated for ${namespace}: ${outputPath}`);

    return mergedTokens;
  } catch (error) {
    console.error('❌ Error generating custom tokens:', error.message);
    throw error;
  }
}

export default generateCustomTokens;
