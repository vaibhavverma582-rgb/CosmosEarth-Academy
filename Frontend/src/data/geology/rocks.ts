export interface Rock {
  name: string;
  slug: string;
  category: "igneous" | "sedimentary" | "metamorphic";
  type: "intrusive" | "extrusive" | "clastic" | "chemical" | "organic" | "foliated" | "non-foliated";
  description: string;
  formation: string;
  composition: string;
  hardness: string; // Mohs scale range
  color: string;
  texture: string;
  uses: string[];
  funFact: string;
  image?: string;
}

export const rocks: Rock[] = [
  // ─── Igneous ────────────────────────────────
  {
    name: "Granite",
    slug: "granite",
    category: "igneous",
    type: "intrusive",
    description:
      "A coarse-grained intrusive igneous rock composed of quartz, feldspar, and mica. One of the most common rocks in Earth's continental crust.",
    formation: "Cooling of magma beneath the surface over thousands of years",
    composition: "Quartz, feldspar, mica, amphibole",
    hardness: "6-7",
    color: "#b0a090",
    texture: "Coarse-grained (phaneritic)",
    uses: ["Building material", "Countertops", "Monuments", "Paving"],
    funFact: "Granite makes up about 70-80% of Earth's continental crust.",
  },
  {
    name: "Basalt",
    slug: "basalt",
    category: "igneous",
    type: "extrusive",
    description:
      "A fine-grained extrusive igneous rock formed from rapid cooling of lava. It's the most common rock on Earth's surface and covers ocean floors.",
    formation: "Rapid cooling of lava at or near the surface",
    composition: "Plagioclase feldspar, pyroxene, olivine",
    hardness: "6-7",
    color: "#3a3a3a",
    texture: "Fine-grained (aphanitic)",
    uses: ["Construction aggregate", "Road base", "Cobblestones"],
    funFact: "The entire ocean floor is made of basalt — it's the most common rock on Earth's surface.",
  },
  {
    name: "Obsidian",
    slug: "obsidian",
    category: "igneous",
    type: "extrusive",
    description:
      "A volcanic glass formed from rapid cooling of silica-rich lava. It has a smooth, glassy texture and was used by ancient peoples for sharp tools.",
    formation: "Extremely rapid cooling of lava with high silica content",
    composition: "70-75% SiO₂ (silica)",
    hardness: "5-6",
    color: "#1a1a2e",
    texture: "Glassy (vitreous), conchoidal fracture",
    uses: ["Surgical blades", "Decorative stone", "Ancient weapons", "Jewelry"],
    funFact: "Obsidian blades can be sharper than surgical steel — the edge can be just a few nanometers thick.",
  },
  {
    name: "Pumice",
    slug: "pumice",
    category: "igneous",
    type: "extrusive",
    description:
      "A lightweight, porous volcanic rock formed from frothy lava. It's the only rock that can float on water.",
    formation: "Rapid cooling of gas-rich lava during volcanic eruptions",
    composition: "High silica content with trapped gas bubbles",
    hardness: "6",
    color: "#d4d0c8",
    texture: "Vesicular (full of holes)",
    uses: ["Lightweight aggregate", "Abrasive cleaner", "Horticulture", "Exfoliation"],
    funFact: "Pumice is so porous (up to 90% air) that it floats on water for years before eventually sinking.",
  },
  {
    name: "Rhyolite",
    slug: "rhyolite",
    category: "igneous",
    type: "extrusive",
    description:
      "An extrusive igneous rock with high silica content, similar in composition to granite but with a fine-grained texture.",
    formation: "Rapid cooling of silica-rich lava at the surface",
    composition: "Quartz, sanidine, plagioclase",
    hardness: "6-7",
    color: "#c4b8a8",
    texture: "Fine-grained to porphyritic",
    uses: ["Construction material", "Abrasive"],
    funFact: "Rhyolite eruptions are the most explosive type of volcanic eruption on Earth.",
  },
  {
    name: "Diorite",
    slug: "diorite",
    category: "igneous",
    type: "intrusive",
    description:
      "A coarse-grained intrusive igneous rock intermediate between granite and basalt in composition.",
    formation: "Slow cooling of magma beneath the surface",
    composition: "Plagioclase feldspar, biotite, hornblende",
    hardness: "6-7",
    color: "#8a8a7a",
    texture: "Coarse-grained (phaneritic)",
    uses: ["Construction", "Dimension stone", "Railway ballast"],
    funFact: "Ancient Egyptians used diorite for some of their hardest and most durable sculptures.",
  },

  // ─── Sedimentary ────────────────────────────
  {
    name: "Sandstone",
    slug: "sandstone",
    category: "sedimentary",
    type: "clastic",
    description:
      "A clastic sedimentary rock composed mainly of sand-sized mineral grains or rock fragments. Often shows beautiful layering patterns.",
    formation: "Cementation of sand grains over millions of years",
    composition: "Quartz, feldspar, lithic fragments",
    hardness: "6-7",
    color: "#c4a35a",
    texture: "Grainy, visible sand particles",
    uses: ["Building material", "Paving", "Sculpture", "Aquifer"],
    funFact: "The grand formations of Zion National Park are carved from ancient sandstone dunes.",
  },
  {
    name: "Limestone",
    slug: "limestone",
    category: "sedimentary",
    type: "chemical",
    description:
      "A sedimentary rock composed mainly of calcium carbonate (CaCO₃). Often formed from accumulated marine organism shells.",
    formation: "Accumulation of marine organism shells and chemical precipitation",
    composition: "Calcite (CaCO₃), sometimes with clay or sand",
    hardness: "3-4",
    color: "#d4cfc0",
    texture: "Smooth to grainy, may contain fossils",
    uses: ["Cement production", "Building material", "Agriculture (lime)", "Chemical feedstock"],
    funFact: "The White Cliffs of Dover are made of limestone — specifically, billions of tiny fossil coccolithophores.",
  },
  {
    name: "Shale",
    slug: "shale",
    category: "sedimentary",
    type: "clastic",
    description:
      "A fine-grained sedimentary rock formed from the compaction of silt and clay-size mineral particles. The most common sedimentary rock.",
    formation: "Compaction of fine mud and clay on lake or ocean floors",
    composition: "Clay minerals, quartz, feldspar",
    hardness: "1-3",
    color: "#6a6a5a",
    texture: "Fine-grained, fissile (splits into layers)",
    uses: ["Brick making", "Cement", "Oil and gas source rock"],
    funFact: "Shale is responsible for most of the oil and natural gas we use — hydrocarbons form from organic matter trapped in it.",
  },
  {
    name: "Chalk",
    slug: "chalk",
    category: "sedimentary",
    type: "organic",
    description:
      "A soft, white, porous sedimentary rock made from the mineral calcite. Formed from microscopic marine organism shells.",
    formation: "Accumulation of microscopic plankton shells (coccoliths)",
    composition: "Calcite (CaCO₃) from microscopic organisms",
    hardness: "1",
    color: "#f0ece4",
    texture: "Very fine-grained, soft, powdery",
    uses: ["Writing implements", "Antacid", "Agriculture", "Portland cement"],
    funFact: "The chalk cliffs of England and France are made of trillions of microscopic fossilized algae.",
  },
  {
    name: "Conglomerate",
    slug: "conglomerate",
    category: "sedimentary",
    type: "clastic",
    description:
      "A coarse-grained sedimentary rock composed of rounded fragments larger than 2mm cemented together in a fine-grained matrix.",
    formation: "Cementation of rounded gravel and pebbles in riverbeds or beaches",
    composition: "Rock fragments, pebbles, sand, mineral cement",
    hardness: "5-7",
    color: "#9a8a7a",
    texture: "Coarse, visible rounded clasts",
    uses: ["Construction aggregate", "Decorative stone"],
    funFact: "The rounded pebbles in conglomerate tell geologists that they were transported by water — angular fragments mean they weren't moved far.",
  },

  // ─── Metamorphic ────────────────────────────
  {
    name: "Marble",
    slug: "marble",
    category: "metamorphic",
    type: "non-foliated",
    description:
      "A metamorphic rock formed from the recrystallization of limestone under heat and pressure. Prized for sculpture and architecture.",
    formation: "Metamorphism of limestone/dolostone under high heat and pressure",
    composition: "Recrystallized calcite or dolomite",
    hardness: "3-4",
    color: "#e8e0d4",
    texture: "Sugary (saccharoidal), crystalline",
    uses: ["Sculpture", "Architecture", "Flooring", "Countertops"],
    funFact: "The Statue of David and the Taj Mahal are both carved from marble — the same metamorphosed limestone.",
  },
  {
    name: "Slate",
    slug: "slate",
    category: "metamorphic",
    type: "foliated",
    description:
      "A fine-grained metamorphic rock formed from shale. It has excellent cleavage, allowing it to be split into thin, durable sheets.",
    formation: "Low-grade metamorphism of shale under directed pressure",
    composition: "Clay minerals, quartz, chlorite, muscovite",
    hardness: "3-4",
    color: "#4a4a5a",
    texture: "Fine-grained, slaty cleavage",
    uses: ["Roofing tiles", "Chalkboards", "Flooring", "Pool tables"],
    funFact: "Slate can be so thin it's translucent — thin enough to see light through, yet strong enough to use as roofing.",
  },
  {
    name: "Schist",
    slug: "schist",
    category: "metamorphic",
    type: "foliated",
    description:
      "A medium-grade metamorphic rock with visible platy minerals arranged in layers. Named for its tendency to split into sheets.",
    formation: "Medium-grade metamorphism of shale or igneous rocks",
    composition: "Mica, chlorite, talc, quartz, feldspar",
    hardness: "4-5",
    color: "#7a8a7a",
    texture: "Medium-grained, schistosity (visible mineral alignment)",
    uses: ["Decorative stone", "Dimension stone"],
    funFact: "Garnet schist contains beautiful red garnet crystals that grew during metamorphism — they can be finger-ring sized.",
  },
  {
    name: "Gneiss",
    slug: "gneiss",
    category: "metamorphic",
    type: "foliated",
    description:
      "A high-grade metamorphic rock with distinct banding of light and dark minerals. Pronounced 'nice'.",
    formation: "High-grade metamorphism of granite, shale, or other rocks",
    composition: "Feldspar, quartz, mica, amphibole in alternating bands",
    hardness: "6-7",
    color: "#8a8a8a",
    texture: "Coarse-grained, gneissic banding",
    uses: ["Dimension stone", "Construction", "Decorative facing"],
    funFact: "The oldest known rocks on Earth are gneisses — some from Canada are over 4 billion years old.",
  },
  {
    name: "Quartzite",
    slug: "quartzite",
    category: "metamorphic",
    type: "non-foliated",
    description:
      "A hard metamorphic rock formed from the metamorphism of pure quartz sandstone. Extremely durable.",
    formation: "Metamorphism of quartz sandstone under high temperature and pressure",
    composition: "Almost entirely quartz",
    hardness: "7",
    color: "#d0ccc0",
    texture: "Granular, sugary, very hard",
    uses: ["Railroad ballast", "Roofing tiles", "Aggregate", "Decorative stone"],
    funFact: "Quartzite is so hard that when it breaks, it fractures through the quartz grains rather than around them — unlike sandstone.",
  },
];

export const rockCategories = [
  { name: "Igneous", slug: "igneous", color: "#ff6b35", description: "Formed from cooling magma or lava" },
  { name: "Sedimentary", slug: "sedimentary", color: "#4a90d9", description: "Formed from deposited sediments" },
  { name: "Metamorphic", slug: "metamorphic", color: "#7b2ff2", description: "Transformed by heat and pressure" },
] as const;

export function getRockBySlug(slug: string): Rock | undefined {
  return rocks.find((r) => r.slug === slug);
}
