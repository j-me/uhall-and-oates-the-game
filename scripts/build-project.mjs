import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { basename, join, relative, resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';

const projectRoot = resolve('.');
const outputDirectory = join(projectRoot, 'build');
const assetsDirectory = join(outputDirectory, 'assets');
const packageJson = JSON.parse(readFileSync(join(projectRoot, 'package.json'), 'utf8'));

async function loadEsbuild() {
  try {
    return await import('esbuild');
  } catch {
    const bundledCandidates = [
      '/opt/homebrew/lib/node_modules/vercel/node_modules/esbuild/lib/main.js',
      '/usr/local/lib/node_modules/vercel/node_modules/esbuild/lib/main.js',
    ];
    const available = bundledCandidates.find(existsSync);
    if (available) return import(pathToFileURL(available).href);
    throw new Error('esbuild is required. Run npm install before npm run build.');
  }
}

if (basename(outputDirectory) !== 'build' || resolve(outputDirectory) !== join(projectRoot, 'build')) {
  throw new Error(`Refusing to replace unexpected build target: ${outputDirectory}`);
}

const esbuild = await loadEsbuild();
rmSync(outputDirectory, { recursive: true, force: true });
mkdirSync(outputDirectory, { recursive: true });

cpSync(join(projectRoot, 'assets'), assetsDirectory, {
  recursive: true,
  filter(path) {
    const projectPath = relative(projectRoot, path);
    if (basename(path) === '.DS_Store') return false;
    if (projectPath === join('assets', 'audio', 'music-local')) return false;
    if (projectPath.startsWith(`${join('assets', 'audio', 'music-local')}${sep}`)) return false;
    return true;
  },
});

function walkFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walkFiles(path) : [path];
  });
}

function encodeWebp(source, target) {
  const cwebp = spawnSync('cwebp', [
    '-quiet', '-mt', '-q', '92', '-alpha_q', '100', '-metadata', 'none',
    source, '-o', target,
  ], { stdio: 'ignore' });
  if (cwebp.status === 0) return;

  const imagemagick = spawnSync('magick', [
    source, '-strip', '-quality', '92', target,
  ], { stdio: 'ignore' });
  if (imagemagick.status === 0) return;

  throw new Error('Image optimization requires cwebp or ImageMagick on PATH.');
}

const imageReferences = new Map();
const artPngFiles = walkFiles(join(assetsDirectory, 'art'))
  .filter((path) => path.toLowerCase().endsWith('.png'));
let imageBytesBefore = 0;
let imageBytesAfter = 0;

artPngFiles.forEach((source) => {
  const originalBytes = statSync(source).size;
  const target = source.replace(/\.png$/i, '.webp');
  imageBytesBefore += originalBytes;
  encodeWebp(source, target);
  const optimizedBytes = statSync(target).size;
  if (optimizedBytes >= originalBytes) {
    rmSync(target);
    imageBytesAfter += originalBytes;
    return;
  }
  const originalReference = relative(outputDirectory, source).split(sep).join('/');
  const optimizedReference = relative(outputDirectory, target).split(sep).join('/');
  imageReferences.set(originalReference, optimizedReference);
  imageBytesAfter += optimizedBytes;
  rmSync(source);
});

function rewriteImageReferences(content) {
  let rewritten = content;
  imageReferences.forEach((optimized, original) => {
    rewritten = rewritten.replaceAll(original, optimized);
    const originalFromAssets = `./${original.slice('assets/'.length)}`;
    const optimizedFromAssets = `./${optimized.slice('assets/'.length)}`;
    rewritten = rewritten.replaceAll(originalFromAssets, optimizedFromAssets);
  });
  return rewritten;
}

esbuild.buildSync({
  entryPoints: [join(projectRoot, 'src', 'main.js')],
  outfile: join(assetsDirectory, 'app.min.js'),
  bundle: true,
  format: 'iife',
  target: ['es2020'],
  minify: true,
  treeShaking: true,
  legalComments: 'none',
  sourcemap: false,
  define: {
    __UHALL_LOCAL_MUSIC_DIRECTORY__: 'null',
  },
});
const bundledJavaScriptPath = join(assetsDirectory, 'app.min.js');
writeFileSync(
  bundledJavaScriptPath,
  rewriteImageReferences(readFileSync(bundledJavaScriptPath, 'utf8')),
);
if (readFileSync(bundledJavaScriptPath, 'utf8').includes('assets/audio/music-local/')) {
  throw new Error('Production JavaScript must not request excluded music-local files.');
}

const sourceCss = readFileSync(join(projectRoot, 'src', 'styles', 'main.css'), 'utf8')
  .replaceAll('../../assets/', './');
const minifiedCss = esbuild.transformSync(sourceCss, {
  loader: 'css',
  minify: true,
  legalComments: 'none',
});
const bundledCssPath = join(assetsDirectory, 'app.min.css');
writeFileSync(bundledCssPath, rewriteImageReferences(minifiedCss.code));
const bundledCss = readFileSync(bundledCssPath, 'utf8');
const missingCssAssets = [...bundledCss.matchAll(/url\((?:"|')?(\.\/[^"')]+)(?:"|')?\)/g)]
  .map((match) => match[1])
  .filter((reference) => !existsSync(resolve(assetsDirectory, reference)));
