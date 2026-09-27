// Chapter 4: Stems and trunks
(() => {
  if (!document.getElementById('stm-style')) {
    const st = document.createElement('style');
    st.id = 'stm-style';
    st.textContent = `
      .stm-flow-rev { stroke-dasharray: 8 12; animation: flow 1s linear infinite reverse; }
      .stm-tag { pointer-events: none; }
    `;
    document.head.append(st);
  }

  const SOIL = 340, X = 400;

  // Point on a quadratic curve
  const quad = (a, c, b, t) => (1 - t) * (1 - t) * a + 2 * (1 - t) * t * c + t * t * b;

  // A tomato leaf: a stalk with toothed leaflets. side 1 = right, -1 = left.
  function compoundLeaf(sx, sy, side, len) {
    const ex = sx + side * len, ey = sy - len * .22;
    const cx = sx + side * len * .5, cy = sy - len * .42;
    let s = `<path d="M${sx} ${sy} Q${cx} ${cy} ${ex} ${ey}" stroke="#3E8B37" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
    const dir = side > 0 ? -18 : -162;
    const k = len / 90;
    [.4, .72].forEach(t => {
      const px = quad(sx, cx, ex, t), py = quad(sy, cy, ey, t);
      s += S.leaf({ x: px, y: py, angle: dir - 62 * side, L: 30 * k, W: 11 * k, shape: 'toothed', color: '#4E9F3D', stalk: 2 });
      s += S.leaf({ x: px, y: py, angle: dir + 62 * side, L: 27 * k, W: 10 * k, shape: 'toothed', color: '#57A845', stalk: 2 });
    });
    s += S.leaf({ x: ex, y: ey, angle: dir, L: 32 * k, W: 12 * k, shape: 'toothed', color: '#4E9F3D', stalk: 2 });
    return { mk: s, path: `M${sx} ${sy} Q${cx} ${cy} ${ex} ${ey}` };
  }

  const tomatoFruit = (x, y, r = 15) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#E53935" stroke="#B71C1C" stroke-width="1.5"/>
    <ellipse cx="${x - r * .35}" cy="${y - r * .35}" rx="${r * .25}" ry="${r * .18}" fill="#fff" opacity=".6"/>
    <path d="M${x} ${y - r} l-7 -3 m7 3 l7 -3 m-7 3 l-4 5 m4 -5 l4 5 m-4 -5 l0 -6" stroke="#2E7D32" stroke-width="2.5" stroke-linecap="round"/>`;

  const tomatoFlower = (x, y) => S.flower({ x, y, r: 10, petals: 5, shape: 'pointed', color: '#FFD600', center: '#F9A825', centerR: 3 });

  // A whole tomato plant, split into parts so scenes can move them
  function tomato() {
    const stemD = `M${X} ${SOIL} Q${X + 6} 200 ${X - 2} 52`;
    const leafSpots = [[300, 1, 100], [262, -1, 95], [222, 1, 88], [182, -1, 80], [140, 1, 70], [100, -1, 60]];
    const leaves = leafSpots.map(([y, side, len]) => compoundLeaf(X + 2, y, side, len));
    // Two small leaves at the tip
    const tip = S.leaf({ x: X - 2, y: 58, angle: -60, L: 24, W: 9, shape: 'toothed', color: '#6DBB55', stalk: 2 }) +
      S.leaf({ x: X - 2, y: 58, angle: -120, L: 24, W: 9, shape: 'toothed', color: '#6DBB55', stalk: 2 });
    const flowers = [
      `<path d="M${X + 2} 185 Q${X + 30} 172 ${X + 48} 176" stroke="#3E8B37" stroke-width="2.5" fill="none"/>${tomatoFlower(X + 50, 168)}${tomatoFlower(X + 66, 184)}${tomatoFlower(X + 40, 192)}`,
      `<path d="M${X} 140 Q${X - 22} 128 ${X - 40} 132" stroke="#3E8B37" stroke-width="2.5" fill="none"/>${tomatoFlower(X - 44, 124)}${tomatoFlower(X - 58, 140)}`,
    ];
    const fruit = [
      `<path d="M${X + 1} 228 Q${X - 20} 226 ${X - 36} 236 M${X - 36} 236 L${X - 46} 244 M${X - 36} 236 L${X - 26} 250" stroke="#3E8B37" stroke-width="2.5" fill="none"/>${tomatoFruit(X - 50, 256)}${tomatoFruit(X - 24, 266, 14)}`,
      `<path d="M${X + 3} 268 Q${X + 26} 266 ${X + 40} 276 M${X + 40} 276 L${X + 32} 286 M${X + 40} 276 L${X + 56} 282" stroke="#3E8B37" stroke-width="2.5" fill="none"/>${tomatoFruit(X + 30, 298, 14)}${tomatoFruit(X + 60, 292)}`,
    ];
    const stem = `<path d="${stemD}" stroke="#2F7A2A" stroke-width="12" fill="none" stroke-linecap="round"/>
      <path d="${stemD}" stroke="#4FA43E" stroke-width="8" fill="none" stroke-linecap="round"/>
      <path d="${stemD}" stroke="#9BD58A" stroke-width="2" fill="none" transform="translate(-2 0)" opacity=".7"/>`;
    const roots = S.roots({ x: X, y: SOIL + 1, depth: 120, spread: 120, color: '#EBD9B4', w: 5, seed: 5 });
    return { stemD, stem, leaves, tip, flowers, fruit, roots };
  }

  // Soil cross-section with a grassy top
  const soilBand = () => `<path d="M0 ${SOIL} Q200 ${SOIL - 8} 400 ${SOIL} T800 ${SOIL} L800 520 L0 520Z" fill="url(#g-soil)"/>
    ${[...Array(30)].map((_, i) => `<ellipse cx="${(i * 71) % 800}" cy="${SOIL + 20 + (i * 37) % 160}" rx="${3 + i % 4}" ry="${2 + i % 3}" fill="#000" opacity=".16"/>`).join('')}
    <path d="M0 ${SOIL} Q200 ${SOIL - 8} 400 ${SOIL} T800 ${SOIL}" stroke="#6DBA5A" stroke-width="7" fill="none"/>`;

  // Oak leaf cluster around a point
  const oakCluster = (x, y, n = 5, size = 1, seed = 1) => {
    const r = S.rng(seed);
    let s = '';
    for (let i = 0; i < n; i++) {
      const a = -90 + (i - (n - 1) / 2) * (200 / n) + (r() - .5) * 20;
      s += S.leaf({ x, y, angle: a, L: 34 * size, W: 12 * size, shape: 'oak', color: i % 2 ? '#5DAE4B' : '#4C9A3E', stalk: 3 });
    }
    return s;
  };

  const acorn = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">
    <ellipse cx="0" cy="4" rx="12" ry="15" fill="#B8862F" stroke="#7A5520" stroke-width="1.5"/>
    <ellipse cx="-4" cy="0" rx="3" ry="6" fill="#fff" opacity=".35"/>
    <path d="M-14 -6 Q0 -18 14 -6 Q14 0 0 -1 Q-14 0 -14 -6Z" fill="#8A6A3A" stroke="#5B4220" stroke-width="1.5"/>
    <path d="M-9 -8 l3 3 M-3 -11 l3 3 M3 -11 l3 3 M8 -8 l3 3" stroke="#5B4220" stroke-width="1.2"/>
    <path d="M0 -13 q2 -6 5 -7" stroke="#5B4220" stroke-width="2.5" fill="none" stroke-linecap="round"/></g>`;

  App.chapter({
    id: 'stems',
    title: 'Stems and trunks',
    icon: '🌳',
    group: 'Parts of a plant',
    keywords: [
      { w: 'tomato', d: 'A plant that grows red fruits called tomatoes.' },
      { w: 'under', d: 'Below something.' },
      { w: 'stem', d: 'The part of a plant that holds up the leaves and flowers.' },
      { w: 'above', d: 'Higher than something.' },
      { w: 'joins', d: 'Fixes onto something, so they are connected.' },
      { w: 'colour', d: 'Red, yellow, green and blue are all colours.' },
      { w: 'leaves', d: 'The flat green parts of a plant that make its food.' },
      { w: 'flowers', d: 'The bright parts of a plant that attract insects.' },
      { w: 'oak', d: 'A big tree that grows from an acorn.' },
    ],
    steps: [
      {
        text: [
          'This is a **tomato** plant. It has roots **under** the soil.',
          'The **stem** is **above** the soil. The stem **joins** onto the roots.',
          'Stems are often green in **colour**.',
        ],
        ask: 'Drag the labels onto the tomato plant.',
        activity: true,
        scene(stage, api) {
          const t = tomato();
          const svg = api.svg(`
            ${S.sky()}
            ${S.sun({ x: 720, y: 70, r: 30 })}
            <g class="float">${S.cloud({ x: 140, y: 70, s: .8 })}</g>
            ${soilBand()}
            ${t.roots}
            ${t.stem}${t.leaves.map(l => l.mk).join('')}${t.tip}${t.fruit.join('')}${t.flowers.join('')}
            ${S.callout({ x: X - 50, y: 256, tx: 170, ty: 230, text: 'tomato', color: '#3E9B4F' })}
            ${S.callout({ x: X + 66, y: 184, tx: 640, ty: 180, text: 'flower', color: '#3E9B4F' })}
          `);
          api.dragLabels(svg, [
            { id: 'stem', label: 'stem', x: X + 1, y: 322, lx: 590, ly: 320 },
            { id: 'soil', label: 'soil', x: 190, y: 420, lx: 120, ly: 480 },
            { id: 'root', label: 'root', x: 404, y: 398, lx: 610, ly: 460 },
          ], {
            onDone: () => {
              api.star();
              api.sayAfter('The stem is above the soil, and it joins onto the roots under the soil.');
            },
          });
        },
      },
      {
        text: [
          'One function of the stem is to hold these other parts of the plant above the ground.',
          'Another function of the stem is to get water from the roots to other parts of the plant.',
        ],
        ask: 'What happens with no stem? Then show how water moves.',
        activity: true,
        scene(stage, api) {
          const t = tomato();
          const parts = [...t.leaves.map(l => l.mk), t.tip, ...t.fruit, ...t.flowers];
          const svg = api.svg(`
            ${S.sky()}
            ${S.sun({ x: 720, y: 70, r: 30 })}
            ${soilBand()}
            ${t.roots}
            <g id="stm-water" opacity="0">
              <g class="stm-flow-rev">${S.roots({ x: X, y: SOIL + 1, depth: 120, spread: 120, color: '#3BA7E5', w: 2.5, seed: 5 })}</g>
            </g>
            <g id="stm-stem">${t.stem}</g>
            <g id="stm-stemwater" opacity="0"><path class="flow" d="${t.stemD}" stroke="#3BA7E5" stroke-width="4" fill="none"/></g>
            <g id="stm-parts">${parts.map((p, i) => `<g class="stm-part" data-i="${i}">${p}</g>`).join('')}</g>
            <g id="stm-leafwater" opacity="0">${t.leaves.map(l => `<path class="flow" d="${l.path}" stroke="#3BA7E5" stroke-width="3" fill="none"/>`).join('')}</g>
            <g id="stm-drops"></g>
          `);
          const partEls = S.qa(svg, '.stm-part');
          const stemEl = S.q(svg, '#stm-stem');
          let noStem = false, busy = false, didFall = false, didWater = false;
          const check = () => {
            if (didFall && didWater) { api.star(); api.timeout(() => api.praise('The stem holds the plant up, and carries water to the leaves.'), 2600); }
          };
          // How far each part must fall to land on the ground
          const falls = partEls.map((g, i) => {
            const b = g.getBBox();
            const side = b.x + b.width / 2 < X ? -1 : 1;
            return { dx: side * (30 + (i * 23) % 70), dy: SOIL - 4 - (b.y + b.height), rot: (i % 2 ? 1 : -1) * (15 + (i * 7) % 25), cx: b.x + b.width / 2, cy: b.y + b.height };
          });
          const setFall = k => partEls.forEach((g, i) => {
            const f = falls[i];
            g.setAttribute('transform', `translate(${(f.dx * Math.min(1, k)).toFixed(1)} ${(f.dy * k).toFixed(1)}) rotate(${(f.rot * k).toFixed(1)} ${f.cx.toFixed(1)} ${f.cy.toFixed(1)})`);
          });
          api.row();
          const takeBtn = api.button('✋ Take away the stem', async () => {
            if (busy) return;
            busy = true;
            if (!noStem) {
              noStem = true;
              takeBtn.innerHTML = '↺ Put it back';
              api.sfx('whoosh');
              S.q(svg, '#stm-water').setAttribute('opacity', 0);
              S.q(svg, '#stm-stemwater').setAttribute('opacity', 0);
              S.q(svg, '#stm-leafwater').setAttribute('opacity', 0);
              await api.tween(400, k => stemEl.setAttribute('opacity', 1 - k));
              if (!api.alive()) return;
              api.timeout(() => api.sfx('thud'), 520);
              api.timeout(() => api.sfx('thud'), 760);
              await api.tween(1100, k => setFall(k), W.ease.bounce);
              if (!api.alive()) return;
              api.say('Everything fell to the ground! With no stem, nothing holds the leaves, flowers and tomatoes up.');
              didFall = true; check();
            } else {
              noStem = false;
              takeBtn.innerHTML = '✋ Take away the stem';
              api.sfx('grow');
              await api.tween(900, k => setFall(1 - k), W.ease.back);
              if (!api.alive()) return;
              await api.tween(300, k => stemEl.setAttribute('opacity', k));
            }
            busy = false;
          }, { cls: 'primary', sound: null });
          api.button('💧 Show the water', () => {
            if (noStem) { api.oops('Put the stem back first. Water needs the stem to get to the leaves!'); return; }
            api.sfx('water');
            const w1 = S.q(svg, '#stm-water'), w2 = S.q(svg, '#stm-leafwater'), w3 = S.q(svg, '#stm-stemwater');
            w1.style.transition = 'opacity .6s'; w3.style.transition = 'opacity .6s .5s'; w2.style.transition = 'opacity .6s 1s';
            w1.setAttribute('opacity', 1); w2.setAttribute('opacity', 1); w3.setAttribute('opacity', 1);
            // Droplets climbing the stem, then along each leaf stalk
            const dropsG = S.q(svg, '#stm-drops');
            const stemPath = S.q(svg, '#stm-stemwater .flow');
            const leafPaths = S.qa(svg, '#stm-leafwater path');
            const L = stemPath.getTotalLength();
            const drops = [];
            for (let i = 0; i < 8; i++) {
              const n = S.frag(S.drop({ s: .6 }));
              dropsG.appendChild(n);
              drops.push({ n, d: -i * 40, leaf: leafPaths[i % leafPaths.length], ld: 0 });
            }
            let t0 = 0;
            api.loop(dt => {
              t0 += dt;
              drops.forEach(d => {
                let p;
                if (d.d < L * .9 - 20 && d.ld === 0) {
                  d.d += dt * 110;
                  const hitY = +d.leaf.getAttribute('d').split(' ')[1];
                  p = stemPath.getPointAtLength(Math.max(0, d.d));
                  if (p.y <= hitY && d.d > 0) d.ld = .01;
                  d.n.setAttribute('opacity', d.d < 0 ? 0 : 1);
                } else {
                  d.ld += dt * 90;
                  const LL = d.leaf.getTotalLength();
                  p = d.leaf.getPointAtLength(Math.min(LL, d.ld));
                  if (d.ld >= LL) { d.d = -20; d.ld = 0; d.leaf = leafPaths[Math.floor(Math.random() * leafPaths.length)]; }
                }
                d.n.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) scale(.6)`);
              });
              return t0 < 8;
            });
            api.timeout(() => { w1.setAttribute('opacity', 0); w2.setAttribute('opacity', 0); w3.setAttribute('opacity', 0); dropsG.innerHTML = ''; }, 8200);
            if (!didWater) {
              api.say('The roots take in water. The stem carries it up to the leaves, flowers and tomatoes.');
              didWater = true; check();
            }
          }, { cls: 'primary', sound: null });
        },
      },
      {
        text: [
          'Compared with trees, tomato plants are quite small. But trees start off very small.',
        ],
        ask: 'Slide to watch an **oak** tree grow.',
        activity: true,
        scene(stage, api) {
          const G = 440;
          const stages = [
            { name: 'acorn', say: 'An oak tree starts as an acorn. It is very small.' },
            { name: '1 month old', say: 'This oak plant is one month old. It has a thin green stem and a few oak leaves.' },
            { name: 'a few years old', say: 'This oak tree is a few years older. The stem has the same function as before, but it is starting to become woody.' },
            { name: 'very old', say: 'This is a very old oak tree. Its stem is now a big, strong trunk. Look how small the tomato plant and the child are!' },
          ];
          const draw = i => {
            let s = '';
            if (i === 0) {
              s = `${acorn(400, G - 22, 2.4)}${S.callout({ x: 425, y: G - 40, tx: 560, ty: G - 110, text: 'acorn' })}`;
            } else if (i === 1) {
              s = `${acorn(385, G - 6, .9)}
                ${S.plant({ x: 400, y: G, h: 150, leaves: 5, leafShape: 'oak', leafL: 36, leafW: 13, leafColor: '#5DAE4B', stemW: 4, roots: false, seed: 2 })}
                ${S.callout({ x: 401, y: G - 40, tx: 560, ty: G - 70, text: 'stem' })}`;
            } else if (i === 2) {
              const br = [[G - 150, 1, 70], [G - 200, -1, 65], [G - 250, 1, 55], [G - 290, -1, 45]];
              s = `<path d="M396 ${G} Q392 ${G - 150} 400 ${G - 320}" stroke="#6B4A2E" stroke-width="12" fill="none" stroke-linecap="round"/>
                <path d="M394 ${G} Q390 ${G - 150} 398 ${G - 320}" stroke="#9C7250" stroke-width="3" fill="none" opacity=".7"/>
                ${br.map(([y, side, len]) => `<path d="M398 ${y} Q${398 + side * len * .5} ${y - 10} ${398 + side * len} ${y - 40}" stroke="#6B4A2E" stroke-width="5" fill="none" stroke-linecap="round"/>`).join('')}
                ${br.map(([y, side, len], k) => oakCluster(398 + side * len, y - 40, 5, .9, k + 3)).join('')}
                ${oakCluster(400, G - 320, 6, 1, 9)}
                ${S.callout({ x: 396, y: G - 70, tx: 560, ty: G - 60, text: 'woody stem' })}`;
            } else {
              s = `${S.tree({ x: 320, y: G, h: 380, trunkW: 80, canopy: 135, leafColor: '#3E8B3F', seed: 6 })}
                ${S.plant({ x: 560, y: G, h: 70, leaves: 4, leafShape: 'toothed', leafL: 18, leafW: 7, stemW: 3, fruit: 2, roots: false, seed: 4 })}
                ${S.kid({ x: 680, y: G, s: .72, shirt: '#29B6F6', coat: false })}
                ${S.callout({ x: 320, y: G - 90, tx: 160, ty: G - 40, text: 'trunk' })}
                ${S.text(560, G + 40, 'tomato plant', { size: 17, fill: '#fff' })}${S.text(680, G + 40, 'child', { size: 17, fill: '#fff' })}`;
            }
            S.q(svg, '#stm-oak').innerHTML = `<g class="grow-in">${s}</g>`;
            S.q(svg, '#stm-name').textContent = stages[i].name;
          };
          const svg = api.svg(`
            ${S.sky()}
            <g class="float">${S.cloud({ x: 120, y: 80, s: .7 })}</g>
            ${S.ground({ y: G, h: 80, fill: 'url(#g-grass)' })}
            <g id="stm-oak"></g>
            <g transform="translate(550 20)"><rect width="230" height="44" rx="22" fill="#fff" opacity=".92"/>
              <text x="115" y="30" text-anchor="middle" font-size="20" font-weight="800" fill="#2A7439">🌳 <tspan id="stm-name"></tspan></text></g>
          `);
          let ready = false, last = -1;
          api.slider({
            label: '🌰 → 🌳', min: 0, max: 3, step: 1, value: 0,
            format: v => stages[v].name,
            onInput: v => {
              if (v === last) return;
              last = v;
              draw(v);
              if (ready) { api.sfx('grow'); api.say(stages[v].say); }
              if (v === 3) api.star();
            },
          });
          ready = true;
        },
      },
      {
        text: ['Here is a very old oak tree. It needs a strong trunk so it does not fall over.'],
        ask: 'Blow the wind on both trees. Which one stays up?',
        activity: true,
        scene(stage, api) {
          const G = 440, TX = 200, SNAP = 340;
          const canopy = [[0, -250, 62], [-45, -220, 45], [45, -220, 45], [-25, -285, 40], [30, -280, 42]]
            .map(([dx, dy, r], i) => `<circle cx="${TX + dx}" cy="${G + dy}" r="${r}" fill="${i % 2 ? '#56A845' : '#4C9A3E'}"/>`).join('');
          const svg = api.svg(`
            ${S.sky()}
            <g id="stm-clouds">${S.cloud({ x: 120, y: 70, s: .8 })}${S.cloud({ x: 520, y: 55, s: .7 })}</g>
            ${S.ground({ y: G, h: 80, fill: 'url(#g-grass)' })}
            <g id="stm-thin">
              <path d="M${TX - 6} ${G} L${TX - 4} ${SNAP} L${TX + 4} ${SNAP} L${TX + 6} ${G}Z" fill="url(#g-bark)"/>
              <g id="stm-top">
                <path d="M${TX - 4} ${SNAP} L${TX - 3} ${G - 230} L${TX + 3} ${G - 230} L${TX + 4} ${SNAP}Z" fill="url(#g-bark)"/>
                ${canopy}
              </g>
            </g>
            <g id="stm-thick">${S.tree({ x: 560, y: G, h: 360, trunkW: 78, canopy: 125, leafColor: '#3E8B3F', seed: 8 })}</g>
            ${S.text(TX, G + 45, 'thin trunk', { fill: '#fff' })}${S.text(560, G + 45, 'strong trunk', { fill: '#fff' })}
            <g id="stm-gusts" opacity="0">${[0, 1, 2, 3].map(i => `<path d="M${-60 + i * 30} ${130 + i * 70} q60 -20 120 0 t120 0 t120 0" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" class="flow"/>`).join('')}</g>
            <g id="stm-crack" opacity="0">${S.text(TX + 60, SNAP - 10, 'CRACK!', { size: 26, fill: '#C8452F' })}</g>
          `);
          const thin = S.q(svg, '#stm-thin'), top = S.q(svg, '#stm-top'), thick = S.q(svg, '#stm-thick');
          let blown = false, asked = false;
          const blow = async () => {
            if (blown) return;
            blown = true;
            api.sfx('wind');
            S.q(svg, '#stm-gusts').setAttribute('opacity', 1);
            // Both trees bend in the wind; the thin one bends much more
            await api.tween(1600, (k, raw) => {
              const gust = Math.sin(raw * Math.PI * 4) * .5 + .5;
              thin.setAttribute('transform', `rotate(${(8 + 20 * raw * gust).toFixed(1)} ${TX} ${G})`);
              thick.setAttribute('transform', `rotate(${(1.5 * gust).toFixed(2)} 560 ${G})`);
              S.q(svg, '#stm-clouds').setAttribute('transform', `translate(${raw * 60} 0)`);
            }, W.ease.linear);
            if (!api.alive()) return;
            api.sfx('knock');
            S.q(svg, '#stm-crack').setAttribute('opacity', 1);
            // The top snaps off and falls to the ground
            const a0 = 8 + 20 * (Math.sin(Math.PI * 4) * .5 + .5);
            await api.tween(900, (k, raw) => {
              thin.setAttribute('transform', `rotate(${(a0 * (1 - raw)).toFixed(1)} ${TX} ${G})`);
              top.setAttribute('transform', `translate(${(30 * k).toFixed(1)} ${(52 * k).toFixed(1)}) rotate(${(78 * k).toFixed(1)} ${TX} ${SNAP})`);
              thick.setAttribute('transform', `rotate(${(Math.sin(raw * 10) * 1.2).toFixed(2)} 560 ${G})`);
            }, W.ease.bounce);
            if (!api.alive()) return;
            api.sfx('thud');
            S.q(svg, '#stm-gusts').setAttribute('opacity', 0);
            S.q(svg, '#stm-crack').setAttribute('opacity', 0);
            thick.setAttribute('transform', '');
            api.say('The thin trunk snapped! The strong trunk only moved a little.');
            if (!asked) {
              asked = true;
              api.choice({
                q: 'Why does an old oak need a strong trunk?',
                options: ['So it does not fall over', 'To make flowers', 'To look brown'],
                correct: 0,
                explain: 'A big, heavy tree needs a strong trunk to hold it up, so it does not fall over.',
                hints: { 1: 'Think about what happened to the thin tree in the wind.', 2: 'The colour does not help. What happened in the wind?' },
                onRight: () => api.star(),
              });
            }
          };
          api.row();
          api.button('💨 Blow the wind', blow, { cls: 'primary pulse', sound: null });
          api.button('↺ Again', () => {
            blown = false;
            thin.removeAttribute('transform'); top.removeAttribute('transform'); thick.removeAttribute('transform');
            S.q(svg, '#stm-clouds').removeAttribute('transform');
          }, { sound: 'swoosh' });
        },
      },
    ],
  });
})();
