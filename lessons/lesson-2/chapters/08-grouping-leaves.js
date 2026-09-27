// Chapter 8: Grouping leaves
(() => {
  if (!document.getElementById('gl-style')) {
    const st = document.createElement('style');
    st.id = 'gl-style';
    st.textContent = `
      .gl-hot { cursor: pointer; }
      .gl-hot:hover { filter: drop-shadow(0 0 7px rgba(255,200,60,.95)); }
      .gl-vsvg { width: 120px; height: 84px; display: block; margin: 0 auto 2px; }
      .gl-vein { stroke-dasharray: 1; stroke-dashoffset: 1; }
      .gl-draw .gl-vein { animation: gl-draw 1s ease forwards; }
      @keyframes gl-draw { to { stroke-dashoffset: 0; } }
      .gl-veins .sort-bin h4 { cursor: pointer; font-size: 17px; line-height: 1.15; }
      .gl-veins .sort-card { width: 88px; }
      .gl-veins .sort-card svg { height: 62px; }
      .gl-free { display: flex; flex-direction: column; gap: 8px; height: 100%; }
      .gl-free .sort { flex: 1; gap: 8px; }
      .gl-free .sort-items { min-height: 70px; padding: 2px; gap: 6px; }
      .gl-free .sort-card { width: 66px; font-size: 12px; padding: 2px; }
      .gl-free .sort-card svg { height: 46px; }
      .gl-free .sort-bin { min-height: 120px; }
      .gl-bname { outline: none; border-bottom: 2px dashed #C9B897; padding: 0 4px; cursor: text; }
      .gl-bname:focus { background: #FFF6C8; }
      .gl-album { display: flex; align-items: center; gap: 12px; min-height: 112px; padding: 6px 10px; background: #5D4037; border-radius: 14px; overflow-x: auto; }
      .gl-album-t { color: #FFE0B2; font-weight: 800; font-size: 16px; white-space: nowrap; }
      .gl-polaroid { flex: none; background: #fff; padding: 6px 6px 4px; border-radius: 3px; box-shadow: 0 4px 10px rgba(0,0,0,.35); width: 150px; animation: gl-drop .7s cubic-bezier(.2,1.4,.4,1) both; }
      .gl-polaroid svg { width: 100%; display: block; background: #F1F8E9; }
      .gl-polaroid div { text-align: center; font: 700 13px var(--font-head); color: #3B3F6B; }
      @keyframes gl-drop { from { transform: translateY(-60px) rotate(-20deg) scale(.4); opacity: 0; } }
      .gl-flash { position: absolute; inset: 0; background: #fff; pointer-events: none; opacity: 0; z-index: 8; }
      .gl-flash.go { animation: gl-flash .7s ease-out; }
      @keyframes gl-flash { 0% { opacity: 1; } 100% { opacity: 0; } }
      .btn.gl-on { background: var(--leaf); color: #fff; }
    `;
    document.head.append(st);
  }

  const f1 = S.f1;
  const dark = c => S.mix(c, '#000000', .28);
  // A leaf standing up from the bottom centre of a 100 x 100 box
  const up = o => S.leaf(Object.assign({ x: 50, y: 95, angle: -90, stalk: 10 }, o));

  const MAPLE = [[50, 78], [38, 80], [40, 72], [22, 76], [26, 66], [10, 58], [18, 54], [12, 40], [26, 44], [28, 36], [38, 46], [36, 24], [42, 28], [50, 8], [58, 28], [64, 24], [62, 46], [72, 36], [74, 44], [88, 40], [82, 54], [90, 58], [74, 66], [78, 76], [60, 72], [62, 80]];
  const mapleD = 'M' + MAPLE.map(p => p.join(' ')).join(' L') + 'Z';
  function maple(color = '#F9A825', vein = '#FFF3C4', vw = 1.6) {
    return `<path d="M50 97 L50 78" stroke="${dark(color)}" stroke-width="3" stroke-linecap="round"/>
      <path d="${mapleD}" fill="${color}" stroke="${dark(color)}" stroke-width="1.5" stroke-linejoin="round"/>
      <path d="M50 78 L50 14 M50 78 L16 44 M50 78 L84 44 M50 78 L24 70 M50 78 L76 70" stroke="${vein}" stroke-width="${vw}" fill="none" stroke-linecap="round"/>`;
  }
  function chestnut(color = '#9CCC65') {
    const parts = [[-160, 22], [-20, 22], [-130, 32], [-50, 32], [-90, 40]];
    return `<path d="M50 98 L50 58" stroke="#7C9A3C" stroke-width="3" stroke-linecap="round"/>` +
      parts.map(([a, L]) => S.leaf({ x: 50, y: 58, angle: a, L, W: L * .27, shape: 'toothed', color, stalk: 2 })).join('');
  }
  function pinnate({ color, pairs, L, W, shape, top = 10, rachis = '#6D8B3A' }) {
    let s = `<path d="M50 98 L50 ${top + 4}" stroke="${rachis}" stroke-width="2.5" stroke-linecap="round"/>`;
    for (let i = 0; i < pairs; i++) {
      const y = 84 - i * ((84 - top - 14) / Math.max(1, pairs - 1));
      s += S.leaf({ x: 50, y, angle: -28, L, W, shape, color, stalk: 1.5, veins: false });
      s += S.leaf({ x: 50, y, angle: -152, L, W, shape, color, stalk: 1.5, veins: false });
    }
    return s + S.leaf({ x: 50, y: top + 6, angle: -90, L: L * .9, W, shape, color, stalk: 1, veins: false });
  }
  function grass(color = '#43A047', veins = false) {
    const blades = [[-20, 80], [-8, 90], [6, 94], [20, 82]];
    let s = '';
    blades.forEach(([dx, h], i) => {
      const tipx = 50 + dx * 1.3, tipy = 98 - h;
      s += `<path d="M${47 + i * 2} 98 Q${50 + dx * .4} ${f1(98 - h * .5)} ${f1(tipx)} ${f1(tipy)} Q${50 + dx * .5 + 4} ${f1(98 - h * .5)} ${51 + i * 2} 98Z" fill="${S.mix(color, '#ffffff', i % 2 * .15)}" stroke="${dark(color)}" stroke-width="1"/>`;
    });
    if (veins) s = `<path d="M44 97 C44 60 48 30 54 4 C57 30 58 60 57 97Z" fill="${color}" stroke="${dark(color)}" stroke-width="1.5"/>
      <path d="M47 95 C47 60 50 30 54 8 M50.5 95 C51 60 52 30 54 8 M54 95 C54 60 55 30 54 8" stroke="#F1F8E9" stroke-width="1.6" fill="none"/>`;
    return s;
  }
  function tulip(color = '#66A84A') {
    let v = '';
    for (let k = -2; k <= 2; k++) v += `M50 93 C${50 + k * 5.5} 70 ${50 + k * 5.5} 32 50 9 `;
    return `<path d="M50 96 C28 70 30 30 50 5 C70 30 72 70 50 96Z" fill="${color}" stroke="${dark(color)}" stroke-width="1.5"/>
      <path d="${v}" stroke="#F1F8E9" stroke-width="1.5" fill="none"/>`;
  }
  function geranium(color = '#7CB342') {
    let d = '';
    for (let i = 0; i <= 7; i++) {
      const a0 = (-230 + i * 40) * Math.PI / 180, a1 = (-230 + (i + .5) * 40) * Math.PI / 180, a2 = (-230 + (i + 1) * 40) * Math.PI / 180;
      const P = a => [f1(50 + Math.cos(a) * 38), f1(50 + Math.sin(a) * 38)];
      const Q = a => [f1(50 + Math.cos(a) * 46), f1(50 + Math.sin(a) * 46)];
      if (i === 0) d += `M50 76 L${P(a0).join(' ')}`;
      if (i < 7) d += ` Q${Q(a1).join(' ')} ${P(a2).join(' ')}`;
    }
    d += ' Z';
    let v = '';
    for (let i = 0; i < 7; i++) {
      const a = (-210 + i * 40) * Math.PI / 180;
      v += `M50 72 L${f1(50 + Math.cos(a) * 36)} ${f1(50 + Math.sin(a) * 36)} `;
    }
    return `<path d="M50 98 L50 74" stroke="${dark(color)}" stroke-width="3" stroke-linecap="round"/>
      <path d="${d}" fill="${color}" stroke="${dark(color)}" stroke-width="1.5" stroke-linejoin="round"/>
      <path d="${v}" stroke="#F1F8E9" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
  }
  const card = inner => `<svg viewBox="0 0 100 100">${inner}</svg>`;

  const LEAVES = {
    birch: () => up({ L: 58, W: 24, shape: 'toothed', color: '#F57C00', stalk: 14 }),
    oak: () => up({ L: 74, W: 19, shape: 'oak', color: '#2E7D32', stalk: 8 }),
    beech: () => up({ L: 66, W: 22, shape: 'pointed', color: '#43A047' }),
    maple: () => maple(),
    lime: () => up({ L: 64, W: 27, shape: 'heart', color: '#8BC34A', stalk: 14 }),
    willow: () => up({ L: 84, W: 9, shape: 'long', color: '#9CCC65', stalk: 4 }),
    grass: () => grass(),
    chestnut: () => chestnut(),
    ash: () => pinnate({ color: '#66BB6A', pairs: 4, L: 24, W: 6, shape: 'pointed' }),
    rowan: () => pinnate({ color: '#FF8A65', pairs: 5, L: 22, W: 6, shape: 'toothed', rachis: '#8D6E63' }),
    fern: () => pinnate({ color: '#388E3C', pairs: 8, L: 17, W: 4, shape: 'round', top: 6 }),
  };

  // ---------- Leaf edges ----------
  const EDGES = [
    { id: 'smooth', name: 'smooth', say: 'A smooth edge has no bumps or points.', A: 0, P: 20, f: () => 0 },
    { id: 'scallop', name: 'scalloped', say: 'A scalloped edge has lots of round bumps.', A: 10, P: 17, f: t => Math.abs(Math.sin(Math.PI * t)) },
    { id: 'tooth', name: 'toothed', say: 'A toothed edge has pointed teeth, like a zigzag.', A: 16, P: 26, f: t => 1 - Math.abs(2 * t - 1) },
    { id: 'saw', name: 'saw-toothed', say: 'A saw-toothed edge has sharp jagged teeth, like a saw.', A: 15, P: 22, f: t => Math.pow(1 - t, 1.6) },
    { id: 'wavy', name: 'wavy', say: 'A wavy edge goes in and out in big smooth waves.', A: 16, P: 60, f: t => .5 + .5 * Math.sin(2 * Math.PI * t) },
  ];
  const edgeOff = (e, s, scale = 1) => e.A * scale * e.f(((s / (e.P * scale)) % 1 + 1) % 1);

  // Edge tile like the book: yellow tile with a green leaf edge on the right
  function edgeTile(e, w = 128, h = 150) {
    const pts = [];
    for (let y = 0; y <= h; y += 1) {
      const k = (y - h / 2) / (h / 2);
      const xb = 80 - 34 * (1 - k * k);
      pts.push(`${f1(xb - edgeOff(e, y))} ${y}`);
    }
    return `<path d="M${w} 0 L${pts.join(' L')} L${w} ${h}Z" fill="#1E9A45"/>`;
  }
  // A whole leaf (pointing right from 0,0) with the chosen edge
  function edgeLeafPath(e, L, W, amp = .75) {
    const N = 260, top = [];
    for (let i = 0; i <= N; i++) {
      const u = i / N;
      top.push({ x: L * u, y: -W * Math.pow(Math.sin(Math.PI * u), .8) * (1 - .3 * u) });
    }
    let s = 0;
    const out = top.map((p, i) => {
      if (i) s += Math.hypot(p.x - top[i - 1].x, p.y - top[i - 1].y);
      return Object.assign({ s }, p);
    });
    const total = s;
    const pts = out.map((p, i) => {
      const a = out[Math.max(0, i - 1)], b = out[Math.min(N, i + 1)];
      let nx = b.y - a.y, ny = -(b.x - a.x);
      const len = Math.hypot(nx, ny) || 1;
      nx /= len; ny /= len;
      if (ny > 0) { nx = -nx; ny = -ny; }
      const taper = Math.min(1, p.s / 16, (total - p.s) / 16);
      const o = edgeOff(e, p.s, amp) * Math.max(0, taper);
      return { x: p.x + nx * o, y: p.y + ny * o };
    });
    const t = pts.map(p => `${f1(p.x)} ${f1(p.y)}`).join(' L');
    const b = pts.slice().reverse().map(p => `${f1(p.x)} ${f1(-p.y)}`).join(' L');
    return { d: `M${t} L${b}Z`, pts };
  }

  // ---------- Leaf shapes (centred at 0,0, pointing up) ----------
  const tip = (shape, L, W, color, veins) => S.leaf({ x: 0, y: L / 2 + 4, angle: -90, L, W, shape, color, stalk: 8, veins });
  const SHAPES = [
    { id: 'long', name: 'long and thin', leaf: 'willow', hint: 'Look how long and thin it is.', draw: (c, v) => tip('long', 84, 9, c, v) },
    { id: 'oval', name: 'oval', leaf: 'beech', hint: 'It is smooth and shaped like an egg.', draw: (c, v) => `<path d="M0 46 L0 36" stroke="${dark(c)}" stroke-width="3"/><path d="M0 37 C-34 30 -32 -34 0 -42 C32 -34 34 30 0 37Z" fill="${c}" stroke="${dark(c)}" stroke-width="1.5"/>${v ? `<path d="M0 36 L0 -38 M0 20 L-16 8 M0 20 L16 8 M0 0 L-18 -12 M0 0 L18 -12 M0 -18 L-12 -28 M0 -18 L12 -28" stroke="${S.mix(c, '#fff', .45)}" stroke-width="1.6" fill="none"/>` : ''}` },
    { id: 'heart', name: 'heart', leaf: 'lime', hint: 'Look at the bottom. It is wide, like a heart.', draw: (c, v) => tip('heart', 72, 30, c, v) },
    { id: 'lobed', name: 'lobed', leaf: 'oak', hint: 'It has round bumps called lobes along the sides.', draw: (c, v) => tip('oak', 80, 20, c, v) },
    { id: 'hand', name: 'hand shape', leaf: 'sycamore', hint: 'It has points spreading out like the fingers on a hand.', draw: (c, v) => `<g transform="translate(-50 -52)">${v ? maple(c, S.mix(c, '#fff', .45)) : maple(c, c)}</g>` },
    { id: 'round', name: 'round', leaf: 'nasturtium', hint: 'It is almost a circle.', draw: (c, v) => `<path d="M0 46 L0 26" stroke="${dark(c)}" stroke-width="3"/><circle cx="0" cy="-6" r="34" fill="${c}" stroke="${dark(c)}" stroke-width="1.5"/>${v ? [0, 1, 2, 3, 4, 5, 6, 7].map(i => { const a = i * 45 * Math.PI / 180; return `<path d="M0 -6 L${f1(Math.cos(a) * 30)} ${f1(-6 + Math.sin(a) * 30)}" stroke="${S.mix(c, '#fff', .45)}" stroke-width="1.6"/>`; }).join('') : ''}` },
    { id: 'needle', name: 'needle', leaf: 'pine', hint: 'The leaves are very thin, like needles.', draw: c => [-26, -13, 0, 13, 26].map(dx => `<path d="M0 44 Q${dx * .3} 0 ${dx} -42" stroke="${c}" stroke-width="5" fill="none" stroke-linecap="round"/>`).join('') + `<circle cx="0" cy="44" r="5" fill="${dark(c)}"/>` },
    { id: 'pointed', name: 'pointed', leaf: 'cherry', hint: 'It is long with a sharp point at the tip.', draw: (c, v) => tip('pointed', 82, 17, c, v) },
  ];

  // ---------- Vein patterns (icon 120 x 100, black lines like the book) ----------
  const vp = (d, i, w = 2.6) => `<path class="gl-vein" pathLength="1" d="${d}" style="animation-delay:${f1(i * .12)}s" stroke="#222" stroke-width="${w}" fill="none" stroke-linecap="round"/>`;
  const VEINS = {
    palm: () => {
      let s = vp('M60 98 L60 76', 0, 3.4);
      for (let i = 0; i < 11; i++) {
        const a = (-175 + i * 17) * Math.PI / 180, L = 40 + (5 - Math.abs(i - 5)) * 5;
        s += vp(`M60 76 L${f1(60 + Math.cos(a) * L * 1.15)} ${f1(76 + Math.sin(a) * L)}`, i + 1);
      }
      return s;
    },
    parallel: () => {
      let s = vp('M60 98 C28 70 30 28 60 3', 0, 3.4) + vp('M60 98 C92 70 90 28 60 3', 0, 3.4);
      [-2, -1, 0, 1, 2].forEach((k, i) => { s += vp(`M60 96 C${60 + k * 8} 72 ${60 + k * 8} 30 60 6`, i + 1); });
      return s;
    },
    branch: () => {
      let s = vp('M60 99 L60 4', 0, 3.4);
      [86, 66, 46, 26].forEach((y, i) => { s += vp(`M60 ${y} L${60 - 34 + i * 4} ${y - 30 + i * 3}`, i + 1) + vp(`M60 ${y} L${60 + 34 - i * 4} ${y - 30 + i * 3}`, i + 1); });
      return s + vp('M60 16 L48 4', 5) + vp('M60 16 L72 4', 5);
    },
  };
  const veinIcon = id => `<svg class="gl-vsvg gl-draw" viewBox="0 0 120 100">${VEINS[id]()}</svg>`;
  const replay = svgEl => { svgEl.classList.remove('gl-draw'); void svgEl.getBoundingClientRect(); svgEl.classList.add('gl-draw'); };

  const shuffle = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

  App.chapter({
    id: 'groupleaves',
    title: 'Grouping leaves',
    icon: '🍂',
    group: 'Sorting plants',
    keywords: [
      { w: 'arranged', d: 'Put in a certain way or order.' },
      { w: 'edge', d: 'The outside line all the way round something.' },
      { w: 'photograph', d: 'A picture that you take with a camera.' },
    ],
    steps: [
      // ---------- a) How are leaves arranged? Simple or compound? ----------
      {
        text: ['Collect some leaves to look at.', 'Try to look at the leaves that are still on the plant as well. How are they **arranged** on the stem?'],
        ask: 'Click each plant to see how its leaves grow on the stem.',
        activity: true,
        scene(stage, api) {
          const g = '#2E9D4F';
          const one = (inner, i) => `<g class="gl-one" data-k="${i}">${inner}</g>`;
          // Four ways leaves can be arranged
          const opp = [390, 300, 210].map((y, i) => one(S.leaf({ x: 100, y, angle: -28, L: 68, W: 21, color: g, stalk: 4 }), i * 2) + one(S.leaf({ x: 100, y, angle: -152, L: 68, W: 21, color: g, stalk: 4 }), i * 2 + 1)).join('')
            + one(S.leaf({ x: 100, y: 140, angle: -90, L: 40, W: 14, color: g, stalk: 2 }), 6);
          const alt = [410, 355, 300, 245, 190, 140].map((y, i) => one(S.leaf({ x: 300, y, angle: i % 2 ? -150 : -30, L: 64 - i * 4, W: 20 - i, color: '#43A047', stalk: 5, shape: 'toothed' }), i)).join('');
          let clu = '', k = 0;
          [[500, 380, 1], [500, 270, .9], [500, 165, .8]].forEach(([x, y, s]) => {
            for (let i = 0; i < 7; i++) clu += one(S.leaf({ x, y, angle: -180 + i * 30, L: 52 * s, W: 7 * s, shape: 'long', color: '#1B8A4A', stalk: 1, veins: false }), k++);
          });
          let ros = '';
          for (let i = 0; i < 9; i++) ros += one(S.leaf({ x: 700, y: 300, angle: i * 40 + 5, L: 78, W: 24, shape: 'pointed', color: '#2E7D32', stalk: 0 }), i);
          for (let i = 0; i < 6; i++) ros += one(S.leaf({ x: 700, y: 300, angle: i * 60 + 28, L: 48, W: 18, shape: 'pointed', color: '#43A047', stalk: 0 }), 9 + i);
          ros += one(`<circle cx="700" cy="300" r="10" fill="#66BB6A"/>`, 15);
          const ARR = [
            { name: 'in pairs', say: 'These leaves grow in pairs, opposite each other on the stem.' },
            { name: 'one by one', say: 'These leaves take turns. One grows on one side, then the next grows on the other side.' },
            { name: 'in clusters', say: 'These leaves grow in clusters. Lots of leaves grow in a ring round the stem.' },
            { name: 'in a rosette', say: 'These leaves grow in a rosette. They spread out in a circle from the middle, close to the ground.' },
          ];
          const stems = [
            `<path d="M100 440 L100 130" stroke="#2E7D32" stroke-width="6" stroke-linecap="round"/>`,
            `<path d="M300 440 L300 130" stroke="#388E3C" stroke-width="6" stroke-linecap="round"/>`,
            `<path d="M500 440 L500 150" stroke="#2E7D32" stroke-width="6" stroke-linecap="round"/>`,
            `<ellipse cx="700" cy="400" rx="78" ry="12" fill="#8D6E63" opacity=".35"/>`,
          ];
          const svg = api.svg(`
            <rect width="800" height="520" fill="#F4FBEF"/>
            <text x="400" y="36" text-anchor="middle" font-size="22" font-weight="800" fill="#2A7439">👆 Click each plant</text>
            ${[0, 1, 2, 3].map(i => `<g class="gl-hot gl-arr" data-i="${i}"><rect x="${10 + i * 200}" y="60" width="180" height="385" rx="18" fill="#fff" stroke="#CFE8C6" stroke-width="3"/>
              ${stems[i]}<g class="gl-lv">${[opp, alt, clu, ros][i]}</g></g>`).join('')}
            ${ARR.map((a, i) => `<g id="gl-tag${i}" style="display:none"><g class="pop-in"><rect x="${25 + i * 200}" y="458" width="150" height="40" rx="20" fill="#3E9B4F"/>${S.text(100 + i * 200, 485, a.name, { size: 19, fill: '#fff' })}</g></g>`).join('')}
          `);
          const seen = new Set();
          let nextB = null;
          S.qa(svg, '.gl-arr').forEach(p => p.addEventListener('click', async () => {
            const i = +p.dataset.i;
            if (p._busy) return;
            p._busy = true;
            const lv = S.qa(p, '.gl-one');
            lv.forEach(l => { l.style.opacity = 0; l.classList.remove('pop-in'); });
            api.sfx('swoosh');
            api.say(ARR[i].say);
            for (let k = 0; k < lv.length; k++) {
              if (!await api.wait(i === 2 ? 70 : 130)) return;
              lv[k].style.opacity = ''; lv[k].classList.add('pop-in');
              if (k % (i === 2 ? 3 : 1) === 0) api.sfx('pop');
            }
            p._busy = false;
            const tag = S.q(svg, '#gl-tag' + i);
            tag.style.display = '';
            seen.add(i);
            if (seen.size === 4 && nextB) nextB.classList.add('pulse');
          }));

          // Part two: one leaf on its own, or lots of leaflets?
          const partTwo = () => {
            stage.innerHTML = '';
            api.controls.innerHTML = '';
            const box = api.html(`<div style="text-align:center;font:800 21px var(--font-head);color:#9A3222;margin-bottom:4px">Is there one leaf on its own? Or is it more like these?</div><div></div>`);
            api.say('Is there one leaf on its own? Or is it made of lots of little leaflets? Sort the leaves.');
            const S1 = 'This is one leaf on its own.', S2 = 'This leaf is made of lots of little leaflets.';
            api.sortGame(box.lastElementChild, {
              bins: [{ id: 'one', title: '🍂 One leaf on its own' }, { id: 'lots', title: '🌿 Lots of leaflets' }],
              items: [
                { id: 'birch', bin: 'one', label: 'birch', svg: card(LEAVES.birch()), hint: S1 },
                { id: 'oak', bin: 'one', label: 'oak', svg: card(LEAVES.oak()), hint: S1 },
                { id: 'beech', bin: 'one', label: 'beech', svg: card(LEAVES.beech()), hint: S1 },
                { id: 'maple', bin: 'one', label: 'maple', svg: card(LEAVES.maple()), hint: 'Look again. The maple leaf has points, but it is all one leaf.' },
                { id: 'chestnut', bin: 'lots', label: 'horse chestnut', svg: card(LEAVES.chestnut()), hint: S2 },
                { id: 'ash', bin: 'lots', label: 'ash', svg: card(LEAVES.ash()), hint: S2 },
                { id: 'rowan', bin: 'lots', label: 'rowan', svg: card(LEAVES.rowan()), hint: S2 },
                { id: 'fern', bin: 'lots', label: 'fern', svg: card(LEAVES.fern()), hint: S2 },
              ],
              onDone: () => { api.star(); api.sayAfter('Some leaves are one leaf on their own. Others are made of lots of small leaflets on one stalk.'); },
            });
          };
          api.row();
          nextB = api.button('Next: one leaf or lots? ▶', partTwo, { cls: 'primary', sound: 'page' });
        },
      },

      // ---------- b) Leaf shapes ----------
      {
        text: ['Look at the shape of each leaf.'],
        ask: 'Does it match any of these shapes? Click the shape that matches the mystery leaf.',
        activity: true,
        scene(stage, api) {
          const cols = { long: '#9CCC65', oval: '#43A047', heart: '#AED581', lobed: '#2E7D32', hand: '#FB8C00', round: '#7CB342', needle: '#1B5E20', pointed: '#E53935' };
          const tiles = SHAPES.map((s, i) => {
            const x = 322 + (i % 4) * 116, y = i < 4 ? 30 : 272;
            return `<g class="gl-hot gl-tile" data-id="${s.id}">
              <rect class="gl-tbox" x="${x}" y="${y}" width="108" height="220" rx="16" fill="#fff" stroke="#E0D6C2" stroke-width="3"/>
              <g transform="translate(${x + 54} ${y + 96}) scale(1.15)">${s.draw('#5DAE5B', false)}</g>
              ${S.text(x + 54, y + 202, s.name, { size: 16, fill: '#3B3F6B' })}
              <g class="gl-tick" style="display:none"><circle cx="${x + 92}" cy="${y + 16}" r="13" fill="#3E9B4F" stroke="#fff" stroke-width="3"/><path d="M${x + 86} ${y + 16} l5 5 l8 -10" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/></g>
            </g>`;
          }).join('');
          const svg = api.svg(`
            <rect width="800" height="520" fill="#FFFBF2"/>
            <rect x="14" y="30" width="294" height="462" rx="20" fill="#E8F5E9" stroke="#3E9B4F" stroke-width="3"/>
            ${S.text(161, 66, '🔍 Mystery leaf', { size: 22, fill: '#2A7439' })}
            <g id="gl-dots"></g>
            <g id="gl-myst"></g>
            <text id="gl-mname" x="161" y="470" text-anchor="middle" font-size="21" font-weight="800" fill="#2A7439"></text>
            ${tiles}
            <g id="gl-flyer"></g>
          `);
          const myst = S.q(svg, '#gl-myst');
          let order = [], round = 0, cur = null, busy = false, score = 0;
          const ROUNDS = 6;
          const dots = () => {
            S.q(svg, '#gl-dots').innerHTML = [...Array(ROUNDS)].map((_, i) => `<circle cx="${f1(161 - (ROUNDS - 1) * 14 + i * 28)}" cy="94" r="9" fill="${i < score ? '#FFC93C' : '#fff'}" stroke="#C9B897" stroke-width="2"/>`).join('');
          };
          const next = async () => {
            if (round >= ROUNDS) return;
            cur = order[round];
            busy = true;
            S.q(svg, '#gl-mname').textContent = '';
            const s = SHAPES.find(x => x.id === cur);
            myst.innerHTML = `<g transform="translate(161 280)"><g id="gl-mleaf">${s.draw(cols[cur], true)}</g></g>`;
            const inner = S.q(myst, '#gl-mleaf');
            api.sfx('whoosh');
            const sc = 2.5, rot = (round % 2 ? 1 : -1) * 12;
            const ok = await api.tween(700, k => inner.setAttribute('transform', `translate(${f1(-300 * (1 - k))} 0) rotate(${f1(rot - 200 * (1 - k))}) scale(${f1(sc * (.3 + .7 * k))})`), W.ease.out);
            if (!ok) return;
            busy = false;
            api.say('Which shape is this leaf?');
          };
          const start = () => {
            order = shuffle(SHAPES.map(s => s.id)).slice(0, ROUNDS);
            round = 0; score = 0;
            S.qa(svg, '.gl-tick').forEach(t => { t.style.display = 'none'; });
            dots();
            next();
          };
          S.qa(svg, '.gl-tile').forEach(t => t.addEventListener('click', async () => {
            if (busy || !cur) return;
            const s = SHAPES.find(x => x.id === cur);
            if (t.dataset.id !== cur) {
              api.oops(s.hint);
              return;
            }
            busy = true;
            score++;
            dots();
            api.sfx('success');
            S.q(svg, '#gl-mname').textContent = `A ${s.leaf} leaf is ${s.name === 'hand shape' ? 'shaped like a hand' : s.name}!`;
            api.say(`Yes! A ${s.leaf} leaf is ${s.name === 'hand shape' ? 'shaped like a hand' : s.name}.`);
            S.q(t, '.gl-tick').style.display = '';
            const box = S.q(t, '.gl-tbox');
            box.setAttribute('stroke', '#3E9B4F');
            api.timeout(() => box.setAttribute('stroke', '#E0D6C2'), 1400);
            if (!await api.wait(1000)) return;
            // The mystery leaf shrinks and flies into its tile
            const ti = SHAPES.indexOf(s);
            const to = { x: 322 + (ti % 4) * 116 + 54, y: (ti < 4 ? 30 : 272) + 96 };
            const outer = myst.firstElementChild, leafEl = S.q(myst, '#gl-mleaf');
            api.sfx('whoosh');
            if (!await api.tween(650, k => {
              outer.setAttribute('transform', `translate(${f1(161 + (to.x - 161) * k)} ${f1(280 + (to.y - 280) * k - Math.sin(k * Math.PI) * 80)})`);
              leafEl.setAttribute('transform', `scale(${f1(2.5 - 1.5 * k)})`);
              outer.setAttribute('opacity', f1(1 - k * .9));
            }, W.ease.inOut)) return;
            myst.innerHTML = '';
            api.sfx('drop');
            if (!await api.wait(300)) return;
            round++;
            if (round >= ROUNDS) {
              api.star();
              api.praise('You matched all the leaf shapes!');
              S.q(svg, '#gl-mname').textContent = '🌟 All done!';
              return;
            }
            next();
          }));
          api.row();
          api.button('↺ Play again', () => start(), { cls: 'small' });
          start();
        },
      },

      // ---------- c) Leaf edges ----------
      {
        text: ['Look at the **edge** of each leaf.'],
        ask: 'Does it match any of these? Which picture does it match best?',
        activity: true,
        scene(stage, api) {
          const tx = i => 30 + i * 150;
          const tiles = EDGES.map((e, i) => `<g class="gl-hot gl-etile" data-id="${e.id}">
            <clipPath id="gl-tclip${i}"><rect x="0" y="0" width="128" height="150" rx="20"/></clipPath>
            <g transform="translate(${tx(i)} 14)">
              <rect class="gl-ebox" x="-5" y="-5" width="138" height="160" rx="24" fill="none" stroke="transparent" stroke-width="5"/>
              <g clip-path="url(#gl-tclip${i})"><rect width="128" height="150" fill="#E3D52A"/>${edgeTile(e)}</g>
            </g>
            ${S.text(tx(i) + 64, 192, e.name, { size: 18, fill: '#3B3F6B' })}
          </g>`).join('');
          const LX = 50, LY = 372, LL = 330, LW = 92;
          const svg = api.svg(`
            <rect width="800" height="520" fill="#FFFDF6"/>
            ${tiles}
            <path d="M0 212 L800 212" stroke="#EADFCB" stroke-width="3" stroke-dasharray="8 8"/>
            <clipPath id="gl-zclip"><circle cx="630" cy="368" r="128"/></clipPath>
            <g id="gl-leaf"></g>
            <g id="gl-cone" opacity="0"></g>
            <g id="gl-zoom" opacity="0">
              <circle cx="630" cy="368" r="128" fill="#FFF8E1"/>
              <g clip-path="url(#gl-zclip)"><g id="gl-zin"></g></g>
              <circle cx="630" cy="368" r="128" fill="none" stroke="#455A64" stroke-width="10"/>
            </g>
            <g id="gl-mag"></g>
            <g id="gl-edots"></g>
          `);
          const ROUNDS = 6;
          let order = [], round = 0, cur = null, busy = true, score = 0, focus = null;
          const colors = ['#43A047', '#2E7D32', '#689F38', '#388E3C', '#558B2F', '#33691E'];
          const dots = () => {
            S.q(svg, '#gl-edots').innerHTML = [...Array(ROUNDS)].map((_, i) => `<circle cx="${36 + i * 26}" cy="500" r="8" fill="${i < score ? '#FFC93C' : '#fff'}" stroke="#C9B897" stroke-width="2"/>`).join('');
          };
          const drawLeaf = e => {
            const c = colors[round % colors.length];
            const { d, pts } = edgeLeafPath(e, LL, LW);
            const veins = [.2, .38, .56, .74].map(u => `M${f1(LL * u)} 0 L${f1(LL * (u + .12))} ${f1(-LW * .55)} M${f1(LL * u)} 0 L${f1(LL * (u + .12))} ${f1(LW * .55)}`).join(' ');
            const m = `<g transform="translate(${LX} ${LY})"><path d="M-30 0 L4 0" stroke="${dark(c)}" stroke-width="7" stroke-linecap="round"/>
              <path d="${d}" fill="${c}" stroke="${dark(c)}" stroke-width="2" stroke-linejoin="round"/>
              <path d="M0 0 L${LL * .95} 0 ${veins}" stroke="${S.mix(c, '#fff', .4)}" stroke-width="3" fill="none" stroke-linecap="round"/></g>`;
            S.q(svg, '#gl-leaf').innerHTML = m;
            const p = pts[Math.round(pts.length * .42)];
            focus = { x: LX + p.x, y: LY + p.y };
            S.q(svg, '#gl-zin').innerHTML = `<g transform="translate(630 368) scale(3.2) translate(${f1(-focus.x)} ${f1(-focus.y)})">${m}</g>`;
          };
          const next = async () => {
            cur = order[round];
            busy = true;
            const e = EDGES.find(x => x.id === cur);
            S.q(svg, '#gl-zoom').setAttribute('opacity', 0);
            S.q(svg, '#gl-cone').setAttribute('opacity', 0);
            drawLeaf(e);
            const lf = S.q(svg, '#gl-leaf');
            api.sfx('whoosh');
            if (!await api.tween(600, k => lf.setAttribute('transform', `translate(${f1(-420 * (1 - k))} 0)`), W.ease.out)) return;
            // The magnifying glass moves to the edge, then the close-up appears
            const mag = S.q(svg, '#gl-mag');
            mag.innerHTML = S.magnifier({ x: 0, y: 0, r: 40 });
            const from = { x: 760, y: 500 };
            if (!await api.tween(800, k => mag.setAttribute('transform', `translate(${f1(from.x + (focus.x - from.x) * k)} ${f1(from.y + (focus.y - from.y) * k)})`), W.ease.inOut)) return;
            api.sfx('magic');
            S.q(svg, '#gl-cone').innerHTML = `<path d="M${f1(focus.x + 28)} ${f1(focus.y - 28)} L${630 - 50} ${368 - 118} M${f1(focus.x + 28)} ${f1(focus.y + 28)} L${630 - 70} ${368 + 108}" stroke="#90A4AE" stroke-width="3" stroke-dasharray="6 6"/>`;
            const z = S.q(svg, '#gl-zoom'), cone = S.q(svg, '#gl-cone');
            if (!await api.tween(500, k => { z.setAttribute('opacity', f1(k)); cone.setAttribute('opacity', f1(k)); }, W.ease.out)) return;
            busy = false;
            api.say('Look at the edge. Which picture does it match best?');
          };
          const start = () => {
            const ids = shuffle(EDGES.map(e => e.id));
            order = ids.concat(shuffle(ids)[0]).slice(0, ROUNDS);
            round = 0; score = 0;
            dots();
            next();
          };
          S.qa(svg, '.gl-etile').forEach(t => t.addEventListener('click', async () => {
            const e = EDGES.find(x => x.id === t.dataset.id);
            if (busy || !cur) { api.sfx('pop'); api.say(e.say); return; }
            if (t.dataset.id !== cur) {
              api.oops(`Not quite. ${EDGES.find(x => x.id === cur).say.replace(/^An? [\w-]+ edge/, 'This edge')}`);
              return;
            }
            busy = true;
            score++; dots();
            api.sfx('success');
            api.say(`Yes! This leaf has a ${e.name} edge.`);
            const b = S.q(t, '.gl-ebox');
            b.setAttribute('stroke', '#3E9B4F');
            api.timeout(() => b.setAttribute('stroke', 'transparent'), 1400);
            if (!await api.wait(1800)) return;
            round++;
            if (round >= ROUNDS) {
              api.star();
              api.praise('You are an expert at leaf edges!');
              return;
            }
            next();
          }));
          api.row();
          api.button('↺ Play again', () => { if (!busy || round >= ROUNDS) start(); }, { cls: 'small' });
          start();
        },
      },

      // ---------- d) Vein patterns ----------
      {
        text: ['What pattern do the veins make?'],
        ask: 'Click a pattern to watch it draw. Then drag each leaf to the pattern its veins make.',
        activity: true,
        scene(stage, api) {
          const box = api.html('<div class="gl-veins" style="height:100%"></div>');
          const P = {
            palm: { name: 'spreading out from one point', say: 'The veins spread out from one point, like the fingers on your hand.' },
            parallel: { name: 'parallel lines', say: 'The veins are parallel lines. They go side by side from the bottom to the tip.' },
            branch: { name: 'branching from a middle vein', say: 'The veins branch out from one middle vein, like a feather.' },
          };
          const hint = id => `Look at the veins again. ${P[id].say}`;
          const game = api.sortGame(box.firstElementChild, {
            bins: Object.keys(P).map(id => ({ id, title: `${veinIcon(id)}${P[id].name}` })),
            items: [
              { id: 'maple', bin: 'palm', label: 'maple', svg: card(maple('#F57C00', '#FFF3C4', 2.2)), hint: hint('palm') },
              { id: 'geranium', bin: 'palm', label: 'geranium', svg: card(geranium()), hint: hint('palm') },
              { id: 'grass', bin: 'parallel', label: 'grass', svg: card(grass('#43A047', true)), hint: hint('parallel') },
              { id: 'tulip', bin: 'parallel', label: 'tulip', svg: card(tulip()), hint: hint('parallel') },
              { id: 'beech', bin: 'branch', label: 'beech', svg: card(up({ L: 70, W: 24, shape: 'pointed', color: '#388E3C', vein: '#F1F8E9' })), hint: hint('branch') },
              { id: 'oak', bin: 'branch', label: 'oak', svg: card(up({ L: 76, W: 19, shape: 'oak', color: '#6D8B3A', vein: '#F1F8E9', stalk: 8 })), hint: hint('branch') },
            ],
            onDone: () => { api.star(); api.sayAfter('Veins can spread out from one point, go in parallel lines, or branch from a middle vein.'); },
          });
          // Click a pattern to redraw it; a new leaf in a box redraws it too
          Object.keys(game.bins).forEach(id => {
            const bin = game.bins[id];
            const icon = S.q(bin, '.gl-vsvg');
            S.q(bin, 'h4').addEventListener('click', () => { api.sfx('swoosh'); replay(icon); api.say(P[id].say); });
            const mo = new MutationObserver(() => { replay(icon); api.sfx('sprinkle'); });
            mo.observe(S.q(bin, '.bin-items'), { childList: true });
            api.onCleanup(() => mo.disconnect());
          });
          // Draw the three patterns one after another at the start
          const icons = api.qa('.gl-vsvg');
          icons.forEach(ic => ic.classList.remove('gl-draw'));
          icons.forEach((ic, i) => api.timeout(() => { replay(ic); api.sfx('swoosh'); }, 300 + i * 1100));
        },
      },

      // ---------- e) Group your own way and take photographs ----------
      {
        text: ['Now try grouping your leaves in different ways. Take **photographs** of the groups.'],
        tip: 'Or you could draw a picture of the groups you make.',
        ask: 'Choose how to group the leaves. Drag them into groups, then take a photograph.',
        activity: true,
        scene(stage, api) {
          const box = api.html('<div class="gl-free"><div class="gl-sorthost" style="flex:1;display:flex;min-height:0"></div><div class="gl-album"><span class="gl-album-t">📸 My photographs:</span></div></div>');
          const flash = W.h('div', { class: 'gl-flash' });
          stage.append(flash);
          const host = S.q(box, '.gl-sorthost'), album = S.q(box, '.gl-album');
          const ids = ['birch', 'oak', 'beech', 'maple', 'lime', 'willow', 'grass', 'chestnut'];
          const names = { chestnut: 'horse chestnut' };
          const items = ids.map(id => ({ id, bin: 'x', label: names[id] || id, svg: card(LEAVES[id]()) }));
          const RULES = {
            shape: { label: '🍃 Shape', say: 'Look at the shape of each leaf. Put leaves with the same shape together.', cap: 'by shape' },
            edge: { label: '✂️ Edge', say: 'Look at the edge of each leaf. Is it smooth, toothed or wavy? Put matching leaves together.', cap: 'by edge' },
            veins: { label: '〰️ Veins', say: 'Look at the veins. Put leaves with the same vein pattern together.', cap: 'by veins' },
          };
          let rule = 'shape', game = null, photos = 0;
          const binDef = i => ({ id: 'g' + i, title: `<span class="gl-bname" contenteditable="true" spellcheck="false">Group ${i + 1}</span> ✏️` });
          const hookNames = root => S.qa(root, '.gl-bname').forEach(n => {
            if (n._hooked) return;
            n._hooked = true;
            // Typing a group name must not trigger the page's keyboard shortcuts
            n.addEventListener('keydown', e => { e.stopPropagation(); if (e.key === 'Enter') { e.preventDefault(); n.blur(); } });
            n.addEventListener('pointerdown', e => e.stopPropagation());
          });
          const build = () => {
            host.innerHTML = '';
            game = api.sortGame(host, { bins: [0, 1].map(binDef), items, check: false, sayItem: true });
            S.qa(game.pool, '.sort-card').forEach(c => { const it = items.find(i => i.label === c.textContent.trim()); if (it) c.dataset.gl = it.id; });
            hookNames(game.root);
            Object.values(game.bins).forEach(b => {
              const mo = new MutationObserver(() => api.sfx('pop'));
              mo.observe(S.q(b, '.bin-items'), { childList: true });
              api.onCleanup(() => mo.disconnect());
            });
          };
          // Add one more group box without mixing up the leaves already sorted
          const addGroup = () => {
            const n = Object.keys(game.bins).length;
            if (n >= 3) { api.info('Three groups is plenty!'); return; }
            const d = binDef(n);
            const el = W.h('div', { class: 'sort-bin' }, W.h('h4', { html: d.title }), W.h('div', { class: 'bin-items' }));
            el.dataset.bin = d.id;
            el.classList.add('pop-in');
            const wrap = S.q(game.root, '.sort-bins');
            wrap.append(el);
            wrap.style.gridTemplateColumns = `repeat(${n + 1}, 1fr)`;
            game.bins[d.id] = el;
            hookNames(el);
            api.sfx('pop');
          };
          const snap = async () => {
            const groups = Object.values(game.bins).map(b => ({
              name: (S.q(b, '.gl-bname').textContent || '').trim() || 'Group',
              ids: S.qa(b, '.sort-card').map(c => c.dataset.gl),
            }));
            const placed = groups.reduce((a, g) => a + g.ids.length, 0);
            if (placed < 2) { api.oops('Drag some leaves into your groups first!'); return; }
            api.sfx('shutter');
            flash.classList.remove('go'); void flash.offsetWidth; flash.classList.add('go');
            // Build a little picture of the groups
            const n = groups.length, cw = 300 / n;
            let inner = '';
            groups.forEach((g, gi) => {
              const x0 = gi * cw;
              inner += `<rect x="${f1(x0 + 4)}" y="4" width="${f1(cw - 8)}" height="192" rx="10" fill="#fff" stroke="#C5E1A5" stroke-width="3"/>
                <text x="${f1(x0 + cw / 2)}" y="28" text-anchor="middle" font-size="18" font-weight="800" fill="#3B3F6B">${g.name.replace(/[<>&]/g, '').slice(0, 14)}</text>`;
              const per = n === 3 ? 2 : 3, sz = Math.min(44, (cw - 16) / per);
              g.ids.forEach((id, k) => {
                const cx = x0 + (cw - per * sz) / 2 + (k % per) * sz, cy = 38 + Math.floor(k / per) * sz;
                inner += `<svg x="${f1(cx)}" y="${f1(cy)}" width="${f1(sz)}" height="${f1(sz)}" viewBox="0 0 100 100">${LEAVES[id]()}</svg>`;
              });
            });
            const pol = W.h('div', { class: 'gl-polaroid', html: `<svg viewBox="0 0 300 200">${inner}</svg><div>My leaves ${RULES[rule].cap}</div>` });
            pol.style.transform = `rotate(${f1((Math.random() - .5) * 8)}deg)`;
            album.append(pol);
            album.scrollLeft = album.scrollWidth;
            photos++;
            if (!await api.wait(400)) return;
            api.sfx('magic');
            api.star();
            if (photos === 1) api.praise(`Click! You took a photograph of your leaves grouped ${RULES[rule].cap}. Now try grouping them a different way!`);
            else api.say(`Click! Photograph number ${photos}.`);
          };
          const r1 = api.row();
          api.label('Group by:', r1);
          const ruleBtns = {};
          Object.keys(RULES).forEach(k => {
            ruleBtns[k] = api.button(RULES[k].label, () => {
              rule = k;
              Object.keys(ruleBtns).forEach(j => ruleBtns[j].classList.toggle('gl-on', j === k));
              api.say(RULES[k].say);
            }, { cls: 'small', parent: r1 });
          });
          ruleBtns.shape.classList.add('gl-on');
          api.button('➕ Add a group', addGroup, { cls: 'small', parent: r1, sound: null });
          api.button('↺ Mix up', () => { api.sfx('swoosh'); build(); }, { cls: 'small', parent: r1, sound: null });
          api.button('📷 Take a photograph', snap, { cls: 'primary pulse', parent: r1, sound: null });
          build();
        },
      },
    ],
  });
})();
