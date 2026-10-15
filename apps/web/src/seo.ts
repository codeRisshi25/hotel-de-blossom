import { faqs, hotel, rooms } from "./content/site";

/** Canonical site origin. Set PUBLIC_SITE_URL at build time; no trailing slash. */
export const SITE_URL = ((import.meta.env as Record<string, string | undefined>).PUBLIC_SITE_URL ?? "https://hoteldeblossom.com").replace(/\/$/, "");

const abs = (path: string) => (path.startsWith("http") ? path : `${SITE_URL}${path}`);
const brand = "Hotel De Blossom";
const ogImage = { src: "/images/brand/og.jpg", width: 1200, height: 630, alt: "Hotel De Blossom lit up at night in Chandmari, Guwahati" };

export type PageMeta = {
  path: string;
  title: string;
  description: string;
  /** Hero image path used for og:image (absolute or site-relative). */
  image?: string;
  index?: boolean;
  sitemap?: boolean;
  priority?: number;
  jsonLd?: object[];
};

const address = {
  "@type": "PostalAddress",
  streetAddress: hotel.address[0],
  addressLocality: "Guwahati",
  addressRegion: "Assam",
  addressCountry: "IN",
};

const org = {
  "@type": "Hotel",
  "@id": `${SITE_URL}/#hotel`,
  name: brand,
  url: SITE_URL,
  image: [abs(ogImage.src)],
  logo: abs("/images/brand/logo-stacked.png"),
  telephone: hotel.phone,
  email: hotel.email,
  address,
  hasMap: hotel.mapsUrl,
  sameAs: [hotel.socials.instagram, hotel.socials.facebook],
  amenityFeature: ["Free Wi-Fi", "Air conditioning", "24-hour front desk", "Restaurant", hotel.banquetHallName, "Airport transfers on request"].map((name) => ({ "@type": "LocationFeatureSpecification", name, value: true })),
};

const breadcrumb = (items: Array<[string, string]>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [["Home", "/"], ...items].map(([name, path], index) => ({ "@type": "ListItem", position: index + 1, name, item: abs(path) })),
});

const roomMeta = (room: (typeof rooms)[number]): PageMeta => {
  const knownSize = Number.isFinite(Number.parseInt(room.size, 10)) ? room.size : null;
  const knownBed = room.bed === "Please confirm with reception" ? null : room.bed.toLowerCase();
  return {
    path: `/rooms/${room.slug}`,
    title: `${room.name} in Chandmari, Guwahati | ${brand}`,
    description: `${room.short.replace(/\.$/, "")}${knownSize ? ` ${knownSize}` : ""}${knownBed ? `, ${knownBed}` : ""}, air conditioning and Wi-Fi in Chandmari, Guwahati.`,
    image: `/images/${room.cover}.webp`,
    priority: 0.8,
    jsonLd: [
      breadcrumb([["Rooms", "/rooms"], [room.name, `/rooms/${room.slug}`]]),
      {
        "@context": "https://schema.org",
        "@type": "HotelRoom",
        name: room.name,
        description: room.description,
        image: room.gallery.map((item) => abs(`/images/${item.path}.webp`)),
        ...(knownSize && { floorSize: { "@type": "QuantitativeValue", value: Number.parseInt(room.size, 10), unitCode: "MTK" } }),
        ...(knownBed && { bed: { "@type": "BedDetails", typeOfBed: room.bed } }),
        amenityFeature: room.features.map((name) => ({ "@type": "LocationFeatureSpecification", name, value: true })),
        containedInPlace: { "@id": `${SITE_URL}/#hotel` },
      },
    ],
  };
};

