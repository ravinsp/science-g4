// Chapter 5: Leaves
(() => {
  if (!document.getElementById('lv-style')) {
    const st = document.createElement('style');
    st.id = 'lv-style';
    st.textContent = `
      .lv-hl { filter: drop-shadow(0 0 6px #FFE56B) drop-shadow(0 0 3px #FFB300); }
      .lv-hit { stroke: transparent; fill: none; pointer-events: stroke; }
      .lv-chew { animation: lv-chew .18s ease-in-out 6 alternate; transform-box: fill-box; transform-origin: center; }
      @keyframes lv-chew { to { transform: scaleY(.3); } }
      .lv-tw { animation: lv-tw 1s ease-out both; transform-box: fill-box; transform-origin: center; }
      @keyframes lv-tw { 0% { transform: scale(0); opacity: 1; } 50% { transform: scale(1.2); opacity: 1; } 100% { transform: scale(.4); opacity: 0; } }
    `;
    document.head.append(st);
  }

  const SUNFLOWER = { x: 400, y: 350, h: 280, leaves: 6, leafShape: 'heart', leafL: 50, leafW: 22, flower: 'sunflower', flowerColor: '#FFC400', flowerCenter: '#6D4C1E', flowerR: 34, petals: 18, rootDepth: 110, rootSpread: 120, stemW: 9, seed: 3 };

  const soilBand = (y) => `<path d="M0 ${y} Q200 ${y - 8} 400 ${y} T800 ${y} L800 520 L0 520Z" fill="url(#g-soil)"/>
    ${[...Array(26)].map((_, i) => `<ellipse cx="${(i * 71) % 800}" cy="${y + 20 + (i * 37) % 140}" rx="${3 + i % 4}" ry="${2 + i % 3}" fill="#000" opacity=".16"/>`).join('')}
    <path d="M0 ${y} Q200 ${y - 8} 400 ${y} T800 ${y}" stroke="#6DBA5A" stroke-width="7" fill="none"/>`;

  // Tiny 4-point sparkle
  const sparkle = (x, y, r = 8, color = '#FFF59D') => `<path class="lv-tw" d="M${x} ${y - r} L${x + r * .25} ${y - r * .25} L${x + r} ${y} L${x + r * .25} ${y + r * .25} L${x} ${y + r} L${x - r * .25} ${y + r * .25} L${x - r} ${y} L${x - r * .25} ${y - r * .25}Z" fill="${color}" stroke="#FFB300" stroke-width="1"/>`;

  // A cute koala. Head is a separate group so it can lean and chew.
  function koala(x, y) {
    return `<g transform="translate(${x} ${y})">
      <ellipse cx="0" cy="40" rx="44" ry="56" fill="#9EA3A8" stroke="#6E7378" stroke-width="2"/>
      <ellipse cx="4" cy="52" rx="26" ry="36" fill="#E3E5E8"/>
      <path d="M-40 20 Q-58 40 -46 62" stroke="#8C9196" stroke-width="18" fill="none" stroke-linecap="round"/>
      <ellipse cx="-22" cy="94" rx="18" ry="11" fill="#8C9196"/><ellipse cx="24" cy="94" rx="18" ry="11" fill="#8C9196"/>
      <g id="lv-head">
        <circle cx="-38" cy="-40" r="24" fill="#9EA3A8" stroke="#6E7378" stroke-width="2"/><circle cx="-38" cy="-40" r="14" fill="#F4E6EC"/>
        <circle cx="38" cy="-40" r="24" fill="#9EA3A8" stroke="#6E7378" stroke-width="2"/><circle cx="38" cy="-40" r="14" fill="#F4E6EC"/>
        <ellipse cx="0" cy="-16" rx="42" ry="36" fill="#AEB3B8" stroke="#6E7378" stroke-width="2"/>
        <circle cx="-16" cy="-24" r="5" fill="#222"/><circle cx="16" cy="-24" r="5" fill="#222"/>
        <circle cx="-14.5" cy="-25.5" r="1.6" fill="#fff"/><circle cx="17.5" cy="-25.5" r="1.6" fill="#fff"/>
        <ellipse cx="0" cy="-8" rx="11" ry="15" fill="#2B2A28"/><ellipse cx="-3" cy="-14" rx="3" ry="4" fill="#fff" opacity=".4"/>
        <ellipse id="lv-mouth" cx="0" cy="12" rx="7" ry="4" fill="#7A3A3A"/>
        <circle cx="-26" cy="0" r="5" fill="#F4A7B9" opacity=".6"/><circle cx="26" cy="0" r="5" fill="#F4A7B9" opacity=".6"/>
      </g>
      <path d="M36 10 Q70 0 76 -20" stroke="#8C9196" stroke-width="16" fill="none" stroke-linecap="round"/>
    </g>`;
  }

  App.chapter({
    id: 'leaves',
    title: 'Leaves',
    icon: '🍃',
    group: 'Parts of a plant',
    keywords: [
      { w: 'sunflower', d: 'A tall plant with a big yellow flower that faces the Sun.' },
      { w: 'producers', d: 'Living things that make their own food. Plants are producers.' },
      { w: 'herbivores', d: 'Animals that only eat plants.' },
      { w: 'thin', d: 'Not thick. A thin thing is narrow from one side to the other.' },
      { w: 'flat', d: 'Smooth and level, with no bumps.' },
      { w: 'green', d: 'The colour of grass and most leaves.' },
      { w: 'sunlight', d: 'The light that comes from the Sun.' },
      { w: 'facing', d: 'Turned towards something.' },
      { w: 'absorb', d: 'To take in and hold something, like a sponge takes in water.' },
    ],
    steps: [
      {
        text: [
          'This is a **sunflower** plant.',
          'You can already identify its roots and its stem. You know their functions too.',
          'Now let\'s look at the leaves.',
        ],
        ask: 'Drag the labels onto the sunflower.',
        activity: true,
        scene(stage, api) {
          const o = SUNFLOWER;
          const p0 = { x: o.x, y: o.y }, p1 = { x: o.x, y: o.y - o.h * .42 }, p2 = { x: o.x, y: o.y - o.h * .86 }, p3 = { x: o.x, y: o.y - o.h };
          // Where leaf number 1 (a left leaf) sits
          const t1 = .3 + (.93 - .3) / 5;
          const P = S.bez(p0, p1, p2, p3, t1);
          const svg = api.svg(`
            ${S.sky()}
            ${S.sun({ x: 90, y: 70, r: 30 })}
            <g class="float">${S.cloud({ x: 640, y: 150, s: .7 })}</g>
            ${soilBand(o.y)}
            ${S.plant(o)}
          `);
          api.dragLabels(svg, [
            { id: 'flower', label: 'flower', x: o.x, y: p3.y, lx: 590, ly: 60 },
            { id: 'leaf', label: 'leaf', x: P.x - 24, y: P.y - 18, lx: 200, ly: P.y - 60 },
            { id: 'stem', label: 'stem', x: o.x + 1, y: o.y - 50, lx: 590, ly: o.y - 60 },
            { id: 'soil', label: 'soil', x: 180, y: 430, lx: 110, ly: 485 },
            { id: 'root', label: 'root', x: o.x + 3, y: o.y + 45, lx: 620, ly: 470 },
          ], {
            onDone: () => { api.star(); api.sayAfter('Great labelling! Now we know all the parts of the sunflower.'); },
          });
        },
      },
      {
        text: [
          'Leaves make food for the plant.',
          'Plants are **producers**. They make their own food, which is then eaten by **herbivores**.',
        ],
        ask: 'Feed the koala. It is a herbivore!',
        activity: true,
        scene(stage, api) {
          // Eucalyptus leaves: long, narrow and hanging down
          const r = S.rng(12);
          const cluster = (x, y, n, edible) => {
            let s = '';
            for (let i = 0; i < n; i++) {
              const a = edible ? 30 + i * 60 : 50 + i * (80 / Math.max(1, n - 1)) + (r() - .5) * 10;
              const L = edible ? 72 : 52 + r() * 14, Wd = edible ? 15 : 10;
              const id = edible ? `lv-e${edible.length}` : '';
              if (edible) edible.push({ x, y, a, L, id });
              s += edible
                ? `<g mask="url(#${id}-m)">${S.leaf({ x, y, angle: a, L, W: Wd, shape: 'long', color: i % 2 ? '#7FA88A' : '#6E9E7E', stalk: 4 })}</g>`
                : S.leaf({ x, y, angle: a, L, W: 10, shape: 'long', color: i % 2 ? '#7FA88A' : '#6E9E7E', stalk: 4 });
            }
            return s;
          };
          const edible = [];
          const leavesMk = cluster(130, 120, 5) + cluster(210, 70, 4) + cluster(420, 100, 5) + cluster(160, 330, 4) + cluster(400, 176, 3, edible);
          const svg = api.svg(`
            ${S.sky()}
            <defs>${edible.map(e => `<mask id="${e.id}-m" maskUnits="userSpaceOnUse" x="0" y="0" width="800" height="520"><rect width="800" height="520" fill="#fff"/><g class="lv-bites"></g></mask>`).join('')}</defs>
            ${S.ground({ y: 470, h: 50, fill: 'url(#g-grass)' })}
            <path d="M230 520 C236 420 222 320 246 200 C252 160 250 120 240 80" stroke="#D8D2C4" stroke-width="34" fill="none" stroke-linecap="round"/>
            <path d="M226 500 C230 420 220 320 242 210" stroke="#B9AE9A" stroke-width="6" fill="none" opacity=".6"/>
            <path d="M244 180 Q180 150 130 120 M240 120 Q220 90 210 70 M246 200 Q330 170 420 100 M236 360 Q190 350 160 330 M250 220 Q330 190 400 176" stroke="#C9C0AE" stroke-width="10" fill="none" stroke-linecap="round"/>
            ${leavesMk}
            ${koala(292, 250)}
            <g id="lv-chain" transform="translate(540 26)">
              <rect width="240" height="470" rx="18" fill="#fff" stroke="#3E9B4F" stroke-width="3" opacity=".95"/>
              ${S.text(120, 34, 'Food chain', { size: 22, fill: '#2A7439' })}
              <g id="lv-c1" opacity="0">${S.sun({ x: 120, y: 95, r: 26 })}${S.text(120, 150, 'Sun', { size: 18 })}</g>
              <g id="lv-a1" opacity="0">${S.arrow(120, 160, 120, 196, { color: '#E07A4F' })}</g>
              <g id="lv-c2" opacity="0">${S.leaf({ x: 92, y: 240, angle: -20, L: 30, W: 7, shape: 'long', color: '#6E9E7E' })}${S.leaf({ x: 92, y: 240, angle: 10, L: 36, W: 7, shape: 'long', color: '#7FA88A' })}${S.leaf({ x: 92, y: 240, angle: 40, L: 30, W: 7, shape: 'long', color: '#6E9E7E' })}
                ${S.text(120, 290, 'plant', { size: 18 })}${S.text(120, 312, '(producer)', { size: 16, fill: '#2A7439' })}</g>
              <g id="lv-a2" opacity="0">${S.arrow(120, 322, 120, 356, { color: '#E07A4F' })}</g>
              <g id="lv-c3" opacity="0"><g transform="translate(120 383) scale(.33) translate(-292 -250)">${koala(292, 250).replace('id="lv-head"', '').replace('id="lv-mouth"', '')}</g>
                ${S.text(120, 438, 'koala', { size: 18 })}${S.text(120, 458, '(herbivore)', { size: 16, fill: '#9A3222' })}</g>
            </g>
          `);
          const head = S.q(svg, '#lv-head'), mouth = S.q(svg, '#lv-mouth');
          let bites = 0, shown = false, busy = false;
          const bitesPer = 3, need = 6;
          const showChain = async () => {
            shown = true;
            for (const id of ['#lv-c1', '#lv-a1', '#lv-c2', '#lv-a2', '#lv-c3']) {
              const g = S.q(svg, id);
              g.setAttribute('opacity', 1); g.classList.add('pop-in');
              api.sfx('pop');
              if (!await api.wait(350)) return;
            }
            api.say('The Sun helps the plant make food. The plant is the producer. The koala eats the plant, so it is a herbivore.');
            api.choice({
              q: 'Which one is the producer?',
              options: ['☀️ The Sun', '🌿 The plant', '🐨 The koala'],
              correct: 1,
              explain: 'The plant is the producer. It makes its own food in its leaves.',
              hints: { 0: 'The Sun gives light, but it does not make food.', 2: 'The koala eats food. It does not make it.' },
              onRight: () => api.star(),
            });
          };
          api.button('🐨 Feed the herbivore', async () => {
            if (busy) return;
            if (bites >= edible.length * bitesPer) { api.info('The koala is full up! Yum.'); return; }
            busy = true;
            const e = edible[Math.floor(bites / bitesPer) % edible.length];
            const n = bites % bitesPer;
            // Lean towards the leaf
            await api.tween(300, k => head.setAttribute('transform', `rotate(${(12 * k).toFixed(1)} 292 250) translate(${(10 * k).toFixed(1)} ${(-4 * k).toFixed(1)})`), W.ease.out);
            if (!api.alive()) return;
            // Take a bite out of the leaf tip
            // Bite 1 takes the tip, bites 2 and 3 take notches from each side
            const rad = e.a * Math.PI / 180;
            const d = [e.L + 2, e.L * .72, e.L * .45][n], off = [0, 14, -14][n];
            const bx = e.x + Math.cos(rad) * d - Math.sin(rad) * off, by = e.y + Math.sin(rad) * d + Math.cos(rad) * off;
            S.q(svg, `#${e.id}-m .lv-bites`).insertAdjacentHTML('beforeend',
              `<circle cx="${bx.toFixed(1)}" cy="${by.toFixed(1)}" r="${n ? 9 : 12}" fill="#000"/><circle cx="${(bx + Math.cos(rad) * 6).toFixed(1)}" cy="${(by + Math.sin(rad) * 6).toFixed(1)}" r="${n ? 7 : 9}" fill="#000"/>`);
            api.sfx('pop');
            mouth.classList.remove('lv-chew'); void mouth.getBBox(); mouth.classList.add('lv-chew');
            api.timeout(() => api.sfx('tick'), 200); api.timeout(() => api.sfx('tick'), 450);
            await api.tween(500, k => head.setAttribute('transform', `rotate(${(12 * (1 - k)).toFixed(1)} 292 250) translate(${(10 * (1 - k)).toFixed(1)} ${(-4 * (1 - k)).toFixed(1)})`), W.ease.inOut);
            if (!api.alive()) return;
            bites++;
            busy = false;
            if (bites === 1) api.say('Munch, munch! Koalas only eat plants.');
            if (bites >= need && !shown) showChain();
            else if (!shown) api.feedback(`🍃 Munch! ${bites} of ${need}`, 'ok', 1200);
          }, { cls: 'primary pulse', sound: null });
        },
      },
      {
        text: [
          'Leaves are **thin** and **flat** so that air can go in and out of them.',
          'Most leaves are **green**.',
        ],
        ask: 'Click each part of the leaf. Then show the air!',
        activity: true,
        scene(stage, api) {
          const LX = 240, LY = 250, L = 440, Wd = 120;
          let veins = `M${LX} ${LY} L${LX + L * .96} ${LY} `;
          for (let i = 1; i <= 5; i++) {
            const px = LX + L * (i / 6.2);
            const w = Wd * Math.sin(Math.PI * (i / 6.2)) * .85;
            veins += `M${px.toFixed(0)} ${LY} Q${(px + 30).toFixed(0)} ${(LY - w * .4).toFixed(0)} ${(px + 55).toFixed(0)} ${(LY - w * .9).toFixed(0)} M${px.toFixed(0)} ${LY} Q${(px + 30).toFixed(0)} ${(LY + w * .4).toFixed(0)} ${(px + 55).toFixed(0)} ${(LY + w * .9).toFixed(0)} `;
          }
          const svg = api.svg(`
            <rect width="800" height="520" fill="#EFF8E8"/>
            ${[...Array(12)].map((_, i) => `<circle cx="${(i * 137) % 800}" cy="${(i * 91) % 520}" r="${30 + (i % 3) * 20}" fill="#DDEFD2" opacity=".7"/>`).join('')}
            <g id="lv-part-stem" class="hot" data-part="stem">
              <rect x="112" y="0" width="30" height="520" fill="#4FA43E" stroke="#2F7A2A" stroke-width="3"/>
              <rect x="118" y="0" width="5" height="520" fill="#9BD58A" opacity=".7"/>
            </g>
            <g id="lv-leaf">
              <g id="lv-part-stalk" class="hot" data-part="stalk">
                <path d="M140 ${LY} Q190 ${LY - 8} ${LX} ${LY}" stroke="#2F7A2A" stroke-width="14" fill="none" stroke-linecap="round"/>
                <path d="M140 ${LY} Q190 ${LY - 8} ${LX} ${LY}" stroke="#58B047" stroke-width="9" fill="none" stroke-linecap="round"/>
              </g>
              <g id="lv-part-blade" class="hot" data-part="blade">
                <path d="${S.leafPath('pointed', L, Wd)}" transform="translate(${LX} ${LY})" fill="#4CAF50" stroke="#2E7D32" stroke-width="3"/>
                <path d="${S.leafPath('pointed', L * .9, Wd * .8)}" transform="translate(${LX + 20} ${LY - 6})" fill="#66BB6A" opacity=".35"/>
              </g>
              <g id="lv-part-vein" class="hot" data-part="vein">
                <path d="${veins}" stroke="#C5E8B7" stroke-width="4" fill="none" stroke-linecap="round"/>
                <path class="lv-hit" d="${veins}" stroke-width="16"/>
              </g>
            </g>
            <g id="lv-air" opacity="0"></g>
            <g id="lv-tags"></g>
          `);
          const info = {
            vein: { say: 'This is a vein. Veins carry water all through the leaf.', label: 'vein', at: [LX + 230, LY], tx: 520, ty: 440 },
            stalk: { say: 'This is the leaf stalk. It joins the leaf onto the stem.', label: 'leaf stalk', at: [190, LY - 4], tx: 250, ty: 80 },
            stem: { say: 'This is the stem. It holds the leaf up to the light.', label: 'stem', at: [127, 420], tx: 250, ty: 460 },
            blade: { say: 'This is the flat part of the leaf. It is thin and flat, and green.', label: 'flat, green leaf', at: [LX + 330, LY - 50], tx: 620, ty: 80 },
          };
          const found = new Set();
          S.qa(svg, '[data-part]').forEach(g => g.addEventListener('click', e => {
            e.stopPropagation();
            const id = g.dataset.part, it = info[id];
            S.qa(svg, '.lv-hl').forEach(n => n.classList.remove('lv-hl'));
            g.classList.add('lv-hl');
            api.sfx('pop');
            api.say(it.say);
            if (!found.has(id)) {
              found.add(id);
              S.q(svg, '#lv-tags').insertAdjacentHTML('beforeend', S.callout({ x: it.at[0], y: it.at[1], tx: it.tx, ty: it.ty, text: it.label, cls: 'callout pop-in' }));
              if (found.size === 4) {
                api.star();
                api.timeout(() => api.praise('You found every part of the leaf!'), 2800);
              } else api.feedback(`🔍 ${found.size} of 4 parts`, 'info', 1500);
            }
          }));
          // Air bubbles drift in through the top and out through the bottom
          const air = S.q(svg, '#lv-air');
          air.innerHTML = `${S.text(700, 150, 'air in', { size: 20, fill: '#1E6FA8' })}${S.arrow(700, 162, 640, 210, { color: '#64B5F6' })}
            ${S.text(430, 470, 'air out', { size: 20, fill: '#1E6FA8' })}${S.arrow(470, 320, 450, 440, { color: '#64B5F6' })}<g id="lv-bub"></g>`;
          const bubG = S.q(svg, '#lv-bub');
          const bubs = [];
          for (let i = 0; i < 16; i++) {
            const c = S.el('circle', { r: 5 + (i % 3) * 2, fill: '#E3F2FD', stroke: '#64B5F6', 'stroke-width': 2, opacity: .9 }, bubG);
            bubs.push({ c, x: LX + 60 + (i * 53) % 340, t: (i / 16), dir: i % 2 ? 1 : -1 });
          }
          let airOn = false;
          api.loop(dt => {
            if (!airOn) return;
            bubs.forEach(b => {
              b.t += dt * .35;
              if (b.t > 1) { b.t -= 1; }
              // dir -1: fall from above into the leaf; dir 1: come out below
              const y = b.dir < 0 ? LY - 190 + b.t * 190 : LY + b.t * 200;
              b.c.setAttribute('cx', (b.x + Math.sin(b.t * 9 + b.x) * 6).toFixed(1));
              b.c.setAttribute('cy', y.toFixed(1));
              b.c.setAttribute('opacity', (b.dir < 0 ? 1 - b.t * .7 : .3 + b.t * .7).toFixed(2));
            });
          });
          api.row();
          const airBtn = api.button('💨 Show air', () => {
            airOn = !airOn;
            air.style.transition = 'opacity .5s';
            air.setAttribute('opacity', airOn ? 1 : 0);
            airBtn.innerHTML = airOn ? '💨 Hide air' : '💨 Show air';
            if (airOn) { api.sfx('bubble'); api.say('Air goes in and out of the thin, flat leaf.'); }
          }, { cls: 'primary', sound: null });
          let turning = false;
          api.button('🔄 Turn the leaf on its side', async () => {
            if (turning) return;
            turning = true;
            api.sfx('swoosh');
            const lf = S.q(svg, '#lv-leaf');
            await api.tween(700, k => lf.setAttribute('transform', `translate(0 ${(LY * (1 - (1 - k * .95))).toFixed(1)}) scale(1 ${(1 - k * .95).toFixed(3)})`));
            if (!api.alive()) return;
            api.say('Look! From the side, the leaf is very thin.');
            if (!await api.wait(1800)) return;
            await api.tween(700, k => lf.setAttribute('transform', `translate(0 ${(LY * (1 - (.05 + k * .95))).toFixed(1)}) scale(1 ${(.05 + k * .95).toFixed(3)})`));
            lf.removeAttribute('transform');
            turning = false;
          }, { sound: null });
        },
      },
      {
        text: [
          'They use **sunlight**, air and water to make their food.',
          'If the leaf is **facing** the Sun, more light shines on it. A wide, flat leaf can **absorb** lots of sunlight.',
        ],
        tip: 'We have used the word \'absorb\' for materials, like sponge, that absorb water.',
        ask: 'Turn on sunlight, air and water. Drag the Sun across the sky!',
        activity: true,
        scene(stage, api) {
          const G = 420, PX = 300, TOP = 150;
          const nodes = [[370, 1], [330, -1], [290, 1], [250, -1], [210, 1], [175, -1]];
          const leafMk = (i) => {
            const k = 1 - i * .06;
            return S.leaf({ x: 0, y: 0, angle: 0, L: 74 * k, W: 30 * k, shape: 'round', color: '#4CAF50', stalk: 8 });
          };
          const svg = api.svg(`
            ${S.sky()}
            <g id="lv-cloud" opacity="0">${S.cloud({ x: 0, y: 0, s: 1.3, color: '#B0BEC5' })}</g>
            ${S.ground({ y: G, h: 100, fill: 'url(#g-soil)', grass: true })}
            <g id="lv-water" opacity="0">
              <g style="stroke-dasharray:8 12;animation:flow 1s linear infinite reverse">${S.roots({ x: PX, y: G + 2, depth: 80, spread: 90, color: '#3BA7E5', w: 3, seed: 6 })}</g>
            </g>
            ${S.roots({ x: PX, y: G + 2, depth: 80, spread: 90, color: '#EBD9B4', w: 4, seed: 6 }).replace('class="roots"', 'class="roots" opacity=".55"')}
            <path d="M${PX} ${G} L${PX} ${TOP}" stroke="#2F7A2A" stroke-width="12" stroke-linecap="round"/>
            <path d="M${PX} ${G} L${PX} ${TOP}" stroke="#4FA43E" stroke-width="8" stroke-linecap="round"/>
            <path id="lv-stemflow" class="flow" d="M${PX} ${G + 60} L${PX} ${TOP + 10}" stroke="#3BA7E5" stroke-width="4" opacity="0"/>
            <g id="lv-rays"></g>
            <g id="lv-leaves">${nodes.map(([y, side], i) => `<g class="lv-lf" transform="translate(${PX + side * 3} ${y})">${leafMk(i)}</g>`).join('')}</g>
            <g id="lv-spark"></g>
            <g id="lv-airfx" opacity="0">
              ${S.arrow(110, 240, 210, 270, { color: '#90A4AE', w: 6 })}${S.text(120, 225, 'air in', { size: 18, fill: '#455A64' })}
              ${S.arrow(390, 290, 490, 320, { color: '#90A4AE', w: 6 })}${S.text(470, 350, 'air out', { size: 18, fill: '#455A64' })}
            </g>
            <text id="lv-wlabel" x="${PX + 60}" y="${G + 70}" font-size="18" font-weight="800" fill="#BBDEFB" opacity="0">water from roots</text>
            <g id="lv-meter" transform="translate(690 30)">
              <rect x="-10" y="0" width="100" height="370" rx="16" fill="#fff" stroke="#3E9B4F" stroke-width="3"/>
              <rect x="10" y="40" width="60" height="280" rx="8" fill="#FFF3D6"/>
              <rect id="lv-fill" x="10" y="320" width="60" height="0" rx="8" fill="#FFB300"/>
              ${S.text(40, 344, 'Food', { size: 18, fill: '#2A7439' })}${S.text(40, 363, 'made', { size: 18, fill: '#2A7439' })}
              <text id="lv-pct" x="40" y="30" text-anchor="middle" font-size="18" font-weight="800" fill="#2A7439">0%</text>
            </g>
            <g id="lv-sun" transform="translate(120 80)" style="cursor:grab">${S.sun({ x: 0, y: 0, r: 34 })}
              <text x="0" y="62" text-anchor="middle" font-size="16" font-weight="800" fill="#9A6A00" class="blink-hint">drag me</text></g>
          `);
          const sunG = S.q(svg, '#lv-sun');
          const leaves = S.qa(svg, '.lv-lf').map((g, i) => ({ g, y: nodes[i][0], side: nodes[i][1], a: nodes[i][1] > 0 ? -20 : -160, L: 74 * (1 - i * .06) }));
          let sun = { x: 120, y: 80 };
          const on = { sun: false, air: false, water: false };
          let food = 0, done = false, sparkT = 0;
          api.draggable(svg, sunG, {
            bounds: { x1: 50, y1: 50, x2: 620, y2: 150 },
            onStart: () => { api.sfx('pick'); const t = S.q(sunG, 'text'); if (t) t.remove(); },
            onMove: p => { sun = { x: p.x, y: p.y }; },
            onDrop: () => { api.sfx('drop'); return true; },
          });
          const rays = S.q(svg, '#lv-rays');
          rays.innerHTML = leaves.map(() => `<path class="flow" stroke="#FFD54F" stroke-width="4" fill="none" stroke-linecap="round"/>`).join('');
          const rayEls = S.qa(rays, 'path');
          api.loop(dt => {
            let facing = 0;
            leaves.forEach((l, i) => {
              const lx = PX, ly = l.y;
              const th = Math.atan2(sun.y - ly, sun.x - lx) * 180 / Math.PI;
              // Turn so the top of the leaf faces the Sun
              const target = l.side > 0 ? S.clamp(th + 90, -55, 50) : S.clamp(th - 90, -235, -125);
              l.a += (target - l.a) * Math.min(1, dt * 1.6);
              l.g.setAttribute('transform', `translate(${lx + l.side * 3} ${ly}) rotate(${l.a.toFixed(1)})`);
              const normal = l.side > 0 ? l.a - 90 : l.a + 90;
              facing += Math.max(0, Math.cos((normal - th) * Math.PI / 180));
              // Ray from the Sun to the middle of the leaf
              const r = l.a * Math.PI / 180;
              const mx = lx + Math.cos(r) * l.L * .6, my = ly + Math.sin(r) * l.L * .6;
              rayEls[i].setAttribute('d', `M${sun.x.toFixed(0)} ${sun.y.toFixed(0)} L${mx.toFixed(0)} ${my.toFixed(0)}`);
            });
            facing /= leaves.length;
            const all = on.sun && on.air && on.water;
            if (all && !done) {
              food = Math.min(1, food + dt * .1 * (.3 + facing));
              sparkT += dt;
              if (sparkT > .25) {
                sparkT = 0;
                const l = leaves[Math.floor(Math.random() * leaves.length)];
                const r = l.a * Math.PI / 180, d = l.L * (.3 + Math.random() * .6);
                S.q(svg, '#lv-spark').insertAdjacentHTML('beforeend', sparkle(PX + Math.cos(r) * d, l.y + Math.sin(r) * d, 7 + Math.random() * 5));
                const sp = S.q(svg, '#lv-spark');
                if (sp.children.length > 14) sp.firstElementChild.remove();
                if (Math.random() < .3) api.sfx('sprinkle');
              }
              if (food >= 1) {
                done = true;
                api.star();
                api.praise('The leaves used sunlight, air and water to make lots of food!');
              }
            }
            const f = S.q(svg, '#lv-fill');
            f.setAttribute('y', (320 - 280 * food).toFixed(1)); f.setAttribute('height', (280 * food).toFixed(1));
            S.q(svg, '#lv-pct').textContent = Math.round(food * 100) + '%';
            S.q(svg, '#lv-cloud').setAttribute('transform', `translate(${sun.x - 10} ${sun.y + 10})`);
          });
          const setOn = (key, btn) => {
            on[key] = !on[key];
            btn.classList.toggle('primary', on[key]);
            if (key === 'sun') {
              rays.style.opacity = on.sun ? 1 : 0;
              S.q(svg, '#lv-cloud').setAttribute('opacity', on.sun ? 0 : 1);
              api.sfx(on.sun ? 'magic' : 'click');
            }
            if (key === 'air') { S.q(svg, '#lv-airfx').setAttribute('opacity', on.air ? 1 : 0); api.sfx(on.air ? 'wind' : 'click'); }
            if (key === 'water') {
              ['#lv-water', '#lv-stemflow', '#lv-wlabel'].forEach(s => S.q(svg, s).setAttribute('opacity', on.water ? 1 : 0));
              api.sfx(on.water ? 'water' : 'click');
            }
            const n = on.sun + on.air + on.water;
            if (n === 3) { api.feedback('✨ Making food!', 'ok', 2000); api.say('Sunlight, air and water. Now the leaves can make food!'); }
            else if (on[key]) api.info(`The leaves need all three. ${3 - n} more to go!`);
          };
          rays.style.opacity = 0;
          S.q(svg, '#lv-cloud').setAttribute('opacity', 1);
          api.row();
          const b1 = api.button('☀️ Sunlight', b => setOn('sun', b), { sound: null });
          const b2 = api.button('💨 Air', b => setOn('air', b), { sound: null });
          const b3 = api.button('💧 Water', b => setOn('water', b), { sound: null });
          [b1, b2, b3].forEach(b => { b.style.minWidth = '130px'; });
        },
      },
      {
        title: 'Wide or narrow?',
        text: ['A wide, flat leaf can **absorb** lots of **sunlight**.'],
        ask: 'Shine the Sun. Which leaf catches more sunlight?',
        activity: true,
        scene(stage, api) {
          const G = 470;
          const leafDefs = [
            { x: 230, y: 440, L: 250, W: 100, shape: 'round', name: 'wide' },
            { x: 570, y: 440, L: 250, W: 16, shape: 'long', name: 'narrow' },
          ];
          const svg = api.svg(`
            ${S.sky()}
            ${S.sun({ x: 400, y: 60, r: 36 })}
            ${S.ground({ y: G, h: 50, fill: 'url(#g-grass)' })}
            ${leafDefs.map((l, i) => `<g transform="translate(${l.x} ${l.y}) rotate(-90)">
              <path d="M-40 0 L0 0" stroke="#2F7A2A" stroke-width="7"/>
              <path id="lv-lp${i}" d="${S.leafPath(l.shape, l.L, l.W)}" fill="#4CAF50" stroke="#2E7D32" stroke-width="3"/>
              <path d="M0 0 L${l.L * .95} 0" stroke="#C5E8B7" stroke-width="3"/></g>`).join('')}
            ${leafDefs.map((l, i) => `<g transform="translate(${l.x} 150)"><rect x="-80" y="-24" width="160" height="40" rx="20" fill="#fff" opacity=".92"/>
              <text x="0" y="4" text-anchor="middle" font-size="19" font-weight="800" fill="#2A7439">${l.name}: <tspan id="lv-n${i}">0</tspan> ☀️</text></g>`).join('')}
            <g id="lv-beams"></g>
          `);
          const paths = leafDefs.map((l, i) => S.q(svg, '#lv-lp' + i));
          const counts = [0, 0];
          const beamsG = S.q(svg, '#lv-beams');
          const beams = [];
          let active = 0, asked = false;
          // Is a point inside the leaf? Convert to the leaf's own coordinates first.
          const hit = (i, x, y) => {
            const l = leafDefs[i];
            const p = new DOMPoint(l.y - y, x - l.x);
            return paths[i].isPointInFill(p);
          };
          api.loop(dt => {
            for (let k = beams.length - 1; k >= 0; k--) {
              const b = beams[k];
              b.y += dt * 260;
              if (b.state === 0 && hit(b.side, b.x, b.y)) {
                b.state = 1;
                counts[b.side]++;
                S.q(svg, '#lv-n' + b.side).textContent = counts[b.side];
                beamsG.insertAdjacentHTML('beforeend', sparkle(b.x, b.y, 10));
                api.sfx('tick');
                b.n.remove(); beams.splice(k, 1); active--;
                continue;
              }
              if (b.y > G + 10) { b.n.remove(); beams.splice(k, 1); active--; continue; }
              b.n.setAttribute('transform', `translate(${b.x.toFixed(1)} ${b.y.toFixed(1)})`);
            }
            if (beamsG.children.length > 30) beamsG.querySelectorAll('.lv-tw').forEach((n, i) => { if (i < 10) n.remove(); });
          });
          const shine = () => {
            if (active > 0) return;
            api.sfx('magic');
            counts[0] = counts[1] = 0;
            S.q(svg, '#lv-n0').textContent = 0; S.q(svg, '#lv-n1').textContent = 0;
            beamsG.innerHTML = '';
            // The same number of sunbeams falls over each leaf
            for (let i = 0; i < 40; i++) {
              const side = i % 2;
              const x = leafDefs[side].x - 120 + Math.random() * 240;
              api.timeout(() => {
                const n = S.frag(`<g><path d="M0 -18 L0 0" stroke="#FFC107" stroke-width="5" stroke-linecap="round"/><circle r="5" fill="#FFF59D" stroke="#FFB300"/></g>`);
                beamsG.appendChild(n);
                beams.push({ n, x, y: 110, side, state: 0 });
              }, i * 90);
              active++;
            }
            api.timeout(() => {
              if (asked) return;
              asked = true;
              api.choice({
                q: 'Which leaf absorbed more sunlight?',
                options: ['The wide leaf', 'The narrow leaf'],
                correct: 0,
                explain: 'A wide, flat leaf has lots of space to absorb sunlight.',
                hint: 'Look at the numbers. Which leaf caught more sunbeams?',
                onRight: () => api.star(),
              });
            }, 5600);
          };
          api.row();
          api.button('☀️ Shine the Sun', shine, { cls: 'primary pulse', sound: null });
        },
      },
    ],
  });
})();
