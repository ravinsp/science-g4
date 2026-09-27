// Chapter 16: Be a botanist (end of topic activity)
(() => {
  const FONT = "'Baloo 2', 'Comic Sans MS', 'Segoe UI', sans-serif";

  // Drag an SVG node by its translate. (Local helper: keeps pointer capture,
  // because re-appending the node during a drag would lose it.)
  function dragNode(svg, node, api, x, y, { onStart, onMove, onDrop, bounds } = {}) {
    const pos = { x, y };
    let st = null;
    const set = (nx, ny) => { pos.x = nx; pos.y = ny; node.setAttribute('transform', `translate(${S.f1(nx)} ${S.f1(ny)})${pos.extra || ''}`); };
    node.style.cursor = 'grab';
    W.pointerDrag(node, {
      onStart: e => { const p = W.svgPoint(svg, e.clientX, e.clientY); st = { px: p.x, py: p.y, x: pos.x, y: pos.y }; onStart && onStart(pos); },
      onMove: e => {
        if (!st) return;
        const p = W.svgPoint(svg, e.clientX, e.clientY);
        let nx = st.x + p.x - st.px, ny = st.y + p.y - st.py;
        if (bounds) { nx = Math.max(bounds.x1, Math.min(bounds.x2, nx)); ny = Math.max(bounds.y1, Math.min(bounds.y2, ny)); }
        set(nx, ny);
        onMove && onMove(pos);
      },
      onEnd: () => {
        if (!st) return;
        const s0 = st; st = null;
        if (onDrop && onDrop(pos) === false) {
          const fx = pos.x, fy = pos.y;
          api.tween(300, k => set(fx + (s0.x - fx) * k, fy + (s0.y - fy) * k), W.ease.out);
        }
      },
    });
    return { pos, setPos: set };
  }

  // Turn an SVG element into a PNG download (uses only defs inside the svg)
  function savePng(svgEl, fileName, width, api) {
    const vb = svgEl.viewBox.baseVal;
    const height = Math.round(width * vb.height / vb.width);
    const clone = svgEl.cloneNode(true);
    clone.setAttribute('xmlns', S.NS);
    clone.setAttribute('width', width);
    clone.setAttribute('height', height);
    const data = new XMLSerializer().serializeToString(clone);
    const img = new Image();
    img.onload = () => {
      try {
        const c = document.createElement('canvas');
        c.width = width; c.height = height;
        const ctx = c.getContext('2d');
        ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        c.toBlob(b => download(URL.createObjectURL(b), fileName), 'image/png');
      } catch (e) {
        // Fallback: save the picture as an SVG file
        download(URL.createObjectURL(new Blob([data], { type: 'image/svg+xml' })), fileName.replace(/\.png$/, '.svg'));
      }
    };
    img.onerror = () => api.oops('Sorry, the picture could not be saved.');
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(data);
  }
  function download(url, name) {
    const a = document.createElement('a');
    a.href = url; a.download = name;
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }

  // ---------- Plant pieces for pressing and for the herbarium ----------
  // Each returns markup centred near (0,0). pressed = flat and a little faded.
  const fade = (c, p) => p ? S.mix(c, '#C9B48E', .35) : c;
  const PIECES = {
    daisy: p => `<path d="M0 10 Q4 40 0 70" stroke="${fade('#43A047', p)}" stroke-width="3" fill="none"/>
      ${S.leaf({ x: 1, y: 48, angle: -40, L: 22, W: 7, color: fade('#4CAF50', p), stalk: 2 })}
      ${S.flower({ r: p ? 26 : 22, petals: 16, color: fade('#FFFFFF', p), center: fade('#FFC107', p), shape: 'long', outline: fade('#BDBDBD', p) })}`,
    pink: p => `<path d="M0 10 Q-5 40 0 70" stroke="${fade('#43A047', p)}" stroke-width="3" fill="none"/>
      ${S.leaf({ x: -2, y: 44, angle: 210, L: 24, W: 9, color: fade('#4CAF50', p), stalk: 2 })}
      ${S.flower({ r: p ? 27 : 23, petals: 5, color: fade('#F06292', p), center: fade('#FFEB3B', p), shape: 'heart' })}`,
    pansy: p => `<path d="M0 10 Q3 40 -2 70" stroke="${fade('#43A047', p)}" stroke-width="3" fill="none"/>
      ${S.flower({ r: p ? 26 : 22, petals: 5, color: fade('#7E57C2', p), center: fade('#FFEB3B', p), shape: 'wide', rot: 36 })}
      <circle r="${p ? 10 : 8}" fill="${fade('#FFF59D', p)}" opacity=".85"/><circle r="4" fill="${fade('#FFB300', p)}"/>`,
    poppy: p => `<path d="M0 10 Q-3 40 2 70" stroke="${fade('#558B2F', p)}" stroke-width="3" fill="none"/>
      ${S.flower({ r: p ? 27 : 23, petals: 6, color: fade('#FF7043', p), center: fade('#4E342E', p), shape: 'round', layers: 2 })}`,
    fern: p => {
      let m = `<path d="M0 60 Q4 10 -4 -50" stroke="${fade('#33691E', p)}" stroke-width="3" fill="none"/>`;
      for (let i = 0; i < 8; i++) {
        const y = 50 - i * 13, L = 30 - i * 2.6;
        m += S.leaf({ x: 0, y, angle: -20 - i * 2, L, W: 5, color: fade('#558B2F', p), stalk: 1, veins: false })
          + S.leaf({ x: 0, y, angle: 200 + i * 2, L, W: 5, color: fade('#558B2F', p), stalk: 1, veins: false });
      }
      return m;
    },
    leafRed: p => S.leaf({ x: -34, y: 20, angle: -35, L: 64, W: 26, shape: 'toothed', color: fade('#D84315', p), stalk: 10 }),
    leafOrange: p => S.leaf({ x: -34, y: 20, angle: -35, L: 64, W: 26, shape: 'oak', color: fade('#FB8C00', p), stalk: 10 }),
    leafYellow: p => S.leaf({ x: -34, y: 20, angle: -35, L: 62, W: 24, shape: 'heart', color: fade('#FDD835', p), stalk: 10 }),
    leafBrown: p => S.leaf({ x: -34, y: 20, angle: -35, L: 60, W: 22, shape: 'pointed', color: fade('#8D6E63', p), stalk: 10 }),
    dandelion: p => {
      // Whole plant: roots, leaves and a flower
      let m = `<path d="M0 60 L-6 84 M0 60 L4 88 M0 60 L10 80 M-3 72 L-12 78" stroke="${fade('#D7C19C', p)}" stroke-width="2" fill="none"/>
        <path d="M0 60 Q-3 10 2 -52" stroke="${fade('#7CB342', p)}" stroke-width="3" fill="none"/>`;
      [[-150, 34], [-30, 40], [-165, 22], [-15, 26]].forEach(([a, L]) => { m += S.leaf({ x: 0, y: 58, angle: a, L, W: 7, shape: 'toothed', color: fade('#689F38', p), stalk: 1 }); });
      m += `<g transform="translate(2 -52)">${S.flower({ r: p ? 17 : 15, petals: 22, color: fade('#FFD600', p), center: fade('#FFB300', p), shape: 'long', layers: 2 })}</g>`;
      return m;
    },
  };

  function injectStyle() {
    if (document.getElementById('bot-style')) return;
    document.head.insertAdjacentHTML('beforeend', `<style id="bot-style">
      .bot-input { border:3px solid #EADFCB; border-radius:12px; padding:6px 12px; font-weight:700; font-size:17px; width:190px; outline:none; }
      .bot-input:focus { border-color:#3E9B4F; }
    </style>`);
  }

  App.chapter({
    id: 'botanists',
    title: 'Be a botanist',
    icon: '🔬',
    group: 'Be a botanist',
    keywords: [
      { w: 'botanists', d: 'Scientists who study plants.' },
      { w: 'laboratory', d: 'A room where scientists do experiments and tests.' },
      { w: 'herbarium', d: 'A collection of dried, pressed plants kept in a book.' },
    ],
    steps: [
      // ---------- a) Magnifying glass ----------
      {
        text: [
          'Scientists who study plants are called **botanists**.',
          'Some work in a **laboratory**. These botanists are making notes about some plants.',
        ],
        ask: 'Move the magnifying glass over the plant. Can you find 3 tiny details?',
        activity: true,
        scene(stage, api) {
          // Leaves drawn at known places so the hidden details line up
          const leaves = [
            { x: 230, y: 392, a: -22, L: 120, W: 38 }, { x: 230, y: 360, a: 205, L: 118, W: 38 },
            { x: 230, y: 300, a: -35, L: 110, W: 34 }, { x: 230, y: 262, a: 215, L: 104, W: 32 },
            { x: 230, y: 210, a: -50, L: 90, W: 28 }, { x: 230, y: 180, a: 230, L: 84, W: 26 },
            { x: 230, y: 150, a: -90, L: 60, W: 20 },
          ];
          const along = (lf, d) => ({ x: lf.x + Math.cos(lf.a * Math.PI / 180) * d, y: lf.y + Math.sin(lf.a * Math.PI / 180) * d });
          // Fine vein net on leaf 0 (too small to see without the lens)
          let net = '';
          for (let i = 0; i < 14; i++) {
            const px = 30 + i * 6.5;
            net += `M${px} 0 L${px + 5} ${-14 + (i % 3) * 3} M${px} 0 L${px + 5} ${14 - (i % 3) * 3} M${px + 3} -6 L${px + 7} -10 M${px + 3} 6 L${px + 7} 10 `;
          }
          let hairs = '';
          for (let y = 236; y < 336; y += 3) hairs += `M${230 + 3.5} ${y} l3 -1.4 M${230 - 3.5} ${y + 1.5} l-3 -1.4 `;
          const spot = [along(leaves[0], 78), { x: 230, y: 286 }, along(leaves[3], 60)];
          const bug = spot[2];
          const plant = `
            <path d="M230 440 C226 360 236 250 230 130" stroke="#2E7D32" stroke-width="10" fill="none" stroke-linecap="round"/>
            <path d="M230 440 C226 360 236 250 230 130" stroke="#66BB6A" stroke-width="3" fill="none" transform="translate(-2 0)"/>
            ${leaves.map(l => S.leaf({ x: l.x, y: l.y, angle: l.a, L: l.L, W: l.W, color: '#43A047', stalk: 10 })).join('')}
            <path d="${net}" transform="translate(${leaves[0].x} ${leaves[0].y}) rotate(${leaves[0].a})" stroke="#A5D6A7" stroke-width=".6" fill="none"/>
            <path d="${hairs}" stroke="#C8E6C9" stroke-width=".55" fill="none"/>
            <g transform="translate(${S.f1(bug.x)} ${S.f1(bug.y)}) scale(.22)">
              <ellipse cx="0" cy="0" rx="12" ry="10" fill="#E53935" stroke="#222" stroke-width="1.5"/>
              <path d="M0 -10 L0 10" stroke="#222" stroke-width="1.5"/>
              <circle cx="-5" cy="-3" r="2.5" fill="#222"/><circle cx="5" cy="2" r="2.5" fill="#222"/><circle cx="-4" cy="5" r="2" fill="#222"/><circle cx="5" cy="-5" r="2" fill="#222"/>
              <circle cx="12" cy="0" r="5" fill="#222"/><circle cx="14" cy="-2" r="1.2" fill="#fff"/>
              <path d="M14 -4 l5 -5 M14 3 l5 5" stroke="#222" stroke-width="1"/>
            </g>`;
          const bg = `
            <rect width="520" height="520" fill="#E3F2EC"/>
            <rect x="0" y="0" width="520" height="80" fill="#D0E9DF"/>
            <rect x="0" y="80" width="520" height="8" fill="#B8D8CB"/>
            ${S.beaker({ x: 330, y: 78, w: 34, h: 44, level: .6, liquid: '#A5D6A7' })}
            ${S.beaker({ x: 380, y: 78, w: 30, h: 36, level: .5, liquid: '#F8BBD0' })}
            ${S.beaker({ x: 430, y: 78, w: 38, h: 50, level: .7, liquid: '#B3E5FC' })}
            <rect x="0" y="440" width="520" height="80" fill="#B0BEC5"/><rect x="0" y="436" width="520" height="8" fill="#90A4AE"/>
            <path d="M190 440 L200 500 L260 500 L270 440Z" fill="url(#bot-potg)" stroke="#9A4520" stroke-width="2"/>
            <rect x="182" y="432" width="96" height="14" rx="4" fill="#D9743C" stroke="#9A4520" stroke-width="2"/>`;
          const Z = 3, R = 64;
          const svg = api.svg(`
            <defs>
              <linearGradient id="bot-potg" x1="0" x2="1"><stop offset="0" stop-color="#C8612F"/><stop offset=".5" stop-color="#E4834A"/><stop offset="1" stop-color="#B5532A"/></linearGradient>
              <clipPath id="bot-lens"><circle r="${R}"/></clipPath>
            </defs>
            <g id="bot-world">${bg}${plant}</g>
            <!-- notebook -->
            <rect x="520" y="0" width="280" height="520" fill="#FFF8EC"/>
            <g transform="translate(540 26)">
              <rect x="6" y="6" width="236" height="300" rx="10" fill="#000" opacity=".12"/>
              <rect width="236" height="300" rx="10" fill="#FFFDF4" stroke="#8D6E63" stroke-width="3"/>
              ${[...Array(9)].map((_, i) => `<path d="M16 ${70 + i * 26} L222 ${70 + i * 26}" stroke="#B3D4F0" stroke-width="1.5"/>`).join('')}
              <path d="M34 10 L34 290" stroke="#F4A6A6" stroke-width="1.5"/>
              ${[...Array(7)].map((_, i) => `<circle cx="0" cy="${26 + i * 42}" r="6" fill="#fff" stroke="#8D6E63" stroke-width="2.5"/>`).join('')}
              <text x="128" y="44" text-anchor="middle" font-size="22" font-weight="800" fill="#5D4037" font-family="${FONT}">My plant notes</text>
              <g id="bot-notes"></g>
            </g>
            ${S.kid({ x: 700, y: 505, s: .82, skin: '#8D5524', hair: '#3B2314', shirt: '#26A69A' })}
            <g transform="translate(622 405) rotate(-12)"><rect width="34" height="44" rx="3" fill="#FFFDF4" stroke="#8D6E63" stroke-width="2"/><path d="M6 12 h22 M6 20 h22 M6 28 h16" stroke="#B3D4F0" stroke-width="2"/></g>
            <g id="bot-found"></g>
            <g id="bot-lensG" transform="translate(410 220)">
              <circle r="${R + 3}" fill="#fff"/>
              <g clip-path="url(#bot-lens)"><g id="bot-zoom"></g></g>
              <circle r="${R}" fill="#E3F2FD" fill-opacity=".12" stroke="#455A64" stroke-width="9"/>
              <path d="M${-R * .6} ${-R * .35} A${R * .7} ${R * .7} 0 0 1 ${-R * .2} ${-R * .65}" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".8"/>
              <path d="M${R * .72} ${R * .72} L${R * 1.45} ${R * 1.45}" stroke="#6D4C41" stroke-width="16" stroke-linecap="round"/>
            </g>
            <g class="blink-hint" id="bot-hint">${S.text(410, 330, '👆 Drag me!', { size: 20, fill: '#9A3222' })}</g>
          `);
          const zoom = S.q(svg, '#bot-zoom');
          zoom.innerHTML = bg + plant;
          const lens = S.q(svg, '#bot-lensG');
          const finds = [
            { note: 'Leaves have veins in a pattern.', say: 'Look! The leaf has lots of tiny veins in a pattern.', icon: '🍃' },
            { note: 'The stem has tiny hairs.', say: 'The stem is covered in tiny hairs!', icon: '🌱' },
            { note: 'A tiny ladybird lives here!', say: 'A tiny ladybird is hiding on this leaf!', icon: '🐞' },
          ];
          const found = new Set();
          const upd = pos => {
            zoom.setAttribute('transform', `scale(${Z}) translate(${S.f1(-pos.x)} ${S.f1(-pos.y)})`);
            spot.forEach((s, i) => {
              if (found.has(i) || Math.hypot(s.x - pos.x, s.y - pos.y) > 30) return;
              found.add(i);
              api.sfx('magic');
              api.say(finds[i].say);
              S.q(svg, '#bot-notes').insertAdjacentHTML('beforeend', `<g class="pop-in">
                <text x="44" y="${92 + found.size * 62 - 62}" font-size="18" font-weight="700" fill="#1A3A8A" font-family="${FONT}">${found.size}. ${finds[i].note.split(' ').slice(0, 3).join(' ')}</text>
                <text x="44" y="${92 + found.size * 62 - 36}" font-size="18" font-weight="700" fill="#1A3A8A" font-family="${FONT}">${finds[i].note.split(' ').slice(3).join(' ')} ${finds[i].icon}</text></g>`);
              S.q(svg, '#bot-found').insertAdjacentHTML('beforeend', `<circle class="pop-in" cx="${S.f1(s.x)}" cy="${S.f1(s.y)}" r="9" fill="none" stroke="#FFC93C" stroke-width="3"/>`);
              api.timeout(() => api.sfx('page'), 500);
              if (found.size === 3) {
                api.star();
                api.timeout(() => api.praise('You found 3 details and made notes, just like a real botanist!'), 2600);
              }
            });
          };
          upd({ x: 410, y: 220 });
          dragNode(svg, lens, api, 410, 220, {
            bounds: { x1: 40, y1: 60, x2: 480, y2: 470 },
            onStart: () => { api.sfx('pick'); const h = S.q(svg, '#bot-hint'); if (h) h.remove(); },
            onMove: upd,
            onDrop: () => { api.sfx('drop'); return true; },
          });
        },
      },

      // ---------- b) Pressing flowers ----------
      {
        text: [
          'Before we had cameras, botanists drew or painted the plants, leaves and flowers that they found.',
          'This very old book of real plants is called a **herbarium**.',
          'You can press flowers to keep them. Put your plants in between two sheets of paper, then place them between two heavy books.',
        ],
        ask: 'Click the plants to put them on the paper. Then press them!',
        activity: true,
        scene(stage, api) {
          const items = [
            { k: 'daisy', x: 80, y: 190, s: .8 }, { k: 'pink', x: 170, y: 190, s: .8 },
            { k: 'leafRed', x: 88, y: 330, s: .8 }, { k: 'fern', x: 170, y: 330, s: .7 },
          ];
          const spots = [{ x: 370, y: 210 }, { x: 510, y: 210 }, { x: 370, y: 350 }, { x: 510, y: 350 }];
          const wood = [...Array(9)].map((_, i) => `<path d="M0 ${30 + i * 60} Q400 ${20 + i * 60} 800 ${34 + i * 60}" stroke="#B9824F" stroke-width="3" fill="none" opacity=".45"/>`).join('');
          const svg = api.svg(`
            <rect width="800" height="520" fill="#D9A066"/>${wood}
            <!-- tray -->
            <rect x="24" y="110" width="210" height="300" rx="18" fill="#8BC34A" opacity=".35" stroke="#689F38" stroke-width="3" stroke-dasharray="10 7"/>
            ${S.text(129, 100, 'Plants I found', { size: 19, fill: '#4E342E' })}
            <!-- paper -->
            <g id="bot-paper1"><rect x="292" y="112" width="296" height="316" fill="#000" opacity=".12" transform="translate(6 6)"/><rect x="292" y="112" width="296" height="316" fill="#FFFDF7" stroke="#D7CCB8" stroke-width="2"/></g>
            <g id="bot-items">${items.map((it, i) => `<g class="hot bot-it" data-i="${i}" transform="translate(${it.x} ${it.y}) scale(${it.s})"><g class="sway" style="animation-delay:${i * .4}s">${PIECES[it.k](false)}</g></g>`).join('')}</g>
            <g id="bot-paper2" transform="translate(0 -560)"><rect x="296" y="108" width="296" height="316" fill="#FFFDF7" stroke="#D7CCB8" stroke-width="2"/><path d="M296 108 L592 108" stroke="#fff" stroke-width="3"/></g>
            <g id="bot-books"></g>
            <!-- window and calendar -->
            <g transform="translate(620 40)">
              <rect width="160" height="120" rx="8" fill="#BFE6FF" stroke="#fff" stroke-width="8"/>
              <clipPath id="bot-win"><rect width="160" height="120" rx="8"/></clipPath>
              <g clip-path="url(#bot-win)"><rect id="bot-sky" width="160" height="120" fill="#BFE6FF"/><g id="bot-sun" transform="translate(80 40)"><circle r="18" fill="#FFD43B"/></g><g id="bot-moon" transform="translate(80 160)"><circle r="14" fill="#FFF9C4"/><circle cx="6" cy="-4" r="12" fill="#1A237E" class="bot-moonbite"/></g></g>
              <path d="M80 0 L80 120 M0 60 L160 60" stroke="#fff" stroke-width="5"/>
            </g>
            <g transform="translate(640 200)">
              <rect width="120" height="130" rx="10" fill="#fff" stroke="#C8452F" stroke-width="3"/>
              <rect width="120" height="34" rx="10" fill="#C8452F"/><rect y="24" width="120" height="10" fill="#C8452F"/>
              ${S.text(60, 24, 'Days', { size: 18, fill: '#fff' })}
              <text id="bot-day" x="60" y="104" text-anchor="middle" font-size="54" font-weight="800" fill="#2B2A28">0</text>
            </g>
            <g id="bot-msg"></g>
          `);
          const itEls = S.qa(svg, '.bot-it');
          const placed = [];
          let phase = 'pick', days = 0, busy = false;
          const setMsg = t => { S.q(svg, '#bot-msg').innerHTML = t ? `<g class="pop-in"><rect x="250" y="460" width="380" height="44" rx="22" fill="#fff" stroke="#3B3F6B" stroke-width="2.5"/>${S.text(440, 489, t, { size: 18, fill: '#3B3F6B' })}</g>` : ''; };
          setMsg('👆 Click a plant to put it on the paper');

          itEls.forEach(g => g.addEventListener('click', async () => {
            if (phase !== 'pick' || g.dataset.done) return;
            g.dataset.done = 1;
            g.classList.remove('hot');
            const it = items[+g.dataset.i], sp = spots[placed.length];
            placed.push({ it, sp, g });
            api.sfx('pick');
            await api.tween(600, k => {
              const x = it.x + (sp.x - it.x) * k, y = it.y + (sp.y - it.y) * k - Math.sin(k * Math.PI) * 60;
              g.setAttribute('transform', `translate(${S.f1(x)} ${S.f1(y)}) scale(${S.f1(it.s + (.9 - it.s) * k)})`);
            }, W.ease.inOut);
            if (!api.alive()) return;
            api.sfx('drop');
            S.q(g, '.sway').classList.remove('sway');
            if (placed.length === 1) coverBtn.disabled = false;
            if (placed.length === items.length) api.say('All the plants are on the paper. Now cover them with another sheet.');
          }));

          const books = async () => {
            const bg = S.q(svg, '#bot-books');
            const book = (y, col, title) => `<g class="bot-book" transform="translate(0 -600)">
              <rect x="276" y="${y}" width="328" height="70" rx="6" fill="${col}" stroke="${S.mix(col, '#000', .3)}" stroke-width="3"/>
              <rect x="276" y="${y + 56}" width="328" height="14" fill="#FFF8E1" stroke="${S.mix(col, '#000', .3)}" stroke-width="2"/>
              <rect x="300" y="${y + 14}" width="8" height="42" fill="#FFD54F"/><rect x="572" y="${y + 14}" width="8" height="42" fill="#FFD54F"/>
              <text x="440" y="${y + 42}" text-anchor="middle" font-size="22" font-weight="800" fill="#FFF8E1" font-family="${FONT}">${title}</text></g>`;
            bg.innerHTML = book(290, '#5C6BC0', 'BIG BOOK OF TREES') + book(214, '#C62828', 'ENCYCLOPEDIA');
            const els = S.qa(bg, '.bot-book');
            for (const el of els) {
              await api.tween(650, k => el.setAttribute('transform', `translate(0 ${S.f1(-600 * (1 - k))})`), W.ease.bounce);
              if (!api.alive()) return;
              api.sfx('thud');
              api.tween(250, (k, raw) => svg.setAttribute('transform', `translate(0 ${S.f1(Math.sin(raw * Math.PI * 3) * 3 * (1 - raw))})`), W.ease.linear);
            }
          };

          const coverBtn = api.button('📄 Add paper', async () => {
            if (busy || phase !== 'pick') return;
            busy = true; phase = 'cover'; coverBtn.disabled = true;
            itEls.forEach(g => { if (!g.dataset.done) g.style.opacity = .35; });
            api.sfx('swoosh');
            const p2 = S.q(svg, '#bot-paper2');
            await api.tween(700, k => p2.setAttribute('transform', `translate(0 ${S.f1(-560 * (1 - k))})`), W.ease.out);
            if (!api.alive()) return;
            api.say('Now put two heavy books on top.');
            busy = false;
            bookBtn.disabled = false;
          }, { cls: 'primary', sound: null });
          coverBtn.disabled = true;
          const bookBtn = api.button('📚 Add books', async () => {
            if (busy || phase !== 'cover') return;
            busy = true; phase = 'books'; bookBtn.disabled = true;
            await books();
            if (!api.alive()) return;
            setMsg('Now wait for the plants to dry');
            api.say('Plants need time to dry fully, or they will not keep well. Wait some days.');
            busy = false;
            waitBtn.disabled = false; openBtn.disabled = false;
          }, { cls: 'primary', sound: 'whoosh' });
          bookBtn.disabled = true;
          const waitBtn = api.button('⏩ Wait 3 days', async () => {
            if (busy || phase !== 'books') return;
            busy = true; waitBtn.disabled = true;
            const sun = S.q(svg, '#bot-sun'), moon = S.q(svg, '#bot-moon'), sky = S.q(svg, '#bot-sky');
            const from = days;
            api.sfx('tick');
            await api.tween(2400, (k, raw) => {
              const d = raw * 3;             // three days per click
              const f = d % 1;               // time of day
              const day = f < .5;
              sun.setAttribute('transform', `translate(${S.f1(10 + f * 2 * 140)} ${S.f1(day ? 70 - Math.sin(f * 2 * Math.PI) * 45 : 200)})`);
              moon.setAttribute('transform', `translate(${S.f1(10 + (f - .5) * 2 * 140)} ${S.f1(!day ? 70 - Math.sin((f - .5) * 2 * Math.PI) * 45 : 200)})`);
              sky.setAttribute('fill', day ? '#BFE6FF' : '#1A237E');
              const nd = from + Math.floor(d);
              if (nd !== days) { days = nd; S.q(svg, '#bot-day').textContent = days; api.sfx('page'); }
            }, W.ease.linear);
            if (!api.alive()) return;
            days = from + 3;
            S.q(svg, '#bot-day').textContent = days;
            sky.setAttribute('fill', '#BFE6FF');
            sun.setAttribute('transform', 'translate(80 40)');
            busy = false; waitBtn.disabled = false;
            if (days >= 9) { setMsg('The plants are dry now!'); api.say(`${days} days have passed. The plants should be dry now. Open the books!`); }
            else api.say(`${days} days.`);
          }, { cls: 'primary pulse', sound: null });
          waitBtn.disabled = true;
          const openBtn = api.button('📖 Open', async () => {
            if (busy || phase !== 'books') return;
            if (days < 9) {
              api.oops('Not yet! Plants need time to dry fully, or they will not keep well. Wait some more.');
              return;
            }
            busy = true; phase = 'open';
            waitBtn.disabled = openBtn.disabled = true;
            api.sfx('whoosh');
            const bg = S.q(svg, '#bot-books'), p2 = S.q(svg, '#bot-paper2');
            await api.tween(800, k => bg.setAttribute('transform', `translate(${S.f1(k * 760)} ${S.f1(-k * 80)}) rotate(${S.f1(k * 20)} 440 300)`), W.ease.inOut);
            api.sfx('swoosh');
            await api.tween(700, k => p2.setAttribute('transform', `translate(${S.f1(-k * 700)} 0)`), W.ease.inOut);
            if (!api.alive()) return;
            // Swap in the flat, dried versions
            placed.forEach(({ it, sp, g }, i) => {
              g.innerHTML = `<g class="pop-in" style="animation-delay:${i * .15}s">${PIECES[it.k](true)}</g>`;
              g.setAttribute('transform', `translate(${sp.x} ${sp.y}) scale(.95) rotate(${(i % 2 ? 1 : -1) * 8})`);
            });
            api.sfx('magic');
            setMsg('Pressed plants: flat and dry!');
            api.star();
            api.praise('Your plants are pressed. They are flat and dry, and the colours have faded a little.');
          }, { sound: 'click' });
          openBtn.disabled = true;
          api.button('↺', () => App.go(App.chapters.indexOf(api.chapter), App.chapters[App.chapters.indexOf(api.chapter)].steps.indexOf(api.step)), { cls: 'small' });
        },
      },

      // ---------- c) Make a herbarium page ----------
      {
        text: [
          'You can use whole plants, or parts of plants, or changing plants.',
          'You can then put them into a book or make them into a picture.',
        ],
        ask: 'Drag pressed plants onto the page. Write a label, then save your picture!',
        tip: 'Leaves change colour in autumn. They make a beautiful picture!',
        activity: true,
        scene(stage, api) {
          injectStyle();
          const pal = [
            { k: 'dandelion', name: 'whole dandelion' }, { k: 'daisy', name: 'daisy' },
            { k: 'pansy', name: 'pansy' }, { k: 'poppy', name: 'poppy' },
            { k: 'fern', name: 'fern' }, { k: 'leafRed', name: 'red leaf' },
            { k: 'leafOrange', name: 'orange leaf' }, { k: 'leafYellow', name: 'yellow leaf' },
            { k: 'leafBrown', name: 'brown leaf' }, { k: 'pink', name: 'pink flower' },
          ];
          const PX = 262, PY = 12, PW = 526, PH = 496;
          const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
          const svg = api.svg(`
            <defs>
              <linearGradient id="bot-paperg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stop-color="#F6E7C1"/><stop offset=".5" stop-color="#F1DDB0"/><stop offset="1" stop-color="#E3C48F"/>
              </linearGradient>
              <radialGradient id="bot-vig" cx=".5" cy=".5" r=".75">
                <stop offset=".6" stop-color="#8D6E3F" stop-opacity="0"/><stop offset="1" stop-color="#8D6E3F" stop-opacity=".35"/>
              </radialGradient>
            </defs>
            <g id="bot-ui">
              <rect width="800" height="520" fill="#D9A066"/>
              <rect x="8" y="8" width="240" height="504" rx="16" fill="#FFF8EC" stroke="#E7A07F" stroke-width="3"/>
              ${S.text(128, 36, 'Pressed plants', { size: 20, fill: '#9A3222' })}
              ${pal.map((p, i) => `<g class="hot bot-pal" data-i="${i}" transform="translate(${70 + (i % 2) * 116} ${88 + Math.floor(i / 2) * 92})">
                <rect x="-50" y="-42" width="100" height="84" rx="12" fill="#fff" stroke="#EADFCB" stroke-width="2"/>
                <g transform="scale(${p.k === 'dandelion' || p.k === 'fern' ? .5 : .62})">${PIECES[p.k](true)}</g></g>`).join('')}
            </g>
            <g id="bot-page">
              <rect x="${PX + 5}" y="${PY + 6}" width="${PW}" height="${PH}" rx="6" fill="#000" opacity=".2"/>
              <rect x="${PX}" y="${PY}" width="${PW}" height="${PH}" rx="6" fill="url(#bot-paperg)" stroke="#B08A55" stroke-width="2"/>
              <rect x="${PX}" y="${PY}" width="${PW}" height="${PH}" rx="6" fill="url(#bot-vig)"/>
              <rect x="${PX + 16}" y="${PY + 16}" width="${PW - 32}" height="${PH - 32}" fill="none" stroke="#B08A55" stroke-width="1.5" stroke-dasharray="2 5"/>
              <text x="${PX + PW / 2}" y="${PY + 50}" text-anchor="middle" font-size="26" font-weight="800" fill="#6D4C1E" font-family="${FONT}">Herbarium</text>
              <g id="bot-placed"></g>
              <g transform="translate(${PX + PW - 250} ${PY + PH - 96})">
                <rect width="222" height="74" fill="#FFFDF4" stroke="#6D4C1E" stroke-width="2"/>
                <path d="M8 44 L214 44" stroke="#C9B48E" stroke-width="1"/>
                <text id="bot-label" x="111" y="34" text-anchor="middle" font-size="19" font-weight="800" fill="#3E2A10" font-family="${FONT}"></text>
                <text x="111" y="64" text-anchor="middle" font-size="16" font-weight="600" fill="#6D4C1E" font-family="${FONT}">${today}</text>
              </g>
            </g>
            <g id="bot-empty" pointer-events="none">${S.text(PX + PW / 2, 270, '👈 Drag plants here', { size: 24, fill: '#9C7B4A' })}</g>
          `);
          const layer = S.q(svg, '#bot-placed');
          const inPage = p => p.x > PX + 10 && p.x < PX + PW - 10 && p.y > PY + 10 && p.y < PY + PH - 10;
          let count = 0;
          const refresh = () => {
            count = layer.children.length;
            S.q(svg, '#bot-empty').setAttribute('opacity', count ? 0 : 1);
            if (count >= 3) {
              if (!api._botStar) {
                api._botStar = true;
                api.star();
                api.praise('What a lovely herbarium page! Now write a label and save it.');
              }
            }
          };
          // Make a placed plant movable; dragging it off the page removes it
          const makeMovable = (node, x, y, rot) => {
            const d = dragNode(svg, node, api, x, y, {
              onStart: () => api.sfx('pick'),
              onDrop: pos => {
                if (!inPage(pos)) { api.sfx('swoosh'); node.remove(); refresh(); return true; }
                api.sfx('drop');
                return true;
              },
            });
            d.pos.extra = ` rotate(${rot})`;
            d.setPos(x, y);
          };
          S.qa(svg, '.bot-pal').forEach(g => {
            const p = pal[+g.dataset.i];
            let node = null, off = null, rot = 0, pos = null;
            W.pointerDrag(g, {
              onStart: e => {
                const pt = W.svgPoint(svg, e.clientX, e.clientY);
                rot = Math.round((Math.random() - .5) * 30);
                node = S.frag(`<g class="bot-pl" transform="translate(${S.f1(pt.x)} ${S.f1(pt.y)}) rotate(${rot})">${PIECES[p.k](true)}</g>`);
                layer.appendChild(node);
                pos = { x: pt.x, y: pt.y };
                api.sfx('pick');
                api.say(p.name);
              },
              onMove: e => {
                if (!node) return;
                const pt = W.svgPoint(svg, e.clientX, e.clientY);
                pos = { x: pt.x, y: pt.y };
                node.setAttribute('transform', `translate(${S.f1(pt.x)} ${S.f1(pt.y)}) rotate(${rot})`);
              },
              onEnd: () => {
                if (!node) return;
                if (inPage(pos)) {
                  api.sfx('drop');
                  makeMovable(node, pos.x, pos.y, rot);
                } else {
                  node.remove();
                  api.sfx('swoosh');
                }
                node = null;
                refresh();
              },
            });
          });

          // Label input
          const labelEl = S.q(svg, '#bot-label');
          const def = api.name ? `${api.name}'s herbarium` : 'My herbarium';
          const row = api.row();
          api.label('✏️ Label:', row);
          const input = W.h('input', { class: 'bot-input', maxlength: 26, value: def });
          row.append(input);
          const setLabel = () => { labelEl.textContent = input.value || ' '; };
          input.addEventListener('input', () => { setLabel(); if (Math.random() < .5) api.sfx('tick'); });
          setLabel();
          api.button('💾 Save my picture', () => {
            if (!count) { api.oops('Put some plants on the page first!'); return; }
            // Export only the page, with this svg's own gradients
            const out = svg.cloneNode(true);
            out.querySelector('#bot-ui').remove();
            out.querySelector('#bot-empty').remove();
            out.setAttribute('viewBox', `${PX - 4} ${PY - 4} ${PW + 14} ${PH + 14}`);
            out.querySelectorAll('.pop-in, .sway').forEach(n => n.removeAttribute('class'));
            document.body.append(out);   // needs to be in the page for viewBox.baseVal
            savePng(out, (input.value || 'herbarium').replace(/[^\w' -]+/g, '').trim().replace(/\s+/g, '-') + '.png', 1200, api);
            out.remove();
            api.sfx('shutter');
            api.praise('Your picture is saved!');
            api.star();
          }, { cls: 'primary', parent: row, sound: null });
          api.button('🗑 Clear', () => { layer.innerHTML = ''; api.sfx('swoosh'); refresh(); }, { cls: 'small', parent: row });
        },
      },
    ],
  });
})();
