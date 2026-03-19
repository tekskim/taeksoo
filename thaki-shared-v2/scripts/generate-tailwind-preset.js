/**
 * Tailwind Preset Generator
 *
 * Reads token JSON files and generates tailwind.preset.js automatically.
 * This ensures the Tailwind config stays in sync with design tokens.
 *
 * Usage: node scripts/generate-tailwind-preset.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TOKENS_PATH = path.resolve(__dirname, '../tokens/light.json');
const OUTPUT_PATH = path.resolve(__dirname, '../tailwind.preset.js');

/**
 * Convert camelCase to kebab-case (for Tailwind class names)
 */
function toKebabCase(str) {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Generate CSS variable reference
 * CSS variable names preserve camelCase from token JSON
 * e.g., 'primitive', 'color', 'blueGray500' → 'var(--primitive-color-blueGray500)'
 */
function cssVar(...parts) {
  return `var(--${parts.join('-')})`;
}

/**
 * Build nested object for Tailwind theme
 */
function buildNestedObject(tokens, prefix, depth = 0) {
  const result = {};

  for (const [key, value] of Object.entries(tokens)) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      // Check if it's a leaf node (has primitive values or references)
      const hasNestedObjects = Object.values(value).some(
        v => v && typeof v === 'object' && !Array.isArray(v)
      );

      if (hasNestedObjects && depth < 2) {
        // Recurse for nested objects (max 2 levels for Tailwind)
        result[key] = buildNestedObject(value, [...prefix, key], depth + 1);
      } else {
        // Flatten deeper nesting
        const flatKeys = flattenKeys(value, []);
        for (const [flatKey, _] of flatKeys) {
          result[`${key}-${flatKey}`] = cssVar(...prefix, key, flatKey);
        }
      }
    } else {
      result[key] = cssVar(...prefix, key);
    }
  }

  return result;
}

/**
 * Flatten nested keys with dash separator
 */
function flattenKeys(obj, prefix) {
  const result = [];

  for (const [key, value] of Object.entries(obj)) {
    const newPrefix = [...prefix, key];
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      result.push(...flattenKeys(value, newPrefix));
    } else {
      result.push([newPrefix.join('-'), value]);
    }
  }

  return result;
}

/**
 * Generate semantic colors mapping
 */
function generateSemanticColors(semantic) {
  const colors = {};
  const colorTokens = semantic.color || {};

  for (const [key, _] of Object.entries(colorTokens)) {
    // Convert camelCase to kebab-case for Tailwind class names
    const twKey = toKebabCase(key);
    colors[twKey] = cssVar('semantic', 'color', key);
  }

  return colors;
}

/**
 * Generate primitive colors mapping (grouped by color family)
 */
function generatePrimitiveColors(primitive) {
  const colors = {};
  const colorTokens = primitive.color || {};

  // Group colors by their base name (e.g., blue50, blue100 → blue: { 50, 100 })
  const colorGroups = {};

  for (const [key, _] of Object.entries(colorTokens)) {
    // Match pattern like 'blue500', 'blueGray100'
    const match = key.match(/^([a-zA-Z]+?)(\d+)$/);
    if (match) {
      const [, baseName, shade] = match;
      if (!colorGroups[baseName]) {
        colorGroups[baseName] = {};
      }
      colorGroups[baseName][shade] = cssVar('primitive', 'color', key);
    } else {
      // Single colors like 'white', 'black', 'transparent'
      colors[key] = cssVar('primitive', 'color', key);
    }
  }

  // Add grouped colors
  for (const [baseName, shades] of Object.entries(colorGroups)) {
    colors[baseName] = shades;
  }

  return colors;
}

/**
 * Generate spacing mapping
 */
function generateSpacing(primitive, semantic) {
  const spacing = {};

  // Primitive spacing (numeric)
  const primitiveSpace = primitive.space || {};
  for (const [key, _] of Object.entries(primitiveSpace)) {
    // Convert '0-5' to '0.5' for Tailwind
    const twKey = key.replace(/-/g, '.');
    spacing[twKey] = cssVar('primitive', 'space', key);
  }

  // Semantic spacing (t-shirt sizes)
  const semanticSpace = semantic.space || {};
  for (const [key, _] of Object.entries(semanticSpace)) {
    if (!key.includes('-')) {
      // Skip numeric ones like '0-5' already handled
      spacing[key] = cssVar('semantic', 'space', key);
    }
  }

  return spacing;
}

/**
 * Generate border radius mapping
 */
