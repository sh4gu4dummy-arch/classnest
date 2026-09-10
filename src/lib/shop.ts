/** Point shop — real art, shields, cosmetics, nest decor. */

export type ShopItemType = "shield" | "star" | "banner" | "frame" | "home";

export type ShopItem = {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: ShopItemType;
  charges?: number;
  accent: string;
  max?: number;
  icon: string;
  badge: string;
  /** Catalog / nest image */
  src: string;
};

export const SHOP_ITEMS: ShopItem[] = [
  {
    id: "shield_1",
    name: "Force Shield",
    description: "Blocks 1 spar. Points stay put.",
    cost: 12,
    type: "shield",
    charges: 1,
    accent: "#38bdf8",
    icon: "shield",
    badge: "1×",
    src: "/shop/icons/shield.jpg?v=040",
  },
  {
    id: "shield_3",
    name: "Aegis Pack",
    description: "Three blocks. Tank the arena.",
    cost: 30,
    type: "shield",
    charges: 3,
    accent: "#22d3ee",
    icon: "shield",
    badge: "3×",
    src: "/shop/icons/shield.jpg?v=040",
  },
  {
    id: "star",
    name: "Glory Star",
    description: "Pin a star on the avatar. Up to 5.",
    cost: 18,
    type: "star",
    max: 5,
    accent: "#fbbf24",
    icon: "star",
    badge: "★",
    src: "/shop/icons/star.jpg?v=040",
  },
  {
    id: "banner_aurora",
    name: "Aurora Banner",
    description: "Teal lights over a still lake.",
    cost: 25,
    type: "banner",
    accent: "#2dd4bf",
    icon: "flag",
    badge: "Banner",
    src: "/shop/banners/aurora.jpg?v=040",
  },
  {
    id: "banner_void",
    name: "Void Banner",
    description: "Deep-space swirl for night legends.",
    cost: 25,
    type: "banner",
    accent: "#a855f7",
    icon: "flag",
    badge: "Banner",
    src: "/shop/banners/void.jpg?v=040",
  },
  {
    id: "banner_solar",
    name: "Solar Banner",
    description: "Gold sunrise. Champion energy.",
    cost: 28,
    type: "banner",
    accent: "#f59e0b",
    icon: "flag",
    badge: "Banner",
    src: "/shop/banners/solar.jpg?v=040",
  },
  {
    id: "banner_ember",
    name: "Ember Banner",
    description: "Crimson heat over dark rock.",
    cost: 28,
    type: "banner",
    accent: "#f43f5e",
    icon: "flag",
    badge: "Banner",
    src: "/shop/banners/ember.jpg?v=040",
  },
  {
    id: "banner_meadow",
    name: "Meadow Banner",
    description: "Soft hills and wildflowers.",
    cost: 22,
    type: "banner",
    accent: "#4ade80",
    icon: "flag",
    badge: "Banner",
    src: "/shop/banners/meadow.jpg?v=040",
  },
  {
    id: "banner_paper",
    name: "Parchment Banner",
    description: "Quiet cream paper. Subtle taste.",
    cost: 22,
    type: "banner",
    accent: "#d6c7a8",
    icon: "flag",
    badge: "Banner",
    src: "/shop/banners/paper.jpg?v=040",
  },
  {
    id: "frame_gold",
    name: "Gold Frame",
    description: "Ornate gold ring. Legend look.",
    cost: 40,
    type: "frame",
    accent: "#fbbf24",
    icon: "circle",
    badge: "Frame",
    src: "/shop/frames/gold.png?v=040",
  },
  {
    id: "frame_neon",
    name: "Neon Frame",
    description: "Cyber cyan pulse ring.",
    cost: 40,
    type: "frame",
    accent: "#22d3ee",
    icon: "circle",
    badge: "Frame",
    src: "/shop/frames/neon.png?v=040",
  },
  {
    id: "frame_void",
    name: "Void Frame",
    description: "Purple fracture for apex beasts.",
    cost: 45,
    type: "frame",
    accent: "#c084fc",
    icon: "circle",
    badge: "Frame",
    src: "/shop/frames/void.png?v=040",
  },
  {
    id: "frame_oak",
    name: "Oak Frame",
    description: "Warm wood. Classroom classic.",
    cost: 32,
    type: "frame",
    accent: "#b45309",
    icon: "circle",
    badge: "Frame",
    src: "/shop/frames/oak.png?v=040",
  },
  {
    id: "frame_ice",
    name: "Frost Frame",
    description: "Pale ice rim. Quiet and sharp.",
    cost: 36,
    type: "frame",
    accent: "#7dd3fc",
    icon: "circle",
    badge: "Frame",
    src: "/shop/frames/ice.png?v=040",
  },
  {
    id: "home_plant",
    name: "Crystal Plant",
    description: "Glowing succulent for the nest.",
    cost: 10,
    type: "home",
    accent: "#4ade80",
    icon: "leaf",
    badge: "Decor",
    src: "/shop/home/plant.jpg?v=040",
  },
  {
    id: "home_rug",
    name: "Star Rug",
    description: "Soft rug under the beast.",
    cost: 14,
    type: "home",
    accent: "#818cf8",
    icon: "square",
    badge: "Decor",
    src: "/shop/home/rug.jpg?v=040",
  },
  {
    id: "home_lamp",
    name: "Nebula Lamp",
    description: "Floating lamp. Soft violet light.",
    cost: 16,
    type: "home",
    accent: "#e879f9",
    icon: "lamp",
    badge: "Decor",
    src: "/shop/home/lamp.jpg?v=040",
  },
  {
    id: "home_sofa",
    name: "Cloud Sofa",
    description: "Fluffy lounge for victory naps.",
    cost: 22,
    type: "home",
    accent: "#94a3b8",
    icon: "sofa",
    badge: "Decor",
    src: "/shop/home/sofa.jpg?v=040",
  },
  {
    id: "home_poster",
    name: "Legend Poster",
    description: "Wall art of storm and sun.",
    cost: 12,
    type: "home",
    accent: "#f97316",
    icon: "image",
    badge: "Decor",
    src: "/shop/home/poster.jpg?v=040",
  },
  {
    id: "home_trophy",
    name: "Champion Trophy",
    description: "Spar dominance. Big flex.",
    cost: 55,
    type: "home",
    accent: "#fbbf24",
    icon: "trophy",
    badge: "Rare",
    src: "/shop/home/trophy.jpg?v=040",
  },
  {
    id: "home_shelf",
    name: "Relic Shelf",
    description: "Wood shelf with little relics.",
    cost: 20,
    type: "home",
    accent: "#d97706",
    icon: "box",
    badge: "Decor",
    src: "/shop/home/shelf.jpg?v=040",
  },
  {
    id: "home_window",
    name: "Sky Window",
    description: "Arched night window. Moon view.",
    cost: 18,
    type: "home",
    accent: "#38bdf8",
    icon: "window",
    badge: "Decor",
    src: "/shop/home/window.jpg?v=040",
  },
];

