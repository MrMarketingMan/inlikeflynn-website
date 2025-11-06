#!/usr/bin/env node
import sharp from 'sharp';
import fs from 'fs';

const images = [
  'src/assets/img/ryan-working.webp',
  'src/assets/img/logo.webp',
  'src/assets/img/estimate-banner.webp',
  'src/assets/img/header-logo.webp'
];

for (const file of images) {
  const out = file.replace('.webp', '-opt.webp');
  try {
    await sharp(file)
      .webp({ quality: 70 })
      .toFile(out);
    fs.renameSync(out, file);
    console.log(`Recompressed ${file} → quality 70`);
  } catch (e) {
    console.error(`Failed to recompress ${file}:`, e.message);
  }
}