function generateBorderRadius(semantic) {
  const radius = {};
  const radiusTokens = semantic.radius || {};

  for (const [key, _] of Object.entries(radiusTokens)) {
    radius[key] = cssVar('semantic', 'radius', key);
  }

  return radius;
}

/**
 * Generate box shadow mapping
 */
function generateBoxShadow(semantic) {
  const shadows = {};
  const shadowTokens = semantic.shadow || {};

  for (const [key, _] of Object.entries(shadowTokens)) {
    const twKey = toKebabCase(key);
    shadows[twKey] = cssVar('semantic', 'shadow', key);
  }

  return shadows;
}

/**
 * Generate font size mapping with line heights
 */
function generateFontSize(semantic, primitive) {
  const fontSize = {};

  // Numeric font sizes from semantic
  const semanticFont = semantic.font || {};
  const sizeKeys = Object.keys(semanticFont).filter(k => k.startsWith('size'));

  for (const key of sizeKeys) {
    const size = key.replace('size', '');
    // Map to corresponding line height
    const lineHeightKey = `lineHeight${size}`;
    if (semanticFont[lineHeightKey]) {
      fontSize[size] = [
        cssVar('semantic', 'font', key),
        { lineHeight: cssVar('semantic', 'font', lineHeightKey) },
      ];
    } else {
      fontSize[size] = cssVar('semantic', 'font', key);
    }
  }

  // Control-specific font sizes
  const control = semantic.control || {};
  const controlFont = control.font?.size || {};
  for (const [key, _] of Object.entries(controlFont)) {
    fontSize[`control-${key}`] = [
      cssVar('semantic', 'control', 'font', 'size', key),
      { lineHeight: cssVar('semantic', 'control', 'font', 'lineHeight') },
    ];
  }

  return fontSize;
}

/**
 * Generate font weight mapping
 */
function generateFontWeight(semantic) {
  const fontWeight = {};
  const fontTokens = semantic.font || {};

  const weightKeys = Object.keys(fontTokens).filter(k => k.startsWith('weight'));
  for (const key of weightKeys) {
    const name = key.replace('weight', '').toLowerCase();
    fontWeight[name] = cssVar('semantic', 'font', key);
  }

  return fontWeight;
}

/**
 * Generate font family mapping
 */
function generateFontFamily(semantic) {
  return {
    sans: cssVar('semantic', 'font', 'family'),
    mono: cssVar('semantic', 'font', 'familyMono'),
  };
}

/**
 * Generate line height mapping
 */
function generateLineHeight(semantic) {
  const lineHeight = {};
  const fontTokens = semantic.font || {};

  const lineHeightKeys = Object.keys(fontTokens).filter(k =>
    k.startsWith('lineHeight')
  );
  for (const key of lineHeightKeys) {
    const name = key.replace('lineHeight', '');
    // Use numeric or named key
    lineHeight[name.toLowerCase() || name] = cssVar('semantic', 'font', key);
  }

  return lineHeight;
}

/**
 * Generate transition duration mapping
 */
function generateTransitionDuration(semantic) {
  const duration = {};
  const transitionTokens = semantic.transition || {};

  for (const [key, _] of Object.entries(transitionTokens)) {
    if (!key.startsWith('ease')) {
      duration[key] = cssVar('semantic', 'transition', key);
    }
  }

  return duration;
}

/**
 * Generate transition timing function mapping
 */
function generateTransitionTimingFunction(semantic) {
  const timing = {};
  const transitionTokens = semantic.transition || {};

  for (const [key, _] of Object.entries(transitionTokens)) {
    if (key.startsWith('ease')) {
      const twKey = toKebabCase(key);
      timing[twKey] = cssVar('semantic', 'transition', key);
    }
  }

  return timing;
}

/**
 * Generate z-index mapping
 */
function generateZIndex(semantic) {
  const zIndex = {};
  const zIndexTokens = semantic.zIndex || {};

  for (const [key, _] of Object.entries(zIndexTokens)) {
    zIndex[key] = cssVar('semantic', 'zIndex', key);
  }

  return zIndex;
}

/**
 * Generate control height mapping
 */
function generateControlHeights(semantic) {
  const heights = {};
  const control = semantic.control || {};
  const heightTokens = control.height || {};

  for (const [key, _] of Object.entries(heightTokens)) {
    heights[`control-${key}`] = cssVar('semantic', 'control', 'height', key);
  }

  return heights;
}

/**
 * Generate control padding mapping
 */
