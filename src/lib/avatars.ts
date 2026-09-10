/** Local avatar packs — Kids, Teens (kept), Ultra (Imagine evolving legends). */

export type AvatarPack = "kids" | "teens" | "ultra";

export type AvatarCategory =
  | "creature"
  | "animal"
  | "fighter"
  | "scifi"
  | "human"
  | "mythic"
  | "nature"
  | "legendary";

export type AvatarDef = {
  id: number;
  name: string;
  /** Default / stage-1 src */
  src: string;
  accent: string;
  pack: AvatarPack;
  category: AvatarCategory;
  /** Ultra: 3 evolution stage image paths */
  stages?: [string, string, string];
  /** Short tagline for picker */
  vibe?: string;
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function kids(
  id: number,
  name: string,
  accent: string,
  category: AvatarCategory = "creature",
): AvatarDef {
  return {
    id,
    name,
    src: `/avatars/kids/${pad(id)}.jpg`,
    accent,
    pack: "kids",
    category,
  };
}

function teens(
  id: number,
  name: string,
  accent: string,
  category: AvatarCategory,
): AvatarDef {
  return {
    id,
    name,
    src: `/avatars/teens/${pad(id)}.jpg`,
    accent,
    pack: "teens",
    category,
  };
}

function ultra(
  id: number,
  name: string,
  accent: string,
  category: AvatarCategory,
  vibe: string,
): AvatarDef {
  const p = pad(id);
  const stages: [string, string, string] = [
    `/avatars/ultra/${p}-s1.jpg`,
    `/avatars/ultra/${p}-s2.jpg`,
    `/avatars/ultra/${p}-s3.jpg`,
  ];
  return {
    id,
    name,
    src: stages[0],
    accent,
    pack: "ultra",
    category,
    stages,
    vibe,
  };
}

/** 40 kid mascots — Imagine toy portraits (no CSS drawings). */
export const KIDS_AVATARS: AvatarDef[] = [
  kids(1, "Moon Bunny", "#c4b5fd", "animal"),
  kids(2, "Taco Turtle", "#fb923c", "animal"),
  kids(3, "Disco Duck", "#e879f9", "animal"),
  kids(4, "Balloon Tiger", "#fb7185", "animal"),
  kids(5, "Rocket Mouse", "#818cf8", "scifi"),
  kids(6, "Pancake Sloth", "#d97706", "animal"),
  kids(7, "Jazz Fox", "#fb923c", "animal"),
  kids(8, "Jewel Beetle", "#2dd4bf", "creature"),
  kids(9, "Marsh Ghost", "#c4b5fd", "mythic"),
  kids(10, "Soccer Koala", "#4ade80", "animal"),
  kids(11, "Porthole Whale", "#38bdf8", "animal"),
  kids(12, "Daisy Snail", "#86efac", "nature"),
  kids(13, "Lava Crab", "#f43f5e", "creature"),
  kids(14, "Quilt Owl", "#fbbf24", "animal"),
  kids(15, "Popcorn Penguin", "#f43f5e", "animal"),
  kids(16, "Origami Fox", "#fb923c", "mythic"),
  kids(17, "Surf Seal", "#22d3ee", "animal"),
  kids(18, "Lantern Moth", "#a78bfa", "mythic"),
  kids(19, "Boba Frog", "#4ade80", "animal"),
  kids(20, "Banjo Capybara", "#d97706", "animal"),
  kids(21, "Space Puppy", "#818cf8", "scifi"),
  kids(22, "Arcade Otter", "#c084fc", "animal"),
  kids(23, "Rainbow Llama", "#c084fc", "animal"),
  kids(24, "Shell Ninja", "#22c55e", "fighter"),
  kids(25, "Magic Kitten", "#f9a8d4", "mythic"),
  kids(26, "Pirate Parrot", "#f43f5e", "animal"),
  kids(27, "Crystal Buddy", "#67e8f9", "mythic"),
  kids(28, "Mini Hero", "#3b82f6", "fighter"),
  kids(29, "Bubble Narwhal", "#38bdf8", "animal"),
  kids(30, "Fairy Flutter", "#f9a8d4", "mythic"),
  kids(31, "Cookie Goblin", "#d97706", "creature"),
  kids(32, "Skate Hedgehog", "#a78bfa", "animal"),
  kids(33, "Tree Friend", "#65a30d", "nature"),
  kids(34, "Star Axolotl", "#f472b6", "animal"),
  kids(35, "Drum Bunny", "#38bdf8", "animal"),
  kids(36, "Wizard Toad", "#a855f7", "mythic"),
  kids(37, "Neon Jelly", "#22d3ee", "creature"),
  kids(38, "Cowboy Dino", "#fb923c", "creature"),
  kids(39, "Chef Panda", "#f43f5e", "animal"),
  kids(40, "Ice Cream Dragon", "#67e8f9", "creature"),
];

export const TEEN_AVATARS: AvatarDef[] = [
  teens(1, "Neon Blade", "#22d3ee", "fighter"),
  teens(2, "Shadow Monk", "#a855f7", "fighter"),
  teens(3, "Cyber Samurai", "#38bdf8", "scifi"),
  teens(4, "Arcane Mage", "#e879f9", "mythic"),
  teens(5, "Rail Lynx", "#f97316", "scifi"),
  teens(6, "Gravity Brawler", "#4ade80", "fighter"),
  teens(7, "Ink Dancer", "#f43f5e", "fighter"),
  teens(8, "Storm Rhino", "#94a3b8", "creature"),
  teens(9, "Apex Wolf", "#a8a29e", "animal"),
  teens(10, "Thunder Eagle", "#fbbf24", "animal"),
  teens(11, "Shadow Panther", "#a855f7", "animal"),
  teens(12, "Frost Fox", "#67e8f9", "animal"),
  teens(13, "Ember Phoenix", "#f97316", "mythic"),
  teens(14, "Abyss Kraken", "#6366f1", "creature"),
  teens(15, "Moss Elk", "#65a30d", "nature"),
  teens(16, "Spirit Bear", "#d97706", "animal"),
  teens(17, "Void Walker", "#c084fc", "mythic"),
  teens(18, "Mech Pilot", "#2dd4bf", "scifi"),
  teens(19, "Quantum Hacker", "#22d3ee", "scifi"),
  teens(20, "Star Captain", "#3b82f6", "scifi"),
  teens(21, "Android Rebel", "#818cf8", "scifi"),
  teens(22, "Radio Owl", "#d97706", "animal"),
  teens(23, "Lab Gecko", "#4ade80", "scifi"),
  teens(24, "Drone Ace", "#60a5fa", "scifi"),
  teens(25, "Street Racer", "#f43f5e", "human"),
  teens(26, "Graffiti Moth", "#a855f7", "creature"),
  teens(27, "Nightwave DJ", "#a855f7", "human"),
  teens(28, "Urban Skater", "#fbbf24", "human"),
  teens(29, "Chrome Swan", "#f472b6", "mythic"),
  teens(30, "Rebel Poet", "#c084fc", "human"),
  teens(31, "Mirror Fox", "#94a3b8", "mythic"),
  teens(32, "Stage Idol", "#f9a8d4", "human"),
  teens(33, "Crystal Titan", "#67e8f9", "mythic"),
  teens(34, "Oni Mask", "#ef4444", "mythic"),
  teens(35, "Desert Nomad", "#d97706", "human"),
  teens(36, "Bio Hybrid", "#4ade80", "scifi"),
  teens(37, "Chrono Hare", "#2dd4bf", "scifi"),
  teens(38, "VHS Raven", "#a855f7", "scifi"),
  teens(39, "Dragon Rider", "#f97316", "mythic"),
  teens(40, "Cosmic Guard", "#2dd4bf", "mythic"),
];

/**
 * Ultra pack — Imagine legends × 3 real evolution stages.
 * Hatchling (0–9) → Adolescent (10–19, subtle growth) → Legend (20+, saved wow art).
 * All non-human creature designs (no bipedal human hybrids).
 * Wave 3 (21–25): understated “plain taste” animals for quieter kids.
 * Wave 5 (36–55): humanoid / fantasy / construct — elf, witch, orc,
 * robot, alien, goblin, golem, djinn, merfolk, dryad, mech, living armor.
 * Wave 6 (56–75): more humanoids & constructs — no animals. Librarian, mirror
 * doppelganger, origami samurai, glitch kid, patchwork doll, stained glass,
 * rune monk, satellite robot, fungal monarch, coral statue, teacup knight,
 * star weaver, neon jester, flower smith, flame singer, cloud mason,
 * salt pirate, gingerbread paladin, robot dancer, dream guardian.
 * No animals.
 */
export const ULTRA_AVATARS: AvatarDef[] = [
  ultra(1, "Aetherflame", "#22d3ee", "legendary", "Crystal lightning wolf"),
  ultra(2, "Voidfang", "#a855f7", "animal", "Shadow panther void beast"),
  ultra(3, "Emberpuff", "#f97316", "animal", "Fire fox — kit → inferno → solar kitsune"),
  ultra(4, "Nebulynx", "#e879f9", "scifi", "Space cat — kit → constellation → galaxy lynx"),
  ultra(5, "Stormwyrm", "#38bdf8", "creature", "Storm dragon — kit → thunder → tempest king"),
  ultra(6, "Bloomkin", "#4ade80", "nature", "Floral panther — cub → vine lynx → grove guardian"),
  ultra(7, "Chronomech", "#2dd4bf", "scifi", "Chrome clockwork spider-bot"),
  ultra(8, "Frosthowl", "#67e8f9", "animal", "Ice wolf — pup → glacier → aurora alpha"),
  ultra(9, "Luminara", "#fbbf24", "mythic", "Celestial moth fairy"),
  ultra(10, "Ironclaw", "#f43f5e", "scifi", "Cyber raptor war machine"),
  // Wave 2 — diversity cast
  ultra(11, "Quillburst", "#a78bfa", "creature", "Ink-quill porcupine scribe"),
  ultra(12, "Tidalkin", "#22d3ee", "creature", "Bioluminescent jellyfish"),
  ultra(13, "Hexabyte", "#e879f9", "scifi", "Neon digital mesh fox"),
  ultra(14, "Bonehollow", "#94a3b8", "mythic", "Spectral bone bird"),
  ultra(15, "Sapwood", "#4ade80", "nature", "Bark beast — sprout → grove → forest stag"),
  ultra(16, "Prismite", "#f472b6", "mythic", "Geometric crystal rabbit"),
  ultra(17, "Junkbyte", "#84cc16", "scifi", "Scrap-metal junk beetle"),
  ultra(18, "Mirthling", "#fbbf24", "creature", "Confetti party blob"),
  ultra(19, "Abyssrake", "#6366f1", "creature", "Deep-sea angler eel"),
  ultra(20, "Solarox", "#f97316", "mythic", "Sacred sun scarab"),
  // Wave 3 — understated / plain-taste animals
  ultra(21, "Quietpaw", "#94a3b8", "animal", "Soft grey tabby — kit → sleek → silver elder"),
  ultra(22, "Hearthound", "#d97706", "animal", "Honey dog — pup → youth → noble retriever"),
  ultra(23, "Mistfawn", "#a8a29e", "animal", "Taupe deer — fawn → yearling → quiet stag"),
  ultra(24, "Mossback", "#65a30d", "nature", "Humble turtle — hatchling → mossy → elder shell"),
  ultra(25, "Softwing", "#d6d3d1", "animal", "Cream dove — chick → fledgling → calm white dove"),
  // Wave 4
  ultra(26, "Puddlefin", "#0ea5e9", "animal", "River otter — kit → mill-stream → moonlit king"),
  ultra(27, "Ashenhoof", "#d97706", "animal", "Desert ibex — kid → ridgeline → mesa sovereign"),
  ultra(28, "Paperwing", "#e7e5e4", "mythic", "Origami crane — fold → wings → library phoenix"),
  ultra(29, "Voltkoi", "#f59e0b", "creature", "Koi — fry → garden koi → sky-river dragon"),
  ultra(30, "Glimmercap", "#84cc16", "nature", "Mushroom frog — pea → spotted → grove oracle"),
  ultra(31, "Rookplate", "#a8a29e", "mythic", "Owl knight — owlet → squire → citadel sentinel"),
  ultra(32, "Sandwisp", "#fbbf24", "animal", "Fennec — kit → dusk runner → dune phantom"),
  ultra(33, "Scrapcoon", "#64748b", "scifi", "Raccoon — bottle-cap kit → gauntlet → neon baron"),
  ultra(34, "Kindlekin", "#ea580c", "animal", "Red panda — tea cub → apprentice → hearth-sage"),
  ultra(35, "Riftstallion", "#818cf8", "legendary", "Star horse — foal → comet yearling → galaxy stallion"),
  // Wave 5 — humanoid / fantasy / construct (no animals)
  ultra(36, "Thornveil", "#4ade80", "nature", "Wood elf ranger — apprentice → sentinel → moon-archduke"),
  ultra(37, "Hexmorrow", "#a855f7", "mythic", "Cottage witch — spoon-wand → hedge-witch → storm archmage"),
  ultra(38, "Ironmaw", "#ef4444", "fighter", "Orc smith — apprentice → forge champion → clan warchief"),
  ultra(39, "Gildframe", "#d97706", "scifi", "Clockwork paladin — tin squire → gear knight → cathedral saint"),
  ultra(40, "Vexilith", "#22d3ee", "scifi", "Crystal alien — visitor → diplomat → nebula sovereign"),
  ultra(41, "Sparkgrit", "#84cc16", "scifi", "Goblin inventor — tinkerer → rocket engineer → sky-fortress baron"),
  ultra(42, "Gravemason", "#78716c", "creature", "Stone golem — pebble child → quarry sentinel → mountain colossus"),
  ultra(43, "Cinderwish", "#f97316", "mythic", "Lantern djinn — lamp spark → bazaar weaver → silk-and-fire storm"),
  ultra(44, "Duskwyn", "#c084fc", "human", "Moonlit noble — night student → ballroom warden → eclipse duke"),
  ultra(45, "Brinecrown", "#06b6d4", "mythic", "Merfolk monarch — tide child → reef knight → abyssal crown"),
  ultra(46, "Palevow", "#e7e5e4", "mythic", "Bone paladin — relic squire → oath knight → cathedral of vows"),
  ultra(47, "Viridelle", "#65a30d", "nature", "Dryad healer — sprout kid → grove guardian → world-tree priestess"),
  ultra(48, "Quartzarch", "#e879f9", "mythic", "Crystal mage — shard student → prism battlemage → light cathedral"),
  ultra(49, "Inkstride", "#334155", "fighter", "Ink dancer — paper-mask kid → rooftop warden → living calligraphy"),
  ultra(50, "Aegisunit", "#64748b", "scifi", "Walking mech — scout walker → siege armor → city-guardian titan"),
  ultra(51, "Gleamward", "#fbbf24", "mythic", "Fairy knight — spark page → dusk chevalier → dawn paladin"),
  ultra(52, "Magmaheart", "#ea580c", "creature", "Lava elemental — ember child → basalt warrior → volcano monarch"),
  ultra(53, "Rimeveil", "#67e8f9", "mythic", "Ice sorcerer — frost apprentice → glacier mage → aurora empress"),
  ultra(54, "Solstice", "#fde68a", "legendary", "Celestial priest — lantern acolyte → sun-disc cleric → living constellation"),
  ultra(55, "Hollowplate", "#94a3b8", "mythic", "Kind empty armor — tin suit → painted knight → stained-glass living armor"),
  // Wave 6 — more humanoids / constructs (no animals)
  ultra(56, "Noxquill", "#1e293b", "mythic", "Ink librarian — paper child → archive warden → cathedral of books"),
  ultra(57, "Mirrorkin", "#94a3b8", "scifi", "Mirror doppelganger — shard child → silver mask → infinite palace"),
  ultra(58, "Parchblade", "#e7e5e4", "fighter", "Origami samurai — folded kid → crease warrior → paper castle lord"),
  ultra(59, "Nullbyte", "#22d3ee", "scifi", "Glitch kid — error sprite → hologram teen → broken-UI sovereign"),
  ultra(60, "Moonstitch", "#c4b5fd", "mythic", "Patchwork doll — button child → attic adventurer → night-quilt guardian"),
  ultra(61, "Glassheart", "#fb7185", "mythic", "Stained-glass person — shard kid → chapel youth → sunset cathedral"),
  ultra(62, "Runebound", "#a855f7", "fighter", "Living-tattoo monk — one rune → temple teen → ink-dragon body"),
  ultra(63, "Orbitron", "#38bdf8", "scifi", "Satellite robot — dish probe → orbital teen → solar-sail titan"),
  ultra(64, "Mycelarch", "#a3e635", "nature", "Fungal monarch — mushroom-cap child → spore cloak → underground city"),
  ultra(65, "Coralith", "#fb7185", "nature", "Coral statue — figurine kid → reef knight → walking reef-city"),
  ultra(66, "Cupwright", "#f59e0b", "fighter", "Teacup knight — cup-helm child → porcelain squire → china colossus"),
  ultra(67, "Starloom", "#818cf8", "legendary", "Constellation weaver — star-thread kid → balcony teen → sky-sized loom"),
  ultra(68, "Jesterion", "#e879f9", "human", "Neon undercity jester — motley kid → alley acrobat → carnival of light"),
  ultra(69, "Bloomforge", "#fb7185", "nature", "Flower blacksmith — daisy hammer → petal forge → blossom anvil"),
  ultra(70, "Pyrechoir", "#f97316", "mythic", "Flame singer — candle-mic child → ember opera → volcano amphitheater"),
  ultra(71, "Cloudmason", "#7dd3fc", "scifi", "Sky architect — cotton-stack kid → cloud scaffolding → weather city"),
  ultra(72, "Saltwake", "#e2e8f0", "human", "Salt-pirate captain — crusted-hat kid → salt-ship teen → crystal galleon"),
  ultra(73, "Sugarguard", "#fda4af", "mythic", "Gingerbread paladin — cookie armor → candy squire → icing cathedral"),
  ultra(74, "Circuitwaltz", "#67e8f9", "scifi", "Robot ballerina — wind-up kid → chrome dancer → opera of light"),
  ultra(75, "Dreamward", "#c4b5fd", "mythic", "Sleep guardian — star-mobile kid → moon nurse → palace of sleeping stars"),
];

/** @deprecated use getAvatars("kids") */
export const AVATARS = KIDS_AVATARS;

export const AVATAR_COUNT = 40;

export const PACK_LABELS: Record<AvatarPack, string> = {
  kids: "Kids — cute mascots",
  teens: "Teens — cool & power",
  ultra: "Ultra — 75 evolving legends",
};

export const PACK_SHORT: Record<AvatarPack, string> = {
  kids: "Kids",
  teens: "Teens",
  ultra: "Ultra",
};

export const ALL_PACKS: AvatarPack[] = ["kids", "teens", "ultra"];

export function getAvatars(pack: AvatarPack = "kids"): AvatarDef[] {
  if (pack === "teens") return TEEN_AVATARS;
  if (pack === "ultra") return ULTRA_AVATARS;
  return KIDS_AVATARS;
}

export function getAvatarCount(pack: AvatarPack = "kids"): number {
  return getAvatars(pack).length;
}

export function getAvatar(
  id: number | undefined | null,
  pack: AvatarPack = "kids",
): AvatarDef {
  const list = getAvatars(pack);
  const found = list.find((a) => a.id === id);
  if (found) return found;
  return list[0]!;
}

/** Visual form stage 1–3 for Ultra (and UI). */
export function getFormStage(points: number): 1 | 2 | 3 {
  if (!Number.isFinite(points) || points < 10) return 1;
  if (points < 20) return 2;
  return 3;
}

/**
 * Display size for avatar art.
 * - board: sharp 360px thumbs (low memory / fast paint on smartboards)
 * - full: original high-res for nest, hero, evolution trail
 */
export type AvatarDisplay = "board" | "full";

function boardThumbPath(src: string): string {
  // /avatars/ultra/01-s1.jpg → /avatars/ultra/board/01-s1.jpg
  // /avatars/kids/01.jpg → /avatars/kids/board/01.jpg
  const m = src.match(/^(\/avatars\/(?:ultra|kids|teens))\/(.+)$/);
  if (!m) return src;
  return `${m[1]}/board/${m[2]}`;
}

/** Image src for avatar at current points (Ultra swaps real evolution art). */
export function getAvatarSrc(
  id: number | undefined | null,
  pack: AvatarPack = "kids",
  points = 0,
  display: AvatarDisplay = "full",
): string {
  const av = getAvatar(id, pack);
  let src = av.src;
  if (pack === "ultra" && av.stages) {
    const stage = getFormStage(points);
    src = av.stages[stage - 1] ?? av.src;
  }
  if (display === "board") return boardThumbPath(src);
  return src;
}

/** Previous form src (for evolution morph). */
export function getAvatarSrcAtStage(
  id: number,
  pack: AvatarPack,
  stage: 1 | 2 | 3,
  display: AvatarDisplay = "full",
): string {
  const av = getAvatar(id, pack);
  let src = av.src;
  if (pack === "ultra" && av.stages) {
    src = av.stages[stage - 1] ?? av.src;
  }
  if (display === "board") return boardThumbPath(src);
  return src;
}

export function avatarFromSeed(seed: number, pack: AvatarPack = "kids"): number {
  const list = getAvatars(pack);
  return (Math.abs(seed) % list.length) + 1;
}

export function clampAvatarId(
  id: number | undefined | null,
  pack: AvatarPack = "kids",
): number {
  const list = getAvatars(pack);
  if (!id || id < 1 || id > list.length) return 1;
  return id;
}

export function isAvatarPack(v: unknown): v is AvatarPack {
  return v === "kids" || v === "teens" || v === "ultra";
}

export function resolvePack(v: unknown): AvatarPack {
  return isAvatarPack(v) ? v : "kids";
}

/** Ultra form labels — subtle mid, wow saved for Legend. */
export const ULTRA_FORM_NAMES: Record<1 | 2 | 3, string> = {
  1: "Hatchling",
  2: "Adolescent",
  3: "Legend",
};
