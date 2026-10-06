// Generates AVIF twins for every WebP in public/images, a size manifest for <img width/height>,
// and the 1200x630 social card. Run after adding or replacing images:  npm run images -w @hdb/web
import { readdir, stat, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = new URL("../public/images/", import.meta.url).pathname;

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

const manifest = {};
let made = 0;
const jobs = [];
for await (const file of walk(root)) {
  if (!file.endsWith(".webp")) continue;
  const key = path.relative(root, file).replace(/\.webp$/, "");
  const meta = await sharp(file).metadata();
  manifest[key] = [meta.width, meta.height];
  const avif = file.replace(/\.webp$/, ".avif");
  if (existsSync(avif) && (await stat(avif)).mtimeMs >= (await stat(file)).mtimeMs) continue;
  const isHero = key.startsWith("hero/");
  jobs.push(() => sharp(file).avif({ quality: isHero ? 58 : 50, effort: 4, chromaSubsampling: "4:2:0" }).toFile(avif).then(() => { made++; }));
}
// A few at a time: AVIF encoding is CPU-heavy.
await Promise.all(Array.from({ length: 4 }, async () => { for (let job = jobs.shift(); job; job = jobs.shift()) await job(); }));
await writeFile(new URL("../src/content/image-sizes.json", import.meta.url), JSON.stringify(manifest, null, 0));
console.log(`AVIF written: ${made}, manifest entries: ${Object.keys(manifest).length}`);

// Social card: dimmed sky + building + logo, 1200x630.
const sky = await sharp(path.join(root, "hero/night-sky.webp")).resize(1200, 630, { fit: "cover", position: "centre" }).modulate({ brightness: 0.8 }).toBuffer();
const building = await sharp(path.join(root, "hero/building.webp")).resize(1200, 630, { fit: "cover", position: "centre" }).toBuffer();
const logo = await sharp(path.join(root, "brand/logo-horizontal-light.png")).resize({ width: 520 }).toBuffer();
const shade = Buffer.from(`<svg width="1200" height="630"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0.45" stop-color="#081a17" stop-opacity="0"/><stop offset="1" stop-color="#081a17" stop-opacity="0.85"/></linearGradient></defs><rect width="1200" height="630" fill="url(#g)"/></svg>`);
await sharp(sky).composite([{ input: building }, { input: shade }, { input: logo, left: 340, top: 500 }]).jpeg({ quality: 82, mozjpeg: true }).toFile(path.join(root, "brand/og.jpg"));
console.log("og.jpg 1200x630 written");

// Small renditions of the brand marks: they are shown at 30-60px, so the full-size files are wasted bytes.
const brand = (name) => path.join(root, "brand", name);
await sharp(brand("logo-navbar.png")).resize({ width: 640 }).webp({ quality: 90, effort: 5 }).toFile(brand("logo-navbar.webp"));
await sharp(brand("emblem.webp")).resize({ width: 280 }).webp({ quality: 88, effort: 5 }).toFile(brand("emblem-sm.webp"));
await sharp(brand("logo-horizontal-light.webp")).resize({ width: 420 }).webp({ quality: 90, effort: 5 }).toFile(brand("logo-horizontal-light-sm.webp"));
console.log("brand renditions written");
