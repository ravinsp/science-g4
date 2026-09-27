// Chapter 6: Flowers
(() => {
  if (!document.getElementById('flw-style')) {
    const st = document.createElement('style');
    st.id = 'flw-style';
    st.textContent = `
      .flw-flap .wing-l { animation: flw-flap .22s ease-in-out infinite alternate; transform-box: fill-box; transform-origin: 100% 50%; }
      .flw-flap .wing-r { animation: flw-flap .22s ease-in-out infinite alternate; transform-box: fill-box; transform-origin: 0% 50%; }
      @keyframes flw-flap { to { transform: scaleX(.35); } }
      .flw-buzz .wing { animation: flw-buzz .07s linear infinite alternate; transform-box: fill-box; transform-origin: 50% 100%; }
      @keyframes flw-buzz { to { transform: scaleY(.55); } }
      .flw-found { filter: drop-shadow(0 0 6px #FFE56B) drop-shadow(0 0 3px #FF8F00); }
      .flw-q { animation: flw-q 1s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
      @keyframes flw-q { 50% { transform: translateY(-6px); } }
    `;
    document.head.append(st);
  }

  // A foxglove bell hanging from (0,0), pointing down
  const bell = (s = 1, col = '#D55FA0') => `<g transform="scale(${s})">
    <path d="M0 0 C-8 3 -16 22 -15 42 Q0 50 15 42 C16 22 8 3 0 0Z" fill="${col}" stroke="${S.mix(col, '#000', .25)}" stroke-width="1.5"/>
    <path d="M-4 6 C-8 16 -9 28 -8 38" stroke="#fff" stroke-width="2.5" opacity=".35" fill="none" stroke-linecap="round"/>
    <ellipse cx="0" cy="42" rx="14" ry="5" fill="${S.mix(col, '#fff', .45)}"/>
    <circle cx="-5" cy="41" r="1.6" fill="#7B1F4E"/><circle cx="3" cy="42" r="1.6" fill="#7B1F4E"/><circle cx="7" cy="40" r="1.3" fill="#7B1F4E"/></g>`;
  const fxBud = (s = 1) => `<g transform="scale(${s})">
    <path d="M0 0 C-6 2 -8 12 -6 20 Q0 24 6 20 C8 12 6 2 0 0Z" fill="#B5D98A" stroke="#6E9E3E" stroke-width="1.5"/>
    <path d="M-3 16 Q0 21 3 16" stroke="#E7A3C8" stroke-width="3" fill="none"/></g>`;

  // A foxglove spike. Flowers from index `open` upwards are still buds.
  function foxglove({ x, yBot = 440, yTop = 70, n = 16, open = 10, s = 1, cls = '' }) {
    let out = `<path d="M${x} ${yBot} Q${x + 8} ${(yBot + yTop) / 2} ${x - 2} ${yTop}" stroke="#4E8B3A" stroke-width="${7 * s}" fill="none" stroke-linecap="round"/>`;
    // Big leaves at the bottom
    [[-1, -150], [1, -30], [-1, -170], [1, -10]].forEach(([side, a], i) => {
      out += S.leaf({ x, y: yBot - 10 - i * 18, angle: a, L: 90 * s * (1 - i * .15), W: 22 * s, shape: 'long', color: '#5E9E47', stalk: 4 });
    });
    const step = (yBot - 70 - yTop - 20) / n;
    for (let i = 0; i < n; i++) {
      const y = yBot - 70 - i * step;
      const side = i % 2 ? -1 : 1;
      const k = s * (1 - i * .025);
      const ax = x + side * 5 * s + (i % 3 - 1) * 2;
      const isBud = i >= open;
      out += `<g class="fx-f ${cls}" data-i="${i}" transform="translate(${ax.toFixed(1)} ${y.toFixed(1)})">
        <path d="M0 0 l${side * 6 * s} ${3 * s}" stroke="#4E8B3A" stroke-width="2"/>
        <g class="fx-bell" transform="translate(${side * 6 * s} ${3 * s}) rotate(${side * -38}) scale(${isBud ? 0 : 1})">${bell(k)}</g>
        <g class="fx-bud" transform="translate(${side * 6 * s} ${3 * s}) rotate(${side * -150}) scale(${isBud ? 1 : 0})">${fxBud(k * .9)}</g>
      </g>`;
    }
    return out;
  }

  // Yellow buttercup: one shiny cup flower on each stem
  function buttercups(x0, y) {
    let s = '';
    const stems = [[x0, 170, -12], [x0 + 70, 220, 4], [x0 + 140, 150, 14]];
    stems.forEach(([x, h, lean], i) => {
      const tx = x + lean, ty = y - h;
      s += `<g class="flw-bc" data-i="${i}"><path d="M${x} ${y} Q${x + lean * .2} ${y - h * .5} ${tx} ${ty}" stroke="#4E8B3A" stroke-width="4" fill="none"/>
        ${S.leaf({ x: x + lean * .15, y: y - h * .45, angle: lean > 0 ? -20 : -160, L: 22, W: 9, shape: 'toothed', color: '#4F8F3A', stalk: 2 })}
        ${S.flower({ x: tx, y: ty, r: 24, petals: 5, color: '#FFD600', center: '#F9A825', centerR: 8, shape: 'round' })}
        <ellipse cx="${tx - 8}" cy="${ty - 12}" rx="5" ry="3" fill="#fff" opacity=".7"/></g>`;
    });
    // Leaves at the bottom
    [[x0 - 20, -150], [x0 + 60, -40], [x0 + 110, -150], [x0 + 170, -30]].forEach(([x, a]) => {
      s += S.leaf({ x, y: y - 4, angle: a, L: 44, W: 18, shape: 'toothed', color: '#3F7F2E', stalk: 3 });
    });
    return s;
  }

  const sparkle = (x, y, r = 10) => `<path class="pop-in" d="M${x} ${y - r} L${x + r * .25} ${y - r * .25} L${x + r} ${y} L${x + r * .25} ${y + r * .25} L${x} ${y + r} L${x - r * .25} ${y + r * .25} L${x - r} ${y} L${x - r * .25} ${y - r * .25}Z" fill="#FFF59D" stroke="#FFB300" stroke-width="1"/>`;

  // Open the buds of a foxglove one at a time, bottom to top
  async function openBuds(api, svg, from, to) {
    for (let i = from; i < to; i++) {
      const g = S.q(svg, `.fx-f[data-i="${i}"]`);
      const b = S.q(g, '.fx-bell'), bd = S.q(g, '.fx-bud');
      const tb = b.getAttribute('transform').replace(/scale\([^)]*\)/, '');
      const td = bd.getAttribute('transform').replace(/scale\([^)]*\)/, '');
      api.sfx('pop');
      const ok = await api.tween(380, k => {
        bd.setAttribute('transform', `${td} scale(${(1 - k).toFixed(3)})`);
        b.setAttribute('transform', `${tb} scale(${k.toFixed(3)})`);
      }, W.ease.back);
      if (!ok) return false;
    }
    return true;
  }

  App.chapter({
    id: 'flowers',
    title: 'Flowers',
    icon: '🌼',
    group: 'Parts of a plant',
    keywords: [
      { w: 'bud', d: 'A flower that is still closed up. It has not opened yet.' },
      { w: 'ready', d: 'Prepared, so it can happen now.' },
      { w: 'branch', d: 'A part of a tree that grows out from the trunk.' },
      { w: 'bright', d: 'Full of strong colour or light.' },
      { w: 'attractive', d: 'Nice to look at, so it makes you want to come closer.' },
      { w: 'attracted', d: 'Made something come closer.' },
    ],
    steps: [
      {
        text: [
          'Flowers grow above the ground. They grow on a plant\'s stem.',
          'Sometimes a stem has just one flower on it. Sometimes a stem has lots of flowers on it.',
        ],
        ask: 'Do you remember the name of the yellow plant?',
        activity: true,
        scene(stage, api) {
          const svg = api.svg(`
            ${S.sky()}
            ${S.sun({ x: 720, y: 60, r: 28 })}
            <g class="float">${S.cloud({ x: 330, y: 70, s: .7 })}</g>
            ${S.ground({ y: 440, h: 80, fill: 'url(#g-grass)' })}
            <g id="flw-bc" class="hot">${buttercups(130, 442)}</g>
            <g id="flw-fx" class="hot">${foxglove({ x: 560, yBot: 442, yTop: 80, n: 16, open: 11 })}</g>
            ${S.callout({ x: 202, y: 222, tx: 330, ty: 150, text: 'one flower' })}
            ${S.callout({ x: 575, y: 290, tx: 700, ty: 250, text: 'lots of flowers' , w: 170 })}
            ${S.callout({ x: 568, y: 120, tx: 690, ty: 140, text: 'buds' })}
            <g id="flw-name"><g class="flw-q"><circle cx="200" cy="480" r="22" fill="#fff" stroke="#E07A4F" stroke-width="3"/>${S.text(200, 489, '?', { size: 26, fill: '#C8452F' })}</g></g>
            ${S.text(560, 488, 'foxglove', { size: 20, fill: '#fff' })}
          `);
          S.q(svg, '#flw-bc').addEventListener('click', () => { api.sfx('pop'); api.say('Each stem of this plant has just one flower on it.'); });
          S.q(svg, '#flw-fx').addEventListener('click', () => { api.sfx('pop'); api.say('This foxglove stem has lots of flowers on it. The ones at the top are still buds.'); });
          api.choice({
            q: 'What is the yellow plant called?',
            options: ['🌻 sunflower', '🌼 buttercup', '🌳 oak'],
            correct: 1,
            explain: 'It is a buttercup. Each stem has one shiny yellow flower.',
            hints: { 0: 'A sunflower is very tall with one huge flower.', 2: 'An oak is a big tree!' },
            onRight: () => {
              S.q(svg, '#flw-name').innerHTML = `<g class="pop-in">${S.text(200, 488, 'buttercup', { size: 20, fill: '#fff' })}</g>`;
              api.star();
            },
          });
        },
      },
      {
        text: [
          'Flowers at the top of this plant are still in **bud**. They are not **ready** to be flowers yet.',
        ],
        ask: 'Look at some flowers growing where you live. Are there any flower buds?',
        activity: true,
        scene(stage, api) {
          const N = 16, OPEN = 9;
          const svg = api.svg(`
            ${S.sky()}
            ${S.ground({ y: 470, h: 50, fill: 'url(#g-grass)' })}
            ${foxglove({ x: 330, yBot: 472, yTop: 30, n: N, open: OPEN, s: 1.15, cls: 'hot' })}
            <g id="flw-cal" transform="translate(560 60)">
              <rect width="180" height="120" rx="14" fill="#fff" stroke="#555" stroke-width="3"/>
              <rect width="180" height="36" rx="14" fill="#E53935"/><rect y="22" width="180" height="14" fill="#E53935"/>
              ${S.text(90, 27, 'DAY', { size: 20, fill: '#fff' })}
              <text id="flw-day" x="90" y="100" text-anchor="middle" font-size="54" font-weight="800">1</text>
            </g>
            <g id="flw-tag">${S.callout({ x: 336, y: 120, tx: 560, ty: 250, text: 'buds' })}</g>
          `);
          S.qa(svg, '.fx-f').forEach(g => g.addEventListener('click', () => {
            const isBud = +S.q(g, '.fx-bell').getAttribute('transform').match(/scale\(([\d.]+)\)/)[1] < .5;
            api.sfx('pop');
            api.say(isBud ? 'This is a bud. It is not ready to be a flower yet.' : 'This flower is open. It is ready.');
          }));
          let busy = false, opened = false;
          const btn = api.button('⏩ Wait a week', async () => {
            if (busy || opened) return;
            busy = true; btn.disabled = true;
            api.sfx('page');
            // Days tick by while the buds open
            let day = 1;
            const tick = api.interval(() => { if (day < 7) { day++; S.q(svg, '#flw-day').textContent = day; api.sfx('tick'); } }, 450);
            S.q(svg, '#flw-tag').style.display = 'none';
            const ok = await openBuds(api, svg, OPEN, N);
            clearInterval(tick);
            if (!ok) return;
            S.q(svg, '#flw-day').textContent = 7;
            opened = true; busy = false;
            api.say('A week later, the buds have opened into flowers!');
            api.choice({
              q: 'What do we call a flower that is not ready yet?',
              options: ['a bud', 'a root', 'a seed'],
              correct: 0,
              explain: 'A bud is a flower that has not opened yet.',
              hints: { 1: 'Roots grow under the soil.', 2: 'Seeds grow into new plants.' },
              onRight: () => api.star(),
            });
          }, { cls: 'primary pulse', sound: null });
          api.button('↺ Back to buds', () => {
            if (busy) return;
            opened = false; btn.disabled = false;
            S.q(svg, '#flw-day').textContent = 1;
            S.q(svg, '#flw-tag').style.display = '';
            for (let i = OPEN; i < N; i++) {
              const g = S.q(svg, `.fx-f[data-i="${i}"]`);
              [['.fx-bell', 0], ['.fx-bud', 1]].forEach(([sel, v]) => {
                const n = S.q(g, sel);
                n.setAttribute('transform', n.getAttribute('transform').replace(/scale\([^)]*\)/, `scale(${v})`));
              });
            }
          }, { sound: 'swoosh' });
        },
      },
      {
        text: [
          'These flowers are on a tree.',
          'Can you see the **branch** that shows this is part of a tree?',
          'Can you see any flower buds?',
        ],
        ask: 'Click the branch. Then find 3 buds! Drag the label onto a petal.',
        activity: true,
        scene(stage, api) {
          const blossoms = [[170, 330], [230, 290], [300, 300], [260, 230], [350, 250], [410, 220], [470, 180], [430, 280], [520, 230], [580, 170], [640, 200], [600, 120], [690, 150], [540, 300], [200, 380], [330, 190], [720, 230]];
          const buds = [[380, 300], [560, 140], [245, 330]];
          const petalFlower = [470, 180];
          const svg = api.svg(`
            <rect width="800" height="520" fill="#E3F4FF"/>
            ${[...Array(10)].map((_, i) => `<circle cx="${(i * 173) % 800}" cy="${(i * 97) % 520}" r="${40 + (i % 3) * 20}" fill="#FDE4EC" opacity=".6"/>`).join('')}
            <g id="flw-branch" class="hot">
              <path d="M-10 480 C120 420 220 340 360 270 S620 150 800 110" stroke="#5B3A22" stroke-width="30" fill="none" stroke-linecap="round"/>
              <path d="M-10 474 C120 414 220 334 360 264 S620 144 800 104" stroke="#8A5C3A" stroke-width="8" fill="none" opacity=".6"/>
              <path d="M300 300 Q320 230 330 190 M470 210 Q470 190 470 180 M560 180 Q600 140 600 120 M520 200 Q560 230 540 300 M200 380 Q190 360 200 330" stroke="#6B4A2E" stroke-width="9" fill="none" stroke-linecap="round"/>
              <path d="M360 270 Q410 250 430 280 M640 160 Q690 150 690 150 M180 400 Q150 360 170 330" stroke="#6B4A2E" stroke-width="7" fill="none" stroke-linecap="round"/>
            </g>
            ${blossoms.map(([x, y], i) => `<g class="flw-bl">${S.flower({ x, y, r: i === 6 ? 32 : 22 + (i % 3) * 3, petals: 5, shape: 'heart', color: i % 3 ? '#F8BBD0' : '#F48FB1', center: '#E91E63', centerR: 5, rot: i * 23 })}
              <circle cx="${x}" cy="${y}" r="2.5" fill="#FFEB3B"/></g>`).join('')}
            ${buds.map(([x, y], i) => `<g class="flw-bud hot" data-i="${i}">${S.bud({ x, y: y + 10, r: 8, color: '#EC407A', angle: (i - 1) * 25 })}<circle cx="${x}" cy="${y}" r="20" fill="transparent"/></g>`).join('')}
            <g id="flw-tags"></g>
            <g transform="translate(16 16)"><rect width="250" height="72" rx="16" fill="#fff" opacity=".95" stroke="#E07A4F" stroke-width="2"/>
              <text x="16" y="30" font-size="19" font-weight="800">🌿 Branch: <tspan id="flw-br">?</tspan></text>
              <text x="16" y="58" font-size="19" font-weight="800">🌸 Buds found: <tspan id="flw-bn">0</tspan> / 3</text></g>
          `);
          let branch = false, petal = false;
          const found = new Set();
          const check = () => {
            if (branch && petal && found.size === 3) { api.star(); api.timeout(() => api.praise('You found the branch, the buds and a petal!'), 1800); }
          };
          S.q(svg, '#flw-branch').addEventListener('click', () => {
            api.sfx('pop');
            if (!branch) {
              branch = true;
              S.q(svg, '#flw-branch').classList.add('flw-found');
              S.q(svg, '#flw-br').textContent = '✔';
              S.q(svg, '#flw-tags').insertAdjacentHTML('beforeend', S.callout({ x: 120, y: 420, tx: 110, ty: 490, text: 'branch', cls: 'callout pop-in' }));
              api.say('Yes! That is a branch. Branches grow on trees, so these flowers are on a tree.');
              check();
            } else api.say('That is the branch.');
          });
          S.qa(svg, '.flw-bl').forEach(g => g.addEventListener('click', () => { api.sfx('tick'); api.say('That flower is open. Buds are still closed up. Look for a small, dark pink bud.'); }));
          S.qa(svg, '.flw-bud').forEach(g => g.addEventListener('click', () => {
            const i = +g.dataset.i;
            if (found.has(i)) return;
            found.add(i);
            api.sfx('pop'); api.sfx('sprinkle');
            g.classList.add('flw-found');
            const [x, y] = buds[i];
            S.q(svg, '#flw-tags').insertAdjacentHTML('beforeend', sparkle(x + 14, y - 14, 12));
            S.q(svg, '#flw-bn').textContent = found.size;
            api.say(found.size === 3 ? 'You found all three buds!' : 'You found a bud!');
            check();
          }));
          api.dragLabels(svg, [
            { id: 'petal', label: 'petal', x: petalFlower[0] + 4, y: petalFlower[1] - 22, lx: 520, ly: 60 },
          ], { onDone: () => { petal = true; api.say('A petal is one part of a flower.'); check(); } });
        },
      },
      {
        text: [
          'The **bright** flowers on these pages look **attractive** to us.',
          'Their function is to look attractive to insects. This sunflower has **attracted** two insects.',
        ],
        ask: 'Click a flower to make it brighter. Then click each insect to name it.',
        activity: true,
        scene(stage, api) {
          const G = 450;
          const DULL = '#B9B2A8';
          const fl = [
            { x: 160, y: 230, h: 220, col: '#FF4F8B', center: '#C2185B', petals: 8, r: 34, shape: 'round' },
            { x: 400, y: 190, h: 260, col: '#FFC400', center: '#6D4C1E', petals: 18, r: 42, shape: 'pointed', seeds: true },
            { x: 640, y: 240, h: 210, col: '#8E6CFF', center: '#FFD54F', petals: 6, r: 32, shape: 'wide' },
          ];
          fl.forEach(f => { f.level = 0; });
          const flowerMk = f => {
            const c = S.mix(DULL, f.col, f.level / 3);
            const cc = S.mix('#8D8378', f.center, f.level / 3);
            return S.flower({ x: f.x, y: f.y, r: f.r, petals: f.petals, color: c, center: cc, shape: f.shape, seeds: f.seeds, centerR: f.seeds ? f.r * .45 : null });
          };
          const svg = api.svg(`
            ${S.sky()}
            ${S.sun({ x: 730, y: 60, r: 26 })}
            ${S.ground({ y: G, h: 70, fill: 'url(#g-grass)' })}
            ${fl.map((f, i) => `<g class="hot flw-fl" data-i="${i}">
              <path d="M${f.x} ${G} Q${f.x + 10} ${(G + f.y) / 2} ${f.x} ${f.y}" stroke="#4E8B3A" stroke-width="7" fill="none"/>
              ${S.leaf({ x: f.x + 3, y: G - 70, angle: -30, L: 50, W: 18, color: '#58A845' })}${S.leaf({ x: f.x + 2, y: G - 110, angle: -150, L: 46, W: 17, color: '#58A845' })}
              <g class="flw-head">${flowerMk(f)}</g>
              <g class="flw-lv">${[0, 1, 2].map(k => `<circle cx="${f.x - 16 + k * 16}" cy="${G + 40}" r="6" fill="#fff" stroke="#999" stroke-width="2"/>`).join('')}</g>
            </g>`).join('')}
            <g id="flw-spk"></g>
            <g id="flw-bee" class="flw-buzz" transform="translate(80 80)">${S.bee({ s: 1.2 })}</g>
            <g id="flw-bfly" class="flw-flap" transform="translate(560 90)">${S.butterfly({ s: .9, color: '#FF8A65' })}</g>
            <g id="flw-names"></g>
          `);
          const heads = S.qa(svg, '.flw-head');
          const ins = [
            { el: S.q(svg, '#flw-bee'), x: 80, y: 80, kind: 'bee', off: [-42, -40], sound: 'buzz', phase: 0, named: false, landed: false },
            { el: S.q(svg, '#flw-bfly'), x: 560, y: 90, kind: 'butterfly', off: [48, -34], sound: 'flutter', phase: 2, named: false, landed: false },
          ];
          let target = -1, announced = false, current = null, T = 0;
          const pickTarget = () => {
            let best = -1, lv = 0;
            fl.forEach((f, i) => { if (f.level > lv) { lv = f.level; best = i; } });
            if (best !== target) {
              target = best;
              ins.forEach(b => { b.landed = false; });
              if (best >= 0) { api.sfx('buzz'); api.timeout(() => api.sfx('flutter'), 300); }
            }
          };
          S.qa(svg, '.flw-fl').forEach(g => g.addEventListener('click', () => {
            const f = fl[+g.dataset.i];
            if (f.level >= 3) { api.sfx('pop'); api.say('This flower is as bright as it can be!'); return; }
            f.level++;
            api.sfx('sprinkle');
            heads[+g.dataset.i].innerHTML = `<g class="pop-in">${flowerMk(f)}</g>`;
            S.qa(g, '.flw-lv circle').forEach((c, k) => c.setAttribute('fill', k < f.level ? '#FFC400' : '#fff'));
            S.q(svg, '#flw-spk').innerHTML = [0, 1, 2].map(k => sparkle(f.x + Math.cos(k * 2.1) * (f.r + 14), f.y + Math.sin(k * 2.1) * (f.r + 14), 9)).join('');
            pickTarget();
          }));
          api.loop(dt => {
            T += dt;
            ins.forEach((b, j) => {
              let tx, ty;
              if (target < 0) {
                // Wander around the sky
                tx = 400 + Math.cos(T * .6 + j * 3) * 300; ty = 110 + Math.sin(T * 1.1 + j) * 50;
              } else {
                tx = fl[target].x + b.off[0]; ty = fl[target].y + b.off[1];
              }
              const dx = tx - b.x, dy = ty - b.y, d = Math.hypot(dx, dy);
              const sp = target < 0 ? 140 : 170;
              if (d > 3) {
                const m = Math.min(d, sp * dt);
                b.x += dx / d * m; b.y += dy / d * m;
              } else if (target >= 0 && !b.landed) {
                b.landed = true;
                api.sfx('pop');
              }
              // Wobbly flight, gentle bob when landed
              const wob = b.landed ? Math.sin(T * 3 + j) * 1.5 : Math.sin(T * 7 + b.phase) * 10;
              const flip = dx < -1 && !b.landed ? -1 : 1;
              const s = b.kind === 'bee' ? 1.2 : .9;
              b.el.setAttribute('transform', `translate(${b.x.toFixed(1)} ${(b.y + wob).toFixed(1)}) scale(${b.kind === 'bee' ? flip : 1} 1)`);
              S.q(b.el, 'g').setAttribute('transform', `scale(${s})`);
            });
            if (target >= 0 && ins.every(b => b.landed) && !announced) {
              announced = true;
              api.say(`Look! The bright flower has attracted two insects. Can you name them? Click each insect.`);
              ins.forEach(b => b.el.classList.add('hot'));
            }
          });
          // Naming the insects
          const nameRow = api.row();
          nameRow.style.display = 'none';
          const nameLabel = api.label('What is this insect?', nameRow);
          const answer = kind => {
            if (!current) return;
            if (kind === current.kind) {
              current.named = true;
              const lx = current.x + (kind === 'bee' ? -34 : 40);
              S.q(svg, '#flw-names').insertAdjacentHTML('beforeend', `<g class="pop-in"><rect x="${lx - 48}" y="${current.y - 72}" width="96" height="30" rx="15" fill="#fff" stroke="#3E9B4F" stroke-width="2.5"/>${S.text(lx, current.y - 51, kind, { size: 17, fill: '#2A7439' })}</g>`);
              nameRow.style.display = 'none';
              current = null;
              if (ins.every(b => b.named)) { api.star(); api.praise('A bee and a butterfly! Bright flowers attract insects.'); }
              else api.praise(`Yes, it is a ${kind}!`);
            } else {
              api.oops(current.kind === 'bee' ? 'Look again. It is small and stripy, and it buzzes!' : 'Look again. It has big, bright wings.');
            }
          };
          api.button('🐝 Bee', () => answer('bee'), { parent: nameRow, sound: 'pick' });
          api.button('🦋 Butterfly', () => answer('butterfly'), { parent: nameRow, sound: 'pick' });
          ins.forEach(b => b.el.addEventListener('click', () => {
            if (!b.el.classList.contains('hot')) { api.info('Make a flower brighter first, so the insects come to it!'); return; }
            if (b.named) { api.sfx(b.sound); api.say(`That is the ${b.kind}.`); return; }
            api.sfx(b.sound);
            current = b;
            nameRow.style.display = '';
            nameLabel.textContent = 'What is this insect?';
            api.say('What is this insect?');
          }));
          api.row();
          api.button('↺ Make the flowers dull', () => {
            fl.forEach((f, i) => { f.level = 0; heads[i].innerHTML = flowerMk(f); });
            S.qa(svg, '.flw-lv circle').forEach(c => c.setAttribute('fill', '#fff'));
            S.q(svg, '#flw-spk').innerHTML = '';
            pickTarget();
          }, { sound: 'swoosh' });
        },
      },
    ],
  });
})();
