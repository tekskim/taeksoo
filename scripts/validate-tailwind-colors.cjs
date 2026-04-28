/**
 * Validates that all Tailwind color utilities used by thaki-shared components
 * have corresponding color definitions in tailwind.config.cjs.
 *
 * Run: node scripts/validate-tailwind-colors.cjs
 *
 * Background:
 *   When migrating pages from old TDS to thaki-shared, tailwind.config.cjs must
 *   include ALL color tokens that thaki-shared components reference as Tailwind
 *   utility classes (e.g., bg-surface-subtle). If a color key is missing, the
 *   utility class won't be generated and the component silently falls back to
 *   transparent — producing invisible styling bugs that are hard to catch visually.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SHARED_DIR = path.join(ROOT, 'thaki-shared-v2/src/components');
const CONFIG_PATH = path.join(ROOT, 'tailwind.config.cjs');
const PRESET_PATH = path.join(ROOT, 'thaki-shared-v2/tailwind.preset.js');

const BUILT_IN_UTILITIES = new Set([
  'inherit', 'transparent', 'current', 'white', 'black',
]);

const TAILWIND_DEFAULT_PALETTES = new Set([
  'slate', 'gray', 'zinc', 'neutral', 'stone',
  'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal',
  'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose',
]);

const NON_COLOR_CLASSES = new Set([
  'text-center', 'text-left', 'text-right', 'text-ellipsis', 'text-clip',
  'text-xs', 'text-sm', 'text-lg', 'text-xl', 'text-2xl',
  'text-inherit', 'text-only', 'text-wrap',
  'border-none', 'border-solid', 'border-dashed', 'border-separate',
  'border-collapse', 'border-box', 'border-spacing',
  'border-0', 'border-2', 'border-4', 'border-8',
  'border-b', 'border-t', 'border-l', 'border-r', 'border-x', 'border-y',
  'border-b-0', 'border-b-2', 'border-r-0', 'border-r-2', 'border-r-none',
  'border-t-0', 'border-l-0',
  'bg-no-repeat', 'bg-cover', 'bg-center',
  'text-body-sm', 'text-body-md', 'text-body-lg', 'text-body-xs',
  'text-label-sm', 'text-label-md', 'text-label-lg',
  'text-heading-h1', 'text-heading-h2', 'text-heading-h3',
  'text-heading-h4', 'text-heading-h5', 'text-heading-h6',
]);

function extractColorUtilities(dir) {
  const results = new Set();
  const colorPrefixRegex = /(?<=^|[\s'":])(bg|text|border(?:-[btrlxy])?)-([a-z][a-z0-9-]*)/g;

  function walk(d) {
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, entry.name);
      if (entry.isDirectory()) { walk(full); continue; }
      if (!/\.(ts|tsx|css)$/.test(entry.name)) continue;
      const raw = fs.readFileSync(full, 'utf8');
      const content = raw.split('\n')
        .filter(line => !line.trimStart().startsWith('*') && !line.trimStart().startsWith('//'))
        .join('\n');
      let m;
      while ((m = colorPrefixRegex.exec(content)) !== null) {
        const cls = m[0];
        const colorName = m[2];
        if (NON_COLOR_CLASSES.has(cls)) continue;
        if (BUILT_IN_UTILITIES.has(colorName)) continue;
        if (/^(transparent|none|solid|dashed|separate|spacing|collapse|box|radius|bottom|color|default|focus-shadow|b-?|t-?|l-?|r-?|x-?|y-?)$/.test(colorName)) continue;
        results.add(cls);
      }
    }
  }
  walk(dir);
  return results;
}

function extractConfigColors(configPath) {
  delete require.cache[require.resolve(configPath)];
  const config = require(configPath);
  const flatKeys = new Set();
  const nestedGroups = new Set();

  function collectKeys(obj, prefix = '') {
    if (!obj || typeof obj !== 'object') return;
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}-${key}` : key;
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        nestedGroups.add(fullKey);
        collectKeys(value, fullKey);
      } else {
        flatKeys.add(fullKey);
      }
    }
  }
  collectKeys(config?.theme?.extend?.colors || {});
  return { flatKeys, nestedGroups };
}

function resolveColor(colorName, { flatKeys, nestedGroups }) {
  if (flatKeys.has(colorName)) return true;

  const parts = colorName.split('-');
  if (parts.length >= 2) {
    const group = parts[0];
    if (nestedGroups.has(group)) return true;
    if (TAILWIND_DEFAULT_PALETTES.has(group)) return true;
  }
  return false;
}

console.log('=== thaki-shared Tailwind Color Validation ===\n');

const usedUtilities = extractColorUtilities(SHARED_DIR);
const configColors = extractConfigColors(CONFIG_PATH);

console.log(`Found ${usedUtilities.size} color utilities in thaki-shared components`);
console.log(`Found ${configColors.flatKeys.size} flat + ${configColors.nestedGroups.size} nested color keys in tailwind.config.cjs\n`);

const missing = [];
const prefixRegex = /^(bg|text|border(?:-[btrlxy])?)-(.+)$/;

for (const cls of [...usedUtilities].sort()) {
  const match = cls.match(prefixRegex);
  if (!match) continue;
  const colorName = match[2];
  if (!resolveColor(colorName, configColors)) {
    missing.push({ cls, colorName });
  }
}

if (missing.length === 0) {
  console.log('✅ All thaki-shared color utilities have matching Tailwind config entries.\n');
  process.exit(0);
} else {
  console.log(`❌ ${missing.length} color utilities are MISSING from tailwind.config.cjs:\n`);
  for (const { cls, colorName } of missing) {
    console.log(`  ${cls}  →  color key "${colorName}" not found`);
  }
  console.log('\nTo fix: add the missing color keys to tailwind.config.cjs theme.extend.colors');
  console.log('Reference: thaki-shared-v2/tailwind.preset.js\n');
  process.exit(1);
}
