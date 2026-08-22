export interface Volcano {
  name: string;
  slug: string;
  country: string;
  elevation: string;
  type: "stratovolcano" | "shield" | "caldera" | "cinder cone" | "complex";
  lastEruption: string;
  status: "active" | "dormant" | "extinct";
  description: string;
  funFact: string;
  lat: number;
  lng: number;
}

export const volcanoes: Volcano[] = [
  {
    name: "Mauna Loa",
    slug: "mauna-loa",
    country: "USA (Hawaii)",
    elevation: "4,169 m",
    type: "shield",
    lastEruption: "2022",
    status: "active",
    description:
      "The world's largest active volcano by volume. Its base rises from the ocean floor, making it over 17,000 m tall from base to summit.",
    funFact: "Mauna Loa is so massive it depressed the ocean floor under its weight — when it erupts, the whole island subsides.",
    lat: 19.475,
    lng: -155.608,
  },
  {
    name: "Mount St. Helens",
    slug: "mount-st-helens",
    country: "USA (Washington)",
    elevation: "2,549 m",
    type: "stratovolcano",
    lastEruption: "2008",
    status: "active",
    description:
      "Famous for its catastrophic 1980 eruption that killed 57 people and removed 400m from the summit.",
    funFact: "The 1980 eruption released 24 megatons of thermal energy — 1,600 times the atomic bomb dropped on Hiroshima.",
    lat: 46.2,
    lng: -122.18,
  },
  {
    name: "Mount Vesuvius",
    slug: "mount-vesuvius",
    country: "Italy",
    elevation: "1,281 m",
    type: "complex",
    lastEruption: "1944",
    status: "active",
    description:
      "Famous for destroying Pompeii and Herculaneum in 79 AD. One of the most dangerous volcanoes in the world due to nearby population.",
    funFact: "Vesuvius is the only active volcano on mainland Europe — 3 million people live in its danger zone.",
    lat: 40.821,
    lng: 14.426,
  },
  {
    name: "Krakatoa",
    slug: "krakatoa",
    country: "Indonesia",
    elevation: "813 m",
    type: "caldera",
    lastEruption: "2018 (Anak Krakatoa)",
    status: "active",
    description:
      "Site of the most powerful volcanic eruption in recorded history (1883). The explosion was heard 4,800 km away.",
    funFact: "The 1883 eruption caused global temperatures to drop 1.2°C for years and produced tsunamis 30m high.",
    lat: -6.102,
    lng: 105.423,
  },
  {
    name: "Yellowstone Caldera",
    slug: "yellowstone",
    country: "USA (Wyoming)",
    elevation: "2,805 m",
    type: "caldera",
    lastEruption: "70,000 years ago",
    status: "dormant",
    description:
      "A massive supervolcano containing the world's largest concentration of geothermal features, including Old Faithful geyser.",
    funFact: "Yellowstone's magma chamber is so large it could fill the Grand Canyon 11 times — a super-eruption would affect the entire planet.",
    lat: 44.43,
    lng: -110.67,
  },
  {
    name: "Mount Fuji",
    slug: "mount-fuji",
    country: "Japan",
    elevation: "3,776 m",
    type: "stratovolcano",
    lastEruption: "1707",
    status: "dormant",
    description:
      "Japan's tallest and most iconic mountain. A nearly perfect volcanic cone that has been a sacred site for centuries.",
    funFact: "Mount Fuji last erupted in 1707, showering Tokyo (then Edo) with volcanic ash — it's been quiet for 300+ years.",
    lat: 35.361,
    lng: 138.727,
  },
  {
    name: "Eyjafjallajökull",
    slug: "eyjafjallajokull",
    country: "Iceland",
    elevation: "1,651 m",
    type: "stratovolcano",
    lastEruption: "2010",
    status: "active",
    description:
      "An ice-capped volcano in southern Iceland whose 2010 eruption disrupted air travel across Europe for weeks.",
    funFact: "The 2010 eruption grounded 100,000 flights and stranded 10 million travelers — all from a relatively small eruption.",
    lat: 63.633,
    lng: -19.617,
  },
  {
    name: "Kilauea",
    slug: "kilauea",
    country: "USA (Hawaii)",
    elevation: "1,222 m",
    type: "shield",
    lastEruption: "2023",
    status: "active",
    description:
      "One of the most active volcanoes on Earth, erupting almost continuously from 1983 to 2018.",
    funFact: "Kilauea's 2018 eruption destroyed over 700 homes and added 700 acres of new land to Hawaii's Big Island.",
    lat: 19.421,
    lng: -155.287,
  },
];

