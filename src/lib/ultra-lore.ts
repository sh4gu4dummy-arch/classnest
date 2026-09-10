/** Home, voice, and story for each Ultra legend. Videos live at /avatars/ultra/intros/{id}.mp4 */

export type UltraLore = {
  id: number;
  home: string;
  setting: string;
  voice: string;
  story: string;
  greeting: string;
};

export const ULTRA_INTRO_SRC = (id: number) =>
  `/avatars/ultra/intros/${String(id).padStart(2, "0")}.mp4`;

export const ULTRA_INTRO_READY = new Set<number>(
  Array.from({ length: 75 }, (_, i) => i + 1),
);

export const ULTRA_LORE: Record<number, UltraLore> = {
  1: {
    id: 1,
    home: "The Glass Spire",
    setting: "A crystal peak that drinks lightning",
    voice: "Clear, bright, a little proud — like a bell after thunder",
    story:
      "Aetherflame was born the night two storms shook hands. The pack still tells kids: if you tell the truth when it is hard, the wolf’s mane lights the way home.",
    greeting: "I am Aetherflame. Speak true, and the mountain answers.",
  },
  2: {
    id: 2,
    home: "The Quiet Between",
    setting: "A purple void-garden where shadows grow like flowers",
    voice: "Low, velvet, never rushed",
    story:
      "Voidfang watches the spaces other hunters skip. Students who work unseen — the ones who tidy, wait, and listen — are the ones he pads beside.",
    greeting: "I am Voidfang. The quiet work is still work.",
  },
  3: {
    id: 3,
    home: "Ember Hollow",
    setting: "A warm den under a sleeping volcano",
    voice: "Playful crackle, like a campfire telling jokes",
    story:
      "Emberpuff keeps a kiln of leftover courage. One spark at a time, kitsune-tails appear when someone tries again after a flop.",
    greeting: "I’m Emberpuff. Mess up? Good. That’s how tails grow.",
  },
  4: {
    id: 4,
    home: "The Star Chart Attic",
    setting: "A floating observatory of dust and constellations",
    voice: "Curious, hushed, slightly echoey",
    story:
      "Nebulynx maps kindness the way others map stars. Every helpful act is a new pin on the night.",
    greeting: "I am Nebulynx. Show me a kind act — I’ll put it on the sky.",
  },
  5: {
    id: 5,
    home: "Thunderkeep",
    setting: "A cliff-castle inside a living storm",
    voice: "Big, warm rumble — never mean",
    story:
      "Stormwyrm is the class’s weather. When the room gets too loud, he teaches that real power is choosing when to thunder.",
    greeting: "I am Stormwyrm. Strength is knowing when to be still.",
  },
  6: {
    id: 6,
    home: "The Vine Court",
    setting: "A living greenhouse that grows overnight",
    voice: "Soft, leafy, encouraging",
    story:
      "Bloomkin plants a seed for every student who helps something grow — a plant, a skill, or a friend.",
    greeting: "I’m Bloomkin. What did you help grow today?",
  },
  7: {
    id: 7,
    home: "Tick-Tock Foundry",
    setting: "A brass clock-city under the floorboards of time",
    voice: "Precise, kindly, click-click consonants",
    story:
      "Chronomech repairs broken minutes. Late work, second chances, “I’ll try again” — those are the gears he loves.",
    greeting: "Chronomech here. On time is good. Trying again is better.",
  },
  8: {
    id: 8,
    home: "Aurora Den",
    setting: "A glacier cave painted with northern lights",
    voice: "Cool, calm, never icy toward people",
    story:
      "Frosthowl leads by example: keep your head when the wind howls. The pack stays warm if one wolf stays steady.",
    greeting: "I am Frosthowl. Stay steady. The pack will find you.",
  },
  9: {
    id: 9,
    home: "Lantern Grove",
    setting: "A night forest where moth-dust is moonlight",
    voice: "Airy, musical, almost a whisper-song",
    story:
      "Luminara lights the path for kids who feel small. She says the smallest wings still move the dark.",
    greeting: "I am Luminara. Even a small light is a light.",
  },
  10: {
    id: 10,
    home: "Forge Hangar 7",
    setting: "A neon raptor bay of sparks and steel",
    voice: "Crisp, athletic, coach-energy",
    story:
      "Ironclaw trains effort, not luck. The claws only unlock after reps — homework, practice, one more try.",
    greeting: "Ironclaw. Armor is earned. Show me the work.",
  },
  11: {
    id: 11,
    home: "The Quiet Desk",
    setting: "A sunlit scriptorium of ink, paper, and tea",
    voice: "Gentle, bookish, a little ink-smudged",
    story:
      "Quillburst writes down brave sentences. A kind note, a careful paragraph, a name spelled right — those are his treasures.",
    greeting: "I’m Quillburst. Write something kind. I’ll keep the ink.",
  },
  12: {
    id: 12,
    home: "The Drift Lantern",
    setting: "A bioluminescent tide-pool that never quite touches land",
    voice: "Slow, watery, dreamy",
    story:
      "Tidalkin teaches the class to float through hard days. Not every problem is a fight. Some you drift around.",
    greeting: "I am Tidalkin. Breathe. The tide will turn.",
  },
  13: {
    id: 13,
    home: "Grid 9",
    setting: "A neon alley inside a friendly computer",
    voice: "Quick, witty, a little glitchy on purpose",
    story:
      "Hexabyte debugs bad days. When a plan crashes, they help kids find the line that actually broke.",
    greeting: "Hexabyte. Error found. Let’s patch it together.",
  },
  14: {
    id: 14,
    home: "Moonruin Roost",
    setting: "A silver ruin where night birds keep watch",
    voice: "Soft rasp, not scary — like a kind librarian of night",
    story:
      "Bonehollow remembers what others forget: the quiet kid, the leftover lunch, the apology that still needs saying.",
    greeting: "I am Bonehollow. I remember. You are not forgotten.",
  },
  15: {
    id: 15,
    home: "Heartwood Hall",
    setting: "An ancient grove that is also a house",
    voice: "Deep, patient, like old wood",
    story:
      "Sapwood grows rings for years of showing up. Attendance, practice, coming back after a miss — those are his rings.",
    greeting: "I am Sapwood. Come back tomorrow. That’s how forests win.",
  },
  16: {
    id: 16,
    home: "Prism Cathedral",
    setting: "A cavern of rainbow crystal organs",
    voice: "Bright, bouncing, a little shy",
    story:
      "Prismite splits one idea into many colors. Same math problem, new way. Same friend, new kindness.",
    greeting: "I’m Prismite. One idea. Lots of colors. Try another angle.",
  },
  17: {
    id: 17,
    home: "The Scrap Yard Chapel",
    setting: "A cheerful junk heap that hums when it is happy",
    voice: "Gruff-cute, grease-on-the-vowels",
    story:
      "Junkbyte builds treasures from leftovers. Recycle, reuse, fix it instead of tossing it — including a bad first draft.",
    greeting: "Junkbyte. Broken isn’t trash. Hand it over — we’ll rebuild.",
  },
  18: {
    id: 18,
    home: "The Party Pocket",
    setting: "A pocket-universe of streamers and cake crumbs",
    voice: "Giggle-bright, confetti between words",
    story:
      "Mirthling celebrates effort, not just wins. Finished the hard page? That’s a party. Helped a table? That’s a parade.",
    greeting: "Hi! I’m Mirthling. You tried? That’s already a party.",
  },
  19: {
    id: 19,
    home: "The Lantern Trench",
    setting: "A deep, glowing sea-canyon",
    voice: "Slow boom, surprisingly funny",
    story:
      "Abyssrake lives where the light is homemade. Kids who work in the deep — the long projects — get a lantern from him.",
    greeting: "I am Abyssrake. Go deep. I’ll keep a light on.",
  },
  20: {
    id: 20,
    home: "The Dawn Ziggurat",
    setting: "A sun temple that wakes before the class does",
    voice: "Warm, formal, like a kind principal of the sun",
    story:
      "Solarox starts the day. Morning jobs, clean slates, first-period courage — those are sacred to the scarab.",
    greeting: "I am Solarox. New day. New light. Begin.",
  },
  21: {
    id: 21,
    home: "The Window Seat",
    setting: "A rainy apartment ledge with a soft blanket",
    voice: "Very quiet, almost a purr",
    story:
      "Quietpaw is for kids who do not want a dragon. Sit. Watch the rain. Points still count.",
    greeting: "I’m Quietpaw. You can be still and still be brave.",
  },
  22: {
    id: 22,
    home: "Hearth Lodge",
    setting: "A honey-colored cabin with a forever fireplace",
    voice: "Friendly dog-energy, slightly breathless",
    story:
      "Hearthound believes every class needs a welcome. New kid? Bad day? Sit by the fire. You’re in.",
    greeting: "Hearthound! You’re in. Shoes off. You’re safe here.",
  },
  23: {
    id: 23,
    home: "The Mist Path",
    setting: "A foggy meadow at the edge of the woods",
    voice: "Soft, careful, almost a whisper",
    story:
      "Mistfawn walks the long way around. No rush. No showing off. Just the path, one step, then another.",
    greeting: "I am Mistfawn. We can go slow. We still arrive.",
  },
  24: {
    id: 24,
    home: "Mossdock",
    setting: "A pond stone covered in a hundred years of moss",
    voice: "Unhurried, dry humor",
    story:
      "Mossback has seen every rush. He still gets there. Homework done steadily beats homework done in a panic.",
    greeting: "Mossback. Slow is a speed. I’ll wait.",
  },
  25: {
    id: 25,
    home: "The White Eave",
    setting: "A quiet rooftop at first light",
    voice: "Soft coo, peaceful",
    story:
      "Softwing carries messages of “we’re okay.” When the room needs calm more than sparkle, the dove lands.",
    greeting: "I’m Softwing. It’s all right. We can start gentle.",
  },
  26: {
    id: 26,
    home: "Willowmill Race",
    setting: "An old mill wheel on a moonlit river",
    voice: "Warm, splashy, a curious river-kid — not deep, not cutesy",
    story:
      "Puddlefin lives under the mill. Every kind deed becomes a smooth pebble in the satchel. At twenty pebbles the wheel turns brighter, and the otter grows into the river’s small king.",
    greeting:
      "I’m Puddlefin. I live under the mill wheel. Bring a kind deed — I’ll keep the pebble.",
  },
  27: {
    id: 27,
    home: "Red Mesa Watch",
    setting: "A wind-cut cliff at last light",
    voice: "Dry, steady, desert-quiet",
    story:
      "Ashenhoof stands where the wind is honest. Kids who keep going when no one is watching earn a place on the ridge.",
    greeting: "I am Ashenhoof. The climb is the point. Come up.",
  },
  28: {
    id: 28,
    home: "The Atrium Stacks",
    setting: "A night library where books float like lanterns",
    voice: "Paper-soft, precise, never cruel",
    story:
      "Paperwing was a leftover fold that learned to fly. Stories, drafts, and second pages are sacred here.",
    greeting: "I am Paperwing. Fold carefully. Then fly.",
  },
  29: {
    id: 29,
    home: "Cloud Shrine Pond",
    setting: "A floating torii reflected in star-water",
    voice: "Smooth, flowing, a little formal",
    story:
      "Voltkoi began as a speckled fry and learned the sky-river by swimming one honest circle at a time.",
    greeting: "I am Voltkoi. One true circle. Then the sky.",
  },
  30: {
    id: 30,
    home: "Cap City",
    setting: "A glowing toadstool town at twilight",
    voice: "Squeaky-wise, unexpectedly deep punchlines",
    story:
      "Glimmercap’s hat is a house for tiny ideas. Share one, and a lantern-mushroom lights on the log.",
    greeting: "Glimmercap here. Got a tiny idea? That’s how forests start.",
  },
  31: {
    id: 31,
    home: "The Night Battlement",
    setting: "A quiet castle wall under a full moon",
    voice: "Formal, kind, slightly hooted",
    story:
      "Rookplate was an owlet in a borrowed collar. The armor only fit after the owl learned to watch for others, not just for glory.",
    greeting: "I am Rookplate. I keep the watch. You can rest.",
  },
  32: {
    id: 32,
    home: "Star Dune Cut",
    setting: "A wind-carved canyon with a river of stars",
    voice: "Light, quick, wind-in-the-ears",
    story:
      "Sandwisp runs the dusk route. Fast thinkers, big listeners — the huge ears catch what the class almost missed.",
    greeting: "Sandwisp. I heard that. It mattered.",
  },
  33: {
    id: 33,
    home: "Neon Night Market",
    setting: "Rooftop stalls, lanterns, honest junk",
    voice: "Street-smart, friendly, a wink in it",
    story:
      "Scrapcoon started with a bottle-cap helm. The market taught: trade fair, fix first, brag later.",
    greeting: "Scrapcoon. Fair trade only. What’d you fix today?",
  },
  34: {
    id: 34,
    home: "Lantern Study",
    setting: "A rainy window, tea, shelves of scrolls",
    voice: "Sleepy-warm, unhurried, very kind",
    story:
      "Kindlekin keeps the kettle on for anyone who needs a page and a pause. No villains. Just tea and another try.",
    greeting: "I’m Kindlekin. Sit. Tea first. Then the page.",
  },
  35: {
    id: 35,
    home: "The Silent Observatory",
    setting: "A mountain dome under the Milky Way",
    voice: "Wide, echoing, almost sung",
    story:
      "Riftstallion was a star-specked foal who learned the dark is a road. Look up, then take the next step anyway.",
    greeting: "I am Riftstallion. The dark is a road. Look up.",
  },
  36: {
    id: 36,
    home: "Moonpath Canopy",
    setting: "A living world-tree whose roads are branches",
    voice: "Quiet, precise, like a bowstring let down slowly",
    story:
      "Thornveil maps shortcuts through the woods so no one has to walk home scared. Aim true, then share the path.",
    greeting: "I am Thornveil. Aim true. Then show someone the way.",
  },
  37: {
    id: 37,
    home: "Stormkettle Cottage",
    setting: "A cliff cottage that brews weather in a black kettle",
    voice: "Warm cackle, never mean — like a kettle laughing",
    story:
      "Hexmorrow bottles second chances. Spill the potion? Good. That’s how you learn the recipe.",
    greeting: "Hexmorrow. Spill it? Fine. We’ll brew it better.",
  },
  38: {
    id: 38,
    home: "Bellforge Keep",
    setting: "A volcanic citadel where hammers ring like church bells",
    voice: "Deep, kind, iron on iron",
    story:
      "Ironmaw forges tools, not trophies. The strongest thing in his hall is a repaired hinge.",
    greeting: "Ironmaw. Bring me what’s broken. We’ll make it sing.",
  },
  39: {
    id: 39,
    home: "The Clock Nave",
    setting: "A cathedral whose saints are gears",
    voice: "Gentle tick, brass vowels",
    story:
      "Gildframe keeps oaths the way clocks keep time. Show up, even late — the gears still have a place for you.",
    greeting: "I am Gildframe. You arrived. That is the oath.",
  },
  40: {
    id: 40,
    home: "The Facet Embassy",
    setting: "A glass throne-room orbiting a quiet star",
    voice: "Clear, curious, slightly harmonic",
    story:
      "Vexilith translates feelings the way others translate languages. A hard day still counts as a message.",
    greeting: "I am Vexilith. Tell me the feeling. I will carry it home.",
  },
  41: {
    id: 41,
    home: "Sky-Dock 7",
    setting: "A ramshackle flying garage chained to a thunderhead",
    voice: "Fast, greasy, delighted by sparks",
    story:
      "Sparkgrit builds ugly machines that work. Perfect plans wait. Working plans fly.",
    greeting: "Sparkgrit. Ugly and flying beats pretty and parked.",
  },
  42: {
    id: 42,
    home: "The Carved Mountain",
    setting: "A cliff-city with waterfalls for hallways",
    voice: "Slow granite, patient",
    story:
      "Gravemason remembers every name carved into him. Heavy work is still work. Sit. The stone can wait.",
    greeting: "I am Gravemason. Heavy is allowed. Rest on me.",
  },
  43: {
    id: 43,
    home: "The Thousand-Lamp Bazaar",
    setting: "A desert night market that never fully closes",
    voice: "Silk and smoke, a storyteller’s grin",
    story:
      "Cinderwish grants the small wishes people are too shy to say: one more try, one kinder word, one lantern left on.",
    greeting: "Cinderwish. Whisper the small wish. I’ll keep the lamp lit.",
  },
  44: {
    id: 44,
    home: "Eclipse Terrace",
    setting: "A midnight palace garden under a polite moon",
    voice: "Soft velvet, courtly, a little lonely",
    story:
      "Duskwyn hosts the night shift of courage — the kids who think better after dark. Courtesy is a kind of armor.",
    greeting: "Duskwyn. The night is still a school. Come in.",
  },
  45: {
    id: 45,
    home: "Glassreef Palace",
    setting: "A deep-sea hall of kelp windows and quiet current",
    voice: "Low tide-hum, princely, kind",
    story:
      "Brinecrown rules by listening to the current. The class that waits its turn is already swimming together.",
    greeting: "I am Brinecrown. Wait for the current. We’ll go together.",
  },
  46: {
    id: 46,
    home: "The Sunlit Ossuary",
    setting: "A chapel of ivory and gold where vows are kept, not feared",
    voice: "Soft echo, priestly, warm",
    story:
      "Palevow is a promise wearing armor. Not scary — just unfinished work that refused to quit.",
    greeting: "I am Palevow. A promise is a kind of bone. Keep it.",
  },
  47: {
    id: 47,
    home: "The World-Tree Nave",
    setting: "A greenhouse cathedral grown, not built",
    voice: "Leaf-rustle, healing, unhurried",
    story:
      "Viridelle patches scraped days the way she patches bark. Water it. Tomorrow it will look less like a wound.",
    greeting: "I’m Viridelle. Water it. Tomorrow it grows.",
  },
  48: {
    id: 48,
    home: "The Infinite Prism",
    setting: "A hall of perfect geometry that rearranges when you understand",
    voice: "Crisp, delighted, like glass chiming",
    story:
      "Quartzarch loves a problem that looks impossible until the light hits it right. Turn it. The answer is a facet.",
    greeting: "Quartzarch. Turn the problem. A new face will catch the light.",
  },
  49: {
    id: 49,
    home: "The Ink Roof",
    setting: "A rain-city where writing walks",
    voice: "Quick hush, alley-quiet, precise",
    story:
      "Inkstride writes the sentence you meant to say and leaves it on the desk. Brave words are still words.",
    greeting: "Inkstride. Write the brave sentence. I’ll keep the ink.",
  },
  50: {
    id: 50,
    home: "Dome Watch",
    setting: "A hangar overlooking a city under a kind energy shield",
    voice: "Radio-calm, protective, a little shy",
    story:
      "Aegisunit’s job is not to fight the city. It is to stand between a hard day and the people having it.",
    greeting: "Aegisunit. I can stand in front. You can finish the work.",
  },
  51: {
    id: 51,
    home: "Dawncourt",
    setting: "A sunrise cathedral courtyard of stained-glass wings",
    voice: "Bright metal, hopeful, a little formal",
    story:
      "Gleamward knights anyone who helps. The smallest courtesy is still a quest.",
    greeting: "I am Gleamward. That kindness counts. Rise.",
  },
  52: {
    id: 52,
    home: "Caldera Crown",
    setting: "A night city on the rim of a living volcano",
    voice: "Warm rumble, never a shout",
    story:
      "Magmaheart teaches that heat can cook, not just burn. Temper the feeling. Then it’s useful.",
    greeting: "Magmaheart. Hot is fine. Temper it. Then we build.",
  },
  53: {
    id: 53,
    home: "Aurora Palace",
    setting: "A glacier hall under a green-violet sky",
    voice: "Clear, cold-bright, never cruel",
    story:
      "Rimeveil freezes chaos just long enough for the class to see the pattern. Then she thaws it gently.",
    greeting: "I am Rimeveil. Pause. See the pattern. Then we thaw.",
  },
  54: {
    id: 54,
    home: "The Choir Loft of Dawn",
    setting: "A cosmic loft where stars practice being on time",
    voice: "Sung-spoken, wide, encouraging",
    story:
      "Solstice keeps a lantern for anyone who thinks they arrived too late. Dawn is a skill. It repeats.",
    greeting: "I am Solstice. You are not too late. Dawn repeats.",
  },
  55: {
    id: 55,
    home: "The Empty Seat",
    setting: "A sunlit hall of banners, one suit of armor always waiting",
    voice: "Hollow-kind, like a friend speaking from a helmet",
    story:
      "Hollowplate is armor that learned to be a person by practicing kindness until it stuck. The light inside is the homework.",
    greeting: "Hollowplate. Put the kindness on. It fits.",
  },
  56: {
    id: 56,
    home: "The Quiet Stacks",
    setting: "A cathedral of books where the ink still walks",
    voice: "Soft page-turn, librarian-precise, a little shy",
    story:
      "Noxquill files the sentence you almost said. If it was kind, it gets a gold bookmark. If it was unfinished, it gets another draft.",
    greeting: "I am Noxquill. Finish the kind sentence. I’ll keep the page.",
  },
  57: {
    id: 57,
    home: "The Hall of Second Looks",
    setting: "A palace of standing mirrors that never gossip",
    voice: "Clear glass, doubled, never mean",
    story:
      "Mirrorkin shows you the version of yourself that already tried again. Not a trick — a rehearsal.",
    greeting: "Mirrorkin. Look once more. The better try is already in there.",
  },
  58: {
    id: 58,
    home: "The Folded Court",
    setting: "A castle that unfolds from a single sheet of gold paper",
    voice: "Crisp crease, honorable, brief",
    story:
      "Parchblade bows to effort, not to rank. A folded crane and a folded sword start the same way: one careful line.",
    greeting: "Parchblade. Fold it true. Courage is a crease you can practice.",
  },
  59: {
    id: 59,
    home: "The Error Garden",
    setting: "A city of broken windows that still let the light through",
    voice: "Glitch-bright, funny, never cruel",
    story:
      "Nullbyte collects the mistakes that taught someone. A 404 can still be a door if you keep walking.",
    greeting: "Nullbyte. The glitch is data. Try the next frame.",
  },
  60: {
    id: 60,
    home: "The Attic of Spare Stars",
    setting: "A quilted loft where lost buttons become constellations",
    voice: "Soft stitch, bedtime-kind",
    story:
      "Moonstitch mends the day with whatever is left in the tin. A missing button is not a ruined coat.",
    greeting: "Moonstitch. I’ll sew the hole. You keep the coat on.",
  },
  61: {
    id: 61,
    home: "The Rose Window",
    setting: "A chapel that sings when the sun hits it right",
    voice: "Colored-glass chime, warm",
    story:
      "Glassheart breaks and becomes a better picture. The crack is a new lead line, not an ending.",
    greeting: "I am Glassheart. The light still fits. Let it through.",
  },
  62: {
    id: 62,
    home: "The Ink Temple",
    setting: "A mountain courtyard where vows are written on skin as light",
    voice: "Low drum, patient",
    story:
      "Runebound’s tattoos only stay if the promise is kept. Practice is how ink becomes armor.",
    greeting: "Runebound. Write it on the day. I’ll keep the mark honest.",
  },
  63: {
    id: 63,
    home: "Dawn Station",
    setting: "A kind orbital palace that watches weather and homework alike",
    voice: "Radio-soft, precise, a little lonely",
    story:
      "Orbitron’s job is to keep a night-light on for the whole planet. Small signals still reach.",
    greeting: "Orbitron. Your signal arrived. I left a light on.",
  },
  64: {
    id: 64,
    home: "The Under-Grove",
    setting: "A glowing mushroom city that feeds everyone who sits down",
    voice: "Spore-hush, generous",
    story:
      "Mycelarch shares the network. One kind act feeds a table you cannot see.",
    greeting: "Mycelarch. Sit. The city already set a place.",
  },
  65: {
    id: 65,
    home: "Dawnreef Walk",
    setting: "A palace that grew instead of being built, tide in the halls",
    voice: "Shell-click, slow, princely",
    story:
      "Coralith adds one polyp at a time. Cities and habits are the same: patient architecture.",
    greeting: "Coralith. Add one piece. Tomorrow it’s a reef.",
  },
  66: {
    id: 66,
    home: "The Porcelain Keep",
    setting: "A tea-cloud castle of stacked cups that never chips on purpose",
    voice: "Clink of china, brave, polite",
    story:
      "Cupwright’s armor is breakable on purpose. Care is the real plate.",
    greeting: "Cupwright. Hold it with both hands. That’s the quest.",
  },
  67: {
    id: 67,
    home: "The Night Loom",
    setting: "A balcony where the sky is a tapestry still being finished",
    voice: "Thread-soft, wondering",
    story:
      "Starloom weaves the star you thought you missed back into the map. Late is still a color.",
    greeting: "Starloom. There’s a place in the pattern. I’ll leave the thread.",
  },
  68: {
    id: 68,
    home: "The Kind Carnival",
    setting: "An undercity of neon that jokes without punching down",
    voice: "Bright bells, street-smart, gentle",
    story:
      "Jesterion’s best trick is making a hard day smaller. Laughter that includes you is still magic.",
    greeting: "Jesterion. The joke is with you, not at you. Come in.",
  },
  69: {
    id: 69,
    home: "The Petal Foundry",
    setting: "A garden-forge where hammers bloom instead of sparking mean",
    voice: "Warm anvil, encouraging",
    story:
      "Bloomforge turns leftover feelings into tools. Heat can make a cup, not just a dent.",
    greeting: "Bloomforge. Bring the leftover. We’ll make a tool.",
  },
  70: {
    id: 70,
    home: "The Caldera Choir",
    setting: "A volcano amphitheater that only sings when everyone can hear",
    voice: "Ember-song, never a shout",
    story:
      "Pyrechoir teaches volume with kindness. A solo is still part of the choir.",
    greeting: "Pyrechoir. Your note belongs. I’ll hold the harmony.",
  },
  71: {
    id: 71,
    home: "Weatherworks",
    setting: "A city built of storm-light and careful blueprints",
    voice: "Wind-draft, builder-proud",
    story:
      "Cloudmason drafts the sky so rain has a place to land that isn’t someone’s day.",
    greeting: "Cloudmason. We’ll build a roof in the weather. Then play.",
  },
  72: {
    id: 72,
    home: "The Salt Galleon",
    setting: "A ship of crystallized sea that trades stories, not plunder",
    voice: "Brine-laugh, captain-kind",
    story:
      "Saltwake’s treasure is a map home. Pirates can still keep promises.",
    greeting: "Saltwake. Course is home. Climb aboard.",
  },
  73: {
    id: 73,
    home: "Icing Cathedral",
    setting: "A candy fortress whose stained glass tastes like courage",
    voice: "Sugar-crisp, knightly, giggly",
    story:
      "Sugarguard knights anyone who shares. A cookie is still a shield if you mean it.",
    greeting: "Sugarguard. Break the cookie, not the friend. Rise.",
  },
  74: {
    id: 74,
    home: "The Light Opera",
    setting: "A theater of clockwork light that never drops a dancer",
    voice: "Metronome-soft, graceful",
    story:
      "Circuitwaltz counts the beat so nobody has to be perfect — only present.",
    greeting: "Circuitwaltz. The beat will wait one measure. Step when you’re ready.",
  },
  75: {
    id: 75,
    home: "The Palace of Sleeping Stars",
    setting: "A moon-river hall where rest is treated like homework well done",
    voice: "Lullaby-low, guardian-sure",
    story:
      "Dreamward keeps the night shift of kindness. Rest is not quitting. It is how tomorrow loads.",
    greeting: "Dreamward. The stars can keep watch. You can sleep.",
  },
};

export function getUltraLore(id: number): UltraLore | null {
  return ULTRA_LORE[id] ?? null;
}

export function ultraIntroSrc(id: number): string | null {
  return ULTRA_INTRO_READY.has(id) ? ULTRA_INTRO_SRC(id) : null;
}
