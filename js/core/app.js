// App shell: lessons, chapters, steps, narration, progress and the scene API.
// A lesson is a set of chapters (see lessons/lessons.js). Its chapter files
// are loaded only when the lesson is opened.
const App = (() => {
  const lessons = [];           // every registered lesson
  let lesson = null;            // the lesson that is open now
  let loading = null;           // the lesson whose chapter files are loading
  let chapters = [];            // chapters of the open lesson
  let glossary = {};            // word -> definition for the open lesson
  const STORE = 'scienceLessons.v1';
  const OLD_STORE = 'growingPlants.v1';
  const $ = id => document.getElementById(id);

  let state = { ci: 0, si: 0 };
  let store = load();           // { name, settings, lastLesson, lessons: { id: progress } }
  let saved = { seen: {}, stars: {} };   // progress of the open lesson
  let cleanups = [];
  let alive = 0;               // bumps on every page change so old animations stop
  let feedbackTimer = null;
  let shellReady = false;

  function load() {
    const blank = { name: '', settings: {}, lessons: {} };
    try {
      const s = JSON.parse(localStorage.getItem(STORE) || 'null');
      if (s) return Object.assign(blank, s);
      // Progress saved before lessons existed belongs to Lesson 2
      const old = JSON.parse(localStorage.getItem(OLD_STORE) || 'null');
      if (old) {
        const { name, settings, ...prog } = old;
        return Object.assign(blank, { name: name || '', settings: settings || {}, lessons: { 'lesson-2': prog } });
      }
    } catch (e) {}
    return blank;
  }
  function save() { try { localStorage.setItem(STORE, JSON.stringify(store)); } catch (e) {} }
  function progressOf(id) {
    return store.lessons[id] = Object.assign({ seen: {}, stars: {} }, store.lessons[id]);
  }

  // Register a lesson (called from lessons/lessons.js)
  function addLesson(def) {
    def.chapterDefs = [];
    def.glossary = {};
    def.loaded = false;
    lessons.push(def);
  }

  // Register a chapter (called from each chapter file while its lesson loads)
  function chapter(def) {
    const target = loading || lesson;
    if (!target) { console.error('Chapter loaded outside a lesson:', def.id); return; }
    def.steps = def.steps || [];
    target.chapterDefs.push(def);
    (def.keywords || []).forEach(k => { target.glossary[k.w.toLowerCase()] = k.d; });
  }

  // Load a lesson's chapter files in order. Works from file:// (no server needed).
  function loadLesson(ls) {
    if (ls.loaded) return Promise.resolve(ls);
    loading = ls;
    const base = ls.path.replace(/\/?$/, '/');
    return new Promise(resolve => {
      let left = ls.chapters.length;
      if (!left) resolve();
      ls.chapters.forEach(file => {
        const s = document.createElement('script');
        s.src = base + file;
        s.async = false;        // run in the listed order
        const done = () => { if (--left === 0) resolve(); };
        s.onload = done;
        s.onerror = () => { console.error('Could not load', s.src); done(); };
        document.body.appendChild(s);
      });
    }).then(() => {
      loading = null;
      ls.loaded = true;
      return ls;
    });
  }

  // "**word**" becomes a clickable key word
  function fmt(s) {
    return String(s).replace(/\*\*(.+?)\*\*/g, '<b class="kw" data-kw="$1">$1</b>');
  }
  const plain = s => String(s).replace(/<[^>]+>/g, ' ').replace(/\*\*/g, '').replace(/\s+/g, ' ').trim();

  const praises = ['Well done!', 'Brilliant!', 'Great job!', 'Fantastic!', 'You got it!', 'Super!', 'Excellent!', 'Amazing work!'];
  const pick = a => a[Math.floor(Math.random() * a.length)];

  // ---------- Boot ----------
  function boot() {
    buildSplash();
    const nameInput = $('learner-name');
    nameInput.value = store.name || '';
    nameInput.addEventListener('change', () => { store.name = nameInput.value.trim(); save(); });
    renderLessonCards();

    // Test hook: index.html#go=[lessonId:]chapter,step opens a page directly (silent).
    // chapter can be an index or an id, e.g. #go=roots,2 or #go=lesson-2:roots,2
    const m = /#go=(?:([\w-]+):)?([\w-]+),(\d+)/.exec(location.hash);
    if (m) {
      const ls = lessons.find(l => l.id === m[1]) || lessons.find(l => l.chapters && l.chapters.length);
      if (!ls) return;
      $('splash').hidden = true;
      openLesson(ls, { silent: true }).then(() => {
        Voice.enabled = false;
        const byId = chapters.findIndex(c => c.id === m[2]);
        const ci = byId >= 0 ? byId : Math.min(+m[2] || 0, chapters.length - 1);
        go(ci, Math.min(+m[3], chapters[ci].steps.length - 1));
      });
    }
  }

  // Lesson picker on the start screen
  function renderLessonCards() {
    const grid = $('lesson-grid');
    grid.innerHTML = '';
    lessons.slice().sort((a, b) => a.number - b.number).forEach(ls => {
      const ready = ls.chapters && ls.chapters.length;
      const pct = lessonPercent(ls);
      const card = W.h('button', { class: 'lesson-card' + (ready ? '' : ' soon'), style: `--lc:${ls.color || '#C8452F'}` },
        W.h('span', { class: 'lc-num' }, String(ls.number)),
        W.h('span', { class: 'lc-icon' }, ls.icon || '📘'),
        W.h('span', { class: 'lc-title' }, ls.title),
        W.h('span', { class: 'lc-sub' }, ready ? (ls.subtitle || '') : 'Unavailable'),
        ready ? W.h('span', { class: 'lc-bar' }, W.h('span', { style: `width:${pct}%` })) : null,
        ready ? W.h('span', { class: 'lc-go' }, pct ? `Carry on · ${pct}%` : 'Start ▶') : null);
      if (ready) card.addEventListener('click', () => startLesson(ls));
      else card.disabled = true;
      grid.append(card);
    });
  }

  // Share of a lesson's pages seen. Before its files load we only know the saved count.
  function lessonPercent(ls) {
    const p = store.lessons[ls.id];
    if (!p || !p.seen) return 0;
    const seen = Object.keys(p.seen).length;
    const total = ls.loaded ? ls.chapterDefs.reduce((n, c) => n + c.steps.length, 0) : (ls.pages || 0);
    return total ? Math.min(100, Math.round(seen / total * 100)) : 0;
  }

  // Clicked a lesson card: this click also unlocks sound and speech
  function startLesson(ls) {
    Sfx.init();
    store.name = $('learner-name').value.trim();
    save();
    Sfx.play('fanfare');

    $('splash').style.transition = 'opacity .5s';
    $('splash').style.opacity = 0;
    setTimeout(() => { $('splash').hidden = true; }, 500);
    openLesson(ls);
  }

  function openLesson(ls, { silent = false } = {}) {
    return loadLesson(ls).then(() => {
      teardown();
      lesson = ls;
      chapters = ls.chapterDefs;
      glossary = ls.glossary;
      saved = progressOf(ls.id);
      store.lastLesson = ls.id;
      save();
      document.title = `${ls.title} · Lesson ${ls.number}`;
      $('brand-num').textContent = ls.number;
      $('brand-title').textContent = ls.title;
      $('app').hidden = false;
      if (!shellReady) { initShell(); shellReady = true; }
      buildSidebar();
      if (!chapters.length) return;
      const resume = saved.last && chapters[saved.last.ci] ? saved.last : { ci: 0, si: 0 };
      // Don't auto-read over the greeting; the greeting reads the page when it ends
      document.body.dataset.started = silent ? '1' : '';
      go(resume.ci, Math.min(resume.si, chapters[resume.ci].steps.length - 1));
      if (!silent && Voice.enabled) {
        const hi = store.name ? `Hello ${store.name}! ` : 'Hello! ';
        Voice.speak(hi + `I'm Shelly the tortoise. Let's learn about ${ls.title.toLowerCase()}!`, {
          onend: () => { if (store.settings.auto !== false && lesson === ls) readAll(); },
        });
      }
    });
  }

  // Back to the lesson picker
  function home() {
    teardown();
    $('app').hidden = true;
    renderLessonCards();
    const sp = $('splash');
    sp.hidden = false;
    sp.style.opacity = 1;
    Voice.speak('Which lesson would you like to do?');
  }

  function buildSplash() {
    let plants = '';
    const cols = ['#FFD23F', '#F06292', '#BA68C8', '#FF8A65', '#4FC3F7', '#FFFFFF'];
    for (let i = 0; i < 9; i++) {
      const x = 60 + i * 135 + (i % 2) * 20;
      plants += `<g class="grow-in" style="animation-delay:${.2 + i * .15}s"><g class="sway" style="animation-delay:${i * .3}s">${S.plant({ x, y: 640, h: 120 + (i % 3) * 50, leaves: 4 + i % 3, flower: i % 3 === 1 ? 'sunflower' : 'daisy', flowerColor: cols[i % cols.length], flowerCenter: i % 3 === 1 ? '#6D4C1E' : '#FFB300', flowerR: 20 + (i % 3) * 5, petals: 8 + i % 5, roots: false, seed: i })}</g></g>`;
    }
    $('splash-scene').innerHTML = `<svg viewBox="0 0 1280 720" preserveAspectRatio="xMidYMax slice">
      ${S.sun({ x: 1120, y: 110, r: 60 })}
      <g class="float">${S.cloud({ x: 220, y: 120, s: 1.3 })}</g>
      <g class="float" style="animation-delay:1s">${S.cloud({ x: 820, y: 80, s: 1 })}</g>
      ${S.ground({ y: 640, w: 1280, h: 80, fill: 'url(#g-grass)', grass: true })}
      ${plants}
      <g class="float" style="animation-delay:.5s">${S.butterfly({ x: 980, y: 330, s: .8, color: '#FF8A65' })}</g>
      <g class="float" style="animation-delay:1.3s">${S.bee({ x: 300, y: 380, s: 1 })}</g>
    </svg>`;
  }

  function initShell() {
    const st = store.settings;
    const toggles = [
      ['tgl-sound', 'sound', v => { Sfx.enabled = v; }],
      ['tgl-voice', 'voice', v => { Voice.enabled = v; }],
      ['tgl-auto', 'auto', () => {}],
    ];
    toggles.forEach(([id, key, apply]) => {
      const b = $(id);
      const cur = st[key] == null ? true : st[key];
      b.classList.toggle('on', cur); apply(cur);
      b.addEventListener('click', () => {
        const v = !b.classList.contains('on');
        b.classList.toggle('on', v); st[key] = v; save(); apply(v);
        Sfx.play('click');
      });
    });
    if (!Voice.supported) $('tgl-voice').title = 'Speech is not supported in this browser';
    const rate = $('sel-rate');
    if (st.rate) rate.value = st.rate;
    Voice.rate = rate.value;
    rate.addEventListener('change', () => { Voice.rate = rate.value; st.rate = rate.value; save(); Voice.speak('This is how fast I will read.'); });

    $('btn-back').addEventListener('click', () => { Sfx.play('page'); prev(); });
    $('btn-next').addEventListener('click', () => { Sfx.play('page'); next(); });
    $('btn-read').addEventListener('click', () => { Sfx.play('click'); if (Voice.speaking) Voice.stop(); else readAll(); });
    Voice.on('start', () => $('btn-read').classList.add('on'));
    Voice.on('end', () => $('btn-read').classList.remove('on'));

    document.addEventListener('keydown', e => {
      if (e.target.closest('input, textarea, select, [contenteditable]')) return;
      if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key.toLowerCase() === 'r') readAll();
    });

    // Click any key word or chip to hear it
    document.addEventListener('click', e => {
      const kw = e.target.closest('.kw, .chip');
      if (!kw) return;
      e.stopPropagation();
      const w = kw.dataset.kw || kw.textContent;
      sayWord(w, kw);
    }, true);

    $('btn-home').addEventListener('click', () => { Sfx.play('page'); home(); });
  }

  function sayWord(w, el) {
    Sfx.play('pop');
    const d = glossary[w.toLowerCase()];
    Voice.speak(d ? `${w}. ${d}` : w);
    if (el) { el.classList.remove('say'); void el.offsetWidth; el.classList.add('say'); }
  }

  function buildSidebar() {
    const nav = $('sidebar');
    nav.innerHTML = '';
    let group = null;
    chapters.forEach((ch, ci) => {
      if (ch.group && ch.group !== group) {
        group = ch.group;
        nav.append(W.h('div', { class: 'side-group' }, group));
      }
      const b = W.h('button', { class: 'side-item' },
        W.h('span', { class: 'side-icon' }, ch.icon || '🌱'),
        W.h('span', { class: 'side-text' }, ch.title),
        W.h('span', { class: 'side-stars' }));
      b.addEventListener('click', () => { Sfx.play('page'); go(ci, 0); });
      ch._nav = b;
      nav.append(b);
    });
    refreshProgress();
  }

  function refreshProgress() {
    let total = 0, seen = 0;
    chapters.forEach((ch, ci) => {
      let cs = 0, stars = 0, starSteps = 0;
      ch.steps.forEach((st, si) => {
        total++;
        if (saved.seen[ch.id + ':' + si]) { seen++; cs++; }
        if (st.activity) { starSteps++; if (saved.stars[ch.id + ':' + si]) stars++; }
      });
      if (ch._nav) {
        ch._nav.classList.toggle('active', ci === state.ci);
        ch._nav.classList.toggle('done', cs === ch.steps.length);
        ch._nav.querySelector('.side-stars').textContent = starSteps ? `${'★'.repeat(stars)}${'☆'.repeat(starSteps - stars)}` : '';
      }
    });
    const pct = total ? Math.round(seen / total * 100) : 0;
    $('overall-fill').style.width = pct + '%';
    $('overall-text').textContent = pct + '%';
  }

  // ---------- Navigation ----------
  function next() {
    const ch = chapters[state.ci];
    if (state.si < ch.steps.length - 1) go(state.ci, state.si + 1);
    else if (state.ci < chapters.length - 1) {
      Sfx.play('fanfare');
      W.confetti({ n: 50 });
      go(state.ci + 1, 0);
    } else home();
  }
  function prev() {
    if (state.si > 0) go(state.ci, state.si - 1);
    else if (state.ci > 0) go(state.ci - 1, chapters[state.ci - 1].steps.length - 1);
  }

  function teardown() {
    alive++;
    Voice.stop();
    cleanups.forEach(fn => { try { fn(); } catch (e) { console.error(e); } });
    cleanups = [];
    document.querySelectorAll('.drag-chip.dragging, .sort-card.dragging').forEach(n => n.remove());
    const fb = $('feedback'); fb.className = ''; clearTimeout(feedbackTimer);
  }

  function go(ci, si) {
    teardown();
    state = { ci, si };
    const ch = chapters[ci], st = ch.steps[si];
    saved.seen[ch.id + ':' + si] = 1;
    saved.last = { ci, si };
    save();

    // Banner
    $('banner-icon').textContent = ch.icon || '🌱';
    $('banner-title').textContent = st.title ? `${ch.title}: ${st.title}` : ch.title;
    const dots = $('step-dots');
    dots.innerHTML = '';
    ch.steps.forEach((s, i) => {
      const d = W.h('button', { class: 'dot', title: `Page ${i + 1}` });
      if (saved.seen[ch.id + ':' + i]) d.classList.add('seen');
      if (saved.stars[ch.id + ':' + i]) d.classList.add('starred');
      if (i === si) d.classList.add('current');
      d.addEventListener('click', () => { Sfx.play('page'); go(ci, i); });
      dots.append(d);
    });

    renderCards(st);
    renderKeywords(ch);

    $('btn-back').disabled = ci === 0 && si === 0;
    const last = ci === chapters.length - 1 && si === ch.steps.length - 1;
    $('btn-next').textContent = last ? '🏠 All lessons' : si === ch.steps.length - 1 ? 'Next topic ▶' : 'Next ▶';

    // Scene
    const stage = $('stage'), controls = $('controls');
    stage.innerHTML = ''; stage.className = '';
    controls.innerHTML = '';
    const api = makeApi(ch, st, ci, si);
    if (st.scene) {
      try {
        const c = st.scene(stage, api);
        if (typeof c === 'function') cleanups.push(c);
      } catch (e) {
        console.error(e);
        stage.innerHTML = `<p style="padding:20px">Oops, this picture could not load.</p>`;
      }
    }
    refreshProgress();
    $('main').scrollTop = 0;

    if (store.settings.auto !== false && Voice.enabled && document.body.dataset.started) {
      setTimeout(() => { if (state.ci === ci && state.si === si) readAll(); }, 350);
    }
    document.body.dataset.started = '1';
  }

  function renderCards(st) {
    const cards = $('cards');
    cards.innerHTML = '';
    const list = [].concat(st.text || []);
    list.forEach((t, i) => {
      const c = W.h('div', { class: 'card' + (i === 0 ? ' lead' : ''), html: fmt(t) });
      c.style.animationDelay = (i * .08) + 's';
      cards.append(c);
    });
    [].concat(st.ask || []).forEach((t, i) => {
      const c = W.h('div', { class: 'card ask', html: fmt(t) });
      c.style.animationDelay = ((list.length + i) * .08) + 's';
      cards.append(c);
    });
    if (st.tip) {
      const tip = W.h('div', { class: 'tip' },
        W.h('div', { class: 'bubble', html: fmt(st.tip) }),
        W.h('div', { class: 'mascot', html: S.tortoise() }));
      tip.style.animationDelay = ((list.length + 1) * .08) + 's';
      cards.append(tip);
    } else {
      // Shelly always sits in the corner to show who is reading
      const m = W.h('div', { class: 'tip', style: 'justify-content:flex-end' }, W.h('div', { class: 'mascot', html: S.tortoise() }));
      cards.append(m);
    }
    cards.querySelectorAll('.card, .tip .bubble').forEach(c => {
      c.addEventListener('click', e => {
        if (e.target.closest('.kw')) return;
        const box = c.classList.contains('bubble') ? c.parentNode : c;
        Voice.sequence([{ el: c, box, pitch: c.classList.contains('bubble') ? 1.25 : 1.05 }]);
      });
    });
  }

  function renderKeywords(ch) {
    const k = $('keywords');
    k.innerHTML = '';
    if (!ch.keywords || !ch.keywords.length) return;
    k.append(W.h('h3', {}, 'Key words'));
    const chips = W.h('div', { class: 'chips' });
    ch.keywords.forEach(kw => chips.append(W.h('button', { class: 'chip', title: kw.d }, kw.w)));
    k.append(chips);
  }

  // Read every card on the page in order
  function readAll() {
    if (!Voice.enabled) return;
    const items = [];
    document.querySelectorAll('#cards .card, #cards .tip .bubble').forEach(c => {
      const bubble = c.classList.contains('bubble');
      items.push({ el: c, box: bubble ? c.parentNode : c, pitch: bubble ? 1.25 : 1.05 });
    });
    const st = chapters[state.ci].steps[state.si];
    if (st.instruction) items.push({ text: st.instruction });
    Voice.sequence(items);
  }

  // ---------- Scene API ----------
  function makeApi(ch, st, ci, si) {
    const token = alive;
    const stage = $('stage'), controls = $('controls');
    const isAlive = () => token === alive;
    let row = null;

    const api = {
      stage, controls, chapter: ch, step: st,
      get name() { return store.name; },
      alive: isAlive,

      // Put an SVG scene into the stage
      svg(inner, viewBox = '0 0 800 520') {
        stage.insertAdjacentHTML('beforeend', `<svg viewBox="${viewBox}" xmlns="${S.NS}" preserveAspectRatio="xMidYMid meet">${inner}</svg>`);
        return stage.lastElementChild;
      },
      // Use the stage for HTML content instead
      html(markup = '') {
        stage.classList.add('html-stage');
        const d = W.h('div', { style: 'width:100%;height:100%', html: markup });
        stage.append(d);
        return d;
      },
      q: sel => stage.querySelector(sel),
      qa: sel => Array.from(stage.querySelectorAll(sel)),

      sfx: name => Sfx.play(name),
      say(text, opts = {}) { if (isAlive()) Voice.speak(plain(text), opts); },
      sayAfter(text) { if (isAlive()) Voice.sequence([{ text: plain(text) }], { interrupt: false }); },

      feedback(msg, type = 'ok', ms = 2600) {
        const fb = $('feedback');
        fb.innerHTML = msg;
        fb.className = 'show ' + type;
        clearTimeout(feedbackTimer);
        feedbackTimer = setTimeout(() => { fb.className = type; }, ms);
      },
      praise(msg) {
        if (!isAlive()) return;
        Sfx.play('success');
        let p = pick(praises);
        if (store.name && Math.random() < .4) p = p.replace('!', `, ${store.name}!`);
        api.feedback('🌟 ' + p, 'ok');
        const r = stage.getBoundingClientRect();
        W.confetti({ x: r.left + r.width / 2, y: r.top + r.height / 3, n: 45 });
        api.say(msg ? `${p} ${msg}` : p);
      },
      oops(msg = 'Not quite. Try again!') {
        if (!isAlive()) return;
        Sfx.play('oops');
        api.feedback(msg, 'oops', 3200);
        api.say(msg);
      },
      info(msg, speak = true) {
        api.feedback(msg, 'info', 3600);
        if (speak) api.say(msg);
      },
      // Award this page's star
      star() {
        const key = ch.id + ':' + si;
        if (saved.stars[key]) return;
        saved.stars[key] = 1; save();
        Sfx.play('star');
        refreshProgress();
        const d = $('step-dots').children[si];
        if (d) d.classList.add('starred');
      },

      onCleanup(fn) { cleanups.push(fn); },
      timeout(fn, ms) { const t = setTimeout(() => isAlive() && fn(), ms); cleanups.push(() => clearTimeout(t)); return t; },
      interval(fn, ms) { const t = setInterval(() => isAlive() && fn(), ms); cleanups.push(() => clearInterval(t)); return t; },
      wait(ms) { return new Promise(res => { const t = setTimeout(() => res(isAlive()), ms); cleanups.push(() => clearTimeout(t)); }); },
      tween(ms, fn, e = W.ease.inOut) { return W.tween(ms, fn, e, isAlive); },
      // Run fn(dt, elapsed) every frame until the page changes or fn returns false
      loop(fn) {
        let t0 = performance.now(), last = t0;
        const step = now => {
          if (!isAlive()) return;
          const r = fn((now - last) / 1000, (now - t0) / 1000);
          last = now;
          if (r !== false) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      },

      // Controls under the stage
      row() { row = W.h('div', { class: 'ctl-row' }); controls.append(row); return row; },
      button(label, fn, { cls = '', parent = null, sound = 'click' } = {}) {
        const p = parent || (row && row.isConnected ? row : api.row());
        const b = W.h('button', { class: 'btn ' + cls, html: label });
        b.addEventListener('click', e => { if (sound) Sfx.play(sound); fn(b, e); });
        p.append(b);
        return b;
      },
      label(textHtml, parent = null) {
        const p = parent || (row && row.isConnected ? row : api.row());
        const s = W.h('span', { class: 'label', html: textHtml });
        p.append(s);
        return s;
      },
      slider(opts) { return W.slider(opts.parent || api.row(), opts); },
      choice(opts) { const r = api.row(); return W.choice(r, opts, api); },
      dragLabels(svg, targets, opts = {}) { return W.dragLabels(svg, api.row(), targets, Object.assign({ api }, opts)); },
      draggable(svg, node, opts) { return W.svgDraggable(svg, node, opts); },
      sortGame(parent, opts) { return W.sortGame(parent, Object.assign({ api }, opts)); },
      point: (svg, e) => W.svgPoint(svg, e.clientX, e.clientY),
    };
    return api;
  }

  return {
    boot, addLesson, chapter, openLesson, home, go, next, prev, readAll, sayWord, fmt, plain, save,
    get lessons() { return lessons; },
    get lesson() { return lesson; },          // the open lesson
    get chapters() { return chapters; },      // chapters of the open lesson
    get glossary() { return glossary; },
    get saved() { return saved; },            // progress of the open lesson (seen, stars, quizScore...)
    get store() { return store; },            // everything saved: name, settings, all lessons
  };
})();
