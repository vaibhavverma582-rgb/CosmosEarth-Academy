export interface Country {
  name: string;
  slug: string;
  capital: string;
  continent: string;
  lat: number;
  lng: number;
  area: string;
  population: string;
  languages: string[];
  currency: string;
  climate: string;
  biome: string;
  description: string;
  funFact: string;
  flag: string; // emoji flag
  color: string;
}

export const countries: Country[] = [
  {
    name: "Brazil",
    slug: "brazil",
    capital: "Brasília",
    continent: "South America",
    lat: -14.235,
    lng: -51.9253,
    area: "8.516 million km²",
    population: "214 million",
    languages: ["Portuguese"],
    currency: "Brazilian Real (BRL)",
    climate: "Tropical",
    biome: "Tropical Rainforest",
    description:
      "The largest country in South America, home to the Amazon Rainforest — the world's largest tropical rainforest and a critical carbon sink for the planet.",
    funFact: "The Amazon Rainforest produces 20% of the world's oxygen and contains 10% of all species on Earth.",
    flag: "🇧🇷",
    color: "#009c3b",
  },
  {
    name: "Japan",
    slug: "japan",
    capital: "Tokyo",
    continent: "Asia",
    lat: 36.2048,
    lng: 138.2529,
    area: "377,975 km²",
    population: "125 million",
    languages: ["Japanese"],
    currency: "Japanese Yen (JPY)",
    climate: "Temperate / Subtropical",
    biome: "Temperate Forest",
    description:
      "An island nation on the Pacific Ring of Fire with 115 active volcanoes and frequent earthquakes. Despite this, it's one of the most technologically advanced countries.",
    funFact: "Japan has 6,852 islands and experiences about 1,500 earthquakes per year.",
    flag: "🇯🇵",
    color: "#bc002d",
  },
  {
    name: "Egypt",
    slug: "egypt",
    capital: "Cairo",
    continent: "Africa",
    lat: 26.8206,
    lng: 30.8025,
    area: "1.002 million km²",
    population: "104 million",
    languages: ["Arabic"],
    currency: "Egyptian Pound (EGP)",
    climate: "Arid / Desert",
    biome: "Desert",
    description:
      "Home to one of the world's oldest civilizations, straddling the Nile River — the longest river in Africa and a lifeline for the country's agriculture.",
    funFact: "95% of Egypt's population lives along the Nile River, which makes up only 5% of the country's land area.",
    flag: "🇪🇬",
    color: "#c09300",
  },
  {
    name: "Australia",
    slug: "australia",
    capital: "Canberra",
    continent: "Oceania",
    lat: -25.2744,
    lng: 133.7751,
    area: "7.692 million km²",
    population: "26 million",
    languages: ["English"],
    currency: "Australian Dollar (AUD)",
    climate: "Arid / Semi-arid",
    biome: "Desert / Savanna",
    description:
      "The world's sixth-largest country and the only one that spans an entire continent. Home to unique wildlife found nowhere else on Earth.",
    funFact: "Australia has more than 10,000 beaches — you could visit a new one every day for 27 years.",
    flag: "🇦🇺",
    color: "#00008b",
  },
  {
    name: "Iceland",
    slug: "iceland",
    capital: "Reykjavik",
    continent: "Europe",
    lat: 64.9631,
    lng: -19.0208,
    area: "103,000 km²",
    population: "376,000",
    languages: ["Icelandic"],
    currency: "Icelandic Krona (ISK)",
    climate: "Subpolar Oceanic",
    biome: "Tundra",
    description:
      "A volcanic island nation straddling the Mid-Atlantic Ridge where the North American and Eurasian plates pull apart.",
    funFact: "Iceland gets nearly 100% of its electricity from renewable sources — geothermal and hydroelectric.",
    flag: "🇮🇸",
    color: "#003897",
  },
  {
    name: "India",
    slug: "india",
    capital: "New Delhi",
    continent: "Asia",
    lat: 20.5937,
    lng: 78.9629,
    area: "3.287 million km²",
    population: "1.42 billion",
    languages: ["Hindi", "English"],
    currency: "Indian Rupee (INR)",
    climate: "Tropical Monsoon",
    biome: "Tropical Forest / Grassland",
    description:
      "The world's most populous country, with incredible geographic diversity from the Himalayas to tropical coastlines and vast deserts.",
    funFact: "India's Himalayas are still growing — the Indian Plate pushes into Eurasia at 5 cm per year.",
    flag: "🇮🇳",
    color: "#ff9933",
  },
  {
    name: "Canada",
    slug: "canada",
    capital: "Ottawa",
    continent: "North America",
    lat: 56.1304,
    lng: -106.3468,
    area: "9.985 million km²",
    population: "40 million",
    languages: ["English", "French"],
    currency: "Canadian Dollar (CAD)",
    climate: "Continental / Arctic",
    biome: "Boreal Forest / Tundra",
    description:
      "The world's second-largest country by total area, with more lakes than the rest of the world combined and vast untouched wilderness.",
    funFact: "Canada has more lakes than the rest of the world combined — approximately 8 million lakes.",
    flag: "🇨🇦",
    color: "#ff0000",
  },
  {
    name: "Kenya",
    slug: "kenya",
    capital: "Nairobi",
    continent: "Africa",
    lat: -0.0236,
    lng: 37.9062,
    area: "580,367 km²",
    population: "55 million",
    languages: ["Swahili", "English"],
    currency: "Kenyan Shilling (KES)",
    climate: "Tropical",
    biome: "Savanna",
    description:
      "Famous for its savannas, Great Rift Valley, and incredible wildlife. The Great Migration sees over 1.5 million wildebeest cross the Mara River.",
    funFact: "Kenya's Great Rift Valley is a divergent plate boundary where Africa is slowly splitting into two continents.",
    flag: "🇰🇪",
    color: "#006600",
  },
  {
    name: "Chile",
    slug: "chile",
    capital: "Santiago",
    continent: "South America",
    lat: -35.6751,
    lng: -71.543,
    area: "756,102 km²",
    population: "19 million",
    languages: ["Spanish"],
    currency: "Chilean Peso (CLP)",
    climate: "Arid to Mediterranean",
    biome: "Desert / Mediterranean Scrub",
    description:
      "The world's longest and narrowest country, stretching 4,300 km along South America's western edge. Home to the Atacama Desert, the driest place on Earth.",
    funFact: "Chile's Atacama Desert hasn't seen rain in recorded history — NASA uses it to test Mars rovers.",
    flag: "🇨🇱",
    color: "#d52b1e",
  },
  {
    name: "Nepal",
    slug: "nepal",
    capital: "Kathmandu",
    continent: "Asia",
    lat: 28.3949,
    lng: 84.124,
    area: "147,516 km²",
    population: "30 million",
    languages: ["Nepali"],
    currency: "Nepalese Rupee (NPR)",
    climate: "Subtropical to Alpine",
    biome: "Alpine / Mountain",
    description:
      "Home to 8 of the world's 14 eight-thousanders, including Mount Everest. The Himalayas dominate the country's geography.",
    funFact: "Nepal's Mount Everest grows about 4mm every year as the Indian Plate pushes into the Eurasian Plate.",
    flag: "🇳🇵",
    color: "#dc143c",
  },
  {
    name: "Norway",
    slug: "norway",
    capital: "Oslo",
    continent: "Europe",
    lat: 60.472,
    lng: 8.4689,
    area: "385,207 km²",
    population: "5.5 million",
    languages: ["Norwegian"],
    currency: "Norwegian Krone (NOK)",
    climate: "Oceanic / Subarctic",
    biome: "Boreal Forest / Tundra",
    description:
      "Known for its dramatic fjords carved by ancient glaciers, northern lights, and the midnight sun above the Arctic Circle.",
    funFact: "Norway's coastline would stretch 25,000 km if you counted every island and fjord — enough to circle Earth.",
    flag: "🇳🇴",
    color: "#ba0c2f",
  },
  {
    name: "Madagascar",
    slug: "madagascar",
    capital: "Antananarivo",
    continent: "Africa",
    lat: -18.7669,
    lng: 46.8691,
    area: "587,041 km²",
    population: "29 million",
    languages: ["Malagasy", "French"],
    currency: "Malagasy Ariary (MGA)",
    climate: "Tropical",
    biome: "Tropical Rainforest / Spiny Forest",
    description:
      "The world's fourth-largest island, separated from Africa 88 million years ago. Over 90% of its wildlife is found nowhere else on Earth.",
    funFact: "Madagascar is home to more than 11,000 plant species — 90% of which are endemic (found nowhere else).",
    flag: "🇲🇬",
    color: "#fc3d32",
  },
];

export const continents = [
  "All",
  "Africa",
  "Asia",
  "Europe",
  "North America",
  "Oceania",
  "South America",
];

export function getCountryBySlug(slug: string): Country | undefined {
  return countries.find((c) => c.slug === slug);
}
