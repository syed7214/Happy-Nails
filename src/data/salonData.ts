import heroSanctuaryBgImg from '../assets/images/hero_sanctuary_bg_1794071391976.jpg';
import heroLuxuryManicureImg from '../assets/images/hero_luxury_manicure_1794060381088.jpg';
import serviceClassicManicureImg from '../assets/images/service_classic_manicure_unique_1794071392126.jpg';
import serviceGelManicureImg from '../assets/images/service_gel_manicure_1794060381577.jpg';
import serviceNailExtensionsImg from '../assets/images/service_nail_extensions_1794060383563.jpg';
import serviceNailArtImg from '../assets/images/service_nail_art_1794060384584.jpg';
import serviceLuxuryPedicureImg from '../assets/images/service_luxury_pedicure_1794060384205.jpg';

import menuClassicManicureImg from '../assets/images/menu_classic_manicure_1794071910721.jpg';
import menuGelManicureImg from '../assets/images/menu_gel_manicure_1794071912034.jpg';
import menuNailExtensionsImg from '../assets/images/menu_nail_extensions_1794071912430.jpg';
import menuNailArtImg from '../assets/images/menu_nail_art_1794071914501.jpg';
import menuPedicureImg from '../assets/images/menu_pedicure_1794071915921.jpg';

import locationKingstonExteriorImg from '../assets/images/location_kingston_exterior_1794071917422.jpg';
import locationRichmondInteriorImg from '../assets/images/location_richmond_interior_1794071917447.jpg';

import galleryMicroFrenchImg from '../assets/images/gallery_micro_french_1794071393601.jpg';
import galleryPearlChromeImg from '../assets/images/gallery_pearl_chrome_1794071395186.jpg';
import galleryTortoiseshellArtImg from '../assets/images/gallery_tortoiseshell_art_1794071396175.jpg';
import galleryVelvetCatEyeImg from '../assets/images/gallery_velvet_cat_eye_1794071396808.jpg';
import gallerySculptedBallerinaImg from '../assets/images/gallery_sculpted_ballerina_1794071399352.jpg';
import galleryBotanicalFootRitualImg from '../assets/images/gallery_botanical_foot_ritual_1794071399716.jpg';

export interface Service {
  id: string;
  name: string;
  subtitle: string;
  durationMinutes: number;
  priceFrom: number;
  description: string;
  includes: string[];
  imageUrl: string;
  bookingImageUrl: string;
  category: 'hands' | 'enhancements' | 'feet';
}

export interface Technician {
  id: string;
  name: string;
  role: string;
  specialty: string;
}

export interface OpeningHourRow {
  days: string;
  hours: string;
  openHour: number;
  closeHour: number;
}

export interface SalonLocation {
  id: string;
  name: string;
  badge: string;
  addressLine1: string;
  city: string;
  postcode: string;
  fullAddress: string;
  phone: string;
  phoneHref: string;
  email: string;
  transitNote: string;
  mapDirectionsUrl: string;
  imageUrl: string;
  openingHours: OpeningHourRow[];
  isPrimary?: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  artist: string;
  serviceId: string;
  tag: 'Gel & BIAB' | 'Extensions' | 'Nail Art' | 'Botanical Spa';
  aspectClass: string;
  imageUrl: string;
}

export type BookingStatus = 'confirmed' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  referenceCode: string;
  serviceId: string;
  serviceName: string;
  durationMinutes: number;
  priceFrom: number;
  technicianId: string;
  technicianName: string;
  locationId: string;
  locationName: string;
  locationAddress: string;
  dateISO: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "10:30"
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  notes?: string;
  status: BookingStatus;
  createdAt: string;
}

/**
 * PHOTO_URLS — Centralized placeholder & editorial photo dictionary.
 * Swap any URL string below with your own client photography paths or CDN URLs.
 */
