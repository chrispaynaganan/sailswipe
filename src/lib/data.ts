// Demo content for the SailSwipe prototype. Copy comes from the Figma file.

export const ME = {
  first: "Andrew",
  last: "Longbottom",
  email: "andrew@longbottom.com",
  password: "jY2xvR56@7",
  avatar: "/img/av-andrew.webp",
  avatarLg: "/img/av-andrew-lg.webp",
};

export type Opportunity = {
  id: string;
  kind: "Opportunity" | "Charter";
  name: string;
  boat: string;
  photo: string;
  captain: Contact;
  description: string;
  from: string;
  to: string;
  start: string;
  end: string;
  rally: string;
  expires: string;
  aboard: string;
  crews: string;
  smoking: string;
  cabin: string;
  languages: string;
  money: string;
  travel: string;
};

export type Contact = { id: string; name: string; avatar: string };

export const CONTACTS: Record<string, Contact> = {
  timothy: { id: "timothy", name: "Timothy", avatar: "/img/av-timothy.webp" },
  jason: { id: "jason", name: "Jason", avatar: "/img/av-jason.webp" },
  robert: { id: "robert", name: "Robert", avatar: "/img/av-robert.webp" },
  janna: { id: "janna", name: "Janna", avatar: "/img/av-janna.webp" },
  james: { id: "james", name: "James Matthews", avatar: "/img/av-james-lg.webp" },
  sofia: { id: "sofia", name: "Sofia Lindström", avatar: "/img/av-sofia.webp" },
  dustin: { id: "dustin", name: "Dustin", avatar: "/img/crew-dustin.webp" },
};

export const OPPORTUNITIES: Opportunity[] = [
  {
    id: "sydney-vancouver",
    kind: "Opportunity",
    name: "Sydney Vancouver Rally",
    boat: "Oceania 5000",
    photo: "/img/opp-sydney.webp",
    captain: CONTACTS.timothy,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
    from: "Sydney, AU",
    to: "Vancouver, CA",
    start: "March 2025",
    end: "March 2025",
    rally: "ARC Pacific",
    expires: "2 Weeks",
    aboard: "15",
    crews: "8",
    smoking: "No",
    cabin: "Shared Cabin",
    languages: "English, French, Mandarin",
    money: "Shared Expenses",
    travel: "Negotiable",
  },
  {
    id: "caribbean-1500",
    kind: "Opportunity",
    name: "Caribbean 1500",
    boat: "ST-6000",
    photo: "/img/report-caribbean.webp",
    captain: CONTACTS.robert,
    description: "Island-hopping from Antigua to the Grenadines. Looking for a watch keeper who's happy on night shifts and loves a good sunset.",
    from: "St. John's, AG",
    to: "Bequia, VC",
    start: "June 2025",
    end: "July 2025",
    rally: "Caribbean 1500",
    expires: "1 Week",
    aboard: "6",
    crews: "3",
    smoking: "No",
    cabin: "Private Cabin",
    languages: "English",
    money: "Paid Position",
    travel: "Covered",
  },
  {
    id: "baltic-summer",
    kind: "Opportunity",
    name: "Baltic Summer Loop",
    boat: "Horizon 450",
    photo: "/img/report-baltic.webp",
    captain: CONTACTS.janna,
    description: "Six weeks through Stockholm's archipelago, the Åland Islands and down to Copenhagen. Tricky tides, long light and great marinas.",
    from: "Stockholm, SE",
    to: "Copenhagen, DK",
    start: "July 2025",
    end: "August 2025",
    rally: "ARC Baltic",
    expires: "3 Weeks",
    aboard: "5",
    crews: "2",
    smoking: "Yes",
    cabin: "Shared Cabin",
    languages: "English, Swedish",
    money: "Shared Expenses",
    travel: "Negotiable",
  },
];