export const pages: PageMeta[] = [
  {
    path: "/",
    title: `${brand} | Hotel in Chandmari, Guwahati`,
    description: `${brand} at Tulip Tower, MRD Road, Chandmari, Guwahati. Four room categories, all-day dining and ${hotel.banquetHallName} for up to ${hotel.banquetCapacity} guests.`,
    image: "/images/brand/og.jpg",
    priority: 1,
    jsonLd: [
      { "@context": "https://schema.org", ...org },
      { "@context": "https://schema.org", "@type": "WebSite", name: brand, url: SITE_URL, publisher: { "@id": `${SITE_URL}/#hotel` } },
    ],
  },
  {
    path: "/rooms",
    title: `Rooms & Suites in Guwahati | ${brand}`,
    description: `Deluxe, Twin Deluxe, Blossom Suite Room and Premium rooms in Chandmari, Guwahati. Air conditioning, Wi-Fi and a 24-hour front desk. Send a booking request.`,
    image: "/images/rooms/deluxe/deluxe-room.webp",
    priority: 0.9,
    jsonLd: [breadcrumb([["Rooms", "/rooms"]])],
  },
  ...rooms.map(roomMeta),
  {
    path: "/dining",
    title: `Restaurant & Menu in Guwahati | ${brand}`,
    description: `Assamese, Indian, Asian and continental dishes, open ${hotel.restaurantHours.replace(", Monday to Sunday", " daily")} at ${brand}, Chandmari. Read the full menu and download the PDF.`,
    image: "/images/food/chicken-lababdar.webp",
    priority: 0.8,
    jsonLd: [
      breadcrumb([["Dining", "/dining"]]),
      {
        "@context": "https://schema.org",
        "@type": "Restaurant",
        name: `${brand} Restaurant`,
        servesCuisine: ["Indian", "Assamese", "Asian", "Continental"],
        openingHours: "Mo-Su 07:30-23:30",
        hasMenu: abs("/menu/hotel-de-blossom-menu.pdf"),
        telephone: hotel.phone,
        address,
        image: abs("/images/food/chicken-lababdar.webp"),
        containedInPlace: { "@id": `${SITE_URL}/#hotel` },
      },
    ],
  },
  {
    path: "/events",
    title: `${hotel.banquetHallName} & Events in Guwahati | ${brand}`,
    description: `Host weddings, receptions, birthdays and business meetings for up to ${hotel.banquetCapacity} guests at ${hotel.banquetHallName}, Chandmari, with catering from our own kitchen.`,
    image: "/images/banquet/banquet-3.webp",
    priority: 0.8,
    jsonLd: [
      breadcrumb([[hotel.banquetHallName, "/events"]]),
      {
        "@context": "https://schema.org",
        "@type": "EventVenue",
        name: hotel.banquetHallName,
        maximumAttendeeCapacity: hotel.banquetCapacity,
        telephone: hotel.phone,
        address,
        image: abs("/images/banquet/banquet-3.webp"),
        containedInPlace: { "@id": `${SITE_URL}/#hotel` },
      },
    ],
  },
  {
    path: "/about",
    title: `About | ${brand}, Chandmari, Guwahati`,
    description: `A quiet house in the middle of Guwahati. Meet ${brand}: rooms, a restaurant, ${hotel.banquetHallName} and a front desk that never sleeps.`,
    image: "/images/reception/reception-4.webp",
    priority: 0.6,
    jsonLd: [breadcrumb([["About", "/about"]])],
  },
  {
    path: "/contact",
    title: `Contact & Directions | ${brand}, Guwahati`,
    description: `Call ${hotel.phone}, message us on WhatsApp or send a booking request. ${hotel.address[0]}, Chandmari, Guwahati. Front desk open 24 hours.`,
    image: "/images/reception/reception-1.webp",
    priority: 0.7,
    jsonLd: [
      breadcrumb([["Contact", "/contact"]]),
      { "@context": "https://schema.org", "@type": "ContactPage", name: `Contact ${brand}`, url: abs("/contact") },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.q, acceptedAnswer: { "@type": "Answer", text: faq.a } })),
      },
    ],
  },
  {
    path: "/book",
    title: `Request a Booking | ${brand}`,
    description: `Send a stay, group or event request to the ${brand} front desk. Reception confirms availability and rates with you personally.`,
    sitemap: false,
    jsonLd: [],
  },
];

export const notFoundMeta: PageMeta = {
  path: "/404",
  title: `Page not found | ${brand}`,
  description: "This page could not be found.",
  index: false,
  sitemap: false,
};

export const staffMeta: PageMeta = {
  path: "/staff",
  title: `Front desk | ${brand}`,
  description: "Staff dashboard.",
  index: false,
  sitemap: false,
};

export const metaFor = (pathname: string): PageMeta => {
  const clean = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
  return pages.find((page) => page.path === clean) ?? notFoundMeta;
};

export const canonicalFor = (path: string) => (path === "/" ? `${SITE_URL}/` : abs(path));
export const imageFor = (meta: PageMeta) => abs(meta.image ?? ogImage.src);
export { ogImage };
