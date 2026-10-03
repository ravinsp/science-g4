// Chapter 9: Changing state
(() => {
  const f = S.f1;
  const icon = inner => `<svg viewBox="0 0 100 80" xmlns="${S.NS}">${inner}</svg>`;
  const MATTER = [
    { id: 'rock', bin: 'solid', label: 'rock', svg: icon(`<path d="${L4.blob(50, 46, 34, 24, 4, 8, .2)}" fill="#9E9E9E" stroke="#616161" stroke-width="3"/>`) },
    { id: 'spoon', bin: 'solid', label: 'wooden spoon', svg: icon(`<ellipse cx="26" cy="40" rx="18" ry="12" fill="#C47A3D" stroke="#7A4A1F" stroke-width="3"/><path d="M42 40 L92 40" stroke="#C47A3D" stroke-width="8" stroke-linecap="round"/>`) },
    { id: 'ice', bin: 'solid', label: 'ice cube', svg: icon(L4.ice({ x: 46, y: 70, e: 44 })) },
    { id: 'milk', bin: 'liquid', label: 'milk', svg: icon(L4.glass({ x: 50, y: 76, w: 44, h: 64, level: .8, liquid: '#F5F2EA' })) },
    { id: 'juice', bin: 'liquid', label: 'juice', svg: icon(L4.glass({ x: 50, y: 76, w: 44, h: 64, level: .8, liquid: '#FF9800' })) },
    { id: 'honey', bin: 'liquid', label: 'honey', svg: icon(`<path d="M30 30 L70 30 L74 74 L26 74Z" fill="#F2A922" stroke="#B97F1A" stroke-width="3"/><rect x="28" y="20" width="44" height="12" rx="3" fill="#8D6E63"/>`) },
    { id: 'air', bin: 'gas', label: 'air in a balloon', svg: icon(L4.balloon({ x: 50, y: 32, rx: 22, ry: 26, color: '#42A5F5', string: 14 })) },
    { id: 'steam', bin: 'gas', label: 'steam', svg: icon(`<path d="M24 60 L76 60 L70 76 L30 76Z" fill="#78909C"/><path d="M36 54 q-8 -12 0 -24 t0 -24 M50 54 q-8 -12 0 -24 t0 -24 M64 54 q-8 -12 0 -24 t0 -24" stroke="#B0BEC5" stroke-width="5" fill="none" stroke-linecap="round"/>`) },
    { id: 'helium', bin: 'gas', label: 'helium', svg: icon(`<rect x="34" y="12" width="32" height="64" rx="14" fill="#90A4AE" stroke="#546E7A" stroke-width="3"/><rect x="34" y="38" width="32" height="12" fill="#CE93D8"/>`) },
  ];

  App.chapter({
    id: 'changing',
    title: 'Changing state',
    icon: '🫠',
    group: 'Changing state',
    keywords: [
      { w: 'matter', d: 'Everything around us that takes up space, like air, water, wood and you.' },
      { w: 'change state', d: 'To change from a solid, liquid or gas into a different one.' },
      { w: 'heated', d: 'Made hotter.' },
      { w: 'cooled', d: 'Made colder.' },
    ],
    steps: [
      // ---------- a) Three states of matter ----------
      {
        text: [
          'All the materials and all the other things in the world such as air and water are called **matter**.',
          'There are three different states of matter: solid, liquid and gas.',
        ],
        ask: 'Sort the matter into solids, liquids and gases.',
        activity: true,
        scene(stage, api) {
          const wrap = api.html('');
          api.sortGame(wrap, {
            bins: [{ id: 'solid', title: '🧱 Solid' }, { id: 'liquid', title: '💧 Liquid' }, { id: 'gas', title: '💨 Gas' }],
            items: MATTER.map(m => Object.assign({}, m, { hint: m.bin === 'solid' ? `The ${m.label} keeps its shape. It is a solid.` : m.bin === 'liquid' ? `The ${m.label} can be poured. It is a liquid.` : `${m.label[0].toUpperCase() + m.label.slice(1)} spreads out to fill a space. It is a gas.` })),
            onDone: () => api.star(),
          });
        },
      },

      // ---------- b) Melting butter and ice cream ----------
      {
        text: ['We can watch some things **change state**.', 'These solids need to be **heated** to change state.'],
        ask: 'Drag the butter and the ice cream into the sunshine. Watch them melt.',
        activity: true,
        scene(stage, api) {
          const svg = api.svg(`
            <rect width="800" height="520" fill="#E3F2FD"/>
            <rect x="0" y="0" width="300" height="520" fill="#B3E5FC"/>
            ${S.text(150, 50, '❄️ fridge', { size: 22, fill: '#1565C0' })}
            <rect x="300" y="0" width="500" height="520" fill="#FFF3C4"/>
            ${S.sun({ x: 700, y: 80, r: 40 })}
            ${S.text(500, 50, '☀️ sunshine', { size: 22, fill: '#B26A00' })}
            <rect y="440" width="800" height="80" fill="#D7CCC8"/>
            <path d="M420 440 L760 440" stroke="#BCAAA4" stroke-width="10" stroke-linecap="round"/>
            <g id="l4-chg2-butter" transform="translate(150 200)" class="hot"><g class="l4-chg2-art"></g><rect x="-80" y="-70" width="160" height="110" fill="#fff" opacity="0"/></g>
            <g id="l4-chg2-ice" transform="translate(150 390)" class="hot"><g class="l4-chg2-art"></g><rect x="-60" y="-110" width="120" height="160" fill="#fff" opacity="0"/></g>`);
          const butter = (m, warm) => `${m > 0 ? `<path d="${L4.blob(0, 30, 40 + m * 60, 8 + m * 10, 2, 9, .12)}" fill="#FFE066" stroke="#E0B000" stroke-width="2"/>` : ''}
            <g transform="translate(0 ${f(m * 20)}) scale(${f(1 - m * .5)} ${f(1 - m * .7)})">
              <path d="M-50 -24 L-30 -44 L60 -44 L40 -24Z" fill="#FFF0A0" stroke="#D9B400" stroke-width="2"/>
              <path d="M40 -24 L60 -44 L60 6 L40 26Z" fill="#F2CF3A" stroke="#D9B400" stroke-width="2"/>
              <rect x="-50" y="-24" width="90" height="50" rx="${f(4 + m * 14)}" fill="#FFE066" stroke="#D9B400" stroke-width="2"/></g>
            ${S.text(0, 70, warm ? 'warm butter' : 'cold butter', { size: 18, fill: '#6E665A' })}`;
          const ice = (m, warm) => `${m > 0 ? `<path d="${L4.blob(10, 30, 20 + m * 50, 4 + m * 8, 6, 9, .2)}" fill="#F48FB1" opacity=".9"/>` : ''}
            <path d="M-26 -40 L0 30 L26 -40Z" fill="#E8B05C" stroke="#A9741F" stroke-width="2"/>
            <path d="M-18 -30 L18 -30 M-12 -14 L12 -14 M-6 2 L6 2" stroke="#A9741F" stroke-width="1.5"/>
            <path d="M-34 -42 C-40 -80 40 -80 34 -42 ${m > .1 ? `Q24 ${f(-40 + m * 40)} 18 ${f(-40 + m * 30)} Q10 -42 0 ${f(-40 + m * 50)} Q-12 -42 -20 ${f(-40 + m * 26)}` : ''} Z" fill="#F8BBD0" stroke="#D81B60" stroke-width="2" transform="translate(0 ${f(m * 14)}) scale(1 ${f(1 - m * .5)})"/>
            ${S.text(0, 70, warm ? 'warm ice cream' : 'cold ice cream', { size: 18, fill: '#6E665A' })}`;
          const items = [
            { id: 'butter', node: S.q(svg, '#l4-chg2-butter'), draw: butter, m: 0, warm: false },
            { id: 'ice', node: S.q(svg, '#l4-chg2-ice'), draw: ice, m: 0, warm: false },
          ];
          items.forEach(it => {
            const art = S.q(it.node, '.l4-chg2-art');
            it.redraw = () => { art.innerHTML = it.draw(it.m, it.warm); };
            it.redraw();
            api.draggable(svg, it.node, {
              bounds: { x1: 80, y1: 120, x2: 720, y2: 400 },
              onStart: () => api.sfx('pick'),
              onDrop: p => {
                it.warm = p.x > 330;
                if (it.warm) api.say(`The ${it.id === 'ice' ? 'ice cream' : 'butter'} is in the warm sunshine.`);
                it.redraw();
                return true;
              },
            });
          });
          let done = false, lastSay = 0;
          api.loop((dt, t) => {
            items.forEach(it => {
              if (!it.warm || it.m >= 1) return;
              it.m = Math.min(1, it.m + dt * .12);
              it.redraw();
              if (it.m >= 1) { api.sfx('drip'); if (t - lastSay > 2) { lastSay = t; api.say(`The ${it.id === 'ice' ? 'ice cream' : 'butter'} has melted. It changed state from a solid to a liquid.`); } }
            });
            if (!done && items.every(it => it.m >= 1)) {
              done = true;
              api.star();
              api.timeout(() => api.praise('Heating made the solids change state. They melted into liquids.'), 3000);
            }
          });
        },
      },

      // ---------- c) Cooling liquid metal ----------
      {
        text: ['The liquid metal needs to be **cooled** to change state.'],
        ask: 'Pour the hot liquid metal into the mould. Then cool it down.',
        activity: true,
        scene(stage, api) {
          const svg = api.svg(`
            <defs><radialGradient id="l4-chg3-glow" cx=".5" cy=".5" r=".6"><stop offset="0" stop-color="#FFF59D"/><stop offset=".5" stop-color="#FF9800"/><stop offset="1" stop-color="#D84315"/></radialGradient></defs>
            <rect width="800" height="520" fill="#263238"/>
            <rect y="430" width="800" height="90" fill="#37474F"/>
            <g id="l4-chg3-pot" transform="rotate(0 230 170)">
              <path d="M140 110 L320 110 L300 240 Q296 260 276 260 L184 260 Q164 260 160 240Z" fill="#546E7A" stroke="#90A4AE" stroke-width="4"/>
              <rect id="l4-chg3-potin" x="160" y="130" width="140" height="110" fill="url(#l4-chg3-glow)"/>
              <path d="M320 110 L340 96" stroke="#90A4AE" stroke-width="8" stroke-linecap="round"/>
            </g>
            <path id="l4-chg3-stream" d="" stroke="#FF9800" stroke-width="12" fill="none" stroke-linecap="round"/>
            <rect x="380" y="380" width="300" height="50" fill="#455A64" stroke="#90A4AE" stroke-width="4"/>
            <rect x="400" y="380" width="260" height="30" fill="#263238"/>
            <rect id="l4-chg3-bar" x="400" y="410" width="260" height="0" fill="url(#l4-chg3-glow)"/>
            <rect id="l4-chg3-cool" x="400" y="380" width="260" height="30" fill="#9E9E9E" opacity="0"/>
            <g id="l4-chg3-steam"></g>
            <g id="l4-chg3-out" opacity="0"><rect x="400" y="300" width="260" height="30" rx="3" fill="#B0BEC5" stroke="#78909C" stroke-width="3"/>
              <path d="M410 306 L640 306" stroke="#fff" stroke-width="4" opacity=".6"/></g>
            <g id="l4-chg3-tag" transform="translate(700 120)">${L4.pill(0, 0, 'hot!', { size: 22, fill: '#FFCCBC' })}</g>`);
          const pot = S.q(svg, '#l4-chg3-pot'), potIn = S.q(svg, '#l4-chg3-potin'), stream = S.q(svg, '#l4-chg3-stream');
          const bar = S.q(svg, '#l4-chg3-bar'), cool = S.q(svg, '#l4-chg3-cool'), steam = S.q(svg, '#l4-chg3-steam'), out = S.q(svg, '#l4-chg3-out');
          let poured = false, cooling = false, k = 0, done = false;
          const pourBtn = api.button('🫗 Pour the metal', async () => {
            if (poured) return;
            poured = true; pourBtn.disabled = true;
            await api.tween(700, e => pot.setAttribute('transform', `rotate(${f(e * 60)} 230 170)`));
            if (!api.alive()) return;
            api.sfx('pour');
            await api.tween(2200, (e, raw) => {
              stream.setAttribute('d', raw < .95 ? `M348 120 Q470 120 530 ${f(410 - 30 * e)}` : '');
              bar.setAttribute('y', f(410 - 30 * e)); bar.setAttribute('height', f(30 * e));
              potIn.setAttribute('height', f(110 * (1 - e))); potIn.setAttribute('y', f(130 + 110 * e));
            }, W.ease.linear);
            if (!api.alive()) return;
            await api.tween(600, e => pot.setAttribute('transform', `rotate(${f(60 - e * 60)} 230 170)`));
            api.say('The mould is full of hot liquid metal. Now cool it down.');
            coolBtn.disabled = false; coolBtn.classList.add('pulse');
          }, { cls: 'primary', sound: null });
          const coolBtn = L4.hold(api, '💦 Hold to cool it', { onDown: () => { cooling = true; api.sfx('spray'); }, onUp: () => { cooling = false; } });
          coolBtn.disabled = true;
          api.loop((dt, t) => {
            if (cooling && k < 1) {
              k = Math.min(1, k + dt * .3);
              cool.setAttribute('opacity', f(k));
              coolBtn.classList.remove('pulse');
              steam.innerHTML = [0, 1, 2, 3, 4].map(i => `<path d="${L4.wisp(420 + i * 55, 376, 80, t + i, 8)}" stroke="#ECEFF1" stroke-width="6" fill="none" stroke-linecap="round" opacity="${f(.6 * (1 - k))}"/>`).join('');
              if (k >= 1 && !done) {
                done = true;
                steam.innerHTML = '';
                api.sfx('knock');
                bar.setAttribute('height', 0);
                S.q(svg, '#l4-chg3-tag').innerHTML = L4.pill(0, 0, 'cool', { size: 22, fill: '#BBDEFB' });
                api.tween(900, e => { out.setAttribute('opacity', f(e)); out.setAttribute('transform', `translate(0 ${f(80 * (1 - e))})`); cool.setAttribute('opacity', f(1 - e)); }, W.ease.out);
                api.star();
                api.praise('The liquid metal cooled down and changed state. Now it is a solid metal bar.');
              }
            } else if (!cooling) steam.innerHTML = '';
          });
        },
      },

      // ---------- d) Hotter and cooler ----------
      {
        text: ['Different substances change state at different temperatures.'],
        ask: 'Drag the labels to finish the diagram.',
        activity: true,
        scene(stage, api) {
          const svg = api.svg(`
            <rect width="800" height="520" fill="#FBFBFD"/>
            <path d="M330 60 C300 40 330 0 380 20 C400 -6 470 0 470 40 C510 40 520 90 470 100 L340 100 C300 100 300 70 330 60Z" fill="#CFD8DC" stroke="#546E7A" stroke-width="3" transform="translate(0 30)"/>
            <path d="M320 230 L330 240 L330 300 Q330 310 340 310 L460 310 Q470 310 470 300 L470 240 L480 230" fill="#B3E5FC" stroke="#37474F" stroke-width="4"/>
            <rect x="334" y="250" width="132" height="56" fill="#81D4FA" opacity=".7"/>
            <rect x="330" y="380" width="140" height="80" rx="10" fill="#B3E5FC" stroke="#37474F" stroke-width="4"/>
            ${S.arrow(380, 220, 380, 150, { color: '#C62828', w: 5 })}${S.arrow(420, 150, 420, 220, { color: '#1E88E5', w: 5 })}
            ${S.arrow(380, 372, 380, 320, { color: '#C62828', w: 5 })}${S.arrow(420, 320, 420, 372, { color: '#1E88E5', w: 5 })}
            ${S.arrow(240, 470, 240, 40, { color: '#C62828', w: 18, head: 30 })}
            ${S.arrow(560, 40, 560, 470, { color: '#1E88E5', w: 18, head: 30 })}`);
          api.dragLabels(svg, [
            { id: 'gas', label: 'gas', x: 400, y: 100, lx: 400, ly: 82 },
            { id: 'liquid', label: 'liquid', x: 400, y: 280, lx: 400, ly: 280 },
            { id: 'solid', label: 'solid', x: 400, y: 420, lx: 400, ly: 420 },
            { id: 'hot', label: 'getting hotter', x: 240, y: 260, lx: 120, ly: 260 },
            { id: 'cool', label: 'getting cooler', x: 560, y: 260, lx: 680, ly: 260 },
          ], {
            onDone: () => {
              api.star();
              api.sayAfter('Getting hotter: solid, then liquid, then gas. Getting cooler: gas, then liquid, then solid.');
            },
          });
        },
      },

      // ---------- e) Chocolate or metal? ----------
      {
        text: ['Different substances change state at different temperatures.'],
        ask: ['Which melts at a lower temperature, chocolate or metal?', 'Turn up the heat and find out.'],
        activity: true,
        scene(stage, api) {
          const th = L4.thermo({ x: 720, y: 60, h: 340, min: 0, max: 300, major: 50, minor: 10, value: 20, id: 'l4-chg5', font: 16 });
          const svg = api.svg(`
            <rect width="800" height="520" fill="#FFF8F0"/>
            <rect x="40" y="380" width="580" height="60" rx="10" fill="#455A64"/>
            <ellipse id="l4-chg5-ring1" cx="180" cy="380" rx="110" ry="12" fill="#212121"/>
            <ellipse id="l4-chg5-ring2" cx="480" cy="380" rx="110" ry="12" fill="#212121"/>
            <g id="l4-chg5-choc"></g>
            <g id="l4-chg5-pan">
              <path d="M380 300 Q380 370 480 370 Q580 370 580 300Z" fill="#B0BEC5" stroke="#607D8B" stroke-width="4"/>
              <ellipse cx="480" cy="300" rx="100" ry="18" fill="#CFD8DC" stroke="#607D8B" stroke-width="4"/>
              <path d="M580 300 L650 270" stroke="#607D8B" stroke-width="12" stroke-linecap="round"/></g>
            ${S.text(180, 480, 'chocolate', { size: 22 })}${S.text(480, 480, 'metal pan', { size: 22 })}
            ${th.svg}
            <text id="l4-chg5-t" x="740" y="470" text-anchor="middle" font-size="22" font-weight="800" fill="#C62828">20 °C</text>`);
          const choc = S.q(svg, '#l4-chg5-choc'), rings = [S.q(svg, '#l4-chg5-ring1'), S.q(svg, '#l4-chg5-ring2')];
          const drawChoc = m => {
            choc.innerHTML = `${m > 0 ? `<path d="${L4.blob(180, 372, 50 + m * 70, 6 + m * 6, 9, 10, .15)}" fill="#5D2E12"/>` : ''}
              <g transform="translate(180 ${f(370 - (1 - m) * 0)}) scale(${f(1 - m * .3)} ${f(1 - m * .9)})">
              <rect x="-80" y="-50" width="160" height="50" rx="${f(4 + m * 20)}" fill="#6D3519" stroke="#3E1C0B" stroke-width="3"/>
              ${m < .5 ? `<path d="M-40 -50 L-40 0 M0 -50 L0 0 M40 -50 L40 0 M-80 -25 L80 -25" stroke="#3E1C0B" stroke-width="2"/>` : ''}</g>`;
          };
          drawChoc(0);
          let melted = 0, said = false, asked = false, ready = false;
          api.slider({
            label: '🔥 Heat', min: 20, max: 300, step: 5, value: 20, format: v => `${v} °C`,
            onInput: v => {
              th.set(svg, v);
              S.q(svg, '#l4-chg5-t').textContent = `${v} °C`;
              rings.forEach(r => r.setAttribute('fill', S.mix('#212121', '#FF3D00', S.clamp((v - 20) / 200))));
              melted = Math.max(melted, S.clamp((v - 30) / 25));
              drawChoc(melted);
              if (!ready) { ready = true; return; }
              if (melted >= 1 && !said) { said = true; api.sfx('drip'); api.say('The chocolate melted at a low temperature! The metal pan is still solid.'); }
              if (v >= 300 && melted >= 1 && !asked) {
                asked = true;
                api.say('Even at 300 degrees, the metal pan has not melted.');
                const first = api.choice({
                  q: 'Which melts at a lower temperature?', options: ['🍫 Chocolate', '🍳 Metal'], correct: 0,
                  hints: { 1: 'The metal pan did not melt at all. Look at the chocolate.' },
                  explain: 'Chocolate melts at a much lower temperature than metal.',
                  onRight: () => api.timeout(() => {
                    first.parentNode.remove();
                    api.choice({
                      q: 'Could you cook things in a pot made from chocolate?', options: ['Yes', 'No'], correct: 1,
                      hints: { 0: 'What happened to the chocolate when it got hot?' },
                      explain: 'No! A chocolate pot would melt. That is why pans are made of metal.',
                      onRight: () => api.star(),
                    });
                  }, 2500),
                });
              }
            },
          });
        },
      },
    ],
  });
})();
