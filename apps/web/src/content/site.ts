export const hotel = {
  name: "Hotel De Blossom",
  tagline: "A stay in bloom",
  /** Main number: reception, answered 24×7. */
  phone: "+91 361 350 0047",
  phoneHref: "tel:+913613500047",
  whatsapp: "917664952255",
  whatsappDisplay: "+91 76649 52255",
  /** Direct lines shown on the contact page. */
  directLines: [
    { role: "General Manager", phone: "+91 91269 11616", href: "tel:+919126911616" },
    { role: "Operations Manager", phone: "+91 95553 66660", href: "tel:+919555366660" },
  ],
  email: "bookings@hoteldeblossom.com",
  address: ["Tulip Tower, MRD Road", "Chandmari, Guwahati", "Assam, India"],
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Hotel+De+Blossom+Tulip+Tower+MRD+Road+Chandmari+Guwahati",
  mapsEmbed: "https://www.google.com/maps?q=Hotel+De+Blossom,+MRD+Road,+Chandmari,+Guwahati&output=embed",
  socials: {
    instagram: "https://www.instagram.com/hoteldeblossom/",
    facebook: "https://www.facebook.com/hoteldeblossom/",
  },
  restaurantHours: "07:30 – 23:30, Monday to Sunday",
  breakfastHours: "07:00 – 10:00",
  banquetHallName: "Summit Hall",
  banquetCapacity: 190,
} as const;

export const whatsappLink = (text: string) => `https://wa.me/${hotel.whatsapp}?text=${encodeURIComponent(text)}`;

export type Picture = { src: string; alt: string };
/** Images are generated as `name.webp` (1800w) and `name-sm.webp` (900w). */
export const img = (path: string) => ({
  src: `/images/${path}.webp`,
  srcSet: `/images/${path}-sm.webp 900w, /images/${path}.webp 1800w`,
});

export type Room = {
  slug: string;
  name: string;
  /** Matches `room_rates.room_type` so staff-managed prices replace `fromPrice`. */
  rateKey: string;
  short: string;
  description: string;
  size: string;
  occupancy: string;
  bed: string;
  /** Omit when the published tariff is request-only. */
  fromPrice?: number;
  /** Optional feature pills to show in place of unconfirmed room specs. */
  highlights?: string[];
  /** Marks a seeded rate as provisional until staff replaces it with an approved tariff. */
  rateIsTemporary?: boolean;
  cover: string;
  /** Optional image cropped for the 4:3 room catalogue cards. */
  cardCover?: string;
  gallery: Array<{ path: string; alt: string }>;
  features: string[];
};

const commonFeatures = ["Air conditioning", "Flat-screen TV", "Wi-Fi", "En-suite bathroom with glass shower", "Backlit vanity mirror", "24×7 front desk"];

