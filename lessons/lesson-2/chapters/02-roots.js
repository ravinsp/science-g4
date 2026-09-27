// Chapter 2: Roots
App.chapter({
  id: 'roots',
  title: 'Roots',
  icon: '🥕',
  group: 'Parts of a plant',
  keywords: [
    { w: 'roots', d: 'The parts of a plant that grow under the soil.' },
    { w: 'hairs', d: 'Tiny thin parts on roots that help them take in water.' },
    { w: 'take in', d: 'To let something come inside.' },
    { w: 'functions', d: 'Jobs. A function is the job something does.' },
    { w: 'minerals', d: 'Extra nutrients from the soil that help plants to grow well.' },
    { w: 'grow', d: 'To get bigger.' },
  ],
  steps: [
    {
      text: ['Look at this plant. It has **roots** in the soil.'],
      ask: 'Can you see the roots? Click the soil to look underground.',
      activity: true,
      scene(stage, api) {
        const svg = api.svg(`
          ${S.sky()}
          ${S.sun({ x: 90, y: 70, r: 32 })}
          ${S.plant({ x: 400, y: 250, h: 200, leaves: 7, leafL: 62, leafW: 22, leafStart: .25, leafShape: 'pointed', leafColor: '#5DBB63', rootDepth: 200, rootSpread: 170, hairs: true, rootColor: '#F3E6C8', rootW: 5, seed: 7 })}
          <g id="soil" class="hot">
            <path d="M0 250 Q200 240 400 252 T800 248 L800 520 L0 520Z" fill="url(#g-soil)"/>
            ${[...Array(40)].map((_, i) => `<ellipse cx="${(i * 71) % 800}" cy="${270 + (i * 37) % 240}" rx="${3 + i % 4}" ry="${2 + i % 3}" fill="#000" opacity=".18"/>`).join('')}
            <text x="400" y="400" text-anchor="middle" font-size="26" font-weight="800" fill="#fff" class="blink-hint">👆 Click the soil</text>
          </g>
          <path d="M0 250 Q200 240 400 252 T800 248 L800 520 L0 520Z" fill="#7A4B2A" opacity=".18" pointer-events="none"/>
          <g id="tag" opacity="0">${S.callout({ x: 470, y: 330, tx: 640, ty: 300, text: 'roots' })}</g>
        `);
        const soil = S.q(svg, '#soil');
        let open = false;
        const reveal = () => {
          open = !open;
          api.sfx(open ? 'whoosh' : 'thud');
          soil.style.transition = 'opacity 1s';
          soil.style.opacity = open ? .18 : 1;
          S.q(svg, '#tag').style.transition = 'opacity .8s .6s';
          S.q(svg, '#tag').setAttribute('opacity', open ? 1 : 0);
          S.q(soil, 'text').style.display = 'none';
          btn.innerHTML = open ? '🟫 Put the soil back' : '🔍 Look underground';
          if (open) {
            api.star();
            api.say('There are the roots! They spread out under the soil. Look at all the tiny hairs.');
          }
        };
        soil.addEventListener('click', reveal);
        const btn = api.button('🔍 Look underground', reveal, { cls: 'primary' });
      },
    },
    {
      text: ['Roots have many tiny **hairs** to help them **take in** a lot of water.'],
      ask: 'Make it rain, then watch the root hairs take in the water.',
      activity: true,
      scene(stage, api) {
        // A close-up view of one root inside a magnifying circle
        let hairs = '';
        const hairPts = [];
        for (let i = 0; i < 26; i++) {
          const x = 120 + i * 22, side = i % 2 ? 1 : -1;
          const y = 300 + Math.sin(i * .5) * 6;
          const len = 40 + (i * 7) % 30;
          const ex = x + (i % 3 - 1) * 10, ey = y + side * len;
          hairs += `<path d="M${x} ${y + side * 10} Q${x + 6} ${y + side * len * .6} ${ex} ${ey}" stroke="#F6EBD2" stroke-width="3" fill="none" stroke-linecap="round"/>`;
          hairPts.push({ x: ex, y: ey, bx: x, by: y });
        }
        const svg = api.svg(`
          <rect width="800" height="520" fill="#6B4226"/>
          ${[...Array(60)].map((_, i) => `<circle cx="${(i * 131) % 800}" cy="${(i * 71) % 520}" r="${4 + i % 6}" fill="${i % 2 ? '#7E5232' : '#5A361F'}"/>`).join('')}
          <clipPath id="lens"><circle cx="400" cy="280" r="222"/></clipPath>
          <g clip-path="url(#lens)">
            <rect width="800" height="520" fill="#8A5A34"/>
            ${[...Array(30)].map((_, i) => `<ellipse cx="${(i * 97) % 800}" cy="${(i * 53) % 520}" rx="${10 + i % 8}" ry="${7 + i % 5}" fill="#6E4527" opacity=".6"/>`).join('')}
            ${hairs}
            <path d="M60 300 Q400 280 760 305" stroke="#E9D6AE" stroke-width="30" fill="none" stroke-linecap="round"/>
            <path d="M60 296 Q400 276 760 301" stroke="#F8EDD4" stroke-width="10" fill="none" stroke-linecap="round" opacity=".7"/>
            <g id="drops"></g>
          </g>
          <circle cx="400" cy="280" r="222" fill="none" stroke="#455A64" stroke-width="16"/>
          <path d="M565 440 L640 500" stroke="#6D4C41" stroke-width="28" stroke-linecap="round"/>
          <g transform="translate(20 20)"><rect width="240" height="44" rx="22" fill="#fff" opacity=".92"/>
            <text x="120" y="29" text-anchor="middle" font-weight="800" font-size="19">💧 Water taken in: <tspan id="count">0</tspan></text></g>
          ${S.callout({ x: 520, y: 350, tx: 680, ty: 440, text: 'root hair' })}
        `);
        const dropsG = S.q(svg, '#drops');
        let taken = 0, starred = false;
        const drops = [];
        const addDrop = () => {
          const h = hairPts[Math.floor(Math.random() * hairPts.length)];
          const n = S.frag(S.drop({ x: h.x + (Math.random() - .5) * 60, y: h.y > 300 ? 520 : 60, s: .9 }));
          dropsG.appendChild(n);
          drops.push({ n, h, x: +n.getAttribute('transform').match(/translate\(([-\d.]+)/)[1], y: h.y > 300 ? 520 : 60, stage: 0 });
        };
        api.loop(dt => {
          for (let i = drops.length - 1; i >= 0; i--) {
            const d = drops[i];
            const tx = d.stage === 0 ? d.h.x : d.stage === 1 ? d.h.bx : 800;
            const ty = d.stage === 0 ? d.h.y : d.stage === 1 ? d.h.by : 300;
            const sp = d.stage === 2 ? 260 : 120;
            const dx = tx - d.x, dy = ty - d.y, dist = Math.hypot(dx, dy);
            if (dist < 4) {
              d.stage++;
              if (d.stage === 1) { api.sfx('drip'); }
              if (d.stage === 2) {
                taken++;
                S.q(svg, '#count').textContent = taken;
                if (taken >= 10 && !starred) {
                  starred = true; api.star();
                  api.praise('The root hairs took in lots of water. Now it moves along the root to the rest of the plant.');
                }
              }
              if (d.stage === 3) { d.n.remove(); drops.splice(i, 1); continue; }
            } else {
              d.x += dx / dist * Math.min(dist, sp * dt);
              d.y += dy / dist * Math.min(dist, sp * dt);
            }
            d.n.setAttribute('transform', `translate(${d.x.toFixed(1)} ${d.y.toFixed(1)}) scale(${d.stage ? .6 : .9})`);
          }
        });
        api.button('🌧️ Make it rain', () => {
          api.sfx('rain');
          for (let i = 0; i < 12; i++) api.timeout(addDrop, i * 150);
        }, { cls: 'primary pulse', sound: null });
      },
    },
    {
      text: [
        'Roots have two **functions**:<ol><li>Roots hold the plant in the ground.</li><li>Roots take in water and **minerals** from the soil.</li></ol>',
      ],
      tip: 'I remember that function means job.',
      ask: 'Blow the wind. Which plant stays in the ground?',
      activity: true,
      scene(stage, api) {
        const svg = api.svg(`
          ${S.sky()}
          <g id="clouds">${S.cloud({ x: 150, y: 80 })}${S.cloud({ x: 560, y: 60, s: .8 })}</g>
          <g id="with"><g id="withSway">${S.plant({ x: 230, y: 360, h: 190, leaves: 6, leafShape: 'round', flower: 'daisy', flowerColor: '#F06292', flowerCenter: '#FFD23F', petals: 9, rootDepth: 110, rootSpread: 90, seed: 4 })}</g></g>
          <g id="without">${S.plant({ x: 570, y: 360, h: 190, leaves: 6, leafShape: 'round', flower: 'daisy', flowerColor: '#F06292', flowerCenter: '#FFD23F', petals: 9, roots: false, seed: 4 })}</g>
          <path d="M0 360 Q200 352 400 362 T800 358 L800 520 L0 520Z" fill="url(#g-soil)" opacity=".86"/>
          ${S.text(230, 500, 'with roots', { fill: '#fff' })}${S.text(570, 500, 'no roots', { fill: '#fff' })}
          <g id="gusts" opacity="0">${[0, 1, 2].map(i => `<path d="M${20} ${140 + i * 70} q60 -20 120 0 t120 0" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" class="flow"/>`).join('')}</g>
          <g id="flows" opacity="0">
            <path d="${S.stemPath({ x: 230, y: 360, h: 190 })}" stroke="#3BA7E5" stroke-width="4" fill="none" class="flow"/>
            ${[...Array(10)].map((_, i) => `<circle class="min" cx="${150 + i * 18}" cy="${420 + (i % 3) * 20}" r="${i % 2 ? 4 : 5}" fill="${i % 2 ? '#3BA7E5' : '#FF9800'}"/>`).join('')}
          </g>
        `);
        const withSway = S.q(svg, '#withSway'), without = S.q(svg, '#without');
        let blown = false;
        const blow = async () => {
          if (blown) return;
          blown = true;
          api.sfx('wind');
          S.q(svg, '#gusts').setAttribute('opacity', 1);
          await api.tween(2400, (k, raw) => {
            const a = Math.sin(raw * Math.PI * 6) * 6 * (1 - raw * .5) + 4;
            withSway.setAttribute('transform', `rotate(${a} 230 360)`);
            const fall = Math.min(1, raw * 1.6);
            without.setAttribute('transform', `translate(${fall * 260} ${-Math.sin(fall * Math.PI) * 60 + fall * 70}) rotate(${fall * 95} 570 360)`);
            S.q(svg, '#clouds').setAttribute('transform', `translate(${raw * 80} 0)`);
          }, W.ease.linear);
          if (!api.alive()) return;
          api.sfx('thud');
          withSway.setAttribute('transform', '');
          S.q(svg, '#gusts').setAttribute('opacity', 0);
          api.star();
          api.say('The plant with no roots blew away! Roots hold the plant in the ground.');
        };
        api.row();
        api.button('💨 Blow the wind', blow, { cls: 'primary pulse', sound: null });
        api.button('💧 Water and minerals', () => {
          api.sfx('water');
          const f = S.q(svg, '#flows');
          f.setAttribute('opacity', 1);
          const mins = S.qa(f, '.min');
          const start = mins.map(m => ({ x: +m.getAttribute('cx'), y: +m.getAttribute('cy') }));
          api.tween(2500, k => mins.forEach((m, i) => {
            const kk = Math.min(1, Math.max(0, k * 1.6 - i * .05));
            m.setAttribute('cx', start[i].x + (230 - start[i].x) * kk);
            m.setAttribute('cy', start[i].y + (365 - start[i].y) * kk);
            m.setAttribute('opacity', 1 - kk * .9);
          })).then(ok => ok && api.say('The roots take in water and minerals from the soil. The water goes up to the rest of the plant.'));
        });
        api.button('↺ Again', () => { blown = false; without.setAttribute('transform', ''); S.q(svg, '#clouds').setAttribute('transform', ''); S.q(svg, '#flows').setAttribute('opacity', 0); });
      },
    },
    {
      text: [
        '**Minerals** are extra nutrients that help plants to **grow** well.',
        'As a plant grows, its roots grow too. It needs more water and minerals. It needs to be held firmly in the soil.',
      ],
      ask: 'Slide to make the plant grow. Watch the roots!',
      activity: true,
      scene(stage, api) {
        const svg = api.svg(`${S.sky()}<g id="plant"></g>
          <path d="M0 300 Q200 292 400 302 T800 298 L800 520 L0 520Z" fill="url(#g-darksoil)" opacity=".92"/>
          <g id="seedG"></g><g id="plantRoots"></g><g id="specks"></g>
          <g id="stageTag"></g>`);
        const stages = [
          { g: .12, say: 'A seed starts to grow. A tiny root grows down first.', name: 'seed' },
          { g: .35, say: 'A small shoot grows up. The roots grow down.', name: 'seedling' },
          { g: .6, say: 'The plant gets bigger. It has more leaves and longer roots.', name: 'young plant' },
          { g: .85, say: 'Now it is a big plant. The roots spread out to hold it firmly.', name: 'big plant' },
          { g: 1, say: 'Flowers grow! The big plant needs lots of water and minerals from its roots.', name: 'flowering plant' },
        ];
        const draw = v => {
          const g = v;
          const common = { x: 400, y: 300, h: 230, grow: g, leaves: Math.max(0, Math.round(g * 8)), leafShape: 'pointed', flower: g > .9 ? 'daisy' : null, flowerColor: '#F48FB1', flowerCenter: '#FFD23F', petals: 7, flowerR: 22, rootDepth: 190, rootSpread: 180, rootColor: '#F3D98E', seed: 11 };
          S.q(svg, '#plant').innerHTML = g > .15 ? S.plant(Object.assign({}, common, { roots: false })) : '';
          S.q(svg, '#plantRoots').innerHTML = S.roots({ x: 400, y: 301, depth: 190 * g, spread: 180 * g, color: '#F3D98E', w: Math.max(1.5, 4 * Math.sqrt(g)), seed: 11 });
          S.q(svg, '#seedG').innerHTML = g < .5 ? `<ellipse cx="392" cy="308" rx="14" ry="10" fill="#C08A3E" stroke="#7A5525" stroke-width="2" opacity="${1 - g * 2}"/>` : '';
        };
        let lastStage = -1, ready = false;
        const sl = api.slider({
          label: '🌱 Grow', min: 0, max: 4, step: .02, value: 0,
          format: v => stages[Math.round(v)].name,
          onInput: v => {
            const i = Math.floor(v), f = v - i;
            const g = i >= 4 ? 1 : S.lerp(stages[i].g, stages[i + 1].g, f);
            draw(g);
            const si = Math.round(v);
            if (si !== lastStage) {
              lastStage = si;
              if (ready) {
                api.sfx('grow');
                api.say(stages[si].say);
              }
              if (si === 4) api.star();
            }
          },
        });
        ready = true;
        // Water and minerals drift towards the root tips
        const specks = S.q(svg, '#specks');
        const parts = [];
        for (let i = 0; i < 18; i++) {
          const c = S.el('circle', { r: i % 2 ? 3.5 : 4.5, fill: i % 2 ? '#64B5F6' : '#FFB74D', opacity: .9 }, specks);
          parts.push({ c, a: Math.PI * (.1 + Math.random() * .8), d: 60 + Math.random() * 180 });
        }
        api.loop(dt => {
          const g = sl.value / 4;
          parts.forEach(p => {
            p.d -= dt * 40;
            if (p.d < 20) { p.d = 80 + Math.random() * 160; p.a = Math.PI * (.1 + Math.random() * .8); }
            const cx = 400 + Math.cos(p.a) * p.d * 1.4, cy = 312 + Math.sin(p.a) * p.d;
            p.c.setAttribute('cx', cx.toFixed(1));
            p.c.setAttribute('cy', Math.max(310, cy).toFixed(1));
          });
        });
        api.row();
        api.label('<span style="color:#1E88E5">● water</span> &nbsp; <span style="color:#F57C00">● minerals</span>');
      },
    },
  ],
});
