// Chapter 9: Healthy muscles and bones
(() => {
  // ---------- Food drawings, each centred on (0,0) and about 100 wide ----------
  const FOOD = {
    milk: () => `<path d="M-26 -40 L-18 -64 L18 -64 L26 -40 L26 50 Q26 58 18 58 L-18 58 Q-26 58 -26 50Z" fill="#FAFAFA" stroke="#B0BEC5" stroke-width="3"/>
      <rect x="-14" y="-78" width="28" height="16" rx="4" fill="#1E88E5"/><rect x="-22" y="-6" width="44" height="30" rx="4" fill="#90CAF9"/>
      <text x="0" y="15" text-anchor="middle" font-size="14" font-weight="800" fill="#0D47A1">MILK</text>`,
    cheese: () => `<path d="M-50 30 L50 30 L50 -10 L-40 -34 Z" fill="#FFD54F" stroke="#E0A526" stroke-width="3" stroke-linejoin="round"/>
      <path d="M-40 -34 L50 -10 L50 -4 L-50 22Z" fill="#FFE082" opacity=".6"/>
      <circle cx="-10" cy="10" r="7" fill="#F2B92C"/><circle cx="24" cy="4" r="5" fill="#F2B92C"/><circle cx="30" cy="20" r="4" fill="#F2B92C"/><circle cx="-32" cy="22" r="4" fill="#F2B92C"/>`,
    yoghurt: () => `<path d="M-34 -24 L34 -24 L26 40 L-26 40Z" fill="#FFFFFF" stroke="#B0BEC5" stroke-width="3" stroke-linejoin="round"/>
      <ellipse cx="0" cy="-24" rx="36" ry="9" fill="#F48FB1" stroke="#C2185B" stroke-width="2"/>
      <path d="M-24 4 L24 4" stroke="#F48FB1" stroke-width="8"/><circle cx="0" cy="-2" r="7" fill="#EC407A"/>`,
    broccoli: () => `<path d="M-8 50 L-6 6 L6 6 L10 50Z" fill="#8BC34A" stroke="#558B2F" stroke-width="2"/>
      ${[[-22, -10, 20], [0, -24, 22], [22, -10, 20], [-10, 6, 16], [12, 6, 16]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#43A047" stroke="#2E7D32" stroke-width="2"/>`).join('')}
      ${[[-26, -14], [-4, -30], [18, -14], [4, -12]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="#66BB6A"/>`).join('')}`,
    cabbage: () => `<circle r="46" fill="#7CB342" stroke="#33691E" stroke-width="3"/>
      <path d="M0 40 L0 -30 M0 10 L-30 -16 M0 10 L30 -16 M0 -8 L-22 -32 M0 -8 L22 -32" stroke="#C5E1A5" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M-46 0 C-40 -30 -20 -46 0 -46" stroke="#558B2F" stroke-width="5" fill="none"/>`,
    sardines: () => `<rect x="-52" y="-30" width="104" height="62" rx="26" fill="#90A4AE" stroke="#546E7A" stroke-width="3"/>
      <rect x="-44" y="-22" width="88" height="46" rx="20" fill="#E8C382"/>
      ${[-12, 2, 16].map(y => `<g transform="translate(0 ${y})"><path d="M-34 0 C-20 -9 20 -9 30 0 C20 9 -20 9 -34 0Z" fill="#CFD8DC" stroke="#78909C" stroke-width="1.5"/><path d="M30 0 L40 -7 L40 7Z" fill="#B0BEC5"/></g>`).join('')}`,
    figs: () => `<path d="M-20 -30 C-6 -26 6 -4 4 16 C2 34 -40 36 -44 14 C-48 -4 -32 -20 -20 -30Z" fill="#6A1B9A" stroke="#4A148C" stroke-width="2.5"/>
      <path d="M-20 -30 l-2 -10" stroke="#558B2F" stroke-width="4" stroke-linecap="round"/>
      <circle cx="26" cy="10" r="28" fill="#6A1B9A"/><circle cx="26" cy="10" r="22" fill="#F06292"/><circle cx="26" cy="10" r="12" fill="#FCE4EC"/>
      ${[...Array(10)].map((_, i) => `<circle cx="${S.f1(26 + Math.cos(i * .63) * 16)}" cy="${S.f1(10 + Math.sin(i * .63) * 16)}" r="2" fill="#AD1457"/>`).join('')}`,
    almonds: () => [[-26, -8, 20], [4, -16, -10], [28, 4, 30], [-6, 16, -30]].map(([x, y, a]) => `<g transform="translate(${x} ${y}) rotate(${a})">
      <path d="M0 -20 C14 -12 14 12 0 20 C-14 12 -14 -12 0 -20Z" fill="#A1622F" stroke="#6D3F1C" stroke-width="2"/>
      <path d="M0 -14 C4 -4 4 4 0 14" stroke="#C98B5E" stroke-width="2" fill="none"/></g>`).join(''),
    beans: () => [[-24, -6], [0, -18], [22, -4], [-10, 14], [14, 16]].map(([x, y], i) => `<g transform="translate(${x} ${y}) rotate(${i * 40})">
      <path d="M-16 -6 C-14 -16 12 -16 16 -4 C18 6 8 12 0 6 C-8 12 -18 6 -16 -6Z" fill="${i % 2 ? '#8D3B1F' : '#A0522D'}" stroke="#5D2A12" stroke-width="2"/></g>`).join(''),
    egg: () => `<ellipse cx="0" cy="4" rx="32" ry="42" fill="#FFF8E1" stroke="#D7B98E" stroke-width="3"/><ellipse cx="-10" cy="-12" rx="8" ry="12" fill="#fff"/>`,
    fish: () => `<path d="M-50 0 C-30 -30 20 -30 36 0 C20 30 -30 30 -50 0Z" fill="#64B5F6" stroke="#1E63B8" stroke-width="3"/>
      <path d="M34 0 L56 -20 L56 20Z" fill="#42A5F5" stroke="#1E63B8" stroke-width="3" stroke-linejoin="round"/>
      <circle cx="-30" cy="-6" r="5" fill="#fff"/><circle cx="-30" cy="-6" r="2.5" fill="#222"/>
      <path d="M-10 -14 Q0 0 -10 14 M4 -14 Q14 0 4 14" stroke="#1E63B8" stroke-width="2" fill="none" opacity=".6"/>`,
    chicken: () => `<path d="M-40 -20 C-50 -50 10 -60 20 -24 C26 -6 14 10 0 12 L20 34" fill="#C77B30" stroke="#8D4E14" stroke-width="3"/>
      <path d="M-40 -20 C-50 -50 10 -60 20 -24 C26 -6 14 10 0 12 C-20 14 -34 0 -40 -20Z" fill="#D9893D" stroke="#8D4E14" stroke-width="3"/>
      <path d="M0 12 L22 36" stroke="#F5E6CF" stroke-width="9" stroke-linecap="round"/>
      <circle cx="24" cy="40" r="7" fill="#F5E6CF"/><circle cx="30" cy="34" r="7" fill="#F5E6CF"/>`,
  };
  const card = (id, k = .62) => `<svg viewBox="0 0 100 70"><g transform="translate(50 36) scale(${k})">${FOOD[id]()}</g></svg>`;

  // Bone that fills up to show how strong it is (0..1)
  function boneMeter(x, y, v) {
    const d = 'M-16 -110 C-34 -128 -10 -148 0 -128 C10 -148 34 -128 16 -110 L16 110 C34 128 10 148 0 128 C-10 148 -34 128 -16 110Z';
    return `<g transform="translate(${x} ${y})">
      <clipPath id="l3-hl-clip"><path d="${d}"/></clipPath>
      <path d="${d}" fill="#EFEBE0" stroke="#A89878" stroke-width="4"/>
      <rect x="-40" y="${S.f1(150 - v * 300)}" width="80" height="300" fill="#FFD54F" clip-path="url(#l3-hl-clip)"/>
      <path d="${d}" fill="none" stroke="#A89878" stroke-width="4"/>
      ${L3.pill(0, -178, 'strong bones', { size: 17 })}</g>`;
  }

  App.chapter({
    id: 'healthy',
    title: 'Healthy muscles and bones',
    icon: '🥛',
    group: 'Staying healthy',
    keywords: [
      { w: 'dairy', d: 'Food made from milk, like cheese and yoghurt.' },
      { w: 'protein', d: 'A part of some foods that helps build new muscle. Beans, eggs and fish have lots.' },
      { w: 'stretching', d: 'Reaching out to make your body long, which is good for your muscles.' },
      { w: 'balance', d: 'Staying steady without falling over.' },
    ],
    steps: [
      // ---------- a) Foods for bones ----------
      {
        text: [
          'A healthy diet and regular exercise are both important for keeping muscles and bones healthy.',
          '**Dairy** food helps to build growing bones. So do these other foods.',
        ],
        ask: 'What can you see here? Click each food.',
        activity: true,
        scene(stage, api) {
          const foods = [
            { id: 'milk', x: 120, y: 190, name: 'milk', dairy: true },
            { id: 'cheese', x: 280, y: 215, name: 'cheese', dairy: true },
            { id: 'yoghurt', x: 440, y: 205, name: 'yoghurt', dairy: true },
            { id: 'cabbage', x: 610, y: 190, name: 'cabbage' },
            { id: 'broccoli', x: 130, y: 390, name: 'broccoli' },
            { id: 'sardines', x: 300, y: 400, name: 'sardines' },
            { id: 'figs', x: 480, y: 400, name: 'figs' },
            { id: 'almonds', x: 650, y: 400, name: 'almonds' },
          ];
          const svg = api.svg(`
            <rect width="800" height="520" fill="#5D4037"/>
            <rect y="120" width="800" height="400" fill="#A1887F"/>
            ${[0, 1, 2, 3, 4].map(i => `<path d="M0 ${150 + i * 80} L800 ${140 + i * 80}" stroke="#8D6E63" stroke-width="3"/>`).join('')}
            <g transform="translate(20 20)"><rect width="250" height="44" rx="22" fill="#fff" opacity=".95"/>
              ${S.text(125, 29, '🔍 Found: ', { size: 19 }).replace('</text>', `<tspan id="l3-hl1-n">0</tspan> of ${foods.length}</text>`)}</g>
            ${foods.map(f => `<g class="hot" data-f="${f.id}" transform="translate(${f.x} ${f.y})"><circle r="62" fill="#fff" opacity="0"/><g transform="scale(1.1)">${FOOD[f.id]()}</g></g>`).join('')}
            <g id="l3-hl1-tags"></g>`);
          const tags = S.q(svg, '#l3-hl1-tags');
          const found = new Set();
          svg.addEventListener('click', e => {
            const g = e.target.closest('[data-f]');
            if (!g) return;
            const f = foods.find(q => q.id === g.dataset.f);
            api.sfx('pop');
            if (found.has(f.id)) { api.say(f.name); return; }
            found.add(f.id);
            tags.insertAdjacentHTML('beforeend', `<g class="pop-in">${L3.pill(f.x, f.y - 78, f.name, { size: 17, stroke: f.dairy ? '#1E88E5' : '#43A047', color: f.dairy ? '#0D47A1' : '#2E7D32' })}</g>`);
            S.q(svg, '#l3-hl1-n').textContent = found.size;
            api.say(f.dairy ? `${f.name[0].toUpperCase() + f.name.slice(1)} is a dairy food. It helps to build growing bones.` : `${f.name[0].toUpperCase() + f.name.slice(1)} also helps to build strong bones.`);
            if (found.size === foods.length) {
              api.star();
              api.timeout(() => api.praise('All these foods help to build strong, growing bones.'), 3200);
            }
          });
        },
      },

      // ---------- b) Sunlight ----------
      {
        text: [
          'Exercising outdoors in sunlight helps to keep bones strong.',
          'The sunlight helps us to absorb the things our bones need from our food.',
        ],
        ask: 'Drag the cloud away from the sun. Then press Play.',
        activity: true,
        scene(stage, api) {
          const svg = api.svg(`
            ${S.sky()}
            ${S.ground({ y: 440, h: 80, fill: 'url(#g-grass)' })}
            <g id="l3-hl2-sun">${S.sun({ x: 150, y: 100, r: 44 })}</g>
            <g id="l3-hl2-rays" opacity="0">${[0, 1, 2, 3].map(i => `<path d="M${190 + i * 10} ${140 + i * 16} L${330 + i * 30} ${250 + i * 20}" stroke="#FFC93C" stroke-width="5" stroke-dasharray="10 12" class="flow"/>`).join('')}</g>
            <g id="l3-hl2-cloud" transform="translate(150 105)"><g transform="scale(2)">${S.cloud({ color: '#ECEFF1' })}</g>
              <text y="70" text-anchor="middle" font-size="18" font-weight="800" fill="#455A64" class="blink-hint">👆 drag me</text></g>
            <g id="l3-hl2-kid"></g>
            <g id="l3-hl2-ball"></g>
            <g id="l3-hl2-meter"></g>`);
          const kid = S.q(svg, '#l3-hl2-kid'), ballG = S.q(svg, '#l3-hl2-ball'), meter = S.q(svg, '#l3-hl2-meter'), cloud = S.q(svg, '#l3-hl2-cloud');
          let sunny = false, playing = false, t = 0, strong = 0, starred = false;
          const draw = () => {
            const a = t * 5, kick = playing ? Math.max(0, Math.sin(a)) : 0;
            const b = L3.sideBody({ hipF: kick * 50, kneeF: 20 * (1 - kick), shF: -20 * kick, shB: 25 * kick, elF: 30, elB: 30 }, { style: 'body', x: 400, y: 250, s: .95, shirt: '#E53935', trousers: '#1A237E' });
            kid.innerHTML = b.svg;
            const toe = b.pts.toeF;
            const by = playing ? 420 - Math.abs(Math.sin(a / 2 + 1.6)) * 180 : 420;
            ballG.innerHTML = `<g transform="translate(${S.f1(playing ? toe.x + 30 : 470)} ${S.f1(by)}) rotate(${S.f1(t * 200)})">
              <circle r="22" fill="#fff" stroke="#333" stroke-width="2.5"/><path d="M0 -8 L8 -2 L5 8 L-5 8 L-8 -2Z" fill="#333"/></g>`;
            meter.innerHTML = boneMeter(700, 260, strong);
          };
          draw();
          api.draggable(svg, cloud, {
            bounds: { x1: 60, y1: 60, x2: 720, y2: 200 },
            onStart: () => { api.sfx('wind'); const h = S.q(cloud, 'text'); if (h) h.remove(); },
            onMove: p => {
              const now = Math.hypot(p.x - 150, p.y - 100) > 150;
              if (now !== sunny) {
                sunny = now;
                S.q(svg, '#l3-hl2-rays').setAttribute('opacity', sunny ? 1 : 0);
                if (sunny) { api.sfx('magic'); api.say('The sun is shining!'); }
              }
            },
            onDrop: () => true,
          });
          api.loop(dt => {
            if (!playing) return;
            t += dt;
            if (sunny) {
              strong = Math.min(1, strong + dt / 5);
              if (strong >= 1 && !starred) {
                starred = true;
                api.star();
                api.praise('Playing outside in the sunshine helps to keep your bones strong!');
              }
            }
            draw();
          });
          api.button('⚽ Play', b => {
            playing = !playing;
            b.innerHTML = playing ? '⏸ Stop' : '⚽ Play';
            api.sfx(playing ? 'whoosh' : 'drop');
            if (playing && !sunny) api.info('It is cloudy. Drag the cloud away so the sun can shine.');
            if (!playing) { t = 0; draw(); }
          }, { cls: 'primary pulse', sound: null });
        },
      },

      // ---------- c) Protein ----------
      {
        text: ['**Protein** foods in our diet help to build new muscle as we grow.'],
        ask: 'Sort the foods. Is it a dairy food, or another protein food?',
        activity: true,
        scene(stage, api) {
          if (!document.getElementById('l3-hl-style')) {
            document.head.insertAdjacentHTML('beforeend', `<style id="l3-hl-style">
              .l3-hl-sort { display:flex; flex-direction:column; gap:8px; height:100%; }
              .l3-hl-head { font-size:19px; text-align:center; background:#E3F4DE; border-radius:14px; padding:6px 12px; font-weight:700; }
              .l3-hl-game { flex:1; }
            </style>`);
          }
          const wrap = api.html(`<div class="l3-hl-sort"><div class="l3-hl-head">🦴 Dairy builds bones. 💪 Protein builds muscle.</div><div class="l3-hl-game"></div></div>`);
          const dairy = 'This is made from milk, so it is a dairy food.';
          const prot = 'This food is not made from milk. It is a protein food that helps build muscle.';
          api.sortGame(wrap.querySelector('.l3-hl-game'), {
            bins: [{ id: 'dairy', title: '🥛 Dairy food' }, { id: 'protein', title: '💪 Other protein food' }],
            items: [
              { id: 'milk', bin: 'dairy', svg: card('milk', .5), label: 'milk', hint: dairy },
              { id: 'cheese', bin: 'dairy', svg: card('cheese'), label: 'cheese', hint: dairy },
              { id: 'yoghurt', bin: 'dairy', svg: card('yoghurt'), label: 'yoghurt', hint: dairy },
              { id: 'beans', bin: 'protein', svg: card('beans'), label: 'beans', hint: prot },
              { id: 'egg', bin: 'protein', svg: card('egg', .6), label: 'egg', hint: 'Eggs come from hens, not from milk. They are a protein food.' },
              { id: 'fish', bin: 'protein', svg: card('fish', .7), label: 'fish', hint: prot },
              { id: 'chicken', bin: 'protein', svg: card('chicken'), label: 'chicken', hint: prot },
              { id: 'nuts', bin: 'protein', svg: card('almonds'), label: 'nuts', hint: prot },
            ],
            onDone: () => {
              api.star();
              api.timeout(() => api.sayAfter('Dairy food helps build growing bones. Protein food helps build new muscle.'), 2200);
            },
          });
        },
      },

      // ---------- d) Exercise ----------
      {
        text: [
          'Different sorts of exercise use different muscles.',
          'We use lots of muscles to throw a ball. Karate uses different muscles.',
          '**Stretching** our body is good for our muscles too. This girl is improving her **balance**.',
        ],
        ask: 'Press each exercise to see the muscles working.',
        activity: true,
        scene(stage, api) {
          const svg = api.svg(`
            <rect width="800" height="520" fill="#FFF8EC"/>
            <rect y="470" width="800" height="50" fill="#E9CFA6"/>
            <g id="l3-hl4-prop"></g><g id="l3-hl4-kid"></g><g id="l3-hl4-glow"></g><g id="l3-hl4-tag"></g>`);
          const kid = S.q(svg, '#l3-hl4-kid'), glow = S.q(svg, '#l3-hl4-glow'), tag = S.q(svg, '#l3-hl4-tag'), prop = S.q(svg, '#l3-hl4-prop');
          const look = { style: 'body', x: 330, y: 300, s: .9, shirt: '#EC407A', trousers: '#6A1B9A', hair: '#2B1B10' };
          const moves = {
            throw: {
              label: 'arms, shoulders and back', say: 'We use lots of muscles to throw a ball: in our arms, shoulders and back.',
              pose: k => ({ shF: -150 + k * 230, elF: 30 + (1 - k) * 60, shB: 40 - k * 60, hipF: 20 * k, hipB: -20 * k, kneeB: 10, lean: 10 * k }),
              glow: ['elbowF', 'shoulder', 'wristF'],
            },
            karate: {
              label: 'legs and tummy', say: 'Karate uses different muscles. A kick uses the muscles in your legs and tummy.',
              pose: k => ({ hipF: 95 * k, kneeF: 90 * Math.sin(k * Math.PI) * (1 - k), shF: 60, elF: 110, shB: 30, elB: 120, lean: -18 * k }),
              glow: ['kneeF', 'hip', 'ankleF'],
            },
            stretch: {
              label: 'the whole body', say: 'Stretching our body is good for our muscles. Reach up high!',
              pose: k => ({ shF: 175 * k, shB: 165 * k, elF: 5, elB: 5, footF: -20 * k, footB: -20 * k }),
              glow: ['shoulder', 'elbowF', 'hip'],
            },
            balance: {
              label: 'legs, back and tummy', say: 'Standing on one leg helps to improve your balance.',
              pose: k => ({ hipB: -75 * k, kneeB: 10, lean: 40 * k, shF: 90 * k, shB: 70 * k, elF: 5, elB: 5, headTurn: -30 * k }),
              glow: ['hip', 'kneeF', 'shoulder'],
            },
          };
          let busy = false;
          const done = new Set();
          const draw = (id, k) => {
            const b = L3.sideBody(id ? moves[id].pose(k) : {}, look);
            kid.innerHTML = b.svg;
            glow.innerHTML = id && k > .3 ? moves[id].glow.map(p => `<circle cx="${S.f1(b.pts[p].x)}" cy="${S.f1(b.pts[p].y)}" r="26" fill="#FF5252" opacity="${S.f1(.35 * k)}"/>`).join('') : '';
            return b;
          };
          draw(null, 0);
          const go = async id => {
            if (busy) return;
            busy = true;
            api.sfx('swoosh');
            tag.innerHTML = '';
            prop.innerHTML = id === 'balance' ? `<rect x="180" y="462" width="340" height="12" rx="6" fill="#81C784"/>` : '';
            let ball = null;
            if (id === 'throw') { prop.innerHTML = `<g id="l3-hl4-b"><circle r="18" fill="#fff" stroke="#C62828" stroke-width="3"/><path d="M-12 -8 Q0 0 -12 8 M12 -8 Q0 0 12 8" stroke="#C62828" stroke-width="2" fill="none"/></g>`; ball = S.q(prop, '#l3-hl4-b'); }
            if (!(await api.tween(1300, k => {
              const b = draw(id, k);
              if (ball) {
                const h = b.pts.handF;
                const fly = S.clamp((k - .8) / .2);
                ball.setAttribute('transform', `translate(${S.f1(h.x + fly * 300)} ${S.f1(h.y - fly * 60)})`);
              }
            }, W.ease.inOut))) return;
            tag.innerHTML = `<g class="pop-in"><rect x="520" y="40" width="260" height="84" rx="18" fill="#fff" stroke="#C62828" stroke-width="3"/>
              ${S.text(650, 74, '💪 Muscles working:', { size: 19, fill: '#8E1B1B' })}${S.text(650, 106, moves[id].label, { size: 19, fill: '#8E1B1B' })}</g>`;
            api.say(moves[id].say);
            await api.wait(1500);
            if (!(await api.tween(800, k => draw(id, 1 - k), W.ease.inOut))) return;
            prop.innerHTML = '';
            busy = false;
            done.add(id);
            if (done.size === 4) {
              api.star();
              api.timeout(() => api.praise('Different exercises use different muscles. Keep moving to stay healthy!'), 3000);
            }
          };
          api.row();
          api.button('⚾ Throw', () => go('throw'), { sound: null });
          api.button('🥋 Karate', () => go('karate'), { sound: null });
          api.button('🙆 Stretch', () => go('stretch'), { sound: null });
          api.button('🧍 Balance', () => go('balance'), { sound: null });
        },
      },
    ],
  });
})();
