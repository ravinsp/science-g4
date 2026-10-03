// Chapter 8: Using a thermometer
(() => {
  const f = S.f1;
  const shuffle = a => a.slice().sort(() => Math.random() - .5);

  // Show values one by one on a thermometer and ask the learner to read each one
  function readGame(api, svg, th, values, { step = 1, arrowX = 0, onDone } = {}) {
    let i = 0, cur = th.value0;
    const arrow = S.q(svg, '.l4-use-arrow');
    const round = async () => {
      const v = values[i];
      api.controls.innerHTML = '';
      api.sfx('tick');
      const from = cur;
      await api.tween(900, k => { cur = from + (v - from) * k; th.set(svg, cur); if (arrow) arrow.setAttribute('transform', `translate(0 ${f(th.yOf(cur))})`); }, W.ease.out);
      if (!api.alive()) return;
      const opts = shuffle([v, v + step * (Math.random() < .5 ? 1 : 2), v - step * (Math.random() < .5 ? 1 : 2)]);
      api.choice({
        q: `Round ${i + 1} of ${values.length}: What temperature is this?`, options: opts.map(o => `${String(o).replace('-', '−')} °C`), correct: opts.indexOf(v),
        hint: 'Look at the top of the red liquid. Count the small marks from the nearest number.',
        onRight: () => {
          api.timeout(() => {
            i++;
            if (i < values.length) round();
            else { api.controls.innerHTML = ''; onDone && onDone(); }
          }, 1800);
        },
      });
    };
    round();
    void arrowX;
  }
  const arrowMark = x => `<g class="l4-use-arrow"><path d="M${x} 0 L${x + 34} -14 L${x + 34} 14Z" fill="#3B3F6B"/>
    <rect x="${x + 34}" y="-22" width="150" height="44" rx="8" fill="#FDEBE1" stroke="#555" stroke-width="2"/>
    <text x="${x + 109}" y="7" text-anchor="middle" font-size="18" font-weight="800" fill="#2B2A28">What is this?</text></g>`;

  App.chapter({
    id: 'using',
    title: 'Using a thermometer',
    icon: '🌡️',
    group: 'Temperature',
    keywords: [
      { w: 'degrees Celsius', d: 'The unit we use to measure temperature. We write it °C.' },
      { w: 'numbered', d: 'Having numbers written on it.' },
      { w: 'scale', d: 'A line of marks and numbers that we use to measure something.' },
      { w: 'below', d: 'Lower than or under something.' },
      { w: 'zero', d: 'The number 0. Water freezes at zero degrees Celsius.' },
      { w: 'electronic', d: 'Working with electricity, often with numbers on a little screen.' },
    ],
    steps: [
      // ---------- a) Writing °C ----------
      {
        text: [
          'We use a thermometer to measure temperature.',
          'The unit for measuring temperature is **degrees Celsius**. We write the unit like this: °C',
          'The small circle means degrees.',
        ],
        ask: 'Drag the right pieces into the boxes to write the unit.',
        activity: true,
        scene(stage, api) {
          const TILES = [
            { id: 'deg', t: '°', x: 150, ok: 0 }, { id: 'C', t: 'C', x: 300, ok: 1 },
            { id: 'o', t: 'o', x: 500, ok: -1 }, { id: 'c', t: 'c', x: 650, ok: -1 },
          ];
          const SLOT = [{ x: 330, y: 170 }, { x: 470, y: 170 }];
          const svg = api.svg(`
            <rect width="800" height="520" fill="#F7F4FB"/>
            ${SLOT.map(s => `<rect x="${s.x - 60}" y="${s.y - 80}" width="120" height="160" rx="14" fill="#fff" stroke="#7E57C2" stroke-width="4" stroke-dasharray="10 8"/>`).join('')}
            <g id="l4-use1-tags"></g>
            ${shuffle(TILES).map((t, i) => `<g data-t="${t.id}" transform="translate(${[150, 300, 500, 650][i]} 410)">
              <rect x="-50" y="-60" width="100" height="120" rx="14" fill="#fff" stroke="#3B3F6B" stroke-width="3"/>
              <text y="${t.id === 'deg' ? 30 : 30}" text-anchor="middle" font-size="${t.id === 'deg' ? 120 : 90}" font-weight="700" fill="#2B2A28">${t.t}</text></g>`).join('')}`);
          const filled = [false, false];
          TILES.forEach(t => {
            const node = S.q(svg, `[data-t="${t.id}"]`);
            const d = api.draggable(svg, node, {
              bounds: { x1: 60, y1: 80, x2: 740, y2: 450 },
              onStart: () => api.sfx('pick'),
              onDrop: p => {
                const si = SLOT.findIndex(s => Math.hypot(p.x - s.x, p.y - s.y) < 80);
                if (si < 0) return false;
                if (t.ok !== si) {
                  api.oops(t.ok < 0 ? (t.id === 'o' ? 'That letter o is too big. The degrees sign is a small circle at the top.' : 'Celsius needs a capital letter C.') : 'Put the small circle first, in front of the C.');
                  return false;
                }
                d.animateTo(SLOT[si].x, SLOT[si].y, 200);
                node.style.pointerEvents = 'none';
                filled[si] = true;
                api.sfx('drop');
                if (filled[0] && filled[1]) {
                  S.q(svg, '#l4-use1-tags').innerHTML = `<g class="fade-in">
                    ${S.callout({ x: 315, y: 140, tx: 150, ty: 60, text: 'small circle = degrees', w: 240 })}
                    ${S.callout({ x: 500, y: 200, tx: 660, ty: 290, text: 'capital C for Celsius', w: 220 })}</g>`;
                  api.say('Degrees Celsius! A small circle at the top, in front of a capital C.');
                  api.timeout(() => api.choice({
                    q: 'Which one is written the right way?', options: ['20 °C', '20 C°', '20 oc'], correct: 0,
                    hints: { 1: 'The small circle goes in front of the C.', 2: 'We need a small circle at the top and a capital C.' },
                    explain: 'We write twenty degrees Celsius as 20 °C.',
                    onRight: () => api.star(),
                  }), 2500);
                }
                return true;
              },
            });
          });
        },
      },

      // ---------- b) Reading the scale ----------
      {
        text: [
          'A thermometer has a **numbered** **scale** on it.',
          'We look at the numbers to see what the temperature is. We look at the top of the red liquid.',
        ],
        ask: 'What temperature is this? Answer four questions.',
        activity: true,
        scene(stage, api) {
          const th = L4.thermo({ x: 330, y: 70, h: 360, min: 0, max: 25, major: 5, minor: 1, value: 0, id: 'l4-use2', font: 22 });
          th.value0 = 0;
          const svg = api.svg(`
            <rect width="800" height="520" fill="#F3F7FB"/>
            ${th.svg}${arrowMark(400)}
            <g transform="translate(110 250)">${L4.pill(0, 0, '1 mark = 1 °C', { size: 18, fill: '#fff' })}</g>`);
          readGame(api, svg, th, [12, 7, 18, 23], {
            onDone: () => { api.star(); api.praise('You can read a thermometer!'); },
          });
        },
      },

      // ---------- c) Set the temperature ----------
      {
        text: ['Each small mark on this scale is one degree.'],
        ask: ['Drag the top of the red liquid to show each temperature.', 'What is the highest temperature this thermometer can measure?'],
        activity: true,
        scene(stage, api) {
          const th = L4.thermo({ x: 330, y: 70, h: 360, min: 0, max: 25, major: 5, minor: 1, value: 10, id: 'l4-use3', font: 22 });
          const svg = api.svg(`
            <rect width="800" height="520" fill="#F3F7FB"/>
            ${th.svg}
            <g id="l4-use3-grab" class="hot"><rect x="290" y="60" width="140" height="400" fill="#fff" opacity="0"/>
              <circle id="l4-use3-knob" cx="330" cy="${f(th.yOf(10))}" r="14" fill="#fff" stroke="#E53935" stroke-width="4"/></g>
            <g transform="translate(610 200)"><rect x="-130" y="-70" width="260" height="140" rx="18" fill="#fff" stroke="#3B3F6B" stroke-width="3"/>
              ${S.text(0, -26, 'Show', { size: 22, fill: '#6E665A' })}<text id="l4-use3-target" y="34" text-anchor="middle" font-size="52" font-weight="800" fill="#C62828">15 °C</text></g>
            <g transform="translate(610 330)">${S.text(0, 0, '', { size: 20 }).replace('></text>', ' id="l4-use3-n">1 of 3</text>')}</g>`);
          const knob = S.q(svg, '#l4-use3-knob');
          const targets = [15, 21, 4];
          let ti = 0, v = 10, busy = false;
          const setV = x => { v = x; th.set(svg, v); knob.setAttribute('cy', f(th.yOf(v))); };
          setV(10);
          W.pointerDrag(S.q(svg, '#l4-use3-grab'), {
            onStart: e => { if (busy) return; api.sfx('pick'); },
            onMove: e => {
              if (busy) return;
              const y = api.point(svg, e).y;
              const nv = Math.round(S.clamp(25 * (th.yOf(0) - y) / (th.yOf(0) - th.yOf(25)), 0, 25));
              if (nv !== v) { setV(nv); api.sfx('tick'); }
            },
            onEnd: () => {
              if (busy || ti >= targets.length) return;
              if (v === targets[ti]) {
                ti++;
                api.sfx('success');
                if (ti < targets.length) {
                  api.say(`Yes, that is ${v} degrees Celsius. Now show ${targets[ti]} degrees.`);
                  S.q(svg, '#l4-use3-target').textContent = `${targets[ti]} °C`;
                  S.q(svg, '#l4-use3-n').textContent = `${ti + 1} of 3`;
                } else {
                  busy = true;
                  S.q(svg, '#l4-use3-n').textContent = 'Done!';
                  api.say('Well done! Now look at the very top of the scale.');
                  api.choice({
                    q: 'What is the highest temperature this thermometer can measure?', options: ['20 °C', '25 °C', '30 °C'], correct: 1,
                    hints: { 0: 'Look above 20. There are more marks.', 2: 'The scale stops before 30. Look at the top number.' },
                    explain: 'The top number on the scale is 25, so the highest temperature it can measure is 25 °C.',
                    onRight: () => api.star(),
                  });
                }
              } else api.oops(`That shows ${v} °C. Try to show ${targets[ti]} °C.`);
            },
          });
        },
      },

      // ---------- d) A different scale ----------
      {
        text: [
          'This thermometer has a different scale. When you use a thermometer, make sure you know what the scale is before you start to use it.',
          'It can also measure very cold temperatures. There are numbers **below** 0 (**zero**) on the scale.',
        ],
        ask: 'Each small mark here is 2 degrees. Read four temperatures.',
        activity: true,
        scene(stage, api) {
          const th = L4.thermo({ x: 330, y: 50, h: 400, min: -20, max: 50, major: 10, minor: 2, value: 0, id: 'l4-use4', font: 20 });
          th.value0 = 0;
          const svg = api.svg(`
            <rect width="800" height="520" fill="#EAF4FB"/>
            ${th.svg}${arrowMark(400)}
            <rect x="150" y="${f(th.yOf(0))}" width="100" height="${f(th.yOf(-20) - th.yOf(0) + 10)}" rx="10" fill="#BBDEFB" opacity=".7"/>
            ${S.text(150, f(th.yOf(-10) + 6), 'below 0', { size: 20, fill: '#1565C0' })}
            <g transform="translate(130 160)">${L4.pill(0, 0, '1 mark = 2 °C', { size: 18, fill: '#fff' })}</g>`);
          readGame(api, svg, th, [14, -10, 36, -4], {
            step: 2,
            onDone: () => api.choice({
              q: 'What is the highest temperature this thermometer can measure?', options: ['40 °C', '50 °C', '100 °C'], correct: 1,
              hints: { 0: 'Look higher up the scale.', 2: 'The scale stops at the top number. What is it?' },
              explain: 'The top of this scale is 50 °C. It can also measure down to 20 degrees below zero.',
              onRight: () => api.star(),
            }),
          });
        },
      },

      // ---------- e) Electronic thermometers ----------
      {
        text: [
          'The temperature of a human body does not change very much.',
          'You may have your temperature measured with an **electronic** thermometer like these.',
        ],
        ask: 'Drag the thermometer to each child\'s ear to take their temperature.',
        activity: true,
        scene(stage, api) {
          const KIDS = [
            { x: 160, skin: '#8D5524', hair: '#2B1B10', shirt: '#E53935', t: 36.8, name: 'Amir' },
            { x: 400, skin: '#F1C27D', hair: '#6D4C41', shirt: '#43A047', t: 37.1, name: 'Lily' },
            { x: 640, skin: '#C68642', hair: '#1B1B1B', shirt: '#1E88E5', t: 36.6, name: 'Zara' },
          ];
          const svg = api.svg(`
            <rect width="800" height="520" fill="#EEF5FA"/>
            <rect y="470" width="800" height="50" fill="#CFDDE8"/>
            ${KIDS.map((k, i) => `${S.kid({ x: k.x, y: 470, s: 1.15, skin: k.skin, hair: k.hair, shirt: k.shirt, coat: false })}
              <g id="l4-use5-r${i}"></g>`).join('')}
            <g id="l4-use5-th" transform="translate(400 70)">
              <path d="M-80 -10 L60 -10 Q80 -10 80 10 Q80 30 60 30 L-80 30 Q-100 10 -80 -10Z" fill="#fff" stroke="#90A4AE" stroke-width="3"/>
              <rect x="-20" y="-6" width="76" height="32" rx="4" fill="#B2DFDB" stroke="#455A64" stroke-width="2"/>
              <text id="l4-use5-lcd" x="18" y="18" text-anchor="middle" font-size="20" font-weight="800" fill="#263238" font-family="monospace">--.-</text>
              <rect x="-84" y="-4" width="14" height="28" rx="6" fill="#1E88E5"/>
              <rect x="-100" y="-30" width="200" height="80" fill="#fff" opacity="0"/>
            </g>`);
          const lcd = S.q(svg, '#l4-use5-lcd');
          const done = new Set();
          let busy = false;
          const node = S.q(svg, '#l4-use5-th');
          const d = api.draggable(svg, node, {
            bounds: { x1: 100, y1: 40, x2: 700, y2: 460 },
            onStart: () => { if (!busy) api.sfx('pick'); },
            onDrop: async p => {
              if (busy) return false;
              const i = KIDS.findIndex(k => Math.abs(p.x - (k.x + 50)) < 90 && Math.abs(p.y - (470 - 190)) < 80);
              if (i < 0) return true;
              const k = KIDS[i];
              busy = true;
              d.animateTo(k.x + 60, 470 - 192, 200);
              await api.tween(1800, (e, raw) => { lcd.textContent = (34 + (k.t - 34) * e).toFixed(1); }, W.ease.out);
              if (!api.alive()) return;
              lcd.textContent = k.t.toFixed(1);
              api.sfx('chirp');
              S.q(svg, `#l4-use5-r${i}`).innerHTML = `<g class="pop-in">${L4.pill(k.x, 250, `${k.t} °C`, { size: 22, fill: '#E3F4DE', stroke: '#3E9B4F' })}</g>`;
              api.say(`Beep! ${k.name} is ${k.t} degrees Celsius.`);
              done.add(i);
              busy = false;
              if (done.size === 3) {
                api.choice({
                  q: 'What is the temperature of a healthy human body?', options: ['About 20 °C', 'About 37 °C', 'About 100 °C'], correct: 1,
                  hints: { 0: 'Look at the readings. They are all close to one number.', 2: 'That is much too hot! Look at the readings.' },
                  explain: 'A healthy body is about 37 °C. It does not change very much.',
                  onRight: () => api.star(),
                });
              }
              return true;
            },
          });
        },
      },
    ],
  });
})();
