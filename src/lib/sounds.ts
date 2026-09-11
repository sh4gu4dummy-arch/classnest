/**
 * Lightweight classroom sound pack (Web Audio — no asset files).
 * Modes: off · light (soft clicks) · full (celebrations).
 * Default: full (on). Mute anytime via the speaker control.
 */

export type SoundId =
  | "positive"
  | "warning"
  | "negative"
  | "evolve"
  | "spar"
  | "tournament"
  | "ui"
  | "tick"
  | "land";

export type SoundPack = "off" | "light" | "full";

const STORAGE_KEY = "classnest-sounds";
const PACK_KEY = "classnest-sound-pack";

let ctx: AudioContext | null = null;
let master: GainNode | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!ctx) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.22;
      master.connect(ctx.destination);
    }
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

/** True when pack is light or full. */
export function isSoundEnabled(): boolean {
  return getSoundPack() !== "off";
}

/** Default FULL so awards play immediately; mute via speaker toggle. */
export function getSoundPack(): SoundPack {
  try {
    const pack = localStorage.getItem(PACK_KEY);
    if (pack === "off" || pack === "light" || pack === "full") return pack;
    // Migrate old on/off flag
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "0" || v === "false") return "off";
    if (v === "1" || v === "true") return "full";
    return "full";
  } catch {
    return "full";
  }
}

export function setSoundPack(pack: SoundPack) {
  try {
    localStorage.setItem(PACK_KEY, pack);
    localStorage.setItem(STORAGE_KEY, pack === "off" ? "0" : "1");
  } catch {
    /* ignore */
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("classnest-sounds-changed"));
  }
}

export function setSoundEnabled(on: boolean) {
  setSoundPack(on ? "full" : "off");
}

/** Cycle off → light → full → off */
export function cycleSoundPack(): SoundPack {
  const cur = getSoundPack();
  const next: SoundPack =
    cur === "off" ? "light" : cur === "light" ? "full" : "off";
  setSoundPack(next);
  return next;
}

function tone(
  frequency: number,
  start: number,
  duration: number,
  type: OscillatorType = "sine",
  gain = 0.35,
  slideTo?: number,
) {
  const c = getCtx();
  if (!c || !master) return;
  const pack = getSoundPack();
  const scale = pack === "light" ? 0.45 : 1;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, start);
  if (slideTo != null) {
    osc.frequency.linearRampToValueAtTime(slideTo, start + duration * 0.85);
  }
  g.gain.setValueAtTime(0.0001, start);
  g.gain.exponentialRampToValueAtTime(gain * scale, start + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(g);
  g.connect(master);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

function playPositive() {
  const c = getCtx();
  if (!c) return;
  const t = c.currentTime;
  if (getSoundPack() === "light") {
    tone(660, t, 0.07, "sine", 0.22);
    return;
  }
  tone(523.25, t, 0.12, "triangle", 0.32);
  tone(659.25, t + 0.09, 0.18, "triangle", 0.28);
  tone(783.99, t + 0.16, 0.22, "sine", 0.18);
}

function playWarning() {
  const c = getCtx();
  if (!c) return;
  const t = c.currentTime;
  if (getSoundPack() === "light") {
    tone(196, t, 0.12, "sine", 0.18);
    return;
  }
  tone(196.0, t, 0.2, "sine", 0.28);
  tone(174.61, t + 0.12, 0.28, "triangle", 0.22);
}

function playNegative() {
  const c = getCtx();
  if (!c) return;
  const t = c.currentTime;
  if (getSoundPack() === "light") {
    tone(240, t, 0.14, "triangle", 0.16, 180);
    return;
  }
  tone(392.0, t, 0.18, "sawtooth", 0.12);
  tone(293.66, t + 0.12, 0.28, "triangle", 0.22, 220);
  tone(196.0, t + 0.28, 0.35, "sine", 0.18);
}

function playEvolve() {
  const c = getCtx();
  if (!c) return;
  const t = c.currentTime;
  if (getSoundPack() === "light") {
    tone(523.25, t, 0.1, "triangle", 0.2);
    tone(783.99, t + 0.08, 0.16, "sine", 0.16);
    return;
  }
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((f, i) => {
    tone(f, t + i * 0.08, 0.22, i === 3 ? "sine" : "triangle", 0.26 - i * 0.02);
  });
  tone(1318.5, t + 0.36, 0.35, "sine", 0.14);
}

function playSpar() {
  const c = getCtx();
  if (!c || !master) return;
  const t = c.currentTime;
  if (getSoundPack() === "light") {
    tone(120, t, 0.08, "sine", 0.2);
    return;
  }
  tone(80, t, 0.12, "sine", 0.4);
  tone(160, t, 0.08, "square", 0.08);
  tone(220, t + 0.05, 0.1, "triangle", 0.15, 110);
}

function playTournament() {
  const c = getCtx();
  if (!c) return;
  const t = c.currentTime;
  if (getSoundPack() === "light") {
    tone(523.25, t, 0.12, "triangle", 0.18);
    return;
  }
  tone(392, t, 0.12, "triangle", 0.25);
  tone(523.25, t + 0.1, 0.14, "triangle", 0.28);
  tone(659.25, t + 0.22, 0.28, "sine", 0.3);
  tone(783.99, t + 0.35, 0.4, "sine", 0.2);
}

function playUi() {
  const c = getCtx();
  if (!c) return;
  tone(660, c.currentTime, 0.06, "sine", 0.12);
}

function playTick() {
  const c = getCtx();
  if (!c) return;
  tone(880, c.currentTime, 0.035, "square", 0.06);
}

function playLand() {
  const c = getCtx();
  if (!c) return;
  const t = c.currentTime;
  tone(523.25, t, 0.1, "triangle", 0.22);
  tone(783.99, t + 0.07, 0.18, "sine", 0.2);
}

export function playSound(id: SoundId) {
  if (!isSoundEnabled()) return;
  try {
    switch (id) {
      case "positive":
        playPositive();
        break;
      case "warning":
        playWarning();
        break;
      case "negative":
        playNegative();
        break;
      case "evolve":
        playEvolve();
        break;
      case "spar":
        playSpar();
        break;
      case "tournament":
        playTournament();
        break;
      case "ui":
        playUi();
        break;
      case "tick":
        playTick();
        break;
      case "land":
        playLand();
        break;
    }
  } catch {
    /* audio blocked */
  }
}

export function playAwardSound(pointsDelta: number) {
  if (pointsDelta > 0) playSound("positive");
  else if (pointsDelta < 0) playSound("negative");
  else playSound("warning");
}

export function unlockAudio() {
  const c = getCtx();
  if (c?.state === "suspended") void c.resume();
}
