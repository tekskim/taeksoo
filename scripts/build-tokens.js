#!/usr/bin/env node
/**
 * Token Build Script
 * Generates CSS Variables and Tailwind preset from tokens JSON files
 * 
 * Usage: node scripts/build-tokens.js
 * 
 * Output:
 *   - src/styles/tokens/light.css
 *   - src/styles/tokens/dark.css
 *   - src/styles/tokens/index.css
 *   - tailwind.preset.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// Read token files
const lightTokens = JSON.parse(
  fs.readFileSync(path.join(ROOT_DIR, 'tokens/light.json'), 'utf-8')
);
const darkTokens = JSON.parse(
  fs.readFileSync(path.join(ROOT_DIR, 'tokens/dark.json'), 'utf-8')
);

/**
 * Convert camelCase to kebab-case
 */
function toKebabCase(str) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Flatten nested object to CSS variable format
 * e.g., { primitive: { color: { blue500: '#3b82f6' } } }
 * → { '--primitive-color-blue500': '#3b82f6' }
 */
function flattenTokens(obj, prefix = '') {
  const result = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const kebabKey = toKebabCase(key);
    const newPrefix = prefix ? `${prefix}-${kebabKey}` : kebabKey;
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(result, flattenTokens(value, newPrefix));
    } else {
      result[`--${newPrefix}`] = value;
    }
  }
  
  return result;
}

/**
 * Generate CSS from flattened tokens
 */
function generateCSS(tokens, selector = ':root') {
  const flatTokens = flattenTokens(tokens);
  const lines = Object.entries(flatTokens)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n');
  
  return `${selector} {\n${lines}\n}`;
}

/**
 * Generate Tailwind preset from tokens
 */
function generateTailwindPreset(tokens) {
  const { primitive, semantic, component } = tokens;
  
  // Build color palette for Tailwind
  const colors = {};
  
  // Semantic colors (most used in components)
  if (semantic?.color) {
    for (const [key, value] of Object.entries(semantic.color)) {
      const kebabKey = toKebabCase(key);
      colors[kebabKey] = `var(--semantic-color-${kebabKey})`;
    }
  }
  
  // Primitive colors (for direct access)
  if (primitive?.color) {
    for (const [key, value] of Object.entries(primitive.color)) {
      const kebabKey = toKebabCase(key);
      colors[`primitive-${kebabKey}`] = `var(--primitive-color-${kebabKey})`;
    }
  }
  
  // Build spacing scale
  const spacing = {};
  if (primitive?.spacing) {
    for (const [key, value] of Object.entries(primitive.spacing)) {
      spacing[key] = `var(--primitive-spacing-${key})`;
    }
  }
  if (semantic?.spacing) {
    for (const [key, value] of Object.entries(semantic.spacing)) {
      const kebabKey = toKebabCase(key);
      spacing[`semantic-${kebabKey}`] = `var(--semantic-spacing-${kebabKey})`;
    }
  }
  
  // Build border radius
  const borderRadius = {};
  if (primitive?.radius) {
    for (const [key, value] of Object.entries(primitive.radius)) {
      borderRadius[key] = `var(--primitive-radius-${key})`;
    }
  }
  if (semantic?.radius) {
    for (const [key, value] of Object.entries(semantic.radius)) {
      borderRadius[`semantic-${key}`] = `var(--semantic-radius-${key})`;
    }
  }
  
  // Build font sizes
  const fontSize = {};
  if (primitive?.fontSize) {
    for (const [key, value] of Object.entries(primitive.fontSize)) {
      fontSize[key] = `var(--primitive-font-size-${key})`;
    }
  }
  
  // Build line heights
  const lineHeight = {};
  if (primitive?.lineHeight) {
    for (const [key, value] of Object.entries(primitive.lineHeight)) {
      lineHeight[key] = `var(--primitive-line-height-${key})`;
    }
  }
  
  // Build font weights
  const fontWeight = {};
  if (primitive?.fontWeight) {
    for (const [key, value] of Object.entries(primitive.fontWeight)) {
      fontWeight[key] = `var(--primitive-font-weight-${key})`;
    }
  }
  
  // Build font families
  const fontFamily = {};
  if (primitive?.fontFamily) {
    for (const [key, value] of Object.entries(primitive.fontFamily)) {
      fontFamily[key] = `var(--primitive-font-family-${key})`;
    }
  }
  
  const preset = `// Auto-generated from tokens/light.json - DO NOT EDIT
// Generated at: ${new Date().toISOString()}

/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      colors: ${JSON.stringify(colors, null, 8).replace(/"/g, "'")},
      spacing: ${JSON.stringify(spacing, null, 8).replace(/"/g, "'")},
      borderRadius: ${JSON.stringify(borderRadius, null, 8).replace(/"/g, "'")},
      fontSize: ${JSON.stringify(fontSize, null, 8).replace(/"/g, "'")},
      lineHeight: ${JSON.stringify(lineHeight, null, 8).replace(/"/g, "'")},
      fontWeight: ${JSON.stringify(fontWeight, null, 8).replace(/"/g, "'")},
      fontFamily: ${JSON.stringify(fontFamily, null, 8).replace(/"/g, "'")},
    },
  },
};
`;
  
  return preset;
}

