// Chapter 1: Solids, liquids and gases (introduction)
(() => {
  // Glass jug used on the first two pages
  const JUG = 'M292 142 L428 142 Q444 148 434 168 C472 250 482 340 452 418 Q446 432 430 432 L302 432 Q286 432 280 418 C250 340 258 250 296 168 Q286 150 292 142Z';
  const jug = (pre, inside = '') => `
    <clipPath id="${pre}-clip"><path d="${JUG}"/></clipPath>
    <path d="M286 186 C206 196 206 344 276 356" stroke="#B9D4E4" stroke-width="16" fill="none" stroke-linecap="round" opacity=".8"/>
    <path d="M286 186 C206 196 206 344 276 356" stroke="#EAF6FF" stroke-width="6" fill="none" stroke-linecap="round" opacity=".7"/>
    <g clip-path="url(#${pre}-clip)">
      <rect x="240" y="196" width="260" height="240" fill="#6FB4DA" opacity=".55"/>
      <path d="M240 196 Q300 188 360 196 T500 196 L500 206 L240 206Z" fill="#BFE3F7" opacity=".7"/>
      <path d="M320 222 L392 200 L398 232 Z" fill="#FFC93C" stroke="#E0A526" stroke-width="3"/>
      ${inside}
    </g>
    <path d="${JUG}" fill="url(#g-glass)" stroke="#C9E3F0" stroke-width="4" opacity=".9"/>
    <path d="M300 200 C284 260 284 350 304 410" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" opacity=".45"/>`;

  App.chapter({
    id: 'intro',
    title: 'Solids, liquids and gases',
    icon: '🧊',
    group: 'Getting started',
    steps: [
      // ---------- a) Ice and water ----------
      {
        text: [
          'Solids, liquids and gases have different properties. Let\'s look at some of them.',
          'Materials can be solids, liquids or gases. We call these states of matter.',
          'Look at the ice cubes in the picture. This is what water looks like when it is a solid.',
        ],
        ask: 'Click the ice cubes. Can you see liquid water in the picture? Click it too.',
        activity: true,
        scene(stage, api) {
          const svg = api.svg(`
            <rect width="800" height="520" fill="#1B1F27"/>
            <rect y="430" width="800" height="90" fill="#2A2F3A"/>
            <g data-f="water" class="hot"><path d="${L4.blob(610, 470, 80, 15, 4)}" fill="#7DB9DC" opacity=".6"/>
              <ellipse cx="590" cy="466" rx="30" ry="4" fill="#fff" opacity=".35"/></g>
            <g data-f="water" class="hot">${jug('l4-in1', L4.ice({ x: 400, y: 252, e: 42, rot: 14, op: .85 }))}</g>
            <g data-f="ice" class="hot">${L4.ice({ x: 190, y: 476, e: 74, rot: -6 })}<rect x="140" y="380" width="120" height="100" fill="#fff" opacity="0"/></g>
            <g data-f="ice" class="hot">${L4.ice({ x: 560, y: 440, e: 64, rot: 8 })}<rect x="516" y="360" width="110" height="84" fill="#fff" opacity="0"/></g>
            <path d="M120 462 Q130 446 172 450 L180 476 Q140 480 120 470Z" fill="#FFC93C" stroke="#E0A526" stroke-width="2"/>
            <g id="l4-in1-tags"></g>`);
          const tags = S.q(svg, '#l4-in1-tags');
          const found = new Set();
          svg.addEventListener('click', e => {
            const g = e.target.closest('[data-f]');
            if (!g) return;
            const f = g.dataset.f;
            api.sfx(f === 'ice' ? 'knock' : 'drip');
            if (found.has(f)) { api.say(f === 'ice' ? 'Ice is solid water.' : 'This is liquid water.'); return; }
            found.add(f);
            if (f === 'ice') {
              tags.insertAdjacentHTML('beforeend', `<g class="pop-in">${L4.pill(190, 80, 'solid water: ice', { fill: '#E3F4FF' })}</g>`);
              api.say('Yes! Ice cubes are water as a solid. They are hard and keep their shape.');
            } else {
              tags.insertAdjacentHTML('beforeend', `<g class="pop-in">${L4.pill(610, 80, 'liquid water', { fill: '#E3F4FF' })}</g>`);
              api.say('Yes! The water in the jug is liquid. So is the little pool on the table.');
            }
            if (found.size === 2) {
              api.star();
              api.timeout(() => api.praise('Ice and water are the same stuff, in two different states.'), 3200);
            }
          });
        },
      },

      // ---------- b) Condensation on the jug ----------
      {
        text: ['There is also water in the air that we cannot see. It is a gas.'],
        ask: ['Can you see drops of water on the sides of the jug? We call this condensation.', 'Rub the jug with the cloth to wipe the drops off. Then watch.'],
        activity: true,
        scene(stage, api) {
          const svg = api.svg(`
            <rect width="800" height="520" fill="#1B1F27"/>
            <rect y="430" width="800" height="90" fill="#2A2F3A"/>
            <g id="l4-in2-vap"></g>
            ${jug('l4-in2', L4.ice({ x: 360, y: 300, e: 46, rot: -10, op: .8 }) + L4.ice({ x: 410, y: 250, e: 40, rot: 16, op: .8 }))}
            <g id="l4-in2-drops"></g>
            ${S.text(620, 60, 'ice cold jug', { size: 22, fill: '#BFE3F7' })}
            <g id="l4-in2-cloth" transform="translate(640 330)">
              <path d="M-40 -30 Q0 -44 40 -30 L46 30 Q0 44 -46 30Z" fill="#F06292" stroke="#AD1457" stroke-width="3"/>
              <path d="M-30 -14 L30 -14 M-34 4 L34 4 M-34 20 L34 20" stroke="#fff" stroke-width="3" opacity=".5"/>
              <text id="l4-in2-hint" y="78" text-anchor="middle" font-size="18" font-weight="800" fill="#FFE56B" class="blink-hint">👆 Drag me</text>
            </g>
            <g transform="translate(20 20)"><rect width="230" height="44" rx="22" fill="#fff" opacity=".92"/>
              ${S.text(115, 29, '🧽 Drops wiped: ', { size: 19 }).replace('</text>', '<tspan id="l4-in2-n">0</tspan></text>')}</g>`);
          const dropG = S.q(svg, '#l4-in2-drops'), vapG = S.q(svg, '#l4-in2-vap'), cloth = S.q(svg, '#l4-in2-cloth'), nT = S.q(svg, '#l4-in2-n');
          // Inside the jug's outline (roughly an ellipse)
          const onJug = (x, y) => ((x - 366) / 96) ** 2 + ((y - 300) / 128) ** 2 < 1 && y > 175;
          const drops = [];
          const r = S.rng(9);
          const addDrop = () => {
            let x, y, n = 0;
            do { x = 266 + r() * 200; y = 175 + r() * 250; n++; } while (!onJug(x, y) && n < 30);
            const el = S.el('g', {}, dropG);
            const d = { x, y, r: 1.5, el, v: 0 };
            drops.push(d);
          };
          const drawDrop = d => {
            d.el.innerHTML = `<ellipse cx="${S.f1(d.x)}" cy="${S.f1(d.y)}" rx="${S.f1(d.r * .85)}" ry="${S.f1(d.r)}" fill="#E3F4FF" fill-opacity=".75" stroke="#9CCBE6" stroke-width="1"/><circle cx="${S.f1(d.x - d.r * .3)}" cy="${S.f1(d.y - d.r * .35)}" r="${S.f1(d.r * .3)}" fill="#fff"/>`;
          };
          for (let i = 0; i < 40; i++) { addDrop(); drops[i].r = 2 + r() * 4; drawDrop(drops[i]); }
          // Water vapour: faint dots drifting through the air
          const vap = [...Array(26)].map(() => ({ x: r() * 800, y: 40 + r() * 380, el: S.el('circle', { r: 3, fill: '#BFE3F7', opacity: .35 }, vapG) }));
          let wiped = 0, starred = false, wipedAt = 0, clock = 0;
          api.loop((dt, t) => {
            clock = t;
            vap.forEach((p, i) => {
              p.x += Math.sin(t * .7 + i) * 18 * dt + 10 * dt;
              p.y += Math.cos(t * .5 + i * 2) * 14 * dt;
              if (p.x > 810) p.x = -10;
              p.el.setAttribute('cx', S.f1(p.x)); p.el.setAttribute('cy', S.f1(p.y));
              // A vapour dot that touches the cold jug becomes a drop
              if (onJug(p.x, p.y) && drops.length < 90 && Math.random() < dt * 2) { addDrop(); }
            });
            if (drops.length < 90 && Math.random() < dt * 3) addDrop();
            drops.forEach(d => {
              if (d.r < 7) d.r += dt * (.6 + Math.random());
              else { d.v += dt * 40; d.y += d.v * dt; }   // big drops run down
              if (d.y > 428) { d.el.remove(); d.dead = true; }
              else drawDrop(d);
            });
            for (let i = drops.length - 1; i >= 0; i--) if (drops[i].dead) drops.splice(i, 1);
            if (starred === 'wait' && t - wipedAt > 4 && drops.length > 25) {
              starred = true;
              api.star();
              api.praise('The drops came back! Water from the air turns into liquid water on the cold jug. That is condensation.');
            }
          });
          let grab = null;
          W.pointerDrag(cloth, {
            onStart: e => {
              const p = api.point(svg, e);
              const m = /translate\(([-\d.]+) ([-\d.]+)\)/.exec(cloth.getAttribute('transform'));
              grab = { dx: p.x - m[1], dy: p.y - m[2] };
              api.sfx('pick');
              const h = S.q(svg, '#l4-in2-hint'); if (h) h.remove();
            },
            onMove: e => {
              const p = api.point(svg, e);
              const x = S.clamp(p.x - grab.dx, 40, 760), y = S.clamp(p.y - grab.dy, 40, 470);
              cloth.setAttribute('transform', `translate(${S.f1(x)} ${S.f1(y)})`);
              let n = 0;
              for (let i = drops.length - 1; i >= 0; i--) {
                const d = drops[i];
                if (Math.abs(d.x - x) < 50 && Math.abs(d.y - y) < 40) { d.el.remove(); drops.splice(i, 1); n++; }
              }
              if (n) {
                wiped += n;
                nT.textContent = wiped;
                if (Math.random() < .3) api.sfx('swoosh');
                if (wiped >= 30 && !starred) {
                  starred = 'wait';
                  wipedAt = clock;
                  api.say('Good wiping! Now stop and watch the jug.');
                }
              }
            },
            onEnd: () => api.sfx('drop'),
          });
        },
      },

      // ---------- c) Heating and cooling ----------
      {
        text: [
          'When a solid is heated it can change state, first to a liquid and then to a gas.',
          'When a gas is cooled it can change state, first to a liquid and then to a solid.',
        ],
        ask: 'Slide to heat the ice in the closed jar. Then slide back to cool it again.',
        activity: true,
        scene(stage, api) {
          const svg = api.svg(`
            <clipPath id="l4-in3-clip"><rect x="262" y="132" width="276" height="270" rx="18"/></clipPath>
            <rect width="800" height="520" fill="#F3F7FB"/>
            <g id="l4-in3-strip"></g>
            <rect id="l4-in3-plate" x="230" y="420" width="340" height="26" rx="8" fill="#B0BEC5"/>
            <g id="l4-in3-glow"></g>
            <rect x="200" y="446" width="400" height="40" rx="10" fill="#78909C"/>
            <g clip-path="url(#l4-in3-clip)"><g id="l4-in3-in"></g></g>
            <rect x="258" y="128" width="284" height="280" rx="22" fill="url(#g-glass)" stroke="#7A93A6" stroke-width="4"/>
            <rect x="244" y="106" width="312" height="30" rx="10" fill="#90A4AE" stroke="#607D8B" stroke-width="3"/>
            <path d="M282 160 L282 380" stroke="#fff" stroke-width="8" stroke-linecap="round" opacity=".5"/>`);
          const inG = S.q(svg, '#l4-in3-in'), strip = S.q(svg, '#l4-in3-strip'), glow = S.q(svg, '#l4-in3-glow');
          const states = [['solid', 'SOLID', '#1E88E5'], ['liquid', 'LIQUID', '#00897B'], ['gas', 'GAS', '#78909C']];
          const r = S.rng(5);
          const dots = [...Array(40)].map(() => ({ x: 280 + r() * 240, y: 150 + r() * 240, a: r() * 6 }));
          let v = 0, reachedGas = false, done = false, stateNow = 'solid';
          const draw = t => {
            const iceK = S.clamp((40 - v) / 22), gasK = S.clamp((v - 66) / 24);
            const liqK = Math.min(S.clamp((v - 18) / 22), 1 - gasK);
            let s = '';
            // Liquid pool at the bottom
            if (liqK > 0) s += `<rect x="262" y="${S.f1(404 - 70 * liqK)}" width="276" height="${S.f1(70 * liqK + 4)}" fill="#4FC3F7" opacity=".75"/>
              <path d="M262 ${S.f1(404 - 70 * liqK)} q34 -6 69 0 t69 0 t69 0 t69 0" stroke="#B3E5FC" stroke-width="3" fill="none"/>`;
            // Ice cube shrinks as it melts
            if (iceK > 0) s += `<g transform="translate(400 ${S.f1(404 - 70 * Math.max(0, liqK) * .4)}) scale(${S.f1(.4 + iceK * .6)})">${L4.ice({ x: 0, y: 0, e: 120 })}</g>`;
            // Gas: fast-moving dots fill the whole jar
            if (gasK > 0) s += dots.map((d, i) => {
              const x = 280 + ((d.x - 280 + Math.sin(t * 2 + d.a) * 60 + t * 40 * (i % 2 ? 1 : -1)) % 240 + 240) % 240;
              const y = 150 + ((d.y - 150 + Math.cos(t * 1.7 + d.a) * 50 + t * 30) % 240 + 240) % 240;
              return `<circle cx="${S.f1(x)}" cy="${S.f1(y)}" r="5" fill="#90A4AE" opacity="${S.f1(gasK * .7)}"/>`;
            }).join('');
            inG.innerHTML = s;
            stateNow = gasK > .5 ? 'gas' : iceK > .5 ? 'solid' : 'liquid';
            strip.innerHTML = states.map(([k, name, col], i) => {
              const on = k === stateNow, x = 150 + i * 250;
              return `<g transform="translate(${x} 52)"><rect x="-90" y="-30" width="180" height="60" rx="30" fill="${on ? col : '#fff'}" stroke="${col}" stroke-width="3"/>
                ${L4.stateIcon(k, -52, 0, .8)}${S.text(18, 8, name, { size: 22, fill: on ? '#fff' : col })}</g>${i < 2 ? S.arrow(x + 96, 52, x + 152, 52, { color: '#B0BEC5', w: 4, head: 10 }) : ''}`;
            }).join('');
            const heat = S.clamp((v - 50) / 50), cold = S.clamp((50 - v) / 50);
            glow.innerHTML = `<rect x="230" y="420" width="340" height="26" rx="8" fill="#FF5722" opacity="${S.f1(heat)}"/><rect x="230" y="420" width="340" height="26" rx="8" fill="#81D4FA" opacity="${S.f1(cold)}"/>`;
          };
          api.loop((dt, t) => draw(t));
          let last = 'solid', ready = false;
          api.slider({
            label: '❄️ Cool ↔ Heat 🔥', min: 0, max: 100, value: 0,
            format: x => x < 34 ? '🧊 Cold' : x < 67 ? '🌡️ Warm' : '🔥 Very hot',
            onInput: x => {
              v = x;
              draw(0);
              if (!ready) { ready = true; return; }
              if (stateNow !== last) {
                api.sfx(stateNow === 'gas' ? 'whoosh' : stateNow === 'liquid' ? 'drip' : 'knock');
                const up = ['solid', 'liquid', 'gas'].indexOf(stateNow) > ['solid', 'liquid', 'gas'].indexOf(last);
                api.say(up ? (stateNow === 'liquid' ? 'Heated: the solid ice changes to a liquid.' : 'Heated more: the liquid changes to a gas!')
                  : (stateNow === 'liquid' ? 'Cooled: the gas changes back to a liquid.' : 'Cooled more: the liquid changes back to a solid.'));
                last = stateNow;
                if (stateNow === 'gas') reachedGas = true;
                if (reachedGas && stateNow === 'solid' && !done) {
                  done = true;
                  api.star();
                  api.timeout(() => api.praise('Heating changes solid to liquid to gas. Cooling changes it back again.'), 2400);
                }
              }
            },
          });
        },
      },
    ],
  });
})();
