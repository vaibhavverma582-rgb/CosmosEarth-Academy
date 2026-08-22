export interface Biome {
  name: string;
  slug: string;
  area: string;
  percentage: string;
  avgTemp: string;
  rainfall: string;
  biodiversity: "Very High" | "High" | "Medium" | "Low" | "Very Low";
  description: string;
  keySpecies: string[];
  threats: string[];
  funFact: string;
  color: string;
  emoji: string;
}

export const biomes: Biome[] = [
  {
    name: "Tropical Rainforest",
    slug: "tropical-rainforest",
    area: "17 million km²",
    percentage: "6% of Earth's surface",
    avgTemp: "25-28°C",
    rainfall: "2,000-10,000 mm/year",
    biodiversity: "Very High",
    description:
      "The most biologically diverse biome on Earth. Multi-layered canopies create different habitats from the forest floor to the emergent layer 60m above.",
    keySpecies: ["Jaguar", "Toucan", "Orangutan", "Poison Dart Frog", "Howler Monkey"],
    threats: ["Deforestation", "Agriculture expansion", "Logging", "Climate change"],
    funFact: "One hectare of tropical rainforest can contain over 300 tree species — more than all of North America combined.",
    color: "#1a6b1a",
    emoji: "🌴",
  },
  {
    name: "Tundra",
    slug: "tundra",
    area: "11.5 million km²",
    percentage: "8% of Earth's surface",
    avgTemp: "-34°C to 3°C",
    rainfall: "150-250 mm/year",
    biodiversity: "Low",
    description:
      "Treeless polar landscapes with permafrost. Despite harsh conditions, tundra supports surprising wildlife and is one of Earth's most pristine biomes.",
    keySpecies: ["Polar Bear", "Arctic Fox", "Caribou", "Snowy Owl", "Arctic Wolf"],
    threats: ["Climate change (warming 2x faster than global average)", "Permafrost thaw", "Oil exploration"],
    funFact: "Arctic tundra stores 1,700 billion tons of carbon in permafrost — twice what's in the entire atmosphere.",
    color: "#a8c4d8",
    emoji: "🧊",
  },
  {
    name: "Coral Reef",
    slug: "coral-reef",
    area: "284,300 km²",
    percentage: "<0.1% of ocean floor",
    avgTemp: "23-29°C",
    rainfall: "N/A (marine)",
    biodiversity: "Very High",
    description:
      "Underwater ecosystems built by tiny coral polyps. Despite covering less than 0.1% of the ocean floor, they support 25% of all marine species.",
    keySpecies: ["Clownfish", "Sea Turtle", "Reef Shark", "Giant Clam", "Coral Polyps"],
    threats: ["Ocean warming (coral bleaching)", "Ocean acidification", "Overfishing", "Pollution"],
    funFact: "The Great Barrier Reef is the largest living structure on Earth — visible from space and made of billions of tiny organisms.",
    color: "#ff6b6b",
    emoji: "🐠",
  },
  {
    name: "Desert",
    slug: "desert",
    area: "33.7 million km²",
    percentage: "33% of Earth's land surface",
    avgTemp: "-20°C to 50°C",
    rainfall: "<250 mm/year",
    biodiversity: "Low",
    description:
      "The driest biome, receiving less than 250mm of rain per year. Yet deserts are home to incredible life adapted to extreme conditions.",
    keySpecies: ["Camel", "Fennec Fox", "Scorpion", "Saguaro Cactus", "Sidewinder Rattlesnake"],
    threats: ["Desertification", "Groundwater depletion", "Climate change", "Solar farm development"],
    funFact: "The Sahara Desert was once green — satellite images show ancient riverbeds and lake sediments from 5,000 years ago.",
    color: "#d4a35a",
    emoji: "🏜️",
  },
  {
    name: "Boreal Forest (Taiga)",
    slug: "boreal-forest",
    area: "17 million km²",
    percentage: "11% of Earth's land surface",
    avgTemp: "-40°C to 20°C",
    rainfall: "300-800 mm/year",
    biodiversity: "Medium",
    description:
      "Earth's largest terrestrial biome — a vast belt of coniferous forest across the Northern Hemisphere. Critical for global carbon storage.",
    keySpecies: ["Moose", "Wolf", "Brown Bear", "Woodpecker", "Lynx"],
    threats: ["Logging", "Wildfires (increasing)", "Oil extraction", "Climate change"],
    funFact: "The boreal forest stores more carbon than all tropical rainforests combined — 272 billion tonnes.",
    color: "#2d5a27",
    emoji: "🌲",
  },
  {
    name: "Savanna",
    slug: "savanna",
    area: "20 million km²",
    percentage: "13% of Earth's land surface",
    avgTemp: "24-28°C",
    rainfall: "500-1,500 mm/year",
    biodiversity: "High",
    description:
      "Grasslands with scattered trees, famous for supporting the greatest concentrations of large mammals on Earth.",
    keySpecies: ["Elephant", "Lion", "Giraffe", "Zebra", "Wildebeest"],
    threats: ["Overgrazing", "Agricultural conversion", "Poaching", "Climate change"],
    funFact: "The Serengeti wildebeest migration involves 1.5 million animals traveling 800 km annually — the largest terrestrial migration on Earth.",
    color: "#c4a35a",
    emoji: "🦁",
  },
  {
    name: "Temperate Forest",
    slug: "temperate-forest",
    area: "10 million km²",
    percentage: "7% of Earth's land surface",
    avgTemp: "-5°C to 25°C",
    rainfall: "750-1,500 mm/year",
    biodiversity: "Medium",
    description:
      "Four-season forests with deciduous trees that shed leaves annually. Rich soils support diverse communities and important agriculture.",
    keySpecies: ["White-tailed Deer", "Red Fox", "Black Bear", "Owl", "Salamander"],
    threats: ["Urban development", "Logging", "Invasive species", "Climate change"],
    funFact: "Temperate forests have the highest soil biodiversity on Earth — a single handful of forest soil contains billions of organisms.",
    color: "#4a90d9",
    emoji: "🍂",
  },
  {
    name: "Freshwater",
    slug: "freshwater",
    area: "0.8 million km²",
    percentage: "<1% of Earth's surface",
    avgTemp: "Varies by location",
    rainfall: "N/A (aquatic)",
    biodiversity: "Very High",
    description:
      "Rivers, lakes, and wetlands cover less than 1% of Earth's surface but support 10% of all species and 6% of all vertebrates.",
    keySpecies: ["Salmon", "Frog", "Beaver", "Kingfisher", "Freshwater Dolphin"],
    threats: ["Pollution", "Dam construction", "Water extraction", "Invasive species"],
    funFact: "Freshwater ecosystems are the most threatened biome on Earth — wildlife populations have declined 83% since 1970.",
    color: "#3b8dd4",
    emoji: "💧",
  },
  {
    name: "Grassland / Prairie",
    slug: "grassland-prairie",
    area: "52.5 million km²",
    percentage: "40% of Earth's land surface",
    avgTemp: "-20°C to 30°C",
    rainfall: "250-750 mm/year",
    biodiversity: "Medium",
    description:
      "Vast open landscapes dominated by grasses. Their deep, fertile soils make grasslands the breadbaskets of the world.",
    keySpecies: ["Bison", "Pronghorn", "Prairie Dog", "Hawk", "Grasshopper"],
    threats: ["Agricultural conversion (99% of tallgrass prairie gone)", "Overgrazing", "Fire suppression"],
    funFact: "Only 1% of North America's original tallgrass prairie remains — making it one of the most endangered biomes.",
    color: "#8a9a5a",
    emoji: "🌾",
  },
  {
    name: "Wetlands",
    slug: "wetlands",
    area: "12.1 million km²",
    percentage: "6% of Earth's surface",
    avgTemp: "Varies",
    rainfall: "Varies (waterlogged)",
    biodiversity: "Very High",
    description:
      "Water-saturated ecosystems that act as Earth's kidneys — filtering water, preventing floods, and storing carbon.",
    keySpecies: ["Alligator", "Heron", "Frog", "Cattail", "Beaver"],
    threats: ["Drainage for agriculture", "Urban development", "Pollution", "Climate change"],
    funFact: "Wetlands store more carbon per unit area than forests — they are Earth's most effective carbon sinks.",
    color: "#3a7a5a",
    emoji: "🐸",
  },
];

export function getBiomeBySlug(slug: string): Biome | undefined {
  return biomes.find((b) => b.slug === slug);
}
