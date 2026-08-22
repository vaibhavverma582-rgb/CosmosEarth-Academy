export interface Planet {
  name: string;
  slug: string;
  type: "terrestrial" | "gas-giant" | "ice-giant" | "dwarf";
  distanceFromSun: string; // AU
  orbitalPeriod: string;
  diameter: string;
  mass: string;
  gravity: string;
  dayLength: string;
  moons: number;
  temperature: string;
  atmosphere: string;
  description: string;
  funFacts: string[];
  color: string;
  emissive?: string;
  size: number; // relative for 3D
  orbitRadius: number; // relative for 3D
  orbitSpeed: number; // relative for 3D
  rotationSpeed: number;
  rings?: boolean;
  ringColor?: string;
}

export const planets: Planet[] = [
  {
    name: "Mercury",
    slug: "mercury",
    type: "terrestrial",
    distanceFromSun: "0.39",
    orbitalPeriod: "88 days",
    diameter: "4,879 km",
    mass: "3.30 × 10²³ kg",
    gravity: "3.7 m/s²",
    dayLength: "59 Earth days",
    moons: 0,
    temperature: "-180°C to 430°C",
    atmosphere: "Virtually none (trace O₂, Na, H₂)",
    description:
      "The smallest planet and closest to the Sun. Mercury has no atmosphere to retain heat, causing extreme temperature swings between day and night. Its surface is heavily cratered, resembling our Moon.",
    funFacts: [
      "A year on Mercury (88 days) is shorter than a single Mercury day (176 Earth days)",
      "Mercury has ice in permanently shadowed craters near its poles",
      "It's shrinking — Mercury's core is cooling and the planet is contracting",
    ],
    color: "#8c7e6d",
    size: 0.38,
    orbitRadius: 4,
    orbitSpeed: 4.15,
    rotationSpeed: 0.017,
  },
  {
    name: "Venus",
    slug: "venus",
    type: "terrestrial",
    distanceFromSun: "0.72",
    orbitalPeriod: "225 days",
    diameter: "12,104 km",
    mass: "4.87 × 10²⁴ kg",
    gravity: "8.87 m/s²",
    dayLength: "243 Earth days",
    moons: 0,
    temperature: "465°C (average)",
    atmosphere: "CO₂ (96.5%), N₂ (3.5%) — thick and toxic",
    description:
      "Often called Earth's twin due to similar size, Venus is actually a hellscape. Its thick CO₂ atmosphere creates a runaway greenhouse effect, making it the hottest planet in the solar system. It rotates backwards compared to most planets.",
    funFacts: [
      "Venus rotates in the opposite direction to most planets (retrograde rotation)",
      "A day on Venus is longer than its year",
      "Surface pressure is 90 times that of Earth — like being 900m underwater",
    ],
    color: "#c4a35a",
    emissive: "#c4a35a",
    size: 0.95,
    orbitRadius: 6,
    orbitSpeed: 1.62,
    rotationSpeed: -0.004,
  },
  {
    name: "Earth",
    slug: "earth",
    type: "terrestrial",
    distanceFromSun: "1.00",
    orbitalPeriod: "365.25 days",
    diameter: "12,756 km",
    mass: "5.97 × 10²⁴ kg",
    gravity: "9.81 m/s²",
    dayLength: "24 hours",
    moons: 1,
    temperature: "-89°C to 57°C",
    atmosphere: "N₂ (78%), O₂ (21%), Ar (0.9%)",
    description:
      "Our home — the only known planet to harbor life. Earth's liquid water, magnetic field, and atmosphere create the perfect conditions for a thriving biosphere. Its single large moon stabilizes our axial tilt.",
    funFacts: [
      "Earth is the densest planet in the solar system",
      "71% of Earth's surface is covered in water",
      "Earth's magnetic field extends 65,000 km into space",
    ],
    color: "#4a90d9",
    emissive: "#1a5276",
    size: 1.0,
    orbitRadius: 8,
    orbitSpeed: 1.0,
    rotationSpeed: 1.0,
  },
  {
    name: "Mars",
    slug: "mars",
    type: "terrestrial",
    distanceFromSun: "1.52",
    orbitalPeriod: "687 days",
    diameter: "6,792 km",
    mass: "6.42 × 10²³ kg",
    gravity: "3.72 m/s²",
    dayLength: "24.6 hours",
    moons: 2,
    temperature: "-153°C to 20°C",
    atmosphere: "CO₂ (95%), N₂ (2.7%), Ar (1.6%)",
    description:
      "The Red Planet — named after the Roman god of war. Mars has the tallest volcano (Olympus Mons) and the deepest canyon (Valles Marineris) in the solar system. Evidence suggests liquid water once flowed on its surface.",
    funFacts: [
      "Olympus Mons is 3x taller than Mount Everest",
      "Mars has seasons like Earth due to similar axial tilt (25.2°)",
      "Dust storms on Mars can engulf the entire planet for months",
    ],
    color: "#c1440e",
    emissive: "#8b2500",
    size: 0.53,
    orbitRadius: 11,
    orbitSpeed: 0.53,
    rotationSpeed: 0.97,
  },
  {
    name: "Jupiter",
    slug: "jupiter",
    type: "gas-giant",
    distanceFromSun: "5.20",
    orbitalPeriod: "11.86 years",
    diameter: "142,984 km",
    mass: "1.90 × 10²⁷ kg",
    gravity: "24.79 m/s²",
    dayLength: "9.93 hours",
    moons: 95,
    temperature: "-108°C (cloud tops)",
    atmosphere: "H₂ (89.8%), He (10.2%)",
    description:
      "The king of planets — Jupiter is so massive it could fit all other planets inside it. Its Great Red Spot is a storm larger than Earth that has raged for at least 350 years. Jupiter acts as a cosmic shield, deflecting asteroids away from the inner solar system.",
    funFacts: [
      "Jupiter's Great Red Spot is shrinking — it was once 3x Earth's diameter",
      "Jupiter has the strongest magnetic field of any planet (20,000x Earth's)",
      "Its moon Europa likely has a subsurface ocean with more water than Earth",
    ],
    color: "#c88b3a",
    emissive: "#8b5e3c",
    size: 3.5,
    orbitRadius: 16,
    orbitSpeed: 0.084,
    rotationSpeed: 2.4,
  },
  {
    name: "Saturn",
    slug: "saturn",
    type: "gas-giant",
    distanceFromSun: "9.54",
    orbitalPeriod: "29.46 years",
    diameter: "120,536 km",
    mass: "5.68 × 10²⁶ kg",
    gravity: "10.44 m/s²",
    dayLength: "10.7 hours",
    moons: 146,
    temperature: "-139°C (cloud tops)",
    atmosphere: "H₂ (96.3%), He (3.25%)",
    description:
      "The jewel of the solar system, famous for its spectacular ring system made of ice and rock. Saturn is the least dense planet — it would float in water if you could find a bathtub big enough. Its moon Titan has a thick atmosphere and liquid methane lakes.",
    funFacts: [
      "Saturn's rings span 282,000 km but are only about 10 meters thick",
      "It's less dense than water — it would float in a giant ocean",
      "Saturn's moon Titan has rivers, lakes, and seas of liquid methane",
    ],
    color: "#e8c36a",
    size: 3.0,
    orbitRadius: 22,
    orbitSpeed: 0.034,
    rotationSpeed: 2.2,
    rings: true,
    ringColor: "#e8c36a",
  },
  {
    name: "Uranus",
    slug: "uranus",
    type: "ice-giant",
    distanceFromSun: "19.19",
    orbitalPeriod: "84 years",
    diameter: "51,118 km",
    mass: "8.68 × 10²⁵ kg",
    gravity: "8.87 m/s²",
    dayLength: "17.2 hours",
    moons: 28,
    temperature: "-197°C",
    atmosphere: "H₂ (82.5%), He (15.2%), CH₄ (2.3%)",
    description:
      "The sideways planet — Uranus rotates on its side with an axial tilt of 98°. This ice giant has a blue-green color from methane in its atmosphere. It was the first planet discovered with a telescope (by William Herschel in 1781).",
    funFacts: [
      "Uranus rolls around the Sun on its side — likely from a massive ancient collision",
      "It has 13 known rings, discovered in 1977",
      "Uranus seasons last 21 years each due to its extreme tilt",
    ],
    color: "#73c2d4",
    size: 2.0,
    orbitRadius: 28,
    orbitSpeed: 0.012,
    rotationSpeed: 1.4,
  },
  {
    name: "Neptune",
    slug: "neptune",
    type: "ice-giant",
    distanceFromSun: "30.07",
    orbitalPeriod: "164.8 years",
    diameter: "49,528 km",
    mass: "1.02 × 10²⁶ kg",
    gravity: "11.15 m/s²",
    dayLength: "16.1 hours",
    moons: 16,
    temperature: "-201°C",
    atmosphere: "H₂ (80%), He (19%), CH₄ (1.5%)",
    description:
      "The windiest planet in the solar system, with gusts reaching 2,100 km/h. Neptune's deep blue color comes from methane in its atmosphere. It was the first planet predicted by mathematics before being observed — discovered in 1846.",
    funFacts: [
      "Neptune has the strongest winds in the solar system (2,100 km/h)",
      "It was predicted mathematically before it was telescoped",
      "One year on Neptune = 164.8 Earth years — it completed its first orbit in 2011",
    ],
    color: "#3b5998",
    emissive: "#1a3a6a",
    size: 1.9,
    orbitRadius: 33,
    orbitSpeed: 0.006,
    rotationSpeed: 1.5,
  },
];

export function getPlanetBySlug(slug: string): Planet | undefined {
  return planets.find((p) => p.slug === slug);
}
