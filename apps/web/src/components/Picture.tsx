import type { ImgHTMLAttributes } from "react";
import { img } from "../content/site";

/** Responsive WebP from /images/<path>(-sm).webp. Lazy by default; pass `priority` for above-the-fold images. */
export function Picture({ path, alt, sizes = "100vw", priority, className, ...rest }: { path: string; alt: string; sizes?: string; priority?: boolean } & Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet">) {
  const { src, srcSet } = img(path);
  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : undefined}
      className={className}
      {...rest}
    />
  );
}
