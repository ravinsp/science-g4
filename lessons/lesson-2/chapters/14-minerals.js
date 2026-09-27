// Chapter 14: Plants need minerals
(() => {
  const MIN_COLS = ['#FF9800', '#E91E63', '#9C27B0', '#03A9F4', '#FFEB3B'];

  // Small leaf picture for sort cards. kind: 'green' | 'yellow' | 'brown' | 'both'
  function leafCard(kind, shape = 'pointed', seed = 0) {
    const green = ['#4CAF50', '#43A047', '#5DBB63'][seed % 3];
    const col = kind === 'yellow' || kind === 'both' ? S.mix('#E6D44E', '#9CB93A', seed % 2 ? .25 : 0) : green;
    const vein = kind === 'yellow' || kind === 'both' ? '#6E9A2E' : null;
    const L = 74, Wd = shape === 'round' ? 20 : 24;
    const edge = kind === 'brown' || kind === 'both'
      ? `<path d="${S.leafPath(shape, L, Wd)}" transform="translate(16 35)" fill="none" stroke="#9A5B34" stroke-width="8" stroke-linejoin="round" opacity=".9"/>
         <path d="${S.leafPath(shape, L, Wd)}" transform="translate(16 35)" fill="none" stroke="#6D3F22" stroke-width="1.5"/>`
      : '';
    return `<svg viewBox="0 0 100 70">${S.leaf({ x: 8, y: 35, L, W: Wd, shape, color: col, vein, stalk: 8 })}${edge}</svg>`;
  }

  // Simple tractor facing left, (x,y) = ground under the back wheel
  function tractor(x, y, color = '#1E6FD9', cls = '') {
    const d = S.mix(color, '#000', .3);
    return `<g class="${cls}" transform="translate(${x} ${y})">
      <rect x="-62" y="-50" width="60" height="24" rx="5" fill="${color}" stroke="${d}" stroke-width="2"/>
      <rect x="-26" y="-84" width="34" height="40" rx="4" fill="${color}" stroke="${d}" stroke-width="2"/>
      <rect x="-20" y="-78" width="22" height="18" rx="2" fill="#CFEFFF" stroke="${d}" stroke-width="1.5"/>
      <rect x="-54" y="-64" width="6" height="16" fill="#555"/>
      <circle cx="-6" cy="-22" r="22" fill="#2B2A28"/><circle cx="-6" cy="-22" r="10" fill="#F2C14E"/>
      <circle cx="-52" cy="-14" r="14" fill="#2B2A28"/><circle cx="-52" cy="-14" r="6" fill="#F2C14E"/>
    </g>`;
  }

  App.chapter({
    id: 'minerals',
    title: 'Plants need minerals',
    icon: '🧪',
    group: 'What plants need',
    keywords: [
      { w: 'extra', d: 'More than usual. Something added on.' },
      { w: 'losing', d: 'Having less and less of something.' },
      { w: 'growers', d: 'People who grow plants, like farmers and gardeners.' },
      { w: 'fertiliser', d: 'Something we add to the soil to give plants more minerals.' },
      { w: 'waste', d: 'Something left over that is not needed, like animal poo.' },
      { w: 'human-made', d: 'Made by people, not by nature.' },
      { w: 'chemicals', d: 'Materials that can be mixed and changed in a factory to make new things.' },
    ],
    steps: [
      // ---------- a) Minerals help plants grow ----------
      {
        text: [
          'Minerals are the **extra** nutrients that help plants to grow well.',
          'Roots take in water and minerals. The minerals go up the stem to the leaves. This keeps them healthy.',
          'Minerals help the plant to stay green, to grow new leaves and to make fruit.',
        ],
        ask: 'Slide to add minerals to the soil. Watch what happens to the plant.',
        activity: true,
        scene(stage, api) {
          const r = S.rng(14);
          let specks = '';
          for (let i = 0; i < 44; i++) {
            specks += `<circle class="min-speck" cx="${S.f1(40 + r() * 460)}" cy="${S.f1(350 + r() * 150)}" r="${S.f1(3 + r() * 3)}" fill="${MIN_COLS[i % 5]}" stroke="#fff" stroke-width="1" opacity="0"/>`;
          }
          const svg = api.svg(`
            ${S.sky()}
            ${S.sun({ x: 80, y: 70, r: 32 })}
            <g class="float">${S.cloud({ x: 250, y: 70, s: .8 })}</g>
            <path d="M0 330 Q130 322 260 332 T520 330 L520 520 L0 520Z" fill="url(#g-soil)"/>
            <rect x="520" y="0" width="280" height="520" fill="#FFF8EC"/>
            <path d="M520 0 L520 520" stroke="#E7A07F" stroke-width="3"/>
            ${[...Array(24)].map((_, i) => `<ellipse cx="${(i * 97) % 510}" cy="${345 + (i * 41) % 160}" rx="${3 + i % 4}" ry="${2 + i % 3}" fill="#000" opacity=".15"/>`).join('')}
            <g id="min-specks">${specks}</g>
            <g id="min-plant"></g>
            <path id="min-stem" d="" fill="none" stroke="none"/>
            <g id="min-parts"></g>
            <g id="min-tag">${S.callout({ x: 200, y: 430, tx: 150, ty: 490, text: 'water with minerals', w: 210 })}</g>
            <g font-family="Nunito, sans-serif">
              ${S.text(660, 50, 'Plant health', { size: 24, fill: '#9A3222' })}
              <g id="min-checks"></g>
              <g transform="translate(560 330)">
                <rect width="200" height="150" rx="14" fill="#fff" stroke="#EADFCB" stroke-width="2"/>
                ${S.text(100, 30, 'Key', { size: 18 })}
                ${S.drop({ x: 30, y: 62, s: .9 })}${S.text(52, 67, 'water', { size: 17, anchor: 'start', weight: 700 })}
                ${MIN_COLS.map((c, i) => `<circle cx="${22 + i * 9}" cy="${104 + (i % 2) * 6}" r="5" fill="${c}"/>`).join('')}
                ${S.text(72, 112, 'minerals', { size: 17, anchor: 'start', weight: 700 })}
              </g>
            </g>
          `);
          const plantG = S.q(svg, '#min-plant'), stemEl = S.q(svg, '#min-stem');
          const speckEls = S.qa(svg, '.min-speck');
          const checks = S.q(svg, '#min-checks');
          const goals = [
            { at: .45, t: '🍃 Stays green' },
            { at: .7, t: '🌱 New leaves' },
            { at: .95, t: '🍅 Makes fruit' },
          ];
          let v = 0;
          const draw = () => {
            const opts = {
              x: 300, y: 332, h: 250, grow: .72 + .28 * v, droop: .18 * (1 - v),
              leaves: 3 + Math.round(v * 5), leafL: 54, leafW: 20, leafShape: 'pointed',
              leafColor: S.mix('#D6C443', '#4CAF50', v), stemColor: S.mix('#9BAF3A', '#43A047', v),
              fruit: v >= .95 ? 3 : v >= .8 ? 1 : 0, fruitColor: '#E53935',
              rootDepth: 120, rootSpread: 130, rootColor: '#EBD9B4', seed: 9,
            };
            plantG.innerHTML = S.plant(opts);
            stemEl.setAttribute('d', S.stemPath(opts));
            // Brown, dry edges when minerals are low
            if (v < .6) {
              S.qa(plantG, '.leaf').forEach(l => {
                const p = l.children[1];
                p.setAttribute('stroke', '#9A5B34');
                p.setAttribute('stroke-width', S.f1(1.5 + 5 * (1 - v / .6)));
              });
            }
            speckEls.forEach((s, i) => s.setAttribute('opacity', i < v * speckEls.length ? 1 : 0));
            checks.innerHTML = goals.map((g, i) => {
              const ok = v >= g.at;
              return `<g transform="translate(560 ${80 + i * 72})">
                <rect width="200" height="58" rx="29" fill="${ok ? '#E3F4DE' : '#F5F0E6'}" stroke="${ok ? '#3E9B4F' : '#D9CDB8'}" stroke-width="2.5"/>
                <text x="18" y="37" font-size="19" font-weight="800" fill="${ok ? '#2A7439' : '#9C9384'}">${g.t}</text>
                <text x="180" y="38" font-size="22" text-anchor="end" fill="${ok ? '#3E9B4F' : '#C9BFAE'}">${ok ? '✔' : '✖'}</text>
              </g>`;
            }).join('');
          };

          // Water and mineral particles: soil -> root -> up the stem
          const partsG = S.q(svg, '#min-parts');
          const parts = [];
          for (let i = 0; i < 26; i++) {
            const water = i % 3 === 0;
            const c = S.el('circle', { r: water ? 4 : 4.5, fill: water ? '#3BA7E5' : MIN_COLS[i % 5], stroke: '#fff', 'stroke-width': 1, opacity: 0 }, partsG);
            parts.push({ c, water, i, phase: -1, delay: i * .35 });
          }
          const reset = p => {
            p.x = 300 + (Math.random() - .5) * 300; p.y = 380 + Math.random() * 110;
            p.phase = 0; p.s = 0; p.end = .35 + Math.random() * .65;
          };
          api.loop((dt, el) => {
            let L = 0;
            try { L = stemEl.getTotalLength(); } catch (e) { return; }
            parts.forEach(p => {
              if (p.phase < 0) { if (el > p.delay) reset(p); else return; }
              const active = p.water || (p.i / parts.length) < v + .02;
              if (p.phase === 0) {
                const dx = 300 - p.x, dy = 336 - p.y, d = Math.hypot(dx, dy);
                if (d < 3) p.phase = 1;
                else { p.x += dx / d * Math.min(d, 70 * dt); p.y += dy / d * Math.min(d, 70 * dt); }
              } else {
                p.s += dt * .35;
                const pt = stemEl.getPointAtLength(Math.min(p.s, p.end) * L);
                p.x = pt.x; p.y = pt.y;
                if (p.s > p.end + .15) reset(p);
              }
              const fade = p.phase === 1 && p.s > p.end ? Math.max(0, 1 - (p.s - p.end) / .15) : 1;
              p.c.setAttribute('cx', S.f1(p.x)); p.c.setAttribute('cy', S.f1(p.y));
              p.c.setAttribute('opacity', active ? S.f1(fade) : 0);
            });
          });

          const names = ['none', 'a little', 'some', 'lots', 'plenty'];
          const says = [
            'No minerals. The leaves are losing their green colour and they are brown at the edges.',
            'A few minerals. The plant is still pale.',
            'Some minerals. The leaves are getting greener.',
            'Lots of minerals. The plant grows new leaves.',
            'Plenty of minerals! The plant is green and healthy, and it is making fruit.',
          ];
          let last = -1, ready = false;
          api.slider({
            label: '🧪 Minerals in the soil', min: 0, max: 4, step: .05, value: 0,
            format: x => names[Math.round(x)],
            onInput: x => {
              v = x / 4;
              draw();
              const si = Math.round(x);
              if (si !== last) {
                last = si;
                if (ready) { api.sfx(si > 2 ? 'grow' : 'tick'); api.say(says[si]); }
                if (si === 4 && ready) {
                  api.sfx('magic');
                  api.star();
                  api.timeout(() => api.praise('Minerals keep the plant green, help it grow new leaves and make fruit.'), 3500);
                }
              }
            },
          });
          ready = true;
        },
      },

      // ---------- b) Leaf doctor ----------
      {
        text: [
          'The leaves of this plant are **losing** their green colour.',
          'These leaves are brown at the edges.',
          'Both plants are not getting enough minerals.',
        ],
        ask: 'Be a leaf doctor! Drag each leaf to the right group.',
        activity: true,
        scene(stage, api) {
          const wrap = api.html(`<div class="min-doc">
            <div class="min-doc-head"><span class="min-doc-icon">🩺</span> <b>Leaf doctor</b> — is this leaf healthy, or does it need minerals?</div>
            <div class="min-doc-game"></div></div>`);
          if (!document.getElementById('min-style')) {
            document.head.insertAdjacentHTML('beforeend', `<style id="min-style">
              .min-doc { display:flex; flex-direction:column; gap:8px; height:100%; }
              .min-doc-head { font-size:19px; text-align:center; background:#E3F4DE; border-radius:14px; padding:6px 12px; }
              .min-doc-icon { display:inline-block; animation: wiggle 1s ease-in-out infinite; }
              .min-doc-game { flex:1; }
              .min-doc .sort-card { width:104px; }
            </style>`);
          }
          const sick = 'This leaf is losing its green colour or is brown at the edges. It needs minerals.';
          const well = 'This leaf is green all over. It is healthy!';
          const items = [
            { id: 'g1', bin: 'ok', svg: leafCard('green', 'pointed', 0), label: 'green leaf', hint: well },
            { id: 'g2', bin: 'ok', svg: leafCard('green', 'round', 1), label: 'green leaf', hint: well },
            { id: 'g3', bin: 'ok', svg: leafCard('green', 'heart', 2), label: 'green leaf', hint: well },
            { id: 'y1', bin: 'sick', svg: leafCard('yellow', 'pointed', 0), label: 'yellow leaf', say: 'A yellow leaf', hint: sick },
            { id: 'y2', bin: 'sick', svg: leafCard('yellow', 'round', 1), label: 'yellow leaf', say: 'A yellow leaf', hint: sick },
            { id: 'b1', bin: 'sick', svg: leafCard('brown', 'pointed', 1), label: 'brown edges', say: 'A leaf with brown edges', hint: sick },
            { id: 'b2', bin: 'sick', svg: leafCard('brown', 'heart', 0), label: 'brown edges', say: 'A leaf with brown edges', hint: sick },
            { id: 'b3', bin: 'sick', svg: leafCard('both', 'round', 2), label: 'yellow and brown', say: 'A yellow leaf with brown edges', hint: sick },
          ];
          api.sortGame(wrap.querySelector('.min-doc-game'), {
            bins: [{ id: 'ok', title: '💚 Healthy leaf' }, { id: 'sick', title: '🧪 Needs minerals' }],
            items,
            onDone: () => {
              api.star();
              api.timeout(() => api.sayAfter('Yellow leaves and brown edges tell us the plant is not getting enough minerals.'), 2200);
            },
          });
        },
      },

      // ---------- c) Growers and fertiliser ----------
      {
        text: [
          '**Growers** try to make sure their plants have enough minerals. We can give plants more minerals using **fertiliser**.',
          'Some fertiliser is made using **waste** from chickens. Animal waste contains minerals.',
          'This grower is using **human-made** fertiliser. The big bags contain fertiliser made from **chemicals** in a factory.',
        ],
        ask: 'Click each picture to see how growers give plants fertiliser.',
        activity: true,
        scene(stage, api) {
          const P = [12, 275, 538];
          const pw = 250, ph = 330, py = 16;
          let pellets = '';
          const r = S.rng(3);
          for (let i = 0; i < 26; i++) pellets += `<ellipse class="min-pel" cx="${S.f1(118 + r() * 34)}" cy="${S.f1(92 + r() * 16)}" rx="3.2" ry="2.4" fill="${i % 3 ? '#E8E0D0' : '#B7A88C'}" stroke="#7A6B55" stroke-width=".6"/>`;
          const svg = api.svg(`
            <rect width="800" height="520" fill="#FFF8EC"/>
            <defs>
              ${P.map((x, i) => `<clipPath id="min-pc${i}"><rect x="0" y="0" width="${pw}" height="${ph}" rx="16"/></clipPath>`).join('')}
            </defs>

            <!-- Panel 1: chicken pellets -->
            <g class="hot min-panel" data-i="0" transform="translate(${P[0]} ${py})">
              <g clip-path="url(#min-pc0)">
                <rect width="${pw}" height="${ph}" fill="#7A4326"/>
                ${[...Array(30)].map((_, i) => `<circle cx="${(i * 67) % 250}" cy="${(i * 43) % 330}" r="${4 + i % 5}" fill="${i % 2 ? '#8E5232' : '#5E3219'}"/>`).join('')}
                ${[40, 200].map(x => S.plant({ x, y: 300, h: 70, leaves: 4, leafL: 18, leafW: 8, roots: false, stemW: 3, seed: x })).join('')}
                <g id="min-drop1"></g>
                <g id="min-hand" transform="rotate(0 140 90)">
                  <path d="M250 -10 L250 40 Q200 50 176 60 L150 50 Z" fill="#3A2A20"/>
                  <path d="M178 58 C150 40 116 58 108 84 C102 104 126 118 150 112 C170 106 182 92 196 78 Z" fill="#F06292" stroke="#AD2F5C" stroke-width="2"/>
                  <path d="M112 86 C118 100 134 108 152 104" stroke="#AD2F5C" stroke-width="2" fill="none"/>
                  ${pellets}
                </g>
                <!-- little chicken -->
                <g transform="translate(40 60)">
                  <ellipse cx="0" cy="0" rx="22" ry="17" fill="#fff" stroke="#B0A89A" stroke-width="2"/>
                  <circle cx="16" cy="-14" r="10" fill="#fff" stroke="#B0A89A" stroke-width="2"/>
                  <path d="M14 -26 q3 -6 6 0 q3 -6 5 1" fill="#E53935"/>
                  <path d="M25 -14 l8 3 l-8 3z" fill="#FFB300"/><circle cx="18" cy="-16" r="2" fill="#222"/>
                  <path d="M-4 16 l-2 10 M4 16 l2 10" stroke="#FFB300" stroke-width="3"/>
                </g>
              </g>
              <rect width="${pw}" height="${ph}" rx="16" fill="none" stroke="#E07A4F" stroke-width="4"/>
            </g>

            <!-- Panel 2: tractor spreading animal waste -->
            <g class="hot min-panel" data-i="1" transform="translate(${P[1]} ${py})">
              <g clip-path="url(#min-pc1)">
                <rect width="${pw}" height="${ph}" fill="url(#g-sky)"/>
                <path d="M0 150 Q60 130 130 146 T250 138 L250 170 L0 170Z" fill="#7FA86A"/>
                <rect y="165" width="${pw}" height="170" fill="#D9A45B"/>
                ${[...Array(9)].map((_, i) => `<path d="M${-40 + i * 40} 335 L${80 + i * 22} 168" stroke="#C48D45" stroke-width="3"/>`).join('')}
                <g id="min-spray"></g>
                <g id="min-trac" transform="translate(0 0)">
                  <g transform="translate(60 0)">
                    ${tractor(50, 270)}
                    <path d="M50 250 L78 250" stroke="#555" stroke-width="5"/>
                    <path d="M76 210 L176 204 L182 256 L80 258 Z" fill="#F29D1B" stroke="#A8620A" stroke-width="2.5"/>
                    <path d="M80 214 L176 208" stroke="#6B3E1A" stroke-width="8"/>
                    <circle cx="130" cy="262" r="16" fill="#2B2A28"/><circle cx="130" cy="262" r="6" fill="#F2C14E"/>
                  </g>
                </g>
              </g>
              <rect width="${pw}" height="${ph}" rx="16" fill="none" stroke="#E07A4F" stroke-width="4"/>
            </g>

            <!-- Panel 3: human-made fertiliser bags -->
            <g class="hot min-panel" data-i="2" transform="translate(${P[2]} ${py})">
              <g clip-path="url(#min-pc2)">
                <rect width="${pw}" height="${ph}" fill="url(#g-sky)"/>
                <g transform="translate(18 62)">
                  <path d="M0 90 L0 30 L30 50 L30 30 L60 50 L60 30 L90 50 L90 90 Z" fill="#9E9E9E" stroke="#616161" stroke-width="2"/>
                  <rect x="64" y="-6" width="14" height="46" fill="#757575"/>
                  <rect x="10" y="62" width="14" height="12" fill="#FFE082"/><rect x="40" y="62" width="14" height="12" fill="#FFE082"/>
                  ${S.text(45, 108, 'factory', { size: 16, fill: '#424242' })}
                  <g id="min-smoke" fill="#ECEFF1" opacity=".9"><circle cx="71" cy="-14" r="9"/><circle cx="80" cy="-28" r="12"/><circle cx="94" cy="-44" r="15"/></g>
                </g>
                <rect y="235" width="${pw}" height="100" fill="#8C9A8E"/>
                ${tractor(118, 300, '#D32F2F')}
                <path d="M118 262 L200 262 L204 290 L114 290Z" fill="#C62828" stroke="#7F1D1D" stroke-width="2"/>
                <g id="min-bags">
                  <path d="M150 170 L150 150 M185 170 L185 150" stroke="#555" stroke-width="3"/>
                  <path d="M130 170 Q132 164 150 166 Q168 164 172 170 L176 256 Q152 266 128 256 Z" fill="#FAFAFA" stroke="#9E9E9E" stroke-width="2"/>
                  <path d="M166 170 Q170 164 186 166 Q202 164 206 170 L210 256 Q188 266 164 256 Z" fill="#F5F5F5" stroke="#9E9E9E" stroke-width="2"/>
                  <rect x="140" y="200" width="24" height="18" rx="3" fill="#43A047"/><rect x="176" y="200" width="24" height="18" rx="3" fill="#43A047"/>
                </g>
              </g>
              <rect width="${pw}" height="${ph}" rx="16" fill="none" stroke="#E07A4F" stroke-width="4"/>
            </g>

            <g font-family="Nunito, sans-serif">
              ${['Chicken waste pellets', 'Animal waste on a field', 'Human-made fertiliser'].map((t, i) => `
                <g transform="translate(${P[i]} 362)">
                  <rect width="${pw}" height="44" rx="10" fill="#fff" stroke="#3B3F6B" stroke-width="2.5"/>
                  ${S.text(pw / 2, 29, t, { size: 18 })}
                  <g class="min-tick" data-i="${i}" opacity="0">
                    <circle cx="${pw - 6}" cy="0" r="16" fill="#3E9B4F"/>${S.text(pw - 6, 7, '✔', { size: 18, fill: '#fff' })}
                  </g>
                </g>`).join('')}
            </g>
            <g class="blink-hint">${S.text(400, 460, '👆 Click each picture', { size: 22, fill: '#9A3222' })}</g>
            <g id="min-bin" opacity="0">
              <rect x="170" y="428" width="460" height="76" rx="16" fill="#E3F4DE" stroke="#3E9B4F" stroke-width="2.5"/>
              ${S.text(400, 460, 'Animal waste and human-made fertiliser', { size: 19, fill: '#2A7439' })}
              ${S.text(400, 488, 'both give plants more minerals.', { size: 19, fill: '#2A7439' })}
            </g>
          `);
          const seen = new Set();
          const busy = {};
          const says = [
            'This grower is putting fertiliser into the soil. It is made using waste from chickens.',
            'This grower is putting animal waste onto a large field. Animal waste contains minerals.',
            'This grower is using human-made fertiliser. The big bags contain fertiliser made from chemicals in a factory.',
          ];

          // 1: the gloved hand tips and pellets fall onto the soil
          const anim1 = async () => {
            api.sfx('sprinkle');
            const hand = S.q(svg, '#min-hand'), dropG = S.q(svg, '#min-drop1');
            const pr = S.rng(Math.floor(Math.random() * 99));
            const falling = [...Array(22)].map(() => {
              const n = S.el('ellipse', { rx: 3, ry: 2.2, fill: pr() < .6 ? '#E8E0D0' : '#B7A88C', stroke: '#7A6B55', 'stroke-width': .6 }, dropG);
              return { n, x: 124 + pr() * 26, y: 110, vx: (pr() - .5) * 60, t: pr() * .4, land: 250 + pr() * 60 };
            });
            await api.tween(500, k => hand.setAttribute('transform', `rotate(${-18 * k} 150 90)`));
            await api.tween(1400, (k, raw) => {
              falling.forEach(f => {
                const tt = Math.max(0, raw * 1.4 - f.t);
                const y = Math.min(f.land, f.y + 400 * tt * tt);
                f.n.setAttribute('cx', S.f1(f.x + f.vx * tt));
                f.n.setAttribute('cy', S.f1(y));
              });
            }, W.ease.linear);
            api.sfx('drip');
            await api.tween(500, k => hand.setAttribute('transform', `rotate(${-18 * (1 - k)} 150 90)`));
          };

          // 2: the tractor drives across spraying muck behind it
          const anim2 = async () => {
            api.sfx('wind');
            const trac = S.q(svg, '#min-trac'), spray = S.q(svg, '#min-spray');
            const bits = [];
            spray.innerHTML = '';
            await api.tween(3200, (k, raw) => {
              const tx = -340 * raw;
              trac.setAttribute('transform', `translate(${S.f1(tx)} 0)`);
              if (Math.random() < .7) {
                const n = S.el('circle', { r: 2 + Math.random() * 4, fill: Math.random() < .5 ? '#6B3E1A' : '#8A5A2B' }, spray);
                bits.push({ n, x: tx + 242, y: 226, vx: 60 + Math.random() * 150, vy: -140 - Math.random() * 120, ground: 250 + Math.random() * 80 });
              }
              bits.forEach(b => {
                if (b.y < b.ground) { b.x += b.vx / 60; b.vy += 300 / 60; b.y += b.vy / 60; }
                b.n.setAttribute('cx', S.f1(b.x)); b.n.setAttribute('cy', S.f1(b.y));
              });
              if (Math.random() < .05) api.sfx('whoosh');
            }, W.ease.linear);
            if (!api.alive()) return;
            // Drive back in from the right
            await api.tween(1200, k => trac.setAttribute('transform', `translate(${S.f1(260 * (1 - k))} 0)`), W.ease.out);
            trac.setAttribute('transform', 'translate(0 0)');
          };

          // 3: smoke puffs from the factory and the bags drop down
          const anim3 = async () => {
            api.sfx('bubble');
            const smoke = S.q(svg, '#min-smoke'), bags = S.q(svg, '#min-bags');
            await api.tween(1200, k => smoke.setAttribute('transform', `translate(${6 * k} ${-10 * k}) scale(${1 + .3 * Math.sin(k * Math.PI)})`));
            await api.tween(700, k => bags.setAttribute('transform', `translate(0 ${S.f1(-90 * k)})`), W.ease.out);
            await api.tween(900, k => bags.setAttribute('transform', `translate(0 ${S.f1(-90 + 90 * k)})`), W.ease.bounce);
            api.sfx('thud');
            api.timeout(() => api.sfx('knock'), 250);
          };

          const anims = [anim1, anim2, anim3];
          S.qa(svg, '.min-panel').forEach(g => {
            g.addEventListener('click', async () => {
              const i = +g.dataset.i;
              if (busy[i]) return;
              busy[i] = true;
              api.say(says[i]);
              await anims[i]();
              busy[i] = false;
              if (!api.alive()) return;
              if (!seen.has(i)) {
                seen.add(i);
                api.sfx('pop');
                S.q(svg, `.min-tick[data-i="${i}"]`).setAttribute('opacity', 1);
                if (seen.size === 3) {
                  S.q(svg, '.blink-hint').setAttribute('opacity', 0);
                  S.q(svg, '#min-bin').setAttribute('opacity', 1);
                  api.button('🧺 Sort the fertilisers ▶', showSort, { cls: 'primary pulse', sound: 'page' });
                  api.sayAfter('Now sort the fertilisers!');
                }
              }
            });
          });

          // Sorting game: animal waste or human-made?
          const cards = {
            pellets: `<svg viewBox="0 0 100 70"><path d="M20 20 L80 20 L86 64 L14 64Z" fill="#8D6E63" stroke="#4E342E" stroke-width="2"/>${[...Array(14)].map((_, i) => `<ellipse cx="${26 + (i * 11) % 50}" cy="${30 + (i * 7) % 28}" rx="4" ry="3" fill="#E8E0D0" stroke="#7A6B55"/>`).join('')}<text x="84" y="22" text-anchor="middle" font-size="22">🐔</text></svg>`,
            cow: `<svg viewBox="0 0 100 70"><path d="M10 64 Q20 30 50 26 Q82 30 90 64Z" fill="#6B3E1A" stroke="#3E220D" stroke-width="2"/><path d="M30 44 q10 -6 20 0 M50 36 q8 -5 16 1" stroke="#8A5A2B" stroke-width="3" fill="none"/><text x="72" y="24" font-size="24">🐄</text></svg>`,
            horse: `<svg viewBox="0 0 100 70"><rect x="14" y="30" width="72" height="34" rx="6" fill="#A1887F" stroke="#5D4037" stroke-width="2"/><path d="M20 34 Q50 14 80 34" fill="#6B3E1A"/><text x="50" y="60" text-anchor="middle" font-size="24">🐴</text></svg>`,
            bag: `<svg viewBox="0 0 100 70"><path d="M28 12 Q50 6 72 12 L78 64 Q50 70 22 64Z" fill="#FAFAFA" stroke="#9E9E9E" stroke-width="2"/><rect x="36" y="30" width="28" height="18" rx="3" fill="#43A047"/><text x="80" y="24" font-size="22">🏭</text></svg>`,
            box: `<svg viewBox="0 0 100 70"><rect x="24" y="16" width="52" height="48" rx="4" fill="#FFCA28" stroke="#F57F17" stroke-width="2"/>${[...Array(10)].map((_, i) => `<rect x="${32 + (i * 9) % 36}" y="${30 + (i * 7) % 26}" width="6" height="6" transform="rotate(45 ${35 + (i * 9) % 36} ${33 + (i * 7) % 26})" fill="#29B6F6"/>`).join('')}</svg>`,
            bottle: `<svg viewBox="0 0 100 70"><rect x="42" y="6" width="16" height="10" fill="#E53935"/><path d="M36 16 L64 16 L68 30 L68 64 L32 64 L32 30Z" fill="#7CB342" stroke="#33691E" stroke-width="2"/><rect x="36" y="36" width="28" height="16" fill="#fff"/><text x="50" y="49" text-anchor="middle" font-size="11" font-weight="800" fill="#33691E">FEED</text></svg>`,
          };
          const showSort = () => {
            stage.innerHTML = '';
            api.controls.innerHTML = '';
            const box = api.html(`<div style="text-align:center;font-size:19px;font-weight:800;margin-bottom:6px">Is this fertiliser made from animal waste, or is it human-made?</div><div class="min-sort"></div>`);
            api.say('Is this fertiliser made from animal waste, or is it human-made? Drag each one to the right group.');
            api.sortGame(box.querySelector('.min-sort'), {
              bins: [{ id: 'animal', title: '🐔 Animal waste' }, { id: 'human', title: '🏭 Human-made' }],
              items: [
                { id: 'a', bin: 'animal', svg: cards.pellets, label: 'chicken pellets', hint: 'These pellets are made using waste from chickens.' },
                { id: 'b', bin: 'animal', svg: cards.cow, label: 'cow manure', hint: 'Manure is animal waste from cows.' },
                { id: 'c', bin: 'animal', svg: cards.horse, label: 'horse manure', hint: 'This is waste from horses.' },
                { id: 'd', bin: 'human', svg: cards.bag, label: 'big factory bag', hint: 'This fertiliser was made from chemicals in a factory.' },
                { id: 'e', bin: 'human', svg: cards.box, label: 'plant food crystals', hint: 'These crystals are made from chemicals in a factory.' },
                { id: 'f', bin: 'human', svg: cards.bottle, label: 'liquid plant feed', hint: 'This bottle of feed was made in a factory.' },
              ],
              onDone: () => api.star(),
            });
          };
        },
      },
    ],
  });
})();
