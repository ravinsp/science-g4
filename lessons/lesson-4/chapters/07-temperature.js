// Chapter 7: Temperature
(() => {
  const f = S.f1;
  const icon = inner => `<svg viewBox="0 0 100 80" xmlns="${S.NS}">${inner}</svg>`;
  const ITEMS = [
    { id: 'sun', bin: 'hot', label: 'the Sun', svg: icon(`<circle cx="50" cy="40" r="20" fill="#FFC93C"/>${[...Array(10)].map((_, i) => { const a = i * Math.PI / 5; return `<path d="M${f(50 + Math.cos(a) * 26)} ${f(40 + Math.sin(a) * 26)} L${f(50 + Math.cos(a) * 36)} ${f(40 + Math.sin(a) * 36)}" stroke="#FFA000" stroke-width="5" stroke-linecap="round"/>`; }).join('')}`) },
    { id: 'fire', bin: 'hot', label: 'a campfire', svg: icon(`<path d="M30 70 L70 60 M30 60 L70 70" stroke="#6D4C41" stroke-width="7" stroke-linecap="round"/><path d="M50 8 C70 30 72 50 50 64 C28 50 32 30 50 8Z" fill="#FF7043"/><path d="M50 30 C60 42 60 54 50 62 C40 54 42 42 50 30Z" fill="#FFD54F"/>`) },
    { id: 'soup', bin: 'hot', label: 'hot soup', svg: icon(`<path d="M18 40 L82 40 Q80 72 50 72 Q20 72 18 40Z" fill="#fff" stroke="#607D8B" stroke-width="3"/><ellipse cx="50" cy="40" rx="32" ry="7" fill="#FF8A65"/><path d="M38 30 q-6 -10 0 -20 M52 30 q-6 -10 0 -20 M66 30 q-6 -10 0 -20" stroke="#B0BEC5" stroke-width="3" fill="none"/>`) },
    { id: 'toast', bin: 'hot', label: 'a hot iron', svg: icon(`<path d="M14 62 Q20 30 60 28 L86 28 L86 62Z" fill="#7E57C2" stroke="#4A2D8A" stroke-width="3"/><rect x="10" y="62" width="80" height="8" rx="3" fill="#B0BEC5"/><path d="M50 28 Q56 10 76 12 L80 28" stroke="#4A2D8A" stroke-width="6" fill="none"/><path d="M30 78 q-4 -6 0 -10 M50 78 q-4 -6 0 -10" stroke="#FF7043" stroke-width="3" fill="none"/>`) },
    { id: 'lolly', bin: 'cold', label: 'an ice lolly', svg: icon(`<rect x="34" y="6" width="32" height="50" rx="14" fill="#FF7A6B"/><rect x="46" y="54" width="8" height="22" rx="3" fill="#E6C08A"/>`) },
    { id: 'snow', bin: 'cold', label: 'a snowman', svg: icon(`<circle cx="50" cy="56" r="20" fill="#fff" stroke="#90A4AE" stroke-width="2"/><circle cx="50" cy="26" r="14" fill="#fff" stroke="#90A4AE" stroke-width="2"/><path d="M50 28 l12 3 l-12 2Z" fill="#FF9800"/><circle cx="45" cy="22" r="2" fill="#333"/><circle cx="55" cy="22" r="2" fill="#333"/><rect x="38" y="8" width="24" height="8" fill="#333"/>`) },
    { id: 'ice', bin: 'cold', label: 'ice cubes', svg: icon(L4.ice({ x: 36, y: 70, e: 34 }) + L4.ice({ x: 66, y: 66, e: 30, rot: 10 })) },
    { id: 'freezer', bin: 'cold', label: 'a freezer', svg: icon(`<rect x="26" y="6" width="48" height="70" rx="6" fill="#E3F2FD" stroke="#78909C" stroke-width="3"/><path d="M26 32 L74 32" stroke="#78909C" stroke-width="3"/><rect x="62" y="12" width="5" height="14" rx="2" fill="#78909C"/><rect x="62" y="40" width="5" height="20" rx="2" fill="#78909C"/><path d="M42 18 l8 0 M46 14 l0 8" stroke="#4FC3F7" stroke-width="3"/>`) },
  ];

  // Lying cat facing right. th = heat-camera colours
  function cat(th = false) {
    const c = th ? { tail: '#1A2BC8', leg: '#2741E0', back: '#2E9E44', body: '#FDD835', chest: '#E53935', head: '#FF5722', ear: '#2E9E44', eye: '#1A2BC8' }
      : { tail: '#9E9E9E', leg: '#BDBDBD', back: '#A1A1A1', body: '#B0B0B0', chest: '#C4C4C4', head: '#B5B5B5', ear: '#9E9E9E', eye: '#8BC34A' };
    return `<g>
      <path d="M250 350 C190 360 150 420 110 400 C90 390 100 370 120 380" stroke="${c.tail}" stroke-width="28" fill="none" stroke-linecap="round"/>
      <ellipse cx="300" cy="400" rx="70" ry="26" fill="${c.leg}"/>
      <ellipse cx="400" cy="330" rx="175" ry="82" fill="${c.back}"/>
      <ellipse cx="440" cy="330" rx="130" ry="74" fill="${c.body}"/>
      <ellipse cx="520" cy="320" rx="70" ry="66" fill="${c.chest}"/>
      <rect x="520" y="372" width="140" height="34" rx="17" fill="${c.leg}"/>
      <path d="M548 210 L560 150 L600 196Z M622 196 L652 150 L656 214Z" fill="${c.ear}"/>
      <circle cx="600" cy="245" r="64" fill="${c.head}"/>
      <ellipse cx="582" cy="236" rx="8" ry="10" fill="${c.eye}"/><ellipse cx="628" cy="236" rx="8" ry="10" fill="${c.eye}"/>
      ${th ? '' : `<path d="M598 262 l8 0 l-4 6Z M560 270 l-40 -6 M560 278 l-40 4 M650 270 l40 -6 M650 278 l40 4" stroke="#555" stroke-width="2" fill="#555"/>`}
    </g>`;
  }

  App.chapter({
    id: 'temperature',
    title: 'Temperature',
    icon: '🌡️',
    group: 'Temperature',
    keywords: [
      { w: 'temperature', d: 'How hot or cold something is.' },
      { w: 'hot', d: 'Having a high temperature, like a fire or the Sun.' },
      { w: 'cold', d: 'Having a low temperature, like ice or snow.' },
      { w: 'thermometer', d: 'A tool we use to measure temperature.' },
      { w: 'increasing', d: 'Getting bigger or going up.' },
    ],
    steps: [
      // ---------- a) Hot or cold ----------
      {
        text: ['**Temperature** is a measure of how **hot** or **cold** something is.'],
        ask: 'Sort the pictures. Are they hot or cold?',
        activity: true,
        scene(stage, api) {
          const wrap = api.html('');
          api.sortGame(wrap, {
            bins: [{ id: 'hot', title: '🔥 Hot' }, { id: 'cold', title: '❄️ Cold' }],
            items: ITEMS.map(i => Object.assign({}, i, { hint: i.bin === 'hot' ? `Careful! ${i.label} is hot.` : `Brr! ${i.label} is cold.` })),
            onDone: () => api.star(),
          });
        },
      },

      // ---------- b) Heat camera ----------
      {
        text: [
          'This picture of a cat shows where it is hot and cold.',
          'Red shows the hottest parts of the cat. Blue shows the coldest parts.',
        ],
        ask: 'Drag the heat camera over the cat. Then click the hottest part and the coldest part.',
        activity: true,
        scene(stage, api) {
          const svg = api.svg(`
            <clipPath id="l4-tmp2-clip"><rect id="l4-tmp2-win" x="40" y="40" width="240" height="170" rx="14"/></clipPath>
            <rect width="800" height="520" fill="#EDE7DC"/>
            <path d="M0 420 L800 420 L800 520 L0 520Z" fill="#C9B79C"/>
            ${cat(false)}
            <g clip-path="url(#l4-tmp2-clip)"><rect width="800" height="520" fill="#0B0E3A"/><rect y="420" width="800" height="100" fill="#141A6B"/>${cat(true)}</g>
            <g id="l4-tmp2-hit">
              <ellipse data-z="hot" cx="525" cy="320" rx="62" ry="60" fill="#fff" opacity="0"/>
              <path data-z="cold" d="M250 350 C190 360 150 420 110 400 C90 390 100 370 120 380" stroke="#fff" stroke-opacity="0" stroke-width="44" fill="none"/>
              <rect data-z="cold" x="520" y="370" width="140" height="38" fill="#fff" opacity="0"/>
            </g>
            <g id="l4-tmp2-tags"></g>
            <g id="l4-tmp2-cam" transform="translate(40 40)">
              <rect width="240" height="170" rx="14" fill="none" stroke="#263238" stroke-width="8"/>
              <rect x="80" y="-30" width="80" height="30" rx="8" fill="#263238"/>${S.text(120, -9, 'heat cam', { size: 16, fill: '#fff' })}
              <rect width="240" height="170" fill="none" stroke="#fff" stroke-opacity="0" stroke-width="34" pointer-events="stroke" class="hot"/>
              <text id="l4-tmp2-hint" x="120" y="96" text-anchor="middle" font-size="20" font-weight="800" fill="#FFE56B" class="blink-hint">👆 Drag me</text>
            </g>`);
          const win = S.q(svg, '#l4-tmp2-win'), tags = S.q(svg, '#l4-tmp2-tags');
          let moved = 0;
          const cam = api.draggable(svg, S.q(svg, '#l4-tmp2-cam'), {
            bounds: { x1: 0, y1: 30, x2: 560, y2: 350 },
            onStart: () => { api.sfx('pick'); const h = S.q(svg, '#l4-tmp2-hint'); if (h) h.remove(); },
            onMove: p => { win.setAttribute('x', f(p.x)); win.setAttribute('y', f(p.y)); moved++; },
            onDrop: () => true,
          });
          void cam;
          const found = new Set();
          S.q(svg, '#l4-tmp2-hit').addEventListener('click', e => {
            const z = e.target.closest('[data-z]');
            if (!z || found.has(z.dataset.z)) return;
            if (moved < 5) { api.info('First drag the heat camera over the cat to see the colours.'); return; }
            found.add(z.dataset.z);
            const hot = z.dataset.z === 'hot';
            api.sfx(hot ? 'magic' : 'chirp');
            tags.insertAdjacentHTML('beforeend', `<g class="pop-in">${hot ? L4.pill(520, 470, '🔴 hottest: chest and neck', { size: 17, fill: '#FFCDD2' }) : L4.pill(200, 470, '🔵 coldest: tail and paws', { size: 17, fill: '#BBDEFB' })}</g>`);
            api.say(hot ? 'Yes! The chest and neck are red. They are the hottest parts.' : 'Yes! The tail and paws are blue. They are the coldest parts.');
            if (found.size === 2) {
              api.star();
              api.timeout(() => api.praise('Some parts of the cat are hotter than other parts.'), 2800);
            }
          });
        },
      },

      // ---------- c) Is the cat hotter than Shelly? ----------
      {
        text: [
          'To find out how hot or cold something is, we need to measure its temperature.',
          'We measure temperature using a piece of equipment called a **thermometer**.',
        ],
        tip: 'We know which parts of the cat are hotter than other parts. But is the cat hotter than me?',
        ask: 'Drag the thermometer to the cat. Then drag it to Shelly.',
        activity: true,
        scene(stage, api) {
          const th = L4.thermo({ x: 0, y: -230, h: 200, min: 0, max: 50, major: 10, minor: 2, value: 20, id: 'l4-tmp3', font: 16 });
          const svg = api.svg(`
            <rect width="800" height="520" fill="#FFF8EC"/>
            <rect y="430" width="800" height="90" fill="#E9CFA6"/>
            <g transform="translate(-30 60) scale(.62)">${cat(false)}</g>
            ${S.tortoise().replace('<svg ', '<svg x="470" y="300" width="230" height="154" ')}
            <g id="l4-tmp3-tags"></g>
            <g id="l4-tmp3-th" transform="translate(400 250)" class="hot">${th.svg}<rect x="-40" y="-280" width="100" height="300" fill="#fff" opacity="0"/></g>`);
          const node = S.q(svg, '#l4-tmp3-th'), tags = S.q(svg, '#l4-tmp3-tags');
          let val = 20, read = {}, asked = false;
          const animate = async to => {
            const from = val;
            await api.tween(1200, k => { val = from + (to - from) * k; th.set(svg, val); }, W.ease.out);
          };
          const d = api.draggable(svg, node, {
            bounds: { x1: 40, y1: 260, x2: 760, y2: 430 },
            onStart: () => api.sfx('pick'),
            onDrop: async p => {
              const who = p.x < 380 ? 'cat' : p.x > 480 ? 'shelly' : null;
              if (!who) { animate(20); return true; }
              api.sfx('drop');
              await animate(who === 'cat' ? 38 : 22);
              if (!api.alive()) return;
              if (!read[who]) {
                read[who] = true;
                tags.insertAdjacentHTML('beforeend', `<g class="pop-in">${who === 'cat' ? L4.pill(170, 486, 'cat: 38 °C', { size: 22, fill: '#FFCDD2' }) : L4.pill(585, 486, 'Shelly: 22 °C', { size: 22, fill: '#C8E6C9' })}</g>`);
              }
              api.say(who === 'cat' ? 'The cat is 38 degrees Celsius.' : 'Shelly is 22 degrees Celsius.');
              if (read.cat && read.shelly && !asked) {
                asked = true;
                api.choice({
                  q: 'Is the cat hotter than Shelly?', options: ['Yes', 'No'], correct: 0,
                  hints: { 1: 'Look at the numbers. 38 is bigger than 22.' },
                  explain: 'The cat is 38 degrees and Shelly is only 22. The cat is hotter!',
                  onRight: () => api.star(),
                });
              }
              return true;
            },
          });
          void d;
        },
      },

      // ---------- d) Parts of a thermometer ----------
      {
        text: ['This thermometer is made of glass.', 'There is a liquid inside. It is usually red.'],
        ask: 'Drag the labels to the thermometer.',
        activity: true,
        scene(stage, api) {
          const svg = api.svg(`
            <rect width="800" height="520" fill="#F3F7FB"/>
            <g transform="rotate(-50 400 270)">
              <rect x="360" y="20" width="80" height="460" rx="40" fill="url(#g-glass)" stroke="#8C96A8" stroke-width="4"/>
              <rect x="393" y="50" width="14" height="380" rx="7" fill="#fff" stroke="#B0BEC5" stroke-width="2"/>
              <rect x="395" y="250" width="10" height="190" fill="#E53935"/><circle cx="400" cy="440" r="24" fill="#E53935"/>
              ${[...Array(36)].map((_, i) => `<path d="M408 ${70 + i * 10} l${i % 5 ? 10 : 18} 0" stroke="#3B3F6B" stroke-width="1.5"/>`).join('')}
            </g>`);
          // Points on the tilted thermometer
          const P = (x, y) => { const a = -50 * Math.PI / 180, dx = x - 400, dy = y - 270; return { x: 400 + dx * Math.cos(a) - dy * Math.sin(a), y: 270 + dx * Math.sin(a) + dy * Math.cos(a) }; };
          const g = P(362, 70), t = P(400, 190), r = P(400, 390);
          api.dragLabels(svg, [
            { id: 'glass', label: 'glass', x: g.x, y: g.y, lx: 680, ly: 60 },
            { id: 'tube', label: 'thin tube', x: t.x, y: t.y, lx: 690, ly: 230 },
            { id: 'red', label: 'red liquid', x: r.x, y: r.y, lx: 560, ly: 440 },
          ], {
            onDone: () => {
              api.star();
              api.sayAfter('The thermometer is made of glass. The red liquid is inside a thin tube.');
            },
          });
        },
      },

      // ---------- e) Why a thin tube? ----------
      {
        text: [
          'As the red liquid gets hotter, it takes up more space. It moves up the thin tube.',
          'The higher the red liquid, the higher the temperature. This shows **increasing** temperature.',
        ],
        tip: 'Think about why a thin tube is used.',
        ask: 'Warm the water. Watch both thermometers.',
        activity: true,
        scene(stage, api) {
          const tube = (x, w, id) => `<g>
            <rect x="${x - w / 2 - 5}" y="60" width="${w + 10}" height="330" rx="${f(w / 2 + 5)}" fill="url(#g-glass)" stroke="#8C96A8" stroke-width="3"/>
            <rect id="${id}" x="${x - w / 2}" y="300" width="${w}" height="100" fill="#E53935"/>
            <circle cx="${x}" cy="410" r="34" fill="#E53935" stroke="#B71C1C" stroke-width="3"/></g>`;
          const svg = api.svg(`
            <rect width="800" height="520" fill="#F3F7FB"/>
            <rect x="140" y="330" width="420" height="160" rx="14" fill="#B3E5FC" stroke="#4A90B8" stroke-width="4" opacity=".8"/>
            <rect id="l4-tmp5-warm" x="140" y="330" width="420" height="160" rx="14" fill="#FF7043" opacity="0"/>
            ${tube(260, 12, 'l4-tmp5-thin')}${tube(440, 52, 'l4-tmp5-wide')}
            ${S.text(260, 40, 'thin tube', { size: 20 })}${S.text(440, 40, 'wide tube', { size: 20 })}
            <g transform="translate(600 120)">
              ${[0, 1, 2, 3].map(i => `<g transform="translate(${i * 44} 0)"><rect x="-8" y="0" width="16" height="140" rx="8" fill="#fff" stroke="#8C96A8" stroke-width="2"/>
                <rect x="-4" y="${110 - i * 30}" width="8" height="${30 + i * 30}" fill="#E53935"/><circle cx="0" cy="146" r="13" fill="#E53935"/></g>`).join('')}
              ${S.arrow(-10, 190, 150, 190, { color: '#3B3F6B', w: 3, head: 10 })}
              ${S.text(70, 220, 'increasing', { size: 18 })}${S.text(70, 242, 'temperature', { size: 18 })}
            </g>`);
          const thin = S.q(svg, '#l4-tmp5-thin'), wide = S.q(svg, '#l4-tmp5-wide'), warm = S.q(svg, '#l4-tmp5-warm');
          // The same extra liquid goes up much further in the thin tube
          const set = k => {
            const grow = k * 2600;
            const ht = 100 + grow / 12, hw = 100 + grow / 52;
            thin.setAttribute('y', f(400 - ht)); thin.setAttribute('height', f(ht));
            wide.setAttribute('y', f(400 - hw)); wide.setAttribute('height', f(hw));
            warm.setAttribute('opacity', f(k * .5));
          };
          let ready = false, asked = false;
          api.slider({
            label: '🔥 Warm the water', min: 0, max: 100, value: 0, format: v => v < 30 ? 'cool' : v < 70 ? 'warm' : 'hot',
            onInput: v => {
              set(v / 100);
              if (!ready) { ready = true; return; }
              if (v > 85 && !asked) {
                asked = true;
                api.say('Both red liquids got hotter and took up more space. Which one moved further?');
                api.choice({
                  q: 'Why does a thermometer have a thin tube?', options: ['So small changes are easy to see', 'So it does not break'], correct: 0,
                  hints: { 1: 'Look at the two tubes. In which one is it easier to see the liquid move?' },
                  explain: 'In a thin tube, the red liquid moves a long way, so even a small change in temperature is easy to see.',
                  onRight: () => api.star(),
                });
              }
            },
          });
        },
      },
    ],
  });
})();
