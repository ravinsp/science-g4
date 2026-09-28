// Sound effects made on the fly with the Web Audio API (no sound files needed).
const Sfx = (() => {
  let ctx = null, master = null, noiseBuf = null;
  let enabled = true;

  function init() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.55;
    master.connect(ctx.destination);
    // One second of white noise, reused by every noisy sound
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }

  // A single note with a quick fade in and out
  function tone({ f = 440, f2 = null, type = 'sine', dur = 0.15, vol = 0.25, attack = 0.008, delay = 0, lfo = 0, lfoDepth = 0 } = {}) {
    if (!ctx || !enabled) return;
    const t = ctx.currentTime + delay;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f, t);
    if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    if (lfo) {
      const l = ctx.createOscillator(), lg = ctx.createGain();
      l.frequency.value = lfo; lg.gain.value = lfoDepth;
      l.connect(lg); lg.connect(o.frequency);
      l.start(t); l.stop(t + dur + 0.05);
    }
    o.connect(g); g.connect(master);
    o.start(t); o.stop(t + dur + 0.05);
  }

  // Filtered noise: good for water, wind, snips and sprays
  function noise({ dur = 0.3, vol = 0.2, type = 'highpass', freq = 1000, freq2 = null, q = 1, delay = 0, attack = 0.01 } = {}) {
    if (!ctx || !enabled) return;
    const t = ctx.currentTime + delay;
    const src = ctx.createBufferSource();
    src.buffer = noiseBuf; src.loop = true;
    const fl = ctx.createBiquadFilter();
    fl.type = type; fl.Q.value = q;
    fl.frequency.setValueAtTime(freq, t);
    if (freq2) fl.frequency.exponentialRampToValueAtTime(freq2, t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(fl); fl.connect(g); g.connect(master);
    src.start(t); src.stop(t + dur + 0.05);
  }

  const rnd = (a, b) => a + Math.random() * (b - a);

  const sounds = {
    click: () => tone({ f: 700, f2: 950, dur: 0.06, vol: 0.12, type: 'triangle' }),
    tick: () => tone({ f: 1500, dur: 0.03, vol: 0.08, type: 'square' }),
    pop: () => tone({ f: 320, f2: 980, dur: 0.12, vol: 0.22 }),
    pick: () => tone({ f: 520, f2: 780, dur: 0.08, vol: 0.16, type: 'triangle' }),
    drop: () => tone({ f: 780, f2: 420, dur: 0.1, vol: 0.16, type: 'triangle' }),
    success: () => [523, 659, 784, 1047].forEach((f, i) => tone({ f, dur: 0.28, vol: 0.18, type: 'triangle', delay: i * 0.08 })),
    star: () => [1047, 1319, 1568, 2093, 2637].forEach((f, i) => tone({ f, dur: 0.22, vol: 0.1, delay: i * 0.05 })),
    oops: () => { tone({ f: 330, f2: 250, dur: 0.2, vol: 0.12, type: 'sawtooth' }); tone({ f: 250, f2: 190, dur: 0.25, vol: 0.12, type: 'sawtooth', delay: 0.15 }); },
    drip: () => tone({ f: rnd(900, 1400), f2: 300, dur: 0.12, vol: 0.2 }),
    water: () => { for (let i = 0; i < 6; i++) tone({ f: rnd(700, 1500), f2: rnd(250, 400), dur: 0.1, vol: 0.13, delay: i * rnd(0.06, 0.12) }); noise({ dur: 0.8, vol: 0.06, type: 'lowpass', freq: 900 }); },
    pour: () => { noise({ dur: 1.4, vol: 0.14, type: 'bandpass', freq: 700, q: 0.8, attack: 0.15 }); for (let i = 0; i < 10; i++) tone({ f: rnd(500, 1200), f2: 300, dur: 0.08, vol: 0.06, delay: i * 0.12 }); },
    spray: () => noise({ dur: 0.35, vol: 0.2, type: 'highpass', freq: 3500, attack: 0.02 }),
    snip: () => { noise({ dur: 0.05, vol: 0.35, type: 'highpass', freq: 5000 }); noise({ dur: 0.05, vol: 0.25, type: 'highpass', freq: 3500, delay: 0.07 }); },
    whoosh: () => noise({ dur: 0.6, vol: 0.18, type: 'bandpass', freq: 300, freq2: 2500, q: 1.5, attack: 0.2 }),
    wind: () => noise({ dur: 2.4, vol: 0.2, type: 'bandpass', freq: 250, freq2: 700, q: 0.7, attack: 0.8 }),
    grow: () => { tone({ f: 220, f2: 880, dur: 0.9, vol: 0.12, type: 'triangle' }); tone({ f: 330, f2: 1320, dur: 0.9, vol: 0.06, delay: 0.1 }); },
    shrink: () => tone({ f: 700, f2: 180, dur: 0.6, vol: 0.12, type: 'triangle' }),
    thud: () => { tone({ f: 140, f2: 45, dur: 0.3, vol: 0.4 }); noise({ dur: 0.15, vol: 0.12, type: 'lowpass', freq: 400 }); },
    page: () => noise({ dur: 0.18, vol: 0.12, type: 'bandpass', freq: 1800, freq2: 3500, q: 0.8 }),
    buzz: () => tone({ f: 190, dur: 1.2, vol: 0.06, type: 'sawtooth', lfo: 18, lfoDepth: 25, attack: 0.1 }),
    flutter: () => { for (let i = 0; i < 6; i++) noise({ dur: 0.06, vol: 0.07, type: 'bandpass', freq: 1200, q: 2, delay: i * 0.09 }); },
    shutter: () => { noise({ dur: 0.04, vol: 0.3, type: 'highpass', freq: 2000 }); noise({ dur: 0.06, vol: 0.25, type: 'highpass', freq: 1500, delay: 0.09 }); },
    chirp: () => { const b = rnd(2400, 3600); tone({ f: b, f2: b * 1.4, dur: 0.07, vol: 0.05 }); tone({ f: b * 1.1, f2: b * 0.8, dur: 0.08, vol: 0.05, delay: 0.1 }); },
    rain: () => { noise({ dur: 2.5, vol: 0.12, type: 'highpass', freq: 1500, attack: 0.5 }); for (let i = 0; i < 18; i++) tone({ f: rnd(1500, 3000), f2: 800, dur: 0.04, vol: 0.04, delay: rnd(0, 2.2) }); },
    pluck: () => { tone({ f: 600, f2: 280, dur: 0.12, vol: 0.18, type: 'triangle' }); noise({ dur: 0.06, vol: 0.1, type: 'bandpass', freq: 2000 }); },
    sprinkle: () => { for (let i = 0; i < 10; i++) tone({ f: rnd(2500, 4500), dur: 0.03, vol: 0.05, delay: i * 0.05 }); },
    bubble: () => { for (let i = 0; i < 4; i++) tone({ f: rnd(300, 600), f2: rnd(900, 1400), dur: 0.08, vol: 0.12, delay: i * 0.1 }); },
    swoosh: () => noise({ dur: 0.3, vol: 0.12, type: 'bandpass', freq: 800, freq2: 3000, q: 2 }),
    magic: () => { [784, 988, 1175, 1568].forEach((f, i) => tone({ f, dur: 0.4, vol: 0.08, delay: i * 0.07 })); noise({ dur: 0.6, vol: 0.04, type: 'highpass', freq: 6000 }); },
    fanfare: () => { [523, 523, 784, 659, 784, 1047].forEach((f, i) => tone({ f, dur: i === 5 ? 0.7 : 0.18, vol: 0.16, type: 'triangle', delay: [0, .15, .3, .5, .65, .85][i] })); },
    knock: () => { tone({ f: 200, f2: 120, dur: 0.08, vol: 0.3 }); },
  };

  function play(name) {
    if (!enabled || !ctx) return;
    const s = sounds[name];
    if (s) try { s(); } catch (e) { /* ignore audio glitches */ }
  }

  return {
    init, play, tone, noise,
    get enabled() { return enabled; },
    set enabled(v) { enabled = !!v; },
  };
})();
