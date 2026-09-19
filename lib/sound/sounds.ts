/** Recipes copied from https://procedural-sounds.vercel.app - plain data, played by ./player. */
export type Patch = { layers: unknown[] };

export const SOUNDS = {
  hover: {
    layers: [
      { source: { type: "sine", frequency: 2093 }, envelope: { attack: 0, decay: 0.012, sustain: 0, release: 0.004 }, gain: 0.08 },
      { source: { type: "sine", frequency: 3136 }, envelope: { attack: 0, decay: 0.012, sustain: 0, release: 0.004 }, delay: 0.025, gain: 0.08 },
    ],
  },
  tap: {
    layers: [
      { source: { type: "sine", frequency: { start: 880, end: 1046 } }, envelope: { attack: 0, decay: 0.1, sustain: 0.03, release: 0.04 }, gain: 0.14 },
      { source: { type: "sine", frequency: { start: 1046, end: 1175 } }, envelope: { attack: 0, decay: 0.1, sustain: 0.02, release: 0.04 }, delay: 0.08, gain: 0.1 },
    ],
  },
  transition: {
    layers: [
      { source: { type: "sine", frequency: 523 }, envelope: { attack: 0.003, decay: 0.3, sustain: 0.06, release: 0.1 }, gain: 0.16 },
      { source: { type: "sine", frequency: 659 }, envelope: { attack: 0.003, decay: 0.28, sustain: 0.05, release: 0.1 }, delay: 0.07, gain: 0.14 },
      { source: { type: "sine", frequency: { start: 784, end: 880 } }, envelope: { attack: 0.003, decay: 0.32, sustain: 0.06, release: 0.12 }, delay: 0.14, gain: 0.15 },
    ],
  },
  success: {
    layers: [
      { source: { type: "sine", frequency: 780, fm: { ratio: 1.5, depth: 150 } }, envelope: { attack: 0, decay: 0.4, sustain: 0.04, release: 0.15 }, effects: [{ type: "reverb", decay: 0.6, damping: 0.6, mix: 0.12 }], gain: 0.16 },
      { source: { type: "sine", frequency: 1170, fm: { ratio: 1.5, depth: 120 } }, envelope: { attack: 0, decay: 0.35, sustain: 0.03, release: 0.15 }, delay: 0.1, effects: [{ type: "reverb", decay: 0.6, damping: 0.6, mix: 0.12 }], gain: 0.14 },
    ],
  },
} as const;

export type SoundName = keyof typeof SOUNDS;