function generateControlPadding(semantic) {
  const padding = {};
  const control = semantic.control || {};
  const paddingTokens = control.padding || {};

  for (const [axis, sizes] of Object.entries(paddingTokens)) {
    if (sizes && typeof sizes === 'object') {
      for (const [size, _] of Object.entries(sizes)) {
        padding[`control-${axis}-${size}`] = cssVar(
          'semantic',
          'control',
          'padding',
          axis,
          size
        );
      }
    }
  }

  return padding;
}

/**
 * Generate border width mapping
 */
function generateBorderWidth(semantic) {
  const borderWidth = {};
  const borderTokens = semantic.border || {};

  for (const [key, _] of Object.entries(borderTokens)) {
    if (key === 'width') {
      borderWidth['DEFAULT'] = cssVar('semantic', 'border', key);
    } else if (key.startsWith('width')) {
      const name = key.replace('width', '').toLowerCase();
      borderWidth[name] = cssVar('semantic', 'border', key);
    }
  }

  return borderWidth;
}

/**
 * Generate opacity mapping
 */
function generateOpacity(semantic) {
  const opacity = {};
  const opacityTokens = semantic.opacity || {};

  for (const [key, _] of Object.entries(opacityTokens)) {
    opacity[key] = cssVar('semantic', 'opacity', key);
  }

  return opacity;
}

/**
 * Format object as JS code string with proper indentation
 */
function formatValue(value, indent, level) {
  const spaces = '  '.repeat(level);
  const innerSpaces = '  '.repeat(level + 1);

  if (Array.isArray(value)) {
    const items = value.map(item => {
      if (item && typeof item === 'object') {
        return formatValue(item, indent, level + 1);
      }
      return typeof item === 'string' ? `'${item}'` : String(item);
    });
    return `[\n${innerSpaces}${items.join(`,\n${innerSpaces}`)},\n${spaces}]`;
  }

  if (value && typeof value === 'object') {
    const entries = Object.entries(value);
    if (entries.length === 0) return '{}';

    const lines = entries.map(([k, v]) => {
      const formattedKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k) ? k : `'${k}'`;
      const formattedValue = formatValue(v, indent, level + 1);
      return `${innerSpaces}${formattedKey}: ${formattedValue},`;
    });

    return `{\n${lines.join('\n')}\n${spaces}}`;
  }

  return typeof value === 'string' ? `'${value}'` : String(value);
}

/**
 * Main function
 */
function generateTailwindPreset() {
  console.log('🔧 [Tailwind Preset Generator] Reading tokens...');

  if (!fs.existsSync(TOKENS_PATH)) {
    console.error(`❌ Token file not found: ${TOKENS_PATH}`);
    process.exit(1);
  }

  const tokens = JSON.parse(fs.readFileSync(TOKENS_PATH, 'utf8'));
  const { primitive, semantic } = tokens;

  console.log('🏗️  Generating Tailwind preset...');

  // Build the theme config
  const theme = {
    extend: {
      colors: {
        ...generateSemanticColors(semantic),
        primitive: generatePrimitiveColors(primitive),
      },
      spacing: generateSpacing(primitive, semantic),
      borderRadius: generateBorderRadius(semantic),
      boxShadow: generateBoxShadow(semantic),
      fontSize: generateFontSize(semantic, primitive),
      fontWeight: generateFontWeight(semantic),
      fontFamily: generateFontFamily(semantic),
      lineHeight: generateLineHeight(semantic),
      transitionDuration: generateTransitionDuration(semantic),
      transitionTimingFunction: generateTransitionTimingFunction(semantic),
      zIndex: generateZIndex(semantic),
      height: generateControlHeights(semantic),
      minHeight: generateControlHeights(semantic),
      borderWidth: generateBorderWidth(semantic),
      padding: generateControlPadding(semantic),
      opacity: generateOpacity(semantic),
    },
  };

  // Generate the preset file content
  const themeFormatted = formatValue(theme, 2, 1);

  const presetContent = `// Auto-generated from tokens/light.json - DO NOT EDIT

/** @type {import('tailwindcss').Config} */
export default {
  theme: ${themeFormatted},
  plugins: [],
};
`;

  fs.writeFileSync(OUTPUT_PATH, presetContent, 'utf8');
  console.log(`   ✔︎ Written: ${OUTPUT_PATH}`);
  console.log('✅ [Tailwind Preset Generator] Successfully generated preset');
}

generateTailwindPreset();
