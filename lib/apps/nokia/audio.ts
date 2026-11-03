import type { Ringtone } from "./types";

let activeAudioCtx: AudioContext | null = null;
let activeOscillators: OscillatorNode[] = [];
let stopMelodyTimeout: NodeJS.Timeout | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AudioContextClass =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return null;

  try {
    if (!activeAudioCtx) {
      activeAudioCtx = new AudioContextClass();
    }
    if (activeAudioCtx.state === "suspended") {
      activeAudioCtx.resume().catch(() => {});
    }
    return activeAudioCtx;
  } catch {
    return null;
  }
}

export function stopAudioPlayback(): void {
  if (stopMelodyTimeout) {
    clearTimeout(stopMelodyTimeout);
    stopMelodyTimeout = null;
  }
  for (const osc of activeOscillators) {
    try {
      osc.stop();
      osc.disconnect();
    } catch {
      // Ignored
    }
  }
  activeOscillators = [];
}

export function playKeyClick(isMuted = false): void {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(1200, ctx.currentTime);

    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.03);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.035);
  } catch {
    // Audio playback failure is silent and non-blocking
  }
}

export function playRingtoneMelody(
  ringtone: Ringtone,
  isSilent = false,
  onComplete?: () => void
): void {
  stopAudioPlayback();
  if (isSilent) {
    if (onComplete) onComplete();
    return;
  }

  const ctx = getAudioContext();
  if (!ctx) {
    if (onComplete) onComplete();
    return;
  }

  try {
    let noteStartTime = ctx.currentTime + 0.05;

    for (let i = 0; i < ringtone.notes.length; i++) {
      const note = ringtone.notes[i];
      if (note.freq > 0) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = ringtone.category === "monophonic" ? "square" : "triangle";
        osc.frequency.setValueAtTime(note.freq, noteStartTime);

        // Soft vintage low-pass envelope
        gain.gain.setValueAtTime(0.08, noteStartTime);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStartTime + note.duration * 0.95);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteStartTime);
        osc.stop(noteStartTime + note.duration);
        activeOscillators.push(osc);
      }
      noteStartTime += note.duration;
    }

    const totalDurationMs = (noteStartTime - ctx.currentTime) * 1000;
    stopMelodyTimeout = setTimeout(() => {
      stopAudioPlayback();
      if (onComplete) onComplete();
    }, totalDurationMs);
  } catch {
    if (onComplete) onComplete();
  }
}
