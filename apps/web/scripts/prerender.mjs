// Runs after `vite build` and `vite build --ssr`. Turns the client shell into one static HTML file per
// public route (real content, title, description, canonical, Open Graph, JSON-LD), then writes
// sitemap.xml, robots.txt, 404.html and the staff shells. Cloudflare Pages serves /rooms from rooms/index.html.
import { mkdir, readFile, readdir, rm, writeFile, cp } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const web = new URL("../", import.meta.url).pathname;
const dist = path.join(web, "dist");
const ssrDir = path.join(web, "dist-ssr");

const { render, pages, notFoundMeta, staffMeta, SITE_URL, canonicalFor, imageFor, ogImage } = await import(pathToFileURL(path.join(ssrDir, "entry-server.js")).href);
const template = await readFile(path.join(dist, "index.html"), "utf8");
const assets = await readdir(path.join(dist, "assets"));

const esc = (value) => String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const jsonLd = (items) => JSON.stringify(items).replace(/</g, "\\u003c");
const find = (pattern) => assets.find((name) => pattern.test(name));

// Fonts needed above the fold. Home leads with the Cinzel wordmark; inner pages with Cormorant headings.
const fontFile = (pattern) => assets.find((name) => pattern.test(name));
const preloadFont = (name) => (name ? `<link rel="preload" as="font" type="font/woff2" href="/assets/${name}" crossorigin>` : "");
const manrope = fontFile(/^manrope-latin-wght-normal-.*\.woff2$/);
const cinzel = fontFile(/^cinzel-latin-500-normal-.*\.woff2$/);
const cormorant = fontFile(/^cormorant-garamond-latin-500-normal-.*\.woff2$/);
const fontsFor = (pathname) => [manrope, pathname === "/" ? cinzel : cormorant].map(preloadFont).filter(Boolean);

// The whole stylesheet is inlined: one less round trip before first paint. Pages are small and the SPA
// keeps navigating client-side, so the repeat cost is negligible.
const cssFile = fontFile(/^index-.*\.css$/);
const css = (await readFile(path.join(dist, "assets", cssFile), "utf8")).replace(/<\/style/gi, "<\\/style");

function headFor(meta, { pathname = meta.path } = {}) {
  const url = canonicalFor(pathname);
  const image = imageFor(meta);
  const robots = meta.index === false ? "noindex, follow" : "index, follow, max-image-preview:large";
  const isDefaultCard = image.endsWith(ogImage.src);
  return [
    `<meta name="description" content="${esc(meta.description)}">`,
    `<meta name="robots" content="${robots}">`,
    `<link rel="canonical" href="${url}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="Hotel De Blossom">`,
    `<meta property="og:locale" content="en_IN">`,
    `<meta property="og:title" content="${esc(meta.title)}">`,
    `<meta property="og:description" content="${esc(meta.description)}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:image" content="${image}">`,
    isDefaultCard ? `<meta property="og:image:width" content="${ogImage.width}"><meta property="og:image:height" content="${ogImage.height}"><meta property="og:image:alt" content="${esc(ogImage.alt)}">` : "",
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${esc(meta.title)}">`,
    `<meta name="twitter:description" content="${esc(meta.description)}">`,
    `<meta name="twitter:image" content="${image}">`,
    ...fontsFor(pathname),
    `<script type="application/ld+json" id="jsonld">${jsonLd(meta.jsonLd ?? [])}</script>`,
  ].filter(Boolean).join("\n    ");
}

function page(meta, body, options) {
  return template
    .replace(/<link rel="stylesheet"[^>]*>/, `<style>${css}</style>`)
    .replace(/<title>.*?<\/title>/, `<title>${esc(meta.title)}</title>`)
    .replace("</head>", `    ${headFor(meta, options)}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`);
}

async function write(file, content) {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, content);
}

// Public pages
for (const meta of pages) {
  const body = await render(meta.path);
  const file = meta.path === "/" ? path.join(dist, "index.html") : path.join(dist, meta.path, "index.html");
  await write(file, page(meta, body));
}

// 404 (Cloudflare Pages serves this for unknown URLs, with a real 404 status)
await write(path.join(dist, "404.html"), page(notFoundMeta, await render("/404"), { pathname: "/404" }));

// Staff: client-rendered shells, never indexed
for (const route of ["/staff", "/staff/login"]) {
  await write(path.join(dist, route, "index.html"), page({ ...staffMeta, path: route }, "", { pathname: route }));
}

// sitemap.xml and robots.txt
const today = new Date().toISOString().slice(0, 10);
const urls = pages.filter((p) => p.sitemap !== false);
await write(
  path.join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((p) => `  <url><loc>${canonicalFor(p.path)}</loc><lastmod>${today}</lastmod><priority>${(p.priority ?? 0.5).toFixed(1)}</priority></url>`)
    .join("\n")}\n</urlset>\n`,
);
await write(path.join(dist, "robots.txt"), `User-agent: *\nAllow: /\nDisallow: /staff\nDisallow: /api/\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);

await rm(ssrDir, { recursive: true, force: true });
console.log(`Prerendered ${pages.length} pages + 404 + staff shells for ${SITE_URL}`);
