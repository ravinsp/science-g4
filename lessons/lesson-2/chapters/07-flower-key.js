// Chapter 7: Flower key
(() => {
  // ---------- Styles for this chapter ----------
  if (!document.getElementById('fk-style')) {
    const st = document.createElement('style');
    st.id = 'fk-style';
    st.textContent = `
      .fk-plank.fk-on .fk-board { stroke: #FF8F00; stroke-width: 4; }
      .fk-plank.fk-on { animation: fk-glow 1.1s ease-in-out infinite; }
      @keyframes fk-glow { 50% { filter: drop-shadow(0 0 8px #FFC107); } }
      .fk-leaf.fk-got .fk-lbox { fill: #FFE56B; stroke: #E65100; stroke-width: 3; }
      .fk-pick { cursor: pointer; }
      .fk-pick:hover { filter: drop-shadow(0 0 8px rgba(255,200,60,.95)); }
      .fk-q { font-size: 19px; color: #9A3222 !important; text-align: center; }
      .btn.fk-big { font-size: 21px; padding: 8px 26px; }
      .fk-sort .sort-card { width: 150px; font-size: 15px; padding: 6px; }
      .fk-sort .sort-card svg { height: 40px; }
      .fk-sort .sort-bin h4 { font-size: 20px; }
      .fk-sort .bin-items .sort-card { width: 128px; font-size: 14px; }
      .fk-sort .bin-items .sort-card svg { display: none; }
      .fk-sort .sort-items:empty { display: none; }
      .fk-chip { cursor: pointer; }
      .fk-chip:hover rect { stroke: #3E9B4F; stroke-width: 3.5; }
      .fk-petal { cursor: pointer; transition: filter .2s; }
      .fk-petal:hover { filter: brightness(1.12); }
    `;
    document.head.append(st);
  }

  // Shared gradients (ids are document-wide, so they carry the fk- prefix)
  const DEFS = `<defs>
    <linearGradient id="fk-wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F8DDBA"/><stop offset="1" stop-color="#E7B587"/></linearGradient>
    <radialGradient id="fk-hib" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="54"><stop offset="0" stop-color="#AD1457"/><stop offset=".3" stop-color="#EC407A"/><stop offset="1" stop-color="#F8A5C2"/></radialGradient>
    <radialGradient id="fk-hyd" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="50"><stop offset="0" stop-color="#F3E5F5"/><stop offset=".45" stop-color="#E1A6EA"/><stop offset="1" stop-color="#C77DD6"/></radialGradient>
    <radialGradient id="fk-fra" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="50"><stop offset="0" stop-color="#FF8F00"/><stop offset=".3" stop-color="#FFC400"/><stop offset="1" stop-color="#FFF176"/></radialGradient>
    <radialGradient id="fk-cos" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="200"><stop offset="0" stop-color="#C2185B"/><stop offset=".3" stop-color="#E75BA8"/><stop offset="1" stop-color="#F7A8D8"/></radialGradient>
  </defs>`;

  // Repeat one petal path around the centre
  const ring = (n, d, fill, stroke, rot = 0, sw = 1.5) => {
    let s = '';
    for (let i = 0; i < n; i++) s += `<path d="${d}" transform="rotate(${S.f1(rot + i * 360 / n)})" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"/>`;
    return s;
  };

  // The six flowers from the book, drawn about 52 units across from the centre
  const DRAW = {
    lily() {
      const p = 'M0 0 C-13 -12 -13 -36 0 -53 C13 -36 13 -12 0 0Z';
      let s = ring(3, p, '#FFA000', '#E07B00', 0) + ring(3, p, '#FFC107', '#E08A00', 60);
      for (let i = 0; i < 6; i++) s += `<path d="M0 -8 L0 -42" transform="rotate(${i * 60})" stroke="#F57C00" stroke-width="2" opacity=".55"/>`;
      s += ring(6, 'M0 0 L-3 -11 L0 -16 L3 -11Z', '#7CB342', '#558B2F', 0, 1);
      for (let i = 0; i < 6; i++) s += `<g transform="rotate(${i * 60 + 30})"><path d="M0 0 L0 -25" stroke="#9CCC65" stroke-width="1.8"/><ellipse cx="0" cy="-27" rx="2.2" ry="4.5" fill="#BF360C"/></g>`;
      return s;
    },
    vinca() {
      const p = 'M0 -5 C-3 -14 -17 -30 -14 -42 C-11 -53 11 -53 14 -42 C17 -30 3 -14 0 -5Z';
      let s = ring(5, p, '#EC407A', '#C2185B', 0);
      for (let i = 0; i < 5; i++) s += `<path d="M0 -10 L0 -40" transform="rotate(${i * 72})" stroke="#F8BBD0" stroke-width="2" opacity=".6"/>`;
      return s + `<circle r="9" fill="#F48FB1"/><circle r="5" fill="#D50000"/>`;
    },
    hibiscus() {
      const p = 'M0 0 C-30 -8 -36 -44 -12 -53 C0 -57 14 -55 22 -47 C35 -31 24 -8 0 0Z';
      let s = ring(5, p, 'url(#fk-hib)', '#D81B60', 0);
      for (let i = 0; i < 5; i++) s += `<path d="M0 0 L-4 -34 M0 0 L8 -30" transform="rotate(${i * 72})" stroke="#AD1457" stroke-width="1.3" opacity=".5"/>`;
      s += `<circle r="9" fill="#880E4F" opacity=".7"/>
        <path d="M0 0 C6 -14 14 -30 24 -44" stroke="#F8BBD0" stroke-width="4.5" stroke-linecap="round" fill="none"/>
        ${[.45, .6, .75].map(t => `<circle cx="${S.f1(24 * t + 2)}" cy="${S.f1(-44 * t)}" r="2.6" fill="#FFD54F"/>`).join('')}
        ${[0, 1, 2, 3, 4].map(i => `<circle cx="${S.f1(24 + Math.cos(i * 1.26) * 4.5)}" cy="${S.f1(-46 + Math.sin(i * 1.26) * 4.5)}" r="2.6" fill="#C62828"/>`).join('')}`;
      return s;
    },
    hydrangea() {
      const p = 'M0 -3 C-24 -10 -31 -35 -16 -46 C-6 -52 6 -52 16 -46 C31 -35 24 -10 0 -3Z';
      let s = ring(4, p, 'url(#fk-hyd)', '#AB47BC', 45);
      for (let i = 0; i < 4; i++) s += `<path d="M0 -6 L0 -38" transform="rotate(${45 + i * 90})" stroke="#BA68C8" stroke-width="1.5" opacity=".6"/>`;
      return s + `<circle r="6" fill="#F3E5F5" stroke="#AB47BC"/><circle r="2.5" fill="#7E57C2"/>`;
    },
    frangipani() {
      const p = 'M0 0 C-21 -4 -31 -30 -19 -46 C-9 -57 13 -53 15 -40 C17 -24 8 -8 0 0Z';
      let s = ring(5, p, 'url(#fk-fra)', '#E0A800', 0);
      return s + `<circle r="4" fill="#E65100"/>`;
    },
    aster() {
      const p = 'M0 -8 C-3.5 -20 -3.5 -45 0 -53 C3.5 -45 3.5 -20 0 -8Z';
      let s = ring(28, p, '#7E57C2', '#5E35B1', 0, 1) + ring(28, 'M0 -8 C-3 -18 -3 -38 0 -44 C3 -38 3 -18 0 -8Z', '#9575CD', '#673AB7', 6.4, 1);
      s += `<circle r="14" fill="#FF9800" stroke="#E65100" stroke-width="1.5"/>`;
      for (let i = 0; i < 26; i++) {
        const a = i * 137.5 * Math.PI / 180, d = Math.sqrt(i / 26) * 11;
        s += `<circle cx="${S.f1(Math.cos(a) * d)}" cy="${S.f1(Math.sin(a) * d)}" r="1.5" fill="${i % 2 ? '#FFCA28' : '#E65100'}"/>`;
      }
      return s;
    },
  };
  const flowerAt = (id, x, y, s = 1, extra = '') => `<g transform="translate(${S.f1(x)} ${S.f1(y)}) scale(${s})" ${extra}>${DRAW[id]()}</g>`;

  // Facts used by the key
  const FLOWERS = [
    { id: 'lily', five: false, four: false, yellow: true },
    { id: 'vinca', five: true, pink: true, spaces: true },
    { id: 'hibiscus', five: true, pink: true, spaces: false },
    { id: 'hydrangea', five: false, four: true },
    { id: 'frangipani', five: true, pink: false },
    { id: 'aster', five: false, four: false, yellow: false },
  ];
  const NODES = {
    q1: { q: 'Does it have five petals?', key: 'five', yes: 'q2', no: 'q4', hint: 'Count the petals again.' },
    q2: { q: 'Are the petals pink?', key: 'pink', yes: 'q3', no: 'frangipani', hint: 'Look at the colour of the petals again.' },
    q3: { q: 'Are there big spaces between the petals?', key: 'spaces', yes: 'vinca', no: 'hibiscus', hint: 'Look at the gaps between the petals again.' },
    q4: { q: 'Does it have four petals?', key: 'four', yes: 'hydrangea', no: 'q5', hint: 'Count the petals again.' },
    q5: { q: 'Are the petals yellow?', key: 'yellow', yes: 'lily', no: 'aster', hint: 'Look at the colour of the petals again.' },
  };

  // Where each piece of the lolly-stick tree sits
  const PLANK = {
    q1: { x: 430, y: 128, w: 280, h: 34, lines: ['Does it have five petals?'] },
    q2: { x: 245, y: 208, w: 270, h: 34, lines: ['Are the petals pink?'] },
    q4: { x: 615, y: 208, w: 270, h: 34, lines: ['Does it have four petals?'] },
    q3: { x: 150, y: 290, w: 270, h: 50, lines: ['Are there big spaces', 'between the petals?'] },
    q5: { x: 675, y: 290, w: 222, h: 34, lines: ['Are the petals yellow?'] },
  };
  const LEAF = {
    vinca: { x: 55, y: 392 }, hibiscus: { x: 255, y: 392 }, frangipani: { x: 350, y: 300 },
    hydrangea: { x: 505, y: 300 }, lily: { x: 590, y: 392 }, aster: { x: 750, y: 392 },
  };
  // Leg x positions for each question
  const LEGX = { q1: [330, 530], q2: [140, 350], q4: [505, 740], q3: [45, 255], q5: [590, 760] };
  const topOf = id => PLANK[id] ? PLANK[id].y - PLANK[id].h / 2 : LEAF[id].y - 17 - 10;

  function legs() {
    const out = [];
    Object.keys(LEGX).forEach(q => {
      const p = PLANK[q];
      ['yes', 'no'].forEach((ans, i) => {
        const to = NODES[q][ans];
        out.push({ id: `${q}-${ans}`, q, ans, to, x: LEGX[q][i], y1: p.y + p.h / 2 - 4, y2: topOf(to) + (PLANK[to] ? 4 : 0), leaf: !PLANK[to] });
      });
    });
    return out;
  }

  const aName = n => (/^[aeiou]/.test(n) ? 'an ' : 'a ') + n;
  const wordNum = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

  App.chapter({
    id: 'flowerkey',
    title: 'Flower key',
    icon: '🔑',
    group: 'Sorting plants',
    keywords: [
      { w: 'important', d: 'Something that matters a lot.' },
      { w: 'centre', d: 'The middle of something.' },
    ],
    steps: [
      // ---------- a) Use the key ----------
      {
        text: ['Use the key to identify these flowers.'],
        ask: 'Click a flower. Then answer each question with Yes or No to find its name.',
        activity: true,
        scene(stage, api) {
          const L = legs();
          const legSvg = L.map(l => {
            const h = l.y2 - l.y1;
            return `<g class="fk-leg" data-id="${l.id}">
              <path class="fk-glow" d="M${l.x} ${l.y1} L${l.x} ${l.y2}" stroke="#FFD740" stroke-width="36" stroke-linecap="round" opacity=".9" stroke-dasharray="${h} ${h + 10}" stroke-dashoffset="${h}"/>
              <rect x="${l.x - 12}" y="${l.y1}" width="24" height="${h}" rx="12" fill="url(#fk-wood)" stroke="#C99A6B" stroke-width="2"/>
              <text transform="translate(${l.x + 6} ${S.f1(l.y1 + h / 2)}) rotate(-90)" text-anchor="middle" font-size="16" font-weight="800" fill="#5D3A1A">${l.ans === 'yes' ? 'Yes' : 'No'}</text>
              ${l.leaf ? `<path d="M${l.x - 8} ${l.y2 - 2} L${l.x + 8} ${l.y2 - 2} L${l.x} ${l.y2 + 10}Z" fill="#FFC107" stroke="#E0A000" stroke-width="1.5"/>` : ''}
            </g>`;
          }).join('');
          const plankSvg = Object.keys(PLANK).map(id => {
            const p = PLANK[id];
            const tx = p.lines.map((t, i) => `<text x="${p.x}" y="${S.f1(p.y + 6 + (i - (p.lines.length - 1) / 2) * 20)}" text-anchor="middle" font-size="17" font-weight="800" fill="#4E2E12">${t}</text>`).join('');
            return `<g class="fk-plank" id="fk-${id}">
              <rect class="fk-board" x="${p.x - p.w / 2}" y="${p.y - p.h / 2}" width="${p.w}" height="${p.h}" rx="${p.lines.length > 1 ? 16 : p.h / 2}" fill="url(#fk-wood)" stroke="#C99A6B" stroke-width="2"/>
              <path d="M${p.x - p.w / 2 + 18} ${p.y - p.h / 2 + 7} l${p.w * .3} 0 M${p.x + p.w * .1} ${p.y + p.h / 2 - 7} l${p.w * .28} 0" stroke="#D9A676" stroke-width="1.5" opacity=".7"/>
              ${tx}</g>`;
          }).join('');
          const leafSvg = Object.keys(LEAF).map(id => {
            const p = LEAF[id], w = id.length * 11 + 22;
            return `<g class="fk-leaf" id="fk-l-${id}"><g class="fk-lpop"><rect class="fk-lbox" x="${p.x - w / 2}" y="${p.y - 17}" width="${w}" height="34" rx="3" fill="#FFC727" stroke="#E0A800" stroke-width="1.5"/>
              <text x="${p.x}" y="${p.y + 7}" text-anchor="middle" font-size="20" font-weight="700" fill="#3A2A00">${id}</text></g></g>`;
          }).join('');
          const rowX = i => 75 + i * 130;
          const pickSvg = FLOWERS.map((f, i) => `<g class="fk-pick" data-id="${f.id}"><circle cx="${rowX(i)}" cy="54" r="47" fill="#FFE9A8" stroke="#F4B942" stroke-width="3" opacity="0"/>${flowerAt(f.id, rowX(i), 55, .8)}
            <g id="fk-tick-${f.id}" opacity="0"><circle cx="${rowX(i) + 36}" cy="22" r="13" fill="#3E9B4F" stroke="#fff" stroke-width="3"/><path d="M${rowX(i) + 30} 22 l5 5 l8 -10" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round"/></g></g>`).join('');

          const svg = api.svg(`${DEFS}
            <rect width="800" height="520" fill="#FFFDF6"/>
            <rect x="0" y="0" width="800" height="104" fill="#FFF3E0"/>
            <path d="M0 104 L800 104" stroke="#F2D2B0" stroke-width="3" stroke-dasharray="8 8"/>
            ${pickSvg}
            ${legSvg}${plankSvg}${leafSvg}
            <g id="fk-minis"></g>
            <g id="fk-spot" transform="translate(400 455)">
              <circle r="66" fill="url(#g-glow)"/>
              <circle r="56" fill="#FFFBEA" stroke="#F4B942" stroke-width="3" stroke-dasharray="7 6"/>
              <text id="fk-spot-hint" y="-6" text-anchor="middle" font-size="16" font-weight="800" fill="#B26A00">👆 Pick a</text>
              <text id="fk-spot-hint2" y="16" text-anchor="middle" font-size="16" font-weight="800" fill="#B26A00">flower</text>
            </g>
            <g id="fk-fly"></g>
          `);

          const found = new Set();
          let cur = null, node = null, busy = false;
          const fly = S.q(svg, '#fk-fly');
          const planks = S.qa(svg, '.fk-plank');
          const setNode = id => {
            node = id;
            planks.forEach(p => p.classList.toggle('fk-on', p.id === 'fk-' + id));
            if (NODES[id]) {
              qLabel.innerHTML = '❓ ' + NODES[id].q;
              api.say(NODES[id].q);
            }
          };
          const resetTree = () => {
            S.qa(svg, '.fk-glow').forEach(g => g.setAttribute('stroke-dashoffset', g.getAttribute('stroke-dasharray').split(' ')[0]));
            S.qa(svg, '.fk-leaf').forEach(l => l.classList.remove('fk-got'));
            planks.forEach(p => p.classList.remove('fk-on'));
          };
          const setButtons = on => { yesB.disabled = noB.disabled = !on; };

          const pick = async g => {
            if (busy) return;
            const id = g.dataset.id, f = FLOWERS.find(x => x.id === id);
            busy = true;
            api.sfx('pick');
            resetTree();
            cur = f;
            S.qa(svg, '.fk-pick > circle').forEach(c => c.setAttribute('opacity', c.parentNode === g ? .9 : 0));
            S.q(svg, '#fk-spot-hint').style.display = S.q(svg, '#fk-spot-hint2').style.display = 'none';
            // A copy of the flower flies down into the spotlight
            const i = FLOWERS.indexOf(f);
            fly.innerHTML = `<g transform="translate(${rowX(i)} 55) scale(.8)"><g id="fk-flyin">${DRAW[id]()}</g></g>`;
            const n = fly.firstElementChild;
            api.sfx('whoosh');
            const ok = await api.tween(700, k => {
              const x = rowX(i) + (400 - rowX(i)) * k, y = 55 + (455 - 55) * k - Math.sin(k * Math.PI) * 60;
              n.setAttribute('transform', `translate(${S.f1(x)} ${S.f1(y)}) scale(${S.f1(.8 + .2 * k)}) rotate(${S.f1(k * 360)})`);
            }, W.ease.out);
            if (!ok) return;
            api.sfx('pop');
            busy = false;
            setButtons(true);
            setNode('q1');
          };
          S.qa(svg, '.fk-pick').forEach(g => g.addEventListener('click', () => pick(g)));

          const answer = async yes => {
            if (!cur || busy || !NODES[node]) return;
            const nd = NODES[node];
            const right = !!cur[nd.key] === yes;
            if (!right) {
              api.oops(nd.hint);
              const fl = S.q(svg, '#fk-flyin');
              fl.classList.add('wiggle');
              api.timeout(() => fl.classList.remove('wiggle'), 900);
              return;
            }
            busy = true;
            setButtons(false);
            api.sfx('swoosh');
            const legId = `${node}-${yes ? 'yes' : 'no'}`;
            const glow = S.q(svg, `.fk-leg[data-id="${legId}"] .fk-glow`);
            const len = +glow.getAttribute('stroke-dasharray').split(' ')[0];
            planks.forEach(p => p.classList.remove('fk-on'));
            const ok = await api.tween(650, k => glow.setAttribute('stroke-dashoffset', S.f1(len * (1 - k))), W.ease.inOut);
            if (!ok) return;
            const next = nd[yes ? 'yes' : 'no'];
            if (NODES[next]) {
              busy = false;
              setButtons(true);
              setNode(next);
            } else {
              arrive(next);
            }
          };

          const arrive = name => {
            node = null;
            const leaf = S.q(svg, '#fk-l-' + name);
            leaf.classList.add('fk-got');
            const pop = S.q(leaf, '.fk-lpop');
            pop.classList.remove('pop-in'); void pop.getBoundingClientRect(); pop.classList.add('pop-in');
            api.sfx('magic');
            qLabel.innerHTML = `🎉 It is ${aName(name).split(" ")[0]} <b>${name}</b>! Pick another flower.`;
            const first = !found.has(name);
            found.add(name);
            S.q(svg, '#fk-tick-' + name).setAttribute('opacity', 1);
            if (first) {
              const p = LEAF[name];
              const my = p.y > 350 ? p.y + 58 : p.y + 52;
              S.q(svg, '#fk-minis').insertAdjacentHTML('beforeend', `<g transform="translate(${p.x} ${my})"><g class="pop-in">${flowerAt(name, 0, 0, .44)}</g></g>`);
            }
            busy = false;
            if (found.size === FLOWERS.length) {
              api.star();
              api.timeout(() => api.praise('You used the key to identify all six flowers!'), 1400);
              api.say(`It is ${aName(name)}!`);
            } else {
              api.say(`It is ${aName(name)}! You have found ${found.size} of the 6 flowers.`);
            }
          };

          api.row();
          const qLabel = api.label('👆 Click a flower at the top to start.');
          qLabel.classList.add('fk-q');
          const yesB = api.button('✅ Yes', () => answer(true), { cls: 'primary fk-big' });
          const noB = api.button('❌ No', () => answer(false), { cls: 'warn fk-big' });
          qLabel.style.cursor = 'pointer';
          qLabel.title = 'Hear the question again';
          qLabel.addEventListener('click', () => { if (NODES[node]) { api.sfx('click'); api.say(NODES[node].q); } });
          setButtons(false);
        },
      },

      // ---------- b) Describe the vinca ----------
      {
        text: ['Now describe the vinca flower using the key.'],
        ask: 'Choose the right words to finish each sentence.',
        activity: true,
        scene(stage, api) {
          const rows = [
            { pre: 'The vinca has ', post: ' petals.', opts: ['four', 'five', 'six'], ans: 1, hint: 'Count the vinca petals again.', y: 95 },
            { pre: 'The petals are ', post: '.', opts: ['yellow', 'pink', 'purple'], ans: 1, hint: 'Look at the colour of the petals.', y: 235 },
            { pre: 'There are ', post: '', post2: 'between the petals.', opts: ['big spaces', 'no spaces'], ans: 0, hint: 'Look between the petals. Can you see gaps?', y: 360 },
          ];
          const chipW = t => t.length * 12 + 34;
          const rowSvg = rows.map((r, ri) => {
            let x = 385;
            const chips = r.opts.map((o, oi) => {
              const w = chipW(o);
              const g = `<g class="fk-chip" data-r="${ri}" data-o="${oi}" transform="translate(${x} ${r.y + (r.post2 ? 52 : 22)})"><g class="fk-chip-in">
                <rect width="${w}" height="40" rx="20" fill="#fff" stroke="#C9B897" stroke-width="2.5"/>
                <text x="${w / 2}" y="27" text-anchor="middle" font-size="20" font-weight="800" fill="#3B3F6B">${o}</text></g></g>`;
              x += w + 14;
              return g;
            }).join('');
            return `<text x="385" y="${r.y}" font-size="25" font-weight="700" fill="#2B2A28">${r.pre}<tspan id="fk-blank${ri}" fill="#B0A48E">______</tspan>${r.post}</text>
              ${r.post2 ? `<text x="385" y="${r.y + 34}" font-size="25" font-weight="700" fill="#2B2A28">${r.post2}</text>` : ''}
              <g id="fk-chips${ri}">${chips}</g>
              <g id="fk-ok${ri}" opacity="0"><circle cx="752" cy="${r.y - 8}" r="16" fill="#3E9B4F"/><path d="M744 ${r.y - 8} l5 6 l10 -12" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round"/></g>`;
          }).join('');
          // Petal numbers, gap markers and colour tag appear as each sentence is finished
          const S2 = 2.9, cx = 185, cy = 262;
          let nums = '', gaps = '';
          for (let i = 0; i < 5; i++) {
            const a = (i * 72 - 90) * Math.PI / 180;
            nums += `<g transform="translate(${S.f1(cx + Math.cos(a) * 100)} ${S.f1(cy + Math.sin(a) * 100)})"><g class="fk-num" style="display:none"><circle r="19" fill="#fff" stroke="#C2185B" stroke-width="3"/><text y="8" text-anchor="middle" font-size="22" font-weight="800" fill="#C2185B">${i + 1}</text></g></g>`;
            const b = (i * 72 - 54) * Math.PI / 180;
            gaps += `<g transform="translate(${S.f1(cx + Math.cos(b) * 112)} ${S.f1(cy + Math.sin(b) * 112)})"><g class="fk-gap" style="display:none"><circle r="22" fill="#FFF59D" opacity=".75" stroke="#F9A825" stroke-width="3" stroke-dasharray="5 4"/></g></g>`;
          }
          const svg = api.svg(`${DEFS}
            <rect width="800" height="520" fill="#FDF2F6"/>
            <circle cx="${cx}" cy="${cy}" r="175" fill="#fff" opacity=".7"/>
            <g id="fk-gaps">${gaps}</g>
            <g class="sway" style="animation-duration:6s">${flowerAt('vinca', cx, cy, S2)}</g>
            <g id="fk-nums">${nums}</g>
            <g id="fk-pinktag" style="display:none"><g class="pop-in"><rect x="120" y="468" width="130" height="38" rx="19" fill="#EC407A"/><text x="185" y="494" text-anchor="middle" font-size="20" font-weight="800" fill="#fff">pink</text></g></g>
            <rect x="365" y="30" width="415" height="460" rx="14" fill="#fff" stroke="#E7A07F" stroke-width="3"/>
            ${[70, 140, 210, 280, 350, 420].map(y => `<path d="M380 ${y + 35} L765 ${y + 35}" stroke="#E3F0FA" stroke-width="2"/>`).join('')}
            <text x="572" y="60" text-anchor="middle" font-size="18" font-weight="800" fill="#C8452F">📝 The vinca flower</text>
            ${rowSvg}
          `);
          const done = new Set();
          const show = async ri => {
            if (ri === 0) {
              const ns = S.qa(svg, '.fk-num');
              for (let i = 0; i < ns.length; i++) {
                ns[i].style.display = ''; ns[i].classList.add('pop-in');
                api.sfx('tick');
                if (!await api.wait(380)) return;
              }
            } else if (ri === 1) {
              S.q(svg, '#fk-pinktag').style.display = '';
            } else {
              S.qa(svg, '.fk-gap').forEach((g, i) => api.timeout(() => { g.style.display = ''; g.classList.add('pop-in'); api.sfx('pop'); }, i * 200));
            }
          };
          S.qa(svg, '.fk-chip').forEach(c => c.addEventListener('click', () => {
            const ri = +c.dataset.r, oi = +c.dataset.o, r = rows[ri];
            if (done.has(ri)) return;
            if (oi !== r.ans) {
              api.oops(r.hint);
              const inner = S.q(c, '.fk-chip-in');
              inner.classList.remove('wiggle'); void inner.getBoundingClientRect(); inner.classList.add('wiggle');
              api.timeout(() => inner.classList.remove('wiggle'), 600);
              return;
            }
            done.add(ri);
            api.sfx('drop');
            const b = S.q(svg, '#fk-blank' + ri);
            b.textContent = r.opts[oi];
            b.setAttribute('fill', '#2A7439');
            b.setAttribute('font-weight', '800');
            S.q(svg, '#fk-chips' + ri).style.display = 'none';
            S.q(svg, '#fk-ok' + ri).setAttribute('opacity', 1);
            show(ri);
            const sentence = r.pre + r.opts[oi] + r.post + (r.post2 ? ' ' + r.post2 : '');
            if (done.size === rows.length) {
              api.star();
              api.say('The vinca has five petals. The petals are pink. There are big spaces between the petals.');
              api.timeout(() => api.praise('You described the vinca using the key!'), 5200);
            } else {
              api.say(sentence);
              api.feedback('✔ ' + sentence, 'ok');
            }
          }));
        },
      },

      // ---------- c) How to make a key ----------
      {
        text: [
          'Do you remember how to make a key?',
          'The most **important** things are:<ul><li>ask questions that have ‘yes’ or ‘no’ as the answer</li><li>make sure one question will be ‘yes’ for more than one flower</li><li>ask this question first.</li></ul>',
        ],
        ask: 'Drag each question into the right box. Is it a good key question?',
        activity: true,
        scene(stage, api) {
          const box = api.html('<div class="fk-sort" style="height:100%"></div>');
          const icon = (emoji, bg) => `<svg viewBox="0 0 100 40"><rect x="30" y="2" width="40" height="36" rx="18" fill="${bg}"/><text x="50" y="29" text-anchor="middle" font-size="24">${emoji}</text></svg>`;
          const items = [
            { id: 'eight', bin: 'good', label: 'Does it have eight petals?', svg: icon('🌸', '#FCE4EC'), hint: 'Can you answer it with yes or no? Yes you can!' },
            { id: 'centre', bin: 'good', label: 'Does it have a yellow centre?', svg: icon('🌼', '#FFF8E1'), hint: 'You can answer this with yes or no.' },
            { id: 'pink', bin: 'good', label: 'Are the petals pink?', svg: icon('🎨', '#F3E5F5'), hint: 'You can answer this with yes or no.' },
            { id: 'five', bin: 'good', label: 'Does it have five petals?', svg: icon('🖐️', '#E3F2FD'), hint: 'You can answer this with yes or no.' },
            { id: 'colour', bin: 'bad', label: 'What colour is it?', svg: icon('🌈', '#E8F5E9'), hint: 'The answer is a colour, not yes or no!' },
            { id: 'pretty', bin: 'bad', label: 'Is it pretty?', svg: icon('😍', '#FFEBEE'), hint: 'People think different things are pretty. A key needs facts.' },
            { id: 'many', bin: 'bad', label: 'How many petals does it have?', svg: icon('🔢', '#FFF3E0'), hint: 'The answer is a number, not yes or no!' },
            { id: 'like', bin: 'bad', label: 'Do you like it?', svg: icon('💭', '#ECEFF1'), hint: 'That is about you, not about the flower.' },
          ];
          items.forEach(it => { it.say = it.label; });
          api.sortGame(box.firstElementChild, {
            bins: [{ id: 'good', title: '✅ Good key question' }, { id: 'bad', title: '❌ Not a good key question' }],
            items,
            onDone: () => {
              api.star();
              api.timeout(() => {
                api.choice({
                  q: 'Which question should we ask first for our six flowers?',
                  options: ['Is it a lily?', 'Does it have five petals?', 'Is it an aster?'],
                  correct: 1,
                  hints: { 0: 'That is yes for only one flower.', 2: 'That is yes for only one flower.' },
                  explain: 'Yes! Three flowers have five petals, so it splits the flowers into two groups.',
                  speak: true,
                });
              }, 2500);
            },
          });
        },
      },

      // ---------- d) Ideas of what to look at ----------
      {
        text: ['Here are some ideas of what to look at.'],
        ask: 'Answer each question about this flower. Click the petals to count them.',
        activity: true,
        scene(stage, api) {
          const cx = 575, cy = 262, R = 196, Wd = 64;
          // A cosmos petal with a notched tip, pointing up
          const pd = `M0 -20 C${-Wd * .3} ${-R * .35} ${-Wd} ${-R * .7} ${-Wd * .88} ${-R * .95} L${-Wd * .55} ${-R * .9} L${-Wd * .38} ${-R} L${-Wd * .12} ${-R * .93} L${Wd * .12} ${-R} L${Wd * .35} ${-R * .92} L${Wd * .6} ${-R * .98} L${Wd * .88} ${-R * .93} C${Wd} ${-R * .7} ${Wd * .3} ${-R * .35} 0 -20Z`;
          let petals = '';
          for (let i = 0; i < 8; i++) {
            const a = i * 45 + 8;
            petals += `<g class="fk-petal" data-i="${i}" transform="rotate(${a})">
              <path class="fk-pp" d="${pd}" fill="url(#fk-cos)" stroke="#D0579A" stroke-width="2" stroke-linejoin="round"/>
              <path d="M0 -30 L0 ${-R * .88} M0 -40 L-16 ${-R * .8} M0 -40 L16 ${-R * .8}" stroke="#C2185B" stroke-width="1.6" opacity=".35" fill="none"/>
            </g>`;
          }
          let florets = '';
          for (let i = 0; i < 70; i++) {
            const a = i * 137.5 * Math.PI / 180, d = Math.sqrt(i / 70) * 34;
            florets += `<circle cx="${S.f1(Math.cos(a) * d)}" cy="${S.f1(Math.sin(a) * d)}" r="${i < 20 ? 2.4 : 3}" fill="${i % 3 ? '#FFB300' : '#F57C00'}"/>`;
          }
          const card = (i, y, q) => `<g id="fk-card${i}" class="fk-card" opacity="${i ? .45 : 1}">
            <rect class="fk-cardbox" x="20" y="${y}" width="320" height="118" rx="18" fill="#FDEBE1" stroke="#E07A4F" stroke-width="3"/>
            <text x="180" y="${y + 38}" text-anchor="middle" font-size="21" font-weight="700" fill="#2B2A28">${q}</text>
            <g class="fk-yn" style="display:${i === 2 ? 'none' : ''}">
              <g class="fk-chip" data-c="${i}" data-a="yes" transform="translate(60 ${y + 58})"><rect width="100" height="44" rx="22" fill="#3E9B4F" stroke="#2A7439" stroke-width="2"/><text x="50" y="30" text-anchor="middle" font-size="20" font-weight="800" fill="#fff">✅ Yes</text></g>
              <g class="fk-chip" data-c="${i}" data-a="no" transform="translate(200 ${y + 58})"><rect width="100" height="44" rx="22" fill="#C8452F" stroke="#9A3222" stroke-width="2"/><text x="50" y="30" text-anchor="middle" font-size="20" font-weight="800" fill="#fff">❌ No</text></g>
            </g>
            <g class="fk-count" style="display:${i === 2 ? '' : 'none'}"><text x="180" y="${y + 90}" text-anchor="middle" font-size="19" font-weight="800" fill="#9A3222">👆 Click each petal: <tspan class="fk-cn">0</tspan></text></g>
            <g class="fk-done" opacity="0"><text x="180" y="${y + 88}" text-anchor="middle" font-size="24" font-weight="800" fill="#2A7439">Yes! ✔</text><circle cx="318" cy="${y + 8}" r="18" fill="#3E9B4F" stroke="#fff" stroke-width="3"/><path d="M309 ${y + 8} l6 6 l11 -13" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round"/></g>
          </g>`;
          const svg = api.svg(`${DEFS}
            <rect width="800" height="520" fill="#FFFDF8"/>
            <circle cx="${cx}" cy="${cy}" r="225" fill="#FCE4EC" opacity=".5"/>
            <g id="fk-cosmos" transform="translate(${cx} ${cy})">
              <g id="fk-petals">${petals}</g>
              <g id="fk-centre"><circle r="40" fill="#FFCA28" stroke="#F57C00" stroke-width="2"/>${florets}</g>
              <circle id="fk-ring" r="52" fill="none" stroke="#FFD600" stroke-width="6" opacity="0"/>
              <g id="fk-badges"></g>
            </g>
            ${card(0, 40, 'Are the petals pink?')}
            ${card(1, 200, 'Does it have a yellow centre?')}
            ${card(2, 360, 'Does it have eight petals?')}
          `);
          let stage2 = 0;           // which question is active
          const counted = new Set();
          const setActive = i => {
            stage2 = i;
            S.qa(svg, '.fk-card').forEach((c, k) => c.setAttribute('opacity', k <= i ? 1 : .45));
          };
          const tickCard = i => {
            const c = S.q(svg, '#fk-card' + i);
            S.q(c, '.fk-done').setAttribute('opacity', 1);
            S.q(c, '.fk-yn').style.display = 'none';
            S.q(c, '.fk-cardbox').setAttribute('fill', '#E3F4DE');
            S.q(c, '.fk-cardbox').setAttribute('stroke', '#3E9B4F');
          };
          const finish = i => {
            tickCard(i);
            if (i === 2) {
              api.star();
              api.timeout(() => api.praise('The petals are pink. It has a yellow centre. It has eight petals. It is a cosmos flower!'), 600);
              return;
            }
            setActive(i + 1);
            api.timeout(() => api.say(i === 0 ? 'Does it have a yellow centre?' : 'Does it have eight petals? Click each petal to count.'), 1800);
          };
          S.qa(svg, '.fk-chip').forEach(b => b.addEventListener('click', async () => {
            const i = +b.dataset.c, yes = b.dataset.a === 'yes';
            if (i !== stage2) { api.sfx('knock'); api.info('Answer the question above first.'); return; }
            if (!yes) {
              api.oops(i === 0 ? 'Look at the colour of the petals again.' : i === 1 ? 'Look at the middle of the flower. What colour is it?' : 'Count the petals again.');
              return;
            }
            api.sfx('success');
            if (i === 0) {
              api.say('Yes! The petals are pink.');
              S.qa(svg, '.fk-pp').forEach((p, k) => api.timeout(() => { p.setAttribute('stroke', '#FFD600'); p.setAttribute('stroke-width', 5); api.sfx('tick'); }, k * 90));
              api.timeout(() => S.qa(svg, '.fk-pp').forEach(p => { p.setAttribute('stroke', '#D0579A'); p.setAttribute('stroke-width', 2); }), 1600);
            } else if (i === 1) {
              api.say('Yes! It has a yellow centre.');
              const ring = S.q(svg, '#fk-ring');
              api.sfx('sprinkle');
              await api.tween(1400, (k, raw) => { ring.setAttribute('opacity', S.f1(Math.sin(raw * Math.PI))); ring.setAttribute('r', S.f1(44 + raw * 20)); });
            } else {
              api.say('Yes! It has eight petals.');
            }
            finish(i);
          }));
          S.qa(svg, '.fk-petal').forEach(p => p.addEventListener('click', () => {
            const i = +p.dataset.i;
            if (stage2 !== 2) { api.sfx('pop'); api.info('First answer the question at the top.'); return; }
            if (counted.has(i)) { api.sfx('tick'); api.say('You counted that one already.'); return; }
            counted.add(i);
            const n = counted.size;
            api.sfx('pop');
            api.say(wordNum[n]);
            S.q(p, '.fk-pp').setAttribute('fill', '#FF80C4');
            S.q(p, '.fk-pp').setAttribute('stroke', '#FFD600');
            S.q(p, '.fk-pp').setAttribute('stroke-width', 4);
            const a = (i * 45 + 8 - 90) * Math.PI / 180;
            S.q(svg, '#fk-badges').insertAdjacentHTML('beforeend', `<g transform="translate(${S.f1(Math.cos(a) * 120)} ${S.f1(Math.sin(a) * 120)})"><g class="pop-in"><circle r="22" fill="#fff" stroke="#C2185B" stroke-width="3"/><text y="8" text-anchor="middle" font-size="24" font-weight="800" fill="#C2185B">${n}</text></g></g>`);
            S.q(svg, '#fk-card2 .fk-cn').textContent = n;
            if (n === 8) {
              api.timeout(() => {
                S.q(svg, '#fk-card2 .fk-count').style.display = 'none';
                S.q(svg, '#fk-card2 .fk-yn').style.display = '';
                api.say('Eight! So, does it have eight petals?');
              }, 700);
            }
          }));
        },
      },
    ],
  });
})();