export const rooms: Room[] = [
  {
    slug: "deluxe",
    name: "Deluxe",
    rateKey: "Deluxe",
    short: "A restful double room with soft sage details and a bright sitting corner.",
    description:
      "A restful double room in soft ivory and sage, with a comfortable bed, a bright sitting corner and views across Guwahati. Thoughtful details and a calm palette make it an easy base for both leisure and business stays.",
    size: "23 m²",
    occupancy: "Up to 3 adults · 1 child",
    bed: "Double bed",
    fromPrice: 7500,
    cover: "rooms/deluxe/deluxe-room",
    cardCover: "rooms/deluxe/deluxe-card",
    gallery: [
      { path: "rooms/deluxe/deluxe-room", alt: "Deluxe double room with an upholstered headboard and sage cushions" },
      { path: "rooms/deluxe/deluxe-bed", alt: "Double bed with sage runner and a soft upholstered headboard" },
      { path: "rooms/deluxe/deluxe-window", alt: "Deluxe room sitting corner beside a tall window" },
      { path: "rooms/deluxe/deluxe-bathroom", alt: "Hotel bathroom vanity with a round illuminated mirror" },
    ],
    features: [...commonFeatures, "Lounge seating"],
  },
  {
    slug: "twin-deluxe",
    name: "Twin Deluxe",
    rateKey: "Twin Deluxe",
    short: "Two separate beds for friends, colleagues, or family travelling together.",
    description:
      "Designed for travelling companions, Twin Deluxe pairs two comfortable beds with the same quiet palette and thoughtful details as the rest of the house — a calm work corner, full-length drapes and a bright, modern bathroom.",
    size: "23 m²",
    occupancy: "Up to 2 adults · 1 child",
    bed: "Two single beds",
    fromPrice: 6500,
    cover: "rooms/twin-deluxe/twin-beds",
    gallery: [
      { path: "rooms/twin-deluxe/twin-beds", alt: "Twin Deluxe room with two separate beds and sage runners" },
      { path: "rooms/twin-deluxe/twin-room", alt: "Twin Deluxe room with two beds and a window-side lounge chair" },
      { path: "rooms/twin-deluxe/twin-window", alt: "Twin Deluxe room seen from the window side" },
      { path: "rooms/twin-deluxe/twin-bathroom", alt: "Hotel bathroom vanity with an illuminated mirror" },
    ],
    features: [...commonFeatures, "Work desk"],
  },
  {
    slug: "blossom-suite-room",
    name: "Blossom Suite Room",
    rateKey: "Blossom Suite Room",
    short: "Our most generous space — 50 m² with a separate living area.",
    description:
      "Blossom Suite Room is the house's most generous address: more than twice the space of a deluxe room, with a separate living and dining area, wide windows over the city and hills, and an elegant bathroom with an illuminated mirror. Ideal for longer stays, families and special occasions.",
    size: "50 m²",
    occupancy: "Up to 3 adults · 2 children",
    bed: "Bedroom + living area",
    fromPrice: 15000,
    cover: "rooms/blossom-suite-room/suite-bedroom",
    cardCover: "rooms/blossom-suite-room/suite-bedroom-card",
    gallery: [
      { path: "rooms/blossom-suite-room/suite-bedroom", alt: "Blossom Suite Room bedroom with a warm upholstered headboard" },
      { path: "rooms/blossom-suite-room/suite-lounge", alt: "Blossom Suite Room sitting area beside tall windows" },
      { path: "rooms/blossom-suite-room/suite-dining", alt: "Dining table in the Blossom Suite Room" },
      { path: "rooms/blossom-suite-room/suite-view", alt: "Guwahati and the surrounding hills from the hotel" },
    ],
    features: [...commonFeatures, "Separate living & dining area", "City and hill views", "Work desk"],
  },
  {
    slug: "premium",
    name: "Premium",
    rateKey: "Premium",
    short: "A bright sitting area beside a wide window, finished in warm timber and sage.",
    description:
      "Premium pairs a spacious couch area beside a wide window with warm timber details and sage upholstery, creating a relaxed place to unwind.",
    size: "Please confirm with reception",
    occupancy: "Please confirm with reception",
    bed: "Please confirm with reception",
    fromPrice: 4700,
    highlights: ["Spacious couch area"],
    cover: "rooms/premium/premium-seating",
    cardCover: "rooms/premium/premium-card",
    gallery: [
      { path: "rooms/premium/premium-seating", alt: "Premium sitting area beside a wide window with city views" },
      { path: "rooms/premium/premium-lounge", alt: "Premium sitting area beside a large Guwahati-facing window" },
      { path: "rooms/premium/premium-detail", alt: "Timber wall and upholstered chairs in the Premium room" },
    ],
    features: [...commonFeatures, "Sitting area", "Large window"],
  },
];

export const stayDetails = [
  { title: "Airport transfers", body: "Lokpriya Gopinath Bordoloi International Airport pickups and drops on request. Share your flight with the front desk." },
  { title: "24×7 front desk", body: "A real person at reception, all day and night, for arrivals, local advice, and anything you need." },
  { title: "All-day dining", body: "Breakfast from 07:00, and Indian, Assamese, Asian and continental plates until 23:30." },
  { title: hotel.banquetHallName, body: `An elegant hall for up to ${hotel.banquetCapacity} guests, with catering from our own kitchen.` },
  { title: "Heart of Chandmari", body: "A central Guwahati address at Tulip Tower, MRD Road — easy to reach from the railway station, the airport road and the city centre." },
  { title: "Arrival help", body: "Tell us your arrival time and the front desk will be ready with your keys, luggage help and directions." },
];

