#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const filesToScan = [];

function collectFiles() {
  // index.html
  filesToScan.push(path.join(projectRoot, 'index.html'));
  // all CSS files under src/css
  const cssDir = path.join(projectRoot, 'src', 'css');
  const stack = [cssDir];
  while (stack.length) {
    const dir = stack.pop();
    if (!fs.existsSync(dir)) continue;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) stack.push(p);
      else if (e.isFile() && p.endsWith('.css')) filesToScan.push(p);
    }
  }
}

function hasWebpFor(referencePath, contextFile) {
  // Only handle local/relative references, skip external URLs
  if (/^[a-z]+:\/\//i.test(referencePath)) return false;

  // Compute absolute path of the referenced asset
  let assetAbs;
  if (referencePath.startsWith('/')) {
    // root-relative to project root (vite serves from project root during dev)
    assetAbs = path.join(projectRoot, referencePath.replace(/^\/+/, ''));
  } else {
    // relative to the file's directory
    assetAbs = path.resolve(path.dirname(contextFile), referencePath);
  }
  const webpAbs = assetAbs.replace(/\.png$/i, '.webp');
  return fs.existsSync(webpAbs);
}

function updateContent(content, filePath) {
  // Replace occurrences of .png with .webp when a matching .webp exists
  // Match src|href|url(...) patterns and generic .png tokens
  return content.replace(/(["'\(])([^"'\)\s]+\.png)(["'\)])/gi, (m, pre, ref, post) => {
    if (hasWebpFor(ref, filePath)) {
      const newRef = ref.replace(/\.png$/i, '.webp');
      return `${pre}${newRef}${post}`;
    }
    return m;
  });
}

function run() {
  collectFiles();
  let changed = 0;
  for (const file of filesToScan) {
    if (!fs.existsSync(file)) continue;
    const before = fs.readFileSync(file, 'utf8');
    const after = updateContent(before, file);
    if (after !== before) {
      fs.writeFileSync(file, after);
      console.log('updated', path.relative(projectRoot, file));
      changed++;
    }
  }
  console.log(`Reference update complete. Files changed: ${changed}`);
}

run();
