// Lightweight, safe Web Audio synthesizer for OPM Media Player
// Generates soft synthesized melodic chords with zero external audio files and zero copyrighted material.

let audioCtx: AudioContext | null = null;
let currentOscillators: OscillatorNode[] = [];
let gainNode: GainNode | null = null;

const NOTE_FREQS: Record<string, number[]> = {
  "G Major": [196.0, 246.94, 293.66, 392.0], // G3, B3, D4, G4
  "D Major": [146.83, 220.0, 293.66, 369.99], // D3, A3, D4, F#4
  "E Major": [164.81, 207.65, 246.94, 329.63], // E3, G#3, B3, E4
  "C Major": [130.81, 164.81, 196.0, 261.63], // C3, E3, G3, C4
  "A Minor": [110.0, 164.81, 220.0, 261.63], // A2, E3, A3, C4
  "F# Minor": [185.0, 220.0, 277.18, 369.99], // F#3, A3, C#4, F#4
};

export function startSynthPlayback(musicalKey: string, volume: number = 0.5, isMuted: boolean = false) {
  if (typeof window === "undefined") return;

  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === "suspended") {
      audioCtx.resume().catch(() => {});
    }

    stopSynthPlayback();

    const freqs = NOTE_FREQS[musicalKey] || NOTE_FREQS["G Major"];
    gainNode = audioCtx.createGain();
    const effectiveGain = isMuted ? 0 : Math.max(0, Math.min(1, volume)) * 0.08; // Gentle low volume
    gainNode.gain.setValueAtTime(effectiveGain, audioCtx.currentTime);
    gainNode.connect(audioCtx.destination);

    currentOscillators = freqs.map((freq, index) => {
      const osc = audioCtx!.createOscillator();
      osc.type = index % 2 === 0 ? "triangle" : "sine";
      osc.frequency.setValueAtTime(freq, audioCtx!.currentTime);

      const filter = audioCtx!.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(800, audioCtx!.currentTime);

      osc.connect(filter);
      filter.connect(gainNode!);
      osc.start();
      return osc;
    });
  } catch {
    // Audio playback not supported or blocked by browser policy
  }
}

export function updateSynthVolume(volume: number, isMuted: boolean = false) {
  if (!gainNode || !audioCtx) return;
  try {
    const effectiveGain = isMuted ? 0 : Math.max(0, Math.min(1, volume)) * 0.08;
    gainNode.gain.setValueAtTime(effectiveGain, audioCtx.currentTime);
  } catch {
    // Ignore
  }
}

export function stopSynthPlayback() {
  currentOscillators.forEach((osc) => {
    try {
      osc.stop();
      osc.disconnect();
    } catch {
      // Ignore
    }
  });
  currentOscillators = [];
}
