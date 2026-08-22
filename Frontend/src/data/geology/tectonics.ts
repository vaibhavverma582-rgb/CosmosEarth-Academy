export interface TectonicPlate {
  name: string;
  slug: string;
  area: string;
  movement: string;
  direction: string;
  speed: string;
  description: string;
  boundaries: string[];
  color: string;
}

export const tectonicPlates: TectonicPlate[] = [
  {
    name: "Pacific Plate",
    slug: "pacific",
    area: "103.3 million km²",
    movement: "Northwest",
    direction: "340°",
    speed: "6-10 cm/year",
    description:
      "The largest tectonic plate, covering most of the Pacific Ocean floor. It's being subducted along most of its boundaries, creating the Ring of Fire.",
    boundaries: [
      "Convergent with North American Plate (Cascadia subduction)",
      "Convergent with Philippine Plate (Japan Trench)",
      "Divergent with Nazca Plate (East Pacific Rise)",
      "Transform with San Andreas Fault",
    ],
    color: "#00d4ff",
  },
  {
    name: "North American Plate",
    slug: "north-american",
    area: "75.9 million km²",
    movement: "Southwest",
    direction: "230°",
    speed: "2.5 cm/year",
    description:
      "Covers North America, western Atlantic, and part of the Arctic. Includes both continental and oceanic crust.",
    boundaries: [
      "Divergent with Eurasian Plate (Mid-Atlantic Ridge)",
      "Transform with Pacific Plate (San Andreas Fault)",
      "Subducting under Caribbean Plate",
    ],
    color: "#4a90d9",
  },
  {
    name: "Eurasian Plate",
    slug: "eurasian",
    area: "67.8 million km²",
    movement: "Southeast",
    direction: "110°",
    speed: "2.1 cm/year",
    description:
      "The second largest plate, covering most of Europe and Asia. The collision with the Indian Plate created the Himalayas.",
    boundaries: [
      "Convergent with Indian Plate (Himalayas)",
      "Convergent with African Plate (Alps)",
      "Divergent with North American Plate (Mid-Atlantic Ridge)",
    ],
    color: "#c4a35a",
  },
  {
    name: "African Plate",
    slug: "african",
    area: "61.3 million km²",
    movement: "Northeast",
    direction: "40°",
    speed: "2.15 cm/year",
    description:
      "Covers the African continent and surrounding ocean floor. The East African Rift is slowly splitting this plate in two.",
    boundaries: [
      "Divergent with Antarctic Plate",
      "Convergent with Eurasian Plate (Mediterranean)",
      "Divergent (East African Rift — splitting the plate)",
    ],
    color: "#ff6b35",
  },
  {
    name: "Antarctic Plate",
    slug: "antarctic",
    area: "60.9 million km²",
    movement: "Mostly stationary",
    direction: "N/A",
    speed: "~1 cm/year",
    description:
      "Almost entirely surrounded by divergent boundaries (mid-ocean ridges). It's moving slowly northward in all directions.",
    boundaries: [
      "Divergent with all surrounding plates",
      "Spreading ridge encircles Antarctica",
    ],
    color: "#73c2d4",
  },
  {
    name: "Indo-Australian Plate",
    slug: "indo-australian",
    area: "58.9 million km²",
    movement: "North",
    direction: "350°",
    speed: "6.7 cm/year",
    description:
      "Formed by the merger of the Indian and Australian plates. Its northward collision with Eurasia created the Himalayas.",
    boundaries: [
      "Convergent with Eurasian Plate (Himalayas)",
      "Subducting under Sunda Plate (Indonesia)",
      "Divergent with Antarctic Plate",
    ],
    color: "#7b2ff2",
  },
  {
    name: "Nazca Plate",
    slug: "nazca",
    area: "15.6 million km²",
    movement: "East",
    direction: "78°",
    speed: "6.7 cm/year",
    description:
      "An oceanic plate subducting under South America, creating the Andes Mountains and the Peru-Chile Trench.",
    boundaries: [
      "Subducting under South American Plate (Andes)",
      "Divergent with Pacific Plate (East Pacific Rise)",
      "Divergent with Antarctic Plate",
    ],
    color: "#c1440e",
  },
  {
    name: "South American Plate",
    slug: "south-american",
    area: "43.6 million km²",
    movement: "West",
    direction: "275°",
    speed: "2.7 cm/year",
    description:
      "Covers the South American continent and extends to the Mid-Atlantic Ridge. The Nazca Plate subducts beneath it, creating the Andes.",
    boundaries: [
      "Convergent with Nazca Plate (Andes)",
      "Divergent with African Plate (Mid-Atlantic Ridge)",
      "Transform with Caribbean Plate",
    ],
    color: "#6b8e23",
  },
];

export const plateBoundaryTypes = [
  {
    name: "Convergent",
    description: "Plates moving toward each other — creates mountains, trenches, and subduction zones",
    color: "#ff2e97",
    icon: "→←",
  },
  {
    name: "Divergent",
    description: "Plates moving apart — creates new crust at mid-ocean ridges",
    color: "#00d4ff",
    icon: "←→",
  },
  {
    name: "Transform",
    description: "Plates sliding past each other — creates earthquakes and faults",
    color: "#ffd700",
    icon: "↑↓",
  },
];
