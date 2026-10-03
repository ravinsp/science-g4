// Chapter 3: Liquids
(() => {
  // Area of a polygon (shoelace)
  const area = P => Math.abs(P.reduce((s, p, i) => { const q = P[(i + 1) % P.length]; return s + p[0] * q[1] - q[0] * p[1]; }, 0)) / 2;
  // Keep the part of a polygon below the line y = ys
  function below(P, ys) {
    const out = [];
    P.forEach((p, i) => {
      const q = P[(i + 1) % P.length], pin = p[1] >= ys, qin = q[1] >= ys;
      if (pin) out.push(p);
      if (pin !== qin) { const t = (ys - p[1]) / (q[1] - p[1]); out.push([p[0] + (q[0] - p[0]) * t, ys]); }
    });
    return out;
  }
  // Water level for volume V in polygon P (world coords)
  function levelFor(P, V) {
    let lo = Math.min(...P.map(p => p[1])), hi = Math.max(...P.map(p => p[1]));
    if (V <= 0) return hi;
    for (let i = 0; i < 30; i++) {
      const m = (lo + hi) / 2;
      if (area(below(P, m)) > V) lo = m; else hi = m;
    }
    return (lo + hi) / 2;
  }

  // Containers for the "take the shape" page: width at height t (0 = bottom, 1 = top)
  const VESSELS = [
    { id: 'beaker', name: 'beaker', H: 140, w: () => 100 },
    { id: 'conical', name: 'conical flask', H: 190, w: t => t < .72 ? 140 - 116 * t / .72 : 24 },
    { id: 'round', name: 'round flask', H: 200, w: t => { const y = t * 200; return y < 124 ? 2 * Math.sqrt(Math.max(0, 62 * 62 - (y - 62) ** 2)) : 24; } },
    { id: 'cylinder', name: 'measuring cylinder', H: 220, w: () => 40 },
  ];
  // Height (px) that holds area A in a vessel
  function vesselLevel(v, A) {
    let a = 0;
    for (let y = 0; y < v.H; y++) { a += v.w(y / v.H); if (a >= A) return y + 1; }
    return v.H;
  }
  function vesselPath(v, x, base, h) {
    const L = [], R = [];
    for (let y = 0; y <= h; y += 2) { const w = v.w(y / v.H) / 2; L.push(`${S.f1(x - w)} ${S.f1(base - y)}`); R.unshift(`${S.f1(x + w)} ${S.f1(base - y)}`); }
    return `M${L.join(' L')} L${R.join(' L')}Z`;
  }

  App.chapter({
    id: 'liquids',
    title: 'Liquids',
    icon: '🥛',
    group: 'Solids, liquids and gases',
    keywords: [
      { w: 'contains', d: 'Has something inside it.' },
      { w: 'liquid', d: 'A material that flows and takes the shape of its container, like water or milk.' },
      { w: 'juice', d: 'A drink made from fruit, like orange juice.' },
      { w: 'pool', d: 'A flat patch of liquid that has spread out on a surface.' },
    ],
    steps: [
      // ---------- a) Three glasses ----------
      {
        text: ['Each of these glasses **contains** a **liquid**.', 'Each liquid takes the shape of the glass.'],
        ask: 'Drag the labels to the right glasses.',
        activity: true,
        scene(stage, api) {
          const svg = api.svg(`
            <rect width="800" height="520" fill="#FDF8EF"/>
            <rect y="400" width="800" height="120" fill="#EADFCB"/>
            ${L4.glass({ x: 170, y: 400, w: 130, h: 200, level: .82, liquid: '#F5F2EA' })}
            ${L4.glass({ x: 400, y: 400, w: 120, h: 150, level: .7, liquid: '#CFEAF7' })}
            ${L4.glass({ x: 630, y: 400, w: 96, h: 250, level: .84, liquid: '#FF9800' })}`);
          api.dragLabels(svg, [
            { id: 'milk', label: 'milk', x: 170, y: 300, lx: 170, ly: 450 },
            { id: 'water', label: 'water', x: 400, y: 340, lx: 400, ly: 450 },
            { id: 'juice', label: 'orange juice', x: 630, y: 280, lx: 630, ly: 450 },
          ], {
            radius: 80,
            onDone: () => {
              api.star();
              api.sayAfter('Milk, water and orange juice are all liquids. Each one takes the shape of its glass.');
            },
          });
        },
      },

      // ---------- b) Pouring juice ----------
      {
        text: [
          'Liquids can be poured.',
          'The **juice** in the jug is being poured into the glass. The juice changes shape.',
          'Now the juice takes the shape of the glass, not the jug.',
        ],
        ask: 'Drag the jug up to tip it. Fill the glass with juice.',
        activity: true,
        scene(stage, api) {
          const JP = [[340, 46], [362, 60], [362, 292], [372, 302], [490, 302], [500, 292], [500, 50]];
          const PV = { x: 350, y: 60 };
          const jugD = `M${JP.map(p => p.join(' ')).join(' L')}`;
          const svg = api.svg(`
            <clipPath id="l4-liq2-clip"><path id="l4-liq2-clipP" d="${jugD}Z"/></clipPath>
            <rect width="800" height="520" fill="#FFF6EC"/>
            <rect y="440" width="800" height="80" fill="#F0DCC0"/>
            <path id="l4-liq2-pool" d="" fill="#FF9800" opacity=".9"/>
            <path id="l4-liq2-stream" d="" stroke="#FF9800" stroke-width="8" fill="none" stroke-linecap="round"/>
            ${L4.glass({ x: 315, y: 440, w: 104, h: 130, level: 0, liquid: '#FF9800', id: 'l4-liq2-g' })}
            <rect id="l4-liq2-juice" x="0" y="0" width="800" height="520" fill="#FF9800" clip-path="url(#l4-liq2-clip)"/>
            <g id="l4-liq2-jug" class="hot" transform="rotate(0 ${PV.x} ${PV.y})">
              <path d="M500 100 C566 100 566 250 500 250" stroke="#B0BEC5" stroke-width="16" fill="none" stroke-linecap="round"/>
              <path d="${jugD}" fill="url(#g-glass)" stroke="#7A93A6" stroke-width="4" stroke-linejoin="round"/>
              <path d="M378 90 L378 270" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".5"/>
              <rect x="340" y="40" width="230" height="270" fill="#fff" opacity="0"/>
            </g>
            <text id="l4-liq2-hint" x="600" y="360" text-anchor="middle" font-size="18" font-weight="800" fill="#B85C00" class="blink-hint">👆 Drag the jug up</text>`);
          const jugG = S.q(svg, '#l4-liq2-jug'), clipP = S.q(svg, '#l4-liq2-clipP'), juice = S.q(svg, '#l4-liq2-juice');
          const stream = S.q(svg, '#l4-liq2-stream'), gl = S.q(svg, '[data-liq="l4-liq2-g"]'), pool = S.q(svg, '#l4-liq2-pool');
          const rot = (p, a) => {
            const c = Math.cos(a), s = Math.sin(a), dx = p[0] - PV.x, dy = p[1] - PV.y;
            return [PV.x + dx * c - dy * s, PV.y + dx * s + dy * c];
          };
          let ang = 0, V = area(JP) * .62, glassA = 0, spilt = 0, starred = false, spillTold = false;
          const GCAP = 104 * .9 * 130 * .94;
          api.loop(dt => {
            const a = ang * Math.PI / 180;
            const W2 = JP.map(p => rot(p, a));
            const spout = W2[0];
            const maxV = area(below(W2, spout[1]));
            let flow = 0;
            if (V > maxV + 1) { flow = Math.min(V - maxV, 9000 * dt); V -= flow; }
            const ys = levelFor(W2, V);
            jugG.setAttribute('transform', `rotate(${S.f1(ang)} ${PV.x} ${PV.y})`);
            clipP.setAttribute('transform', `rotate(${S.f1(ang)} ${PV.x} ${PV.y})`);
            juice.setAttribute('y', S.f1(ys));
            if (flow > 0) {
              const top = 440 - 130 * Math.min(.94, glassA / GCAP * .94);
              stream.setAttribute('d', `M${S.f1(spout[0])} ${S.f1(spout[1])} Q${S.f1(spout[0] - 8)} ${S.f1(spout[1] + 20)} ${S.f1(spout[0] - 10)} ${S.f1(top)}`);
              stream.setAttribute('stroke-width', S.f1(Math.min(12, 3 + flow / dt / 1000)));
              if (Math.random() < dt * 4) api.sfx('pour');
              glassA += flow;
              if (glassA > GCAP) { spilt += glassA - GCAP; glassA = GCAP; }
              gl.setAttribute('d', L4.glassLiquidD(315, 440, 104, 130, glassA / GCAP));
              if (spilt > 0) {
                const rx = 20 + Math.sqrt(spilt) * 1.6;
                pool.setAttribute('d', L4.blob(330, 452, Math.min(rx, 300), Math.min(10 + rx * .08, 26), 6, 10, .15));
              }
            } else stream.setAttribute('d', '');
            if (!starred && glassA / GCAP > .75) {
              starred = true;
              api.star();
              api.praise('The juice changed shape. Now it takes the shape of the glass, not the jug.');
            }
            if (spilt > 400 && !spillTold) {
              spillTold = true;
              api.timeout(() => api.say('Oops! The glass is full. The juice spills and spreads out on the table.'), 1500);
            }
          });
          let grab = null;
          W.pointerDrag(jugG, {
            onStart: e => { grab = { y: api.point(svg, e).y, a: ang }; api.sfx('pick'); const h = S.q(svg, '#l4-liq2-hint'); if (h) h.remove(); },
            onMove: e => { ang = S.clamp(grab.a + (api.point(svg, e).y - grab.y) * .55, -105, 0); },
            onEnd: () => {},
          });
          api.button('↩ Stand the jug up', () => { ang = 0; });
        },
      },

      // ---------- c) A pool ----------
      {
        text: ['Juice that does not go into the glass spreads out and makes a **pool**.'],
        ask: 'Click the table to spill some juice. Watch what it does.',
        activity: true,
        scene(stage, api) {
          const svg = api.svg(`
            <rect width="800" height="520" fill="#FFF6EC"/>
            <path d="M60 170 L740 170 L800 520 L0 520Z" fill="#E8C9A0" stroke="#B98B55" stroke-width="4"/>
            <path d="M100 230 L700 230 M80 330 L720 330 M50 430 L750 430" stroke="#D9B585" stroke-width="3" opacity=".5"/>
            <g id="l4-liq3-pools"></g>
            <rect id="l4-liq3-hit" x="0" y="170" width="800" height="350" fill="#fff" opacity="0" class="hot"/>
            <g id="l4-liq3-cup" transform="translate(-100 -100)">
              <path d="M-26 -60 L26 -60 L20 0 L-20 0Z" fill="#E3F2FD" stroke="#7A93A6" stroke-width="3"/><path d="M-22 -44 L22 -44 L20 -2 L-20 -2Z" fill="#FF9800"/></g>
            <g transform="translate(20 20)"><rect width="200" height="44" rx="22" fill="#fff" opacity=".92"/>
              ${S.text(100, 29, '🍊 Spills: ', { size: 19 }).replace('</text>', '<tspan id="l4-liq3-n">0</tspan> of 3</text>')}</g>`);
          const pools = S.q(svg, '#l4-liq3-pools'), cup = S.q(svg, '#l4-liq3-cup');
          let n = 0, busy = false;
          S.q(svg, '#l4-liq3-hit').addEventListener('click', async e => {
            if (busy) return;
            busy = true;
            const p = api.point(svg, e), seed = n + 3;
            cup.setAttribute('transform', `translate(${S.f1(p.x)} ${S.f1(p.y - 60)}) rotate(-70)`);
            api.sfx('pour');
            const path = S.el('path', { fill: '#FF9800', opacity: .92 }, pools);
            const shine = S.el('ellipse', { fill: '#fff', opacity: .35 }, pools);
            const persp = .3 + (p.y - 170) / 350 * .25;   // flatter far away
            await api.tween(1800, k => {
              const rx = 10 + 80 * k;
              path.setAttribute('d', L4.blob(p.x, p.y, rx, rx * persp + 4, seed, 10, .22));
              shine.setAttribute('cx', S.f1(p.x - rx * .3)); shine.setAttribute('cy', S.f1(p.y - rx * persp * .3));
              shine.setAttribute('rx', S.f1(rx * .25)); shine.setAttribute('ry', S.f1(rx * persp * .12 + 1));
            }, W.ease.out);
            if (!api.alive()) return;
            cup.setAttribute('transform', 'translate(-100 -100)');
            n++;
            S.q(svg, '#l4-liq3-n').textContent = Math.min(n, 3);
            busy = false;
            if (n < 3) api.say('The juice spreads out flat. It makes a pool.');
            else if (n === 3) {
              api.choice({
                q: 'What does spilt juice make?', options: ['A pool', 'A tall tower', 'A cube'], correct: 0,
                explain: 'A liquid spreads out and makes a flat pool.',
                onRight: () => api.star(),
              });
            }
          });
        },
      },

      // ---------- d) Different containers ----------
      {
        text: [
          'Liquids change their shape. They take the shape of their containers.',
          'Scientists put liquids in lots of different containers.',
        ],
        ask: 'Click each container to pour the liquid into it. Which one is a beaker?',
        activity: true,
        scene(stage, api) {
          const XS = [130, 310, 490, 670], BASE = 430, A = 4600;
          const svg = api.svg(`
            <rect width="800" height="520" fill="#F3F7FB"/>
            <rect y="430" width="800" height="90" fill="#DCE6EE"/>
            <path id="l4-liq4-stream" d="" stroke="#8E24AA" stroke-width="8" fill="none" stroke-linecap="round"/>
            ${VESSELS.map((v, i) => `<g data-v="${i}" class="hot">
              <rect x="${XS[i] - 85}" y="${BASE - v.H - 20}" width="170" height="${v.H + 30}" fill="#fff" opacity="0"/>
              <path class="l4-liq4-liq" d="" fill="#AB47BC" opacity=".9"/>
              <path d="${vesselPath(v, XS[i], BASE, v.H)}" fill="url(#g-glass)" stroke="#5E7C90" stroke-width="3.5" stroke-linejoin="round"/>
              ${S.text(XS[i], 470, 'ABCD'[i], { size: 26, fill: '#3B3F6B' })}
              <g class="l4-liq4-name"></g></g>`).join('')}`);
          const liqs = S.qa(svg, '.l4-liq4-liq'), stream = S.q(svg, '#l4-liq4-stream');
          const draw = (i, a) => { liqs[i].setAttribute('d', a > 10 ? vesselPath(VESSELS[i], XS[i], BASE - 2, vesselLevel(VESSELS[i], a)) : ''); };
          let cur = 0, busy = false, asked = false;
          const seen = new Set([0]);
          draw(0, A);
          svg.addEventListener('click', async e => {
            const g = e.target.closest('[data-v]');
            if (!g || busy) return;
            const to = +g.dataset.v;
            if (to === cur) { api.say('The liquid is already in this one.'); return; }
            busy = true;
            api.sfx('pour');
            const from = cur, vf = VESSELS[from], vt = VESSELS[to];
            await api.tween(1400, k => {
              draw(from, A * (1 - k)); draw(to, A * k);
              const x1 = XS[from], y1 = BASE - vf.H - 10, x2 = XS[to], y2 = BASE - vesselLevel(vt, A * k) - 4;
              stream.setAttribute('d', k < .95 ? `M${x1} ${y1} Q${(x1 + x2) / 2} ${Math.min(y1, BASE - vt.H) - 90} ${x2} ${y2}` : '');
            }, W.ease.inOut);
            if (!api.alive()) return;
            stream.setAttribute('d', '');
            cur = to; seen.add(to); busy = false;
            api.say(`Same liquid, new shape! It takes the shape of the ${vt.name}.`);
            if (seen.size >= 3 && !asked) {
              asked = true;
              api.choice({
                q: 'Which one is a beaker?', options: ['A', 'B', 'C', 'D'], correct: 0,
                hints: { 1: 'That is a conical flask. A beaker has straight sides.', 2: 'That is a round flask. A beaker has straight sides.', 3: 'That is a measuring cylinder. A beaker is wider.' },
                explain: 'A beaker is like a cup with straight sides and a lip for pouring.',
                onRight: () => {
                  api.star();
                  VESSELS.forEach((v, i) => { S.q(svg, `[data-v="${i}"] .l4-liq4-name`).innerHTML = `<g class="fade-in">${S.text(XS[i], 502, v.name, { size: 16, fill: '#6E665A' })}</g>`; });
                },
              });
            }
          });
        },
      },

      // ---------- e) Liquids flow ----------
      {
        text: [
          'Liquids can flow. This liquid is not in a container. It is difficult to hold.',
          'This liquid flows from one hand to the other. Some liquids flow faster than others.',
        ],
        ask: 'Pour water from one hand to the other. Then try honey. Which flows faster?',
        activity: true,
        scene(stage, api) {
          // Cupped hand, palm up, coming in from the right
          const hand = (x, y) => `<g transform="translate(${x} ${y})">
            <path d="M190 -2 L80 2 Q20 14 -50 10 Q-104 4 -114 -28 Q-116 -50 -98 -48 Q-90 -32 -70 -28 Q-10 -24 30 -40 Q60 -54 190 -60Z" fill="#E9A87C" stroke="#B5703F" stroke-width="3" stroke-linejoin="round"/>
            <path d="M-108 -22 Q-80 -4 -40 -2 M-96 -8 Q-70 6 -30 6" stroke="#B5703F" stroke-width="2" fill="none" opacity=".6"/>
            <path d="M28 -40 Q22 -84 -4 -88 Q-22 -86 -12 -68 Q6 -60 6 -34Z" fill="#E9A87C" stroke="#B5703F" stroke-width="3" stroke-linejoin="round"/>
            <rect x="180" y="-66" width="150" height="72" rx="10" fill="#1E5AA8"/></g>`;
          const svg = api.svg(`
            <rect width="800" height="520" fill="#FF9F2E"/>
            <rect x="0" y="0" width="800" height="520" fill="#FFB74D" opacity=".4"/>
            <g id="l4-liq5-drips"></g>
            <path id="l4-liq5-top" d="" fill="#4FC3F7"/>
            ${hand(470, 166)}
            <path id="l4-liq5-bot" d="" fill="#4FC3F7"/>
            ${hand(470, 426)}
            <g transform="translate(20 20)"><rect width="250" height="44" rx="22" fill="#fff" opacity=".92"/>
              <text x="125" y="29" text-anchor="middle" font-size="19" font-weight="800" fill="#2B2A28">⏱ Time: <tspan id="l4-liq5-t">0.0</tspan> s</text></g>
            <g id="l4-liq5-res" transform="translate(560 30)"></g>`);
          const top = S.q(svg, '#l4-liq5-top'), bot = S.q(svg, '#l4-liq5-bot'), drips = S.q(svg, '#l4-liq5-drips'), tT = S.q(svg, '#l4-liq5-t'), res = S.q(svg, '#l4-liq5-res');
          const results = {};
          let busy = false;
          const pour = async (name, col, secs) => {
            if (busy) return;
            busy = true;
            [top, bot].forEach(p => p.setAttribute('fill', col));
            drips.innerHTML = '';
            const ms = secs * 1000;
            api.sfx('pour');
            await api.tween(ms, (k, raw) => {
              top.setAttribute('d', raw < 1 ? L4.blob(450, 130, 70 * (1 - raw) + 4, 14 * (1 - raw) + 2, 2, 8, .1) : '');
              bot.setAttribute('d', L4.blob(450, 392, 70 * raw + 4, 12 * raw + 2, 3, 8, .1));
              const w = raw < .97 ? (secs < 3 ? 9 : 3.5) * (1 - raw * .5) : 0;
              drips.innerHTML = w ? `<path d="M${S.f1(436 + Math.sin(raw * 30) * 2)} 150 Q440 270 ${S.f1(438 + Math.sin(raw * 25) * 3)} 390" stroke="${col}" stroke-width="${S.f1(w)}" fill="none" stroke-linecap="round"/>
                ${secs > 3 ? `<path d="M468 150 Q470 260 466 380" stroke="${col}" stroke-width="2.5" fill="none"/>` : ''}` : '';
              tT.textContent = (raw * secs).toFixed(1);
            }, W.ease.linear);
            if (!api.alive()) return;
            results[name] = secs;
            res.innerHTML = Object.entries(results).map(([n, s], i) => `<g class="pop-in">${L4.pill(100, i * 46, `${n}: ${s} seconds`, { size: 17, fill: '#fff' })}</g>`).join('');
            busy = false;
            api.say(name === 'water' ? `The water flowed through in ${secs} seconds.` : `The honey took ${secs} seconds. It flows very slowly!`);
            if (results.water && results.honey) {
              api.choice({
                q: 'Which liquid flows faster?', options: ['💧 Water', '🍯 Honey'], correct: 0,
                explain: 'Water flows faster than honey. Some liquids flow faster than others.',
                onRight: () => api.star(),
              });
            }
          };
          api.button('💧 Pour water', b => { pour('water', '#4FC3F7', 1.5); b.disabled = true; }, { cls: 'primary' });
          api.button('🍯 Pour honey', b => { pour('honey', '#F2A922', 7); b.disabled = true; }, { cls: 'primary' });
        },
      },

      // ---------- f) Cannot be compressed easily ----------
      {
        text: ['Liquids cannot be compressed easily.'],
        ask: 'This syringe is full of water. The end is blocked. Push the plunger hard!',
        activity: true,
        scene(stage, api) {
          const svg = api.svg(`
            <rect width="800" height="520" fill="#EEF7FB"/>
            <rect x="150" y="200" width="420" height="110" rx="10" fill="url(#g-glass)" stroke="#5E7C90" stroke-width="4"/>
            <rect id="l4-liq6-water" x="154" y="206" width="400" height="98" rx="6" fill="#4FC3F7" opacity=".85"/>
            ${[...Array(9)].map((_, i) => `<path d="M${190 + i * 40} 200 l0 ${i % 2 ? 14 : 24}" stroke="#3B3F6B" stroke-width="2"/>`).join('')}
            <rect x="110" y="236" width="44" height="38" rx="6" fill="#B0BEC5" stroke="#607D8B" stroke-width="3"/>
            <rect x="80" y="226" width="34" height="58" rx="8" fill="#E53935" stroke="#8E1B1B" stroke-width="3"/>
            ${S.text(98, 330, 'blocked', { size: 16, fill: '#8E1B1B' })}
            <g id="l4-liq6-plunger" class="hot" transform="translate(0 0)">
              <rect x="554" y="212" width="20" height="86" rx="4" fill="#455A64"/>
              <rect x="570" y="244" width="150" height="22" fill="#90A4AE" stroke="#607D8B" stroke-width="2"/>
              <rect x="716" y="200" width="24" height="110" rx="8" fill="#78909C" stroke="#455A64" stroke-width="3"/>
              <rect x="540" y="190" width="220" height="130" fill="#fff" opacity="0"/>
            </g>
            <text id="l4-liq6-hint" x="730" y="350" text-anchor="middle" font-size="18" font-weight="800" fill="#4A2D8A" class="blink-hint">👈 Push</text>
            <g transform="translate(400 420)"><rect x="-200" y="-34" width="400" height="68" rx="16" fill="#fff" stroke="#3B3F6B" stroke-width="2"/>
              <text x="-180" y="-6" font-size="18" font-weight="800" fill="#3B3F6B">Push force</text>
              <rect x="-180" y="6" width="360" height="16" rx="8" fill="#EADFCB"/><rect id="l4-liq6-bar" x="-180" y="6" width="0" height="16" rx="8" fill="#E8833A"/></g>`);
          const pl = S.q(svg, '#l4-liq6-plunger'), bar = S.q(svg, '#l4-liq6-bar'), water = S.q(svg, '#l4-liq6-water');
          let grab = null, best = 0, done = false;
          const set = force => {
            const move = force * 6;   // water hardly moves
            pl.setAttribute('transform', `translate(${S.f1(-move)} 0)`);
            water.setAttribute('width', S.f1(400 - move));
            bar.setAttribute('width', S.f1(force * 360));
          };
          W.pointerDrag(pl, {
            onStart: e => { grab = api.point(svg, e).x; api.sfx('pick'); const h = S.q(svg, '#l4-liq6-hint'); if (h) h.remove(); },
            onMove: e => {
              const f = S.clamp((grab - api.point(svg, e).x) / 260);
              set(f);
              if (f > best + .2) { best = f; api.sfx('tick'); }
              if (f > .9 && !done) {
                done = true;
                api.star();
                api.praise('You pushed really hard, but the water hardly moved. Liquids cannot be compressed easily.');
              }
            },
            onEnd: async () => {
              const from = +bar.getAttribute('width') / 360;
              await api.tween(300, k => set(from * (1 - k)));
            },
          });
        },
      },
    ],
  });
})();
