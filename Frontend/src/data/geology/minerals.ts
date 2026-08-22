export interface Mineral {
  name: string;
  slug: string;
  formula: string;
  crystalSystem: string;
  hardness: number; // Mohs
  luster: string;
  color: string;
  streak: string;
  cleavage: string;
  specificGravity: string;
  category: string;
  description: string;
  funFact: string;
  uses: string[];
}

export const minerals: Mineral[] = [
  {
    name: "Quartz",
    slug: "quartz",
    formula: "SiO₂",
    crystalSystem: "Hexagonal",
    hardness: 7,
    luster: "Vitreous",
    color: "#e8e0d4",
    streak: "White",
    cleavage: "None (conchoidal fracture)",
    specificGravity: "2.65",
    category: "Silicates",
    description:
      "The second most abundant mineral in Earth's continental crust. Known for its hardness and piezoelectric properties.",
    funFact: "Quartz oscillates at a precise frequency when electricity is applied — it's used in every quartz clock and watch.",
    uses: ["Electronics", "Glass making", "Jewelry", "Optics", "Abrasive"],
  },
  {
    name: "Feldspar",
    slug: "feldspar",
    formula: "(K,Na,Ca)(Al,Si)₄O₈",
    crystalSystem: "Triclinic / Monoclinic",
    hardness: 6,
    luster: "Vitreous to pearly",
    color: "#c4b8a8",
    streak: "White",
    cleavage: "Perfect at ~90°",
    specificGravity: "2.55-2.76",
    category: "Silicates",
    description:
      "The most abundant mineral group in Earth's crust, making up about 60% of all rocks.",
    funFact: "The moon's surface is largely made of feldspar — the lunar highlands are rich in plagioclase feldspar.",
    uses: ["Ceramics", "Glass", "Porcelain", "Filler in paint"],
  },
  {
    name: "Diamond",
    slug: "diamond",
    formula: "C",
    crystalSystem: "Cubic (isometric)",
    hardness: 10,
    luster: "Adamantine",
    color: "#f0f0f0",
    streak: "White",
    cleavage: "Perfect octahedral",
    specificGravity: "3.52",
    category: "Native Elements",
    description:
      "The hardest known natural material. Formed deep in Earth's mantle under extreme pressure and temperature.",
    funFact: "Every diamond is billions of years old — the oldest ones formed 1-3 billion years ago, deep in Earth's mantle.",
    uses: ["Jewelry", "Industrial cutting", "Drilling", "Heat sinks"],
  },
  {
    name: "Calcite",
    slug: "calcite",
    formula: "CaCO₃",
    crystalSystem: "Trigonal",
    hardness: 3,
    luster: "Vitreous",
    color: "#f0ece4",
    streak: "White",
    cleavage: "Perfect rhombohedral",
    specificGravity: "2.71",
    category: "Carbonates",
    description:
      "A very common carbonate mineral and the main constituent of limestone, marble, and chalk.",
    funFact: "Calcite is birefringent — it splits light into two rays, creating double images. Vikings used it to navigate on cloudy days.",
    uses: ["Cement", "Agriculture (lime)", "Optics", "Chemical industry"],
  },
  {
    name: "Garnet",
    slug: "garnet",
    formula: "X₃Y₂(SiO₄)₃",
    crystalSystem: "Cubic (isometric)",
    hardness: 7,
    luster: "Vitreous to resinous",
    color: "#8b2500",
    streak: "White",
    cleavage: "None",
    specificGravity: "3.5-4.3",
    category: "Silicates",
    description:
      "A group of silicate minerals that have been used since the Bronze Age as gemstones and abrasives.",
    funFact: "Garnet is so tough it's used in water-jet cutting — garnet crystals mixed with water can cut through steel.",
    uses: ["Abrasives", "Water-jet cutting", "Gemstones", "Filtration"],
  },
  {
    name: "Mica",
    slug: "mica",
    formula: "KAl₂(AlSi₃O₁₀)(OH)₂",
    crystalSystem: "Monoclinic",
    hardness: 2.5,
    luster: "Vitreous to pearly",
    color: "#c0b8a0",
    streak: "White",
    cleavage: "Perfect basal (one direction)",
    specificGravity: "2.77-3.1",
    category: "Silicates",
    description:
      "A group of sheet silicate minerals that split into extremely thin, flexible sheets.",
    funFact: "Muscovite mica can be split into sheets just 0.001mm thick — thin enough to see through clearly.",
    uses: ["Electrical insulation", "Cosmetics", "Paint", "Electronics", "Wallboard"],
  },
  {
    name: "Olivine",
    slug: "olivine",
    formula: "(Mg,Fe)₂SiO₄",
    crystalSystem: "Orthorhombic",
    hardness: 7,
    luster: "Vitreous",
    color: "#6b8e23",
    streak: "White",
    cleavage: "Poor",
    specificGravity: "3.22-4.39",
    category: "Silicates",
    description:
      "A magnesium iron silicate that's a major component of the Earth's upper mantle.",
    funFact: "Olivine crystals rain down on Mars — NASA's Spirit rover found olivine-rich rocks, suggesting Mars has volcanic geology.",
    uses: ["Refractory materials", "Foundry sand", "Gemstone (peridot)"],
  },
  {
    name: "Pyrite",
    slug: "pyrite",
    formula: "FeS₂",
    crystalSystem: "Cubic (isometric)",
    hardness: 6,
    luster: "Metallic",
    color: "#c4a35a",
    streak: "Greenish-black",
    cleavage: "Indistinct",
    specificGravity: "5.01",
    category: "Sulfides",
    description:
      "Known as 'fool's gold' due to its metallic golden color. The most common sulfide mineral.",
    funFact: "Pyrite can produce sparks when struck with steel — it was used to start fires in ancient times and gives 'strike a light' its meaning.",
    uses: ["Sulfur production", "Gold mining indicator", "Gemstone", "Historical fire-starting"],
  },
  {
    name: "Tourmaline",
    slug: "tourmaline",
    formula: "(Na,Ca)(Li,Mg,Al)(Al,Fe, Mn)₆(BO₃)₃(Si₆O₁₈)(OH,F)₄",
    crystalSystem: "Trigonal",
    hardness: 7.5,
    luster: "Vitreous",
    color: "#2a1a3e",
    streak: "White",
    cleavage: "None",
    specificGravity: "3.06-3.25",
    category: "Borosilicates",
    description:
      "A crystalline boron silicate mineral group with an incredible range of colors. Has piezoelectric and pyroelectric properties.",
    funFact: "Tourmaline generates an electric charge when heated or put under pressure — ancient Dutch merchants used it to pull ash from pipes.",
    uses: ["Jewelry", "Pressure gauges", "Hair straighteners", "Far-infrared therapy"],
  },
  {
    name: "Topaz",
    slug: "topaz",
    formula: "Al₂SiO₄(F,OH)₂",
    crystalSystem: "Orthorhombic",
    hardness: 8,
    luster: "Vitreous",
    color: "#daa520",
    streak: "White",
    cleavage: "Perfect basal",
    specificGravity: "3.49-3.57",
    category: "Silicates",
    description:
      "An aluminum silicate fluoride hydroxide mineral. Imperial topaz is the most valued gemstone variety.",
    funFact: "The largest cut topaz (the Braganza) is 16,400 carats and is set in the Portuguese Crown — its authenticity has been debated for centuries.",
    uses: ["Gemstone", "Abrasive", "Optics"],
  },
];

export const mineralCategories = [
  "All",
  "Silicates",
  "Carbonates",
  "Sulfides",
  "Native Elements",
  "Borosilicates",
];

export function getMineralBySlug(slug: string): Mineral | undefined {
  return minerals.find((m) => m.slug === slug);
}
