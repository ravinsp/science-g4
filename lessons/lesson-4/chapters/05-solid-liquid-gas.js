// Chapter 5: Solid, liquid or gas?
(() => {
  const f = S.f1;

  // Classroom picture. Each thing has data-i and a kind: solid, liquid or gas.
  const THINGS = [
    { id: 'board', kind: 'solid', name: 'whiteboard', svg: `<rect x="50" y="50" width="280" height="150" rx="6" fill="#fff" stroke="#90A4AE" stroke-width="6"/>
      <path d="M80 90 q30 -20 60 0 t60 0 M80 130 l120 0 M80 160 l80 0" stroke="#1E88E5" stroke-width="4" fill="none" stroke-linecap="round"/>` },
    { id: 'clock', kind: 'solid', name: 'clock', svg: `<circle cx="420" cy="100" r="44" fill="#fff" stroke="#E53935" stroke-width="7"/><path d="M420 100 L420 70 M420 100 L440 112" stroke="#333" stroke-width="5" stroke-linecap="round"/>` },
    { id: 'tank', kind: 'liquid', name: 'water in the fish tank', svg: `<rect x="580" y="250" width="180" height="110" rx="6" fill="#4FC3F7" opacity=".7"/>
      <path d="M640 300 q20 -16 40 0 q-20 16 -40 0Z M680 300 l14 -10 l0 20Z" fill="#FF9800"/><path d="M590 340 q10 -30 0 -60 M740 345 q-8 -30 4 -60" stroke="#43A047" stroke-width="5" fill="none"/>` },
    { id: 'desk', kind: 'solid', name: 'desk', svg: `<rect x="30" y="340" width="500" height="22" rx="4" fill="#C47A3D" stroke="#7A4A1F" stroke-width="3"/>
      <path d="M60 362 L60 500 M500 362 L500 500" stroke="#7A4A1F" stroke-width="12"/>` },
    { id: 'book', kind: 'solid', name: 'book', svg: `<rect x="60" y="300" width="100" height="40" rx="3" fill="#43A047" stroke="#1B5E20" stroke-width="3"/><rect x="66" y="306" width="88" height="10" fill="#fff" opacity=".7"/>` },
    { id: 'paint', kind: 'liquid', name: 'paint', svg: `<path d="M178 300 L232 300 L226 340 L184 340Z" fill="#fff" stroke="#555" stroke-width="3"/><ellipse cx="205" cy="302" rx="25" ry="7" fill="#E53935"/>
      <path d="M222 298 L262 250" stroke="#8D6E63" stroke-width="6" stroke-linecap="round"/>` },
    { id: 'scissors', kind: 'solid', name: 'scissors', svg: `<g transform="translate(300 330) rotate(-10)">${S.scissors({ s: .8, open: .25 })}</g>` },
    { id: 'crayons', kind: 'solid', name: 'crayons', svg: `<rect x="370" y="290" width="54" height="50" rx="3" fill="#E53935" stroke="#8E1B1B" stroke-width="3"/>
      ${['#7E57C2', '#E53935', '#1E88E5', '#43A047'].map((c, i) => `<path d="M${376 + i * 12} 290 L${376 + i * 12} 268 L${381 + i * 12} 258 L${386 + i * 12} 268 L${386 + i * 12} 290Z" fill="${c}"/>`).join('')}` },
    { id: 'bottle', kind: 'liquid', name: 'water in the bottle', svg: `<rect x="450" y="250" width="44" height="90" rx="12" fill="#B3E5FC" stroke="#4A90B8" stroke-width="3"/><rect x="454" y="280" width="36" height="56" rx="8" fill="#29B6F6"/><rect x="460" y="236" width="24" height="16" rx="3" fill="#1E88E5"/>` },
    { id: 'chair', kind: 'solid', name: 'chair', svg: `<path d="M600 390 L600 500 M680 410 L680 500 M600 430 L690 430" stroke="#1E88E5" stroke-width="10" stroke-linecap="round"/><rect x="590" y="380" width="20" height="60" rx="4" fill="#1E88E5"/>` },
  ];
  const room = () => `
    <rect width="800" height="520" fill="#FFF3D6"/>
    <rect y="440" width="800" height="80" fill="#D7B98E"/>
    <rect x="560" y="50" width="200" height="140" rx="6" fill="#BFE6FF" stroke="#8D6E63" stroke-width="6"/><path d="M660 50 L660 190 M560 120 L760 120" stroke="#8D6E63" stroke-width="5"/>
    <rect x="566" y="360" width="208" height="80" fill="#A1887F" stroke="#6D4C41" stroke-width="3"/>
    <rect x="576" y="244" width="188" height="118" rx="6" fill="none" stroke="#78909C" stroke-width="5"/>
    ${THINGS.map(t => `<g data-i="${t.id}" class="hot">${t.svg}</g>`).join('')}
    <g id="l4-slg-ticks"></g>`;
  // Where to put a tick on each thing
  const TICK = { board: [190, 125], clock: [420, 100], tank: [670, 300], desk: [270, 351], book: [110, 318], paint: [205, 320], scissors: [300, 330], crayons: [397, 316], bottle: [472, 300], chair: [640, 440] };

  App.chapter({
    id: 'slg',
    title: 'Solid, liquid or gas?',
    icon: '🔍',
    group: 'Solids, liquids and gases',
    keywords: [
      { w: 'fizzy', d: 'Full of tiny bubbles of gas, like lemonade.' },
      { w: 'grain', d: 'One very small, hard piece of something, like sand or sugar.' },
      { w: 'tiny', d: 'Very, very small.' },
      { w: 'pile', d: 'A heap of things lying on top of each other.' },
    ],
    steps: [
      // ---------- a) Find six solids ----------
      {
        text: ['Let\'s look for some solids, liquids and gases.'],
        ask: 'Find six things in this classroom that are solids. Click them.',
        activity: true,
        scene(stage, api) {
          const svg = api.svg(room() + `<g transform="translate(400 486)"><rect x="-110" y="-22" width="220" height="44" rx="22" fill="#fff" opacity=".92"/>
            ${S.text(0, 7, '🧱 Solids: ', { size: 19 }).replace('</text>', '<tspan id="l4-slg1-n">0</tspan> of 6</text>')}</g>`);
          const ticks = S.q(svg, '#l4-slg-ticks');
          const found = new Set();
          svg.addEventListener('click', e => {
            const g = e.target.closest('[data-i]');
            if (!g) return;
            const t = THINGS.find(q => q.id === g.dataset.i);
            if (t.kind !== 'solid') { api.oops(`The ${t.name} is a liquid. Find a solid!`); return; }
            if (found.has(t.id) || found.size >= 6) return;
            found.add(t.id);
            api.sfx('pop');
            const [x, y] = TICK[t.id];
            ticks.insertAdjacentHTML('beforeend', `<g transform="translate(${x} ${y})"><g class="pop-in"><circle r="20" fill="#3E9B4F" stroke="#fff" stroke-width="3"/>${S.text(0, 8, '✔', { size: 22, fill: '#fff' })}</g></g>`);
            S.q(svg, '#l4-slg1-n').textContent = found.size;
            if (found.size < 6) api.say(`Yes! The ${t.name} is a solid. It has a fixed shape.`);
            else {
              api.star();
              api.praise(`The ${t.name} is a solid too. You found six solids!`);
            }
          });
        },
      },

      // ---------- b) Liquids and a gas ----------
      {
        text: ['Now look for some liquids. These are a bit harder to find.'],
        ask: ['Find three liquids in the classroom.', 'Can you think of any gases in your classroom? There is one all around you.'],
        activity: true,
        scene(stage, api) {
          const svg = api.svg(`<g id="l4-slg2-room">${room()}</g><g id="l4-slg2-air"></g>
            <g transform="translate(400 486)"><rect x="-150" y="-22" width="300" height="44" rx="22" fill="#fff" opacity=".92"/>
            ${S.text(0, 7, '💧 Liquids: ', { size: 19 }).replace('</text>', '<tspan id="l4-slg2-n">0</tspan> of 3   💨 Gas: <tspan id="l4-slg2-g">?</tspan></text>')}</g>`);
          const ticks = S.q(svg, '#l4-slg-ticks'), air = S.q(svg, '#l4-slg2-air');
          const found = new Set();
          let gas = false;
          S.q(svg, '#l4-slg2-room').addEventListener('click', e => {
            const g = e.target.closest('[data-i]');
            if (!g) {
              if (found.size < 3) { api.info('Find the three liquids first.'); return; }
              if (gas) return;
              gas = true;
              api.sfx('wind');
              S.q(svg, '#l4-slg2-g').textContent = 'air ✔';
              air.innerHTML = [...Array(7)].map((_, i) => `<g class="fade-in" style="animation-delay:${i * .12}s"><path d="M${60 + i * 105} ${120 + (i % 3) * 110} q30 -20 60 0 t60 0" stroke="#64B5F6" stroke-width="5" fill="none" stroke-linecap="round" opacity=".7"/></g>`).join('');
              api.star();
              api.praise('Air! We cannot see it, but air is a gas and it is all around us.');
              return;
            }
            const t = THINGS.find(q => q.id === g.dataset.i);
            if (t.kind !== 'liquid') { api.oops(`The ${t.name} is a solid. Look for a liquid.`); return; }
            if (found.has(t.id)) return;
            found.add(t.id);
            api.sfx('drip');
            const [x, y] = TICK[t.id];
            ticks.insertAdjacentHTML('beforeend', `<g transform="translate(${x} ${y})"><g class="pop-in"><circle r="20" fill="#1E88E5" stroke="#fff" stroke-width="3"/>${S.text(0, 8, '✔', { size: 22, fill: '#fff' })}</g></g>`);
            S.q(svg, '#l4-slg2-n').textContent = found.size;
            if (found.size < 3) api.say(`Yes! The ${t.name} is a liquid.`);
            else api.say(`Yes! The ${t.name} is a liquid. Now find a gas. Hint: it is all around you. Click an empty space.`);
          });
        },
      },

      // ---------- c) A fizzy drink ----------
      {
        text: ['**Fizzy** liquids have bubbles of gas in them.', 'They are put into solid containers.'],
        tip: 'Look what I have found. It has all three!',
        ask: 'Drag the labels to the bottle. Then shake it!',
        activity: true,
        scene(stage, api) {
          const B = 'M370 120 L370 150 Q330 180 330 220 L330 440 Q330 460 350 460 L450 460 Q470 460 470 440 L470 220 Q470 180 430 150 L430 120Z';
          const svg = api.svg(`
            <clipPath id="l4-slg3-clip"><path d="${B}"/></clipPath>
            <rect width="800" height="520" fill="#EAF6FF"/>
            <g id="l4-slg3-b" transform="translate(0 0)">
              <g clip-path="url(#l4-slg3-clip)"><rect x="320" y="200" width="160" height="270" fill="#29B6F6" opacity=".85"/><g id="l4-slg3-bub"></g></g>
              <path d="${B}" fill="url(#g-glass)" stroke="#1E88E5" stroke-width="4"/>
              <rect x="362" y="92" width="76" height="32" rx="5" fill="#1565C0" stroke="#0D47A1" stroke-width="3"/>
              <path d="M370 100 L370 118 M382 100 L382 118 M394 100 L394 118 M406 100 L406 118 M418 100 L418 118 M430 100 L430 118" stroke="#0D47A1" stroke-width="2"/>
            </g>
            <g id="l4-slg3-fizz"></g>`);
          const bub = S.q(svg, '#l4-slg3-bub'), bottle = S.q(svg, '#l4-slg3-b'), fizz = S.q(svg, '#l4-slg3-fizz');
          const bs = [...Array(26)].map((_, i) => ({ x: 340 + Math.random() * 120, y: 200 + Math.random() * 260, r: 2 + Math.random() * 4, v: 30 + Math.random() * 40, el: S.el('circle', { fill: '#fff', opacity: .8 }, bub) }));
          let shake = 0, labelled = false, shaken = false;
          api.loop((dt, t) => {
            const speed = 1 + shake * 5;
            bs.forEach(b => {
              b.y -= b.v * speed * dt;
              if (b.y < 205) { b.y = 455; b.x = 340 + Math.random() * 120; }
              b.el.setAttribute('cx', f(b.x + Math.sin(t * 4 + b.r) * 2)); b.el.setAttribute('cy', f(b.y)); b.el.setAttribute('r', f(b.r));
            });
            shake = Math.max(0, shake - dt * .4);
            bottle.setAttribute('transform', `rotate(${f(Math.sin(t * 30) * shake * 8)} 400 300)`);
            fizz.innerHTML = shake > .3 ? [...Array(10)].map((_, i) => `<circle cx="${f(400 + Math.sin(t * 7 + i * 2) * 30)}" cy="${f(80 - ((t * 120 + i * 20) % 70))}" r="4" fill="#B3E5FC"/>`).join('') : '';
          });
          api.dragLabels(svg, [
            { id: 'solid', label: 'solid', x: 470, y: 380, lx: 620, ly: 380 },
            { id: 'liquid', label: 'liquid', x: 420, y: 250, lx: 620, ly: 250 },
            { id: 'gas', label: 'gas', x: 360, y: 330, lx: 190, ly: 330 },
          ], {
            radius: 70,
            onDone: () => {
              labelled = true;
              shakeBtn.disabled = false; shakeBtn.classList.add('pulse');
              api.sayAfter('The bottle is a solid. The drink is a liquid. The bubbles are a gas. Now shake it!');
            },
          });
          const shakeBtn = api.button('🫨 Shake the bottle', () => {
            if (!labelled) return;
            shake = 1;
            api.sfx('bubble');
            shakeBtn.classList.remove('pulse');
            if (!shaken) {
              shaken = true;
              api.star();
              api.timeout(() => api.praise('Shaking lets the bubbles of gas escape. Fizz!'), 1200);
            }
          }, { cls: 'primary', sound: null });
          shakeBtn.disabled = true;
        },
      },

      // ---------- d) Sand up close ----------
      {
        text: [
          'Look at this sand. Compare it to this liquid.',
          'Sand looks a bit like a liquid. But sand is not a liquid. Look closely at the sand.',
        ],
        tip: 'Each **grain** is a **tiny** solid.',
        ask: 'Drag the magnifying glass over the sand. Then look at the liquid.',
        activity: true,
        scene(stage, api) {
          const r = S.rng(12);
          // Grains of sand: falling stream and a pile
          let grains = '';
          const G = [];
          for (let i = 0; i < 420; i++) {
            let x, y;
            if (i < 140) { x = 200 + (r() - .5) * 26 * (1 + i / 140); y = 160 + r() * 220; }
            else { const u = r() * 2 - 1; x = 200 + u * 120; y = 470 - r() * (1 - Math.abs(u)) * 80; }
            const s = 1.2 + r() * 1.2, a = r() * 6;
            const pts = [...Array(5)].map((_, k) => { const aa = a + k * 1.26, rr = s * (.7 + r() * .5); return `${f(x + Math.cos(aa) * rr)},${f(y + Math.sin(aa) * rr)}`; }).join(' ');
            const c = ['#E0B872', '#D19A4E', '#F2D49B', '#B97F3A'][i % 4];
            G.push(`<polygon points="${pts}" fill="${c}" stroke="#8A5A20" stroke-width=".25"/>`);
          }
          grains = G.join('');
          const liquid = `<path d="M590 150 Q600 300 596 400 L604 400 Q606 300 610 150Z" fill="#F2A922"/><path d="${L4.blob(600, 455, 110, 16, 3, 10, .1)}" fill="#F2A922"/>`;
          const scene = `
            <rect width="800" height="520" fill="#FFFDF5"/>
            <rect x="0" y="0" width="400" height="520" fill="#4FC3F7" opacity=".25"/>
            <rect x="400" y="0" width="400" height="520" fill="#FF9800" opacity=".25"/>
            <path d="M120 120 Q180 90 240 120 L230 150 Q180 160 130 150Z" fill="#E9A87C" stroke="#B5703F" stroke-width="3"/>
            <path d="M520 120 Q580 90 660 120 L650 150 Q590 160 530 150Z" fill="#E9A87C" stroke="#B5703F" stroke-width="3"/>
            ${grains}${liquid}`;
          const svg = api.svg(`
            <clipPath id="l4-slg4-clip"><circle id="l4-slg4-c" cx="400" cy="260" r="80"/></clipPath>
            ${scene}
            ${L4.pill(200, 40, 'sand')}${L4.pill(600, 40, 'liquid')}
            <g clip-path="url(#l4-slg4-clip)"><g id="l4-slg4-zoom"><rect width="800" height="520" fill="#FFFDF5"/>${scene}</g></g>
            <g id="l4-slg4-lens" transform="translate(400 260)" class="hot">
              <circle r="80" fill="none" stroke="#455A64" stroke-width="10"/>
              <path d="M57 57 L110 110" stroke="#6D4C41" stroke-width="18" stroke-linecap="round"/>
              <circle r="80" fill="#fff" opacity="0"/>
              <text id="l4-slg4-hint" y="112" x="-30" text-anchor="middle" font-size="18" font-weight="800" fill="#4A2D8A" class="blink-hint">👆 Drag me</text>
            </g>`);
          const c = S.q(svg, '#l4-slg4-c'), zoom = S.q(svg, '#l4-slg4-zoom');
          const Z = 4;
          const place = p => {
            c.setAttribute('cx', f(p.x)); c.setAttribute('cy', f(p.y));
            zoom.setAttribute('transform', `translate(${f(p.x)} ${f(p.y)}) scale(${Z}) translate(${f(-p.x)} ${f(-p.y)})`);
          };
          place({ x: 400, y: 260 });
          let sand = 0, liq = false, starred = false;
          api.draggable(svg, S.q(svg, '#l4-slg4-lens'), {
            bounds: { x1: 60, y1: 60, x2: 740, y2: 460 },
            onStart: () => { api.sfx('pick'); const h = S.q(svg, '#l4-slg4-hint'); if (h) h.remove(); },
            onMove: p => {
              place(p);
              if (p.x < 330 && p.y > 150) {
                if (sand++ === 20) { api.sfx('magic'); api.say('Look! The sand is made of lots of tiny grains. Each grain is a tiny solid.'); }
              }
              if (p.x > 520 && p.x < 700 && p.y > 150 && !liq) { liq = true; api.say('The liquid is smooth. It has no grains.'); }
              if (sand > 20 && liq && !starred) {
                starred = true;
                api.star();
                api.timeout(() => api.praise('Sand is not a liquid. It is lots of tiny solid grains.'), 2600);
              }
            },
            onDrop: () => true,
          });
        },
      },

      // ---------- e) A pile or a pool ----------
      {
        text: ['Sand makes a **pile**. It is a pile of lots of tiny solids.'],
        tip: 'Liquids do not make a pile. Liquids make a pool, not a pile.',
        ask: 'Pour the sand. Then pour the orange juice. What does each one make?',
        activity: true,
        scene(stage, api) {
          const N = 70, CW = 4;      // columns for the sand heap
          const svg = api.svg(`
            <rect width="800" height="520" fill="#FFFDF5"/>
            <rect y="440" width="800" height="80" fill="#CFD8DC"/>
            <line x1="400" y1="40" x2="400" y2="440" stroke="#CFD8DC" stroke-width="3" stroke-dasharray="8 8"/>
            <path d="M160 60 L240 60 L210 120 L210 140 L190 140 L190 120Z" fill="#B0BEC5" stroke="#607D8B" stroke-width="3"/>
            <path d="M560 60 L640 60 L610 120 L610 140 L590 140 L590 120Z" fill="#B0BEC5" stroke="#607D8B" stroke-width="3"/>
            <g id="l4-slg5-fall"></g>
            <path id="l4-slg5-pile" d="" fill="#D9A55B" stroke="#A0702E" stroke-width="2"/>
            <path id="l4-slg5-pool" d="" fill="#FF9800"/>
            <g id="l4-slg5-tags"></g>`);
          const pile = S.q(svg, '#l4-slg5-pile'), pool = S.q(svg, '#l4-slg5-pool'), fall = S.q(svg, '#l4-slg5-fall'), tags = S.q(svg, '#l4-slg5-tags');
          const h = Array(N).fill(0);
          const drawPile = () => {
            let d = `M${200 - N * CW / 2} 440`;
            h.forEach((v, i) => { d += ` L${f(200 - N * CW / 2 + i * CW + CW / 2)} ${f(440 - v)}`; });
            pile.setAttribute('d', d + ` L${200 + N * CW / 2} 440Z`);
          };
          const addGrain = () => {
            let i = Math.floor(N / 2 + (Math.random() - .5) * 2);
            h[i] += 1.4;
            // Let the grain roll down while the slope is too steep
            for (let k = 0; k < 60; k++) {
              const l = i > 0 ? h[i] - h[i - 1] : 0, rr = i < N - 1 ? h[i] - h[i + 1] : 0;
              if (Math.max(l, rr) <= 3.2) break;
              h[i] -= 1.4;
              i += l > rr ? -1 : (l < rr ? 1 : (Math.random() < .5 ? -1 : 1));
              h[i] += 1.4;
            }
          };
          let busy = false, did = new Set(), asked = false;
          const after = () => {
            if (did.size < 2 || asked) return;
            asked = true;
            api.choice({
              q: 'Which one makes a pile?', options: ['🏖 Sand', '🍊 Orange juice'], correct: 0,
              hints: { 1: 'The juice spread out flat. That is a pool.' },
              explain: 'Sand makes a pile because each grain is a tiny solid. Juice is a liquid, so it makes a pool.',
              onRight: () => api.star(),
            });
          };
          api.button('🏖 Pour the sand', async b => {
            if (busy) return;
            busy = true; b.disabled = true;
            api.sfx('sprinkle');
            await api.tween(4000, (k, raw) => {
              for (let n = 0; n < 6; n++) addGrain();
              drawPile();
              fall.innerHTML = raw < .97 ? [...Array(30)].map((_, i) => `<circle cx="${f(200 + (Math.random() - .5) * 8)}" cy="${f(140 + Math.random() * (300 - h[N >> 1]))}" r="1.8" fill="#C08A40"/>`).join('') : '';
            }, W.ease.linear);
            if (!api.alive()) return;
            fall.innerHTML = '';
            tags.insertAdjacentHTML('beforeend', `<g class="pop-in">${L4.pill(200, 480, 'a pile', { fill: '#FFF3C4' })}</g>`);
            api.say('The sand makes a pile. The grains sit on top of each other.');
            did.add('sand'); busy = false; after();
          }, { cls: 'primary', sound: null });
          api.button('🍊 Pour the juice', async b => {
            if (busy) return;
            busy = true; b.disabled = true;
            api.sfx('pour');
            await api.tween(3000, (k, raw) => {
              const w = 20 + 170 * k;
              pool.setAttribute('d', `M${f(600 - w)} 440 Q${f(600 - w)} ${f(434)} ${f(600 - w + 10)} 434 L${f(600 + w - 10)} 434 Q${f(600 + w)} 434 ${f(600 + w)} 440Z` +
                (raw < .97 ? ' M597 140 L603 140 L603 434 L597 434Z' : ''));
            }, W.ease.out);
            if (!api.alive()) return;
            tags.insertAdjacentHTML('beforeend', `<g class="pop-in">${L4.pill(600, 480, 'a pool', { fill: '#FFE0B2' })}</g>`);
            api.say('The juice spreads out flat. It makes a pool, not a pile.');
            did.add('juice'); busy = false; after();
          }, { cls: 'primary', sound: null });
        },
      },
    ],
  });
})();