export const CHARTERS: Opportunity[] = [
  {
    id: "sea-voyager-charter",
    kind: "Charter",
    name: "Whitsundays Catamaran Charter",
    boat: "Sea Voyager · Oceania 5000",
    photo: "/img/boat-sea-voyager.webp",
    captain: CONTACTS.james,
    description: "A luxurious catamaran designed for comfort and speed, chartered with skipper for a week around the Whitsunday Islands.",
    from: "Airlie Beach, AU",
    to: "Airlie Beach, AU",
    start: "May 2025",
    end: "May 2025",
    rally: "Independent",
    expires: "2 Weeks",
    aboard: "10",
    crews: "2",
    smoking: "No",
    cabin: "Private Cabin",
    languages: "English",
    money: "Per Cabin",
    travel: "Not Covered",
  },
];

export type CrewProfile = {
  id: string;
  name: string;
  nationality: string;
  photo: string;
  about: { label: string; value: string; half?: boolean }[];
  work: { label: string; value: string }[];
  skills: { name: string; level: string }[];
  nautical: string;
  regions: string;
  rallies: string;
  qualifications: { org: string; level: string }[];
  voyages: { from: string; to: string; year: string }[];
};

export const CREW: CrewProfile[] = [
  {
    id: "dustin",
    name: "Dustin",
    nationality: "American",
    photo: "/img/crew-dustin.webp",
    about: [
      { label: "Name", value: "Dustin Hale", half: true },
      { label: "Birthday", value: "December 8, 1975", half: true },
      { label: "Gender", value: "Prefer not to say" },
      { label: "Nationality", value: "British", half: true },
      { label: "Residence", value: "Wales", half: true },
      { label: "Smoker?", value: "Yes", half: true },
      { label: "Languages", value: "English, French", half: true },
      { label: "Available For", value: "Hire, Shared Costs" },
    ],
    work: [
      { label: "Years of Experience", value: "3-5 years" },
      { label: "Ocean Miles Sailed", value: "6000+" },
      { label: "Coastal Miles Sailed", value: "3001-6000" },
      { label: "Worked as a ...", value: "Sextant, Making Sails, Repairing Sails" },
    ],
    skills: [
      { name: "Steer by Compass", level: "Competent" },
      { name: "Watch Keeping", level: "Basic" },
      { name: "Trim Sails", level: "None" },
      { name: "Reefing", level: "Competent" },
      { name: "Work the Front Deck", level: "Competent" },
    ],
    nautical: "Independent, ARC Pacific, ARC USA",
    regions: "South East Asia & East Asia, Northern Europe, Central & North America, North Pacific Islands, Caribbean",
    rallies: "Caribbean 1500, ARC DelMarVa, ARC Pacific",
    qualifications: [
      { org: "CWO", level: "CWO I JaZ Tidal" },
      { org: "NFB Sweden", level: "CWO III JaZ Tidal" },
    ],
    voyages: [
      { from: "Floreana", to: "Lyford Cay", year: "2006" },
      { from: "Pago Pago", to: "Esmeraldas", year: "2012" },
    ],
  },
];

export type Message = { id: string; from: "me" | "them"; text: string; time?: string };
export type Thread = {
  id: string;
  contact: Contact;
  time: string;
  unread?: boolean;
  archived?: boolean;
  /** A brand-new conversation: you can send one message, then wait for a reply */
  fresh?: boolean;
  messages: Message[];
};

export const THREADS: Thread[] = [
  {
    id: "timothy",
    contact: CONTACTS.timothy,
    time: "8:05 pm",
    messages: [
      { id: "t1", from: "me", text: "Hey, are you open to joining a crew?", time: "7:01 am" },
      { id: "t2", from: "them", text: "Yeah, where’s the trip?" },
      { id: "t3", from: "me", text: "We’re sailing to Galapagos Island, looking for one more crew member." },
      { id: "t4", from: "them", text: "Okay. Thank you." },
      {
        id: "t5",
        from: "me",
        text: "I’m planning to join an adventure rally soon and would love for you to come along! It’s going to be an amazing experience. Let me know if you’re interested, and I can share more details! Hope to have you with us!",
        time: "8:05 pm",
      },
    ],
  },
  {
    id: "jason",
    contact: CONTACTS.jason,
    time: "10:15 pm",
    unread: true,
    messages: [
      { id: "j1", from: "me", text: "Can you bring the spare winch handle on Saturday?", time: "9:40 pm" },
      { id: "j2", from: "them", text: "Yeah, of course! Is that all, or do you need anything else?", time: "10:15 pm" },
    ],
  },
  {
    id: "robert",
    contact: CONTACTS.robert,
    time: "01/06/2025 10:15 pm",
    archived: true,
    messages: [{ id: "r1", from: "them", text: "Yeah, of course! Is that all, or do you need anything else?", time: "10:15 pm" }],
  },
  {
    id: "janna",
    contact: CONTACTS.janna,
    time: "11/12/2023 8:05 pm",
    archived: true,
    messages: [
      { id: "n1", from: "them", text: "Thanks for the lift back to the marina!", time: "7:50 pm" },
      { id: "n2", from: "me", text: "Awesome! Until next time then.", time: "8:05 pm" },
    ],
  },
];

