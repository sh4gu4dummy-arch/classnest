/** 30s five-beat adventures. Film: /avatars/ultra/adventures/{id}.mp4 */

export type UltraBeat = {
  title: string;
  visual: string;
};

export type UltraAdventure = {
  id: number;
  title: string;
  logline: string;
  beats: [UltraBeat, UltraBeat, UltraBeat, UltraBeat, UltraBeat];
};

export const ULTRA_ADVENTURE_SRC = (id: number) =>
  `/avatars/ultra/adventures/${String(id).padStart(2, "0")}.mp4`;

export const ULTRA_ADVENTURE_POSTER = (id: number) =>
  `/avatars/ultra/adventures/${String(id).padStart(2, "0")}.jpg`;

/** Filmed 30s adventures on disk. 38–55 stills/intros exist; films pending. */
export const ULTRA_ADVENTURE_READY = new Set<number>([
  ...Array.from({ length: 37 }, (_, i) => i + 1),
  ...Array.from({ length: 20 }, (_, i) => i + 56),
]);

export function ultraAdventureSrc(id: number): string | null {
  return ULTRA_ADVENTURE_READY.has(id) ? ULTRA_ADVENTURE_SRC(id) : null;
}

export const ULTRA_ADVENTURES: Record<number, UltraAdventure> = {
  1: {
    id: 1,
    title: "The Lantern Bolt",
    logline:
      "A lost cub freezes on the glass ridge. Aetherflame becomes the thunder, then gives it away as a light.",
    beats: [
      { title: "Lost", visual: "tiny ice-crystal fox cub huddled on a glass mountain ledge in a blizzard of static sparks, night, the crystal lightning wolf watching from above" },
      { title: "Bridge", visual: "the same lightning wolf walking the ridge, lightning bolts freezing into stepping-stone stairs of glass for the cub" },
      { title: "Afraid", visual: "the cub hiding in the wolf's glowing mane while thunder rolls, wolf lying down gently" },
      { title: "Gift", visual: "the wolf catching the last lightning bolt in its teeth, the bolt becoming a warm lantern" },
      { title: "Home", visual: "the cub carrying the small lantern down the mountain, wolf silhouette on the peak" },
    ],
  },
  2: {
    id: 2,
    title: "The Drawing That Walked",
    logline:
      "Voidfang finds a crumpled drawing of himself and walks it all the way to a sleeping windowsill.",
    beats: [
      { title: "Find", visual: "the shadow panther finding a crumpled child's crayon drawing of a purple panther in a void-garden of shadow-flowers" },
      { title: "Rise", visual: "the drawing lifting off the paper as a glowing paper-shadow panther cub beside the real Voidfang" },
      { title: "Walk", visual: "Voidfang and the paper cub walking a moonlit purple path between floating shadow lilies" },
      { title: "Window", visual: "Voidfang placing the paper cub on a cozy bedroom windowsill, curtains, night lamp, no people" },
      { title: "Petal", visual: "one purple void-petal left on the sill, Voidfang fading into the garden" },
    ],
  },
  3: {
    id: 3,
    title: "Gold in the Crack",
    logline:
      "A student's cracked clay fox spends the night with Emberpuff. Morning, the crack is gold.",
    beats: [
      { title: "Kiln", visual: "a cold dark classroom kiln, a cracked unpainted clay fox figurine on the shelf" },
      { title: "Breath", visual: "the fire fox Emberpuff breathing a tiny gold flame onto the crack in the clay fox" },
      { title: "Vigil", visual: "Emberpuff curled around the clay fox all night, embers like fireflies" },
      { title: "Gold", visual: "close on the clay fox, the crack now sealed with glowing kintsugi gold" },
      { title: "Shelf", visual: "morning sun on the classroom shelf, the gold-cracked fox glowing faintly, Emberpuff gone" },
    ],
  },
  4: {
    id: 4,
    title: "The Scared Star",
    logline:
      "A fallen star is lost on the attic floor. Nebulynx teaches it the map, then puts it back.",
    beats: [
      { title: "Fall", visual: "a small trembling star on wooden attic floorboards, the galaxy lynx Nebulynx approaching" },
      { title: "Play", visual: "Nebulynx batting the star like yarn across floating star-charts, playful, kind" },
      { title: "Map", visual: "the lynx showing the star a glowing constellation map with one empty pin-hole" },
      { title: "Return", visual: "Nebulynx leaping, placing the star back into a hole in the night sky" },
      { title: "Pin", visual: "the completed constellation, one new tiny pin of light labeled by a paw-print of stardust" },
    ],
  },
  5: {
    id: 5,
    title: "The Swallowed Thunder",
    logline:
      "Cliff-chicks cannot sleep. Stormwyrm eats his own storm so they can.",
    beats: [
      { title: "Nest", visual: "a cliff nest of tiny storm-birds shaking in violent rain, Stormwyrm the storm dragon above" },
      { title: "Swallow", visual: "Stormwyrm inhaling his own thunder, lightning disappearing into his chest, sky going quiet-dark" },
      { title: "Umbrella", visual: "the dragon's wing arched as a living cloud-umbrella over the nest, chicks peeking" },
      { title: "Sleep", visual: "chicks asleep under the wing, rain beading on scales, dragon's eyes soft" },
      { title: "Sea", visual: "dawn, Stormwyrm far out over the ocean releasing the storm where no nests are" },
    ],
  },
  6: {
    id: 6,
    title: "The Bottle Garden",
    logline:
      "Bloomkin does not scold the plastic bottle. He grows a world inside it.",
    beats: [
      { title: "Litter", visual: "a clear plastic bottle lying in the Vine Court, the floral panther Bloomkin sniffing it" },
      { title: "Vine", visual: "green vines threading into the bottle neck, tiny leaves unfurling inside the plastic" },
      { title: "Bloom", visual: "the bottle now a terrarium of impossible flowers, bees arriving" },
      { title: "Carry", visual: "Bloomkin carrying the bottle-garden gently in his mouth toward a wooden recycling bench" },
      { title: "Gift", visual: "the bottle-garden left on the class recycling bench with a single bloom as a bow" },
    ],
  },
  7: {
    id: 7,
    title: "The Try-Again Gear",
    logline:
      "The classroom clock is stuck. Chronomech finds the jammed gear named patience.",
    beats: [
      { title: "Stop", visual: "a huge brass classroom clock with a frozen second hand, dust, late afternoon" },
      { title: "Inside", visual: "Chronomech the clockwork spider climbing into the clockworks among giant gears" },
      { title: "Jam", visual: "a small rusty gear labeled with tiny engraved marks, stuck, Chronomech oiling it carefully" },
      { title: "Tick", visual: "the second hand lurching forward, brass light blooming" },
      { title: "Ghost", visual: "a chalkboard where erased math faintly reappears like a ghost of yesterday's try, Chronomech on the clock rim" },
    ],
  },
  8: {
    id: 8,
    title: "The Mitten Under Ice",
    logline:
      "Frosthowl walks a cracked lake so a lost mitten can go home.",
    beats: [
      { title: "Crack", visual: "a frozen lake with hairline cracks, a red child's mitten visible under the ice, aurora sky" },
      { title: "Walk", visual: "the ice wolf Frosthowl stepping so carefully the cracks freeze shut behind each paw" },
      { title: "Teeth", visual: "Frosthowl gently lifting the wet mitten in his teeth, breath steaming" },
      { title: "Door", visual: "a cabin door, the mitten laid on the mat, wolf waiting a moment" },
      { title: "Frost", visual: "frost-breath letters fading on the window that almost said still here, wolf leaving into aurora" },
    ],
  },
  9: {
    id: 9,
    title: "Hallway of Small Suns",
    logline:
      "Luminara turns a dark school hall into a night that is not empty.",
    beats: [
      { title: "Hall", visual: "a long dark school hallway, one exit sign, the celestial moth Luminara tiny in the dark" },
      { title: "Switch", visual: "Luminara landing on a light switch, moth-dust sparking like a kiss of light" },
      { title: "Lamps", visual: "the moth flying the hallway, dropping floating lantern-orbs of moth-dust that hang in air" },
      { title: "Heart", visual: "the last lamp forming a small glowing heart-shape at the far door" },
      { title: "Dawn", visual: "pale morning, the lamps fading, hallway ordinary again, one gold moth-scale on the floor" },
    ],
  },
  10: {
    id: 10,
    title: "The Night Drill",
    logline:
      "Ironclaw practices alone. Someone copies him. He pretends not to see, then nods.",
    beats: [
      { title: "Field", visual: "an empty night practice field, the cyber raptor Ironclaw setting scrap-metal cones that glow" },
      { title: "Slow", visual: "Ironclaw running the drill slowly, counting, sparks from claws, disciplined not violent" },
      { title: "Copy", visual: "a small distant silhouette of a student at the fence copying the footwork, Ironclaw's eye-lens noticing" },
      { title: "Pretend", visual: "Ironclaw looking away on purpose, continuing the drill a little slower so it is learnable" },
      { title: "Nod", visual: "end of drill, Ironclaw facing the fence, one small nod, cones dimming" },
    ],
  },
  11: {
    id: 11,
    title: "The Uncrumpled Note",
    logline:
      "Quillburst saves a thrown-away apology and writes beside it, not over it.",
    beats: [
      { title: "Trash", visual: "a crumpled torn apology note in a classroom wastebasket, the ink-quill porcupine looking in" },
      { title: "Open", visual: "Quillburst uncrumpling the note with careful quills, tear still there" },
      { title: "Beside", visual: "gold ink appearing beside the shaky pencil words, not replacing them, two handwritings" },
      { title: "Locker", visual: "the note sliding under a closed locker door, Quillburst's quills retreating" },
      { title: "Tear", visual: "close on the saved tear in the paper, gold thread holding it like a scar that is allowed" },
    ],
  },
  12: {
    id: 12,
    title: "The Boat That Missed Someone",
    logline:
      "Tidalkin returns a toy boat — and leaves a shell that sounds like a person who is gone.",
    beats: [
      { title: "Beached", visual: "a wooden toy sailboat stranded on wet sand at dusk, the jellyfish Tidalkin glowing nearby" },
      { title: "Lift", visual: "Tidalkin lifting the tide just enough, the boat floating, jellyfish beside it like a lantern" },
      { title: "Note", visual: "inside the boat a tiny handwritten scrap, jellyfish light reading it gently, no readable text" },
      { title: "Dock", visual: "the boat tied at a sleeping wooden dock, night, calm water" },
      { title: "Shell", visual: "a spiral shell left in the boat that glows faintly as if it holds a recorded wave" },
    ],
  },
  13: {
    id: 13,
    title: "The Comma That Was a Tear",
    logline:
      "Hexabyte dives into a crashed file and finds the error was tiredness.",
    beats: [
      { title: "Crash", visual: "a floating holographic homework window raining red error glyphs, the neon mesh fox Hexabyte" },
      { title: "Dive", visual: "Hexabyte diving into a tunnel of code-rain, reflections on digital fur" },
      { title: "Tear", visual: "a single comma in the code that is actually a glowing teardrop, fox paw hovering" },
      { title: "Patch", visual: "the tear becoming a warm semicolon-smile glyph, errors turning green" },
      { title: "Save", visual: "the homework window saving, a cursor blinking awake, Hexabyte sitting on the taskbar like a cat" },
    ],
  },
  14: {
    id: 14,
    title: "The Smile in the Photograph",
    logline:
      "Bonehollow restores only the smile on a faded class photo — enough.",
    beats: [
      { title: "Frame", visual: "an old class photograph on a wall, one face faded to almost nothing, moonlight, the spectral bone bird" },
      { title: "Trace", visual: "Bonehollow's wingtip tracing the faded oval, silver dust following" },
      { title: "Smile", visual: "only the smile returning in the photo, the rest still soft-faded, tender not spooky" },
      { title: "Feather", visual: "a single white feather settling on the picture frame" },
      { title: "Watch", visual: "Bonehollow roosting above the photo like a quiet night-guard" },
    ],
  },
  15: {
    id: 15,
    title: "The Stump With No Name",
    logline:
      "Sapwood sits until an abandoned stump is a seat again — then gives it to anyone.",
    beats: [
      { title: "Left", visual: "a dry tree stump in a schoolyard corner, weeds, the bark-stag Sapwood approaching" },
      { title: "Sit", visual: "Sapwood sitting on the stump through a time-lapse of weather, patient" },
      { title: "Moss", visual: "moss and clover making the stump soft and green, stag still there" },
      { title: "Sapling", visual: "a tiny sapling growing from the stump's heart beside the stag" },
      { title: "Anyone", visual: "the stump-seat empty and inviting, no name carved, morning kids' backpacks nearby, no faces" },
    ],
  },
  16: {
    id: 16,
    title: "The Moth Who Borrowed Color",
    logline:
      "A grey moth follows Prismite through a puddle and comes out itself.",
    beats: [
      { title: "Grey", visual: "a rainy grey playground, a small grey moth on a fence, the crystal rabbit Prismite" },
      { title: "Puddle", visual: "Prismite hopping into a puddle, the water exploding into a corridor of rainbow" },
      { title: "Follow", visual: "the grey moth flying the rainbow hallway after the rabbit" },
      { title: "Color", visual: "the moth emerging with stained-glass wings, surprised and delighted" },
      { title: "Keep", visual: "Prismite nodding, rain still grey everywhere else, only the moth staying colored" },
    ],
  },
  17: {
    id: 17,
    title: "The Extra Note",
    logline:
      "Junkbyte opens a stuck music box and adds one note that was never written.",
    beats: [
      { title: "Stuck", visual: "an old music box that will not open, the scrap-metal beetle Junkbyte circling it" },
      { title: "Key", visual: "Junkbyte building a tiny key from a paperclip and a shirt button" },
      { title: "Open", visual: "the music box opening, a small ballerina that is actually a metal moth, beginning to turn" },
      { title: "Lullaby", visual: "golden notes floating, Junkbyte listening with antennae" },
      { title: "Extra", visual: "Junkbyte tapping one extra note into the comb, a new warm tone hanging in the air, then he leaves" },
    ],
  },
  18: {
    id: 18,
    title: "A Party for the Cake",
    logline:
      "Nobody came. Mirthling celebrates the cake anyway — then hides so the laugh can be the gift.",
    beats: [
      { title: "Empty", visual: "a birthday cake on a table, empty chairs, drooping balloons, afternoon light" },
      { title: "Host", visual: "the confetti blob Mirthling throwing a tiny party for the cake, streamers, one candle" },
      { title: "Dance", visual: "Mirthling dancing with a balloon, cake smiling in frosting" },
      { title: "Hide", visual: "a door-crack of light, Mirthling diving under the tablecloth" },
      { title: "Laugh", visual: "under-table view of Mirthling peeking, confetti still falling, warm and funny" },
    ],
  },
  19: {
    id: 19,
    title: "Escort of the Sinking Light",
    logline:
      "Abyssrake does not snatch the glowstick back. He shows it the deep, then brings it up braver.",
    beats: [
      { title: "Sink", visual: "a green glowstick falling through dark seawater, the angler eel Abyssrake watching" },
      { title: "Meet", visual: "Abyssrake swimming beside the sinking light, lantern-lure warm not scary" },
      { title: "Wonders", visual: "they pass glowing jellies and cathedral-bones of a ship, the glowstick looking around" },
      { title: "Up", visual: "Abyssrake curling gently around the light, rising toward the moonlit surface" },
      { title: "Braver", visual: "the glowstick washed onto a night beach, dimmer but steady, eel silhouette in the surf" },
    ],
  },
  20: {
    id: 20,
    title: "Three Minutes of Early Sun",
    logline:
      "Solarox rolls dawn a little early for the drooping window plants, then pretends the day did it.",
    beats: [
      { title: "Droop", visual: "classroom plants wilted on a windowsill before dawn, the sun scarab Solarox on the glass" },
      { title: "Push", visual: "Solarox rolling a small sun along the horizon with his legs, mythic and tender" },
      { title: "Gold", visual: "first gold light hitting the leaves, dew lighting up" },
      { title: "Lift", visual: "the plants un-wilting, stretching, scarab watching" },
      { title: "Gone", visual: "ordinary sunrise, empty sill, as if the day itself was on time, one warm scarab-print in dust" },
    ],
  },
  21: {
    id: 21,
    title: "Matching the Rain",
    logline:
      "Quietpaw sits through the storm until the thunder learns his breathing.",
    beats: [
      { title: "Boom", visual: "a huge thunderstorm outside a window seat, the grey tabby Quietpaw flinching once" },
      { title: "Sit", visual: "Quietpaw sitting, chest rising, rain on glass" },
      { title: "Match", visual: "the rain streaks slowing to match the cat's breath, magical realism" },
      { title: "Small", visual: "thunder becoming a distant purr, cat's eyes half-closed" },
      { title: "Last", visual: "one last drop on the glass, Quietpaw still there, the room quiet" },
    ],
  },
  22: {
    id: 22,
    title: "The Desk That Wasn't Empty",
    logline:
      "Hearthound tries a tennis ball, then a scarf. He waits by the door for someone new.",
    beats: [
      { title: "Empty", visual: "a school desk with nothing on it, morning, the honey retriever Hearthound looking worried" },
      { title: "Ball", visual: "Hearthound placing his favorite tennis ball on the desk, then tilting his head no" },
      { title: "Scarf", visual: "he swaps it for a small knitted scarf, carefully straightened with his nose" },
      { title: "Door", visual: "Hearthound waiting at the classroom door, ears up, hallway light" },
      { title: "Wag", visual: "the door opening as warm light only, one slow wag, scarf on the desk in the background" },
    ],
  },
  23: {
    id: 23,
    title: "Pebbles for People Who Look",
    logline:
      "Mistfawn marks the long way. The short way was twenty steps. The long way taught the feet.",
    beats: [
      { title: "Lost", visual: "a foggy meadow, a fallen trail marker, the taupe stag Mistfawn" },
      { title: "Long", visual: "Mistfawn choosing the longer misty path, not the obvious short one" },
      { title: "Pebbles", visual: "he placing pale pebbles that only glow if you walk slowly" },
      { title: "Look", visual: "a slow walker seeing the pebbles light, a fast walker passing them dark" },
      { title: "End", visual: "the two paths meeting, twenty steps vs a winding ribbon, Mistfawn vanishing into fog" },
    ],
  },
  24: {
    id: 24,
    title: "The Slowest Raindrop",
    logline:
      "Mossback bets on the last raindrop. It wins because the others evaporate.",
    beats: [
      { title: "Race", visual: "raindrops racing down a window, the mossy turtle Mossback watching from the sill" },
      { title: "Bet", visual: "Mossback's eye following the slowest fattest drop at the top" },
      { title: "Rush", visual: "the fast drops streaking ahead and thinning, vanishing into dry glass" },
      { title: "Win", visual: "the slow drop reaching the bottom intact, a tiny victory splash" },
      { title: "Smile", visual: "Mossback's ancient kind eye, rain easing, moss brighter" },
    ],
  },
  25: {
    id: 25,
    title: "Paper Birds Come Home White",
    logline:
      "Softwing meets dark rumor-birds and folds them into white cranes that know how to land kindly.",
    beats: [
      { title: "Flock", visual: "dark origami rumor-birds swirling over a school roof, the cream dove Softwing" },
      { title: "Meet", visual: "Softwing touching one dark bird with a wing, it pausing" },
      { title: "Fold", visual: "the dark paper unfolding and refolding into a white crane in midair" },
      { title: "Flock2", visual: "a whole flock turning white, circling the dove" },
      { title: "Land", visual: "white cranes landing on a windowsill as blank kind notes, Softwing on the eave" },
    ],
  },
  26: {
    id: 26,
    title: "The Wrapper That Became a Pebble",
    logline:
      "No one saw the kind deed. Puddlefin did. The mill clicks once at midnight.",
    beats: [
      { title: "After", visual: "an empty playground after school, one candy wrapper, the river otter Puddlefin" },
      { title: "Wash", visual: "Puddlefin washing the wrapper in the mill-race until it becomes a smooth silver pebble" },
      { title: "Satchel", visual: "the pebble joining others in the leaf satchel" },
      { title: "Midnight", visual: "the wooden mill wheel turning one extra click under the moon" },
      { title: "Brighter", visual: "the mill-race glowing a little more, otter watching from the stone" },
    ],
  },
  27: {
    id: 27,
    title: "Footholds, Not Wings",
    logline:
      "Ashenhoof will not carry the stuck kid-goat. He stands on every hold so they can copy.",
    beats: [
      { title: "Ledge", visual: "a small desert ibex kid stuck on a narrow red-rock ledge, dusk" },
      { title: "Arrive", visual: "the adult ibex Ashenhoof appearing above, not leaping down to grab" },
      { title: "Show", visual: "Ashenhoof stepping onto each foothold slowly so the kid can see" },
      { title: "Copy", visual: "the kid climbing, matching each hoof, dust in gold light" },
      { title: "Top", visual: "both on the mesa, sunset, not touching, watching the same sun" },
    ],
  },
  28: {
    id: 28,
    title: "The Page That Thought It Was Nothing",
    logline:
      "Paperwing folds a blank page into a crane, unfolds it, and the creases remember how to fly.",
    beats: [
      { title: "Blank", visual: "a rejected blank page on a library floor, the origami phoenix Paperwing looking down" },
      { title: "Fold", visual: "Paperwing folding the page into a small crane with glowing crease-lines" },
      { title: "Unfold", visual: "unfolding it flat again, the crease-memory glowing like a map" },
      { title: "Brave", visual: "the page lifting itself, fluttering, learning" },
      { title: "Once", visual: "Paperwing and the page flying one loop over the lantern atrium, then the page landing as paper again, proud" },
    ],
  },
  29: {
    id: 29,
    title: "One Honest Rain-Ring",
    logline:
      "The shrine pond is dry. Voltkoi brings back a single true circle of rain.",
    beats: [
      { title: "Dry", visual: "a cracked floating shrine pond above clouds, thirsty koi fry, Voltkoi the long koi-dragon" },
      { title: "Climb", visual: "Voltkoi swimming up a river of sky toward a distant raincloud" },
      { title: "Ask", visual: "Voltkoi bowing to the cloud, whiskers touching, asking not taking" },
      { title: "Ring", visual: "one perfect circular rain-ripple falling into the pond, fry gathering" },
      { title: "Thanks", visual: "a single star reflected in the new water, Voltkoi coiled peacefully" },
    ],
  },
  30: {
    id: 30,
    title: "The Seed Under the Hat",
    logline:
      "Glimmercap rescues a tiny idea from a boot-path and grows a reading-nook, then takes no credit.",
    beats: [
      { title: "Path", visual: "a glowing seed almost on a dirt path, a boot-print nearby, the mushroom frog Glimmercap" },
      { title: "Hat", visual: "Glimmercap covering the seed with his mushroom cap, carrying it" },
      { title: "City", visual: "walking into Cap City, lantern toadstools, seed peeking" },
      { title: "Plant", visual: "planting the seed at the edge of town at twilight" },
      { title: "Nook", visual: "overnight a hollow reading-nook mushroom with a tiny book-shelf, Glimmercap already gone" },
    ],
  },
  31: {
    id: 31,
    title: "The Watch Without Armor",
    logline:
      "The bell is broken. Rookplate stands the night with the gorget on the stones.",
    beats: [
      { title: "Broken", visual: "a cracked bronze watch-bell on a castle wall, the owl Rookplate in plate" },
      { title: "Down", visual: "Rookplate setting his silver gorget and pauldron on the merlon, becoming just an owl" },
      { title: "Stand", visual: "the unarmored owl standing the whole night watch, moon crossing the sky" },
      { title: "Cold", visual: "frost on feathers, eyes still open, town lights below sleeping" },
      { title: "Dawn", visual: "first light, he putting the gorget back on, nobody saw, bell still broken, town safe" },
    ],
  },
  32: {
    id: 32,
    title: "The Thread That Didn't Gossip",
    logline:
      "Sandwisp catches a secret in the canyon and carries it only to the one who needed it.",
    beats: [
      { title: "Hang", visual: "a gold thread of almost-spoken words hanging in a starry canyon, the fennec Sandwisp" },
      { title: "Hear", visual: "Sandwisp's huge ear catching the thread, it wrapping like light" },
      { title: "Choose", visual: "two paths: a busy neon overlook vs a quiet dune, fennec choosing the quiet" },
      { title: "Give", visual: "the thread becoming a tiny earring of light on a waiting stone, as if for someone sitting there" },
      { title: "Fade", visual: "the earring fading after it is received, Sandwisp already a dust-streak" },
    ],
  },
  33: {
    id: 33,
    title: "The Fair Bottle-Cap",
    logline:
      "A heavy thumb on the scale. Scrapcoon swaps in a true weight and buys nothing.",
    beats: [
      { title: "Market", visual: "neon night market stall, a hanging scale, the raccoon Scrapcoon watching" },
      { title: "Thumb", visual: "a heavy thumb pressing the scale, fruit looking heavier, Scrapcoon's eyes narrowing" },
      { title: "Swap", visual: "Scrapcoon swapping the weight for his bottle-cap helm, now a perfect measure" },
      { title: "Nod", visual: "the vendor noticing, ashamed, nodding, putting the thumb away" },
      { title: "Leave", visual: "Scrapcoon walking off buying nothing, bottle-cap back on his head, lanterns" },
    ],
  },
  34: {
    id: 34,
    title: "One Page Back",
    logline:
      "Kindlekin does not explain the hard page. He pours tea and turns the book back one leaf.",
    beats: [
      { title: "Book", visual: "an open textbook with a tear-spot on the page, rain window, no face, the red panda Kindlekin" },
      { title: "Tea", visual: "Kindlekin pouring tea, steam, waiting, not talking" },
      { title: "Wait", visual: "two cups, the book still open to the hard page, rain" },
      { title: "Back", visual: "a paw turning the page backward one leaf, to a problem already understood" },
      { title: "Ease", visual: "the rain easing, tea half-drunk, Kindlekin blinking sleepy and kind" },
    ],
  },
  35: {
    id: 35,
    title: "Dust That Lasts a Day",
    logline:
      "Riftstallion lends the mane to someone who thinks the dark is empty. Their shoes keep the stars until last bell.",
    beats: [
      { title: "Empty", visual: "a silhouette on an observatory dome, looking at a black sky they think is empty, the star stallion approaching" },
      { title: "Mane", visual: "a small hand-silhouette holding Riftstallion's comet mane" },
      { title: "Ride", visual: "they galloping a path of the Milky Way, silent, huge and gentle" },
      { title: "Back", visual: "landing on the dome, shoes leaving stardust prints" },
      { title: "Bell", visual: "next day, empty school hallway, a pair of shoes under a hook still faintly star-dusted" },
    ],
  },
  36: {
    id: 36,
    title: "The Shortcut Home",
    logline:
      "A kid is lost between two streets. Thornveil draws a moon-path of leaves so they don’t have to run.",
    beats: [
      { title: "Lost", visual: "two empty suburban streets at dusk, a dropped backpack, the woodland elf Thornveil on a branch" },
      { title: "Path", visual: "Thornveil laying a trail of glowing leaves between the streets, bow unstrung" },
      { title: "Walk", visual: "the leaf-path lighting step by step, backpack being carried gently on the elf's back" },
      { title: "Gate", visual: "a porch light, the backpack set down, Thornveil already fading into hedges" },
      { title: "Moon", visual: "one leaf still glowing on the welcome mat, moon above the world-tree silhouette" },
    ],
  },
  37: {
    id: 37,
    title: "The Unspilled Retry",
    logline:
      "A potion explodes. Hexmorrow bottles the mess and labels it Try Two.",
    beats: [
      { title: "Boom", visual: "a cottage kitchen table splashed with purple potion, the witch Hexmorrow unbothered" },
      { title: "Scoop", visual: "Hexmorrow scooping the spill back into a jar with a wooden spoon, steam, herbs" },
      { title: "Label", visual: "a handwritten label: Try Two, star-stickers, kettle laughing" },
      { title: "Brew", visual: "the storm-cauldron simmering calmer, bottles orbiting like moons" },
      { title: "Shelf", visual: "the Try Two jar glowing on a shelf, rain on the cliff-cottage window" },
    ],
  },
  38: {
    id: 38,
    title: "The Singing Hinge",
    logline:
      "A classroom door squeaks. Ironmaw forges the hinge until it rings like a bell.",
    beats: [
      { title: "Squeak", visual: "a tired classroom door, rusty hinge, the orc smith Ironmaw listening" },
      { title: "Carry", visual: "Ironmaw carrying the hinge into a volcanic forge-citadel, respectful, not angry" },
      { title: "Strike", visual: "one ceremonial hammer-strike, sparks like gold bells" },
      { title: "Fit", visual: "the hinge back on the door, a small gold bell-charm hanging from it" },
      { title: "Open", visual: "morning, the door opening silently, a faint kind ring, Ironmaw gone" },
    ],
  },
  39: {
    id: 39,
    title: "A Seat in the Gears",
    logline:
      "Someone is late. Gildframe opens a spare tooth in the clock so they still belong.",
    beats: [
      { title: "Late", visual: "an empty pew in a clock-cathedral, dust motes, the brass paladin Gildframe waiting" },
      { title: "Tooth", visual: "Gildframe opening a spare gear-tooth like a chair, gold filigree" },
      { title: "Sit", visual: "the empty space filling with warm light, as if a person sat, no face shown" },
      { title: "Tick", visual: "the cathedral clock catching up one minute, kindly" },
      { title: "Oath", visual: "a small brass token left on the pew: You arrived" },
    ],
  },
  40: {
    id: 40,
    title: "The Feeling That Wouldn't Translate",
    logline:
      "A hard day has no words. Vexilith carries it as light and pins it in the embassy sky.",
    beats: [
      { title: "Weight", visual: "a small grey pebble of unspoken feeling on a desk, the crystal alien Vexilith approaching" },
      { title: "Hold", visual: "Vexilith holding the pebble until it facets into a tiny star" },
      { title: "Walk", visual: "the alien walking a glass embassy corridor, star in palm, galaxy windows" },
      { title: "Pin", visual: "placing the star into a quiet night sky beyond the window" },
      { title: "Home", visual: "the desk now empty, a faint prism left where the pebble was" },
    ],
  },
  41: {
    id: 41,
    title: "Ugly and Flying",
    logline:
      "A perfect paper plane won't launch. Sparkgrit tapes a bottle-rocket on and it does.",
    beats: [
      { title: "Paper", visual: "a too-perfect paper airplane that won't fly, a classroom fan, the goblin Sparkgrit" },
      { title: "Tape", visual: "Sparkgrit taping a tiny bottle-rocket and a bottle-cap rudder, goggles down" },
      { title: "Launch", visual: "the ugly plane flying a glorious wobbly loop around a sky-dock" },
      { title: "Cheer", visual: "Sparkgrit cheering on a ramshackle flying garage, sparks" },
      { title: "Land", visual: "the plane landing on a homework pile, slightly singed, victorious" },
    ],
  },
  42: {
    id: 42,
    title: "Names in the Stone",
    logline:
      "A kid thinks they don't count. Gravemason carves the name where the waterfall can read it.",
    beats: [
      { title: "Small", visual: "a tiny scratched-out name on a desk, the stone golem Gravemason kneeling" },
      { title: "Carry", visual: "Gravemason carrying the desk-plank like a tablet up a cliff-city" },
      { title: "Carve", visual: "a careful chisel, the name recarved clean into mountain stone" },
      { title: "Water", visual: "a waterfall washing the letters so they shine, not erase" },
      { title: "Stay", visual: "the name in the cliff forever, Gravemason sitting beside it like a bench" },
    ],
  },
  43: {
    id: 43,
    title: "The Shy Wish",
    logline:
      "Someone won't say it out loud. Cinderwish lights one extra lamp anyway.",
    beats: [
      { title: "Stall", visual: "a desert night bazaar, one unlit lamp, the djinn Cinderwish hovering" },
      { title: "Lean", visual: "Cinderwish leaning in as if listening to a whisper nobody else hears" },
      { title: "Lit", visual: "the extra lamp blooming into a warm gold lantern, silk swirling" },
      { title: "Leave", visual: "Cinderwish leaving the lamp on a windowsill, market behind" },
      { title: "Morning", visual: "dawn, the lamp still burning, a small note: you can try again" },
    ],
  },
  44: {
    id: 44,
    title: "Night Shift Courage",
    logline:
      "The palace thinks the night is empty. Duskwyn sets a second teacup on the terrace.",
    beats: [
      { title: "Empty", visual: "a midnight palace terrace, one teacup, the moonlit noble Duskwyn" },
      { title: "Second", visual: "Duskwyn setting a second cup, eclipse halo gentle" },
      { title: "Wait", visual: "two cups steaming, garden of silver roses, no faces" },
      { title: "Sip", visual: "one cup lowering as if someone arrived, Duskwyn not looking directly" },
      { title: "Dawn", visual: "first light, both cups empty, a courtesy note under a saucer" },
    ],
  },
  45: {
    id: 45,
    title: "Wait for the Current",
    logline:
      "A school of fish panics. Brinecrown stills the water until everyone can swim together.",
    beats: [
      { title: "Panic", visual: "a swirl of tiny silver fish in a glassreef hall, the merfolk monarch Brinecrown" },
      { title: "Hand", visual: "Brinecrown's coral-crowned hand stilling the current, bioluminescence" },
      { title: "Line", visual: "the fish lining up in a calm lane of light" },
      { title: "Together", visual: "they swimming as one ribbon through kelp windows" },
      { title: "Gate", visual: "the palace gate open, the water peaceful, crown gleaming" },
    ],
  },
  46: {
    id: 46,
    title: "The Unfinished Oath",
    logline:
      "A promise was almost dropped. Palevow pins it in sunlight until it hardens.",
    beats: [
      { title: "Slip", visual: "a crumpled promise note sliding off a pew, the bone paladin Palevow catching it" },
      { title: "Pin", visual: "Palevow pinning the note to ivory-gold armor over the heart" },
      { title: "Sun", visual: "stained-glass sun hitting the note until the letters glow" },
      { title: "Keep", visual: "the note becoming part of the armor, a small gold ribbon" },
      { title: "Leave", visual: "the pew empty, a new ribbon left for the next promise" },
    ],
  },
  47: {
    id: 47,
    title: "Water It Tomorrow",
    logline:
      "A scraped plant, a scraped day. Viridelle waters both and does not rush the leaf.",
    beats: [
      { title: "Scrape", visual: "a bent seedling on a classroom windowsill, the dryad Viridelle kneeling" },
      { title: "Water", visual: "Viridelle watering with a leaf-cup, bark hands gentle" },
      { title: "Wait", visual: "night in the world-tree nave, the seedling sleeping" },
      { title: "Leaf", visual: "morning, a new uncurling leaf, no miracle speech, just green" },
      { title: "Go", visual: "Viridelle already gone, a tiny moss heart on the pot" },
    ],
  },
  48: {
    id: 48,
    title: "Turn the Problem",
    logline:
      "The homework looks impossible. Quartzarch rotates it until a facet catches the answer.",
    beats: [
      { title: "Stuck", visual: "a hovering impossible geometry puzzle, the crystal mage Quartzarch studying it" },
      { title: "Turn", visual: "Quartzarch rotating the puzzle, light hitting a new face" },
      { title: "Catch", visual: "the answer appearing as a beam of color through the prism hall" },
      { title: "Write", visual: "the beam writing the solution gently onto paper, no people" },
      { title: "Chime", visual: "the infinite prism chiming, puzzle now a small jewel on the desk" },
    ],
  },
  49: {
    id: 49,
    title: "The Sentence You Meant",
    logline:
      "A brave sentence dies in a throat. Inkstride writes it on rain and leaves it on the desk.",
    beats: [
      { title: "Rain", visual: "a rooftop in rain, unsaid words hanging as grey mist, the ink dancer Inkstride" },
      { title: "Write", visual: "Inkstride writing in the air, calligraphy becoming a living ribbon" },
      { title: "Carry", visual: "the ribbon flying down through a window onto an empty desk" },
      { title: "Dry", visual: "the sentence drying into ordinary kind handwriting" },
      { title: "Gone", visual: "Inkstride already a streak of ink on the wet roof" },
    ],
  },
  50: {
    id: 50,
    title: "Stand in Front",
    logline:
      "A storm hits the city. Aegisunit does not punch it. It just becomes a wall.",
    beats: [
      { title: "Storm", visual: "a night city, hard wind, the walking mech Aegisunit on a rooftop" },
      { title: "Step", visual: "Aegisunit stepping between the wind and a row of windows, visor kind" },
      { title: "Dome", visual: "a gentle energy dome blooming, rain sliding off" },
      { title: "Hold", visual: "Aegisunit standing still for a long time, city lights safe" },
      { title: "Morning", visual: "dawn, the mech sitting like a bench, kids-sized scuff on one plate" },
    ],
  },
  51: {
    id: 51,
    title: "The Smallest Quest",
    logline:
      "Someone holds a door. Gleamward knights them at sunrise anyway.",
    beats: [
      { title: "Door", visual: "a school door held open, empty hallway, the fairy knight Gleamward watching" },
      { title: "Bow", visual: "Gleamward bowing as if to a great hero, stained-glass wings folded" },
      { title: "Tap", visual: "a wooden practice sword tapping a shoulder of light, no person shown" },
      { title: "Rise", visual: "sunrise exploding through the cathedral courtyard, wings wide" },
      { title: "Pin", visual: "a tiny stained-glass pin left on the door handle" },
    ],
  },
  52: {
    id: 52,
    title: "Temper, Then Build",
    logline:
      "Anger arrives as lava. Magmaheart cools a path through it so a house can stand.",
    beats: [
      { title: "Heat", visual: "a river of lava at the edge of a caldera city, the lava elemental Magmaheart" },
      { title: "Breath", visual: "Magmaheart breathing cool obsidian over the river, cooling a road" },
      { title: "Path", visual: "a black-glass path hardening, gold cracks like kintsugi" },
      { title: "House", visual: "a small house-shape of stone placed on the new path" },
      { title: "Crown", visual: "night, Magmaheart on the rim, city lights, not a shout in sight" },
    ],
  },
  53: {
    id: 53,
    title: "See the Pattern",
    logline:
      "Chaos on the desk. Rimeveil freezes it into snowflakes long enough to sort.",
    beats: [
      { title: "Mess", visual: "a blizzard of papers above a desk, the ice sorcerer Rimeveil raising a hand" },
      { title: "Frost", visual: "each paper becoming a unique snowflake, hanging still" },
      { title: "Sort", visual: "the snowflakes arranging into neat rows in an aurora palace" },
      { title: "Thaw", visual: "they thaw back into papers, now stacked, a frost bookmark" },
      { title: "Sky", visual: "green-violet aurora over the glacier hall, Rimeveil lowering her hand" },
    ],
  },
  54: {
    id: 54,
    title: "Dawn Repeats",
    logline:
      "Someone thinks they missed it. Solstice lights a practice sun and runs dawn again.",
    beats: [
      { title: "Late", visual: "an empty choir loft, a snuffed lantern, the celestial priest Solstice" },
      { title: "Practice", visual: "Solstice cupping a small practice sun, gold-white robes" },
      { title: "Again", visual: "the loft filling with a second sunrise, stars practicing being on time" },
      { title: "Lantern", visual: "the snuffed lantern catching, warm" },
      { title: "Repeat", visual: "a note on the rail: dawn repeats, you can come in" },
    ],
  },
  55: {
    id: 55,
    title: "It Fits",
    logline:
      "Kindness is tried on like a coat. Hollowplate proves the empty armor was never empty.",
    beats: [
      { title: "Empty", visual: "a sunlit hall, a vacant suit of tin armor on a stand, Hollowplate waiting" },
      { title: "Light", visual: "a warm candle-light kindling inside the visor" },
      { title: "Step", visual: "the armor stepping down, stained-glass catching sun, banners" },
      { title: "Offer", visual: "Hollowplate offering an empty gauntlet as if offering a handshake" },
      { title: "Fit", visual: "the gauntlet glowing, a small plaque: put the kindness on" },
    ],
  },
  56: {
    id: 56,
    title: "The Unfinished Sentence",
    logline:
      "A kind sentence is left half-written. Noxquill gold-bookmarks the draft and waits.",
    beats: [
      { title: "Draft", visual: "a half-written kind sentence on a desk, the ink librarian Noxquill" },
      { title: "File", visual: "Noxquill slipping a gold bookmark into the unfinished page" },
      { title: "Walk", visual: "walking the cathedral of books, ink rivers glowing" },
      { title: "Return", visual: "the same desk, a fresh blank line under the draft" },
      { title: "Keep", visual: "the page glowing, Noxquill nodding, no rush" },
    ],
  },
  57: {
    id: 57,
    title: "Second Look",
    logline:
      "Someone won't try again. Mirrorkin shows the rehearsal already waiting in the glass.",
    beats: [
      { title: "Turn", visual: "a person-shaped absence facing away from a hall of mirrors, Mirrorkin" },
      { title: "Show", visual: "Mirrorkin's silver mask reflecting a braver second try" },
      { title: "Step", visual: "a foot stepping toward the glass, palace of mirrors" },
      { title: "Match", visual: "the reflection smiling first, then the real side catching up" },
      { title: "Leave", visual: "one mirror left slightly open like a door" },
    ],
  },
  58: {
    id: 58,
    title: "One Careful Line",
    logline:
      "A crumpled paper. Parchblade unfolds it into a crane, then a castle.",
    beats: [
      { title: "Crumple", visual: "a crumpled sheet on a floor, the origami samurai Parchblade kneeling" },
      { title: "Line", visual: "one perfect crease, gold light along the fold" },
      { title: "Crane", visual: "the paper becoming a crane that bows" },
      { title: "Court", visual: "the crane unfolding into a paper castle gate" },
      { title: "Bow", visual: "Parchblade bowing to the effort, castle behind" },
    ],
  },
  59: {
    id: 59,
    title: "The 404 Door",
    logline:
      "An error message blocks the path. Nullbyte turns it into a door that still opens.",
    beats: [
      { title: "Error", visual: "a giant 404 window blocking a neon alley, the glitch kid Nullbyte" },
      { title: "Tap", visual: "Nullbyte tapping the error until it becomes a doorframe of rainbow pixels" },
      { title: "Walk", visual: "walking through the glitch garden, broken UI blooming like flowers" },
      { title: "Sign", visual: "a small sign: try the next frame" },
      { title: "City", visual: "the error-city lighting up, Nullbyte waving from a rooftop" },
    ],
  },
  60: {
    id: 60,
    title: "The Spare Button",
    logline:
      "A coat with a hole. Moonstitch sews a star in, not a scold.",
    beats: [
      { title: "Hole", visual: "a child's coat with a missing button, the patchwork doll Moonstitch" },
      { title: "Tin", visual: "Moonstitch opening a tin of spare star-buttons in an attic" },
      { title: "Sew", visual: "sewing a tiny glowing star where the button was" },
      { title: "Wear", visual: "the coat hanging mended, quilt-constellations on the wall" },
      { title: "Night", visual: "the attic window, stars matching the new button" },
    ],
  },
  61: {
    id: 61,
    title: "Let It Through",
    logline:
      "A cracked pane. Glassheart leads the crack into a rose window.",
    beats: [
      { title: "Crack", visual: "a cracked chapel pane, the stained-glass person Glassheart" },
      { title: "Lead", visual: "dark lead lines catching the crack, turning it into a drawing" },
      { title: "Sun", visual: "sunset exploding through the new rose window" },
      { title: "Color", visual: "colored light on the chapel floor like a map" },
      { title: "Open", visual: "the chapel door open, Glassheart in the light" },
    ],
  },
  62: {
    id: 62,
    title: "The Honest Mark",
    logline:
      "A promise is practiced until it stays. Runebound's tattoo lights only then.",
    beats: [
      { title: "Palm", visual: "one faint rune on a palm, the monk Runebound in a courtyard" },
      { title: "Practice", visual: "the same motion repeated, ink brightening a little each time" },
      { title: "Climb", visual: "runes climbing the arms as light, mountain temple" },
      { title: "Hold", visual: "the mark staying, no show-off, just kept" },
      { title: "Dawn", visual: "sunrise on the temple, Runebound bowing to the work" },
    ],
  },
  63: {
    id: 63,
    title: "A Light On",
    logline:
      "A small signal from the ground. Orbitron leaves a night-light in orbit.",
    beats: [
      { title: "Ping", visual: "a tiny radio ping from a dark planet, the satellite robot Orbitron" },
      { title: "Hear", visual: "Orbitron's dish-head turning, solar panels catching dawn" },
      { title: "Leave", visual: "placing a small orbital lantern above the signal" },
      { title: "Earth", visual: "Earth-rise, the lantern like a new star" },
      { title: "Reply", visual: "a soft radio: your signal arrived" },
    ],
  },
  64: {
    id: 64,
    title: "A Place Set",
    logline:
      "Someone thinks they weren't invited. Mycelarch's city already set a plate.",
    beats: [
      { title: "Edge", visual: "the edge of a glowing mushroom city, the fungal monarch Mycelarch" },
      { title: "Root", visual: "mycelium lights running under the soil toward an empty chair" },
      { title: "Plate", visual: "a place-setting of moss and light appearing" },
      { title: "Sit", visual: "the chair filled with warmth, no face shown" },
      { title: "City", visual: "the underground towers glowing, Mycelarch nodding" },
    ],
  },
  65: {
    id: 65,
    title: "One Polyp",
    logline:
      "A broken seawall. Coralith adds one piece. Tomorrow it's a reef.",
    beats: [
      { title: "Gap", visual: "a gap in a coral seawall at dawn, the coral statue Coralith" },
      { title: "Add", visual: "Coralith placing one living polyp, careful" },
      { title: "Grow", visual: "time-lapse of a small arch growing, tide gentle" },
      { title: "Walk", visual: "the reef becoming a walkable palace path" },
      { title: "Gate", visual: "dawn ocean, the path open, Coralith at the gate" },
    ],
  },
  66: {
    id: 66,
    title: "Both Hands",
    logline:
      "A cup too full. Cupwright teaches the quest: hold it with both hands.",
    beats: [
      { title: "Full", visual: "a teacup filled to the brim, the porcelain knight Cupwright" },
      { title: "Hands", visual: "Cupwright showing two gauntlets around the cup" },
      { title: "Carry", visual: "walking a porcelain keep hallway without spilling" },
      { title: "Set", visual: "the cup set down, steam like a small victory flag" },
      { title: "Keep", visual: "tea-cloud castle behind, Cupwright saluting with the cup-helm" },
    ],
  },
  67: {
    id: 67,
    title: "The Missing Star",
    logline:
      "A hole in the night map. Starloom weaves the late star back in.",
    beats: [
      { title: "Hole", visual: "a dark gap in a tapestry of stars, the weaver Starloom" },
      { title: "Thread", visual: "pulling a gold star-thread from a pocket" },
      { title: "Loom", visual: "the night-sky loom catching the thread" },
      { title: "Place", visual: "the missing star clicking into the pattern" },
      { title: "Sky", visual: "the complete map, balcony, Starloom smiling" },
    ],
  },
  68: {
    id: 68,
    title: "With You, Not At You",
    logline:
      "A mean joke in the alley. Jesterion swaps it for a trick that includes everyone.",
    beats: [
      { title: "Alley", visual: "a neon alley, a mean joke hanging like ugly graffiti, Jesterion" },
      { title: "Swap", visual: "Jesterion peeling the graffiti into confetti" },
      { title: "Trick", visual: "a kind carnival trick: hats appearing on every lamp" },
      { title: "Laugh", visual: "neon signs laughing with, not at, the street" },
      { title: "Door", visual: "the Kind Carnival gate open, bells, Jesterion bowing" },
    ],
  },
  69: {
    id: 69,
    title: "Leftover Into Tool",
    logline:
      "Scrap feelings on the floor. Bloomforge hammers them into a useful cup.",
    beats: [
      { title: "Scrap", visual: "bent leftover metal and wilted petals, the flower blacksmith Bloomforge" },
      { title: "Heat", visual: "the petal-forge glowing, daisy-hammer raised" },
      { title: "Shape", visual: "sparks of blossoms, a cup forming" },
      { title: "Cool", visual: "the cup set in water, steam like flowers" },
      { title: "Give", visual: "the cup on a windowsill, foundry garden behind" },
    ],
  },
  70: {
    id: 70,
    title: "Your Note Belongs",
    logline:
      "A shy note at the edge of the choir. Pyrechoir holds the harmony until it joins.",
    beats: [
      { title: "Edge", visual: "an empty seat at a volcano amphitheater, the flame singer Pyrechoir" },
      { title: "Hold", visual: "Pyrechoir holding a warm harmony note like a lantern" },
      { title: "Join", visual: "a second smaller flame appearing in the empty seat" },
      { title: "Choir", visual: "the stands lighting as a choir of fire-lights" },
      { title: "Bow", visual: "the stage, two flames bowing, no shout" },
    ],
  },
  71: {
    id: 71,
    title: "A Roof in the Weather",
    logline:
      "Rain with nowhere kind to land. Cloudmason drafts a roof, then a playground.",
    beats: [
      { title: "Rain", visual: "hard rain, no shelter, the sky-architect Cloudmason with blueprints" },
      { title: "Draft", visual: "drawing a roof in the clouds, scaffolding of light" },
      { title: "Build", visual: "a weather-palace roof locking into place" },
      { title: "Play", visual: "the rain now a curtain around a dry courtyard" },
      { title: "City", visual: "Weatherworks gleaming, Cloudmason tucking the blueprint away" },
    ],
  },
  72: {
    id: 72,
    title: "Course Is Home",
    logline:
      "A lost compass. Saltwake trades a story for a heading, not plunder.",
    beats: [
      { title: "Lost", visual: "a spinning compass on a salt-crusted deck, captain Saltwake" },
      { title: "Story", visual: "Saltwake telling a story to the compass, brine-laugh" },
      { title: "Point", visual: "the needle settling toward a warm harbor light" },
      { title: "Sail", visual: "the crystal galleon turning, salt-diamond spray" },
      { title: "Harbor", visual: "home lights, Saltwake hanging the spyglass up" },
    ],
  },
  73: {
    id: 73,
    title: "Share the Shield",
    logline:
      "A cookie too big for one knight. Sugarguard breaks it into a round table.",
    beats: [
      { title: "Big", visual: "a giant cookie-shield, the gingerbread paladin Sugarguard" },
      { title: "Break", visual: "breaking the cookie into even pieces, icing dust like snow" },
      { title: "Table", visual: "the pieces becoming seats around a candy table" },
      { title: "Knight", visual: "tiny icing medals appearing at each seat" },
      { title: "Rise", visual: "Icing Cathedral behind, Sugarguard saluting with a crumb" },
    ],
  },
  74: {
    id: 74,
    title: "One Measure",
    logline:
      "A missed step. Circuitwaltz holds the beat so the dancer can enter late.",
    beats: [
      { title: "Miss", visual: "an empty spotlight, the robot ballerina Circuitwaltz pausing" },
      { title: "Wait", visual: "the metronome heart holding one extra measure, theater dark" },
      { title: "Step", visual: "a second pair of lights stepping in, not late anymore" },
      { title: "Waltz", visual: "clockwork tutu nebula, opera house of light" },
      { title: "Bow", visual: "the stage, Circuitwaltz offering a chrome hand" },
    ],
  },
  75: {
    id: 75,
    title: "The Stars Can Watch",
    logline:
      "Someone won't rest. Dreamward takes the night shift so tomorrow can load.",
    beats: [
      { title: "Awake", visual: "a lamp still on in a moon-river hall, the sleep guardian Dreamward" },
      { title: "Mobile", visual: "Dreamward hanging a star-mobile over the lamp" },
      { title: "Dim", visual: "the lamp dimming kindly, stars taking over" },
      { title: "Watch", visual: "Dreamward sitting night-watch, palace of sleeping stars" },
      { title: "Morning", visual: "dawn, the lamp still there, a note: rest is not quitting" },
    ],
  },
};

export function getUltraAdventure(id: number): UltraAdventure | null {
  return ULTRA_ADVENTURES[id] ?? null;
}
