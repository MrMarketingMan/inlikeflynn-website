#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const targets = [
  path.join(projectRoot, 'src', 'assets', 'img'),
  path.join(projectRoot, 'public'),
];

const isPng = (p) => p.toLowerCase().endsWith('.png');

async function* walk(dir) {
  const dirents = await fs.promises.readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = path.resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      yield* walk(res);
    } else {
      yield res;
    }
  }
}

async function ensureWebp(pngPath) {
  const webpPath = pngPath.replace(/\.png$/i, '.webp');
  try {
    const [srcStat, destStat] = await Promise.all([
      fs.promises.stat(pngPath),
      fs.promises.stat(webpPath).catch(() => null)
    ]);
    if (destStat && destStat.mtimeMs >= srcStat.mtimeMs) {
      return { pngPath, webpPath, skipped: true };
    }
  } catch {}

  await sharp(pngPath)
    .webp({ quality: 75 })
    .toFile(webpPath);
  return { pngPath, webpPath, skipped: false };
}

async function run() {
  let converted = 0;
  let skipped = 0;
  for (const base of targets) {
    if (!fs.existsSync(base)) continue;
    for await (const file of walk(base)) {
      if (isPng(file)) {
        try {
          const res = await ensureWebp(file);
          if (res.skipped) skipped++; else converted++;
          console.log(`${res.skipped ? 'skip ' : 'make '} ${path.relative(projectRoot, res.webpPath)}`);
        } catch (e) {
          console.error('Error converting', file, e.message);
        }
      }
    }
  }
  console.log(`Done. Converted: ${converted}, Skipped (up-to-date): ${skipped}`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