/** Replies for brand-new conversations, so the "wait for a reply" rule can be tried out */
export const AUTO_REPLIES: Record<string, string> = {
  timothy: "Yeah, where’s the trip?",
  robert: "Hi! Happy to chat. Have you done a night watch before?",
  janna: "Hej! The Baltic is lovely in July. What’s your sailing background?",
  james: "Hi! It’s still available. Want to come see it at the marina?",
  dustin: "Hey! Thanks for reaching out. Where are you headed?",
  sofia: "Hi there! Glad you liked the report.",
};

export type Listing = {
  id: string;
  name: string;
  price: string;
  date: string;
  photo: string;
  seller: Contact;
  description: string;
};

const RAYMARINE =
  "Upgrade your navigation with the Raymarine Axiom 9 – a powerful 9-inch touchscreen chartplotter with built-in GPS, sonar, and Wi-Fi connectivity. Featuring RealVision 3D sonar, an intuitive Lighthouse 3 OS, and seamless integration with autopilot and radar systems, this unit is perfect for both coastal cruisers and offshore sailors. Comes with mounting bracket, power cable, and preloaded charts. Lightly used and in excellent condition.";

const lt = (name: string, price: string, date: string, photo: string, description: string): Listing => ({
  id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  name,
  price,
  date,
  photo,
  seller: CONTACTS.james,
  description,
});

export const LISTINGS: Listing[] = [
  lt("Raymarine Axiom 9 Chartplotter", "$1,200", "Jan 28, 2025", "/img/mk-raymarine.webp", RAYMARINE),
  lt("Dinghy with 6HP Outboard", "$1,500", "Jan 25, 2025", "/img/mk-dinghy.webp", "Inflatable 3.1m dinghy with a 6HP four-stroke outboard. Serviced last season, comes with oars, pump and cover."),
  lt("Self-Inflating Life Raft", "$900", "Jan 22, 2025", "/img/mk-liferaft.webp", "Six-person offshore life raft in a hard canister. Last serviced in 2024, certificate included."),
  lt("Sailboat Wind Vane Steering System", "$750", "Jan 20, 2025", "/img/mk-windvane.webp", "Mechanical self-steering for boats up to 42ft. All the mounting hardware is included."),
  lt("Full Set of Offshore Foul Weather Gear (L)", "$350", "Jan 18, 2025", "/img/mk-foulweather.webp", "Jacket and salopettes, size L. Worn on one Atlantic crossing, no leaks."),
  lt("Marine Solar Panel Kit (200W)", "$450", "Jan 15, 2025", "/img/mk-solar.webp", "Two 100W semi-flexible panels with an MPPT controller and cabling."),
  lt("AIS Transponder with GPS", "$600", "Jan 12, 2025", "/img/mk-ais.webp", "Class B AIS transponder with an external GPS antenna. Works with most chartplotters."),
  lt("Portable Watermaker (12V, 30L/hr)", "$1,800", "Jan 10, 2025", "/img/mk-watermaker.webp", "Compact 12V watermaker making around 30 litres an hour. Fresh membrane fitted."),
  lt("Used Cruising Spinnaker (38ft-42ft boat)", "$400", "Jan 8, 2025", "/img/mk-spinnaker.webp", "Asymmetric cruising spinnaker with a snuffer. Good condition, a few small repairs."),
  lt("EPIRB with GPS & 5-Year Battery", "$350", "Jan 5, 2025", "/img/mk-epirb.webp", "Category II EPIRB with built-in GPS. Battery good until 2029."),
];

