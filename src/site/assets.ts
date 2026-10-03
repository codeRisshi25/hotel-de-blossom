export const hotelAssets = {
  heroBuilding: "images/hero-building.jpg",
  logo: "images/logo-optimized.png",
  reception: "images/reception.webp",
  banquet: "images/banquet.webp",
  food: "images/food.webp",
  roomSuite: "images/room-suite.webp",
  roomDouble: "images/room-double.webp",
  roomTwin: "images/room-twin.webp",
  roomAltDouble: "images/room-alt-double.webp",
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
