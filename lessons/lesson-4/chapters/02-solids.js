// Chapter 2: Solids
(() => {
  // The six solid objects from the book, each drawn round (0,0) in a 220x170 box
  const OBJECTS = [
    { id: 'pan', name: 'frying pan', svg: `<path d="M38 22 L104 70" stroke="#222" stroke-width="14" stroke-linecap="round"/>
      <ellipse cx="-20" cy="0" rx="74" ry="58" fill="#2E2E33"/><ellipse cx="-20" cy="-2" rx="60" ry="46" fill="#45454D"/>
      <path d="M-50 -24 L10 26" stroke="#1C1C20" stroke-width="10" stroke-linecap="round"/><rect x="-62" y="-40" width="26" height="30" rx="4" transform="rotate(40 -49 -25)" fill="#1C1C20"/>` },
    { id: 'brick', name: 'brick', svg: `<path d="M-90 -14 L-60 -44 L96 -44 L66 -14Z" fill="#D9603B" stroke="#8D2F17" stroke-width="2"/>
      <path d="M66 -14 L96 -44 L96 20 L66 50Z" fill="#A8401F" stroke="#8D2F17" stroke-width="2"/>
      <rect x="-90" y="-14" width="156" height="64" fill="#C9502C" stroke="#8D2F17" stroke-width="2"/>
      ${[...Array(14)].map((_, i) => `<circle cx="${-80 + (i * 37) % 140}" cy="${-4 + (i * 23) % 48}" r="2" fill="#8D2F17" opacity=".5"/>`).join('')}` },
    { id: 'rock', name: 'rock', svg: `<path d="${L4.blob(0, 4, 82, 58, 11, 9, .22)}" fill="#E3D3B5" stroke="#A8936B" stroke-width="3"/>
      <path d="${L4.blob(-18, -8, 38, 22, 5, 7, .3)}" fill="#F2E6CC"/><path d="M10 20 l20 10 M-40 30 l14 -4 M30 -20 l12 6" stroke="#A8936B" stroke-width="3" stroke-linecap="round"/>` },
    { id: 'toys', name: 'toy bricks', svg: [['#E53935', -50, 20], ['#FB8C00', 30, 24], ['#1E88E5', -10, -12], ['#43A047', -30, -44], ['#FDD835', 50, -14]].map(([c, x, y]) =>
      `<g transform="translate(${x} ${y})"><rect x="-34" y="-16" width="68" height="34" rx="3" fill="${c}" stroke="${S.mix(c, '#000', .3)}" stroke-width="2"/>
        ${[-20, 0, 20].map(k => `<rect x="${k - 7}" y="-24" width="14" height="9" rx="2" fill="${c}" stroke="${S.mix(c, '#000', .3)}" stroke-width="2"/>`).join('')}</g>`).join('') },
    { id: 'barrow', name: 'wheelbarrow', svg: `<path d="M20 -6 L104 -36" stroke="#222" stroke-width="7" stroke-linecap="round"/>
      <path d="M-30 30 L-20 60 M30 20 L50 58" stroke="#555" stroke-width="5"/>
      <path d="M-92 -40 L60 -40 L30 20 L-60 24Z" fill="#3949AB" stroke="#1A237E" stroke-width="3"/>
      <circle cx="-76" cy="42" r="26" fill="#222"/><circle cx="-76" cy="42" r="12" fill="#3949AB"/>` },
    { id: 'bench', name: 'bench', svg: `<path d="M-80 0 L-86 70 M70 0 L76 70 M-60 -60 L-64 0 M90 -60 L86 0" stroke="#222" stroke-width="7" stroke-linecap="round"/>
      ${[-58, -44, -30].map(y => `<rect x="-80" y="${y}" width="170" height="10" rx="2" fill="#C47A3D" stroke="#7A4A1F" stroke-width="1.5"/>`).join('')}
      ${[0, 12, 24].map(y => `<rect x="-96" y="${y - 6}" width="186" height="10" rx="2" fill="#C47A3D" stroke="#7A4A1F" stroke-width="1.5" transform="skewX(-20)"/>`).join('')}` },
  ];

  App.chapter({
    id: 'solids',
    title: 'Solids',
    icon: '🧱',
    group: 'Solids, liquids and gases',
    keywords: [
      { w: 'solids', d: 'Materials that have a fixed shape, like wood, metal and stone.' },
      { w: 'keep', d: 'To stay the same and not change.' },
      { w: 'pour', d: 'To make something flow out of a container in a stream.' },
      { w: 'containers', d: 'Things we put other things in, like a cup, a box or a jar.' },
      { w: 'compressed', d: 'Squashed together into a smaller space.' },
      { w: 'squashed', d: 'Pressed hard so that it gets smaller or flatter.' },
    ],
    steps: [
      // ---------- a) Six solids ----------
      {
        text: ['These objects are **solids**. They all have a fixed shape.'],
        ask: 'Do you think you could change their shape easily? Click each object to push it.',
        activity: true,
        scene(stage, api) {
          const svg = api.svg(`
            <rect width="800" height="520" fill="#FDF8EF"/>
            ${OBJECTS.map((o, i) => `<g transform="translate(${140 + (i % 3) * 260} ${140 + Math.floor(i / 3) * 230})">
              <rect x="-118" y="-100" width="236" height="200" rx="20" fill="#fff" stroke="#EADFCB" stroke-width="3"/>
              <g data-o="${o.id}" class="hot"><rect x="-110" y="-92" width="220" height="184" fill="#fff" opacity="0"/><g class="l4-sol1-obj">${o.svg}</g></g>
              <g class="l4-sol1-tag"></g></g>`).join('')}`);
          const done = new Set();
          let busy = false;
          svg.addEventListener('click', async e => {
            const g = e.target.closest('[data-o]');
            if (!g || busy) return;
            const o = OBJECTS.find(q => q.id === g.dataset.o);
            busy = true;
            api.sfx('thud');
            const inner = S.q(g, '.l4-sol1-obj');
            await api.tween(500, (k, raw) => {
              const s = Math.sin(raw * Math.PI * 3) * (1 - raw) * .05;
              inner.setAttribute('transform', `scale(${S.f1((1 + s) * 1000) / 1000} ${S.f1((1 - s) * 1000) / 1000})`);
            }, W.ease.linear);
            busy = false;
            if (!api.alive()) return;
            inner.removeAttribute('transform');
            api.say(`You pushed the ${o.name}. It keeps its shape!`);
            if (!done.has(o.id)) {
              done.add(o.id);
              g.parentNode.querySelector('.l4-sol1-tag').innerHTML = `<g class="pop-in">${L4.pill(0, 76, '✔ keeps its shape', { size: 16, fill: '#E3F4DE', stroke: '#3E9B4F' })}</g>`;
              if (done.size === OBJECTS.length) {
                api.star();
                api.timeout(() => api.praise('All of these solids have a fixed shape. It is hard to change it.'), 2200);
              }
            }
          });
        },
      },

      // ---------- b) The broken mug ----------
      {
        text: [
          'Solids **keep** their shape.',
          'We can use a force to change the shape of a solid, but it is difficult to do.',
          'This mug is broken, but you can still see the shape of a mug.',
        ],
        ask: 'Drop the mug. Then drag the pieces back together.',
        activity: true,
        scene(stage, api) {
          const mug = `<path d="M468 214 C548 212 548 344 462 344" stroke="#E6E6EA" stroke-width="24" fill="none"/>
            <path d="M468 214 C548 212 548 344 462 344" stroke="#fff" stroke-width="14" fill="none"/>
            <path d="M330 180 L472 180 L462 382 Q460 402 440 402 L362 402 Q342 402 340 382Z" fill="url(#l4-sol2-red)" stroke="#9A1B1B" stroke-width="3"/>
            <ellipse cx="401" cy="180" rx="71" ry="16" fill="#F4F4F6" stroke="#9A1B1B" stroke-width="3"/>`;
          const pieces = [
            { id: 'a', clip: 'M290 140 L398 140 L378 232 L408 300 L384 420 L290 420Z', off: [-170, 70, -28] },
            { id: 'b', clip: 'M398 140 L478 140 L478 420 L384 420 L408 300 L378 232Z', off: [60, 96, 22] },
            { id: 'c', clip: 'M478 140 L570 140 L570 420 L478 420Z', off: [190, -60, 46] },
          ];
          const svg = api.svg(`
            <defs><linearGradient id="l4-sol2-red" x1="0" y1="0" x2="0" y2="1"><stop offset=".35" stop-color="#F4F4F6"/><stop offset=".75" stop-color="#E05353"/><stop offset="1" stop-color="#B71C1C"/></linearGradient>
              ${pieces.map(p => `<clipPath id="l4-sol2-c${p.id}"><path d="${p.clip}"/></clipPath>`).join('')}</defs>
            <rect width="800" height="520" fill="#F3EEFA"/>
            <rect y="440" width="800" height="80" fill="#D7CCE8"/>
            <g id="l4-sol2-ghost" opacity="0"><path d="M330 180 L472 180 L462 382 Q460 402 440 402 L362 402 Q342 402 340 382Z M468 214 C548 212 548 344 462 344" fill="none" stroke="#7E57C2" stroke-width="3" stroke-dasharray="9 7"/></g>
            <g id="l4-sol2-mug">${pieces.map(p => `<g data-p="${p.id}" transform="translate(0 0)"><g class="l4-sol2-rot"><g clip-path="url(#l4-sol2-c${p.id})">${mug}</g>
              <path d="${p.clip}" fill="#fff" opacity="0"/></g></g>`).join('')}</g>
            <g transform="translate(20 20)"><rect width="230" height="44" rx="22" fill="#fff" opacity=".92"/>
              ${S.text(115, 29, '🧩 Pieces back: ', { size: 19 }).replace('</text>', '<tspan id="l4-sol2-n">0</tspan> of 3</text>')}</g>`);
          const mugG = S.q(svg, '#l4-sol2-mug');
          // Piece centres, for turning each piece round its middle
          const ctr = { a: [350, 290], b: [430, 290], c: [510, 280] };
          let placed = 0;
          const drop = api.button('💥 Drop the mug', async () => {
            drop.disabled = true;
            api.sfx('whoosh');
            await api.tween(500, k => mugG.setAttribute('transform', `translate(0 ${S.f1(-120 * (1 - k))})`), k => k * k);
            if (!api.alive()) return;
            api.sfx('thud'); api.sfx('knock');
            S.q(svg, '#l4-sol2-ghost').setAttribute('opacity', 1);
            await api.tween(500, k => pieces.forEach(p => {
              const n = S.q(svg, `[data-p="${p.id}"]`), [dx, dy, a] = p.off;
              n.setAttribute('transform', `translate(${S.f1(dx * k)} ${S.f1(dy * k)})`);
              S.q(n, '.l4-sol2-rot').setAttribute('transform', `rotate(${S.f1(a * k)} ${ctr[p.id][0]} ${ctr[p.id][1]})`);
            }), W.ease.out);
            if (!api.alive()) return;
            api.say('Crash! The mug is broken. Each piece is still hard. Now put it back together.');
            pieces.forEach(p => {
              const n = S.q(svg, `[data-p="${p.id}"]`);
              let ok = false;
              const d = api.draggable(svg, n, {
                bounds: { x1: -300, y1: -150, x2: 300, y2: 120 },
                onStart: () => { if (!ok) api.sfx('pick'); },
                onDrop: pos => {
                  if (ok) return false;
                  if (Math.hypot(pos.x, pos.y) < 45) {
                    ok = true;
                    d.animateTo(0, 0, 200);
                    S.q(n, '.l4-sol2-rot').setAttribute('transform', '');
                    n.style.cursor = 'default';
                    placed++;
                    S.q(svg, '#l4-sol2-n').textContent = placed;
                    api.sfx('drop');
                    if (placed === 3) {
                      api.star();
                      api.praise('The pieces fit together. You can still see the shape of a mug. Solids keep their shape.');
                    }
                    return true;
                  }
                  return false;
                },
              });
            });
          }, { cls: 'primary pulse', sound: null });
        },
      },

      // ---------- c) Pouring ----------
      {
        text: ['Water is not a solid. We cannot **pour** solids.'],
        ask: 'Tip the bottle of water. Then tip the box with a wooden block in it. Which one pours?',
        activity: true,
        scene(stage, api) {
          const svg = api.svg(`
            <rect width="800" height="520" fill="#EEF7FB"/>
            <rect y="430" width="800" height="90" fill="#CFE3EE"/>
            <line x1="400" y1="30" x2="400" y2="430" stroke="#CFE3EE" stroke-width="4" stroke-dasharray="10 8"/>
            <g id="l4-sol3-pool"></g>
            <path id="l4-sol3-stream" d="" stroke="#4FC3F7" stroke-width="10" fill="none" stroke-linecap="round" opacity=".85"/>
            ${L4.glass({ x: 230, y: 430, w: 110, h: 120, level: 0, liquid: '#4FC3F7', id: 'l4-sol3-g' })}
            <g id="l4-sol3-bottle" transform="rotate(0 170 200)">
              <rect x="120" y="130" width="80" height="150" rx="18" fill="#B3E5FC" stroke="#4A90B8" stroke-width="3" opacity=".9"/>
              <rect id="l4-sol3-water" x="124" y="170" width="72" height="106" rx="14" fill="#4FC3F7"/>
              <rect x="146" y="96" width="28" height="38" rx="6" fill="#B3E5FC" stroke="#4A90B8" stroke-width="3"/>
            </g>
            ${S.text(200, 70, 'water', { size: 24, fill: '#1E6E9E' })}
            <rect x="520" y="370" width="180" height="60" rx="8" fill="#D7CCC8" stroke="#8D6E63" stroke-width="3"/>
            <g id="l4-sol3-block" transform="translate(0 0)"><rect x="560" y="196" width="76" height="76" rx="4" fill="#C47A3D" stroke="#7A4A1F" stroke-width="3"/>
              <path d="M568 214 L628 214 M568 236 L628 236 M568 256 L628 256" stroke="#7A4A1F" stroke-width="2" opacity=".5"/></g>
            <g id="l4-sol3-box" transform="rotate(0 600 220)">
              <path d="M548 140 L548 280 L652 280 L652 140" fill="none" stroke="#5D4037" stroke-width="6" stroke-linejoin="round"/>
            </g>
            ${S.text(600, 70, 'wooden block', { size: 24, fill: '#7A4A1F' })}`);
          const bottle = S.q(svg, '#l4-sol3-bottle'), stream = S.q(svg, '#l4-sol3-stream'), gl = S.q(svg, '[data-liq="l4-sol3-g"]');
          const water = S.q(svg, '#l4-sol3-water');
          const box = S.q(svg, '#l4-sol3-box'), block = S.q(svg, '#l4-sol3-block');
          const tried = new Set();
          let busy = false;
          const check = () => {
            if (tried.size < 2) return;
            api.choice({
              q: 'Which one could you pour?', options: ['💧 The water', '🪵 The wooden block'], correct: 0,
              hints: { 1: 'The block fell out in one lump. It kept its shape.' },
              explain: 'Water is a liquid, so it pours. The block is a solid. It falls out in one piece.',
              onRight: () => api.star(),
            });
          };
          api.button('💧 Tip the bottle', async b => {
            if (busy) return;
            busy = true; b.disabled = true;
            await api.tween(700, k => bottle.setAttribute('transform', `rotate(${S.f1(k * 115)} 170 200)`), W.ease.inOut);
            if (!api.alive()) return;
            api.sfx('pour');
            await api.tween(2400, (k, raw) => {
              const w = 4 + 6 * Math.sin(Math.min(1, raw * 3) * Math.PI / 2);
              stream.setAttribute('d', raw < .92 ? `M128 112 Q190 ${S.f1(220 + Math.sin(raw * 40) * 4)} 230 425` : '');
              stream.setAttribute('stroke-width', S.f1(w));
              gl.setAttribute('d', L4.glassLiquidD(230, 430, 110, 120, raw * .8));
              water.setAttribute('height', S.f1(106 * (1 - raw * .9)));
            }, W.ease.linear);
            if (!api.alive()) return;
            stream.setAttribute('d', '');
            await api.tween(500, k => bottle.setAttribute('transform', `rotate(${S.f1(115 * (1 - k))} 170 200)`));
            api.say('The water flows out in a stream. It pours!');
            tried.add('water'); busy = false; check();
          }, { cls: 'primary' });
          api.button('🪵 Tip the box', async b => {
            if (busy) return;
            busy = true; b.disabled = true;
            await api.tween(800, k => {
              box.setAttribute('transform', `rotate(${S.f1(-k * 120)} 600 220)`);
              block.setAttribute('transform', `rotate(${S.f1(-k * 120)} 600 220)`);
            });
            if (!api.alive()) return;
            api.sfx('whoosh');
            // The block falls out in one piece and lands on the table
            await api.tween(600, k => block.setAttribute('transform', `translate(${S.f1(-60 * k)} ${S.f1(k * k * 136)}) rotate(${S.f1(-120 + k * 30)} 600 220)`), W.ease.linear);
            if (!api.alive()) return;
            api.sfx('thud');
            block.setAttribute('transform', 'translate(-60 136) rotate(-90 600 220)');
            await api.tween(500, k => box.setAttribute('transform', `rotate(${S.f1(-120 * (1 - k))} 600 220)`));
            api.say('Thud! The block fell out in one piece. It kept its shape. It did not pour.');
            tried.add('block'); busy = false; check();
          }, { cls: 'primary' });
        },
      },

      // ---------- d) Different containers ----------
      {
        text: ['Solids keep their shape in different **containers**. Their size stays the same.'],
        ask: 'Drag the solid block into each container. Does its shape change?',
        activity: true,
        scene(stage, api) {
          const C = [
            { id: 'tall', x1: 80, x2: 240, rest: { x: 160, y: 380 }, rot: 0, d: 'M70 196 L80 206 L80 412 Q80 420 88 420 L232 420 Q240 420 240 412 L240 206 L250 196' },
            { id: 'wide', x1: 300, x2: 560, rest: { x: 470, y: 380 }, rot: 0, d: 'M290 196 L300 206 L300 412 Q300 420 308 420 L552 420 Q560 420 560 412 L560 206 L570 196' },
            { id: 'bowl', x1: 600, x2: 780, rest: { x: 694, y: 372 }, rot: 16, d: 'M622 216 L630 226 A96 96 0 1 0 754 226 L762 216' },
          ];
          const svg = api.svg(`
            <rect width="800" height="520" fill="#F7F4FB"/>
            ${C.map(c => `<path d="${c.d}" fill="#fff" stroke="#3B3F6B" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/>`).join('')}
            ${C.map((c, i) => `<g id="l4-sol4-tick${i}"></g>`).join('')}
            <g id="l4-sol4-block" transform="translate(400 90)"><g class="l4-sol4-rot">
              <rect x="-40" y="-40" width="80" height="80" fill="#757575" stroke="#424242" stroke-width="3"/>
              ${S.text(0, 7, 'solid', { size: 20, fill: '#fff' })}</g></g>
            <text id="l4-sol4-hint" x="400" y="160" text-anchor="middle" font-size="18" font-weight="800" fill="#4A2D8A" class="blink-hint">👆 Drag me</text>
            <g transform="translate(20 20)"><rect width="230" height="44" rx="22" fill="#fff" opacity=".92"/>
              ${S.text(115, 29, '📦 Containers: ', { size: 19 }).replace('</text>', '<tspan id="l4-sol4-n">0</tspan> of 3</text>')}</g>`);
          const node = S.q(svg, '#l4-sol4-block'), rot = S.q(node, '.l4-sol4-rot');
          const visited = new Set();
          const d = api.draggable(svg, node, {
            bounds: { x1: 50, y1: 50, x2: 750, y2: 470 },
            onStart: () => { api.sfx('pick'); rot.setAttribute('transform', ''); const h = S.q(svg, '#l4-sol4-hint'); if (h) h.remove(); },
            onDrop: p => {
              const c = C.find(q => p.x > q.x1 && p.x < q.x2 && p.y > 150);
              if (!c) return false;
              d.animateTo(c.rest.x, c.rest.y, 300);
              rot.setAttribute('transform', `rotate(${c.rot})`);
              api.sfx('thud');
              if (!visited.has(c.id)) {
                visited.add(c.id);
                S.q(svg, '#l4-sol4-n').textContent = visited.size;
                const i = C.indexOf(c);
                S.q(svg, `#l4-sol4-tick${i}`).innerHTML = `<g class="pop-in">${L4.pill((c.x1 + c.x2) / 2, 470, '✔ same shape', { size: 16, fill: '#E3F4DE', stroke: '#3E9B4F' })}</g>`;
              }
              if (visited.size === 3) {
                api.star();
                api.praise('The block kept its shape and its size in every container.');
              } else api.say('The block keeps its shape. It is still the same size.');
              return true;
            },
          });
        },
      },

      // ---------- e) Cannot be compressed ----------
      {
        text: [
          'Solids cannot be **compressed**.',
          'Look at this solid wooden box. The girl is stepping on it, but it does not compress.',
        ],
        tip: 'Compressed means **squashed** together.',
        ask: 'Drag the girl onto the box. Then make her jump!',
        activity: true,
        scene(stage, api) {
          const svg = api.svg(`
            <rect width="800" height="520" fill="#FFF8EC"/>
            <rect y="430" width="800" height="90" fill="#E9CFA6"/>
            <rect id="l4-sol5-box" x="380" y="330" width="120" height="100" fill="#E53935" stroke="#8E1B1B" stroke-width="3"/>
            <path d="M380 330 L404 306 L524 306 L500 330Z" fill="#EF5350" stroke="#8E1B1B" stroke-width="3"/>
            <path d="M500 330 L524 306 L524 406 L500 430Z" fill="#B71C1C" stroke="#8E1B1B" stroke-width="3"/>
            <g transform="translate(580 0)"><rect x="0" y="322" width="34" height="116" rx="3" fill="#8FD0F5" stroke="#3B8DB5" stroke-width="1.5"/>
              ${[...Array(11)].map((_, i) => `<path d="M0 ${430 - i * 10} l${i % 5 ? 8 : 14} 0" stroke="#1A3A5A" stroke-width="1.5"/>`).join('')}
              <path d="M-80 330 L0 330" stroke="#1A3A5A" stroke-width="2" stroke-dasharray="5 4"/></g>
            <g id="l4-sol5-tag" transform="translate(680 300)"><rect x="-80" y="-24" width="160" height="48" rx="12" fill="#fff" stroke="#3B3F6B" stroke-width="2"/>
              <text id="l4-sol5-h" y="8" text-anchor="middle" font-size="18" font-weight="800" fill="#3B3F6B">height: 10 cm</text></g>
            <g id="l4-sol5-kid" transform="translate(180 430)">${S.kid({ x: 0, y: 0, s: 1.05, skin: '#B5733F', hair: '#3A2312', shirt: '#80CBC4', coat: false })}
              <rect x="-50" y="-230" width="100" height="232" fill="#fff" opacity="0"/></g>
            <text id="l4-sol5-hint" x="180" y="470" text-anchor="middle" font-size="18" font-weight="800" fill="#4A2D8A" class="blink-hint">👆 Drag me</text>`);
          const kid = S.q(svg, '#l4-sol5-kid');
          let onBox = false, jumps = 0, busy = false;
          const d = api.draggable(svg, kid, {
            bounds: { x1: 80, y1: 250, x2: 720, y2: 430 },
            onStart: () => { if (!onBox) api.sfx('pick'); const h = S.q(svg, '#l4-sol5-hint'); if (h) h.remove(); },
            onDrop: p => {
              if (onBox) return false;
              if (Math.abs(p.x - 440) < 90) {
                onBox = true;
                d.animateTo(440, 306, 300);
                kid.style.cursor = 'default';
                api.sfx('thud');
                api.say('She is standing on the box. It does not get squashed!');
                jump.disabled = false; jump.classList.add('pulse');
                return true;
              }
              return false;
            },
          });
          const jump = api.button('⬆️ Jump!', async () => {
            if (busy || !onBox) return;
            busy = true; jump.classList.remove('pulse');
            api.sfx('swoosh');
            await api.tween(650, k => kid.setAttribute('transform', `translate(440 ${S.f1(306 - Math.sin(k * Math.PI) * 110)})`), W.ease.linear);
            if (!api.alive()) return;
            api.sfx('thud');
            const h = S.q(svg, '#l4-sol5-h');
            h.setAttribute('fill', '#C62828');
            api.timeout(() => h.setAttribute('fill', '#3B3F6B'), 600);
            jumps++;
            busy = false;
            if (jumps < 3) api.say(jumps === 1 ? 'Thump! The box is still 10 centimetres high.' : 'Thump! It still does not compress.');
            else if (jumps === 3) {
              api.star();
              api.praise('The box did not get any smaller. Solids cannot be compressed.');
            }
          }, { cls: 'primary', sound: null });
          jump.disabled = true;
        },
      },
    ],
  });
})();