/** Detail view of the first listing uses Figma's own price and photo */
export const LISTING_DETAIL_OVERRIDES: Record<string, Partial<Listing>> = {
  "raymarine-axiom-9-chartplotter": { price: "$10,199", photo: "/img/mk-raymarine-lg.webp" },
};

export type Report = {
  id: string;
  title: string;
  summary: string;
  tag: string;
  photo?: string;
  author: Contact;
  date: string;
  route: string;
};

export const REPORTS: Report[] = [
  {
    id: "caribbean",
    title: "Smooth Sailing Through the Caribbean",
    summary:
      "A detailed log of my month-long journey across the Caribbean, covering key anchorages, local customs, and unexpected weather patterns. Includes tips for provisioning and must-visit spots.",
    tag: "Caribbean",
    photo: "/img/report-caribbean.webp",
    author: CONTACTS.james,
    date: "January 15, 2025",
    route:
      "Departure Port: Sydney, AU\nArrival Port: Auckland, NZ\nDistance Sailed: 1,300 nautical miles\nWeather Conditions: Clear skies with moderate winds (10-15 knots). Calm seas most of the way with occasional strong gusts near the Coromandel Peninsula.\nNavigation Notes:\n• Maintain a safe distance from commercial shipping lanes near Auckland.\n• Entry is easiest via the western channel; call the port on VHF Channel 16 for docking instructions.",
  },
  {
    id: "baltic",
    title: "Navigating the Baltic: Challenges & Highlights",
    summary:
      "Insights from a summer cruise through the Baltic Sea, featuring tricky tides, stunning landscapes, and the best marinas along the way. A must-read for first-time Baltic sailors!",
    tag: "Baltic Sea",
    photo: "/img/report-baltic.webp",
    author: CONTACTS.sofia,
    date: "August 2, 2024",
    route:
      "Departure Port: Stockholm, SE\nArrival Port: Copenhagen, DK\nDistance Sailed: 620 nautical miles\nWeather Conditions: Long light evenings, mostly light winds with a few lively days in the Åland Sea.\nNavigation Notes:\n• Archipelago channels are narrow; keep to the marked fairways.\n• Book guest berths in Copenhagen early in high season.",
  },
];

export const BUSINESSES = [
  {
    name: "Harbor Supplies Co.",
    address: "123 Dockside Lane, Port Sydney, AU",
    phone: "+61 2 9876 5432",
    email: "info@harborsupplies.com",
    web: "www.harborsupplies.com",
    channel: "Channel 12",
    lng: "-12.3965896306",
    lat: "32.0167340679",
  },
  {
    name: "Seafarer’s Lounge",
    address: "45 Marina Drive, Port Vancouver, CA",
    phone: "+1 604 123 4567",
    email: "info@seafarerlounge.com",
    web: "www.seafarerlounge.com",
    channel: "Channel 05",
    lng: "6.0567894568",
    lat: "-27.8567932109",
  },
];

export const FORMALITY = {
  country: "New Zealand",
  port: "Port Auckland",
  date: "June 3, 2021",
  overview:
    "Customs clearance at Port Auckland is designed to ensure compliance with local laws while providing a smooth experience for sailors. All incoming vessels must complete customs procedures within 24 hours of arrival.",
  sections: [
    {
      title: "Required Documents",
      items: [
        "Vessel Registration: Proof of ownership and valid registration papers.",
        "Crew List: Names, nationalities, and roles of all crew members.",
        "Passports: Valid passports for all crew and passengers.",
        "Customs Declaration Form: Declare goods, cargo, and restricted items.",
      ],
      ordered: false,
    },
    {
      title: "Custom Clearance Process",
      items: [
        "Pre-Arrival Notification: Notify the customs office 48 hours before arrival via email (customs@portauckland.nz) or the Port Auckland Customs Clearance online form.",
        "Arrival Communication: Contact Port Control on VHF Channel 16 upon arrival and dock in the designated Customs Clearance Area.",
        "Inspection: A customs officer will board the vessel for inspection. Provide the required documents and declare any restricted items.",
        "Completion: Once clearance is granted, you will receive an official customs receipt. Retain this for your records.",
      ],
      ordered: true,
    },
    {
      title: "Restricted Items",
      items: [
        "Firearms: Must be declared and stored as directed by customs.",
        "Alcohol and Tobacco: Limited to personal allowance; excess must be declared.",
        "Food Products: Certain fresh foods may be subject to quarantine.",
        "Illegal Substances: Strictly prohibited and subject to legal penalties.",
      ],
      ordered: true,
    },
  ],
};

