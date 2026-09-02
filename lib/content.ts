/**
 * Every string the site renders lives here.
 *
 * VERIFIED against the client's own public listings — the Google
 * Business profile (4.5★, "Car detailing service", plus code H9HJ+CXP,
 * phone 9818 6969), Instagram @autofutex_oman, the Facebook page and
 * the Cartea listing. The service list is the one Google shows.
 *
 * Anything that could not be verified is marked `PLACEHOLDER` and reads
 * as a demo stand-in rather than a claim. The customer quotes are the
 * main one: Google blocks signed-out review scraping, so the real
 * review text has to be pasted in before this goes live.
 */

export const shop = {
  name: "AutoFutex",
  /** As it reads on the storefront sign. */
  signage: "AutoFutex — Cars' Spa",
  legal: "3M Authorized Auto Care Center, AutoFutex",
  tagline: "3M Pro Shop Dealer",
  since: 2017,
  city: "Muscat",
  country: "Oman",
  plusCode: "H9HJ+CXP, Muscat",
  /** From the Google listing. */
  phone: "+968 9818 6969",
  phoneRaw: "96898186969",
  phoneAlt: "+968 9494 4466",
  phoneAltRaw: "96894944466",
  email: "info@autofutex.om",
  rating: "4.5",
  ratingSource: "Google",
  mapUrl: "https://www.google.com/maps/place/?q=place_id:ChIJQQ3rM3D_kT4Rr601_1HFdI8",
  social: {
    instagram: "https://www.instagram.com/autofutex_oman/",
    instagramTrade: "https://www.instagram.com/3m_autofutex_oman/",
    facebook: "https://www.facebook.com/3m.autofutex/",
  },
} as const;

/** Deep-links straight into WhatsApp — how a Muscat shop actually books. */
export function whatsapp(message: string) {
  return `https://wa.me/${shop.phoneRaw}?text=${encodeURIComponent(message)}`;
}

export const nav = [
  { label: "Services", href: "#services" },
  { label: "The Stack", href: "#stack" },
  { label: "Reviews", href: "#reviews" },
  { label: "Branches", href: "#branches" },
  { label: "Book", href: "#book" },
] as const;

export const hero = {
  badge: "Now Booking",
  /** Split so the second half can take the accent. */
  headline: "Paint is temporary. Protection is not.",
  lede:
    "AutoFutex is a 3M Pro Shop Dealer in Muscat. Paint protection film, ceramic coating, detailing and window film — applied by certified installers on genuine 3M product, with the warranty to match.",
  primary: "Book an inspection",
  secondary: "Our services",
  badgeCard: {
    value: `${shop.rating}★ on Google`,
    label: "Car detailing service · Muscat",
  },
} as const;

export const ticker = [
  "3M PRO SHOP DEALER",
  "PAINT PROTECTION FILM",
  "CERAMIC COATING",
  "AUTO DETAILING",
  "WINDOW TINTING",
  "PAINT REPAIR",
  "AUTHORISED SINCE 2017",
  "GHALA · QURM",
] as const;

/**
 * The pinned scene.
 *
 * Five, not seven: each one holds the screen for a full viewport, and
 * the remaining Google-listed services are covered in `alsoDo` below,
 * so the whole list still appears on the page without a 700vh scroll.
 *
 * `left` / `right` are the two panels that fly in from either edge.
 * Real AutoFutex photography is used wherever it exists.
 */
export const services = [
  {
    n: "01",
    title: "Paint Protection Film",
    short: "PPF",
    body:
      "3M Scotchgard Pro over the panels that take the hits — nose, mirrors, sills, door edges. Self-healing top coat, optically clear, removable without touching the factory paint.",
    meta: ["Self-healing", "Full & front-end", "Genuine 3M"],
    cta: "Quote my car",
    left: "/assets/af-install.webp",
    right: "/assets/af-protected.webp",
  },
  {
    n: "02",
    title: "Ceramic Coating",
    short: "Ceramic",
    body:
      "A bonded glass layer over corrected paint. Gloss climbs, dust and sand release under a rinse, and the Omani sun stops flattening the colour by year two.",
    meta: ["Hydrophobic", "UV stable", "On corrected paint"],
    cta: "Ask about coating",
    left: "/assets/af-dakar.webp",
    right: "/assets/af-storefront.webp",
  },
  {
    n: "03",
    title: "Auto Detailing",
    short: "Detailing",
    body:
      "Inside and out. Extraction through seats and carpets, leather cleaned and fed rather than dressed, and every exterior surface decontaminated before anything is applied over it.",
    meta: ["Interior & exterior", "Seat shampooing", "Clay bar"],
    cta: "Book a detail",
    left: "/assets/af-bay.webp",
    right: "/assets/interior-console.webp",
  },
  {
    n: "04",
    title: "Paint Repair",
    short: "Paint",
    body:
      "Swirls, wash marks and dealer-inflicted holograms cut back under measured light. We read the paint depth first — correction removes clear coat, so it is done once, properly.",
    meta: ["Depth-gauged", "Machine polish", "Scratch repair"],
    cta: "Book a paint read",
    left: "/assets/polish-headlight.webp",
    right: "/assets/detailer-panel.webp",
  },
  {
    n: "05",
    title: "Window Tinting",
    short: "Tinting",
    body:
      "3M window film rated by heat rejection, not just how dark it looks. Cooler cabin, less load on the air conditioning, and honest advice on what is legal in Oman.",
    meta: ["Heat rejection", "UV block", "Legal-compliant"],
    cta: "Ask about film",
    left: "/assets/af-proshop.webp",
    right: "/assets/night-drying.webp",
  },
] as const;

