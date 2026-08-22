export interface Constellation {
  name: string;
  slug: string;
  abbreviation: string;
  area: string; // square degrees
  stars: number;
  brightestStar: string;
  hemisphere: string;
  season: string;
  mythology: string;
  description: string;
  keyStars: string[];
  color: string;
}

export const constellations: Constellation[] = [
  {
    name: "Orion",
    slug: "orion",
    abbreviation: "Ori",
    area: "594",
    stars: 7,
    brightestStar: "Rigel",
    hemisphere: "Both",
    season: "Winter",
    mythology:
      "Named after Orion the Hunter in Greek mythology. He was a giant hunter whom Zeus placed among the stars. Orion is pursuing the Pleiades across the sky while being pursued by Scorpius.",
    description:
      "One of the most recognizable constellations, visible from both hemispheres. Orion's Belt — three stars in a straight line — is one of the most famous asterisms in the night sky.",
    keyStars: ["Rigel", "Betelgeuse", "Bellatrix", "Mintaka", "Alnilam", "Alnitak", "Saiph"],
    color: "#00d4ff",
  },
  {
    name: "Ursa Major",
    slug: "ursa-major",
    abbreviation: "UMa",
    area: "1280",
    stars: 7,
    brightestStar: "Alioth",
    hemisphere: "Northern",
    season: "Spring",
    mythology:
      "In Greek mythology, Ursa Major represents Callisto, a nymph transformed into a bear by Zeus's jealous wife Hera. Zeus placed her in the sky to protect her.",
    description:
      "The third largest constellation and one of the most important for navigation. Its main asterism, the Big Dipper (or Plough), is used to find Polaris, the North Star.",
    keyStars: ["Alioth", "Dubhe", "Merak", "Phecda", "Megrez", "Mizar", "Alkaid"],
    color: "#7b2ff2",
  },
  {
    name: "Scorpius",
    slug: "scorpius",
    abbreviation: "Sco",
    area: "497",
    stars: 8,
    brightestStar: "Antares",
    hemisphere: "Southern",
    season: "Summer",
    mythology:
      "Scorpius represents the scorpion that killed Orion the Hunter. According to myth, Zeus separated them by placing Orion on one side of the sky and Scorpius on the other, so they would never be visible at the same time.",
    description:
      "A spectacular zodiac constellation with a distinctive curved tail. Its bright red supergiant Antares means 'rival of Mars' due to its similar color.",
    keyStars: ["Antares", "Shaula", "Sargas", "Dschubba", "Acrab", "Wei", "Lesath", "Epsilon Scorpii"],
    color: "#ff2e97",
  },
  {
    name: "Cassiopeia",
    slug: "cassiopeia",
    abbreviation: "Cas",
    area: "598",
    stars: 5,
    brightestStar: "Schedar",
    hemisphere: "Northern",
    season: "Autumn",
    mythology:
      "Named after the vain Queen Cassiopeia in Greek mythology. She boasted about her beauty, angering Poseidon. As punishment, she was placed in the sky tied to her throne, doomed to circle the celestial pole.",
    description:
      "Easily recognized by its distinctive W or M shape (depending on orientation). It's a circumpolar constellation in northern latitudes, meaning it's visible year-round.",
    keyStars: ["Schedar", "Caph", "Tsih", "Ruchbah", "Segin"],
    color: "#ffd700",
  },
  {
    name: "Cygnus",
    slug: "cygnus",
    abbreviation: "Cyg",
    area: "804",
    stars: 9,
    brightestStar: "Deneb",
    hemisphere: "Northern",
    season: "Summer",
    mythology:
      "Cygnus represents the swan. In one myth, it is Zeus disguised as a swan to seduce Leda. In another, it is Orpheus placed in the sky as a swan near his beloved lyre (Lyra).",
    description:
      "Also known as the Northern Cross. Its brightest star Deneb is one of the three stars of the Summer Triangle. The Milky Way runs through Cygnus, making it rich in deep-sky objects.",
    keyStars: ["Deneb", "Sadr", "Gienah", "Albireo", "Epsilon Cygni", "Delta Cygni", "Zeta Cygni"],
    color: "#00d4ff",
  },
  {
    name: "Leo",
    slug: "leo",
    abbreviation: "Leo",
    area: "947",
    stars: 9,
    brightestStar: "Regulus",
    hemisphere: "Northern",
    season: "Spring",
    mythology:
      "Leo represents the Nemean Lion slain by Heracles as the first of his twelve labors. The lion's impervious golden hide meant that no weapon could pierce it, so Heracles wrestled and strangled it.",
    description:
      "A prominent zodiac constellation best seen in spring. Its sickle-shaped asterism forms the lion's head, and Regulus — the 'heart of the lion' — is one of the brightest stars in the sky.",
    keyStars: ["Regulus", "Denebola", "Algieba", "Zosma", "Chertan", "Adhafera", "Ras Elased"],
    color: "#ff6b35",
  },
  {
    name: "Lyra",
    slug: "lyra",
    abbreviation: "Lyr",
    area: "286",
    stars: 5,
    brightestStar: "Vega",
    hemisphere: "Northern",
    season: "Summer",
    mythology:
      "Lyra represents the lyre (harp) of Orpheus, the legendary musician whose music could charm animals, move trees, and even rocks. After his death, his lyre was placed in the sky by Zeus.",
    description:
      "A small but beautiful constellation. Its brightest star Vega is the fifth brightest star in the night sky and one of the three stars of the Summer Triangle. The Ring Nebula (M57) is located in Lyra.",
    keyStars: ["Vega", "Sheliak", "Sulafat", "Delta¹ Lyrae", "Delta² Lyrae"],
    color: "#7b2ff2",
  },
  {
    name: "Gemini",
    slug: "gemini",
    abbreviation: "Gem",
    area: "514",
    stars: 8,
    brightestStar: "Pollux",
    hemisphere: "Northern",
    season: "Winter",
    mythology:
      "Gemini represents the twin brothers Castor and Pollux. Castor was mortal while Pollux was divine (sons of Zeus). When Castor died, Pollux begged Zeus to let them be together, and they were placed among the stars.",
    description:
      "A zodiac constellation visible in winter. The twins are represented by two bright stars — Castor and Pollux — with Pollux being slightly brighter. The Geminid meteor shower is one of the best annual meteor showers.",
    keyStars: ["Pollux", "Castor", "Alhena", "Wasat", "Mebsuta", "Tejat", "Propus"],
    color: "#ffd700",
  },
];

export function getConstellationBySlug(slug: string): Constellation | undefined {
  return constellations.find((c) => c.slug === slug);
}
