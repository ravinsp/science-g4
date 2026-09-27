// Read-aloud using the browser's built-in speech (Web Speech API).
// Words are highlighted as they are spoken when the voice supports it.
const Voice = (() => {
  const synth = window.speechSynthesis;
  let enabled = true;
  let rate = 0.95;
  let voice = null;
  let queue = [];
  let current = null;       // keep a reference so Chrome does not drop the utterance
  let runId = 0;
  const listeners = { start: [], end: [] };

  function pickVoice() {
    if (!synth) return;
    const vs = synth.getVoices().filter(v => /^en/i.test(v.lang));
    if (!vs.length) return;
    const prefs = [
      /(Sonia|Libby|Maisie|Mia).*Natural/i,
      /Natural.*en-GB/i,
      /Google UK English Female/i,
      /Microsoft (Hazel|Susan|Libby)/i,
      /en[-_]GB/i,
      /(Aria|Jenny|Ana).*Natural/i,
      /Google US English/i,
      /Microsoft (Zira|Aria|Jenny)/i,
    ];
    for (const p of prefs) {
      const v = vs.find(v => p.test(v.name) || p.test(v.name + ' ' + v.lang));
      if (v) { voice = v; return; }
    }
    voice = vs[0];
  }
  if (synth) {
    pickVoice();
    synth.onvoiceschanged = pickVoice;
  }

  // Wrap each word in an element with a span so it can be highlighted.
  // Returns the plain text that will be spoken.
  function prepare(el) {
    if (el._plain != null) return el._plain;
    let plain = '';
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      const text = node.nodeValue;
      const frag = document.createDocumentFragment();
      const re = /(\s+)|([^\s]+)/g;
      let m;
      while ((m = re.exec(text))) {
        if (m[1]) { frag.appendChild(document.createTextNode(m[1])); plain += m[1]; }
        else {
          const s = document.createElement('span');
          s.className = 'w';
          s.dataset.start = plain.length;
          s.textContent = m[2];
          frag.appendChild(s);
          plain += m[2];
        }
      }
      // Keep sentences apart when block elements meet
      plain += ' ';
      node.parentNode.replaceChild(frag, node);
    });
    el._plain = plain;
    el._words = Array.from(el.querySelectorAll('.w'));
    return plain;
  }

  function emit(type) { listeners[type].forEach(fn => { try { fn(); } catch (e) {} }); }

  function clearHighlights() {
    document.querySelectorAll('.w.hl').forEach(w => w.classList.remove('hl'));
    document.querySelectorAll('.reading').forEach(w => w.classList.remove('reading'));
  }

  function stop() {
    runId++;
    queue = [];
    if (synth) synth.cancel();
    current = null;
    clearHighlights();
    document.body.classList.remove('talking');
    emit('end');
  }

  function playNext(id) {
    if (id !== runId) return;
    const item = queue.shift();
    if (!item) {
      current = null;
      document.body.classList.remove('talking');
      clearHighlights();
      emit('end');
      return;
    }
    const text = item.el ? prepare(item.el) : item.text;
    if (!text || !text.trim()) { playNext(id); return; }
    const u = new SpeechSynthesisUtterance(text.replace(/[“”]/g, '"'));
    if (voice) u.voice = voice;
    u.lang = voice ? voice.lang : 'en-GB';
    u.rate = rate * (item.rate || 1);
    u.pitch = item.pitch || 1.05;
    const box = item.box || item.el;
    u.onstart = () => {
      if (id !== runId) return;
      document.body.classList.add('talking');
      if (box) box.classList.add('reading');
      emit('start');
    };
    u.onboundary = e => {
      if (id !== runId || !item.el || e.name === 'sentence') return;
      const words = item.el._words;
      let hit = null;
      for (const w of words) { if (+w.dataset.start <= e.charIndex) hit = w; else break; }
      words.forEach(w => w.classList.toggle('hl', w === hit));
    };
    const done = () => {
      if (id !== runId) return;
      if (box) box.classList.remove('reading');
      if (item.el) item.el._words.forEach(w => w.classList.remove('hl'));
      if (item.onend) try { item.onend(); } catch (e) {}
      setTimeout(() => playNext(id), item.pause != null ? item.pause : 250);
    };
    u.onend = done;
    u.onerror = done;
    current = u;
    synth.speak(u);
  }

  // items: array of { text } or { el } (element whose words get highlighted)
  function sequence(items, { interrupt = true } = {}) {
    if (!synth || !enabled) return;
    if (interrupt) stop();
    const id = runId;
    const wasIdle = !current && !queue.length;
    queue.push(...items);
    if (interrupt || wasIdle) {
      // A short delay avoids Chrome ignoring speak() straight after cancel()
      setTimeout(() => { if (!current || interrupt) playNext(id); }, 60);
    }
  }

  function speak(text, opts = {}) {
    sequence([{ text, pitch: opts.pitch, rate: opts.rate, onend: opts.onend }], { interrupt: opts.interrupt !== false });
  }

  return {
    speak, sequence, stop, prepare,
    on(type, fn) { listeners[type].push(fn); },
    get speaking() { return !!current; },
    get enabled() { return enabled; },
    set enabled(v) { enabled = !!v; if (!enabled) stop(); },
    get rate() { return rate; },
    set rate(v) { rate = +v || 1; },
    get supported() { return !!synth; },
  };
})();