export interface Earthquake {
  name: string;
  date: string;
  magnitude: number;
  location: string;
  depth: string;
  casualties?: string;
  description: string;
  impact: string;
}

export const majorEarthquakes: Earthquake[] = [
  {
    name: "Valdivia Earthquake",
    date: "May 22, 1960",
    magnitude: 9.5,
    location: "Chile",
    depth: "33 km",
    casualties: "~5,700",
    description:
      "The largest earthquake ever recorded. It triggered tsunamis that crossed the Pacific Ocean.",
    impact:
      "Tsunami waves reached Hawaii (15m), Japan (6m), and the Philippines. The ground subsided 2m along 1,000 km of coastline.",
  },
  {
    name: "Alaska Earthquake",
    date: "March 27, 1964",
    magnitude: 9.2,
    location: "Alaska, USA",
    depth: "25 km",
    casualties: "131",
    description:
      "The most powerful earthquake in North American history. Caused massive landslides and tsunamis.",
    impact:
      "The ground dropped 2.4m in places. Tsunamis hit the Oregon and California coasts. Anchorage was heavily damaged.",
  },
  {
    name: "Indian Ocean Earthquake",
    date: "December 26, 2004",
    magnitude: 9.1,
    location: "Sumatra, Indonesia",
    depth: "30 km",
    casualties: "~227,898",
    description:
      "The deadliest earthquake in modern history. Its tsunami killed people across 14 countries.",
    impact:
      "The tsunami waves reached 30m high. The Earth's rotation shifted by 2.68 microseconds. The planet's axis shifted 2.5 cm.",
  },
  {
    name: "Tōhoku Earthquake",
    date: "March 11, 2011",
    magnitude: 9.1,
    location: "Japan",
    depth: "29 km",
    casualties: "~19,759",
    description:
      "Caused the Fukushima nuclear disaster and a 40m tsunami. Japan moved 2.4 m east.",
    impact:
      "The tsunami overtopped 10m seawalls. Fukushima Daiichi nuclear plant suffered meltdowns. The Pacific Plate shifted 3-4m.",
  },
  {
    name: "Haiti Earthquake",
    date: "January 12, 2010",
    magnitude: 7.0,
    location: "Port-au-Prince, Haiti",
    depth: "13 km",
    casualties: "~316,000",
    description:
      "The most devastating earthquake in Haitian history. Shallow depth amplified destruction.",
    impact:
      "300,000 buildings collapsed. 1.5 million people displaced. The Presidential Palace and Parliament were destroyed.",
  },
  {
    name: "Sichuan Earthquake",
    date: "May 12, 2008",
    magnitude: 7.9,
    location: "Sichuan, China",
    depth: "19 km",
    casualties: "~87,587",
    description:
      "Struck a densely populated area, causing massive destruction to schools and buildings.",
    impact:
      "5 million buildings collapsed, 28 million damaged. Landslides blocked rivers, creating dangerous 'quake lakes'.",
  },
  {
    name: "Nepal Earthquake",
    date: "April 25, 2015",
    magnitude: 7.8,
    location: "Kathmandu, Nepal",
    depth: "8.2 km",
    casualties: "~8,964",
    description:
      "Devastated Nepal's historic capital and triggered avalanches on Mount Everest.",
    impact:
      "UNESCO World Heritage Sites in Kathmandu Valley were destroyed. Everest Base Camp was hit by an avalanche.",
  },
];

// Ring of Fire countries
export const ringOfFireCountries = [
  "Chile", "Peru", "Ecuador", "Colombia", "Mexico",
  "USA (West Coast)", "Japan", "Philippines", "Indonesia",
  "Papua New Guinea", "New Zealand", "Russia (Kamchatka)",
];

export function getVolcanoBySlug(slug: string): Volcano | undefined {
  return volcanoes.find((v) => v.slug === slug);
}