export const gallery: Array<{ path: string; alt: string; category: "Rooms" | "Reception" | "Dining" | "Banquet" | "Property" }> = [
  { path: "hero/night-sky", alt: "Hotel De Blossom at night with its illuminated rooftop sign", category: "Property" },
  { path: "reception/reception-1", alt: "Reception desk with backlit marble counter", category: "Reception" },
  { path: "reception/reception-2", alt: "Lobby lounge with sage sofas", category: "Reception" },
  { path: "reception/reception-4", alt: "Lobby seating with tufted green wing chairs", category: "Reception" },
  { path: "rooms/deluxe-double/double-bed", alt: "Deluxe Double bedroom", category: "Rooms" },
  { path: "rooms/deluxe-double/double-entrance", alt: "Deluxe Double lounge corner", category: "Rooms" },
  { path: "rooms/suite/suite-entrance", alt: "Executive Suite living and dining area", category: "Rooms" },
  { path: "rooms/suite/suite-bed-2", alt: "Executive Suite bedroom with city view", category: "Rooms" },
  { path: "rooms/twin/twin-bed", alt: "Deluxe Twin bedroom", category: "Rooms" },
  { path: "rooms/alt-double/alt-deluxe-double-bed", alt: "Guest room with sitting area", category: "Rooms" },
  { path: "rooms/premium-double/premium-double-bed", alt: "Guest room with timber panelling", category: "Rooms" },
  { path: "rooms/deluxe-double/double-bathroom", alt: "Guest bathroom", category: "Rooms" },
  { path: "banquet/banquet-3", alt: "Banquet hall set for a dinner celebration", category: "Banquet" },
  { path: "banquet/banquet-1", alt: "Banquet hall with buffet line", category: "Banquet" },
  { path: "banquet/meeting-2", alt: "Banquet hall in meeting layout", category: "Banquet" },
  { path: "banquet/banquet-2", alt: "Banquet hall with illuminated marble feature wall", category: "Banquet" },
  { path: "food/chicken-lababdar", alt: "Chicken Lababdar with whole spices", category: "Dining" },
  { path: "food/veg-biryani", alt: "Veg biryani with raita", category: "Dining" },
  { path: "food/lemon-coriander-soup", alt: "Lemon coriander soup", category: "Dining" },
  { path: "food/kungpao-chicken", alt: "Kung pao chicken", category: "Dining" },
  { path: "food/mango-and-banana-shake", alt: "Mango and banana shakes", category: "Dining" },
  { path: "food/sweet-and-sour-prawn", alt: "Sweet and sour prawn", category: "Dining" },
  { path: "food/yellow-dal-tadka", alt: "Yellow dal tadka", category: "Dining" },
];

/**
 * SAMPLE TEXT ONLY. Replace each entry with a real guest review (and the guest's permission to
 * show their name) before launch. Entries with `sample: true` show a visible "Sample" tag.
 */
export const testimonials: Array<{ quote: string; name: string; stay: string; sample?: boolean }> = [
  { quote: "A calm, spotless room and a front desk that sorted our airport pickup without us asking twice.", name: "Guest name", stay: "Stayed in a Deluxe", sample: true },
  { quote: "We held our family's reception here. The hall looked beautiful and the food kept everyone happy till late.", name: "Guest name", stay: "Hosted a reception", sample: true },
  { quote: "Central, quiet and easy to get around from. Breakfast with Assamese Jolpan was the best start to the day.", name: "Guest name", stay: "Stayed in the Blossom Suite Room", sample: true },
];

export const faqs = [
  { q: "Is my booking confirmed when I submit the form?", a: "Not yet. Your request goes straight to our front desk with a reference number. Reception will call or WhatsApp you to confirm availability and the final tariff — your stay is confirmed only after that conversation." },
  { q: "What are the check-in and check-out times?", a: "The front desk shares check-in and check-out timings when confirming your stay. Early arrival or late departure can often be arranged on request, subject to availability." },
  { q: "Do you arrange airport transfers?", a: "Yes. Share your flight details in the booking request or with reception and we will arrange a pickup or drop." },
  { q: "Are taxes included in the room price?", a: "Prices shown are starting nightly rates. Government taxes apply as per prevailing rules; reception will share the full tariff when confirming." },
  { q: `Can I host an event at ${hotel.banquetHallName}?`, a: `Yes — ${hotel.banquetHallName} hosts weddings, receptions, birthdays and corporate meetings for up to ${hotel.banquetCapacity} guests. Choose "Event" in the booking request and our team will plan it with you.` },
];
