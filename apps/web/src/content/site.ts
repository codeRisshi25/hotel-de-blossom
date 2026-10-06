export const hotel = {
  name: "Hotel De Blossom",
  tagline: "A stay in bloom",
  phone: "+91 95553 66660",
  phoneHref: "tel:+919555366660",
  whatsapp: "919555366660",
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
  fromPrice: number;
  cover: string;
  gallery: Array<{ path: string; alt: string }>;
  features: string[];
};

const commonFeatures = ["Air conditioning", "Flat-screen TV", "Wi-Fi", "En-suite bathroom with glass shower", "Backlit vanity mirror", "24×7 front desk"];

export const rooms: Room[] = [
  {
    slug: "deluxe-double",
    name: "Deluxe Double",
    rateKey: "Deluxe Double",
    short: "Sage-and-ivory calm with a generous double bed and lounge seating.",
    description:
      "A soft, restful room in sage, ivory and warm timber. A plush upholstered headboard, a quiet lounge corner for morning tea, and a backlit vanity make it an easy base for both leisure and business stays in Guwahati.",
    size: "23 m²",
    occupancy: "Up to 3 adults · 1 child",
    bed: "Double bed",
    fromPrice: 7000,
    cover: "rooms/deluxe-double/double-bed",
    gallery: [
      { path: "rooms/deluxe-double/double-bed", alt: "Deluxe Double room with upholstered headboard and sage cushions" },
      { path: "rooms/deluxe-double/double-entrance", alt: "Deluxe Double room seen from the entrance with lounge chairs" },
      { path: "rooms/deluxe-double/double-entrance-2", alt: "Deluxe Double with television wall and backlit mirror" },
      { path: "rooms/deluxe-double/double-bathroom", alt: "Deluxe Double bathroom with vessel basin and glass shower" },
    ],
    features: [...commonFeatures, "Lounge seating"],
  },
  {
    slug: "deluxe-twin",
    name: "Deluxe Twin",
    rateKey: "Deluxe Twin",
    short: "Two well-made beds for friends, colleagues, or family travelling together.",
    description:
      "Designed for travelling companions, the Deluxe Twin pairs two comfortable beds with the same quiet palette and thoughtful details as the rest of the house — a calm work corner, full-length drapes and a bright, modern bathroom.",
    size: "23 m²",
    occupancy: "Up to 2 adults · 1 child",
    bed: "Two single beds",
    fromPrice: 6500,
    cover: "rooms/twin/twin-bed",
    gallery: [
      { path: "rooms/twin/twin-bed", alt: "Deluxe Twin with two single beds and sage cushions" },
      { path: "rooms/twin/twin-entrance", alt: "Deluxe Twin seen from the entrance with armchair" },
      { path: "rooms/twin/twin-entrance-2", alt: "Deluxe Twin with television wall and work desk" },
      { path: "rooms/twin/twin-bathroom", alt: "Deluxe Twin bathroom with vessel basin and illuminated mirror" },
    ],
    features: [...commonFeatures, "Work desk"],
  },
  {
    slug: "executive-suite",
    name: "Executive Suite",
    rateKey: "Executive Suite",
    short: "Our most generous space — 50 m² with a separate living area.",
    description:
      "The Executive Suite is the house's grandest address: more than twice the space of a deluxe room, with a separate living and dining area for receiving guests, wide windows over the city and hills, and an elegant bathroom with an illuminated mirror. Ideal for longer stays, families and special occasions.",
    size: "50 m²",
    occupancy: "Up to 3 adults · 2 children",
    bed: "Bedroom + living area",
    fromPrice: 15000,
    cover: "rooms/suite/suite-entrance",
    gallery: [
      { path: "rooms/suite/suite-entrance", alt: "Executive Suite living area with sofas, dining table and hill views" },
      { path: "rooms/suite/suite-bed-2", alt: "Executive Suite bedroom with a window over Guwahati" },
      { path: "rooms/suite/suite-entrance-2", alt: "Executive Suite lounge with dining table and television" },
      { path: "rooms/suite/suite-bed-5", alt: "Executive Suite bed with bedside lamps" },
      { path: "rooms/suite/suite-bed-3", alt: "Executive Suite work desk and wardrobe" },
      { path: "rooms/suite/suite-bathroom", alt: "Executive Suite bathroom with glass shower" },
      { path: "rooms/suite/suite-bathroom-2", alt: "Executive Suite vanity with illuminated round mirror" },
    ],
    features: [...commonFeatures, "Separate living & dining area", "City and hill views", "Work desk"],
  },
];

export const stayDetails = [
  { title: "Airport transfers", body: "Lokpriya Gopinath Bordoloi International Airport pickups and drops on request. Share your flight with the front desk." },
  { title: "24×7 front desk", body: "A real person at reception, all day and night, for arrivals, local advice, and anything you need." },
  { title: "All-day dining", body: "Breakfast from 07:00, and Indian, Assamese, Asian and continental plates until 23:30." },
  { title: "Banquet & meetings", body: `An elegant hall for up to ${hotel.banquetCapacity} guests, with catering from our own kitchen.` },
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

export const faqs = [
  { q: "Is my booking confirmed when I submit the form?", a: "Not yet. Your request goes straight to our front desk with a reference number. Reception will call or WhatsApp you to confirm availability and the final tariff — your stay is confirmed only after that conversation." },
  { q: "What are the check-in and check-out times?", a: "The front desk shares check-in and check-out timings when confirming your stay. Early arrival or late departure can often be arranged on request, subject to availability." },
  { q: "Do you arrange airport transfers?", a: "Yes. Share your flight details in the booking request or with reception and we will arrange a pickup or drop." },
  { q: "Are taxes included in the room price?", a: "Prices shown are starting nightly rates. Government taxes apply as per prevailing rules; reception will share the full tariff when confirming." },
  { q: "Can I host an event at the hotel?", a: `Yes — our banquet hall hosts weddings, receptions, birthdays and corporate meetings for up to ${hotel.banquetCapacity} guests. Choose "Event" in the booking request and our team will plan it with you.` },
];