export const PHOTO_URLS = {
  heroBackground: heroSanctuaryBgImg,
  heroEditorial: heroLuxuryManicureImg,
  // Services Menu section images
  menuManicure: menuClassicManicureImg,
  menuGelManicure: menuGelManicureImg,
  menuNailExtensions: menuNailExtensionsImg,
  menuNailArt: menuNailArtImg,
  menuPedicure: menuPedicureImg,
  // Booking Step 1 Selection Panel images
  bookingManicure: serviceClassicManicureImg,
  bookingGelManicure: serviceGelManicureImg,
  bookingNailExtensions: serviceNailExtensionsImg,
  bookingNailArt: serviceNailArtImg,
  bookingPedicure: serviceLuxuryPedicureImg,
  // Gallery Lookbook images
  galleryMicroFrench: galleryMicroFrenchImg,
  galleryPearlChrome: galleryPearlChromeImg,
  galleryTortoiseshellArt: galleryTortoiseshellArtImg,
  galleryVelvetCatEye: galleryVelvetCatEyeImg,
  gallerySculptedBallerina: gallerySculptedBallerinaImg,
  galleryBotanicalFootRitual: galleryBotanicalFootRitualImg,
  // Location images
  locationKingston: locationKingstonExteriorImg,
  locationRichmond: locationRichmondInteriorImg,
};

export const SERVICES: Service[] = [
  {
    id: 'manicure',
    name: 'Manicure',
    subtitle: 'Signature Botanical Care',
    durationMinutes: 45,
    priceFrom: 32,
    description:
      'Precision nail shaping, gentle Russian-inspired cuticle refinement, warm organic jojoba oil massage, and your choice of breathable high-gloss polish or natural buff.',
    includes: ['Bespoke nail shaping', 'Cuticle conditioning', 'Warm botanical hand balm'],
    imageUrl: PHOTO_URLS.menuManicure,
    bookingImageUrl: PHOTO_URLS.bookingManicure,
    category: 'hands',
  },
  {
    id: 'gel-manicure',
    name: 'Gel Manicure',
    subtitle: 'Long-Wear Gloss & BIAB Strength',
    durationMinutes: 60,
    priceFrom: 45,
    description:
      'Chip-resistant Japanese & UK builder gel (BIAB) or pure colour gel cured to a mirror shine. Formulated to nourish and strengthen natural nails for up to 3 weeks.',
    includes: ['Hema-free BIAB option', '3-week mirror gloss', 'Vitamin E cuticle elixir'],
    imageUrl: PHOTO_URLS.menuGelManicure,
    bookingImageUrl: PHOTO_URLS.bookingGelManicure,
    category: 'hands',
  },
  {
    id: 'nail-extensions',
    name: 'Nail Extensions',
    subtitle: 'Sculpted Soft Gel & Tailored Length',
    durationMinutes: 90,
    priceFrom: 65,
    description:
      'Weightless, natural-looking sculpted extensions tailored to your hand anatomy—from soft almond and ballerina to crisp square, finished with sheer blush or full colour.',
    includes: ['Custom length & architecture', 'Apres Gel-X or hard gel sculpt', 'Silk-smooth finish'],
    imageUrl: PHOTO_URLS.menuNailExtensions,
    bookingImageUrl: PHOTO_URLS.bookingNailExtensions,
    category: 'enhancements',
  },
  {
    id: 'nail-art',
    name: 'Nail Art',
    subtitle: 'Bespoke Micro-Detail & French',
    durationMinutes: 75,
    priceFrom: 55,
    description:
      'Hand-painted editorial artistry by our senior technicians—micro French tips, botanical swirls, chrome glazing, negative space, or delicate 24k gold leaf accents.',
    includes: ['Full gel manicure base', 'Bespoke hand-painted design', 'Crystal top-coat seal'],
    imageUrl: PHOTO_URLS.menuNailArt,
    bookingImageUrl: PHOTO_URLS.bookingNailArt,
    category: 'enhancements',
  },
  {
    id: 'pedicure',
    name: 'Pedicure',
    subtitle: 'Eucalyptus & Travertine Spa Ritual',
    durationMinutes: 60,
    priceFrom: 48,
    description:
      'A restorative mineral foot soak infused with eucalyptus and camellia, gentle callus smoothing, sea-salt exfoliation, lower-leg tension massage, and gel or classic lacquer.',
    includes: ['Mineral botanical soak', 'Sea-salt & sage scrub', 'Gel or classic polish'],
    imageUrl: PHOTO_URLS.menuPedicure,
    bookingImageUrl: PHOTO_URLS.bookingPedicure,
    category: 'feet',
  },
];

