import { canonicalFor, imageFor, metaFor } from "../seo";

const upsert = (selector: string, create: () => HTMLElement, set: (el: HTMLElement) => void) => {
  let el = document.head.querySelector<HTMLElement>(selector);
  if (!el) { el = create(); document.head.appendChild(el); }
  set(el);
};
const meta = (attr: "name" | "property", key: string, content: string) =>
  upsert(`meta[${attr}="${key}"]`, () => { const el = document.createElement("meta"); el.setAttribute(attr, key); return el; }, (el) => el.setAttribute("content", content));

/** Keeps <head> in step with the route after client-side navigation. Prerendered HTML already carries these tags. */
export function applyMeta(pathname: string) {
  const page = metaFor(pathname);
  const url = canonicalFor(page.path === "/404" ? pathname : page.path);
  document.title = page.title;
  meta("name", "description", page.description);
  meta("name", "robots", page.index === false ? "noindex, follow" : "index, follow, max-image-preview:large");
  upsert('link[rel="canonical"]', () => { const el = document.createElement("link"); el.rel = "canonical"; return el; }, (el) => el.setAttribute("href", url));
  meta("property", "og:title", page.title);
  meta("property", "og:description", page.description);
  meta("property", "og:url", url);
  meta("property", "og:image", imageFor(page));
  meta("name", "twitter:title", page.title);
  meta("name", "twitter:description", page.description);
  meta("name", "twitter:image", imageFor(page));
  upsert("script#jsonld", () => { const el = document.createElement("script"); el.id = "jsonld"; el.type = "application/ld+json"; return el; }, (el) => { el.textContent = JSON.stringify(page.jsonLd ?? []); });
}