export function getShopItem(id: string): ShopItem | undefined {
  return SHOP_ITEMS.find((i) => i.id === id);
}

export type BannerStyle = {
  from: string;
  to: string;
  label: string;
  src: string;
};

export const BANNER_STYLES: Record<string, BannerStyle> = {
  banner_aurora: { from: "#0d9488", to: "#7c3aed", label: "Aurora", src: "/shop/banners/aurora.jpg?v=040" },
  banner_void: { from: "#4c1d95", to: "#0f172a", label: "Void", src: "/shop/banners/void.jpg?v=040" },
  banner_solar: { from: "#f59e0b", to: "#ea580c", label: "Solar", src: "/shop/banners/solar.jpg?v=040" },
  banner_ember: { from: "#e11d48", to: "#7f1d1d", label: "Ember", src: "/shop/banners/ember.jpg?v=040" },
  banner_meadow: { from: "#4ade80", to: "#65a30d", label: "Meadow", src: "/shop/banners/meadow.jpg?v=040" },
  banner_paper: { from: "#d6c7a8", to: "#a8a29e", label: "Parchment", src: "/shop/banners/paper.jpg?v=040" },
};

/** Pack default board arenas (reuse shop banner stills — no extra downloads). */
export const PACK_BOARD_BACKDROP: Record<"kids" | "teens" | "ultra", string> = {
  kids: "banner_meadow",
  teens: "banner_solar",
  ultra: "banner_void",
};

export const BOARD_BACKDROP_IDS = [
  "banner_aurora",
  "banner_void",
  "banner_solar",
  "banner_ember",
  "banner_meadow",
  "banner_paper",
] as const;

export function resolveBoardBackdropSrc(
  backdrop: string | null | undefined,
  pack: "kids" | "teens" | "ultra" = "kids",
): string | null {
  if (backdrop === "none") return null;
  const id =
    !backdrop || backdrop === "auto"
      ? PACK_BOARD_BACKDROP[pack]
      : backdrop;
  return BANNER_STYLES[id]?.src ?? BANNER_STYLES[PACK_BOARD_BACKDROP[pack]]?.src ?? null;
}

export type FrameStyle = { color: string; glow: string; src: string };

export const FRAME_STYLES: Record<string, FrameStyle> = {
  frame_gold: { color: "#fbbf24", glow: "rgba(251,191,36,0.55)", src: "/shop/frames/gold.png?v=040" },
  frame_neon: { color: "#22d3ee", glow: "rgba(34,211,238,0.55)", src: "/shop/frames/neon.png?v=040" },
  frame_void: { color: "#c084fc", glow: "rgba(192,132,252,0.55)", src: "/shop/frames/void.png?v=040" },
  frame_oak: { color: "#b45309", glow: "rgba(180,83,9,0.45)", src: "/shop/frames/oak.png?v=040" },
  frame_ice: { color: "#7dd3fc", glow: "rgba(125,211,252,0.5)", src: "/shop/frames/ice.png?v=040" },
};

export const HOME_ITEM_META: Record<
  string,
  { label: string; slot: "floor" | "wall" | "corner" | "center"; color: string; src: string }
> = {
  home_plant: { label: "Crystal Plant", slot: "corner", color: "#4ade80", src: "/shop/home/plant.jpg?v=040" },
  home_rug: { label: "Star Rug", slot: "floor", color: "#818cf8", src: "/shop/home/rug.jpg?v=040" },
  home_lamp: { label: "Nebula Lamp", slot: "corner", color: "#e879f9", src: "/shop/home/lamp.jpg?v=040" },
  home_sofa: { label: "Cloud Sofa", slot: "floor", color: "#94a3b8", src: "/shop/home/sofa.jpg?v=040" },
  home_poster: { label: "Legend Poster", slot: "wall", color: "#f97316", src: "/shop/home/poster.jpg?v=040" },
  home_trophy: { label: "Champion Trophy", slot: "center", color: "#fbbf24", src: "/shop/home/trophy.jpg?v=040" },
  home_shelf: { label: "Relic Shelf", slot: "wall", color: "#d97706", src: "/shop/home/shelf.jpg?v=040" },
  home_window: { label: "Sky Window", slot: "wall", color: "#38bdf8", src: "/shop/home/window.jpg?v=040" },
};
