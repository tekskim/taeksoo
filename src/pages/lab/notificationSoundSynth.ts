export interface SoundDefinition {
  id: string;
  name: string;
  description: string;
  play: (ctx: AudioContext) => void;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function createOsc(
  ctx: AudioContext,
  type: OscillatorType,
  freq: number,
  gain: GainNode,
  startTime: number,
  endTime: number
) {
  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.value = freq;
  osc.connect(gain);
  osc.start(startTime);
  osc.stop(endTime);
}

function envelope(
  ctx: AudioContext,
  dest: AudioNode,
  peakVol: number,
  attack: number,
  decay: number,
  startTime: number
) {
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, startTime);
  g.gain.linearRampToValueAtTime(peakVol, startTime + attack);
  g.gain.exponentialRampToValueAtTime(0.001, startTime + attack + decay);
  g.connect(dest);
  return g;
}

function noteFreq(semitone: number): number {
  return 440 * 2 ** (semitone / 12);
}

const C5 = noteFreq(3);
const E5 = noteFreq(7);
const G5 = noteFreq(10);

/* ------------------------------------------------------------------ */
/*  Normal Notification Sounds                                        */
/*  유명 메신저/시스템 알림음 스타일 기반                                    */
/*  #6(Triple Chime), #10(Double Tap) 유지                             */
/* ------------------------------------------------------------------ */

function playTriTone(ctx: AudioContext) {
  const t = ctx.currentTime;
  const master = ctx.createGain();
  master.gain.value = 0.28;
  master.connect(ctx.destination);

  const notes = [1046.5, 1318.5, 1568];
  notes.forEach((freq, i) => {
    const start = t + i * 0.1;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.6, start);
    g.gain.exponentialRampToValueAtTime(0.001, start + 0.2);
    g.connect(master);
    createOsc(ctx, 'sine', freq, g, start, start + 0.25);
  });
}

function playTripleChime(ctx: AudioContext) {
  const t = ctx.currentTime;
  const master = ctx.createGain();
  master.gain.value = 0.3;
  master.connect(ctx.destination);

  [C5, E5, G5].forEach((freq, i) => {
    const offset = i * 0.12;
    const g = envelope(ctx, master, 1, 0.01, 0.35, t + offset);
    createOsc(ctx, 'sine', freq, g, t + offset, t + offset + 0.4);
  });
}

function playDoubleTap(ctx: AudioContext) {
  const t = ctx.currentTime;
  const master = ctx.createGain();
  master.gain.value = 0.3;
  master.connect(ctx.destination);

  for (let i = 0; i < 2; i++) {
    const offset = i * 0.1;
    const freq = 600 + i * 80;

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.6, t + offset);
    g.gain.exponentialRampToValueAtTime(0.001, t + offset + 0.15);
    g.connect(master);
    createOsc(ctx, 'sine', freq, g, t + offset, t + offset + 0.2);

    const g2 = ctx.createGain();
    g2.gain.setValueAtTime(0.15, t + offset);
    g2.gain.exponentialRampToValueAtTime(0.001, t + offset + 0.06);
    g2.connect(master);
    createOsc(ctx, 'sine', freq * 3, g2, t + offset, t + offset + 0.08);
  }
}

/* ------------------------------------------------------------------ */
/*  Emergency Warning Sounds                                          */
/* ------------------------------------------------------------------ */

function playAlarmPulse(ctx: AudioContext) {
  const t = ctx.currentTime;
  const master = ctx.createGain();
  master.gain.value = 0.28;
  master.connect(ctx.destination);

  for (let i = 0; i < 8; i++) {
    const start = t + i * 0.3;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, start);
    g.gain.linearRampToValueAtTime(0.7, start + 0.02);
    g.gain.setValueAtTime(0.7, start + 0.12);
    g.gain.linearRampToValueAtTime(0, start + 0.2);
    g.connect(master);

    const osc = ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.value = 520;
    const lpf = ctx.createBiquadFilter();
    lpf.type = 'lowpass';
    lpf.frequency.value = 1800;
    osc.connect(lpf);
    lpf.connect(g);
    osc.start(start);
    osc.stop(start + 0.22);
  }
}

function playSirenUrgentSquare(ctx: AudioContext) {
  const t = ctx.currentTime;
  const master = ctx.createGain();
  master.gain.value = 0.25;
  master.connect(ctx.destination);

  const g = ctx.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.7, t + 0.05);
  g.gain.setValueAtTime(0.7, t + 2.2);
  g.gain.linearRampToValueAtTime(0, t + 2.5);
  g.connect(master);

  const osc = ctx.createOscillator();
  osc.type = 'square';
  osc.frequency.setValueAtTime(450, t);
  for (let i = 0; i < 5; i++) {
    const base = t + i * 0.44;
    osc.frequency.linearRampToValueAtTime(900, base + 0.22);
    osc.frequency.linearRampToValueAtTime(450, base + 0.44);
  }

  const lpf = ctx.createBiquadFilter();
  lpf.type = 'lowpass';
  lpf.frequency.value = 2000;
  lpf.Q.value = 1;
  osc.connect(lpf);
  lpf.connect(g);
  osc.start(t);
  osc.stop(t + 2.5);
}

/* ------------------------------------------------------------------ */
/*  Exports                                                           */
/* ------------------------------------------------------------------ */

export const normalSoundDefs: SoundDefinition[] = [
  {
    id: 'normal-01-tri-tone',
    name: 'Tri-Tone',
    description: 'iMessage 스타일 — 3음 상승 유리음',
    play: playTriTone,
  },
  {
    id: 'normal-02-triple-chime',
    name: 'Triple Chime',
    description: '3음 아르페지오 (C5-E5-G5)',
    play: playTripleChime,
  },
  {
    id: 'normal-03-double-tap',
    name: 'Double Tap',
    description: '더블 탭 — 가벼운 두 번 터치',
    play: playDoubleTap,
  },
];

export const emergencySoundDefs: SoundDefinition[] = [
  {
    id: 'emergency-01-alarm-pulse',
    name: 'Alarm Pulse',
    description: '균일 펄스 경보 — 사각파 520Hz 8회 반복',
    play: playAlarmPulse,
  },
  {
    id: 'emergency-02-urgent-square',
    name: 'Urgent Square',
    description: '사각파 긴급 사이렌 — 450~900Hz 필터링 스윕',
    play: playSirenUrgentSquare,
  },
];