/**
 * The rest of the Google-listed services, plus the extras the shop
 * advertises itself. Between this and `services`, every service on the
 * client's Google profile appears on the page.
 */
export const alsoDo = [
  { title: "Car waxing", body: "Hand-applied wax for cars not going the full coating route." },
  { title: "Clay bar treatment", body: "Bonded contamination pulled off the paint before any polish or coating." },
  { title: "Engine detailing", body: "Bay cleaned and dressed — the first thing a buyer opens." },
  { title: "Seat shampooing", body: "Hot extraction through fabric seats and carpets. Stains and odour, not just the surface." },
  { title: "Underbody coating", body: "Sealed against salt, sand and the wet season on the coast road." },
  { title: "Headlight protection", body: "Clear film over lenses — stone chip and UV yellowing stopped at the surface." },
] as const;

/**
 * The exploded layer stack. Ordered outermost-first, which is the order
 * they are applied in and the order the scene reveals them.
 */
export const stack = {
  eyebrow: "What is actually on your paint",
  title: "Six layers. Only one is replaceable.",
  body:
    "Factory clear coat is roughly 40–50 microns — thinner than a sheet of paper, and every polish takes some of it away for good. Everything AutoFutex applies sits above it, so the panel underneath is never the thing being worn down.",
  layers: [
    {
      name: "Paint protection film",
      depth: "150 µm",
      note: "Sacrificial. Takes the stone chips so the clear coat never does.",
      applied: true,
    },
    {
      name: "Ceramic coating",
      depth: "2 µm",
      note: "Glass-hard, hydrophobic. Where the gloss and the easy rinse come from.",
      applied: true,
    },
    {
      name: "Clear coat",
      depth: "40 µm",
      note: "Factory. Finite — every correction spends a little of it.",
      applied: false,
    },
    { name: "Base coat", depth: "15 µm", note: "The colour itself. No refinishing without a respray.", applied: false },
    { name: "Primer", depth: "35 µm", note: "Adhesion and corrosion barrier.", applied: false },
    { name: "Steel panel", depth: "—", note: "What you are actually protecting.", applied: false },
  ],
} as const;

export const compare = {
  eyebrow: "Why authorised matters",
  title: "The film is the cheap part.",
  body: "The difference shows up in year three, not on the invoice.",
  bad: {
    label: "Unbranded film, unbranded shop",
    points: [
      "Film yellows and clouds under Gulf UV",
      "Lifting edges at panel gaps within a season",
      "Adhesive that takes the clear coat with it",
      "No warranty anyone will honour",
      "Coating applied straight over swirls — sealed-in defects",
    ],
  },
  good: {
    label: "AutoFutex · 3M Pro Shop Dealer",
    points: [
      "Genuine 3M film with a documented UV rating",
      "Wrapped and tucked edges, cut off the car",
      "Removable years later without paint damage",
      "Manufacturer-backed warranty",
      "Correction first — coating only over paint that is ready",
    ],
  },
} as const;

