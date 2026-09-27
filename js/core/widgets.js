// Reusable interactive pieces used by the chapter scenes.
const W = (() => {
  const ease = {
    linear: t => t,
    out: t => 1 - Math.pow(1 - t, 3),
    inOut: t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    back: t => { const c = 1.7; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); },
    bounce: t => {
      const n = 7.5625, d = 2.75;
      if (t < 1 / d) return n * t * t;
      if (t < 2 / d) return n * (t -= 1.5 / d) * t + .75;
      if (t < 2.5 / d) return n * (t -= 2.25 / d) * t + .9375;
      return n * (t -= 2.625 / d) * t + .984375;
    },
  };

  // Client (mouse) position -> SVG user units
  function svgPoint(svg, clientX, clientY) {
    const p = svg.createSVGPoint();
    p.x = clientX; p.y = clientY;
    const m = svg.getScreenCTM();
    return m ? p.matrixTransform(m.inverse()) : { x: 0, y: 0 };
  }

  function h(tag, attrs = {}, ...kids) {
    const e = document.createElement(tag);
    for (const k in attrs) {
      if (k === 'class') e.className = attrs[k];
      else if (k === 'html') e.innerHTML = attrs[k];
      else if (k.startsWith('on')) e.addEventListener(k.slice(2), attrs[k]);
      else e.setAttribute(k, attrs[k]);
    }
    kids.flat().forEach(c => c != null && e.append(c.nodeType ? c : document.createTextNode(c)));
    return e;
  }

  // ---------- Confetti (leaves and petals) ----------
  const fx = { canvas: null, ctx: null, parts: [], running: false };
  function confetti({ x = innerWidth / 2, y = innerHeight / 3, n = 70 } = {}) {
    if (!fx.canvas) {
      fx.canvas = document.getElementById('fx');
      fx.ctx = fx.canvas.getContext('2d');
    }
    fx.canvas.width = innerWidth; fx.canvas.height = innerHeight;
    const cols = ['#4CAF50', '#8BC34A', '#FFC93C', '#F06292', '#FF8A65', '#4FC3F7', '#BA68C8'];
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, sp = 4 + Math.random() * 9;
      fx.parts.push({
        x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 6,
        r: 5 + Math.random() * 6, rot: Math.random() * 6, vr: (Math.random() - .5) * .3,
        c: cols[i % cols.length], leaf: Math.random() < .5, life: 1,
      });
    }
    if (!fx.running) { fx.running = true; requestAnimationFrame(tick); }
  }
  function tick() {
    const c = fx.ctx;
    c.clearRect(0, 0, fx.canvas.width, fx.canvas.height);
    fx.parts = fx.parts.filter(p => p.life > 0 && p.y < fx.canvas.height + 30);
    fx.parts.forEach(p => {
      p.vy += .25; p.vx *= .985; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life -= .006;
      c.save(); c.translate(p.x, p.y); c.rotate(p.rot); c.globalAlpha = Math.min(1, p.life * 2);
      c.fillStyle = p.c;
      c.beginPath();
      if (p.leaf) { c.ellipse(0, 0, p.r * 1.4, p.r * .6, 0, 0, Math.PI * 2); }
      else { c.arc(0, 0, p.r * .7, 0, Math.PI * 2); }
      c.fill(); c.restore();
    });
    if (fx.parts.length) requestAnimationFrame(tick);
    else { fx.running = false; c.clearRect(0, 0, fx.canvas.width, fx.canvas.height); }
  }

  // ---------- Generic pointer drag ----------
  // Calls onStart/onMove/onEnd with client coordinates.
  function pointerDrag(el, { onStart, onMove, onEnd } = {}) {
    let active = false;
    const down = e => {
      if (e.button != null && e.button !== 0) return;
      active = true;
      e.preventDefault();
      // Start first: onStart may move the node in the DOM, which would drop the capture
      onStart && onStart(e);
      el.setPointerCapture && el.setPointerCapture(e.pointerId);
    };
    const move = e => { if (active) onMove && onMove(e); };
    const up = e => { if (!active) return; active = false; onEnd && onEnd(e); };
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    el.style.touchAction = 'none';
  }

  // Drag an SVG element around inside its SVG (uses a translate on the element).
  // opts.onDrop(pos) may return true to accept, false to snap back.
  function svgDraggable(svg, node, { onStart, onMove, onDrop, snapBack = true, bounds = null } = {}) {
    let start = null, base = { x: 0, y: 0 }, cur = { x: 0, y: 0 };
    const t0 = node.getAttribute('transform') || '';
    const m = /translate\(\s*([-\d.]+)[ ,]+([-\d.]+)\s*\)/.exec(t0);
    if (m) base = { x: +m[1], y: +m[2] };
    const rest = t0.replace(/translate\([^)]*\)/, '').trim();
    const setPos = (x, y) => { cur = { x, y }; node.setAttribute('transform', `translate(${x} ${y}) ${rest}`); };
    cur = { ...base };
    node.style.cursor = 'grab';
    pointerDrag(node, {
      onStart: e => {
        const p = svgPoint(svg, e.clientX, e.clientY);
        start = { px: p.x, py: p.y, x: cur.x, y: cur.y };
        node.style.cursor = 'grabbing';
        node.parentNode.appendChild(node);
        onStart && onStart(cur);
      },
      onMove: e => {
        const p = svgPoint(svg, e.clientX, e.clientY);
        let x = start.x + p.x - start.px, y = start.y + p.y - start.py;
        if (bounds) { x = Math.max(bounds.x1, Math.min(bounds.x2, x)); y = Math.max(bounds.y1, Math.min(bounds.y2, y)); }
        setPos(x, y);
        onMove && onMove(cur);
      },
      onEnd: () => {
        node.style.cursor = 'grab';
        const ok = onDrop ? onDrop(cur) : true;
        if (ok === false && snapBack) animateTo(start.x, start.y);
      },
    });
    function animateTo(x, y, ms = 300) {
      const from = { ...cur };
      return tween(ms, k => setPos(from.x + (x - from.x) * k, from.y + (y - from.y) * k), ease.out);
    }
    return { setPos, animateTo, get pos() { return cur; }, home: () => animateTo(base.x, base.y) };
  }

  // Simple tween helper; returns a promise. `alive` lets scenes stop animations on exit.
  function tween(ms, fn, e = ease.inOut, alive = () => true) {
    return new Promise(res => {
      const t0 = performance.now();
      const step = now => {
        if (!alive()) return res(false);
        const k = Math.min(1, (now - t0) / ms);
        fn(e(k), k);
        if (k < 1) requestAnimationFrame(step); else res(true);
      };
      requestAnimationFrame(step);
    });
  }

  // ---------- Multiple choice ----------
  // opts: { q, options:[...], correct: index | [indexes], hints: {i: 'hint'}, explain, onRight, onWrong, speak }
  function choice(parent, opts, api) {
    const correct = Array.isArray(opts.correct) ? opts.correct : [opts.correct];
    const box = h('div', { class: 'choice' });
    if (opts.q) box.append(h('div', { class: 'q' }, opts.q));
    const row = h('div', { class: 'opts' });
    let solved = false;
    opts.options.forEach((label, i) => {
      const b = h('button', { class: 'opt', html: label });
      b.addEventListener('click', () => {
        if (solved) return;
        if (correct.includes(i)) {
          solved = true;
          b.classList.add('right');
          row.querySelectorAll('.opt').forEach(o => o.disabled = true);
          api && api.praise(opts.explain);
          opts.onRight && opts.onRight(i);
        } else {
          b.classList.remove('wrong'); void b.offsetWidth; b.classList.add('wrong');
          const hint = (opts.hints && opts.hints[i]) || opts.hint || 'Not quite. Try again!';
          api && api.oops(hint);
          opts.onWrong && opts.onWrong(i);
        }
      });
      row.append(b);
    });
    box.append(row);
    parent.append(box);
    if (opts.speak && api) api.say(opts.q);
    return box;
  }

  // ---------- Slider ----------
  // opts: { label, min, max, step, value, format(v), onInput(v), ticks: ['a','b'] }
  function slider(parent, opts) {
    const wrap = h('div', { class: 'slider' });
    const lab = opts.label ? h('span', { class: 's-label' }, opts.label) : null;
    const input = h('input', { type: 'range', min: opts.min ?? 0, max: opts.max ?? 100, step: opts.step ?? 1, value: opts.value ?? 0 });
    const val = h('span', { class: 's-value' });
    const fmt = opts.format || (v => v);
    const upd = (fire = true) => {
      const v = +input.value;
      val.innerHTML = fmt(v);
      if (fire && opts.onInput) opts.onInput(v);
    };
    let last = input.value;
    input.addEventListener('input', () => {
      if (input.value !== last) { Sfx.play('tick'); last = input.value; }
      upd();
    });
    if (opts.onChange) input.addEventListener('change', () => opts.onChange(+input.value));
    if (lab) wrap.append(lab);
    wrap.append(input, val);
    parent.append(wrap);
    upd(opts.fireInitial !== false);
    return {
      el: wrap, input,
      get value() { return +input.value; },
      set value(v) { input.value = v; last = input.value; upd(); },
    };
  }

  // ---------- Drag labels onto an SVG diagram ----------
  // targets: [{ id, label, x, y, lx, ly }] (x,y = hotspot; lx,ly = where the label box sits)
  function dragLabels(svg, bankParent, targets, { onPlace, onDone, radius = 60, api } = {}) {
    const layer = S.el('g', { class: 'label-layer' }, svg);
    const rings = {};
    targets.forEach(t => {
      rings[t.id] = S.el('circle', { cx: t.x, cy: t.y, r: 13, class: 'target-ring' }, layer);
    });
    const bank = h('div', { class: 'bank' });
    bankParent.append(bank);
    const shuffled = targets.slice().sort(() => Math.random() - .5);
    let placed = 0;
    shuffled.forEach(t => {
      const chip = h('div', { class: 'drag-chip' }, t.label);
      bank.append(chip);
      let ghost = null, off = { x: 0, y: 0 };
      pointerDrag(chip, {
        onStart: e => {
          if (chip.classList.contains('placed')) return;
          Sfx.play('pick');
          if (api) api.say(t.label, { interrupt: true });
          const r = chip.getBoundingClientRect();
          off = { x: e.clientX - r.left, y: e.clientY - r.top };
          ghost = chip.cloneNode(true);
          ghost.classList.add('dragging');
          ghost.style.left = r.left + 'px'; ghost.style.top = r.top + 'px';
          document.body.append(ghost);
          chip.style.opacity = .3;
        },
        onMove: e => {
          if (!ghost) return;
          ghost.style.left = (e.clientX - off.x) + 'px';
          ghost.style.top = (e.clientY - off.y) + 'px';
        },
        onEnd: e => {
          if (!ghost) return;
          ghost.remove(); ghost = null;
          chip.style.opacity = '';
          const p = svgPoint(svg, e.clientX, e.clientY);
          // Which open target is nearest to the drop point?
          let best = null, bd = Infinity;
          targets.forEach(tt => {
            if (tt._done) return;
            const d = Math.hypot(tt.x - p.x, tt.y - p.y);
            const d2 = tt.lx != null ? Math.hypot(tt.lx - p.x, tt.ly - p.y) : Infinity;
            const dd = Math.min(d, d2);
            if (dd < bd) { bd = dd; best = tt; }
          });
          if (best && bd < radius) {
            if (best.id === t.id) {
              t._done = true;
              chip.classList.add('placed');
              rings[t.id].remove();
              const lx = t.lx != null ? t.lx : t.x, ly = t.ly != null ? t.ly : t.y - 40;
              layer.insertAdjacentHTML('beforeend', S.callout({ x: t.x, y: t.y, tx: lx, ty: ly, text: t.label, cls: 'callout pop-in' }));
              placed++;
              Sfx.play('drop');
              onPlace && onPlace(t);
              if (placed === targets.length) {
                api && api.praise(t.doneMsg);
                onDone && onDone();
              } else {
                Sfx.play('pop');
                api && api.feedback('✔ ' + t.label, 'ok');
              }
            } else {
              api && api.oops(`That is not the ${t.label}. Try another place!`);
            }
          } else if (best) {
            Sfx.play('drop');
          }
        },
      });
    });
    return { bank, layer };
  }

  // ---------- Sorting game ----------
  // bins: [{ id, title }], items: [{ id, bin, svg, label, say }]
  function sortGame(parent, { bins, items, cols = null, onDone, onDrop, api, sayItem = true, check = true }) {
    const root = h('div', { class: 'sort' });
    const pool = h('div', { class: 'sort-items' });
    const binWrap = h('div', { class: 'sort-bins' });
    binWrap.style.gridTemplateColumns = `repeat(${cols || bins.length}, 1fr)`;
    const binEls = {};
    bins.forEach(b => {
      const el = h('div', { class: 'sort-bin' }, h('h4', { html: b.title }), h('div', { class: 'bin-items' }));
      el.dataset.bin = b.id;
      binEls[b.id] = el;
      binWrap.append(el);
    });
    let done = 0;
    items.slice().sort(() => Math.random() - .5).forEach(it => {
      const card = h('div', { class: 'sort-card', html: `${it.svg || ''}${it.label ? `<div>${it.label}</div>` : ''}` });
      pool.append(card);
      let ghost = null, off = null;
      pointerDrag(card, {
        onStart: e => {
          if (card.classList.contains('ok')) return;
          Sfx.play('pick');
          if (sayItem && api && (it.say || it.label)) api.say(it.say || it.label);
          const r = card.getBoundingClientRect();
          off = { x: e.clientX - r.left, y: e.clientY - r.top };
          ghost = card.cloneNode(true);
          ghost.classList.add('dragging');
          ghost.style.left = r.left + 'px'; ghost.style.top = r.top + 'px'; ghost.style.width = r.width + 'px';
          document.body.append(ghost);
          card.style.opacity = .3;
        },
        onMove: e => {
          if (!ghost) return;
          ghost.style.left = (e.clientX - off.x) + 'px';
          ghost.style.top = (e.clientY - off.y) + 'px';
          Object.values(binEls).forEach(b => {
            const r = b.getBoundingClientRect();
            b.classList.toggle('over', e.clientX > r.left && e.clientX < r.right && e.clientY > r.top && e.clientY < r.bottom);
          });
        },
        onEnd: e => {
          if (!ghost) return;
          ghost.remove(); ghost = null;
          card.style.opacity = '';
          let target = null;
          Object.values(binEls).forEach(b => {
            b.classList.remove('over');
            const r = b.getBoundingClientRect();
            if (e.clientX > r.left && e.clientX < r.right && e.clientY > r.top && e.clientY < r.bottom) target = b;
          });
          if (!target) return;
          const binId = target.dataset.bin;
          if (!check || binId === it.bin) {
            target.querySelector('.bin-items').append(card);
            if (check) card.classList.add('ok');
            Sfx.play('drop');
            onDrop && onDrop(it, binId);
            if (!check) return;
            done++;
            if (check && done === items.length) { api && api.praise(); onDone && onDone(); }
            else if (check) api && api.feedback('✔ Good sorting!', 'ok');
          } else {
            card.classList.remove('bad'); void card.offsetWidth; card.classList.add('bad');
            api && api.oops(it.hint || 'Look again carefully!');
          }
        },
      });
    });
    root.append(pool, binWrap);
    parent.append(root);
    return { root, pool, bins: binEls };
  }

  return { ease, svgPoint, h, confetti, pointerDrag, svgDraggable, tween, choice, slider, dragLabels, sortGame };
})();
