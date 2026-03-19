import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const distRoot = path.join(repoRoot, 'dist');
const packageJsonPath = path.join(repoRoot, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

const requiredMetadataFields = ['license', 'homepage', 'bugs', 'packageManager'];
for (const field of requiredMetadataFields) {
  if (!packageJson[field]) {
    throw new Error(`Missing required package metadata field: ${field}`);
  }
}

const requiredDocs = ['README.md', 'LICENSE', 'AI_GUIDE.md'];
for (const docPath of requiredDocs) {
  const absolutePath = path.join(repoRoot, docPath);
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Missing required package document: ${docPath}`);
  }
}

const normalizePath = value => value.replace(/^\.\//, '').replaceAll('\\', '/');
const disallowedArtifactPatterns = [
  /^dist\/components\/.*\.(js|css)$/u,
  /^dist\/core\.js$/u,
  /^dist\/tokens-only\.js$/u,
  /^dist\/assets\/MonaSans\..*\.woff2$/u,
];

const walkFiles = directory => {
  if (!fs.existsSync(directory)) return [];
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  return entries.flatMap(entry => {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) return walkFiles(absolutePath);
    return [absolutePath];
  });
};

const expandPatternTarget = target => {
  if (!target.includes('*')) return [normalizePath(target)];

  const [prefix, suffix] = target.split('*');
  const baseDir = path.join(repoRoot, prefix);
  const matches = walkFiles(baseDir)
    .map(absolutePath => normalizePath(path.relative(repoRoot, absolutePath)))
    .filter(relativePath => relativePath.startsWith(normalizePath(prefix)))
    .filter(relativePath => relativePath.endsWith(suffix));

  if (matches.length === 0) {
    throw new Error(`Export pattern did not match any build artifacts: ${target}`);
  }

  return matches;
};

const collectExportTargets = value => {
  if (typeof value === 'string') return [value];
  if (!value || typeof value !== 'object') return [];
  return Object.values(value).flatMap(collectExportTargets);
};

const exportTargets = Object.values(packageJson.exports).flatMap(collectExportTargets);
const requiredExportFiles = [...new Set(exportTargets.flatMap(expandPatternTarget))];
const buildFiles = new Set(
  walkFiles(distRoot).map(absolutePath =>
    normalizePath(path.relative(repoRoot, absolutePath))
  )
);

for (const relativePath of requiredExportFiles) {
  const absolutePath = path.join(repoRoot, relativePath);
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Export target is missing from build output: ${relativePath}`);
  }
}

for (const filePath of buildFiles) {
  if (disallowedArtifactPatterns.some(pattern => pattern.test(filePath))) {
    throw new Error(`Build output should not include pruned artifact: ${filePath}`);
  }
}

const packJson = execFileSync('npm', ['pack', '--json', '--dry-run'], {
  cwd: repoRoot,
  encoding: 'utf8',
});
const packResult = JSON.parse(packJson);
const packFiles = new Set(packResult[0].files.map(file => normalizePath(file.path)));

for (const docPath of requiredDocs) {
  if (!packFiles.has(docPath)) {
    throw new Error(`Packed tarball is missing required document: ${docPath}`);
  }
}

for (const relativePath of requiredExportFiles) {
  if (!packFiles.has(relativePath)) {
    throw new Error(`Packed tarball is missing export target: ${relativePath}`);
  }
}

const unexpectedStoryArtifacts = [...packFiles].filter(filePath =>
  filePath.startsWith('dist/stories/')
);
if (unexpectedStoryArtifacts.length > 0) {
  throw new Error(
    `Packed tarball should not include story artifacts: ${unexpectedStoryArtifacts.join(', ')}`
  );
}

const unexpectedPackedArtifacts = [...packFiles].filter(filePath =>
  disallowedArtifactPatterns.some(pattern => pattern.test(filePath))
);
if (unexpectedPackedArtifacts.length > 0) {
  throw new Error(
    `Packed tarball should not include pruned artifacts: ${unexpectedPackedArtifacts.join(', ')}`
  );
}

const coreCssPath = path.join(distRoot, 'core.css');
const coreCss = fs.readFileSync(coreCssPath, 'utf8');
if (!coreCss.includes('./public/fonts/MonaSans.woff2')) {
  throw new Error('dist/core.css must reference ./public/fonts/MonaSans.woff2');
}
if (coreCss.includes('assets/MonaSans.')) {
  throw new Error('dist/core.css must not reference duplicated asset fonts');
}

const requiredCoreCssSelectors = ['.xterm', '.progress-track', '.table-th-divider', '.tooltip-arrow'];
for (const selector of requiredCoreCssSelectors) {
  if (!coreCss.includes(selector)) {
    throw new Error(`dist/core.css is missing required selector: ${selector}`);
  }
}

const indexCssPath = path.join(distRoot, 'index.css');
const indexCss = fs.readFileSync(indexCssPath, 'utf8');
if (
  !indexCss.includes('[data-thaki-svg-mode=stroke]') ||
  !indexCss.includes('vector-effect:non-scaling-stroke') ||
  !indexCss.includes('.xterm')
) {
  throw new Error('dist/index.css lost expected shared utility selectors');
}

console.log(
  `Verified ${requiredExportFiles.length} export target files in build output and packed tarball.`
);