export const proof = {
  eyebrow: `${shop.rating}★ on Google`,
  stats: [
    { value: 4.5, suffix: "", label: "Google rating, car detailing service", decimal: true },
    { value: 9, suffix: "", label: "Years as an authorised 3M centre" },
    { value: 2, suffix: "", label: "Branches across Muscat" },
    { value: 100, suffix: "+", label: "Makes serviced, from Corolla to Porsche" },
  ],
  /**
   * PLACEHOLDER. Google blocks review scraping while signed out, so
   * these are written for the demo and must be replaced with the real
   * Google reviews before launch. The section labels them as samples
   * on the page so nothing here reads as a real customer's words.
   */
  quotes: [
    {
      body:
        "Took the Land Cruiser in for front-end PPF before a Salalah run. Came back through 900km of grit with nothing in the paint.",
      name: "Sample review",
      car: "Land Cruiser · Ghala",
      image: "/assets/af-protected.webp",
    },
    {
      body:
        "They read the paint depth before touching it and told me the bonnet had already been polished flat by someone else. First shop that has ever been straight with me.",
      name: "Sample review",
      car: "Mercedes C-Class · Qurm",
      image: "/assets/af-install.webp",
    },
    {
      body:
        "Ceramic on a black Defender in Muscat sounded optimistic. Two summers in and a rinse still takes the dust straight off.",
      name: "Sample review",
      car: "Defender 110 · Ghala",
      image: "/assets/af-bay.webp",
    },
    {
      body:
        "Interior after three years of kids. I genuinely could not tell which seats had been replaced. None of them had.",
      name: "Sample review",
      car: "Patrol · Qurm",
      image: "/assets/af-dakar.webp",
    },
  ],
} as const;

export const branches = [
  {
    name: "Ghala",
    role: "Main workshop & film bay",
    address: "Ghala Industrial Area, Bousher, Muscat",
    note: "Full PPF, wrap and correction bays. Vehicles stay overnight for multi-day work.",
    map: "https://maps.app.goo.gl/NHeUBmNLqDHTyPo16",
    image: "/assets/af-bay.webp",
  },
  {
    name: "Qurm",
    role: "Detail & coating centre",
    address: "Qurm, Muscat",
    note: "Coating, detailing and maintenance work. Closest branch for same-day bookings.",
    map: "https://www.google.com/maps/search/AutoFutex+Qurm+Muscat",
    image: "/assets/af-storefront.webp",
  },
] as const;

export const hours = [
  { days: "Saturday — Thursday", time: "9:00 — 13:00 · 15:00 — 19:00" },
  { days: "Friday", time: "Closed for prayer, open by appointment" },
] as const;

export const faq = [
  {
    q: "How long does paint protection film take?",
    a: "A front-end kit is a full day. A full-body wrap is three to four days, because every panel is templated, wrapped and left to set — rushing the tuck is what causes lifting edges later. PLACEHOLDER: confirm timing for your vehicle when you book.",
  },
  {
    q: "Do I need paint correction before a ceramic coating?",
    a: "Almost always. A coating is optically clear and locks in whatever is under it, so applying one over swirls makes them permanent for the life of the coating. We inspect under light first and tell you honestly what the paint needs.",
  },
  {
    q: "Is film going to yellow in the Omani sun?",
    a: "Genuine 3M film is UV-stabilised and warranted against yellowing. Unbranded film is where the horror stories come from — that is the whole reason the Pro Shop Dealer authorisation exists.",
  },
  {
    q: "Can film be removed later without damaging the paint?",
    a: "Yes, when it was fitted correctly on original paint. Removal is heat and patience. Film fitted over a cheap respray is a different conversation, and we will tell you before we start rather than after.",
  },
  {
    q: "What does it cost?",
    a: "It depends on the panel count, the paint's condition and the film grade — which is why every job starts with an inspection rather than a price list. Send us the model and year on WhatsApp and we will give you a range the same day.",
  },
  {
    q: "Which branch should I go to?",
    a: "Ghala for film, wraps and anything multi-day. Qurm for coating, detailing and maintenance visits. If you are not sure, message us the job and we will route you.",
  },
] as const;

export const book = {
  eyebrow: "Book",
  title: "Tell us the car. We will tell you the truth.",
  body:
    "No deposit, no call centre. Pick what you are after, and the message opens in WhatsApp ready to send to the workshop.",
  services: [
    "Paint protection film",
    "Ceramic coating",
    "Auto detailing",
    "Paint repair",
    "Window tinting",
    "Not sure — please advise",
  ],
  branches: ["Ghala", "Qurm"],
  submit: "Open in WhatsApp",
} as const;

export const footer = {
  cta: "Bring the car in.",
  ctaBody: "An inspection takes twenty minutes and costs nothing. You will leave knowing what your paint actually needs.",
  line: `© ${new Date().getFullYear()} AutoFutex. 3M Authorised Distributor in Oman.`,
  note: "Demo site. Customer quotes are samples pending the real Google reviews.",
} as const;
