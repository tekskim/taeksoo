import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const distRoot = path.join(repoRoot, 'dist');

const filesToDelete = [];

const walk = directory => {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) return walk(absolutePath);
    return [absolutePath];
  });
};

const markForDeletion = absolutePath => {
  if (fs.existsSync(absolutePath)) {
    filesToDelete.push(absolutePath);
  }
};

for (const absolutePath of walk(path.join(distRoot, 'components'))) {
  if (absolutePath.endsWith('.js') || absolutePath.endsWith('.css')) {
    markForDeletion(absolutePath);
  }
}

markForDeletion(path.join(distRoot, 'core.js'));
markForDeletion(path.join(distRoot, 'tokens-only.js'));

for (const absolutePath of walk(path.join(distRoot, 'assets'))) {
  if (/MonaSans\..*\.woff2$/u.test(path.basename(absolutePath))) {
    markForDeletion(absolutePath);
  }
}

for (const absolutePath of filesToDelete) {
  fs.rmSync(absolutePath, { force: true });
}

const coreCssPath = path.join(distRoot, 'core.css');
if (!fs.existsSync(coreCssPath)) {
  throw new Error('dist/core.css was not generated');
}

const publicFontPath = path.join(distRoot, 'public', 'fonts', 'MonaSans.woff2');
if (!fs.existsSync(publicFontPath)) {
  throw new Error('dist/public/fonts/MonaSans.woff2 is missing');
}

const coreCss = fs.readFileSync(coreCssPath, 'utf8');
const rewrittenCoreCss = coreCss.replaceAll(
  /assets\/MonaSans\.[^)"']+\.woff2/gu,
  './public/fonts/MonaSans.woff2'
);
if (rewrittenCoreCss !== coreCss) {
  fs.writeFileSync(coreCssPath, rewrittenCoreCss);
}

const pruneEmptyDirectories = directory => {
  if (!fs.existsSync(directory)) return;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      pruneEmptyDirectories(path.join(directory, entry.name));
    }
  }
  if (directory !== distRoot && fs.readdirSync(directory).length === 0) {
    fs.rmdirSync(directory);
  }
};

pruneEmptyDirectories(path.join(distRoot, 'components'));
pruneEmptyDirectories(path.join(distRoot, 'assets'));

console.log(
  `Optimized dist output by pruning ${filesToDelete.length} runtime artifacts.`
);
