export interface Exoplanet {
  name: string;
  slug: string;
  hostStar: string;
  discoveryYear: number;
  discoveryMethod: string;
  orbitalPeriod: string;
  radius?: string;
  mass?: string;
  distance: string; // light-years
  temperature?: string;
  habitable: boolean;
  description: string;
  funFact: string;
  color: string;
}

export const exoplanets: Exoplanet[] = [
  {
    name: "Kepler-22b",
    slug: "kepler-22b",
    hostStar: "Kepler-22",
    discoveryYear: 2011,
    discoveryMethod: "Transit",
    orbitalPeriod: "289.9 days",
    radius: "2.4× Earth",
    distance: "635",
    temperature: "262 K (-11°C)",
    habitable: true,
    description:
      "The first confirmed planet in the habitable zone of a Sun-like star. Kepler-22b could potentially have liquid water on its surface.",
    funFact: "If Kepler-22b has a rocky surface, it could be the first true 'Earth 2.0'.",
    color: "#4a90d9",
  },
  {
    name: "Proxima Centauri b",
    slug: "proxima-centauri-b",
    hostStar: "Proxima Centauri",
    discoveryYear: 2016,
    discoveryMethod: "Radial Velocity",
    orbitalPeriod: "11.2 days",
    mass: "1.27× Earth",
    distance: "4.24",
    habitable: true,
    description:
      "The closest known exoplanet to our Solar System, orbiting the nearest star to the Sun. It receives enough starlight for liquid water to exist.",
    funFact: "At 4.24 light-years away, it would take ~73,000 years to reach with current spacecraft.",
    color: "#ff6b35",
  },
  {
    name: "TRAPPIST-1e",
    slug: "trappist-1e",
    hostStar: "TRAPPIST-1",
    discoveryYear: 2017,
    discoveryMethod: "Transit",
    orbitalPeriod: "6.1 days",
    radius: "0.92× Earth",
    distance: "40.7",
    temperature: "251 K (-22°C)",
    habitable: true,
    description:
      "One of seven Earth-sized planets orbiting the ultracool dwarf star TRAPPIST-1. It's considered the most likely to support life in the system.",
    funFact: "All seven TRAPPIST-1 planets would fit inside Mercury's orbit — the system is incredibly compact.",
    color: "#c1440e",
  },
  {
    name: "51 Pegasi b",
    slug: "51-pegasi-b",
    hostStar: "51 Pegasi",
    discoveryYear: 1995,
    discoveryMethod: "Radial Velocity",
    orbitalPeriod: "4.23 days",
    mass: "0.47× Jupiter",
    distance: "50.9",
    temperature: "~1264 K",
    habitable: false,
    description:
      "The first exoplanet discovered orbiting a Sun-like star. This 'hot Jupiter' revolutionized our understanding of planetary systems.",
    funFact: "Its discovery earned Michel Mayor and Didier Queloz the 2019 Nobel Prize in Physics.",
    color: "#c88b3a",
  },
  {
    name: "HD 209458 b",
    slug: "hd-209458-b",
    hostStar: "HD 209458",
    discoveryYear: 1999,
    discoveryMethod: "Transit",
    orbitalPeriod: "3.52 days",
    radius: "1.38× Jupiter",
    distance: "159",
    temperature: "~1320 K",
    habitable: false,
    description:
      "Nicknamed 'Osiris', this was the first exoplanet observed to transit its star and the first to have its atmosphere directly analyzed.",
    funFact: "Osiris is losing its atmosphere at 100,000 tons per second, creating a comet-like tail.",
    color: "#3b5998",
  },
  {
    name: "Kepler-442b",
    slug: "kepler-442b",
    hostStar: "Kepler-442",
    discoveryYear: 2015,
    discoveryMethod: "Transit",
    orbitalPeriod: "112.3 days",
    radius: "1.34× Earth",
    distance: "1,206",
    habitable: true,
    description:
      "One of the best candidates for a potentially habitable super-Earth. It receives enough light from its star for liquid water.",
    funFact: "Kepler-442b has a 97% chance of being rocky based on its density estimates.",
    color: "#4a90d9",
  },
  {
    name: "GJ 1214 b",
    slug: "gj-1214-b",
    hostStar: "GJ 1214",
    discoveryYear: 2009,
    discoveryMethod: "Transit",
    orbitalPeriod: "1.58 days",
    radius: "2.68× Earth",
    mass: "8.17× Earth",
    distance: "47.5",
    temperature: "~594 K",
    habitable: false,
    description:
      "A super-Earth or mini-Neptune that was one of the first exoplanets for which atmospheric composition was studied in detail.",
    funFact: "JWST recently detected clouds in GJ 1214 b's atmosphere, suggesting a water-world.",
    color: "#73c2d4",
  },
  {
    name: "TOI-700 d",
    slug: "toi-700-d",
    hostStar: "TOI-700",
    discoveryYear: 2020,
    discoveryMethod: "Transit",
    orbitalPeriod: "37.4 days",
    radius: "1.14× Earth",
    distance: "101.4",
    temperature: "269 K (-4°C)",
    habitable: true,
    description:
      "An Earth-sized planet in its star's habitable zone. NASA's TESS mission discovered it, and it's one of the best candidates for a habitable world.",
    funFact: "TOI-700 d receives about 86% of the energy Earth gets from the Sun.",
    color: "#4a90d9",
  },
  {
    name: "WASP-121b",
    slug: "wasp-121b",
    hostStar: "WASP-121",
    discoveryYear: 2015,
    discoveryMethod: "Transit",
    orbitalPeriod: "1.27 days",
    radius: "1.81× Jupiter",
    distance: "858",
    temperature: "~2500 K",
    habitable: false,
    description:
      "An ultra-hot Jupiter so close to its star that it's being stretched into an egg shape. JWST has revealed water vapor and heavy metals in its atmosphere.",
    funFact: "WASP-121b is so hot that metals like iron and titanium exist as gas in its atmosphere.",
    color: "#ff2e97",
  },
  {
    name: "K2-18 b",
    slug: "k2-18-b",
    hostStar: "K2-18",
    discoveryYear: 2015,
    discoveryMethod: "Transit",
    orbitalPeriod: "32.9 days",
    radius: "2.6× Earth",
    mass: "8.6× Earth",
    distance: "124",
    temperature: "~255 K (-18°C)",
    habitable: true,
    description:
      "A sub-Neptune in the habitable zone where JWST detected carbon-bearing molecules including methane and CO₂ — the best evidence yet for a hycean (hydrogen-rich ocean) world.",
    funFact: "JWST detected dimethyl sulfide (DMS) — on Earth, only produced by living organisms.",
    color: "#73c2d4",
  },
];
