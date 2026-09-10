/**
 * Generate ClassNest kids (21–40) + teens (01–40) avatar portraits via Playwright.
 * Output: public/avatars/kids|teens/NN.jpg — square portraits, no text labels.
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const KIDS_NEW = [
  { id: 21, name: "Space Puppy", colors: ["#818cf8", "#c4b5fd", "#e0e7ff"], kind: "pup", gear: "helmet" },
  { id: 22, name: "Pixel Panda", colors: ["#f472b6", "#1e1b2e", "#fce7f3"], kind: "panda", gear: "pixels" },
  { id: 23, name: "Rainbow Llama", colors: ["#c084fc", "#fbbf24", "#38bdf8"], kind: "llama", gear: "scarf" },
  { id: 24, name: "Shell Ninja", colors: ["#22c55e", "#14532d", "#86efac"], kind: "turtle", gear: "mask" },
  { id: 25, name: "Magic Kitten", colors: ["#f9a8d4", "#c084fc", "#fdf2f8"], kind: "cat", gear: "star" },
  { id: 26, name: "Pirate Parrot", colors: ["#f43f5e", "#fbbf24", "#0ea5e9"], kind: "bird", gear: "hat" },
  { id: 27, name: "Crystal Buddy", colors: ["#67e8f9", "#a5f3fc", "#ecfeff"], kind: "golem", gear: "crystal" },
  { id: 28, name: "Mini Hero", colors: ["#3b82f6", "#ef4444", "#fbbf24"], kind: "hero", gear: "cape" },
  { id: 29, name: "Bubble Narwhal", colors: ["#38bdf8", "#7dd3fc", "#e0f2fe"], kind: "narwhal", gear: "horn" },
  { id: 30, name: "Fairy Flutter", colors: ["#e879f9", "#f0abfc", "#fdf4ff"], kind: "fairy", gear: "wings" },
  { id: 31, name: "Cookie Goblin", colors: ["#d97706", "#fbbf24", "#78350f"], kind: "goblin", gear: "cookie" },
  { id: 32, name: "Skate Hedgehog", colors: ["#f59e0b", "#1e293b", "#fde68a"], kind: "hedgehog", gear: "spikes" },
  { id: 33, name: "Tree Friend", colors: ["#16a34a", "#86efac", "#365314"], kind: "tree", gear: "leaves" },
  { id: 34, name: "Star Axolotl", colors: ["#fb7185", "#fda4af", "#fff1f2"], kind: "axolotl", gear: "stars" },
  { id: 35, name: "Happy Pup", colors: ["#fbbf24", "#fef3c7", "#92400e"], kind: "pup", gear: "none" },
  { id: 36, name: "Wizard Toad", colors: ["#8b5cf6", "#c4b5fd", "#4c1d95"], kind: "toad", gear: "wizard" },
  { id: 37, name: "Neon Jelly", colors: ["#2dd4bf", "#5eead4", "#134e4a"], kind: "jelly", gear: "glow" },
  { id: 38, name: "Cowboy Dino", colors: ["#ea580c", "#fbbf24", "#7c2d12"], kind: "dino", gear: "cowboy" },
  { id: 39, name: "Chef Panda", colors: ["#f8fafc", "#1e293b", "#64748b"], kind: "panda", gear: "chef" },
  { id: 40, name: "Ice Cream Dragon", colors: ["#f472b6", "#67e8f9", "#fef08a"], kind: "dragon", gear: "cone" },
];

const TEENS = [
  { id: 1, name: "Neon Blade", colors: ["#22d3ee", "#0f172a", "#67e8f9"], kind: "fighter", gear: "blade" },
  { id: 2, name: "Shadow Monk", colors: ["#a78bfa", "#1e1b4b", "#c4b5fd"], kind: "fighter", gear: "hood" },
  { id: 3, name: "Cyber Samurai", colors: ["#f43f5e", "#0f172a", "#fb7185"], kind: "fighter", gear: "samurai" },
  { id: 4, name: "Arcane Mage", colors: ["#c084fc", "#2e1065", "#e9d5ff"], kind: "mage", gear: "orb" },
  { id: 5, name: "Plasma Gunner", colors: ["#38bdf8", "#0c4a6e", "#7dd3fc"], kind: "fighter", gear: "visor" },
  { id: 6, name: "Gravity Brawler", colors: ["#f97316", "#1c1917", "#fdba74"], kind: "fighter", gear: "gauntlet" },
  { id: 7, name: "Blade Dancer", colors: ["#e879f9", "#4a044e", "#f0abfc"], kind: "fighter", gear: "dual" },
  { id: 8, name: "Titan Striker", colors: ["#ef4444", "#450a0a", "#fca5a5"], kind: "fighter", gear: "armor" },
  { id: 9, name: "Apex Wolf", colors: ["#94a3b8", "#0f172a", "#e2e8f0"], kind: "wolf", gear: "none" },
  { id: 10, name: "Thunder Eagle", colors: ["#fbbf24", "#1e293b", "#fde68a"], kind: "eagle", gear: "none" },
  { id: 11, name: "Shadow Panther", colors: ["#6366f1", "#0f172a", "#a5b4fc"], kind: "panther", gear: "none" },
  { id: 12, name: "Frost Fox", colors: ["#67e8f9", "#0c4a6e", "#cffafe"], kind: "fox", gear: "ice" },
  { id: 13, name: "Ember Phoenix", colors: ["#f97316", "#7c2d12", "#fdba74"], kind: "phoenix", gear: "fire" },
  { id: 14, name: "Abyss Kraken", colors: ["#0ea5e9", "#082f49", "#38bdf8"], kind: "kraken", gear: "none" },
  { id: 15, name: "Stalker Lynx", colors: ["#a3e635", "#1a2e05", "#d9f99d"], kind: "lynx", gear: "none" },
  { id: 16, name: "Spirit Bear", colors: ["#d97706", "#451a03", "#fcd34d"], kind: "bear", gear: "spirit" },
  { id: 17, name: "Void Walker", colors: ["#8b5cf6", "#0f0a1a", "#c4b5fd"], kind: "humanoid", gear: "void" },
  { id: 18, name: "Mech Pilot", colors: ["#2dd4bf", "#042f2e", "#5eead4"], kind: "humanoid", gear: "mech" },
  { id: 19, name: "Quantum Hacker", colors: ["#22c55e", "#052e16", "#86efac"], kind: "humanoid", gear: "hud" },
  { id: 20, name: "Star Captain", colors: ["#3b82f6", "#0c1a3a", "#93c5fd"], kind: "humanoid", gear: "captain" },
  { id: 21, name: "Android Rebel", colors: ["#94a3b8", "#0f172a", "#cbd5e1"], kind: "android", gear: "circuit" },
  { id: 22, name: "Nebula Scout", colors: ["#c084fc", "#1e1b4b", "#e9d5ff"], kind: "humanoid", gear: "scout" },
  { id: 23, name: "Plasma Tech", colors: ["#06b6d4", "#083344", "#67e8f9"], kind: "humanoid", gear: "goggles" },
  { id: 24, name: "Drone Ace", colors: ["#f43f5e", "#4c0519", "#fda4af"], kind: "humanoid", gear: "headset" },
  { id: 25, name: "Street Racer", colors: ["#ef4444", "#1c1917", "#fca5a5"], kind: "humanoid", gear: "racer" },
  { id: 26, name: "Parkour Runner", colors: ["#22c55e", "#052e16", "#86efac"], kind: "humanoid", gear: "hoodie" },
  { id: 27, name: "Nightwave DJ", colors: ["#e879f9", "#3b0764", "#f0abfc"], kind: "humanoid", gear: "dj" },
  { id: 28, name: "Urban Skater", colors: ["#f59e0b", "#1c1917", "#fcd34d"], kind: "humanoid", gear: "cap" },
  { id: 29, name: "Future Fashion", colors: ["#f472b6", "#500724", "#fbcfe8"], kind: "humanoid", gear: "fashion" },
  { id: 30, name: "Rebel Poet", colors: ["#a78bfa", "#1e1b4b", "#ddd6fe"], kind: "humanoid", gear: "jacket" },
  { id: 31, name: "Ghost Agent", colors: ["#64748b", "#0f172a", "#cbd5e1"], kind: "humanoid", gear: "shades" },
  { id: 32, name: "Stage Idol", colors: ["#fbbf24", "#422006", "#fde68a"], kind: "humanoid", gear: "idol" },
  { id: 33, name: "Crystal Titan", colors: ["#67e8f9", "#083344", "#a5f3fc"], kind: "titan", gear: "crystal" },
  { id: 34, name: "Oni Mask", colors: ["#ef4444", "#450a0a", "#fca5a5"], kind: "oni", gear: "oni" },
  { id: 35, name: "Desert Nomad", colors: ["#d97706", "#451a03", "#fcd34d"], kind: "humanoid", gear: "scarf" },
  { id: 36, name: "Bio Hybrid", colors: ["#84cc16", "#1a2e05", "#d9f99d"], kind: "hybrid", gear: "bio" },
  { id: 37, name: "Time Runner", colors: ["#38bdf8", "#0c4a6e", "#7dd3fc"], kind: "humanoid", gear: "chrono" },
  { id: 38, name: "Glitch Phantom", colors: ["#a855f7", "#2e1065", "#d8b4fe"], kind: "phantom", gear: "glitch" },
  { id: 39, name: "Dragon Rider", colors: ["#f97316", "#7c2d12", "#fdba74"], kind: "rider", gear: "scale" },
  { id: 40, name: "Cosmic Guard", colors: ["#2dd4bf", "#042f2e", "#99f6e4"], kind: "guard", gear: "aura" },
];

function pad(n) {
  return String(n).padStart(2, "0");
}

function htmlFor(char, mode) {
  const [c0, c1, c2] = char.colors;
  const cute = mode === "kids";
  const bg0 = cute ? "#fff8f0" : "#0a0e1a";
  const bg1 = cute ? c2 : c1;
  const face = cute ? c2 : "#d4a574";
  const ink = cute ? "#2a2040" : "#0b1020";
  const eyeGlow = c0;

  // Kind-specific geometry hints
  const animalEars = ["pup", "cat", "panda", "fox", "wolf", "lynx", "panther", "bear", "hedgehog", "llama"].includes(char.kind);
  const birdLike = ["bird", "eagle", "phoenix"].includes(char.kind);
  const scaled = ["dragon", "dino", "turtle", "kraken", "narwhal", "jelly", "axolotl", "toad"].includes(char.kind);

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"/>
<style>
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:512px;height:512px;overflow:hidden;background:${bg0}}
.stage{
  width:512px;height:512px;position:relative;
  background:
    radial-gradient(circle at 28% 22%, ${c0}55 0%, transparent 42%),
    radial-gradient(circle at 78% 70%, ${c2}44 0%, transparent 48%),
    radial-gradient(circle at 50% 100%, ${c1}33 0%, transparent 40%),
    linear-gradient(160deg, ${bg0} 0%, ${bg1} 100%);
}
.glow{
  position:absolute;inset:8%;border-radius:40%;
  background:radial-gradient(circle at 50% 45%, ${c0}33, transparent 70%);
  filter:blur(8px);
}
.char{position:absolute;inset:0;display:flex;align-items:center;justify-content:center}
svg{width:460px;height:460px;filter:drop-shadow(0 18px 32px rgba(0,0,0,${cute ? 0.18 : 0.45}))}
</style></head>
<body>
<div class="stage">
  <div class="glow"></div>
  <div class="char">
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fur" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${cute ? c2 : c0}"/>
          <stop offset="100%" stop-color="${c0}"/>
        </linearGradient>
        <linearGradient id="hair" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${c0}"/>
          <stop offset="100%" stop-color="${c1}"/>
        </linearGradient>
        <radialGradient id="cheek" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#ff6b9d" stop-opacity="${cute ? 0.55 : 0.25}"/>
          <stop offset="100%" stop-color="#ff6b9d" stop-opacity="0"/>
        </radialGradient>
        <filter id="soft"><feGaussianBlur stdDeviation="0.6"/></filter>
      </defs>

      <!-- body / shoulders -->
      <ellipse cx="100" cy="188" rx="72" ry="36" fill="url(#fur)"/>
      <ellipse cx="100" cy="182" rx="48" ry="22" fill="${c1}" opacity="0.45"/>
      ${char.gear === "cape" || char.gear === "aura" ? `<path d="M50 150 Q30 200 70 198 Q100 175 130 198 Q170 200 150 150" fill="${c1}" opacity="0.85"/>` : ""}
      ${char.gear === "wings" || birdLike ? `
        <ellipse cx="40" cy="120" rx="28" ry="48" fill="${c2}" opacity="0.75" transform="rotate(-28 40 120)"/>
        <ellipse cx="160" cy="120" rx="28" ry="48" fill="${c2}" opacity="0.75" transform="rotate(28 160 120)"/>
        <ellipse cx="40" cy="120" rx="16" ry="34" fill="${c0}" opacity="0.5" transform="rotate(-28 40 120)"/>
        <ellipse cx="160" cy="120" rx="16" ry="34" fill="${c0}" opacity="0.5" transform="rotate(28 160 120)"/>
      ` : ""}

      <!-- ears -->
      ${animalEars ? `
        <g>
          <ellipse cx="52" cy="58" rx="22" ry="30" fill="url(#fur)" transform="rotate(-18 52 58)"/>
          <ellipse cx="148" cy="58" rx="22" ry="30" fill="url(#fur)" transform="rotate(18 148 58)"/>
          <ellipse cx="54" cy="62" rx="10" ry="16" fill="${c2}" opacity="0.75" transform="rotate(-18 54 62)"/>
          <ellipse cx="146" cy="62" rx="10" ry="16" fill="${c2}" opacity="0.75" transform="rotate(18 146 62)"/>
        </g>
      ` : ""}
      ${char.kind === "dragon" || char.kind === "dino" ? `
        <polygon points="48,70 28,28 62,58" fill="${c0}"/>
        <polygon points="152,70 172,28 138,58" fill="${c0}"/>
        <polygon points="50,66 36,40 58,58" fill="${c2}" opacity="0.7"/>
        <polygon points="150,66 164,40 142,58" fill="${c2}" opacity="0.7"/>
      ` : ""}
      ${char.kind === "fox" || char.kind === "wolf" || char.kind === "lynx" || char.kind === "panther" ? `
        <polygon points="48,70 40,22 72,55" fill="url(#fur)"/>
        <polygon points="152,70 160,22 128,55" fill="url(#fur)"/>
        <polygon points="50,64 46,36 66,55" fill="${c2}" opacity="0.65"/>
        <polygon points="150,64 154,36 134,55" fill="${c2}" opacity="0.65"/>
      ` : ""}

      <!-- head -->
      <circle cx="100" cy="100" r="${cute ? 62 : 56}" fill="${scaled || animalEars || birdLike ? "url(#fur)" : face}"/>
      ${!cute && !animalEars && !birdLike && !scaled ? `<circle cx="100" cy="100" r="56" fill="${face}"/>` : ""}
      ${cute ? `<circle cx="100" cy="100" r="62" fill="${c0}" opacity="0.12"/>` : ""}

      <!-- hair / helmets -->
      ${!animalEars && !birdLike && !scaled && (char.kind === "humanoid" || char.kind === "fighter" || char.kind === "mage" || char.kind === "hero" || char.kind === "android" || char.kind === "guard" || char.kind === "rider" || char.kind === "hybrid" || char.kind === "phantom" || char.kind === "titan" || char.kind === "oni") ? `
        <path d="M48 105 Q42 40 100 32 Q158 40 152 105" fill="url(#hair)"/>
        <path d="M55 95 Q60 48 100 42 Q140 48 145 95" fill="${c0}" opacity="0.35"/>
      ` : ""}

      ${char.gear === "helmet" || char.gear === "mech" ? `
        <ellipse cx="100" cy="88" rx="58" ry="52" fill="none" stroke="${c0}" stroke-width="6" opacity="0.85"/>
        <path d="M48 100 Q100 40 152 100" fill="${c2}" opacity="0.35"/>
        <rect x="42" y="98" width="116" height="10" rx="3" fill="${c0}"/>
      ` : ""}
      ${char.gear === "wizard" || char.gear === "cowboy" || char.gear === "chef" || char.gear === "hat" || char.gear === "cap" ? `
        <ellipse cx="100" cy="52" rx="58" ry="14" fill="${c1}"/>
        <path d="M70 52 L85 8 L115 8 L130 52 Z" fill="${c0}"/>
        ${char.gear === "wizard" ? `<circle cx="100" cy="20" r="6" fill="${c2}"/>` : ""}
        ${char.gear === "chef" ? `<rect x="78" y="12" width="44" height="40" rx="8" fill="#f8fafc"/><ellipse cx="100" cy="14" rx="24" ry="10" fill="#fff"/>` : ""}
      ` : ""}
      ${char.gear === "mask" || char.gear === "visor" || char.gear === "shades" || char.gear === "goggles" || char.gear === "hud" || char.gear === "racer" || char.gear === "samurai" ? `
        <rect x="52" y="88" width="96" height="28" rx="10" fill="${c1}" opacity="0.95"/>
        <rect x="58" y="93" width="36" height="18" rx="5" fill="${eyeGlow}" opacity="0.75"/>
        <rect x="106" y="93" width="36" height="18" rx="5" fill="${eyeGlow}" opacity="0.75"/>
        ${char.gear === "samurai" ? `<path d="M55 70 Q100 40 145 70" fill="${c0}" opacity="0.5"/>` : ""}
      ` : ""}
      ${char.gear === "dj" || char.gear === "headset" ? `
        <rect x="34" y="90" width="16" height="36" rx="6" fill="${c0}"/>
        <rect x="150" y="90" width="16" height="36" rx="6" fill="${c0}"/>
        <path d="M42 90 Q100 48 158 90" fill="none" stroke="${c0}" stroke-width="8" stroke-linecap="round"/>
      ` : ""}
      ${char.gear === "hood" || char.gear === "hoodie" || char.gear === "scarf" ? `
        <path d="M45 120 Q40 50 100 40 Q160 50 155 120" fill="${c0}" opacity="0.55"/>
        <path d="M55 125 Q50 70 100 60 Q150 70 145 125" fill="none" stroke="${c1}" stroke-width="10" opacity="0.5"/>
      ` : ""}
      ${char.gear === "oni" ? `
        <path d="M55 55 L48 30 L70 50" fill="${c0}"/>
        <path d="M145 55 L152 30 L130 50" fill="${c0}"/>
        <ellipse cx="100" cy="100" rx="58" ry="54" fill="${c0}" opacity="0.25"/>
      ` : ""}
      ${char.gear === "horn" ? `
        <path d="M100 40 L108 0 L92 0 Z" fill="${c2}" stroke="${c0}" stroke-width="2"/>
        <ellipse cx="100" cy="8" rx="6" ry="4" fill="${c0}"/>
      ` : ""}
      ${char.gear === "crystal" || char.gear === "star" || char.gear === "orb" ? `
        <polygon points="100,20 112,48 100,58 88,48" fill="${c2}" stroke="${c0}" stroke-width="2"/>
        <circle cx="100" cy="155" r="12" fill="${c0}" opacity="0.4"/>
      ` : ""}
      ${char.gear === "blade" || char.gear === "dual" ? `
        <rect x="155" y="60" width="10" height="90" rx="3" fill="${c2}" transform="rotate(20 160 105)"/>
        <rect x="150" y="52" width="20" height="14" rx="3" fill="${c0}"/>
      ` : ""}
      ${char.gear === "fire" || char.gear === "glow" || char.gear === "ice" || char.gear === "spirit" || char.gear === "void" || char.gear === "glitch" || char.gear === "bio" || char.gear === "chrono" ? `
        <circle cx="100" cy="100" r="70" fill="none" stroke="${c0}" stroke-width="3" opacity="0.25"/>
        <circle cx="100" cy="100" r="78" fill="none" stroke="${c2}" stroke-width="2" opacity="0.2"/>
      ` : ""}
      ${char.gear === "glitch" ? `
        <rect x="40" y="75" width="120" height="4" fill="${c0}" opacity="0.45"/>
        <rect x="50" y="120" width="100" height="3" fill="${c2}" opacity="0.5"/>
      ` : ""}
      ${char.gear === "circuit" ? `
        <path d="M50 150 L70 130 L90 150 L110 125 L130 150 L150 135" fill="none" stroke="${c0}" stroke-width="3" opacity="0.55"/>
      ` : ""}
      ${char.gear === "spikes" ? `
        <polygon points="55,45 50,15 68,42" fill="${c1}"/>
        <polygon points="80,35 78,8 95,35" fill="${c1}"/>
        <polygon points="120,35 122,8 105,35" fill="${c1}"/>
        <polygon points="145,45 150,15 132,42" fill="${c1}"/>
      ` : ""}
      ${char.gear === "pixels" ? `
        <rect x="40" y="40" width="12" height="12" fill="${c0}" opacity="0.5"/>
        <rect x="148" y="50" width="10" height="10" fill="${c0}" opacity="0.4"/>
        <rect x="55" y="150" width="14" height="14" fill="${c0}" opacity="0.35"/>
      ` : ""}
      ${char.gear === "leaves" ? `
        <ellipse cx="55" cy="45" rx="16" ry="8" fill="${c0}" transform="rotate(-30 55 45)"/>
        <ellipse cx="145" cy="45" rx="16" ry="8" fill="${c0}" transform="rotate(30 145 45)"/>
        <ellipse cx="100" cy="28" rx="18" ry="9" fill="${c2}" opacity="0.8"/>
      ` : ""}
      ${char.gear === "stars" || char.gear === "cone" ? `
        <polygon points="160,50 164,60 175,60 166,67 170,78 160,71 150,78 154,67 145,60 156,60" fill="${c2}"/>
        <polygon points="40,60 42,66 48,66 43,70 45,76 40,72 35,76 37,70 32,66 38,66" fill="${c0}"/>
      ` : ""}
      ${char.gear === "cookie" ? `
        <circle cx="155" cy="140" r="18" fill="${c1}"/>
        <circle cx="150" cy="136" r="2" fill="${c0}"/><circle cx="160" cy="142" r="2" fill="${c0}"/><circle cx="155" cy="148" r="2" fill="${c0}"/>
      ` : ""}

      <!-- face features -->
      ${!char.gear.includes("visor") && char.gear !== "shades" && char.gear !== "goggles" && char.gear !== "hud" && char.gear !== "racer" && char.gear !== "samurai" && char.gear !== "mask" ? `
        <!-- brows -->
        ${!cute ? `<path d="M62 82 L88 78" stroke="${ink}" stroke-width="4" stroke-linecap="round"/>
                   <path d="M112 78 L138 82" stroke="${ink}" stroke-width="4" stroke-linecap="round"/>` : ""}
        <!-- eyes -->
        <ellipse cx="78" cy="98" rx="${cute ? 16 : 13}" ry="${cute ? 18 : 14}" fill="${ink}"/>
        <ellipse cx="122" cy="98" rx="${cute ? 16 : 13}" ry="${cute ? 18 : 14}" fill="${ink}"/>
        <ellipse cx="78" cy="98" rx="${cute ? 9 : 7}" ry="${cute ? 10 : 8}" fill="${eyeGlow}"/>
        <ellipse cx="122" cy="98" rx="${cute ? 9 : 7}" ry="${cute ? 10 : 8}" fill="${eyeGlow}"/>
        <circle cx="74" cy="92" r="${cute ? 5 : 3.5}" fill="#fff" opacity="0.95"/>
        <circle cx="118" cy="92" r="${cute ? 5 : 3.5}" fill="#fff" opacity="0.95"/>
        ${cute ? `<circle cx="82" cy="102" r="2.5" fill="#fff" opacity="0.7"/><circle cx="126" cy="102" r="2.5" fill="#fff" opacity="0.7"/>` : ""}
      ` : `
        <!-- glowing visor eyes already drawn -->
        <circle cx="76" cy="102" r="3" fill="#fff" opacity="0.7"/>
        <circle cx="124" cy="102" r="3" fill="#fff" opacity="0.7"/>
      `}

      <!-- cheeks -->
      ${cute ? `<circle cx="55" cy="118" r="12" fill="url(#cheek)"/><circle cx="145" cy="118" r="12" fill="url(#cheek)"/>` : ""}

      <!-- nose / snout -->
      ${animalEars || scaled || birdLike ? `
        <ellipse cx="100" cy="118" rx="10" ry="7" fill="${ink}" opacity="0.85"/>
        ${cute ? `<ellipse cx="100" cy="116" rx="4" ry="2" fill="#fff" opacity="0.35"/>` : ""}
      ` : `
        <ellipse cx="100" cy="112" rx="5" ry="3.5" fill="${ink}" opacity="0.35"/>
      `}

      <!-- mouth -->
      ${cute
        ? `<path d="M82 128 Q100 148 118 128" fill="none" stroke="${ink}" stroke-width="4" stroke-linecap="round"/>
           <path d="M90 132 Q100 140 110 132" fill="#ff6b9d" opacity="0.45"/>`
        : `<path d="M85 130 L100 138 L115 130" fill="none" stroke="${ink}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`
      }

      <!-- axolotl gills / jelly tentacles hints -->
      ${char.kind === "axolotl" ? `
        <ellipse cx="40" cy="100" rx="14" ry="8" fill="${c0}" transform="rotate(-20 40 100)"/>
        <ellipse cx="38" cy="115" rx="12" ry="7" fill="${c0}" transform="rotate(-5 38 115)"/>
        <ellipse cx="160" cy="100" rx="14" ry="8" fill="${c0}" transform="rotate(20 160 100)"/>
        <ellipse cx="162" cy="115" rx="12" ry="7" fill="${c0}" transform="rotate(5 162 115)"/>
      ` : ""}
      ${char.kind === "jelly" ? `
        <path d="M70 150 Q65 180 75 190" fill="none" stroke="${c0}" stroke-width="5" opacity="0.5"/>
        <path d="M100 155 Q100 185 100 195" fill="none" stroke="${c0}" stroke-width="5" opacity="0.5"/>
        <path d="M130 150 Q135 180 125 190" fill="none" stroke="${c0}" stroke-width="5" opacity="0.5"/>
      ` : ""}
      ${char.kind === "kraken" ? `
        <path d="M50 160 Q30 180 45 195" fill="none" stroke="${c0}" stroke-width="8" stroke-linecap="round" opacity="0.7"/>
        <path d="M150 160 Q170 180 155 195" fill="none" stroke="${c0}" stroke-width="8" stroke-linecap="round" opacity="0.7"/>
        <path d="M80 165 Q70 190 85 198" fill="none" stroke="${c0}" stroke-width="6" opacity="0.55"/>
        <path d="M120 165 Q130 190 115 198" fill="none" stroke="${c0}" stroke-width="6" opacity="0.55"/>
      ` : ""}

      <!-- soft vignette ring -->
      <circle cx="100" cy="100" r="96" fill="none" stroke="${c0}" stroke-width="2" opacity="0.12"/>
    </svg>
  </div>
</div>
</body></html>`;
}

async function renderAll() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 512, height: 512 },
    deviceScaleFactor: 1,
  });

  async function save(pack, char) {
    const dir = path.join(root, "public", "avatars", pack);
    fs.mkdirSync(dir, { recursive: true });
    const out = path.join(dir, `${pad(char.id)}.jpg`);
    await page.setContent(htmlFor(char, pack), { waitUntil: "domcontentloaded" });
    await page.screenshot({ path: out, type: "jpeg", quality: 90 });
    process.stdout.write(`  ${pack}/${pad(char.id)} ${char.name}\n`);
  }

  console.log("Kids 21–40…");
  for (const c of KIDS_NEW) await save("kids", c);

  console.log("Teens 01–40…");
  for (const c of TEENS) await save("teens", c);

  await browser.close();
  console.log("Done.");
}

renderAll().catch((e) => {
  console.error(e);
  process.exit(1);
});
