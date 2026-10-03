// Chapter 6: Comparing liquids
(() => {
  const f = S.f1;
  // Liquids for the race. t = seconds to reach the bottom when the board is tipped right up.
  const RACE = [
    { id: 'oil', name: 'cooking oil', col: '#F9D55B', edge: '#C9A21E', t: 4 },
    { id: 'sauce', name: 'tomato sauce', col: '#E53935', edge: '#8E1B1B', t: 16 },
    { id: 'syrup', name: 'syrup', col: '#F2B54A', edge: '#B97F1A', t: 11 },
    { id: 'soap', name: 'liquid soap', col: '#43A047', edge: '#1B5E20', t: 7 },
  ];
  let prediction = null;   // shared by the two race pages

  // Board seen from above and in front, like the book's picture
  const BOARD = { tl: [80, 110], tr: [500, 110], br: [560, 420], bl: [60, 420] };
  const boardPt = (u, v) => {   // u across 0..1, v down 0..1
    const top = [S.lerp(BOARD.tl[0], BOARD.tr[0], u), BOARD.tl[1]], bot = [S.lerp(BOARD.bl[0], BOARD.br[0], u), BOARD.bl[1]];
    return [S.lerp(top[0], bot[0], v), S.lerp(top[1], bot[1], v)];
  };
  const board = () => `<path d="M${BOARD.tl} L${BOARD.tr} L${BOARD.br} L${BOARD.bl}Z" fill="#F7E3B5" stroke="#3B3F6B" stroke-width="4" stroke-linejoin="round"/>
    <path d="M${BOARD.bl} L${BOARD.br} L560 446 L60 446Z" fill="#EBC77E" stroke="#3B3F6B" stroke-width="4" stroke-linejoin="round"/>
    <path d="M${boardPt(0, .94)} L${boardPt(1, .94)}" stroke="#3E9B4F" stroke-width="4" stroke-dasharray="12 8"/>`;

  App.chapter({
    id: 'comparing',
    title: 'Comparing liquids',
    icon: '🍯',
    group: 'Solids, liquids and gases',
    keywords: [
      { w: 'syrup', d: 'A thick, sweet, sticky liquid.' },
      { w: 'honey', d: 'A thick, sweet liquid that bees make.' },
      { w: 'drip', d: 'To fall in drops, or one drop of liquid falling.' },
      { w: 'viscous', d: 'Thick and sticky, so it flows slowly. Honey is viscous.' },
    ],
    steps: [
      // ---------- a) Honey drips ----------
      {
        text: ['Have you tried to pour **syrup** or **honey**?'],
        ask: ['Look at how they **drip**.', 'Lift the honey dipper and watch. Then drag the labels.'],
        activity: true,
        scene(stage, api) {
          const svg = api.svg(`
            <rect width="800" height="520" fill="#FFF8E7"/>
            <path id="l4-cmp1-pool" d="" fill="#F2A922" stroke="#C98010" stroke-width="2"/>
            <path id="l4-cmp1-thread" d="" stroke="#F2A922" stroke-width="5" fill="none" stroke-linecap="round"/>
            <g id="l4-cmp1-drops"></g>
            <g id="l4-cmp1-dip" transform="translate(0 0)">
              <path d="M420 230 L640 90" stroke="#C47A3D" stroke-width="16" stroke-linecap="round"/>
              ${[0, 1, 2, 3].map(i => `<ellipse cx="${400 - i * 2}" cy="${232 + i * 12}" rx="${36 - i * 3}" ry="8" fill="#B5652B" stroke="#7A4A1F" stroke-width="2"/>`).join('')}
              <path d="M370 226 Q400 210 430 226 L428 276 Q400 296 372 276Z" fill="#F2A922" opacity=".85"/>
            </g>`);
          const dip = S.q(svg, '#l4-cmp1-dip'), thread = S.q(svg, '#l4-cmp1-thread'), drops = S.q(svg, '#l4-cmp1-drops'), pool = S.q(svg, '#l4-cmp1-pool');
          let lifted = false;
          const lift = api.button('⬆️ Lift the dipper', async () => {
            if (lifted) return;
            lifted = true; lift.disabled = true;
            api.sfx('drip');
            const ds = [];
            await api.tween(7000, (k, raw) => {
              const up = Math.min(1, raw * 3) * 80;
              dip.setAttribute('transform', `translate(0 ${f(-up)})`);
              const top = 290 - up;
              const th = raw < .9 ? 4 + 3 * Math.sin(raw * 20) : 0;
              thread.setAttribute('d', th ? `M400 ${f(top)} Q${f(398 + Math.sin(raw * 9) * 3)} ${f((top + 440) / 2)} 400 440` : '');
              thread.setAttribute('stroke-width', f(Math.max(0, th)));
              // A slow drop now and then
              if (Math.floor(raw * 6) > ds.length) { ds.push({ y: top, el: S.el('ellipse', { cx: 400, rx: 7, ry: 9, fill: '#F2A922' }, drops) }); api.sfx('drip'); }
              ds.forEach(d => { d.y = Math.min(440, d.y + 3); d.el.setAttribute('cy', f(d.y)); d.el.setAttribute('opacity', d.y < 440 ? 1 : 0); });
              const w = 30 + raw * 110;
              pool.setAttribute('d', L4.blob(400, 448, w, 10 + raw * 6, 4, 10, .08));
            }, W.ease.linear);
            if (!api.alive()) return;
            api.say('The honey drips slowly and makes a pool. Now drag the labels.');
            api.dragLabels(svg, [
              { id: 'drip', label: 'drip', x: 400, y: 360, lx: 560, ly: 330 },
              { id: 'pool', label: 'pool', x: 470, y: 450, lx: 640, ly: 470 },
            ], {
              onDone: () => {
                api.star();
                api.sayAfter('Honey and syrup drip very slowly.');
              },
            });
          }, { cls: 'primary pulse', sound: null });
        },
      },

      // ---------- b) Viscous ----------
      {
        text: ['Both liquids flow very slowly. They are **viscous**.'],
        ask: ['Can you think of any liquids that flow more quickly? Are you sure they do?', 'Tip all three cups at the same time.'],
        activity: true,
        scene(stage, api) {
          const L = [
            { name: 'water', col: '#4FC3F7', t: 1.2 },
            { name: 'milk', col: '#F5F2EA', t: 1.6 },
            { name: 'syrup', col: '#F2A922', t: 7 },
          ];
          const svg = api.svg(`
            <rect width="800" height="520" fill="#F3F7FB"/>
            <rect y="440" width="800" height="80" fill="#DCE6EE"/>
            ${L.map((l, i) => {
              const x = 150 + i * 250;
              return `<g transform="translate(${x} 0)">
                <path class="l4-cmp2-s" d="" stroke="${l.col}" stroke-width="7" fill="none" stroke-linecap="round"/>
                ${L4.glass({ x: 20, y: 440, w: 100, h: 120, level: 0, liquid: l.col, id: 'l4-cmp2-g' + i })}
                <g class="l4-cmp2-cup" transform="rotate(0 -20 150)"><path d="M-70 110 L-20 110 L-26 190 L-64 190Z" fill="#fff" stroke="#607D8B" stroke-width="3"/>
                  <rect class="l4-cmp2-in" x="-66" y="126" width="42" height="60" fill="${l.col}"/></g>
                ${S.text(0, 82, l.name, { size: 22, fill: '#3B3F6B' })}
                <text class="l4-cmp2-t" x="20" y="490" text-anchor="middle" font-size="20" font-weight="800" fill="#3B3F6B"></text></g>`;
            }).join('')}`);
          const cups = S.qa(svg, '.l4-cmp2-cup'), ins = S.qa(svg, '.l4-cmp2-in'), ss = S.qa(svg, '.l4-cmp2-s'), ts = S.qa(svg, '.l4-cmp2-t');
          let busy = false;
          const go = api.button('🫗 Tip all the cups', async () => {
            if (busy) return;
            busy = true; go.disabled = true;
            await api.tween(500, k => cups.forEach(c => c.setAttribute('transform', `rotate(${f(k * 100)} -20 150)`)));
            if (!api.alive()) return;
            api.sfx('pour');
            await api.tween(7500, (k, raw) => {
              const secs = raw * 7.5;
              L.forEach((l, i) => {
                const p = Math.min(1, secs / l.t);
                ins[i].setAttribute('height', f(60 * (1 - p)));
                ss[i].setAttribute('d', p < 1 ? `M-14 118 Q10 200 20 ${f(436 - p * 60)}` : '');
                ss[i].setAttribute('stroke-width', l.t > 3 ? 3 : 8);
                S.q(svg, `[data-liq="l4-cmp2-g${i}"]`).setAttribute('d', L4.glassLiquidD(20, 440, 100, 120, p * .55));
                ts[i].textContent = p < 1 ? `${secs.toFixed(1)} s` : `${l.t} s ✔`;
              });
            }, W.ease.linear);
            if (!api.alive()) return;
            api.choice({
              q: 'Which liquid is viscous?', options: ['💧 Water', '🥛 Milk', '🍯 Syrup'], correct: 2,
              hints: { 0: 'Water flowed out very quickly. Viscous liquids flow slowly.', 1: 'Milk flowed out quickly too.' },
              explain: 'Syrup flows slowly. It is viscous. Water and milk flow more quickly.',
              onRight: () => api.star(),
            });
          }, { cls: 'primary pulse', sound: null });
        },
      },

      // ---------- c) Planning a fair test ----------
      {
        title: 'A fair test',
        text: [
          'Here is a scientific question to investigate: \'Which is the most viscous liquid?\'',
          'You are changing the liquid, so everything else must be the same.',
        ],
        tip: 'I think you need evidence.',
        ask: 'Sort the cards. What will you change, and what must stay the same?',
        activity: true,
        scene(stage, api) {
          const wrap = api.html('');
          api.sortGame(wrap, {
            bins: [{ id: 'change', title: '🔄 Change it' }, { id: 'same', title: '🟰 Keep it the same' }],
            items: [
              { id: 'liquid', bin: 'change', label: '🧴 which liquid', hint: 'We want to compare liquids, so the liquid is the thing we change.' },
              { id: 'amount', bin: 'same', label: '🥄 how much liquid', hint: 'Use the same amount of each liquid, or it is not fair.' },
              { id: 'board', bin: 'same', label: '🪵 the board', hint: 'All the liquids race on the same board.' },
              { id: 'tip', bin: 'same', label: '📐 how far we tip it', hint: 'Tip the board the same amount for every liquid.' },
              { id: 'start', bin: 'same', label: '🏁 the start line', hint: 'Every liquid starts on the same line.' },
            ],
            onDone: () => {
              api.choice({
                q: 'What will you measure?', options: ['⏱ The time each liquid takes', '🎨 The colour of each liquid'], correct: 0,
                hints: { 1: 'The colour does not tell us how fast a liquid flows.' },
                explain: 'Measure how long each liquid takes to reach the bottom. That is our evidence.',
                onRight: () => api.star(),
              });
            },
          });
        },
      },

      // ---------- d) Liquid race: set up and predict ----------
      {
        title: 'Liquid race',
        text: [
          'You will need: <ul><li>four liquids (you could try cooking oil, tomato sauce, syrup and soap)</li><li>a plate or board.</li></ul>',
          '<ol><li>Put a small amount of each liquid in a line at the top of a board.</li><li>Predict which liquid will reach the bottom first.</li></ol>',
        ],
        ask: 'Drag each liquid to the top of the board. Then make your prediction.',
        activity: true,
        scene(stage, api) {
          const svg = api.svg(`
            <rect width="800" height="520" fill="#FFFDF5"/>
            ${board()}
            ${RACE.map((l, i) => { const [x, y] = boardPt(.12 + i * .25, .1); return `<ellipse cx="${f(x)}" cy="${f(y)}" rx="34" ry="18" fill="none" stroke="#B0BEC5" stroke-width="3" stroke-dasharray="6 5"/>`; }).join('')}
            ${RACE.map((l, i) => `<g data-l="${l.id}" transform="translate(${680} ${80 + i * 110})">
              <rect x="-24" y="-40" width="48" height="74" rx="10" fill="${l.col}" stroke="${l.edge}" stroke-width="3"/><rect x="-10" y="-54" width="20" height="16" rx="3" fill="${l.edge}"/>
              ${S.text(0, 56, l.name, { size: 16, fill: '#3B3F6B' })}<rect x="-60" y="-56" width="120" height="120" fill="#fff" opacity="0"/></g>`).join('')}
            <g id="l4-cmp4-blobs"></g>`);
          const blobs = S.q(svg, '#l4-cmp4-blobs');
          const placed = new Set();
          RACE.forEach((l, i) => {
            const node = S.q(svg, `[data-l="${l.id}"]`);
            const d = api.draggable(svg, node, {
              bounds: { x1: 40, y1: 40, x2: 760, y2: 480 },
              onStart: () => { api.sfx('pick'); api.say(l.name); },
              onDrop: p => {
                const [x, y] = boardPt(.12 + i * .25, .1);
                // Any free spot on the start line will do; use the nearest one
                if (p.y < 220 && p.x > 60 && p.x < 540) {
                  node.remove();
                  placed.add(l.id);
                  blobs.insertAdjacentHTML('beforeend', `<g transform="translate(${f(x)} ${f(y)})"><g class="pop-in"><path d="${L4.blob(0, 0, 30, 16, i + 2, 8, .15)}" fill="${l.col}" stroke="${l.edge}" stroke-width="2"/></g></g>`);
                  api.sfx('drip');
                  if (placed.size === 4) ask();
                  return true;
                }
                return false;
              },
            });
            void d;
          });
          const ask = () => {
            api.say('All four liquids are on the start line. Which one do you predict will reach the bottom first?');
            const row = api.row();
            const bs = RACE.map((l, i) => api.button(l.name, b => {
              prediction = i;
              bs.forEach(x => { x.classList.toggle('primary', x === b); });
              api.star();
              api.praise(`You predict the ${l.name} will win. Go to the next page to find out!`);
            }, { parent: row }));
          };
        },
      },

      // ---------- e) Liquid race: results ----------
      {
        title: 'Liquid race',
        text: ['<ol start="3"><li>Slowly tip the board until the liquids start to move.</li><li>See which liquid reaches the end first.</li><li>Write down your results.</li></ol>'],
        tip: 'How will you know which is most viscous? Will it take the longest time or the shortest time?',
        ask: 'Use the slider to tip the board.',
        activity: true,
        scene(stage, api) {
          const svg = api.svg(`
            <rect width="800" height="520" fill="#FFFDF5"/>
            <g id="l4-cmp5-board">${board()}</g>
            <g id="l4-cmp5-trails"></g><g id="l4-cmp5-blobs"></g>
            <g transform="translate(590 70)">
              <rect x="0" y="0" width="200" height="${44 + RACE.length * 50}" rx="10" fill="#fff" stroke="#3B3F6B" stroke-width="2.5"/>
              <path d="M0 42 L200 42 M136 0 L136 ${44 + RACE.length * 50}" stroke="#3B3F6B" stroke-width="2"/>
              ${S.text(68, 28, 'liquid', { size: 17 })}${S.text(168, 28, 'time', { size: 17 })}
              ${RACE.map((l, i) => `<circle cx="18" cy="${68 + i * 50}" r="9" fill="${l.col}" stroke="${l.edge}" stroke-width="2"/>
                <text x="30" y="${74 + i * 50}" font-size="16" font-weight="700" fill="#2B2A28">${l.name}</text>
                <text class="l4-cmp5-t" x="168" y="${74 + i * 50}" text-anchor="middle" font-size="18" font-weight="800" fill="#3B3F6B">–</text>`).join('')}
            </g>
            <g transform="translate(0 0)"><path d="M610 486 L790 486" stroke="#8D6E63" stroke-width="4"/>
              <g id="l4-cmp5-side"><rect x="600" y="462" width="140" height="10" rx="3" fill="#EBC77E" stroke="#3B3F6B" stroke-width="2"/></g>
              <path d="M736 472 L746 486 L726 486Z" fill="#8D6E63"/></g>
            <text id="l4-cmp5-clock" x="690" y="${130 + RACE.length * 50}" text-anchor="middle" font-size="22" font-weight="800" fill="#3B3F6B">⏱ 0.0 s</text>
            ${prediction != null ? L4.pill(660, 46, `Prediction: ${RACE[prediction].name}`, { size: 16, fill: '#FFF3C4' }) : ''}`);
          const blobG = S.q(svg, '#l4-cmp5-blobs'), trails = S.q(svg, '#l4-cmp5-trails'), ts = S.qa(svg, '.l4-cmp5-t'), clock = S.q(svg, '#l4-cmp5-clock');
          const st = RACE.map(() => ({ v: .1, done: null }));
          let tilt = 0, time = 0, started = false, finished = false;
          api.loop(dt => {
            const push = S.clamp((tilt - 10) / 30);
            if (push > 0 && !finished) { started = true; time += dt; }
            RACE.forEach((l, i) => {
              const s = st[i];
              if (s.done == null && push > 0) {
                s.v = Math.min(.94, s.v + push * .84 / l.t * dt);
                if (s.v >= .94) { s.done = time; ts[i].textContent = `${time.toFixed(1)} s`; api.sfx('pop'); }
              }
            });
            const pos = RACE.map((l, i) => boardPt(.12 + i * .25, st[i].v));
            blobG.innerHTML = RACE.map((l, i) => `<path d="${L4.blob(pos[i][0], pos[i][1], 30, 16, i + 2, 8, .15)}" fill="${l.col}" stroke="${l.edge}" stroke-width="2"/>`).join('');
            trails.innerHTML = RACE.map((l, i) => { const [x0, y0] = boardPt(.12 + i * .25, .1); return `<path d="M${f(x0)} ${f(y0)} L${f(pos[i][0])} ${f(pos[i][1])}" stroke="${l.col}" stroke-width="18" stroke-linecap="round" opacity=".45"/>`; }).join('');
            clock.textContent = `⏱ ${time.toFixed(1)} s`;
            if (started && !finished && st.every(s => s.done != null)) {
              finished = true;
              const winner = RACE[st.reduce((b, s, i) => s.done < st[b].done ? i : b, 0)];
              api.sfx('fanfare');
              api.say(`The ${winner.name} reached the end first.${prediction != null ? (RACE[prediction] === winner ? ' Your prediction was right!' : ' Was your prediction right?') : ''}`);
              api.timeout(() => {
                const first = api.choice({
                  q: 'The most viscous liquid takes…', options: ['the longest time', 'the shortest time'], correct: 0,
                  hints: { 1: 'Viscous liquids flow slowly, so they take a long time.' },
                  explain: 'A viscous liquid flows slowly, so it takes the longest time.',
                  onRight: () => api.timeout(() => {
                    first.parentNode.remove();
                    api.choice({
                      q: 'Which liquid is the most viscous?', options: RACE.map(l => l.name), correct: 1,
                      hints: { 0: 'Cooking oil was the fastest. Look for the longest time.', 2: 'Look at the table. Which time is the longest?', 3: 'Look at the table. Which time is the longest?' },
                      explain: 'The tomato sauce took the longest time, so it is the most viscous.',
                      onRight: () => api.star(),
                    });
                  }, 2500),
                });
              }, 3000);
            }
          });
          let ready = false;
          api.slider({
            label: '📐 Tip the board', min: 0, max: 40, value: 0, format: v => `${v}°`,
            onInput: v => {
              tilt = v;
              S.q(svg, '#l4-cmp5-side').setAttribute('transform', `rotate(${v} 740 470)`);
              if (!ready) { ready = true; return; }
              if (v > 10 && !started) api.say('The liquids are starting to move!');
            },
          });
        },
      },
    ],
  });
})();
