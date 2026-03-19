import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TOKENS_DIR = path.resolve(__dirname, '../tokens');
const DOC_OUTPUT_DIR = path.resolve(__dirname, '../src/stories/tokens/generated');
const DOC_OUTPUT_FILE = path.join(DOC_OUTPUT_DIR, 'token-docs.json');

const ensureDirectory = directoryPath => {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }
};

/**
 * Get theme selector based on theme name
 */
const getThemeSelector = themeName =>
  themeName === 'light' ? ':root' : `[data-theme="${themeName}"]`;

/**
 * Flatten nested token object into array of token entries
 */
const flattenTokens = (obj, pathPrefix = [], entries = []) => {
  for (const [key, value] of Object.entries(obj)) {
    const currentPath = [...pathPrefix, key];

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      flattenTokens(value, currentPath, entries);
    } else {
      entries.push({
        name: `--${currentPath.join('-')}`,
        path: currentPath.join('.'),
        value: value,
        type: null,
        category: currentPath[0] || null,
        group: currentPath[1] || null,
        description: null,
        originalValue: value,
      });
    }
  }
  return entries;
};

/**
 * Build documentation for a single theme
 */
const buildThemeDocumentation = themeName => {
  const tokenFilePath = path.join(TOKENS_DIR, `${themeName}.json`);

  if (!fs.existsSync(tokenFilePath)) {
    console.warn(`⚠️  [tokens-docs] Theme file not found: ${tokenFilePath}`);
    return null;
  }

  const tokens = JSON.parse(fs.readFileSync(tokenFilePath, 'utf8'));
  const entries = flattenTokens(tokens);

  return {
    name: themeName,
    selector: getThemeSelector(themeName),
    tokens: tokens,
    entries: entries,
  };
};

/**
 * Get available themes from tokens directory
 */
const getAvailableThemes = () => {
  if (!fs.existsSync(TOKENS_DIR)) {
    return [];
  }

  return fs
    .readdirSync(TOKENS_DIR)
    .filter(file => file.endsWith('.json'))
    .map(file => path.basename(file, '.json'));
};

const run = () => {
  const themes = getAvailableThemes();

  if (themes.length === 0) {
    console.warn('⚠️  [tokens-docs] No theme files found. Skipping documentation generation.');
    return;
  }

  ensureDirectory(DOC_OUTPUT_DIR);

  const documentation = [];

  for (const themeName of themes) {
    console.log(`📝  [tokens-docs] Generating documentation for "${themeName}" theme`);
    const themeDocs = buildThemeDocumentation(themeName);
    if (themeDocs) {
      documentation.push(themeDocs);
    }
  }

  if (documentation.length === 0) {
    console.warn('⚠️  [tokens-docs] No documentation generated.');
    return;
  }

  // Check if content changed
  if (fs.existsSync(DOC_OUTPUT_FILE)) {
    try {
      const existingContent = fs.readFileSync(DOC_OUTPUT_FILE, 'utf8');
      const existingData = JSON.parse(existingContent);

      if (JSON.stringify(existingData.themes) === JSON.stringify(documentation)) {
        console.log(`✅  [tokens-docs] Content unchanged, skipping write.`);
        return;
      }
    } catch {
      // Ignore errors, will regenerate
    }
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    themeCount: documentation.length,
    themes: documentation,
  };

  fs.writeFileSync(DOC_OUTPUT_FILE, JSON.stringify(payload, null, 2), 'utf8');
  console.log(`✅  [tokens-docs] Wrote documentation to ${DOC_OUTPUT_FILE}`);
};

run();