export const TECHNICIANS: Technician[] = [
  {
    id: 'any',
    name: 'Any available',
    role: 'First Available Senior Stylist',
    specialty: 'Fastest availability across all treatments',
  },
  {
    id: 'elena',
    name: 'Elena Vance',
    role: 'Creative Director & Nail Artist',
    specialty: 'Bespoke Nail Art & Micro French',
  },
  {
    id: 'chloe',
    name: 'Chloe Lin',
    role: 'Senior BIAB Specialist',
    specialty: 'Gel Manicure & Natural Nail Rehab',
  },
  {
    id: 'maya',
    name: 'Maya Patel',
    role: 'Master Extensionist',
    specialty: 'Sculpted Extensions & Almond Architecture',
  },
  {
    id: 'sophie',
    name: 'Sophie Laurent',
    role: 'Botanical Spa Therapist',
    specialty: 'Luxury Pedicure & Restorative Hand Care',
  },
];

export const LOCATIONS: SalonLocation[] = [
  {
    id: 'kingston',
    name: 'Kingston Salon',
    badge: 'Flagship Sanctuary',
    addressLine1: '39 Richmond Rd',
    city: 'Kingston upon Thames',
    postcode: 'KT2 5BW',
    fullAddress: '39 Richmond Rd, Kingston upon Thames, KT2 5BW',
    phone: '020 8546 8821',
    phoneHref: 'tel:+442085468821',
    email: 'kingston@happynailsuk.co.uk',
    transitNote: '2 minutes walk from Kingston Railway Station · Pay & display parking adjacent on Canbury Park Rd',
    mapDirectionsUrl:
      'https://www.google.com/maps/search/?api=1&query=39+Richmond+Rd,+Kingston+upon+Thames+KT2+5BW',
    imageUrl: PHOTO_URLS.locationKingston,
    isPrimary: true,
    openingHours: [
      { days: 'Monday – Wednesday', hours: '09:30 – 19:00', openHour: 9.5, closeHour: 19 },
      { days: 'Thursday – Friday', hours: '09:30 – 20:00', openHour: 9.5, closeHour: 20 },
      { days: 'Saturday', hours: '09:00 – 18:30', openHour: 9, closeHour: 18.5 },
      { days: 'Sunday', hours: '10:30 – 17:00', openHour: 10.5, closeHour: 17 },
    ],
  },
  {
    id: 'richmond-preview',
    name: 'Richmond Hill Studio',
    badge: 'Sister Boutique',
    addressLine1: '14 Friars Stile Rd',
    city: 'Richmond, London',
    postcode: 'TW10 6NE',
    fullAddress: '14 Friars Stile Rd, Richmond, TW10 6NE',
    phone: '020 8940 3190',
    phoneHref: 'tel:+442089403190',
    email: 'richmond@happynailsuk.co.uk',
    transitNote: '8 minutes walk from Richmond Station · Near Terrace Gardens',
    mapDirectionsUrl:
      'https://www.google.com/maps/search/?api=1&query=14+Friars+Stile+Rd,+Richmond+TW10+6NE',
    imageUrl: PHOTO_URLS.locationRichmond,
    isPrimary: false,
    openingHours: [
      { days: 'Monday – Friday', hours: '09:30 – 19:00', openHour: 9.5, closeHour: 19 },
      { days: 'Saturday', hours: '09:00 – 18:00', openHour: 9, closeHour: 18 },
      { days: 'Sunday', hours: '11:00 – 17:00', openHour: 11, closeHour: 17 },
    ],
  },
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Matcha & Ivory Micro-French',
    artist: 'Elena Vance',
    serviceId: 'nail-art',
    tag: 'Nail Art',
    aspectClass: 'aspect-[4/3]',
    imageUrl: PHOTO_URLS.galleryMicroFrench,
  },
  {
    id: 'gal-2',
    title: 'Glazed Pearl Rose BIAB',
    artist: 'Chloe Lin',
    serviceId: 'gel-manicure',
    tag: 'Gel & BIAB',
    aspectClass: 'aspect-[4/3]',
    imageUrl: PHOTO_URLS.galleryPearlChrome,
  },
  {
    id: 'gal-3',
    title: 'Dewy Rose-Milk Sculpted Almond',
    artist: 'Maya Patel',
    serviceId: 'nail-extensions',
    tag: 'Extensions',
    aspectClass: 'aspect-[4/3]',
    imageUrl: PHOTO_URLS.gallerySculptedBallerina,
  },
  {
    id: 'gal-4',
    title: 'Amber Tortoiseshell & Forest Gold',
    artist: 'Elena Vance',
    serviceId: 'nail-art',
    tag: 'Nail Art',
    aspectClass: 'aspect-[4/3]',
    imageUrl: PHOTO_URLS.galleryTortoiseshellArt,
  },
  {
    id: 'gal-5',
    title: 'Lavender & Sea Salt Foot Ritual',
    artist: 'Sophie Laurent',
    serviceId: 'pedicure',
    tag: 'Botanical Spa',
    aspectClass: 'aspect-[4/3]',
    imageUrl: PHOTO_URLS.galleryBotanicalFootRitual,
  },
  {
    id: 'gal-6',
    title: 'Celadon Velvet Cat-Eye Gel',
    artist: 'Chloe Lin',
    serviceId: 'gel-manicure',
    tag: 'Gel & BIAB',
    aspectClass: 'aspect-[4/3]',
    imageUrl: PHOTO_URLS.galleryVelvetCatEye,
  },
];

