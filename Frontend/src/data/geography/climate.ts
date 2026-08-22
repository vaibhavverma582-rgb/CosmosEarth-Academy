export interface ClimateZone {
  name: string;
  slug: string;
  koppenCode: string;
  temperature: string;
  precipitation: string;
  regions: string[];
  description: string;
  characteristics: string[];
  vegetation: string;
  color: string;
}

export const climateZones: ClimateZone[] = [
  {
    name: "Tropical Rainforest",
    slug: "tropical-rainforest",
    koppenCode: "Af",
    temperature: "25-28°C year-round",
    precipitation: ">2,000 mm/year, no dry season",
    regions: ["Amazon Basin", "Congo Basin", "Southeast Asia", "Central America"],
    description:
      "Hot and wet year-round with minimal temperature variation. The most biodiverse biome on Earth, home to over 50% of all species.",
    characteristics: [
      "Temperature variation <3°C throughout the year",
      "Rainfall every month (>60mm)",
      "Multi-layered canopy structure",
      "Extremely high biodiversity",
    ],
    vegetation: "Broadleaf evergreen trees, epiphytes, lianas",
    color: "#1a6b1a",
  },
  {
    name: "Tropical Savanna",
    slug: "tropical-savanna",
    koppenCode: "Aw",
    temperature: "24-28°C",
    precipitation: "500-1,500 mm/year with wet/dry seasons",
    regions: ["East Africa", "Brazilian Cerrado", "Northern Australia", "India"],
    description:
      "Grasslands with scattered trees, defined by distinct wet and dry seasons. Home to the world's greatest wildlife migrations.",
    characteristics: [
      "Clear wet and dry seasons",
      "Grasses dominate with scattered trees",
      "Annual fires maintain grassland",
      "Supports large herbivore populations",
    ],
    vegetation: "Grasses, scattered acacia and baobab trees",
    color: "#c4a35a",
  },
  {
    name: "Subtropical Desert",
    slug: "subtropical-desert",
    koppenCode: "BWh",
    temperature: "20-40°C (extreme diurnal range)",
    precipitation: "<250 mm/year",
    regions: ["Sahara", "Arabian Desert", "Sonoran Desert", "Atacama Desert"],
    description:
      "The driest biome on Earth with extreme temperature swings between day and night. Life has evolved remarkable water-conservation strategies.",
    characteristics: [
      "Very low rainfall (<250mm/year)",
      "Extreme temperature range (up to 40°C daily)",
      "Sparse, drought-adapted vegetation",
      "Sandy or rocky terrain",
    ],
    vegetation: "Cacti, succulents, drought-resistant shrubs",
    color: "#d4a35a",
  },
  {
    name: "Mediterranean",
    slug: "mediterranean",
    koppenCode: "Csa",
    temperature: "15-25°C",
    precipitation: "400-900 mm/year (winter rainfall)",
    regions: ["Mediterranean Basin", "California", "Central Chile", "South Africa"],
    description:
      "Hot, dry summers and mild, wet winters. Unique ecosystems adapted to summer drought and periodic fires.",
    characteristics: [
      "Dry summers, wet winters",
      "Fire-adapted vegetation",
      "Evergreen, sclerophyllous leaves",
      "Rich in endemic plant species",
    ],
    vegetation: "Olive trees, cork oaks, chaparral, fynbos",
    color: "#8b6914",
  },
  {
    name: "Temperate Deciduous Forest",
    slug: "temperate-deciduous",
    koppenCode: "Cfb",
    temperature: "-5°C to 25°C",
    precipitation: "750-1,500 mm/year, evenly distributed",
    regions: ["Eastern North America", "Western Europe", "East Asia", "New Zealand"],
    description:
      "Four distinct seasons with trees that shed leaves in autumn. Rich soils support diverse plant and animal communities.",
    characteristics: [
      "Four distinct seasons",
      "Trees lose leaves in autumn (deciduous)",
      "Rich, fertile soil from leaf litter",
      "Moderate, year-round precipitation",
    ],
    vegetation: "Oak, maple, beech, birch, hickory",
    color: "#4a90d9",
  },
  {
    name: "Boreal Forest (Taiga)",
    slug: "boreal-forest",
    koppenCode: "Dfc",
    temperature: "-40°C to 20°C",
    precipitation: "300-800 mm/year (mostly snow)",
    regions: ["Canada", "Scandinavia", "Russia", "Alaska"],
    description:
      "The world's largest terrestrial biome — a vast belt of coniferous forest across the Northern Hemisphere. Critical for carbon storage.",
    characteristics: [
      "Long, severe winters (-40°C)",
      "Short, cool summers",
      "Coniferous trees with needle leaves",
      "Permafrost in northern regions",
    ],
    vegetation: "Spruce, pine, larch, fir, birch",
    color: "#2d5a27",
  },
  {
    name: "Tundra",
    slug: "tundra",
    koppenCode: "ET",
    temperature: "-34°C to 3°C",
    precipitation: "150-250 mm/year",
    regions: ["Arctic Canada", "Siberia", "Greenland", "Antarctic Peninsula"],
    description:
      "Treeless polar desert with permafrost beneath the surface. One of the coldest biomes, yet supports surprising wildlife diversity.",
    characteristics: [
      "Permafrost (permanently frozen ground)",
      "No trees — too cold and windy",
      "Very short growing season (50-60 days)",
      "Low precipitation (polar desert)",
    ],
    vegetation: "Mosses, lichens, sedges, dwarf shrubs",
    color: "#a8c4d8",
  },
  {
    name: "Ice Cap / Glacial",
    slug: "ice-cap",
    koppenCode: "EF",
    temperature: "-40°C to -10°C",
    precipitation: "<200 mm/year (dry)",
    regions: ["Antarctica", "Greenland interior", "High mountain peaks"],
    description:
      "Permanently frozen landscapes covered in ice sheets and glaciers. Covers about 10% of Earth's land surface and holds 68% of fresh water.",
    characteristics: [
      "Permanent ice and snow cover",
      "No vegetation on ice",
      "Extremely low precipitation",
      "Home to penguins, polar bears, seals",
    ],
    vegetation: "None (covered by ice)",
    color: "#e8f4f8",
  },
  {
    name: "Humid Subtropical",
    slug: "humid-subtropical",
    koppenCode: "Cfa",
    temperature: "5°C to 30°C",
    precipitation: "1,000-2,000 mm/year",
    regions: ["Southeast USA", "Southern China", "Northern Argentina", "Eastern Australia"],
    description:
      "Hot, humid summers and mild winters with year-round precipitation. Supports lush vegetation and diverse agriculture.",
    characteristics: [
      "Hot, humid summers",
      "Mild winters (rarely freezing)",
      "Year-round precipitation",
      "Rich biodiversity and agriculture",
    ],
    vegetation: "Mixed forests, magnolias, palmettos, bamboo",
    color: "#5a8a5a",
  },
  {
    name: "Grassland / Steppe",
    slug: "grassland-steppe",
    koppenCode: "BSk",
    temperature: "-20°C to 30°C",
    precipitation: "250-750 mm/year",
    regions: ["Great Plains (USA)", "Eurasian Steppe", "Pampas (Argentina)", "Prairies (Canada)"],
    description:
      "Vast open landscapes dominated by grasses with few or no trees. Rich soils make them vital for agriculture worldwide.",
    characteristics: [
      "Wide temperature range (continental climate)",
      "Low to moderate rainfall",
      "Fire maintains grassland dominance",
      "Deep, fertile soils (mollisols)",
    ],
    vegetation: "Grasses, wildflowers, sagebrush",
    color: "#8a9a5a",
  },
];

export function getClimateBySlug(slug: string): ClimateZone | undefined {
  return climateZones.find((c) => c.slug === slug);
}