export const COUNTRIES = ["Australia", "Bahamas", "Anguilla", "Canada", "Greece", "New Zealand", "Philippines", "Sweden", "United States"];
export const REGIONS = ["North", "South", "East", "West"];
export const PORTS = ["Port Auckland", "Port Sydney", "Port Vancouver", "Port Nassau"];
export const LANGUAGES = ["English", "Mandarin", "French", "Spanish", "German", "Swedish", "Tagalog"];
export const HULLS = ["Monohull", "Catamaran", "Trimaran"];
export const MANUFACTURERS = ["Oceanic Yachts", "Beneteau", "Jeanneau", "Lagoon", "Hallberg-Rassy"];
export const MODELS = ["Oceania 5000", "ST-6000", "Horizon 450", "Oceanis 46.1", "Lagoon 42"];
export const SKILLS = ["Steer by Compass", "Watch Keeping", "Trim Sails", "Reefing", "Work the Front Deck", "Navigation", "Anchoring"];
export const SKILL_LEVELS = ["None", "Basic", "Competent", "Expert"];
export const NAUTICAL = ["Sextant", "VFH Radio", "Radar", "Making Sails", "Outbound Engine Maintenance", "Diesel Engine Maintenance", "Repairing Sails"];
export const GEO_REGIONS = [
  "Antarctica & Sub-Antarctic Islands",
  "South Indian Ocean",
  "North Indian Ocean & Sea",
  "South East Asia & East Asia",
  "Caribbean",
  "South Pacific Islands",
  "North Pacific Islands",
  "South America",
  "Central & North America",
  "Northern Europe",
  "Mediterranean & Black Sea",
  "West Africa & South Atlantic Islands",
  "Western Europe & North Atlantic Islands",
];
export const RALLIES = [
  "Independent",
  "ARC Pacific",
  "World ARC",
  "ARC Portugal",
  "Malts Cruise",
  "ARC USA",
  "Caribbean 1500",
  "ARC Channel Islands",
  "ARC Europe",
  "ARC DelMarVa",
  "ARC Baltic",
  "ARC Bahamas",
  "ARC - Atlantic Rally for Cruisers",
];
export const AWARDING_ORGS = ["CWO", "NFB Sweden", "RYA", "ASA", "US Sailing"];
export const QUAL_LEVELS = ["CWO I JaZ Tidal", "CWO II JaZ Tidal", "CWO III JaZ Tidal", "Day Skipper", "Yachtmaster Offshore"];
export const ROLES = ["Skipper", "First Mate", "Watch-Keeper", "Deckhand", "Cook", "Navigator"];
export const EXPERIENCE_LEVELS = ["Deckhand", "Watch-Keeper", "First Mate", "Skipper"];
export const EXPIRY = ["1 Week", "2 Weeks", "3 Weeks", "1 Month"];
export const MONEY = ["Shared Expenses", "Paid Position", "Free", "Per Cabin"];
export const TRAVEL = ["Negotiable", "Covered", "Not Covered"];
export const CABINS = ["Shared Cabin", "Private Cabin", "Bunk"];
export const AVAILABLE_FOR = ["Hire", "Shared Costs", "Free"];
export const GENDERS = ["Male", "Female", "Prefer not to say"];
export const NATIONALITIES = ["American", "Australian", "British", "Canadian", "Filipino", "New Zealander", "Swedish"];