export interface Testimonial {
  id: string;
  quote: string;
  outcomeHighlight: string;
  authorName: string;
  authorContext: string;
  serviceId: string;
  serviceName: string;
  artistName: string;
  rating: number;
  visitCount: string;
  dateLabel: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'rev-1',
    quote:
      'My natural nails were paper-thin after years of harsh removals elsewhere. Chloe switched me to HEMA-free BIAB with botanical jojoba conditioning, and within three visits my natural nails grew past my fingertips without a single split or lift.',
    outcomeHighlight: 'Zero lifting after 3+ weeks of wear',
    authorName: 'Clara Pemberton',
    authorContext: 'Editorial Stylist · Kingston upon Thames',
    serviceId: 'gel-manicure',
    serviceName: 'Gel Manicure (BIAB)',
    artistName: 'Chloe Lin',
    rating: 5,
    visitCount: '8th visit',
    dateLabel: 'Verified Guest · October',
  },
  {
    id: 'rev-2',
    quote:
      'I brought a reference sketch for my wedding nails and Elena hand-painted the most delicate sage and ivory micro-French tips with 24k gold leaf. Every single guest at Hampton Court asked where I had my nails done.',
    outcomeHighlight: 'Bespoke bridal artistry that lasted through our honeymoon',
    authorName: 'Sophie-Louise Mercer',
    authorContext: 'Bridal Client · Surbiton & Kingston',
    serviceId: 'nail-art',
    serviceName: 'Nail Art',
    artistName: 'Elena Vance',
    rating: 5,
    visitCount: '5th visit',
    dateLabel: 'Verified Guest · November',
  },
  {
    id: 'rev-3',
    quote:
      'Most salons rush through extensions in 40 minutes, leaving them thick and uncomfortable. Maya spent 90 calm minutes sculpting rose-milk almond extensions tailored to my nail beds—they feel completely weightless and look like my own nails.',
    outcomeHighlight: 'Custom-sculpted architecture with natural apex balance',
    authorName: 'Ananya Deshmukh',
    authorContext: 'Architect · Richmond Rd',
    serviceId: 'nail-extensions',
    serviceName: 'Nail Extensions',
    artistName: 'Maya Patel',
    rating: 5,
    visitCount: '6th visit',
    dateLabel: 'Verified Guest · October',
  },
  {
    id: 'rev-4',
    quote:
      'The Eucalyptus & Travertine Spa Pedicure is genuinely the calmest hour of my month. Between the warm camellia soak, sea-salt exfoliation, and lower-leg massage, it feels like a private Mayfair spa right here on Richmond Road.',
    outcomeHighlight: 'Restorative botanical ritual & 4-week mirror gloss',
    authorName: 'Harriet Sterling-Vane',
    authorContext: 'Founder, Botanical Press · Teddington',
    serviceId: 'pedicure',
    serviceName: 'Pedicure',
    artistName: 'Sophie Laurent',
    rating: 5,
    visitCount: '12th visit',
    dateLabel: 'Verified Guest · November',
  },
  {
    id: 'rev-5',
    quote:
      'I booked the Signature Manicure before a portrait shoot in Richmond Park. The Russian-inspired cuticle work and warm jojoba balm left my hands looking effortlessly polished and hydrated for weeks.',
    outcomeHighlight: 'Impeccable cuticle precision & natural glow',
    authorName: 'Beatrice Montgomery',
    authorContext: 'Portrait Photographer · Ham Common',
    serviceId: 'manicure',
    serviceName: 'Manicure',
    artistName: 'Sophie Laurent',
    rating: 5,
    visitCount: '4th visit',
    dateLabel: 'Verified Guest · November',
  },
  {
    id: 'rev-6',
    quote:
      'The Celadon Velvet Cat-Eye gel is mesmerizing in natural daylight. Every time I move my hand it shifts from soft sage to champagne pearl—and after three weeks there is not a single chip.',
    outcomeHighlight: 'Dimensional magnetic sheen with 3-week durability',
    authorName: 'Freya Lindqvist',
    authorContext: 'Interior Designer · Kingston Riverside',
    serviceId: 'gel-manicure',
    serviceName: 'Gel Manicure (Cat-Eye)',
    artistName: 'Chloe Lin',
    rating: 5,
    visitCount: '9th visit',
    dateLabel: 'Verified Guest · November',
  },
];

