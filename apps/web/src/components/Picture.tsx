import type { ImgHTMLAttributes } from "react";
import { img } from "../content/site";
import imageSizes from "../content/image-sizes.json";

const sizesByPath = imageSizes as unknown as Record<string, [number, number]>;

/**
 * Responsive image from /images/<path>(-sm).{avif,webp}. AVIF first, WebP fallback.
 * Width and height come from a generated manifest so the browser reserves space (no layout shift).
 * Lazy by default; pass `priority` for above-the-fold images.
 */
export function Picture({ path, alt, sizes = "100vw", priority, className, ...rest }: { path: string; alt: string; sizes?: string; priority?: boolean } & Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet">) {
  const { src, srcSet } = img(path);
  const [width, height] = sizesByPath[path] ?? [undefined, undefined];
  return (
    <picture className="contents">
      <source type="image/avif" srcSet={srcSet.replaceAll(".webp", ".avif")} sizes={sizes} />
      <img
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        width={width}
        height={height}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : undefined}
        className={className}
        {...rest}
      />
    </picture>
  );
}
