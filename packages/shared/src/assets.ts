export const hotelAssets = {
  heroSky: "images/hero/night-sky.webp",
  heroBuilding: "images/hero/building.webp",
  logo: "images/brand/logo-stacked.webp",
  logoLight: "images/brand/logo-stacked-light.webp",
  logoHorizontal: "images/brand/logo-horizontal.webp",
  logoHorizontalLight: "images/brand/logo-horizontal-light.webp",
  emblem: "images/brand/emblem.webp",
} as const;

/**
 * Returns a public CDN URL when configured, otherwise the local Pages/Astro path.
 * Keep asset filenames immutable so CDN caches remain effective after deployment.
 */
export const assetUrl = (path: string, baseUrl = "") => {
  const cleanPath = path.replace(/^\/+/, "");
  const cleanBase = baseUrl.trim().replace(/\/+$/, "");
  return cleanBase ? `${cleanBase}/${cleanPath}` : `/${cleanPath}`;
};