if (missingCssAssets.length) {
  throw new Error(`Bundled CSS references missing assets:\n${[...new Set(missingCssAssets)].join('\n')}`);
}

const sourceHtml = readFileSync(join(projectRoot, 'index.html'), 'utf8');
const bundledHtml = rewriteImageReferences(sourceHtml
  .replace('href="src/styles/main.css"', 'href="assets/app.min.css"')
  .replace('<script type="module" src="src/main.js"></script>', '<script src="assets/app.min.js" defer></script>')
  .replace(/<!--(?!\[if)[\s\S]*?-->/g, '')
  .replace(/\s+/g, ' ')
  .replace(/>\s+</g, '><')
  .trim());
writeFileSync(join(outputDirectory, 'index.html'), bundledHtml);

const manifest = JSON.parse(readFileSync(join(projectRoot, 'manifest.webmanifest'), 'utf8'));
writeFileSync(
  join(outputDirectory, 'manifest.webmanifest'),
  rewriteImageReferences(JSON.stringify(manifest)),
);

const sourceServiceWorker = readFileSync(join(projectRoot, 'service-worker.js'), 'utf8');
const bundledServiceWorker = rewriteImageReferences(sourceServiceWorker
  .replace("  './src/styles/main.css',\n", "  './assets/app.min.css',\n")
  .replace("  './src/main.js',\n", "  './assets/app.min.js',\n")
  .replace(/  '\.\/src\/[^']+',\n/g, ''));
const appShellPaths = [...bundledServiceWorker.matchAll(/'\.\/(.*?)'/g)]
  .map((match) => match[1])
  .filter(Boolean);
const minifiedServiceWorker = esbuild.transformSync(bundledServiceWorker, {
  loader: 'js',
  target: 'es2020',
  minify: true,
  legalComments: 'none',
});
writeFileSync(join(outputDirectory, 'service-worker.js'), minifiedServiceWorker.code);
writeFileSync(join(outputDirectory, '.nojekyll'), '');

const missingAppShellFiles = appShellPaths.filter((path) => !existsSync(join(outputDirectory, path)));
if (missingAppShellFiles.length) {
  throw new Error(`Build is missing service-worker files:\n${missingAppShellFiles.join('\n')}`);
}
if (existsSync(join(outputDirectory, 'src'))) {
  throw new Error('Unbundled source modules must not be included in a production build.');
}
if (existsSync(join(outputDirectory, 'settings.local.json'))) {
  throw new Error('Private settings.local.json must not be included in a production build.');
}
if (existsSync(join(outputDirectory, 'assets', 'audio', 'music-local'))) {
  throw new Error('Local copyrighted music must not be included in a production build.');
}

function summarize(directory) {
  return readdirSync(directory, { withFileTypes: true }).reduce((summary, entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      const child = summarize(path);
      return { files: summary.files + child.files, bytes: summary.bytes + child.bytes };
    }
    return { files: summary.files + 1, bytes: summary.bytes + statSync(path).size };
  }, { files: 0, bytes: 0 });
}

function totalJavaScriptBytes(directory) {
  return readdirSync(directory, { withFileTypes: true }).reduce((bytes, entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return bytes + totalJavaScriptBytes(path);
    return bytes + (entry.isFile() && entry.name.endsWith('.js') ? statSync(path).size : 0);
  }, 0);
}

const sourceJavaScriptBytes = totalJavaScriptBytes(join(projectRoot, 'src'));
const sourceCssBytes = Buffer.byteLength(sourceCss);
const sourceHtmlBytes = Buffer.byteLength(sourceHtml);
const outputJavaScriptBytes = statSync(join(assetsDirectory, 'app.min.js')).size;
const outputCssBytes = statSync(join(assetsDirectory, 'app.min.css')).size;
const outputHtmlBytes = statSync(join(outputDirectory, 'index.html')).size;
const summary = summarize(outputDirectory);
const sizeInMegabytes = (summary.bytes / 1024 / 1024).toFixed(1);
const codeBefore = sourceJavaScriptBytes + sourceCssBytes + sourceHtmlBytes;
const codeAfter = outputJavaScriptBytes + outputCssBytes + outputHtmlBytes;
const reduction = Math.round((1 - codeAfter / codeBefore) * 100);

console.log(`Build complete: ${relative(projectRoot, outputDirectory)}/ (${summary.files} files, ${sizeInMegabytes} MB)`);
console.log(`Bundled code: ${(codeBefore / 1024).toFixed(1)} KB → ${(codeAfter / 1024).toFixed(1)} KB (${reduction}% smaller)`);
console.log(`JavaScript: ${walkFiles(join(projectRoot, 'src')).filter((path) => path.endsWith('.js')).length} modules → assets/app.min.js`);
console.log('Styles: src/styles/main.css → assets/app.min.css');
console.log(`Images: ${artPngFiles.length} PNGs → ${imageReferences.size} WebP files (${(imageBytesBefore / 1024 / 1024).toFixed(1)} MB → ${(imageBytesAfter / 1024 / 1024).toFixed(1)} MB)`);
console.log(`Target URL: ${packageJson.homepage}`);
