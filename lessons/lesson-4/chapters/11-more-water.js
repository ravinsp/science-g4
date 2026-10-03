// Chapter 11: More about water
(() => {
  const f = S.f1;
  const icon = inner => `<svg viewBox="0 0 100 80" xmlns="${S.NS}">${inner}</svg>`;
  const PLACES = [
    { id: 'leaf', bin: 'below', label: 'frosty leaf', svg: icon(`<rect width="100" height="80" fill="#37474F"/><g transform="translate(20 62) rotate(-35)">${S.leaf({ L: 60, W: 22, color: '#E0703A', stalk: 6 })}</g>${[...Array(14)].map((_, i) => `<path d="M${30 + (i * 13) % 50} ${18 + (i * 7) % 40} l3 -3" stroke="#fff" stroke-width="2"/>`).join('')}`) },
    { id: 'grass', bin: 'above', label: 'dewy grass', svg: icon(`<rect width="100" height="80" fill="#C5E1A5"/><path d="M20 80 Q24 40 18 10 M40 80 Q44 30 50 8 M60 80 Q58 40 66 14 M80 80 Q84 46 78 20" stroke="#43A047" stroke-width="5" fill="none"/>${[[20, 30], [48, 22], [64, 40], [80, 32]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="#E1F5FE" stroke="#4FC3F7"/>`).join('')}`) },
    { id: 'pond', bin: 'below', label: 'frozen pond', svg: icon(`<rect width="100" height="80" fill="#ECEFF1"/><ellipse cx="50" cy="48" rx="44" ry="20" fill="#B3E5FC" stroke="#81D4FA" stroke-width="3"/><path d="M24 44 l20 6 M56 40 l18 8" stroke="#fff" stroke-width="3"/>`) },
    { id: 'puddle', bin: 'above', label: 'rain puddle', svg: icon(`<rect width="100" height="80" fill="#BCAAA4"/><ellipse cx="50" cy="52" rx="40" ry="14" fill="#4FC3F7"/><circle cx="40" cy="50" r="6" fill="none" stroke="#fff" stroke-width="2"/>${[20, 50, 80].map(x => `<path d="M${x} 6 l-4 12" stroke="#4FC3F7" stroke-width="3"/>`).join('')}`) },
    { id: 'icicle', bin: 'below', label: 'icicles', svg: icon(`<rect width="100" height="80" fill="#455A64"/><rect x="0" y="0" width="100" height="14" fill="#8D6E63"/>${[14, 34, 52, 72, 88].map((x, i) => `<path d="M${x - 6} 14 L${x + 6} 14 L${x} ${40 + (i % 2) * 24}Z" fill="#E3F2FD"/>`).join('')}`) },
    { id: 'pool', bin: 'above', label: 'paddling pool', svg: icon(`<rect width="100" height="80" fill="#AED581"/><ellipse cx="50" cy="46" rx="44" ry="22" fill="#FF7043"/><ellipse cx="50" cy="44" rx="36" ry="15" fill="#4FC3F7"/>`) },
  ];

  App.chapter({
    id: 'more-water',
    title: 'More about water',
    icon: '🌊',
    group: 'Changing state',
    keywords: [
      { w: 'boils', d: 'Gets so hot that it bubbles and turns into a gas. Water boils at 100 °C.' },
      { w: 'indoors', d: 'Inside a building.' },
      { w: 'outdoors', d: 'Outside, in the open air.' },
    ],
    steps: [
      // ---------- a) Heating and cooling arrows ----------
      {
        text: [
          'Water changes from one state to another at different temperatures.',
          'The red arrows show ice being heated. It changes to liquid water and then to water vapour.',
          'The blue arrows show water vapour being cooled. It changes to liquid water and then to ice.',
        ],
        ask: 'Drag the labels to the arrows.',
        activity: true,
        scene(stage, api) {
          const svg = api.svg(`
            <rect width="800" height="520" fill="#FBFBFD"/>
            <path d="M320 20 L330 30 L330 140 Q330 150 340 150 L460 150 Q470 150 470 140 L470 30 L480 20" fill="#fff" stroke="#263238" stroke-width="5"/>
            ${[[350, 140, 6], [400, 140, -8], [440, 140, 4], [372, 96, 12], [424, 98, -10]].map(([x, y, r]) => L4.ice({ x, y, e: 40, rot: r })).join('')}
            <path d="M320 200 L330 210 L330 320 Q330 330 340 330 L460 330 Q470 330 470 320 L470 210 L480 200" fill="#fff" stroke="#263238" stroke-width="5"/>
            <rect x="334" y="250" width="132" height="76" fill="#81D4FA"/>
            <path d="M345 420 C320 380 360 360 380 372 C390 350 440 352 446 378 C476 372 486 410 460 424 C470 450 430 470 410 456 C390 476 350 466 352 446 C330 448 324 426 345 420Z" fill="#fff" stroke="#90CAF9" stroke-width="4"/>
            ${S.text(270, 95, 'ice', { size: 20, anchor: 'end' })}${S.text(530, 95, 'solid', { size: 20, anchor: 'start' })}
            ${S.text(270, 275, 'water', { size: 20, anchor: 'end' })}${S.text(530, 275, 'liquid', { size: 20, anchor: 'start' })}
            ${S.text(270, 430, 'water vapour', { size: 20, anchor: 'end' })}${S.text(530, 430, 'gas', { size: 20, anchor: 'start' })}
            ${S.arrow(380, 192, 380, 160, { color: '#1E88E5', w: 6 })}${S.arrow(420, 160, 420, 192, { color: '#C62828', w: 6 })}
            ${S.arrow(380, 372, 380, 340, { color: '#1E88E5', w: 6 })}${S.arrow(420, 340, 420, 372, { color: '#C62828', w: 6 })}`);
          api.dragLabels(svg, [
            { id: 'freezing', label: 'freezing', x: 356, y: 176, lx: 160, ly: 176 },
            { id: 'melting', label: 'melting', x: 444, y: 176, lx: 640, ly: 176 },
            { id: 'condensation', label: 'condensation', x: 356, y: 356, lx: 150, ly: 356 },
            { id: 'evaporation', label: 'evaporation', x: 444, y: 356, lx: 650, ly: 356 },
          ], {
            radius: 70,
            onDone: () => {
              api.star();
              api.sayAfter('Heating: melting, then evaporation. Cooling: condensation, then freezing.');
            },
          });
        },
      },

      // ---------- b) 0 °C and 100 °C ----------
      {
        text: [
          'The arrows on this thermometer show two important temperatures for water. These were used to make the Celsius scale.',
          'Water **boils** at 100 °C. Ice melts and water freezes at 0 °C.',
        ],
        ask: 'Move the slider. Find the temperatures where water changes state.',
        activity: true,
        scene(stage, api) {
          const th = L4.thermo({ x: 470, y: 50, h: 400, min: -20, max: 110, major: 10, minor: 5, value: 20, id: 'l4-mw2', font: 16 });
          const svg = api.svg(`
            <clipPath id="l4-mw2-clip"><rect x="94" y="180" width="172" height="196"/></clipPath>
            <rect width="800" height="520" fill="#F3F7FB"/>
            <g id="l4-mw2-steam"></g>
            <g clip-path="url(#l4-mw2-clip)"><g id="l4-mw2-in"></g></g>
            ${L4.beaker({ x: 180, y: 380, w: 180, h: 210, level: 0 })}
            <text id="l4-mw2-state" x="180" y="440" text-anchor="middle" font-size="26" font-weight="800" fill="#1E88E5">liquid</text>
            ${th.svg}
            <g id="l4-mw2-marks"></g>`);
          const inG = S.q(svg, '#l4-mw2-in'), steam = S.q(svg, '#l4-mw2-steam'), stateT = S.q(svg, '#l4-mw2-state'), marks = S.q(svg, '#l4-mw2-marks');
          let T = 20, seen0 = false, seen100 = false, done = false;
          const markAt = (v, text) => `<g class="fade-in">${S.arrow(620, th.yOf(v), 520, th.yOf(v), { color: '#3B3F6B', w: 3, head: 10 })}${L4.pill(690, th.yOf(v), text, { size: 17, fill: '#FDEBE1' })}</g>`;
          api.loop((dt, t) => {
            const solid = T <= 0, gas = T >= 100;
            inG.innerHTML = solid
              ? `<rect x="94" y="250" width="172" height="130" fill="#E1F5FE"/>${[[120, 376], [170, 376], [220, 376], [140, 330], [196, 332], [168, 290]].map(([x, y], i) => L4.ice({ x, y, e: 42, rot: (i * 7) % 15 - 7 })).join('')}`
              : `<rect x="94" y="${gas ? 270 : 250}" width="172" height="130" fill="#4FC3F7" opacity=".75"/>
                ${gas ? [...Array(10)].map((_, i) => `<circle cx="${100 + (i * 37) % 160}" cy="${f(370 - ((t * 120 + i * 29) % 100))}" r="${4 + i % 4}" fill="#fff" opacity=".85"/>`).join('') : ''}`;
            steam.innerHTML = gas ? [0, 1, 2].map(i => `<path d="${L4.wisp(140 + i * 40, 170, 110, t * 1.6 + i * 2, 12)}" stroke="#CFD8DC" stroke-width="14" fill="none" stroke-linecap="round" opacity=".75"/>`).join('') : '';
            stateT.textContent = solid ? 'solid (ice)' : gas ? 'gas (water vapour)' : 'liquid (water)';
            stateT.setAttribute('fill', solid ? '#1565C0' : gas ? '#546E7A' : '#0277BD');
          });
          let ready = false;
          api.slider({
            label: '🌡️ Temperature', min: -20, max: 110, step: 5, value: 20, format: v => `${String(v).replace('-', '−')} °C`,
            onInput: v => {
              T = v; th.set(svg, v);
              if (!ready) { ready = true; return; }
              if (v <= 0 && !seen0) { seen0 = true; marks.insertAdjacentHTML('beforeend', markAt(0, 'ice melts / water freezes')); api.sfx('magic'); api.say('At zero degrees Celsius, water freezes into ice.'); }
              if (v >= 100 && !seen100) { seen100 = true; marks.insertAdjacentHTML('beforeend', markAt(100, 'water boils')); api.sfx('bubble'); api.say('At one hundred degrees Celsius, water boils.'); }
              if (seen0 && seen100 && !done) {
                done = true;
                api.star();
                api.timeout(() => api.praise('Below 0 °C water is a solid. Above 100 °C it is a gas. In between, it is a liquid.'), 2600);
              }
            },
          });
        },
      },

      // ---------- c) Frozen or liquid? ----------
      {
        text: [
          'The water on these leaves is frozen. The temperature is below 0 °C.',
          'The water on this grass is liquid. The temperature is above 0 °C.',
        ],
        ask: 'Is the temperature below 0 °C or above 0 °C? Sort the pictures.',
        activity: true,
        scene(stage, api) {
          const wrap = api.html('');
          api.sortGame(wrap, {
            bins: [{ id: 'below', title: '❄️ below 0 °C' }, { id: 'above', title: '💧 above 0 °C' }],
            items: PLACES.map(p => Object.assign({}, p, { hint: p.bin === 'below' ? `The water in the ${p.label} is frozen, so it is below 0 °C.` : `The water in the ${p.label} is liquid, so it is above 0 °C.` })),
            onDone: () => api.star(),
          });
        },
      },

      // ---------- d) Indoors and outdoors ----------
      {
        text: ['What is the air temperature where you live? Use a thermometer to find out.'],
        ask: ['Does the temperature differ **indoors** and **outdoors**?', 'Drag the thermometer inside the house, then outside.'],
        activity: true,
        scene(stage, api) {
          const th = L4.thermo({ x: 0, y: -170, h: 150, min: -10, max: 40, major: 10, minor: 2, value: 15, id: 'l4-mw4', font: 16, w: 12 });
          const svg = api.svg(`
            ${S.sky()}
            ${S.cloud({ x: 640, y: 80, s: 1 })}
            ${S.ground({ y: 450, w: 800, h: 70, fill: 'url(#g-grass)' })}
            ${S.tree({ x: 650, y: 450, h: 230, canopy: 90 })}
            <path d="M80 200 L280 70 L480 200Z" fill="#B23A2B" stroke="#7A2318" stroke-width="4"/>
            <rect x="100" y="200" width="360" height="250" fill="#FFF3D6" stroke="#8D6E63" stroke-width="5"/>
            <rect x="140" y="240" width="90" height="80" fill="#FFE0B2" stroke="#8D6E63" stroke-width="3"/>
            <rect x="320" y="330" width="70" height="120" fill="#8D6E63"/>
            <rect x="150" y="380" width="110" height="70" rx="8" fill="#E57373"/>
            ${S.text(280, 236, 'indoors', { size: 20, fill: '#8D6E63' })}${S.text(610, 220, 'outdoors', { size: 20, fill: '#2E7D32' })}
            <g id="l4-mw4-tags"></g>
            <g id="l4-mw4-th" transform="translate(560 420)" class="hot">${th.svg}<rect x="-30" y="-220" width="80" height="240" fill="#fff" opacity="0"/></g>`);
          const node = S.q(svg, '#l4-mw4-th'), tags = S.q(svg, '#l4-mw4-tags');
          let v = 15;
          const read = {};
          const go = async (to) => { const from = v; await api.tween(1200, k => { v = from + (to - from) * k; th.set(svg, v); }, W.ease.out); };
          api.draggable(svg, node, {
            bounds: { x1: 40, y1: 250, x2: 760, y2: 440 },
            onStart: () => api.sfx('pick'),
            onDrop: async p => {
              const where = p.x > 110 && p.x < 450 ? 'in' : p.x > 500 ? 'out' : null;
              if (!where) return true;
              await go(where === 'in' ? 21 : 9);
              if (!api.alive()) return;
              api.sfx('tick');
              if (!read[where]) {
                read[where] = true;
                tags.insertAdjacentHTML('beforeend', `<g class="pop-in">${where === 'in' ? L4.pill(280, 160, 'indoors: 21 °C', { fill: '#FFE0B2' }) : L4.pill(610, 160, 'outdoors: 9 °C', { fill: '#C8E6C9' })}</g>`);
              }
              api.say(where === 'in' ? 'Indoors it is 21 degrees Celsius.' : 'Outdoors it is 9 degrees Celsius.');
              if (read.in && read.out && !read.asked) {
                read.asked = true;
                api.choice({
                  q: 'Where is it warmer today?', options: ['🏠 Indoors', '🌳 Outdoors'], correct: 0,
                  hints: { 1: 'Compare the numbers. 21 is more than 9.' },
                  explain: 'It is warmer indoors today. The temperature indoors and outdoors can be different.',
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
