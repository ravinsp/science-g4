// Chapter 9: Grouping flowers
(() => {
  if (!document.getElementById('gf-style')) {
    const st = document.createElement('style');
    st.id = 'gf-style';
    st.textContent = `
      .gf-hot { cursor: pointer; }
      .gf-hot:hover { filter: drop-shadow(0 0 7px rgba(255,200,60,.95)); }
      .gf-btn { cursor: pointer; }
      .gf-btn:hover .gf-bg { stroke: #3E9B4F; }
      .gf-card { cursor: grab; }
      .gf-card:active { cursor: grabbing; }
    `;
    document.head.append(st);
  }
  const f1 = S.f1;
  const ring = (n, d, fill, stroke, rot = 0, sw = 1.5) => {
    let s = '';
    for (let i = 0; i < n; i++) s += `<path d="${d}" transform="rotate(${f1(rot + i * 360 / n)})" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"/>`;
    return s;
  };
  const shuffle = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

  // ---------- Five purple flowers (drawn around 0,0, about 90 across) ----------
  const PURPLE = {
    iris() {
      const fall = 'M0 0 C-20 -8 -30 -46 -15 -68 C-5 -80 13 -76 17 -62 C23 -40 15 -12 0 0Z';
      const std = 'M0 0 C-13 -20 -15 -52 0 -74 C15 -52 13 -20 0 0Z';
      return `<path d="M0 100 L0 10" stroke="#43A047" stroke-width="8" stroke-linecap="round"/>
        <path d="M2 100 C30 70 34 40 30 10 C24 40 14 70 -2 96Z" fill="#66BB6A" stroke="#388E3C" stroke-width="1.5"/>
        <g transform="translate(0 10)">
          ${[-14, 14, 0].map(a => `<path d="${std}" transform="rotate(${a})" fill="#8E7CC3" stroke="#5E35B1" stroke-width="1.5"/>`).join('')}
          ${[-118, 118].map(a => `<g transform="rotate(${a})"><path d="${fall}" fill="#5E35B1" stroke="#4527A0" stroke-width="1.5"/><ellipse cx="0" cy="-26" rx="5" ry="12" fill="#FFD54F"/><path d="M0 -8 L0 -56" stroke="#fff" stroke-width="1.2" opacity=".5"/></g>`).join('')}
          <g transform="rotate(180) scale(.8)"><path d="${fall}" fill="#6A4BC4" stroke="#4527A0" stroke-width="1.5"/><ellipse cx="0" cy="-26" rx="5" ry="12" fill="#FFD54F"/></g>
        </g>`;
    },
    chrysanthemum() {
      let s = '';
      [[86, 34, '#4527A0', 0], [72, 30, '#5E35B1', 5], [58, 26, '#7E57C2', 2], [44, 22, '#9575CD', 7], [30, 16, '#B39DDB', 3]].forEach(([r, n, c, rot]) => {
        s += S.flower({ r, petals: n, color: c, center: '#311B92', centerR: 0, shape: 'long', petalW: Math.max(4, r * .1), rot, outline: S.mix(c, '#000', .25) });
      });
      return s + `<circle r="10" fill="#4A148C"/>${[0, 1, 2, 3, 4, 5].map(i => `<circle cx="${f1(Math.cos(i) * 5)}" cy="${f1(Math.sin(i) * 5)}" r="1.8" fill="#E1BEE7"/>`).join('')}`;
    },
    periwinkle() {
      const p = 'M0 -6 C-18 -14 -36 -46 -22 -68 C-10 -82 20 -78 26 -62 C31 -44 10 -18 0 -6Z';
      return ring(5, p, '#7E57C2', '#512DA8', 0, 2) + ring(5, 'M0 -8 L-4 -40', 'none', '#9575CD', 10, 1.5)
        + `<path d="M0 -12 L3 -4 L11 -4 L5 1 L7 9 L0 4 L-7 9 L-5 1 L-11 -4 L-3 -4Z" fill="#EDE7F6"/><circle r="3" fill="#8D6E63"/>`;
    },
    orchid() {
      const one = (x, y, s, rot) => {
        const pd = 'M0 0 C-22 -8 -26 -42 0 -46 C26 -42 22 -8 0 0Z';
        let dots = '';
        for (let i = 0; i < 5; i++) for (let k = 0; k < 3; k++) dots += `<circle cx="${(k - 1) * 7}" cy="${-14 - i * 6}" r="1.8" fill="#E1BEE7" transform="rotate(${i * 72})"/>`;
        return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">${ring(5, pd, '#8E44AD', '#6A1B9A', 0, 1.5)}${dots}
          <path d="M-9 4 C-14 18 14 18 9 4 C6 -2 -6 -2 -9 4Z" fill="#6A1B9A"/><circle r="6" fill="#F3E5F5"/></g>`;
      };
      return one(-40, 18, .82, -10) + one(38, 24, .78, 15) + one(0, -26, .9, 5);
    },
    crocus() {
      const p = 'M0 0 C-22 -22 -24 -72 0 -96 C24 -72 22 -22 0 0Z';
      return `<path d="M-6 98 L-5 55 L5 55 L6 98Z" fill="#F1F8E9" stroke="#C5E1A5" stroke-width="2"/>
        <path d="M-8 98 C-20 80 -18 60 -4 55 M8 98 C20 80 18 60 4 55" stroke="#7CB342" stroke-width="4" fill="none"/>
        <g transform="translate(0 58)">
          ${[-20, 20, 0].map(a => `<path d="${p}" transform="rotate(${a})" fill="#B39DDB" stroke="#7E57C2" stroke-width="1.5"/>`).join('')}
          <path d="M0 0 L-8 -64 M0 0 L2 -70 M0 0 L10 -62" stroke="#FF6D00" stroke-width="3.5" stroke-linecap="round"/>
          <path d="${p}" transform="rotate(-40) scale(.95)" fill="#9575CD" stroke="#673AB7" stroke-width="1.5"/>
          <path d="${p}" transform="rotate(9) scale(.9)" fill="#8E7CC3" stroke="#5E35B1" stroke-width="1.5" opacity=".95"/>
          <path d="M-2 -4 L-2 -80" transform="rotate(9)" stroke="#5E35B1" stroke-width="1.5" opacity=".5"/>
        </g>`;
    },
  };

  // ---------- The book's seven dot diagrams (x from centre, y up from the base) ----------
  const DIAG = [
    { name: ['one flower', 'on top'], say: 'One flower grows on top of the stem.', lines: [[0, 0, 0, -165]], dots: [[0, -171]] },
    { name: ['branched'], say: 'The stem branches, and flowers grow at the ends of the branches.', lines: [[0, 0, 0, -160], [0, -70, -32, -100], [0, -70, 32, -100], [0, -108, -22, -134], [0, -108, 22, -134], [0, -142, -11, -160], [0, -142, 11, -160]], dots: [[-32, -100, 7], [32, -100, 7], [-22, -134, 6], [22, -134, 6], [-11, -160, 5], [11, -160, 5], [0, -166, 5]] },
    { name: ['spike'], say: 'The flowers grow all along a tall spike.', lines: [[0, 0, 0, -180], [0, -70, 12, -76], [0, -90, -12, -96], [0, -110, 12, -116], [0, -130, -12, -136], [0, -150, 12, -156], [0, -168, -10, -173]], dots: [[14, -78, 6, 30], [-14, -98, 6, -30], [14, -118, 6, 30], [-14, -138, 6, -30], [14, -158, 5, 30], [-11, -175, 5, -30], [0, -184, 4, 0]], ovals: true },
    { name: ['umbrella'], say: 'All the flower stalks grow out from one point, like an umbrella.', lines: [[0, 0, 0, -120]], rays: { at: [0, -120], n: 7, from: -172, to: -8, len: 46 } },
    { name: ['umbrella of', 'umbrellas'], say: 'Little umbrellas grow on a big umbrella. This is how cow parsley grows.', lines: [[0, 0, 0, -105]], rays: { at: [0, -105], n: 5, from: -165, to: -15, len: 40, sub: { n: 5, len: 12 } } },
    { name: ['few', 'branches'], say: 'There are just a few branches, with one flower at the end of each.', lines: [[0, 0, 0, -165], [0, -95, 20, -145], [10, -120, 36, -128]], dots: [[0, -171, 7], [20, -151, 7], [42, -128, 7]] },
    { name: ['flat top'], say: 'The branches spread out so that the flowers make a flat top.', lines: [[0, 0, 0, -115], [0, -115, -32, -150], [0, -115, 32, -150], [0, -115, 0, -170], [-20, -135, -44, -138], [-26, -143, -26, -168], [20, -135, 44, -138], [26, -143, 26, -168]], dots: [[0, -176, 6], [-32, -154, 6], [32, -154, 6], [-48, -138, 6], [48, -138, 6], [-26, -172, 6], [26, -172, 6]] },
  ];
  function diagParts(d) {
    const L = d.lines.slice(), D = (d.dots || []).map(p => ({ x: p[0], y: p[1], r: p[2] || 7, rot: p[3] || 0 }));
    if (d.rays) {
      const R = d.rays;
      for (let i = 0; i < R.n; i++) {
        const a = (R.from + (R.to - R.from) * i / (R.n - 1)) * Math.PI / 180;
        const ex = R.at[0] + Math.cos(a) * R.len * 1.05, ey = R.at[1] + Math.sin(a) * R.len;
        L.push([R.at[0], R.at[1], ex, ey]);
        if (R.sub) {
          for (let k = 0; k < R.sub.n; k++) {
            const b = (-160 + k * 35) * Math.PI / 180;
            const sx = ex + Math.cos(b) * R.sub.len, sy = ey + Math.sin(b) * R.sub.len;
            L.push([ex, ey, sx, sy]);
            D.push({ x: sx, y: sy, r: 3.6, rot: 0 });
          }
        } else D.push({ x: ex, y: ey, r: 7, rot: 0 });
      }
    }
    return { L, D };
  }

  // ---------- Real flower clusters for the matching game (about 90 x 90) ----------
  const CLUSTER = [
    { name: 'tulip', d: 0, hint: 'A tulip has just one flower on top of its stem.', draw: () => `<path d="M0 36 L0 -22" stroke="#43A047" stroke-width="4"/><path d="M0 30 C-22 16 -24 -6 -18 -16 C-12 0 -6 14 0 22Z" fill="#66BB6A"/>
      <path d="M-15 -20 C-17 -40 -11 -54 -6 -46 L0 -56 L6 -46 C11 -54 17 -40 15 -20 C10 -12 -10 -12 -15 -20Z" fill="#E53935" stroke="#B71C1C" stroke-width="1.5"/>` },
    { name: 'lilac', d: 1, hint: 'Lilac flowers grow at the ends of lots of branches.', draw: () => { let s = `<path d="M0 36 L0 -8" stroke="#6D4C41" stroke-width="3"/>`; for (let j = 0; j < 6; j++) { const w = 30 - j * 5, y = -8 - j * 9; for (let x = -w; x <= w; x += 8) s += `<circle cx="${x + (j % 2) * 3}" cy="${y}" r="4.5" fill="${(x + j) % 3 ? '#9575CD' : '#B39DDB'}" stroke="#7E57C2" stroke-width=".8"/>`; } return s + `<path d="M-6 30 C-26 26 -30 12 -26 6 C-16 14 -10 20 -2 26Z" fill="#66BB6A"/>`; } },
    { name: 'foxglove', d: 2, hint: 'Foxglove flowers grow all the way up a tall spike.', draw: () => { let s = `<path d="M0 38 Q2 -10 0 -56" stroke="#558B2F" stroke-width="3.5" fill="none"/>`; for (let k = 0; k < 7; k++) { const y = 26 - k * 11, sc = 1 - k * .1; s += `<g transform="translate(3 ${y}) rotate(35) scale(${f1(sc)})"><path d="M0 -5 C10 -7 18 -4 20 2 C16 6 6 6 0 5Z" fill="#D81B60" stroke="#AD1457" stroke-width="1"/><ellipse cx="18" cy="0" rx="2.5" ry="4" fill="#F8BBD0"/></g>`; } return s; } },
    { name: 'allium', d: 3, hint: 'All the allium flower stalks come from one point, like an umbrella.', draw: () => { let s = `<path d="M0 38 L0 -16" stroke="#7CB342" stroke-width="3.5"/>`; for (let i = 0; i < 16; i++) { const a = (-180 + i * 12) * Math.PI / 180; s += `<path d="M0 -16 L${f1(Math.cos(a) * 30)} ${f1(-16 + Math.sin(a) * 30)}" stroke="#AED581" stroke-width="1"/><circle cx="${f1(Math.cos(a) * 30)}" cy="${f1(-16 + Math.sin(a) * 30)}" r="4.5" fill="${i % 2 ? '#AB47BC' : '#CE93D8'}"/>`; } return s; } },
    { name: 'cow parsley', d: 4, hint: 'Cow parsley has little umbrellas on a big umbrella.', draw: () => { let s = `<path d="M0 38 L0 -10" stroke="#7CB342" stroke-width="3"/>`; [[-32, -32], [-16, -44], [0, -48], [16, -44], [32, -32]].forEach(([x, y]) => { s += `<path d="M0 -10 L${x} ${y}" stroke="#9CCC65" stroke-width="1.5"/>`; for (let k = 0; k < 5; k++) { const b = (-160 + k * 35) * Math.PI / 180; s += `<path d="M${x} ${y} l${f1(Math.cos(b) * 7)} ${f1(Math.sin(b) * 7)}" stroke="#9CCC65" stroke-width="1"/><circle cx="${f1(x + Math.cos(b) * 7)}" cy="${f1(y + Math.sin(b) * 7)}" r="2.6" fill="#fff" stroke="#9E9E9E" stroke-width=".7"/>`; } }); return s; } },
    { name: 'buttercup', d: 5, hint: 'A buttercup has just a few branches, each with one flower.', draw: () => { const cup = (x, y) => S.flower({ x, y, r: 10, petals: 5, color: '#FFD600', center: '#F9A825', shape: 'round' }); return `<path d="M0 38 L0 -34 M0 8 L22 -22 M10 -6 L-20 -18" stroke="#558B2F" stroke-width="3" fill="none"/>${cup(0, -38)}${cup(24, -24)}${cup(-22, -20)}`; } },
    { name: 'yarrow', d: 6, hint: 'Yarrow flowers make a flat top, on branches that spread out.', draw: () => { let s = `<path d="M0 38 L0 -12 M0 -12 L-26 -32 M0 -12 L26 -32 M0 -12 L0 -36" stroke="#689F38" stroke-width="2.5" fill="none"/>`; for (let i = 0; i < 26; i++) { const x = -34 + (i % 13) * 5.6, y = -40 + Math.floor(i / 13) * 6 + Math.abs(x) * .08; s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="3.4" fill="${i % 3 ? '#fff' : '#F8BBD0'}" stroke="#BDBDBD" stroke-width=".7"/>`; } return s; } },
  ];

  // ---------- Petal shapes for the build-a-flower game ----------
  const twistPetal = (r, w) => `M0 0 C${f1(-w * 1.7)} ${f1(-r * .2)} ${f1(-w * 1.3)} ${-r} ${f1(w * .35)} ${-r} C${f1(w * 1.3)} ${f1(-r * .95)} ${f1(w * .9)} ${f1(-r * .4)} 0 0Z`;
  function makeFlower({ shape, n, color, r = 44, open = 1, centre = null }) {
    const c = centre || (color === '#FFD600' ? '#FF8F00' : '#FFD600');
    const stroke = S.mix(color, '#000000', color === '#FFFFFF' || color === '#FFF8E1' ? .3 : .22);
    if (shape === 'twist') {
      const w = r * .55 * (.4 + .6 * open);
      let s = ring(n, twistPetal(r * open, w), color, stroke, 0, 1.4);
      for (let i = 0; i < n; i++) s += `<path d="M0 -6 Q${f1(-w * .3)} ${f1(-r * .5 * open)} ${f1(w * .1)} ${f1(-r * .8 * open)}" transform="rotate(${f1(i * 360 / n)})" stroke="${S.mix(color, '#FFB300', .6)}" stroke-width="1.2" fill="none" opacity=".7"/>`;
      return s + `<circle r="${f1(r * .12 + 2)}" fill="${c}" stroke="${S.mix(c, '#000', .25)}"/>`;
    }
    const petalW = shape === 'round' ? r * .34 : shape === 'long' ? Math.min(r * .16, Math.PI * r / n * .6) : null;
    let s = S.flower({ r, petals: n, color, center: c, centerR: r * (shape === 'long' ? .24 : .2), shape, petalW, open, outline: stroke });
    // Thin lines on the petals like the book pictures
    let v = '';
    for (let i = 0; i < n; i++) v += `<path d="M0 ${f1(-r * .25 * open)} L0 ${f1(-r * .7 * open)}" transform="rotate(${f1(i * 360 / n)})" stroke="${stroke}" stroke-width="1.1" opacity=".45"/>`;
    return s.replace(/<circle/, v + '<circle');
  }
  const BOOK = [
    { shape: 'round', n: 6, color: '#81D4FA', name: 'round petals with gaps' },
    { shape: 'twist', n: 5, color: '#FFF8E1', name: 'twisted petals that overlap' },
    { shape: 'pointed', n: 6, color: '#7E57C2', name: 'pointed petals like a star', centre: '#9CCC65' },
    { shape: 'long', n: 12, color: '#FFFFFF', name: 'lots of thin petals' },
    { shape: 'heart', n: 5, color: '#BA68C8', name: 'heart-shaped petals' },
    { shape: 'wide', n: 5, color: '#29B6F6', name: 'wide round petals' },
  ];
  const SHAPE_BTN = [
    { id: 'round', name: 'round' }, { id: 'twist', name: 'twisted' }, { id: 'pointed', name: 'pointed' },
    { id: 'long', name: 'thin' }, { id: 'heart', name: 'heart' }, { id: 'wide', name: 'wide' },
  ];
  const COLOURS = ['#FFFFFF', '#FFD600', '#F06292', '#BA68C8', '#29B6F6', '#FF7043'];
  const WORD = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen'];

  App.chapter({
    id: 'groupflowers',
    title: 'Grouping flowers',
    icon: '💐',
    group: 'Sorting plants',
    keywords: [
      { w: 'represent', d: 'To stand for something. A dot can stand for a flower.' },
      { w: 'daisy', d: 'A small flower with white petals round a yellow middle.' },
    ],
    steps: [
      // ---------- a) Colour is not helpful ----------
      {
        text: [
          'Scientists can classify flowering plants into smaller groups by looking more carefully at features the flowers share.',
          'Colour is <b>not</b> a helpful feature for classification.',
          'These flowers are the same colour but differ in many other ways.',
        ],
        ask: 'How do they differ? Click each flower to find out.',
        activity: true,
        scene(stage, api) {
          const F = [
            { id: 'iris', tag: '3 up, 3 down', say: 'The iris has three big petals that hang down, and three petals that stand up.' },
            { id: 'chrysanthemum', tag: 'lots of thin petals', say: 'The chrysanthemum has lots and lots of thin petals, packed together like a pom-pom.' },
            { id: 'periwinkle', tag: '5 twisty petals', say: 'The periwinkle has five flat petals. They twist round like a pinwheel.' },
            { id: 'orchid', tag: 'petals and a lip', say: 'Each orchid flower has five petals and a special lip in the middle. These ones have spots!' },
            { id: 'crocus', tag: '6 petals in a cup', say: 'The crocus has six petals that make a cup shape.' },
          ];
          const pos = [[25, 12], [285, 12], [545, 12], [155, 262], [415, 262]];
          const svg = api.svg(`
            <rect width="800" height="520" fill="#FBF7FF"/>
            ${F.map((f, i) => {
              const [x, y] = pos[i];
              return `<g class="gf-hot gf-pf" data-i="${i}">
                <rect x="${x}" y="${y}" width="230" height="236" rx="22" fill="#fff" stroke="#C8452F" stroke-width="4"/>
                <g transform="translate(${x + 115} ${y + 114}) scale(.86)"><g class="${i % 2 ? 'sway' : ''}">${PURPLE[f.id]()}</g></g>
                <g id="gf-tag${i}" style="display:none"><g class="pop-in"><rect x="${x + 15}" y="${y + 190}" width="200" height="36" rx="18" fill="#6A1B9A"/>${S.text(x + 115, y + 215, f.tag, { size: 18, fill: '#fff' })}</g></g>
                <text x="${x + 115}" y="${y + 30}" text-anchor="middle" font-size="18" font-weight="800" fill="#6A1B9A" class="gf-name" opacity="0">${f.id}</text>
              </g>`;
            }).join('')}
            <g transform="translate(700 400)"><g class="float">${S.text(0, 0, '🔍', { size: 60 })}</g></g>
          `);
          const seen = new Set();
          S.qa(svg, '.gf-pf').forEach(g => g.addEventListener('click', () => {
            const i = +g.dataset.i;
            api.sfx('pop');
            api.say(F[i].say);
            S.q(svg, '#gf-tag' + i).style.display = '';
            S.q(g, '.gf-name').setAttribute('opacity', 1);
            if (seen.has(i)) return;
            seen.add(i);
            if (seen.size === F.length) {
              api.timeout(() => {
                api.choice({
                  q: 'Is colour a helpful feature for classification?',
                  options: ['👍 Yes', '👎 No'],
                  correct: 1,
                  hints: { 0: 'Look! They are all purple, but they are very different flowers.' },
                  explain: 'These flowers are all purple, but they are very different. Colour does not help us to group them.',
                  onRight: () => api.star(),
                  speak: true,
                });
              }, 3500);
            }
          }));
        },
      },

      // ---------- b) How flowers grow on the stem ----------
      {
        text: [
          'Instead, scientists look at:<ul><li>the way the flowers grow on the stem</li><li>the number of petals</li><li>the shape of the petals.</li></ul>',
          'Look at how the flowers grow on the stems of different plants. The dots **represent** flowers.',
        ],
        ask: 'Have you seen any of these? Drag each flower picture to the diagram that matches it.',
        activity: true,
        scene(stage, api) {
          const cx = i => 58 + i * 114, BASE = 228;
          const diags = DIAG.map((d, i) => {
            const { L, D } = diagParts(d);
            const x0 = cx(i);
            const lines = L.map(l => `<path class="gf-line" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1" d="M${f1(x0 + l[0])} ${f1(BASE + l[1])} L${f1(x0 + l[2])} ${f1(BASE + l[3])}" stroke="#3A3A3A" stroke-width="2.4" stroke-linecap="round"/>`).join('');
            const dots = D.map(p => `<g transform="translate(${f1(x0 + p.x)} ${f1(BASE + p.y)}) rotate(${p.rot})"><g class="gf-dot" style="opacity:0">${d.ovals ? `<ellipse rx="${p.r + 2}" ry="${p.r * .7}" fill="#FFC107" stroke="#E08A00" stroke-width="1.5"/>` : `<circle r="${p.r}" fill="#FFC107" stroke="#E08A00" stroke-width="1.5"/>`}</g></g>`).join('');
            const nm = d.name.map((t, k) => S.text(x0, 250 + k * 18, t, { size: 16, fill: '#3B3F6B' })).join('');
            return `<g class="gf-hot gf-diag" data-i="${i}"><rect x="${x0 - 55}" y="20" width="110" height="${d.name.length > 1 ? 256 : 240}" rx="12" fill="#fff" opacity=".01"/>${lines}${dots}${nm}</g>
              <circle class="gf-slot" data-i="${i}" cx="${x0}" cy="316" r="36" fill="#FFFDE7" stroke="#E0A800" stroke-width="2.5" stroke-dasharray="6 5"/>
              <text x="${x0}" y="324" text-anchor="middle" font-size="22" font-weight="800" fill="#E0C060" class="gf-q${i}">?</text>`;
          }).join('');
          const order = shuffle(CLUSTER.map((c, i) => i));
          const cards = order.map((ci, k) => {
            const c = CLUSTER[ci], x = cx(k), y = 446;
            return `<g class="gf-card" data-c="${ci}" transform="translate(${x} ${y})"><g class="gf-cin">
              <rect x="-52" y="-62" width="104" height="124" rx="14" fill="#F1F8E9" stroke="#8FBF7F" stroke-width="2.5"/>
              <g transform="translate(0 -6)">${c.draw()}</g>
              <text y="52" text-anchor="middle" font-size="16" font-weight="800" fill="#2A7439">${c.name}</text></g></g>`;
          }).join('');
          const svg = api.svg(`
            <rect width="800" height="520" fill="#FFFDF6"/>
            <rect x="0" y="372" width="800" height="148" fill="#EFE6D6"/>
            ${diags}
            ${cards}
          `);
          // Draw one diagram: the stem lines grow, then the dots pop on
          const drawDiag = async i => {
            const g = S.q(svg, `.gf-diag[data-i="${i}"]`);
            const lines = S.qa(g, '.gf-line'), dots = S.qa(g, '.gf-dot');
            lines.forEach(l => l.setAttribute('stroke-dashoffset', 1));
            dots.forEach(d => { d.style.opacity = 0; d.classList.remove('pop-in'); });
            api.sfx('grow');
            if (!await api.tween(600, k => lines[0].setAttribute('stroke-dashoffset', f1(1 - k)), W.ease.out)) return false;
            if (lines.length > 1 && !await api.tween(450, k => lines.slice(1).forEach(l => l.setAttribute('stroke-dashoffset', f1(1 - k))), W.ease.out)) return false;
            for (let k = 0; k < dots.length; k++) {
              dots[k].style.opacity = ''; dots[k].classList.add('pop-in');
              if (k % 2 === 0) api.sfx('pop');
              if (!await api.wait(dots.length > 12 ? 30 : 70)) return false;
            }
            return true;
          };
          let intro = true;
          (async () => {
            for (let i = 0; i < DIAG.length; i++) if (!await drawDiag(i)) return;
            intro = false;
          })();
          S.qa(svg, '.gf-diag').forEach(g => g.addEventListener('click', () => {
            const i = +g.dataset.i;
            api.say(DIAG[i].say);
            if (!intro) drawDiag(i);
          }));
          let placed = 0;
          S.qa(svg, '.gf-card').forEach(node => {
            const ci = +node.dataset.c, c = CLUSTER[ci];
            const inner = S.q(node, '.gf-cin');
            const drag = api.draggable(svg, node, {
              bounds: { x1: 40, y1: 60, x2: 760, y2: 470 },
              onStart: () => { api.sfx('pick'); api.say(c.name); },
              onDrop: pos => {
                if (pos.y > 380) return false;
                let best = -1, bd = 1e9;
                DIAG.forEach((d, i) => { const dd = Math.abs(pos.x - cx(i)); if (dd < bd) { bd = dd; best = i; } });
                if (bd > 60) return false;
                if (best !== c.d) { api.oops(c.hint); return false; }
                // Right! Snap the picture into the slot under its diagram
                node.style.pointerEvents = 'none';
                const from = { ...drag.pos };
                api.tween(350, k => {
                  drag.setPos(f1(from.x + (cx(best) - from.x) * k), f1(from.y + (316 - from.y) * k));
                  inner.setAttribute('transform', `scale(${f1(1 - .42 * k)})`);
                }, W.ease.out);
                S.q(svg, `.gf-slot[data-i="${best}"]`).style.display = 'none';
                S.q(svg, '.gf-q' + best).style.display = 'none';
                api.sfx('drop');
                drawDiag(best);
                placed++;
                if (placed === CLUSTER.length) {
                  api.star();
                  api.praise('You matched every flower to the way it grows on the stem!');
                } else {
                  api.sfx('success');
                  api.say(`Yes! ${c.hint}`);
                  api.feedback('✔ ' + c.name, 'ok');
                }
                return true;
              },
            });
          });
        },
      },

      // ---------- c) Take a daisy apart ----------
      {
        text: ['Some flowers have lots of tiny parts in a circle. Try taking a sunflower or a **daisy** flower apart.'],
        ask: 'Click the petals to pull them off. What is in the middle?',
        activity: true,
        scene(stage, api) {
          const DX = 215, DY = 262, NP = 22, PR = 150;
          let petals = '';
          for (let i = 0; i < NP; i++) {
            const a = i * 360 / NP;
            petals += `<g class="gf-hot gf-pet" data-i="${i}" transform="rotate(${f1(a)})"><path d="${S.petalPath('long', PR, 15)}" fill="#fff" stroke="#BDBDBD" stroke-width="1.5"/><path d="M0 -60 L0 ${-PR + 16}" stroke="#E0E0E0" stroke-width="1.5"/></g>`;
          }
          let florets = '';
          const NF = 170;
          for (let i = 0; i < NF; i++) {
            const a = i * 137.508 * Math.PI / 180, d = Math.sqrt((i + .5) / NF) * 50;
            florets += `<circle class="gf-flo" cx="${f1(Math.cos(a) * d)}" cy="${f1(Math.sin(a) * d)}" r="${f1(2.2 + d / 50 * 1.2)}" fill="${i % 5 ? '#FFC107' : '#FFA000'}" stroke="#E08A00" stroke-width=".6"/>`;
          }
          const disc = `<circle r="54" fill="#FFB300"/>${florets}`;
          // Side view of the flower head cut in half, like the book picture
          let tubes = '';
          for (let k = 0; k <= 22; k++) {
            const t = k / 22, x = (1 - t) * (1 - t) * -80 + 2 * (1 - t) * t * 0 + t * t * 80, y = (1 - t) * (1 - t) * 0 + 2 * (1 - t) * t * -80 + t * t * 0;
            const ang = (t - .5) * 90;
            tubes += `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(ang)})"><rect x="-3" y="-18" width="6" height="18" rx="2" fill="${k % 2 ? '#FFB300' : '#FFA000'}" stroke="#E65100" stroke-width=".8"/><circle cy="-19" r="2.5" fill="#F57C00"/></g>`;
          }
          const rays = [-1, 1].map(s => [0, 1, 2].map(k => `<path d="${S.petalPath('long', 95 - k * 8, 12)}" transform="translate(${s * 78} ${-4 - k * 3}) rotate(${s * (72 - k * 14)})" fill="#fff" stroke="#BDBDBD" stroke-width="1.5"/>`).join('')).join('');
          const side = `<g id="gf-side" transform="translate(615 330)" style="display:none"><g class="grow-in">
            <path d="M-16 150 L-14 12 Q-60 8 -84 0 L84 0 Q60 8 14 12 L16 150Z" fill="#C5E1A5" stroke="#8BC34A" stroke-width="2"/>
            ${rays}
            <path d="M-86 2 Q0 -86 86 2 Z" fill="#FFF3C4" stroke="#E0C77A" stroke-width="2"/>
            <path d="M-60 2 Q0 -44 60 2" stroke="#F3E2A2" stroke-width="2" fill="none"/>
            ${tubes}
            <path d="M-84 4 C-96 16 -104 10 -110 4 C-100 -2 -92 0 -84 4Z M84 4 C96 16 104 10 110 4 C100 -2 92 0 84 4Z" fill="#7CB342"/>
          </g>
            <g class="fade-in">${S.callout({ x: 0, y: -70, tx: 0, ty: -150, text: 'tiny florets' })}${S.callout({ x: -120, y: -40, tx: -115, ty: 130, text: 'petals', w: 90 })}</g></g>`;
          // One floret close up
          const zoom = `<g id="gf-zoom" style="display:none"><g class="pop-in">
            <circle cx="615" cy="270" r="118" fill="#FFFDE7" stroke="#455A64" stroke-width="9"/>
            <path d="M602 362 C600 320 604 290 600 256 L630 256 C626 290 630 320 628 362Z" fill="#FFCA28" stroke="#E08A00" stroke-width="2"/>
            ${[-60, -30, 0, 30, 60].map(a => `<path d="M0 0 C-7 -8 -6 -22 0 -28 C6 -22 7 -8 0 0Z" transform="translate(615 256) rotate(${a}) translate(0 -2)" fill="#FFB300" stroke="#E08A00" stroke-width="1.8"/>`).join('')}
            <path d="M615 250 L615 200 M615 200 l-8 -10 M615 200 l8 -10" stroke="#EF6C00" stroke-width="4" fill="none" stroke-linecap="round"/>
            <path d="M600 360 L600 372 L630 372 L630 360" fill="#AED581" stroke="#7CB342" stroke-width="2"/>
            ${S.text(615, 420, 'one tiny floret', { size: 20, fill: '#9A3222' })}</g></g>`;
          const svg = api.svg(`
            <rect width="800" height="520" fill="#EAF6FF"/>
            <rect x="440" y="20" width="350" height="480" rx="20" fill="#fff" stroke="#E7A07F" stroke-width="3"/>
            <g id="gf-intro"><text x="615" y="250" text-anchor="middle" font-size="110" fill="#F4B942" class="float">?</text>${S.text(615, 330, 'Pull off the petals', { size: 20, fill: '#6E665A' })}${S.text(615, 356, 'to find out!', { size: 20, fill: '#6E665A' })}</g>
            <text id="gf-panel-t" x="615" y="70" text-anchor="middle" font-size="22" font-weight="800" fill="#C8452F">What is inside? 🤔</text>
            <text id="gf-count" x="${DX}" y="500" text-anchor="middle" font-size="20" font-weight="800" fill="#3B3F6B">Petals pulled off: 0</text>
            <clipPath id="gf-hl"><rect x="0" y="0" width="${DX}" height="520"/></clipPath>
            <clipPath id="gf-hr"><rect x="${DX}" y="0" width="${DX}" height="520"/></clipPath>
            <g id="gf-daisy" transform="translate(${DX} ${DY})">
              <g id="gf-pets">${petals}</g>
            </g>
            <g id="gf-halfL" clip-path="url(#gf-hl)"><g transform="translate(${DX} ${DY})"><g id="gf-disc">${disc}</g></g></g>
            <g id="gf-halfR" clip-path="url(#gf-hr)"><g transform="translate(${DX} ${DY})">${disc}</g></g>
            <g id="gf-flying"></g>
            ${zoom}${side}
          `);
          let pulled = 0, phase = 0;
          const flying = S.q(svg, '#gf-flying');
          const pull = p => {
            if (p._gone) return;
            p._gone = true;
            const a = (+p.dataset.i * 360 / NP - 90) * Math.PI / 180;
            const deg = +p.dataset.i * 360 / NP;
            const node = S.frag(`<g transform="translate(${DX} ${DY}) rotate(${f1(deg)})">${p.innerHTML}</g>`);
            p.style.display = 'none';
            flying.appendChild(node);
            const dist = 80 + Math.random() * 60, spin = (Math.random() - .5) * 200;
            api.tween(900, (k, raw) => {
              const x = DX + Math.cos(a) * dist * k, y = DY + Math.sin(a) * dist * k + raw * raw * 160;
              node.setAttribute('transform', `translate(${f1(x)} ${f1(y)}) rotate(${f1(deg + spin * k)}) scale(${f1(1 - .4 * k)})`);
              node.setAttribute('opacity', f1(1 - raw));
            }, W.ease.linear).then(() => node.remove());
            pulled++;
            S.q(svg, '#gf-count').textContent = `Petals pulled off: ${pulled}`;
            if (pulled === NP) api.timeout(centre, 900);
          };
          // All petals gone: the tiny florets light up in their circles
          const centre = async () => {
            phase = 1;
            api.say('Look at the middle! It is made of lots of tiny parts in a circle. Each tiny part is a little flower called a floret.');
            api.sfx('sprinkle');
            const fl = S.qa(svg, '#gf-disc .gf-flo');
            const base = fl.map(c => ({ x: +c.getAttribute('cx'), y: +c.getAttribute('cy'), r: +c.getAttribute('r') }));
            if (!await api.tween(1800, k => fl.forEach((c, i) => {
              const t = Math.max(0, Math.min(1, k * 1.6 - i / fl.length * .6));
              const s = 1 + Math.sin(t * Math.PI) * .9;
              c.setAttribute('cx', f1(base[i].x * (1 + Math.sin(t * Math.PI) * .25)));
              c.setAttribute('cy', f1(base[i].y * (1 + Math.sin(t * Math.PI) * .25)));
              c.setAttribute('fill', t > 0 && t < 1 ? '#FFEB3B' : (i % 5 ? '#FFC107' : '#FFA000'));
              c.setAttribute('r', f1(base[i].r * s));
            }), W.ease.linear)) return;
            S.q(svg, '#gf-count').textContent = 'Lots of tiny florets!';
            S.q(svg, '#gf-panel-t').textContent = 'Look closer 🔍';
            S.q(svg, '#gf-zoom').style.display = '';
            S.q(svg, '#gf-intro').style.display = 'none';
            api.sfx('magic');
            cutB.disabled = false;
            cutB.classList.add('pulse');
            pullB.disabled = true;
          };
          const cut = async () => {
            if (phase !== 1) return;
            phase = 2;
            cutB.disabled = true; cutB.classList.remove('pulse');
            api.sfx('snip');
            const L = S.q(svg, '#gf-halfL'), R = S.q(svg, '#gf-halfR');
            await api.tween(700, k => { L.setAttribute('transform', `translate(${f1(-26 * k)} ${f1(6 * k)}) rotate(${f1(-6 * k)} ${DX} ${DY})`); R.setAttribute('transform', `translate(${f1(26 * k)} ${f1(6 * k)}) rotate(${f1(6 * k)} ${DX} ${DY})`); }, W.ease.back);
            if (!api.alive()) return;
            S.q(svg, '#gf-zoom').style.display = 'none';
            S.q(svg, '#gf-side').style.display = '';
            S.q(svg, '#gf-panel-t').textContent = 'Cut in half ✂️';
            api.sfx('grow');
            api.star();
            api.say('When we cut the flower head in half, we can see the tiny florets packed in a circle on top. The petals are round the outside.');
            api.timeout(() => api.praise('You took a daisy apart like a real scientist!'), 7000);
          };
          S.qa(svg, '.gf-pet').forEach(p => p.addEventListener('click', () => { api.sfx('pluck'); pull(p); }));
          api.row();
          const pullB = api.button('🖐 Pull off all the petals', () => {
            S.qa(svg, '.gf-pet').filter(p => !p._gone).forEach((p, k) => api.timeout(() => { api.sfx('pluck'); pull(p); }, k * 70));
          }, { cls: 'primary', sound: null });
          const cutB = api.button('✂️ Cut it in half', cut, { cls: 'warn', sound: null });
          cutB.disabled = true;
          api.button('↺ New daisy', () => { api.sfx('page'); App.go(App.chapters.findIndex(c => c.id === 'groupflowers'), 2); }, { cls: 'small', sound: null });
        },
      },

      // ---------- d) Petal shapes ----------
      {
        text: ['Look at the different shapes of some flower petals.'],
        ask: 'Can you see any of these? Make a flower like the one in the challenge.',
        activity: true,
        scene(stage, api) {
          const bx = i => 70 + i * 132;
          const shapeBtn = (s, i) => {
            const x = 452 + (i % 3) * 110, y = i < 3 ? 215 : 275;
            const ex = BOOK.find(b => b.shape === s.id);
            return `<g class="gf-btn gf-shape" data-id="${s.id}"><rect class="gf-bg" x="${x}" y="${y}" width="104" height="52" rx="12" fill="#fff" stroke="#E0D6C2" stroke-width="3"/>
              <g transform="translate(${x + 22} ${y + 26})">${makeFlower({ shape: s.id, n: s.id === 'long' ? 10 : 5, color: ex.color === '#FFFFFF' || ex.color === '#FFF8E1' ? '#F8BBD0' : ex.color, r: 17 })}</g>
              <text x="${x + 44}" y="${y + 32}" font-size="16" font-weight="800" fill="#3B3F6B">${s.name}</text></g>`;
          };
          const svg = api.svg(`
            <rect width="800" height="520" fill="#F2FAFF"/>
            <rect x="0" y="0" width="800" height="138" fill="#FFFDF6"/>
            ${BOOK.map((b, i) => `<g class="gf-hot gf-book" data-i="${i}">
              <circle id="gf-ring${i}" cx="${bx(i)}" cy="72" r="58" fill="#FFF3C4" stroke="#F4B942" stroke-width="3" opacity="0"/>
              <g transform="translate(${bx(i)} 72)">${makeFlower(Object.assign({ r: 46 }, b))}</g>
              <circle cx="${bx(i) - 44}" cy="24" r="13" fill="#C8452F"/>${S.text(bx(i) - 44, 30, i + 1, { size: 16, fill: '#fff' })}
              <g id="gf-bt${i}" style="display:none"><circle cx="${bx(i) + 44}" cy="24" r="13" fill="#3E9B4F" stroke="#fff" stroke-width="2.5"/><path d="M${bx(i) + 38} 24 l5 5 l8 -10" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/></g>
            </g>`).join('')}
            <path d="M0 138 L800 138" stroke="#EADFCB" stroke-width="3" stroke-dasharray="8 8"/>
            <path d="M215 300 C210 360 222 400 215 455" stroke="#43A047" stroke-width="9" fill="none" stroke-linecap="round"/>
            ${S.leaf({ x: 216, y: 400, angle: -30, L: 70, W: 22, color: '#5DAE4B' })}${S.leaf({ x: 214, y: 375, angle: -150, L: 60, W: 20, color: '#5DAE4B' })}
            ${S.pot({ x: 215, y: 452, w: 120, h: 62 })}
            <g transform="translate(215 262)"><g id="gf-made"></g></g>
            <rect x="440" y="146" width="348" height="366" rx="18" fill="#FFF8EF" stroke="#E7A07F" stroke-width="3"/>
            <text id="gf-chal" x="456" y="180" font-size="20" font-weight="800" fill="#9A3222"></text>
            <text id="gf-score" x="772" y="180" text-anchor="end" font-size="20" font-weight="800" fill="#E0A800"></text>
            ${S.text(456, 206, 'Petal shape:', { size: 16, anchor: 'start', fill: '#6E665A' })}
            ${SHAPE_BTN.map(shapeBtn).join('')}
            ${S.text(456, 380, 'Petals:', { size: 18, anchor: 'start', fill: '#6E665A' })}
            <g class="gf-btn" id="gf-minus"><rect class="gf-bg" x="540" y="350" width="46" height="46" rx="23" fill="#fff" stroke="#E0D6C2" stroke-width="3"/>${S.text(563, 382, '−', { size: 28, fill: '#3B3F6B' })}</g>
            <text id="gf-num" x="626" y="384" text-anchor="middle" font-size="30" font-weight="800" fill="#2B2A28">5</text>
            <g class="gf-btn" id="gf-plus"><rect class="gf-bg" x="666" y="350" width="46" height="46" rx="23" fill="#fff" stroke="#E0D6C2" stroke-width="3"/>${S.text(689, 382, '+', { size: 28, fill: '#3B3F6B' })}</g>
            ${S.text(456, 462, 'Colour:', { size: 18, anchor: 'start', fill: '#6E665A' })}
            ${COLOURS.map((c, i) => `<g class="gf-btn gf-col" data-c="${c}"><circle class="gf-bg" cx="${550 + i * 38}" cy="456" r="15" fill="${c}" stroke="#BDBDBD" stroke-width="3"/></g>`).join('')}
          `);
          const made = { shape: 'round', n: 5, color: '#F06292' };
          let target = null, done = new Set(), busy = false;
          const GOAL = 3;
          const render = (open = 1) => {
            S.q(svg, '#gf-made').innerHTML = makeFlower(Object.assign({ r: 96, open }, made));
          };
          const bloom = () => { api.tween(450, k => render(.3 + .7 * k), W.ease.back); };
          const highlight = () => {
            S.qa(svg, '.gf-shape .gf-bg').forEach(r => r.setAttribute('stroke', r.parentNode.dataset.id === made.shape ? '#3E9B4F' : '#E0D6C2'));
            S.qa(svg, '.gf-col .gf-bg').forEach(r => r.setAttribute('stroke', r.parentNode.dataset.c === made.color ? '#3B3F6B' : '#BDBDBD'));
            S.q(svg, '#gf-num').textContent = made.n;
          };
          const newChallenge = () => {
            const left = BOOK.map((b, i) => i).filter(i => !done.has(i));
            target = left[Math.floor(Math.random() * left.length)];
            BOOK.forEach((b, i) => S.q(svg, '#gf-ring' + i).setAttribute('opacity', i === target ? 1 : 0));
            S.q(svg, '#gf-chal').textContent = `🎯 Make a flower like ${target + 1}!`;
            S.q(svg, '#gf-score').textContent = '★'.repeat(done.size) + '☆'.repeat(GOAL - done.size);
          };
          const check = async () => {
            if (busy || target == null) return;
            const t = BOOK[target];
            if (made.shape !== t.shape || made.n !== t.n) return;
            busy = true;
            done.add(target);
            S.q(svg, '#gf-bt' + target).style.display = '';
            S.q(svg, '#gf-score').textContent = '★'.repeat(done.size) + '☆'.repeat(GOAL - done.size);
            api.sfx('magic');
            const g = S.q(svg, '#gf-made');
            await api.tween(900, (k, raw) => g.setAttribute('transform', `rotate(${f1(raw * 360)}) scale(${f1(1 + Math.sin(raw * Math.PI) * .15)})`), W.ease.inOut);
            if (!api.alive()) return;
            g.removeAttribute('transform');
            if (done.size >= GOAL) {
              api.star();
              api.praise(`You made a flower with ${t.name}. You are a flower designer!`);
              S.q(svg, '#gf-chal').textContent = '🌟 Well done! Keep making flowers.';
              BOOK.forEach((b, i) => S.q(svg, '#gf-ring' + i).setAttribute('opacity', 0));
              target = null;
            } else {
              api.praise(`That flower has ${WORD[t.n]} ${t.name}.`);
              if (!await api.wait(2600)) return;
              newChallenge();
              api.say(`Now make a flower like number ${target + 1}.`);
            }
            busy = false;
          };
          S.qa(svg, '.gf-shape').forEach(b => b.addEventListener('click', () => {
            made.shape = b.dataset.id;
            if (made.shape === 'long' && made.n < 8) made.n = 10;
            api.sfx('pop');
            api.say(SHAPE_BTN.find(s => s.id === made.shape).name + ' petals');
            highlight(); bloom(); check();
          }));
          S.q(svg, '#gf-minus').addEventListener('click', () => { if (made.n <= 3) { api.sfx('knock'); return; } made.n--; api.sfx('tick'); api.say(WORD[made.n]); highlight(); bloom(); check(); });
          S.q(svg, '#gf-plus').addEventListener('click', () => { if (made.n >= 16) { api.sfx('knock'); return; } made.n++; api.sfx('tick'); api.say(WORD[made.n]); highlight(); bloom(); check(); });
          S.qa(svg, '.gf-col').forEach(b => b.addEventListener('click', () => { made.color = b.dataset.c; api.sfx('sprinkle'); highlight(); bloom(); }));
          S.qa(svg, '.gf-book').forEach(b => b.addEventListener('click', () => {
            const i = +b.dataset.i;
            api.sfx('pop');
            api.say(`Number ${i + 1} has ${WORD[BOOK[i].n]} ${BOOK[i].name}.`);
          }));
          highlight(); render(1); newChallenge();
        },
      },
    ],
  });
})();
