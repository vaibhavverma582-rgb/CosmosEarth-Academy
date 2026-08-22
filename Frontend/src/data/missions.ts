export interface Mission {
  name: string;
  slug: string;
  agency: string;
  year: number;
  endYear?: number;
  type: "flyby" | "orbiter" | "lander" | "rover" | "telescope" | "crewed";
  destination: string;
  status: "completed" | "active" | "planned";
  description: string;
  achievements: string[];
  color: string;
  icon: string;
}

export const missions: Mission[] = [
  {
    name: "Sputnik 1",
    slug: "sputnik-1",
    agency: "Soviet Union",
    year: 1957,
    type: "orbiter",
    destination: "Earth Orbit",
    status: "completed",
    description:
      "The first artificial satellite to orbit Earth. Its launch marked the beginning of the Space Age and triggered the Space Race between the US and USSR.",
    achievements: [
      "First artificial object in Earth orbit",
      "Transmitted radio signals for 21 days",
      "Triggered the Space Race",
    ],
    color: "#ff6b35",
    icon: "🛰️",
  },
  {
    name: "Voyager 1",
    slug: "voyager-1",
    agency: "NASA",
    year: 1977,
    type: "flyby",
    destination: "Interstellar Space",
    status: "active",
    description:
      "The most distant human-made object. Voyager 1 completed its Grand Tour of the outer planets and entered interstellar space in 2012. It still transmits data back to Earth.",
    achievements: [
      "First spacecraft to enter interstellar space",
      "Detailed images of Jupiter and Saturn",
      "Carries the Golden Record with sounds of Earth",
    ],
    color: "#00d4ff",
    icon: "🛸",
  },
  {
    name: "Voyager 2",
    slug: "voyager-2",
    agency: "NASA",
    year: 1977,
    type: "flyby",
    destination: "Interstellar Space",
    status: "active",
    description:
      "The only spacecraft to visit all four gas giants. Voyager 2 continues to send data from interstellar space, having entered it in 2018.",
    achievements: [
      "Only spacecraft to visit Uranus and Neptune",
      "Discovered Neptune's Great Dark Spot",
      "Still transmitting from interstellar space",
    ],
    color: "#00d4ff",
    icon: "🛸",
  },
  {
    name: "Hubble Space Telescope",
    slug: "hubble",
    agency: "NASA / ESA",
    year: 1990,
    type: "telescope",
    destination: "Earth Orbit",
    status: "active",
    description:
      "One of the most important telescopes in history. Hubble has captured some of the most detailed visible-light images of distant galaxies, nebulae, and stars.",
    achievements: [
      "Over 1.5 million observations",
      "Helped determine the age of the universe (13.8 billion years)",
      "Captured iconic images like the Pillars of Creation",
    ],
    color: "#7b2ff2",
    icon: "🔭",
  },
  {
    name: "Mars Pathfinder",
    slug: "mars-pathfinder",
    agency: "NASA",
    year: 1997,
    type: "lander",
    destination: "Mars",
    status: "completed",
    description:
      "Landed the first rover on Mars — Sojourner, a microwave-oven-sized vehicle. It proved that robotic exploration of Mars was feasible.",
    achievements: [
      "First rover on Mars (Sojourner)",
      "Analyzed Martian rocks and soil",
      "Deployed first Martian weather station",
    ],
    color: "#c1440e",
    icon: "🔴",
  },
  {
    name: "International Space Station",
    slug: "iss",
    agency: "NASA / Roscosmos / ESA / JAXA / CSA",
    year: 1998,
    endYear: undefined,
    type: "crewed",
    destination: "Earth Orbit",
    status: "active",
    description:
      "The largest structure humans have ever put in space. The ISS has been continuously inhabited since November 2000, serving as a microgravity research laboratory.",
    achievements: [
      "Continuously inhabited since November 2000",
      "Hosted astronauts from 19 countries",
      "Over 3,000 scientific experiments conducted",
    ],
    color: "#00d4ff",
    icon: "🏠",
  },
  {
    name: "Spirit & Opportunity",
    slug: "mars-exploration-rovers",
    agency: "NASA",
    year: 2004,
    endYear: 2018,
    type: "rover",
    destination: "Mars",
    status: "completed",
    description:
      "Twin Mars rovers that far exceeded their planned 90-day missions. Opportunity operated for over 14 years, traveling 45 km across the Martian surface.",
    achievements: [
      "Found evidence of past water on Mars",
      "Opportunity traveled 45.16 km (record for off-world driving)",
      "Spirit operated 6 years; Opportunity operated 14 years",
    ],
    color: "#c1440e",
    icon: "🤖",
  },
  {
    name: "Kepler Space Telescope",
    slug: "kepler",
    agency: "NASA",
    year: 2009,
    endYear: 2018,
    type: "telescope",
    destination: "Heliocentric Orbit",
    status: "completed",
    description:
      "Dedicated to finding Earth-sized planets orbiting other stars. Kepler confirmed over 2,600 exoplanets, revolutionizing our understanding of planetary systems.",
    achievements: [
      "Discovered 2,662 confirmed exoplanets",
      "Proved Earth-sized planets are common",
      "Found planets in the habitable zone",
    ],
    color: "#7b2ff2",
    icon: "⭐",
  },
  {
    name: "New Horizons",
    slug: "new-horizons",
    agency: "NASA",
    year: 2006,
    type: "flyby",
    destination: "Pluto & Kuiper Belt",
    status: "active",
    description:
      "The first spacecraft to fly by Pluto in 2015, revealing a complex and geologically active world. Now exploring the Kuiper Belt.",
    achievements: [
      "First spacecraft to study Pluto up close",
      "Revealed Pluto's heart-shaped glacier (Tombaugh Regio)",
      "Currently exploring the Kuiper Belt",
    ],
    color: "#3b5998",
    icon: "💫",
  },
  {
    name: "Curiosity Rover",
    slug: "curiosity",
    agency: "NASA",
    year: 2012,
    type: "rover",
    destination: "Mars",
    status: "active",
    description:
      "A car-sized rover exploring Gale Crater on Mars. Curiosity has found evidence that Mars once had conditions suitable for microbial life.",
    achievements: [
      "Found organic molecules on Mars",
      "Discovered ancient lake beds in Gale Crater",
      "Still operating and climbing Mount Sharp",
    ],
    color: "#c1440e",
    icon: "🤖",
  },
  {
    name: "James Webb Space Telescope",
    slug: "jwst",
    agency: "NASA / ESA / CSA",
    year: 2021,
    type: "telescope",
    destination: "Sun-Earth L2 Point",
    status: "active",
    description:
      "The most powerful space telescope ever built. JWST sees the universe in infrared light, peering back to the earliest galaxies formed after the Big Bang.",
    achievements: [
      "Captured the deepest infrared image of the universe",
      "Observed the earliest galaxies (13+ billion light-years away)",
      "Analyzed exoplanet atmospheres for signs of habitability",
    ],
    color: "#ffd700",
    icon: "🔭",
  },
  {
    name: "Perseverance Rover",
    slug: "perseverance",
    agency: "NASA",
    year: 2021,
    type: "rover",
    destination: "Mars (Jezero Crater)",
    status: "active",
    description:
      "The most advanced Mars rover, searching for signs of ancient microbial life. It deployed Ingenuity, the first helicopter to fly on another planet.",
    achievements: [
      "First powered flight on another planet (Ingenuity helicopter)",
      "Collecting Mars samples for future return to Earth",
      "Found organic compounds in Jezero Crater",
    ],
    color: "#c1440e",
    icon: "🤖",
  },
  {
    name: "Chandrayaan-3",
    slug: "chandrayaan-3",
    agency: "ISRO",
    year: 2023,
    type: "lander",
    destination: "Moon (South Pole)",
    status: "completed",
    description:
      "India's successful lunar south pole landing mission. Made India the fourth country to soft-land on the Moon and the first to land near the south pole.",
    achievements: [
      "First landing near the lunar south pole",
      "Deployed the Pragyan rover",
      "Confirmed sulfur and other elements on the Moon",
    ],
    color: "#ff6b35",
    icon: "🌙",
  },
  {
    name: "Artemis I",
    slug: "artemis-1",
    agency: "NASA",
    year: 2022,
    type: "crewed",
    destination: "Moon Orbit",
    status: "completed",
    description:
      "The first mission in NASA's Artemis program, testing the Space Launch System (SLS) and Orion spacecraft for future crewed lunar missions.",
    achievements: [
      "First flight of the SLS rocket",
      "Orion traveled 432,210 km from Earth",
      "Successfully returned after 25.5-day mission",
    ],
    color: "#00d4ff",
    icon: "🚀",
  },
  {
    name: "Mars Sample Return",
    slug: "mars-sample-return",
    agency: "NASA / ESA",
    year: 2028,
    type: "rover",
    destination: "Mars → Earth",
    status: "planned",
    description:
      "A joint NASA-ESA mission to retrieve the samples collected by Perseverance and return them to Earth for detailed analysis.",
    achievements: [
      "First Mars sample return mission",
      "Will bring back pristine Mars samples",
      "Enable search for ancient microbial life",
    ],
    color: "#c1440e",
    icon: "📦",
  },
];