const STORAGE_KEY = 'happy_nails_kingston_bookings_v1';

export function formatLocalDateISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getNext14Days(): {
  dateISO: string;
  dayShort: string;
  dayNumber: string;
  monthShort: string;
  fullLabel: string;
  isToday: boolean;
  dayOfWeek: number;
}[] {
  const days = [];
  const now = new Date();
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  for (let i = 0; i < 14; i++) {
    const d = new Date(todayMidnight);
    d.setDate(todayMidnight.getDate() + i);
    const dateISO = formatLocalDateISO(d);
    const dayShort = d.toLocaleDateString('en-GB', { weekday: 'short' });
    const dayNumber = String(d.getDate()).padStart(2, '0');
    const monthShort = d.toLocaleDateString('en-GB', { month: 'short' });
    const fullLabel = d.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    days.push({
      dateISO,
      dayShort,
      dayNumber,
      monthShort,
      fullLabel,
      isToday: i === 0,
      dayOfWeek: d.getDay(),
    });
  }
  return days;
}

export function formatDisplayDate(dateISO: string): string {
  const [y, m, d] = dateISO.split('-').map(Number);
  if (!y || !m || !d) return dateISO;
  const dateObj = new Date(y, m - 1, d);
  return dateObj.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function createInitialSampleBookings(): Booking[] {
  const now = new Date();
  const todayISO = formatLocalDateISO(now);

  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const tomorrowISO = formatLocalDateISO(tomorrow);

  const dayAfter = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2);
  const dayAfterISO = formatLocalDateISO(dayAfter);

  return [
    {
      id: 'sample-bk-101',
      referenceCode: 'HN-8492',
      serviceId: 'gel-manicure',
      serviceName: 'Gel Manicure',
      durationMinutes: 60,
      priceFrom: 45,
      technicianId: 'chloe',
      technicianName: 'Chloe Lin',
      locationId: 'kingston',
      locationName: 'Kingston Salon',
      locationAddress: '39 Richmond Rd, Kingston upon Thames, KT2 5BW',
      dateISO: todayISO,
      timeSlot: '14:30',
      customerName: 'Amelia Kensington',
      customerPhone: '07700 900412',
      customerEmail: 'amelia.k@example.co.uk',
      notes: 'Soft oat milk BIAB shade if available.',
      status: 'confirmed',
      createdAt: new Date(now.getTime() - 3600 * 1000 * 5).toISOString(),
    },
    {
      id: 'sample-bk-102',
      referenceCode: 'HN-8510',
      serviceId: 'nail-art',
      serviceName: 'Nail Art',
      durationMinutes: 75,
      priceFrom: 55,
      technicianId: 'elena',
      technicianName: 'Elena Vance',
      locationId: 'kingston',
      locationName: 'Kingston Salon',
      locationAddress: '39 Richmond Rd, Kingston upon Thames, KT2 5BW',
      dateISO: todayISO,
      timeSlot: '16:15',
      customerName: 'Charlotte Davies',
      customerPhone: '07812 334910',
      customerEmail: 'charlotte.davies@example.co.uk',
      notes: 'Sage green micro French tip from the lookbook.',
      status: 'confirmed',
      createdAt: new Date(now.getTime() - 3600 * 1000 * 2).toISOString(),
    },
    {
      id: 'sample-bk-103',
      referenceCode: 'HN-8544',
      serviceId: 'nail-extensions',
      serviceName: 'Nail Extensions',
      durationMinutes: 90,
      priceFrom: 65,
      technicianId: 'maya',
      technicianName: 'Maya Patel',
      locationId: 'kingston',
      locationName: 'Kingston Salon',
      locationAddress: '39 Richmond Rd, Kingston upon Thames, KT2 5BW',
      dateISO: tomorrowISO,
      timeSlot: '11:00',
      customerName: 'Priya Nair',
      customerPhone: '07911 224819',
      customerEmail: 'priya.nair@example.co.uk',
      status: 'confirmed',
      createdAt: new Date(now.getTime() - 3600 * 1000).toISOString(),
    },
    {
      id: 'sample-bk-104',
      referenceCode: 'HN-8599',
      serviceId: 'pedicure',
      serviceName: 'Pedicure',
      durationMinutes: 60,
      priceFrom: 48,
      technicianId: 'sophie',
      technicianName: 'Sophie Laurent',
      locationId: 'kingston',
      locationName: 'Kingston Salon',
      locationAddress: '39 Richmond Rd, Kingston upon Thames, KT2 5BW',
      dateISO: dayAfterISO,
      timeSlot: '13:30',
      customerName: 'Hannah Sterling',
      customerPhone: '07788 410293',
      customerEmail: 'h.sterling@example.co.uk',
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    },
  ];
}

