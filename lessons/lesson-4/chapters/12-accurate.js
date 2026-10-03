// Chapter 12: End of topic: measuring accurately
(() => {
  const f = S.f1;
  const neg = v => String(v).replace('-', '−');

  function injectStyle() {
    if (document.getElementById('l4-acc-style')) return;
    document.head.insertAdjacentHTML('beforeend', `<style id="l4-acc-style">
      .l4-acc-ex { display:flex; gap:10px; justify-content:center; margin-bottom:10px; flex-wrap:wrap; }
      .l4-acc-ex div { background:#fff; border:2.5px solid #3B3F6B; border-radius:12px; padding:6px 14px; font-weight:800; font-size:18px; }
      .l4-acc-ex .real { background:#FFF3C4; border-color:#E0A526; }
      .l4-acc-wrap { display:flex; flex-direction:column; height:100%; }
      .l4-acc-wrap .sort { flex:1; }
    </style>`);
  }

  App.chapter({
    id: 'accurate',
    title: 'Measuring accurately',
    icon: '🎯',
    group: 'End of topic',
    steps: [
      // ---------- a) What is accurate? ----------
      {
        text: [
          '<b>Accurate</b> measuring is very important in science.',
          'A measurement that is accurate is one that is as close to the real measurement as possible.',
        ],
        ask: 'On Monday the real temperature outside is 20 °C. Who measured it most accurately? Sort the children.',
        activity: true,
        scene(stage, api) {
          injectStyle();
          const wrap = api.html(`<div class="l4-acc-wrap"><div class="l4-acc-ex"><div class="real">🌡️ Real temperature: 20 °C</div></div><div class="l4-acc-game" style="flex:1"></div></div>`);
          api.sortGame(wrap.querySelector('.l4-acc-game'), {
            bins: [{ id: 'a', title: '🥇 most accurate' }, { id: 'b', title: '🥈 in the middle' }, { id: 'c', title: '🥉 least accurate' }],
            items: [
              { id: 'rafia', bin: 'a', label: '👧 Rafia says 20 °C', say: 'Rafia says 20 degrees', hint: 'Rafia said 20 °C. That is exactly the real temperature!' },
              { id: 'faiza', bin: 'b', label: '👩 Faiza says 19 °C', say: 'Faiza says 19 degrees', hint: 'Faiza was 1 degree away. That is closer than Nikesh, but not exact.' },
              { id: 'nikesh', bin: 'c', label: '👦 Nikesh says 18 °C', say: 'Nikesh says 18 degrees', hint: 'Nikesh was 2 degrees away from 20 °C. He is the furthest away.' },
            ],
            onDone: () => {
              api.star();
              api.sayAfter('Rafia is accurate. Faiza is more accurate than Nikesh, but less accurate than Rafia.');
            },
          });
        },
      },

      // ---------- b) How to measure accurately ----------
      {
        text: [
          'Can you measure temperature accurately?',
          '<ol><li>Hold the thermometer and stir the liquid with it.</li><li>Keep the bulb of the thermometer in the liquid.</li><li>Read the thermometer scale at eye level. You may need to bend your knees, so you do not take the thermometer out of the liquid.</li></ol>',
        ],
        ask: 'Put the thermometer in the water and stir. Then drag the eye to the level of the red liquid.',
        activity: true,
        scene(stage, api) {
          const th = L4.thermo({ x: 0, y: -300, h: 280, min: 0, max: 50, major: 10, minor: 2, value: 20, id: 'l4-acc2', font: 16, w: 14, face: false, unit: false });
          const svg = api.svg(`
            <rect width="800" height="520" fill="#F3F7FB"/>
            <rect y="440" width="800" height="80" fill="#DCE6EE"/>
            ${L4.beaker({ x: 300, y: 440, w: 220, h: 240, level: .7, liquid: '#90CAF9' })}
            <g transform="translate(430 22)">
              <rect width="330" height="116" rx="14" fill="#fff" stroke="#3B3F6B" stroke-width="2.5"/>
              ${['bulb in the liquid', 'stir the liquid', 'read at eye level'].map((t, i) => `<text x="16" y="${34 + i * 32}" font-size="18" font-weight="800" fill="#3B3F6B"><tspan class="l4-acc2-box">⬜</tspan> ${t}</text>`).join('')}
            </g>
            <g id="l4-acc2-th" transform="translate(560 430)" class="hot">${th.svg}<rect x="-30" y="-310" width="70" height="320" fill="#fff" opacity="0"/></g>
            <line id="l4-acc2-sight" x1="0" y1="0" x2="0" y2="0" stroke="#7E57C2" stroke-width="3" stroke-dasharray="8 6" opacity="0"/>
            <g id="l4-acc2-eye" transform="translate(740 200)" class="hot">
              <ellipse rx="34" ry="20" fill="#fff" stroke="#3B3F6B" stroke-width="3"/><circle cx="-12" r="11" fill="#5D4037"/><circle cx="-14" cy="-3" r="3" fill="#fff"/>
              <rect x="-40" y="-26" width="80" height="52" fill="#fff" opacity="0"/></g>
            <g id="l4-acc2-read"></g>`);
          const node = S.q(svg, '#l4-acc2-th'), eye = S.q(svg, '#l4-acc2-eye'), sight = S.q(svg, '#l4-acc2-sight'), readG = S.q(svg, '#l4-acc2-read');
          const boxes = S.qa(svg, '.l4-acc2-box');
          const done = [false, false, false];
          const tick = i => { if (done[i]) return; done[i] = true; boxes[i].textContent = '✅'; api.sfx('pop'); };
          let pos = { x: 560, y: 430 }, T = 20, stir = 0, eyeY = 200, finished = false, lastX = 560;
          const inLiquid = () => pos.x > 205 && pos.x < 395 && pos.y > 300 && pos.y < 432;
          api.draggable(svg, node, {
            bounds: { x1: 210, y1: 120, x2: 700, y2: 430 },
            onStart: () => api.sfx('pick'),
            onMove: p => {
              pos = p;
              if (inLiquid()) {
                if (!done[0]) { tick(0); api.say('The bulb is in the liquid. Now stir.'); }
                stir += Math.abs(p.x - lastX);
                if (stir > 500 && !done[1]) { tick(1); api.sfx('water'); api.say('Good stirring! Leave the bulb in the liquid. Now move the eye.'); }
              }
              lastX = p.x;
            },
            onDrop: () => true,
          });
          let grab = null;
          W.pointerDrag(eye, {
            onStart: e => { grab = api.point(svg, e).y - eyeY; api.sfx('pick'); },
            onMove: e => { eyeY = S.clamp(api.point(svg, e).y - grab, 40, 420); eye.setAttribute('transform', `translate(740 ${f(eyeY)})`); },
          });
          api.loop(dt => {
            const target = inLiquid() ? 35 : 20;
            T += (target - T) * Math.min(1, dt * (inLiquid() ? (done[1] ? .8 : .25) : .3));
            th.set(svg, T);
            const topY = pos.y + th.yOf(T);
            sight.setAttribute('x1', 706); sight.setAttribute('y1', f(eyeY));
            sight.setAttribute('x2', f(pos.x + 10)); sight.setAttribute('y2', f(topY));
            sight.setAttribute('opacity', done[1] ? 1 : 0);
            if (!done[1] || finished) return;
            const off = eyeY - topY;
            const level = Math.abs(off) < 12;
            // Reading from too high or too low gives the wrong number
            const seen = Math.round(T + (level ? 0 : off / 12));
            readG.innerHTML = L4.pill(560, 470, level ? `You read ${seen} °C: eye level ✔` : `You read ${seen} °C: ${off < 0 ? 'eye too high' : 'eye too low'}`, { size: 18, fill: level ? '#E3F4DE' : '#FDEBE1' });
            if (level && !inLiquid()) readG.innerHTML = L4.pill(560, 470, 'Keep the bulb in the liquid!', { size: 18, fill: '#FDEBE1' });
            if (level && inLiquid() && T > 34.5) {
              tick(2);
              finished = true;
              readG.innerHTML = `<g class="pop-in">${L4.pill(560, 470, 'The water is 35 °C ✔ accurate!', { size: 18, fill: '#E3F4DE' })}</g>`;
              api.star();
              api.praise('You stirred, kept the bulb in the liquid and read the scale at eye level. The water is 35 degrees Celsius.');
            }
          });
        },
      },

      // ---------- c) Temperatures in the garden ----------
      {
        title: 'Question 1',
        text: ['A learner measures air temperature in a garden at three different times on the same day.'],
        ask: 'What temperature was it at 8 am, 1 pm and 6 pm? Then say how the temperature changed.',
        activity: true,
        scene(stage, api) {
          const R = [{ time: '8 am', v: 7 }, { time: '1 pm', v: 18 }, { time: '6 pm', v: 9 }];
          const ths = R.map((r, i) => L4.thermo({ x: 110 + i * 170, y: 110, h: 300, min: -5, max: 25, major: 5, minor: 1, value: r.v, id: 'l4-acc3-' + i, font: 17 }));
          const svg = api.svg(`
            <rect width="800" height="520" fill="#F1F8E9"/>
            ${ths.map((t, i) => `${t.svg}${S.text(140 + i * 170, 50, R[i].time, { size: 22 })}<g class="l4-acc3-hl" data-i="${i}" opacity="0"><rect x="${70 + i * 170}" y="30" width="140" height="470" rx="20" fill="none" stroke="#FFB300" stroke-width="5"/></g>`).join('')}
            <g transform="translate(560 140)">
              <rect width="210" height="196" rx="12" fill="#fff" stroke="#3B3F6B" stroke-width="2.5"/>
              <path d="M0 46 L210 46 M0 96 L210 96 M0 146 L210 146 M100 0 L100 196" stroke="#3B3F6B" stroke-width="2"/>
              ${S.text(50, 30, 'time', { size: 18 })}${S.text(155, 30, 'temp.', { size: 18 })}
              ${R.map((r, i) => `${S.text(50, 78 + i * 50, r.time, { size: 18, weight: 700 })}<text class="l4-acc3-v" x="155" y="${78 + i * 50}" text-anchor="middle" font-size="20" font-weight="800" fill="#C62828">?</text>`).join('')}
            </g>`);
          const hl = S.qa(svg, '.l4-acc3-hl'), vs = S.qa(svg, '.l4-acc3-v');
          let i = 0;
          const round = () => {
            api.controls.innerHTML = '';
            hl.forEach((h, k) => h.setAttribute('opacity', k === i ? 1 : 0));
            const v = R[i].v, opts = [v, v + 1, v - 1].sort(() => Math.random() - .5);
            api.choice({
              q: `What temperature was it at ${R[i].time}?`, options: opts.map(o => `${neg(o)} °C`), correct: opts.indexOf(v),
              hint: 'Find the top of the red liquid. Each small mark is 1 degree.',
              onRight: () => {
                vs[i].textContent = `${v} °C`;
                api.timeout(() => {
                  i++;
                  if (i < R.length) return round();
                  hl.forEach(h => h.setAttribute('opacity', 0));
                  api.controls.innerHTML = '';
                  api.choice({
                    q: 'How did the temperature in the garden change?', options: ['It went up, then down', 'It went down, then up', 'It stayed the same'], correct: 0,
                    hints: { 1: 'Look at the table. 7, then 18, then 9.', 2: 'Look at the table. The numbers are different.' },
                    explain: 'It was 7 °C in the morning, rose to 18 °C at 1 pm, then went down to 9 °C in the evening.',
                    onRight: () => api.star(),
                  });
                }, 1600);
              },
            });
          };
          round();
        },
      },

      // ---------- d) Enough evidence? ----------
      {
        title: 'Question 2',
        text: [
          'The learner says that the hottest temperature that day was at 1 pm.',
          'The teacher says that the learner does not have enough evidence to support their statement.',
        ],
        ask: 'What do you think? Click the empty hours to take more readings.',
        activity: true,
        scene(stage, api) {
          const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
          const VAL = { 8: 7, 9: 9, 10: 12, 11: 14, 12: 16, 13: 18, 14: 20, 15: 19, 16: 16, 17: 12, 18: 9 };
          const X = h => 100 + (h - 8) * 64, Y = v => 420 - v * 13;
          const lab = h => h < 12 ? `${h} am` : h === 12 ? '12 pm' : `${h - 12} pm`;
          const svg = api.svg(`
            <rect width="800" height="520" fill="#FFFDF5"/>
            ${[0, 5, 10, 15, 20, 25].map(v => `<path d="M70 ${Y(v)} L770 ${Y(v)}" stroke="#E0E0E0" stroke-width="2"/>${S.text(60, Y(v) + 6, v, { size: 16, anchor: 'end', weight: 700, fill: '#6E665A' })}`).join('')}
            <path d="M70 80 L70 420 L770 420" stroke="#3B3F6B" stroke-width="3" fill="none"/>
            ${S.text(30, 60, '°C', { size: 18 })}
            ${HOURS.map(h => `<g data-h="${h}" class="${[8, 13, 18].includes(h) ? '' : 'hot'}">
              <rect x="${X(h) - 26}" y="90" width="52" height="330" fill="#fff" opacity="0"/>
              <rect class="l4-acc4-bar" x="${X(h) - 20}" y="420" width="40" height="0" rx="4" fill="#E53935"/>
              <text class="l4-acc4-v" x="${X(h)}" y="410" text-anchor="middle" font-size="16" font-weight="800" fill="#2B2A28"></text>
              ${[8, 13, 18].includes(h) ? '' : `<text class="l4-acc4-q" x="${X(h)}" y="400" text-anchor="middle" font-size="22" font-weight="800" fill="#B0BEC5">?</text>`}
              <text x="${X(h)}" y="446" text-anchor="middle" font-size="16" font-weight="700" fill="#3B3F6B">${lab(h)}</text></g>`).join('')}
            <g transform="translate(400 486)"><rect x="-150" y="-22" width="300" height="44" rx="22" fill="#fff" stroke="#E0E0E0"/>
              ${S.text(0, 7, '', { size: 18 }).replace('></text>', ' id="l4-acc4-n">Readings: 3</text>')}</g>`);
          const show = h => {
            const g = S.q(svg, `[data-h="${h}"]`), bar = S.q(g, '.l4-acc4-bar'), v = VAL[h];
            g.classList.remove('hot');
            const q = S.q(g, '.l4-acc4-q'); if (q) q.remove();
            api.tween(600, k => { bar.setAttribute('y', f(420 - v * 13 * k)); bar.setAttribute('height', f(v * 13 * k)); }, W.ease.out);
            S.q(g, '.l4-acc4-v').textContent = v;
            S.q(g, '.l4-acc4-v').setAttribute('y', Y(v) - 8);
          };
          [8, 13, 18].forEach(show);
          const taken = new Set([8, 13, 18]);
          let asked = false;
          svg.addEventListener('click', e => {
            const g = e.target.closest('[data-h]');
            if (!g) return;
            const h = +g.dataset.h;
            if (taken.has(h)) return;
            taken.add(h);
            api.sfx('tick');
            show(h);
            S.q(svg, '#l4-acc4-n').textContent = `Readings: ${taken.size}`;
            if (h === 14) api.say('2 pm was 20 degrees. That is hotter than 1 pm!');
            else api.say(`${lab(h).replace('pm', 'p m').replace('am', 'a m')}: ${VAL[h]} degrees.`);
            if (taken.has(14) && taken.size >= 6 && !asked) {
              asked = true;
              api.timeout(() => {
                api.say('The hottest time was 2 pm, not 1 pm. The teacher was right!');
                api.choice({
                  q: 'What should the learner do next time?', options: ['Measure more often', 'Measure only once', 'Guess the temperature'], correct: 0,
                  hints: { 1: 'One reading cannot tell us when it was hottest.', 2: 'Scientists need evidence, not guesses.' },
                  explain: 'Take readings more often, for example every hour. More readings give better evidence.',
                  onRight: () => api.star(),
                });
              }, 1800);
            }
          });
        },
      },
    ],
  });
})();
