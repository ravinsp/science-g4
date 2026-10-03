// Chapter 4: Gases
(() => {
  // Side view of a child's head, facing right. x,y = centre of the face
  const head = (x, y, { skin = '#C68B59', hair = '#3A2312', puff = 0 } = {}) => `<g transform="translate(${x} ${y})">
    <path d="M-60 60 Q-70 120 -40 150 L60 150 Q70 110 40 64Z" fill="#1E5AA8"/>
    <circle r="66" fill="${skin}" stroke="#7A4A26" stroke-width="3"/>
    <path d="M-66 -6 C-74 -70 30 -92 62 -30 C30 -52 -10 -54 -30 -30 C-40 -20 -50 -8 -66 -6Z" fill="${hair}"/>
    <circle cx="-40" cy="8" r="14" fill="${skin}" stroke="#7A4A26" stroke-width="3"/>
    <circle cx="30" cy="-6" r="10" fill="#fff" stroke="#333" stroke-width="2"/><circle cx="33" cy="-6" r="5" fill="#2B1B10"/>
    <circle cx="${f(28 + puff * 6)}" cy="26" r="${f(12 + puff * 6)}" fill="#E39A85" opacity=".6"/>
    <ellipse cx="62" cy="30" rx="${f(5 + puff * 2)}" ry="${f(6 + puff * 2)}" fill="#7A2E1E"/></g>`;
  const f = S.f1;

  App.chapter({
    id: 'gases',
    title: 'Gases',
    icon: '🎈',
    group: 'Solids, liquids and gases',
    keywords: [
      { w: 'air', d: 'The gas all around us that we breathe. We cannot see it.' },
      { w: 'blowing', d: 'Pushing air out of your mouth.' },
      { w: 'straw', d: 'A thin tube you can drink or blow through.' },
      { w: 'bubbles', d: 'Round balls of gas inside a liquid or inside a thin skin of soapy water.' },
      { w: 'balloon', d: 'A thin rubber bag that gets bigger when you fill it with gas.' },
      { w: 'helium', d: 'A gas that is lighter than air. Balloons filled with it float up.' },
    ],
    steps: [
      // ---------- a) Evidence of air ----------
      {
        text: ['The **air** around us is a gas. We cannot see air but we can find evidence that it is there.'],
        ask: ['Blow some air onto your hands. Can you feel the air on your hands?', 'Press and hold Blow. What does the air do?'],
        activity: true,
        scene(stage, api) {
          const svg = api.svg(`
            <rect width="800" height="520" fill="#EAF6FF"/>
            <rect y="460" width="800" height="60" fill="#CFE3EE"/>
            <g id="l4-gas1-head"></g>
            <g id="l4-gas1-wind" opacity="0"></g>
            <g transform="translate(330 300)"><path d="M-30 60 Q-40 10 -20 -30 Q-10 -46 4 -36 L10 -50 Q20 -60 28 -48 L24 -20 L40 -40 Q50 -46 54 -36 L36 0 Q50 10 46 40 L30 70Z" fill="#C68B59" stroke="#7A4A26" stroke-width="3"/></g>
            <g transform="translate(560 170)">
              <path d="M0 0 L0 270" stroke="#8D6E63" stroke-width="8" stroke-linecap="round"/>
              <g id="l4-gas1-pin">${['#E53935', '#FDD835', '#1E88E5', '#43A047'].map((c, i) => `<path d="M0 0 L0 -60 Q36 -50 0 0Z" fill="${c}" transform="rotate(${i * 90})"/>`).join('')}<circle r="7" fill="#fff" stroke="#555" stroke-width="2"/></g></g>
            <g transform="translate(680 230)"><path d="M0 0 L0 230" stroke="#8D6E63" stroke-width="6"/>
              <g id="l4-gas1-str"></g></g>`);
          const headG = S.q(svg, '#l4-gas1-head'), wind = S.q(svg, '#l4-gas1-wind'), pin = S.q(svg, '#l4-gas1-pin'), str = S.q(svg, '#l4-gas1-str');
          let blowing = false, blowK = 0, spin = 0, total = 0, starred = false;
          api.loop((dt, t) => {
            blowK += ((blowing ? 1 : 0) - blowK) * Math.min(1, dt * 5);
            headG.innerHTML = head(170, 250, { puff: blowK });
            spin += blowK * dt * 900;
            pin.setAttribute('transform', `rotate(${f(spin % 360)})`);
            wind.setAttribute('opacity', f(blowK * .7));
            wind.innerHTML = [0, 1, 2, 3, 4].map(i => {
              const x = 250 + ((t * 300 + i * 90) % 450), y = 280 + (i - 2) * 22 + Math.sin(t * 6 + i) * 6;
              return `<path d="M${f(x)} ${f(y)} q20 -8 40 0 t40 0" stroke="#90CAF9" stroke-width="3" fill="none" stroke-linecap="round"/>`;
            }).join('');
            str.innerHTML = ['#E53935', '#FDD835', '#1E88E5'].map((c, i) => {
              const sw = blowK * (40 + Math.sin(t * 14 + i) * 10);
              return `<path d="M0 ${i * 14} q${f(sw * .5)} ${f(30 - blowK * 20)} ${f(sw)} ${f(70 - blowK * 60)}" stroke="${c}" stroke-width="7" fill="none" stroke-linecap="round"/>`;
            }).join('');
            if (blowing) {
              total += dt;
              if (total > 2.5 && !starred) {
                starred = true;
                api.star();
                api.praise('We cannot see the air, but the windmill spins and the ribbons move. That is evidence that air is there.');
              }
            }
          });
          L4.hold(api, '🌬️ Hold to blow', {
            onDown: () => { blowing = true; api.sfx('wind'); },
            onUp: () => { blowing = false; },
          });
        },
      },

      // ---------- b) Blowing through a straw ----------
      {
        text: [
          'This child is **blowing** air into the **straw**.',
          'It makes **bubbles** in his drink. The bubbles are full of air.',
        ],
        ask: 'Press and hold Blow to blow through the straw.',
        activity: true,
        scene(stage, api) {
          const svg = api.svg(`
            <clipPath id="l4-gas2-clip"><path d="M300 200 L500 200 L476 470 L324 470Z"/></clipPath>
            <rect width="800" height="520" fill="#FBEFE6"/>
            <g id="l4-gas2-head"></g>
            <path d="M200 252 L380 300 L390 448" stroke="#E53935" stroke-width="14" fill="none" stroke-linejoin="round" stroke-linecap="round"/>
            <path d="M200 252 L380 300 L390 448" stroke="#fff" stroke-width="5" fill="none" stroke-dasharray="10 12" stroke-linejoin="round"/>
            <g clip-path="url(#l4-gas2-clip)">
              <rect x="290" y="250" width="220" height="230" fill="#FFB74D"/>
              <g id="l4-gas2-foam"></g>
              <g id="l4-gas2-bub"></g>
            </g>
            <path d="M300 200 L324 470 L476 470 L500 200" fill="url(#g-glass)" stroke="#9E3B26" stroke-width="5" stroke-linejoin="round"/>
            <path d="M310 330 L490 330 L484 400 L316 400Z" fill="#E53935" opacity=".85"/>
            <g transform="translate(20 20)"><rect width="200" height="44" rx="22" fill="#fff" opacity=".92"/>
              ${S.text(100, 29, '🫧 Bubbles: ', { size: 19 }).replace('</text>', '<tspan id="l4-gas2-n">0</tspan></text>')}</g>`);
          const headG = S.q(svg, '#l4-gas2-head'), bubG = S.q(svg, '#l4-gas2-bub'), foam = S.q(svg, '#l4-gas2-foam'), nT = S.q(svg, '#l4-gas2-n');
          headG.innerHTML = `<g transform="translate(-40 0)">${head(170, 220, {})}</g>`;
          const bubs = [];
          let blowing = false, made = 0, starred = false, acc = 0, foamK = 0;
          api.loop((dt, t) => {
            if (blowing) {
              acc += dt;
              while (acc > .09) {
                acc -= .09;
                const el = S.el('circle', { fill: '#FFF3E0', 'fill-opacity': .45, stroke: '#fff', 'stroke-width': 2 }, bubG);
                bubs.push({ x: 390 + (Math.random() - .5) * 10, y: 446, r: 5 + Math.random() * 9, v: 60 + Math.random() * 60, el, ph: Math.random() * 6 });
                made++;
                nT.textContent = made;
                if (made % 4 === 0) api.sfx('bubble');
              }
              foamK = Math.min(1, foamK + dt * .2);
            } else foamK = Math.max(0, foamK - dt * .05);
            for (let i = bubs.length - 1; i >= 0; i--) {
              const b = bubs[i];
              b.y -= b.v * dt; b.v += 40 * dt;
              b.x += Math.sin(t * 5 + b.ph) * 20 * dt;
              if (b.y < 258) { b.el.remove(); bubs.splice(i, 1); continue; }
              b.el.setAttribute('cx', f(b.x)); b.el.setAttribute('cy', f(b.y)); b.el.setAttribute('r', f(b.r));
            }
            foam.innerHTML = foamK > .02 ? [...Array(14)].map((_, i) => `<circle cx="${300 + i * 15}" cy="${f(254 - foamK * 18 + Math.sin(t * 3 + i) * 3)}" r="${f(6 + foamK * 12 + (i % 3) * 3)}" fill="#FFF3E0" stroke="#FFCC80" stroke-width="1.5"/>`).join('') : '';
            if (made >= 30 && !starred) {
              starred = true;
              api.star();
              api.praise('Blowing air through the straw makes bubbles. Each bubble is full of air.');
            }
          });
          L4.hold(api, '🌬️ Hold to blow', { onDown: () => { blowing = true; }, onUp: () => { blowing = false; } });
        },
      },

      // ---------- c) Blowing bubbles ----------
      {
        text: ['Try blowing bubbles like this.', 'You are putting air into each bubble.'],
        ask: 'Hold Blow to make a bubble. Let go to set it free. Then click the bubbles to pop them!',
        activity: true,
        scene(stage, api) {
          const svg = api.svg(`
            <defs><radialGradient id="l4-gas3-b" cx=".35" cy=".3" r=".75">
              <stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset=".25" stop-color="#E1F5FE" stop-opacity=".15"/>
              <stop offset=".8" stop-color="#CE93D8" stop-opacity=".25"/><stop offset="1" stop-color="#4FC3F7" stop-opacity=".7"/></radialGradient></defs>
            <rect width="800" height="520" fill="url(#g-sky)"/>
            ${S.ground({ y: 470, w: 800, h: 50, fill: 'url(#g-grass)', grass: true })}
            <g id="l4-gas3-free"></g>
            <g id="l4-gas3-kid"></g>
            <path d="M240 290 L300 270" stroke="#7E57C2" stroke-width="7" stroke-linecap="round"/>
            <circle cx="318" cy="264" r="18" fill="none" stroke="#7E57C2" stroke-width="6"/>
            <circle id="l4-gas3-grow" cx="318" cy="264" r="0" fill="url(#l4-gas3-b)" stroke="#B3E5FC" stroke-width="2"/>
            <g transform="translate(20 20)"><rect width="200" height="44" rx="22" fill="#fff" opacity=".92"/>
              ${S.text(100, 29, '💥 Popped: ', { size: 19 }).replace('</text>', '<tspan id="l4-gas3-n">0</tspan> of 5</text>')}</g>`);
          S.q(svg, '#l4-gas3-kid').innerHTML = head(150, 250, { skin: '#E0AC84', hair: '#3A1D0B' });
          const grow = S.q(svg, '#l4-gas3-grow'), free = S.q(svg, '#l4-gas3-free');
          const bubs = [];
          let blowing = false, r = 0, popped = 0, puff = 0;
          api.loop((dt, t) => {
            if (blowing) r = Math.min(70, r + dt * 40);
            puff += ((blowing ? 1 : 0) - puff) * Math.min(1, dt * 6);
            S.q(svg, '#l4-gas3-kid').innerHTML = head(150, 250, { skin: '#E0AC84', hair: '#3A1D0B', puff });
            grow.setAttribute('r', f(r)); grow.setAttribute('cx', f(318 + r * .9));
            bubs.forEach(b => {
              b.x += b.vx * dt; b.y += Math.sin(t * 1.5 + b.ph) * 14 * dt - 12 * dt;
              if (b.x > 860 || b.y < -80) { b.x = 340; b.y = 260; }
              b.el.setAttribute('transform', `translate(${f(b.x)} ${f(b.y)})`);
            });
          });
          L4.hold(api, '🫧 Hold to blow', {
            onDown: () => { blowing = true; api.sfx('wind'); },
            onUp: () => {
              blowing = false;
              if (r < 14) { r = 0; return; }
              const el = S.frag(`<g class="hot" transform="translate(${f(318 + r * .9)} 264)"><circle r="${f(r)}" fill="url(#l4-gas3-b)" stroke="#B3E5FC" stroke-width="2"/></g>`);
              free.appendChild(el);
              bubs.push({ x: 318 + r * .9, y: 264, vx: 50 + Math.random() * 40, ph: Math.random() * 6, el, r });
              api.sfx('pop');
              api.say('You put air into the bubble!');
              r = 0;
            },
          });
          free.addEventListener('pointerdown', e => {
            const g = e.target.closest('g.hot');
            if (!g) return;
            const i = bubs.findIndex(b => b.el === g);
            if (i < 0) return;
            const b = bubs[i];
            bubs.splice(i, 1);
            api.sfx('pop');
            g.classList.remove('hot');
            g.innerHTML = [...Array(8)].map((_, k) => { const a = k * Math.PI / 4; return `<circle cx="${f(Math.cos(a) * b.r)}" cy="${f(Math.sin(a) * b.r)}" r="3" fill="#B3E5FC" class="fade-in"/>`; }).join('');
            api.timeout(() => g.remove(), 300);
            popped++;
            S.q(svg, '#l4-gas3-n').textContent = Math.min(popped, 5);
            if (popped === 5) {
              api.star();
              api.praise('Pop! When a bubble pops, the air inside it goes back into the air around us.');
            }
          });
        },
      },

      // ---------- d) Squashing a balloon ----------
      {
        text: [
          'There is some air inside this **balloon**. The air can be compressed.',
          'A gas can be compressed. A gas can change shape.',
        ],
        ask: 'Drag the hand down to squash the balloon. Watch the air inside.',
        activity: true,
        scene(stage, api) {
          const svg = api.svg(`
            <rect width="800" height="520" fill="#F5F5F5"/>
            <rect y="430" width="800" height="90" fill="#E0E0E0"/>
            <g id="l4-gas4-bal"></g>
            <g id="l4-gas4-hand" class="hot" transform="translate(0 0)">
              <path d="M260 110 Q340 80 420 96 L560 90 Q620 92 640 120 L640 150 L280 150 Q240 140 260 110Z" fill="#E9A87C" stroke="#B5703F" stroke-width="3"/>
              <path d="M300 120 L560 118 M300 136 L560 136" stroke="#B5703F" stroke-width="2" opacity=".5"/>
              <rect x="240" y="60" width="420" height="100" fill="#fff" opacity="0"/>
            </g>
            <text id="l4-gas4-hint" x="660" y="80" text-anchor="middle" font-size="18" font-weight="800" fill="#4A2D8A" class="blink-hint">👇 Drag down</text>
            <g transform="translate(20 20)"><rect width="280" height="44" rx="22" fill="#fff" opacity=".92"/>
              <text x="140" y="29" text-anchor="middle" font-size="19" font-weight="800">Space for the air: <tspan id="l4-gas4-p">100</tspan>%</text></g>`);
          const bal = S.q(svg, '#l4-gas4-bal'), hand = S.q(svg, '#l4-gas4-hand'), pT = S.q(svg, '#l4-gas4-p');
          const rr = S.rng(3);
          const parts = [...Array(26)].map(() => ({ x: rr() * 2 - 1, y: rr() * 2 - 1, vx: rr() * 2 - 1, vy: rr() * 2 - 1 }));
          let sq = 0, grab = null, done = false;
          api.loop(dt => {
            // Squashing makes it flatter and wider, but the space inside gets smaller
            const ry = 130 * (1 - sq * .45), rx = 150 * (1 + sq * .25), cy = 430 - ry;
            bal.innerHTML = `<ellipse cx="400" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}" fill="#FF7043" opacity=".92" stroke="#D84315" stroke-width="3"/>
              <ellipse cx="${f(400 - rx * .4)}" cy="${f(cy - ry * .45)}" rx="${f(rx * .14)}" ry="${f(ry * .2)}" fill="#fff" opacity=".4"/>` +
              parts.map(p => {
                p.x += p.vx * dt * .9; p.y += p.vy * dt * .9;
                if (Math.hypot(p.x, p.y) > .85) { p.vx *= -1; p.vy *= -1; p.x *= .97; p.y *= .97; }
                return `<circle cx="${f(400 + p.x * rx * .85)}" cy="${f(cy + p.y * ry * .85)}" r="6" fill="#FFE0B2"/>`;
              }).join('');
            hand.setAttribute('transform', `translate(0 ${f(cy - ry - 150)})`);
            pT.textContent = Math.round((1 - sq * .45) * (1 + sq * .25) * 100);
          });
          W.pointerDrag(hand, {
            onStart: e => { grab = { y: api.point(svg, e).y, s: sq }; api.sfx('pick'); const h = S.q(svg, '#l4-gas4-hint'); if (h) h.remove(); },
            onMove: e => {
              sq = S.clamp(grab.s + (api.point(svg, e).y - grab.y) / 150);
              if (sq > .85 && !done) {
                done = true;
                api.star();
                api.praise('The balloon got squashed and changed shape. The air inside was compressed into a smaller space.');
              }
            },
            onEnd: async () => {
              api.sfx('pop');
              const from = sq;
              await api.tween(500, k => { sq = from * (1 - k); }, W.ease.back);
            },
          });
        },
      },

      // ---------- e) Helium balloon ----------
      {
        text: ['This balloon has a gas called **helium** inside it.', 'A gas can be poured into a container.'],
        ask: 'Hold the button to fill the balloon with helium. Then let it go!',
        activity: true,
        scene(stage, api) {
          const star = k => {
            const pts = [...Array(10)].map((_, i) => {
              const a = -Math.PI / 2 + i * Math.PI / 5, r = (i % 2 ? 34 : 80) * k;
              return { x: Math.cos(a) * r, y: Math.sin(a) * r };
            });
            return L4.smooth(pts.flatMap((p, i) => { const q = pts[(i + 1) % 10]; return [p, { x: (p.x * 2 + q.x) / 3, y: (p.y * 2 + q.y) / 3 }, { x: (p.x + q.x * 2) / 3, y: (p.y + q.y * 2) / 3 }]; }));
          };
          const svg = api.svg(`
            <defs><linearGradient id="l4-gas5-foil" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFE082"/><stop offset=".5" stop-color="#FFA000"/><stop offset="1" stop-color="#E65100"/></linearGradient></defs>
            <rect width="800" height="520" fill="#EDE7F6"/>
            <rect y="0" width="800" height="18" fill="#B39DDB"/>
            <rect y="460" width="800" height="60" fill="#D1C4E9"/>
            <g transform="translate(140 460)">
              <rect x="-50" y="-260" width="100" height="260" rx="40" fill="#90A4AE" stroke="#546E7A" stroke-width="3"/>
              <rect x="-50" y="-150" width="100" height="40" fill="#CE93D8"/>${S.text(0, -122, 'HELIUM', { size: 16, fill: '#4A148C' })}
              <rect x="-14" y="-290" width="28" height="34" fill="#78909C"/><path d="M14 -280 L120 -280" stroke="#78909C" stroke-width="12"/>
            </g>
            <g id="l4-gas5-flow"></g>
            <g id="l4-gas5-bal" transform="translate(330 180)"><path id="l4-gas5-string" d="" stroke="#757575" stroke-width="2" fill="none"/>
              <path id="l4-gas5-star" d="${star(.15)}" fill="url(#l4-gas5-foil)" stroke="#E65100" stroke-width="3"/></g>
            <g transform="translate(20 30)"><rect width="230" height="44" rx="22" fill="#fff" opacity=".92"/>
              <text x="115" y="29" text-anchor="middle" font-size="19" font-weight="800">🎈 Full: <tspan id="l4-gas5-p">0</tspan>%</text></g>`);
          const balG = S.q(svg, '#l4-gas5-bal'), starP = S.q(svg, '#l4-gas5-star'), flow = S.q(svg, '#l4-gas5-flow'), str = S.q(svg, '#l4-gas5-string');
          let k = .15, filling = false, freed = false;
          api.loop((dt, t) => {
            if (filling && !freed) {
              k = Math.min(1, k + dt * .3);
              starP.setAttribute('d', star(k));
              S.q(svg, '#l4-gas5-p').textContent = Math.round((k - .15) / .85 * 100);
              flow.innerHTML = [0, 1, 2, 3].map(i => `<circle cx="${f(260 + ((t * 120 + i * 20) % 80))}" cy="${f(180 + Math.sin(t * 8 + i) * 3)}" r="5" fill="#CE93D8" opacity=".7"/>`).join('');
              if (k >= 1) {
                filling = false; flow.innerHTML = '';
                btn.disabled = true;
                letGo.disabled = false; letGo.classList.add('pulse');
                api.say('The balloon is full of helium. Now let it go!');
              }
            } else flow.innerHTML = '';
          });
          const btn = L4.hold(api, '🎈 Hold to fill', { onDown: () => { filling = true; api.sfx('wind'); }, onUp: () => { filling = false; } });
          const letGo = api.button('🖐 Let go', async () => {
            if (freed) return;
            freed = true; letGo.disabled = true; letGo.classList.remove('pulse');
            api.sfx('magic');
            await api.tween(2600, (e, raw) => {
              const y = 180 - e * 70, x = 330 + Math.sin(raw * 8) * 10 + e * 220;
              balG.setAttribute('transform', `translate(${f(x)} ${f(y + 0)}) rotate(${f(Math.sin(raw * 8) * 6)})`);
              str.setAttribute('d', `M0 80 q${f(Math.sin(raw * 9) * 16)} 60 0 ${f(120 + e * 140)}`);
            }, W.ease.out);
            if (!api.alive()) return;
            api.star();
            api.praise('The helium was poured into the balloon. Helium is lighter than air, so the balloon floats up!');
          }, { cls: 'primary', sound: null });
          letGo.disabled = true;
        },
      },

      // ---------- f) A gas fills the space ----------
      {
        text: ['Gases move around and fill the space they are in.'],
        ask: ['Some scientists work with this brown gas. Predict what happens if they take the lid off.', 'Pick your prediction. Then take the lid off.'],
        activity: true,
        scene(stage, api) {
          const svg = api.svg(`
            <rect width="800" height="520" fill="#FAFAFA"/>
            <rect x="20" y="20" width="760" height="430" rx="16" fill="#fff" stroke="#B0BEC5" stroke-width="4"/>
            ${S.text(400, 56, 'closed glass box', { size: 18, fill: '#90A4AE' })}
            <rect y="450" width="800" height="70" fill="#E0E0E0"/>
            <g id="l4-gas6-gas"></g>
            <rect x="330" y="150" width="140" height="290" rx="10" fill="url(#g-glass)" stroke="#78909C" stroke-width="4"/>
            <ellipse cx="400" cy="444" rx="86" ry="14" fill="#90A4AE"/>
            <g id="l4-gas6-lid" transform="translate(0 0)"><ellipse cx="400" cy="146" rx="84" ry="16" fill="#546E7A" stroke="#37474F" stroke-width="3"/></g>`);
          const gasG = S.q(svg, '#l4-gas6-gas'), lid = S.q(svg, '#l4-gas6-lid');
          const rr = S.rng(8);
          const P = [...Array(140)].map(() => ({ x: 340 + rr() * 120, y: 160 + rr() * 270, vx: (rr() - .5) * 80, vy: (rr() - .5) * 80, el: S.el('circle', { r: 16, fill: '#8D4E1A', opacity: .16 }, gasG) }));
          const JAR = { x1: 340, x2: 460, y1: 160, y2: 432 }, ROOM = { x1: 36, x2: 764, y1: 36, y2: 436 };
          let open = false, pred = null, spreadT = 0, done = false;
          api.loop(dt => {
            P.forEach(p => {
              p.vx += (Math.random() - .5) * 200 * dt; p.vy += (Math.random() - .5) * 200 * dt;
              p.vx = S.clamp(p.vx, -130, 130); p.vy = S.clamp(p.vy, -130, 130);
              // Inside the jar: stay in. Once open, the whole box is the space.
              const inJar = p.x > 330 && p.x < 470 && p.y > 150;
              if (open && inJar) p.vy -= 90 * dt;   // crowded in the jar, so it spills out of the top
              p.x += p.vx * dt; p.y += p.vy * dt;
              const b = !open ? JAR : inJar ? { x1: 340, x2: 460, y1: 0, y2: 432 } : ROOM;
              if (p.x < b.x1) { p.x = b.x1; p.vx = Math.abs(p.vx); } if (p.x > b.x2) { p.x = b.x2; p.vx = -Math.abs(p.vx); }
              if (p.y < b.y1) { p.y = b.y1; p.vy = Math.abs(p.vy); } if (p.y > b.y2) { p.y = b.y2; p.vy = -Math.abs(p.vy); }
              // Out of the jar, don't go back through its walls
              if (open && !inJar && p.y > 150 && p.x > 320 && p.x < 480) p.x = p.x < 400 ? 320 : 480;
              p.el.setAttribute('cx', f(p.x)); p.el.setAttribute('cy', f(p.y));
            });
            if (open && !done) {
              spreadT += dt;
              const out = P.filter(p => !(p.x > 330 && p.x < 470 && p.y > 150)).length;
              if (out > P.length * .75 || spreadT > 15) {
                done = true;
                api.star();
                api.praise(`${pred === 1 ? 'Your prediction was right! ' : ''}The brown gas moved out of the jar and spread through the whole box. Gases fill the space they are in.`);
                api.feedback(`${out} of ${P.length} bits of gas left the jar`, 'info');
              }
            }
          });
          const opts = ['It stays in the jar', 'It spreads out everywhere', 'It turns into a liquid'];
          const row = api.row();
          api.label('My prediction:', row);
          const pb = opts.map((o, i) => api.button(o, b => {
            pred = i;
            pb.forEach(x => x.classList.toggle('primary', x === b));
            api.say(`You predict: ${o}. Now take the lid off to test it.`);
            lidBtn.disabled = false; lidBtn.classList.add('pulse');
          }, { parent: row }));
          const lidBtn = api.button('🫙 Take the lid off', async () => {
            if (open) return;
            lidBtn.disabled = true; lidBtn.classList.remove('pulse'); pb.forEach(x => { x.disabled = true; });
            api.sfx('pop');
            await api.tween(800, k => lid.setAttribute('transform', `translate(${f(k * 220)} ${f(-k * 90)}) rotate(${f(k * 30)} 400 146)`));
            open = true;
            api.say('The lid is off. Watch the brown gas.');
          }, { cls: 'primary', sound: null });
          lidBtn.disabled = true;
        },
      },
    ],
  });
})();