export function getBookings(): Booking[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = createInitialSampleBookings();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      const initial = createInitialSampleBookings();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return parsed;
  } catch {
    return createInitialSampleBookings();
  }
}

export function saveNewBooking(
  data: Omit<Booking, 'id' | 'referenceCode' | 'status' | 'createdAt'>
): Booking {
  const current = getBookings();
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  const newBooking: Booking = {
    ...data,
    id: `bk-${Date.now()}-${randomDigits}`,
    referenceCode: `HN-${randomDigits}`,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  };
  const updated = [newBooking, ...current];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return newBooking;
}

export function updateBookingStatus(id: string, status: BookingStatus): Booking[] {
  const current = getBookings();
  const updated = current.map((b) => (b.id === id ? { ...b, status } : b));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function resetDemoBookings(): Booking[] {
  const initial = createInitialSampleBookings();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  return initial;
}

export interface TimeSlotOption {
  time: string; // "HH:MM"
  endTime: string; // "HH:MM"
  period: 'Morning' | 'Afternoon' | 'Evening';
  available: boolean;
  reason?: 'past' | 'booked' | 'duration_overlap' | 'busy';
}

function minutesToHHMM(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function hashSeed(str: string): number {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash);
}

/**
 * Generates realistic time slots for a given date, service duration, location, and technician.
 * - Disables past times if dateISO is today.
 * - Filters out slots that would extend past salon closing hours based on serviceDuration.
 * - Checks existing confirmed bookings in localStorage for overlap.
 * - Uses deterministic pseudo-random unavailability so longer treatments have fewer open windows.
 */
export function generateTimeSlotsForDate(
  dateISO: string,
  serviceDurationMinutes: number,
  locationId: string,
  technicianId: string,
  existingBookings: Booking[]
): TimeSlotOption[] {
  const [y, m, d] = dateISO.split('-').map(Number);
  const slotDate = new Date(y, m - 1, d);
  const dayOfWeek = slotDate.getDay(); // 0 = Sun, 6 = Sat

  // Determine opening & closing minutes based on day of week
  let openMinutes = 9 * 60 + 30; // 09:30
  let closeMinutes = 19 * 60; // 19:00

  if (dayOfWeek === 0) {
    // Sunday
    openMinutes = 10 * 60 + 30; // 10:30
    closeMinutes = 17 * 60; // 17:00
  } else if (dayOfWeek === 6) {
    // Saturday
    openMinutes = 9 * 60; // 09:00
    closeMinutes = 18 * 60 + 30; // 18:30
  } else if (dayOfWeek === 4 || dayOfWeek === 5) {
    // Thu - Fri late evening in Kingston
    openMinutes = 9 * 60 + 30;
    closeMinutes = 20 * 60; // 20:00
  }

  // Step interval: 30 minutes or 45 minutes depending on service duration
  const interval = serviceDurationMinutes >= 75 ? 45 : 30;
  // Cap effective window check at 150 mins so multi-service packages still show afternoon slots
  const effectiveDurationForWindow = Math.min(serviceDurationMinutes, 150);

  const now = new Date();
  const todayISO = formatLocalDateISO(now);
  const isToday = dateISO === todayISO;
  const isPastDate = dateISO < todayISO;
  const currentMinutesOfDay = now.getHours() * 60 + now.getMinutes();

  // Confirmed bookings on this date and location
  const activeDayBookings = existingBookings.filter(
    (b) =>
      b.dateISO === dateISO &&
      b.locationId === locationId &&
      b.status === 'confirmed' &&
      (technicianId === 'any' || b.technicianId === technicianId || b.technicianId === 'any')
  );

  const slots: TimeSlotOption[] = [];

  for (
    let startMin = openMinutes;
    startMin + effectiveDurationForWindow <= closeMinutes;
    startMin += interval
  ) {
    const endMin = startMin + serviceDurationMinutes;
    const timeStr = minutesToHHMM(startMin);
    const endTimeStr = minutesToHHMM(endMin);

    let period: 'Morning' | 'Afternoon' | 'Evening' = 'Morning';
    if (startMin >= 17 * 60) {
      period = 'Evening';
    } else if (startMin >= 12 * 60) {
      period = 'Afternoon';
    }

    if (isPastDate || (isToday && startMin <= currentMinutesOfDay + 20)) {
      slots.push({
        time: timeStr,
        endTime: endTimeStr,
        period,
        available: false,
        reason: 'past',
      });
      continue;
    }

    // Check overlap with actual saved bookings
    const hasBookingConflict = activeDayBookings.some((b) => {
      const [bh, bm] = b.timeSlot.split(':').map(Number);
      const bStart = bh * 60 + bm;
      const bEnd = bStart + (b.durationMinutes || 60);
      return startMin < bEnd && endMin > bStart;
    });

    if (hasBookingConflict) {
      slots.push({
        time: timeStr,
        endTime: endTimeStr,
        period,
        available: false,
        reason: 'booked',
      });
      continue;
    }

    // Deterministic availability simulation factoring in service duration
    const seed = hashSeed(`${dateISO}-${timeStr}-${locationId}-${technicianId}`);
    // Longer services (75-90m) require longer consecutive technician blocks, so ~32% of slots are busy;
    // shorter services (45-60m) have ~22% busy slots.
    const busyThreshold = serviceDurationMinutes >= 75 ? 32 : 22;
    const isRandomlyBusy = seed % 100 < busyThreshold;

    slots.push({
      time: timeStr,
      endTime: endTimeStr,
      period,
      available: !isRandomlyBusy,
      reason: isRandomlyBusy ? 'busy' : undefined,
    });
  }

  return slots;
}

/**
 * Generates and downloads an RFC 5545 .ics calendar file for a confirmed booking
 */
export function downloadBookingICS(booking: Booking): void {
  const [year, month, day] = booking.dateISO.split('-').map(Number);
  const [hour, minute] = booking.timeSlot.split(':').map(Number);

  const startDate = new Date(year, month - 1, day, hour, minute, 0);
  const endDate = new Date(startDate.getTime() + booking.durationMinutes * 60 * 1000);

  const formatICSDate = (d: Date) => {
    const pad = (n: number) => String(n).padStart(2, '0');
    return (
      `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T` +
      `${pad(d.getHours())}${pad(d.getMinutes())}00`
    );
  };

  const uid = `${booking.id}@happynailsuk.co.uk`;
  const dtStamp = formatICSDate(new Date());
  const dtStart = formatICSDate(startDate);
  const dtEnd = formatICSDate(endDate);

  const descriptionLines = [
    `Treatment: ${booking.serviceName} (${booking.durationMinutes} mins — from £${booking.priceFrom})`,
    `Stylist: ${booking.technicianName}`,
    `Booking Reference: ${booking.referenceCode}`,
    `Salon: ${booking.locationName}, ${booking.locationAddress}`,
    `Tagline: A little luxury, made just for you.`,
  ].join('\\n');

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Happy Nails Kingston//Booking System//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:Happy Nails ✦ ${booking.serviceName}`,
    `LOCATION:${booking.locationName}\\, ${booking.locationAddress}`,
    `DESCRIPTION:${descriptionLines}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute(
    'download',
    `Happy-Nails-${booking.referenceCode}-${booking.dateISO}.ics`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