/**
 * Generate legacy compatibility aliases
 * Maps old variable names to new semantic names
 */
function generateCompatibilityAliases(tokens) {
  const { semantic } = tokens;
  const aliases = {};
  
  // Color aliases - map old naming to new
  if (semantic?.color) {
    // Text colors
    aliases['--color-text-default'] = 'var(--semantic-color-text)';
    aliases['--color-text-muted'] = 'var(--semantic-color-text-muted)';
    aliases['--color-text-subtle'] = 'var(--semantic-color-text-subtle)';
    aliases['--color-text-disabled'] = 'var(--semantic-color-text-disabled)';
    aliases['--color-text-inverse'] = 'var(--semantic-color-text-inverse)';
    aliases['--color-text-on-primary'] = 'var(--semantic-color-text-on-primary)';
    
    // Action colors
    aliases['--color-action-primary'] = 'var(--semantic-color-primary)';
    aliases['--color-action-primary-hover'] = 'var(--semantic-color-primary-hover)';
    aliases['--color-action-primary-focus'] = 'var(--semantic-color-primary-focus)';
    
    // Surface colors
    aliases['--color-surface-default'] = 'var(--semantic-color-surface)';
    aliases['--color-surface-subtle'] = 'var(--semantic-color-surface-muted)';
    aliases['--color-surface-muted'] = 'var(--semantic-color-surface-hover)';
    aliases['--color-surface-inverse'] = 'var(--semantic-color-surface-tertiary)';
    
    // Border colors
    aliases['--color-border-default'] = 'var(--semantic-color-border)';
    aliases['--color-border-subtle'] = 'var(--semantic-color-border-subtle)';
    aliases['--color-border-strong'] = 'var(--semantic-color-border-strong)';
    aliases['--color-border-focus'] = 'var(--semantic-color-border-focus)';
    
    // State colors
    aliases['--color-state-info'] = 'var(--semantic-color-state-info)';
    aliases['--color-state-info-bg'] = 'var(--semantic-color-state-info-bg)';
    aliases['--color-state-success'] = 'var(--semantic-color-state-success)';
    aliases['--color-state-success-bg'] = 'var(--semantic-color-state-success-bg)';
    aliases['--color-state-warning'] = 'var(--semantic-color-state-warning)';
    aliases['--color-state-warning-bg'] = 'var(--semantic-color-state-warning-bg)';
    aliases['--color-state-danger'] = 'var(--semantic-color-state-danger)';
    aliases['--color-state-danger-bg'] = 'var(--semantic-color-state-danger-bg)';
  }
  
  return aliases;
}

/**
 * Main build function
 */
function build() {
  console.log('🎨 Building design tokens...\n');
  
  // Ensure output directories exist
  const tokensDir = path.join(ROOT_DIR, 'src/styles/tokens');
  fs.mkdirSync(tokensDir, { recursive: true });
  
  // Generate compatibility aliases
  const compatAliases = generateCompatibilityAliases(lightTokens);
  const compatCSS = Object.entries(compatAliases)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n');
  
  // Generate light theme CSS
  const lightCSS = generateCSS(lightTokens, ':root, [data-theme="light"]');
  fs.writeFileSync(path.join(tokensDir, 'light.css'), lightCSS);
  console.log('✅ Generated src/styles/tokens/light.css');
  
  // Generate dark theme CSS
  const darkCSS = generateCSS(darkTokens, '[data-theme="dark"]');
  fs.writeFileSync(path.join(tokensDir, 'dark.css'), darkCSS);
  console.log('✅ Generated src/styles/tokens/dark.css');
  
  // Generate compatibility layer CSS
  const compatibilityCSS = `/* Legacy variable name compatibility layer */
/* Maps old variable names to new semantic token names */
:root, [data-theme="light"], [data-theme="dark"] {
${compatCSS}
}
`;
  fs.writeFileSync(path.join(tokensDir, 'compatibility.css'), compatibilityCSS);
  console.log('✅ Generated src/styles/tokens/compatibility.css');
  
  // Generate combined index.css
  const indexCSS = `/* Auto-generated from tokens - DO NOT EDIT */
/* Generated at: ${new Date().toISOString()} */

@import './light.css';
@import './dark.css';
@import './compatibility.css';

/* Dark mode using prefers-color-scheme */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
${generateCSS(darkTokens, '').split('\n').slice(1, -1).map(line => '  ' + line).join('\n')}
  }
}
`;
  fs.writeFileSync(path.join(tokensDir, 'index.css'), indexCSS);
  console.log('✅ Generated src/styles/tokens/index.css');
  
  // Generate Tailwind preset
  const tailwindPreset = generateTailwindPreset(lightTokens);
  fs.writeFileSync(path.join(ROOT_DIR, 'tailwind.preset.js'), tailwindPreset);
  console.log('✅ Generated tailwind.preset.js');
  
  console.log('\n🎉 Token build complete!');
}

// Run build
build();
