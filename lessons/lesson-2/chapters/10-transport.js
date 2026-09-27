// Chapter 10: Transport in plants
(() => {
  const DYES = { red: '#E3344F', blue: '#2F6FE0', green: '#23A04A', purple: '#8E44C8' };
  const PALE_WATER = '#D6EEFB';

  // One ruffled carnation petal pointing up, with a zigzag top edge
  function petalD(r, halfDeg) {
    const n = 7, pts = [];
    for (let i = 0; i <= n; i++) {
      const a = (-halfDeg + (2 * halfDeg) * i / n - 90) * Math.PI / 180;
      const rr = i % 2 ? r * .84 : r;
      pts.push(`${S.f1(Math.cos(a) * rr)} ${S.f1(Math.sin(a) * rr)}`);
    }
    return { d: `M0 0 L${pts.join(' L')}Z`, edge: `M${pts.join(' L')}` };
  }

  // White carnation. Stem bottom at (0,0).
  // tint 0..1 colours the petals, rise 0..1 shows colour moving up the stem.
  function carnation({ dye = DYES.red, tint = 0, rise = 0, stemH = 320 } = {}) {
    const hy = -stemH;
    const stemD = `M0 0 C3 ${hy * .35} -5 ${hy * .7} 0 ${hy + 40}`;
    const leafPair = y => `<path d="M0 ${y} Q-20 ${y - 6} -44 ${y - 32} Q-16 ${y - 18} 0 ${y - 5}Z" fill="#79A986" stroke="#4E7F5C" stroke-width="1.5"/>
      <path d="M0 ${y} Q20 ${y - 6} 44 ${y - 32} Q16 ${y - 18} 0 ${y - 5}Z" fill="#79A986" stroke="#4E7F5C" stroke-width="1.5"/>`;
    let petals = '';
    const layers = [{ r: 44, n: 11, h: 19, off: 0 }, { r: 35, n: 9, h: 22, off: 14 }, { r: 24, n: 7, h: 26, off: 7 }];
    layers.forEach((L, li) => {
      const p = petalD(L.r, L.h);
      const fill = S.mix('#FFFFFF', dye, tint * (.22 + li * .1));
      const edgeCol = S.mix('#D5D5D5', dye, Math.min(1, tint * 1.4));
      for (let i = 0; i < L.n; i++) {
        const rot = L.off + i * 360 / L.n;
        let veins = '';
        if (tint > 0) {
          for (let v = -1; v <= 1; v++) {
            const a = (v * L.h * .55 - 90) * Math.PI / 180;
            veins += `M0 0 L${S.f1(Math.cos(a) * L.r * .82)} ${S.f1(Math.sin(a) * L.r * .82)} `;
          }
        }
        petals += `<g transform="rotate(${S.f1(rot)})">
          <path d="${p.d}" fill="${fill}" stroke="#CFCFCF" stroke-width="1"/>
          ${tint > 0 ? `<path d="${veins}" stroke="${dye}" stroke-width="1.2" opacity="${S.f1(tint * .75)}" fill="none"/>
          <path d="${p.edge}" stroke="${edgeCol}" stroke-width="${S.f1(1.5 + tint * 2.5)}" fill="none" stroke-linejoin="round" opacity="${S.f1(.4 + tint * .6)}"/>` : ''}
        </g>`;
      }
    });
    return `<g class="tr-carnation">
      <path d="${stemD}" stroke="#3F7A4A" stroke-width="7" fill="none" stroke-linecap="round"/>
      <path d="${stemD}" stroke="#6DAF6E" stroke-width="4.5" fill="none" stroke-linecap="round"/>
      <path class="tr-dye" d="${stemD}" pathLength="100" stroke="${dye}" stroke-width="2.6" fill="none" stroke-linecap="round"
        stroke-dasharray="100 100" stroke-dashoffset="${S.f1(100 * (1 - rise))}" opacity="${rise > 0 ? .95 : 0}"/>
      ${leafPair(-150)}${leafPair(-225)}
      <path d="M-11 ${hy + 46} L-14 ${hy + 16} L14 ${hy + 16} L11 ${hy + 46}Z" fill="#6DAF6E" stroke="#3F7A4A" stroke-width="1.5"/>
      <g transform="translate(0 ${hy})">${petals}<circle r="6" fill="${S.mix('#F4F4F4', dye, tint * .5)}"/></g>
    </g>`;
  }

  // Glass beaker with cm³ marks. Bottom centre at (x, y). 1 cm³ = 0.9 px.
  function beakerParts(x, y, { level = 150, color = PALE_WATER, idp = 'tr' } = {}) {
    const w = 130, h = 200, top = y - h, ly = y - level * .9;
    let marks = '';
    [50, 100, 150, 200].forEach(v => {
      const my = y - v * .9;
      marks += `<path d="M${x - w / 2} ${my} l16 0" stroke="#34495E" stroke-width="2"/>
        <text x="${x - w / 2 + 20}" y="${my + 6}" font-size="16" font-weight="800" fill="#34495E">${v}</text>`;
    });
    return {
      liquid: `<rect id="${idp}-liquid" x="${x - w / 2 + 3}" y="${ly}" width="${w - 6}" height="${y - ly - 3}" rx="6" fill="${color}" opacity=".85"/>`,
      glass: `<path d="M${x - w / 2 - 8} ${top} L${x - w / 2} ${top + 8} L${x - w / 2} ${y - 10} Q${x - w / 2} ${y} ${x - w / 2 + 10} ${y} L${x + w / 2 - 10} ${y} Q${x + w / 2} ${y} ${x + w / 2} ${y - 10} L${x + w / 2} ${top + 8} L${x + w / 2 + 8} ${top}"
          fill="url(#g-glass)" stroke="#6E8CA0" stroke-width="3.5" stroke-linejoin="round"/>
        ${marks}<text x="${x + w / 2 - 36}" y="${top + 26}" font-size="16" font-weight="800" fill="#34495E">cm³</text>`,
      liquidTop: ly,
    };
  }

  // Food colouring dropper bottle. Bottom at (0,0), tip at (0,-118).
  function bottle(color) {
    return `<g class="tr-bottle">
      <path class="tr-body" d="M-26 -6 C-30 -40 -26 -62 -12 -70 L12 -70 C26 -62 30 -40 26 -6 Q24 0 16 0 L-16 0 Q-24 0 -26 -6Z" fill="${S.mix(color, '#000', .35)}" stroke="#222" stroke-width="2"/>
      <path d="M-18 -50 C-20 -30 -18 -20 -16 -10" stroke="#fff" stroke-width="4" opacity=".35" fill="none" stroke-linecap="round"/>
      <rect x="-14" y="-78" width="28" height="10" rx="2" fill="#333"/>
      <path d="M-14 -78 L0 -118 L14 -78Z" fill="${color}" stroke="${S.mix(color, '#000', .3)}" stroke-width="2"/>
      <path d="M-6 -84 L-2 -104" stroke="#fff" stroke-width="3" opacity=".5" stroke-linecap="round"/>
    </g>`;
  }

  // A small clock face with an hour hand
  const clock = (x, y, id) => `<g transform="translate(${x} ${y})">
      <circle r="34" fill="#fff" stroke="#34495E" stroke-width="4"/>
      ${[...Array(12)].map((_, i) => `<path d="M0 -28 L0 -23" stroke="#34495E" stroke-width="3" transform="rotate(${i * 30})"/>`).join('')}
      <path id="${id}-min" d="M0 0 L0 -25" stroke="#7F8C8D" stroke-width="3" stroke-linecap="round"/>
      <path id="${id}-hr" d="M0 0 L0 -17" stroke="#C8452F" stroke-width="5" stroke-linecap="round"/>
      <circle r="4" fill="#34495E"/></g>`;

  // Move a point along a list of points; s = distance travelled
  function along(pts, s) {
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1], b = pts[i], d = Math.hypot(b.x - a.x, b.y - a.y);
      if (s <= d) return { x: a.x + (b.x - a.x) * s / d, y: a.y + (b.y - a.y) * s / d, done: false };
      s -= d;
    }
    const e = pts[pts.length - 1];
    return { x: e.x, y: e.y, done: true };
  }

  App.chapter({
    id: 'transport',
    title: 'Transport in plants',
    icon: '🚚',
    group: 'Moving water',
    keywords: [
      { w: 'transport', d: 'To move things from one place to another.' },
      { w: 'inside', d: 'In the middle of something, where we cannot always see.' },
      { w: 'evidence', d: 'Something you can see or measure that shows an idea is true.' },
      { w: 'correct', d: 'Right, with no mistakes.' },
      { w: 'colouring', d: 'Something we add to change the colour of a thing, like food colouring.' },
      { w: 'beaker', d: 'A see-through container that scientists use to hold and measure liquids.' },
      { w: 'through', d: 'In at one end and out at the other, along the inside of something.' },
    ],
    steps: [
      // ---------- 1. What does a plant move? ----------
      {
        text: ['**Transport** means to move things. Plants need to move things from one part of the plant to another.'],
        ask: 'Can you think of things that a plant needs to move? What do roots need to send to the leaves? Suggest what leaves may need to send to other parts of the plant. Drag each thing onto the right arrow.',
        activity: true,
        scene(stage, api) {
          const TX = 380, GY = 372;
          const r = S.rng(21);
          // Leaves spread over an oval crown
          let crown = '';
          const crownPts = [];
          for (let i = 0; i < 90; i++) {
            const a = r() * Math.PI * 2, d = Math.sqrt(r());
            const x = TX + Math.cos(a) * d * 150, y = 150 + Math.sin(a) * d * 100;
            crownPts.push({ x, y });
            const col = ['#3E9B4F', '#4CAF50', '#2E8540', '#5CBF60'][i % 4];
            crown += S.leaf({ x, y, angle: r() * 360, L: 26, W: 11, color: col, stalk: 3, cls: 'leaf' });
          }
          const branch = (x1, y1, x2, y2, w) => `<path d="M${x1} ${y1} Q${(x1 + x2) / 2 + (x2 > x1 ? -10 : 10)} ${(y1 + y2) / 2 + 10} ${x2} ${y2}" stroke="#6D4C33" stroke-width="${w}" fill="none" stroke-linecap="round"/>`;
          const bigArrow = (x, up, fill, stroke, label) => {
            const t = 110, b = 450, hw = 34;
            const d = up
              ? `M${x - hw * .6} ${b} L${x - hw * .6} ${t + 50} L${x - hw} ${t + 50} L${x} ${t} L${x + hw} ${t + 50} L${x + hw * .6} ${t + 50} L${x + hw * .6} ${b}Z`
              : `M${x - hw * .6} ${t} L${x - hw * .6} ${b - 50} L${x - hw} ${b - 50} L${x} ${b} L${x + hw} ${b - 50} L${x + hw * .6} ${b - 50} L${x + hw * .6} ${t}Z`;
            return `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="3" stroke-linejoin="round"/>
              <text transform="translate(${x + 7} 280) rotate(-90)" text-anchor="middle" font-size="18" font-weight="800" fill="${S.mix(stroke, '#000', .35)}">${label}</text>`;
          };
          const token = (id, emoji, label, x, y, col) => `<g class="tr-token" data-id="${id}" transform="translate(${x} ${y})">
              <circle r="31" fill="#fff" stroke="${col}" stroke-width="4" filter="url(#f-soft)"/>
              <text y="11" text-anchor="middle" font-size="30">${emoji}</text>
              <rect x="-40" y="34" width="80" height="24" rx="12" fill="${col}"/>
              <text y="52" text-anchor="middle" font-size="16" font-weight="800" fill="#fff">${label}</text></g>`;
          const svg = api.svg(`
            ${S.sky(800, GY)}
            <rect y="${GY}" width="800" height="${520 - GY}" fill="url(#g-soil)"/>
            <path d="M0 ${GY} L800 ${GY}" stroke="#5BAA4E" stroke-width="6"/>
            <clipPath id="tr-soilclip"><rect y="${GY + 3}" width="800" height="200"/></clipPath>
            <g clip-path="url(#tr-soilclip)">${S.roots({ x: TX, y: GY + 2, depth: 120, spread: 150, color: '#7B5436', w: 11, seed: 8, levels: 2 })}</g>
            <path d="M${TX - 20} ${GY + 4} C${TX - 14} 320 ${TX - 9} 270 ${TX - 7} 225 L${TX + 7} 225 C${TX + 9} 270 ${TX + 14} 320 ${TX + 20} ${GY + 4}Z" fill="url(#g-bark)"/>
            ${branch(TX, 245, 270, 170, 11)}${branch(TX, 238, 490, 160, 11)}${branch(TX, 228, 320, 95, 9)}${branch(TX, 228, 445, 90, 9)}
            ${branch(TX, 230, TX, 70, 9)}${branch(300, 185, 250, 130, 5)}${branch(460, 172, 510, 120, 5)}
            <ellipse cx="${TX}" cy="150" rx="140" ry="92" fill="#4CAF50" opacity=".35"/>
            <g class="sway">${crown}</g>
            <g id="tr-calls">
              ${S.callout({ x: 505, y: 150, tx: 615, ty: 110, text: 'leaf' })}
              ${S.callout({ x: 470, y: 180, tx: 615, ty: 200, text: 'branch' })}
              ${S.callout({ x: TX + 12, y: 310, tx: 615, ty: 290, text: 'trunk' })}
              ${S.callout({ x: 450, y: 440, tx: 615, ty: 440, text: 'root' })}
            </g>
            <g id="tr-up">${bigArrow(70, true, '#CDEBFC', '#3BA7E5', 'up to the leaves')}</g>
            <g id="tr-down">${bigArrow(165, false, '#FFF1C2', '#E5A00D', 'from the leaves')}</g>
            <g id="tr-parts"></g>
            <rect x="682" y="92" width="110" height="330" rx="18" fill="#FFF8EC" stroke="#E7A07F" stroke-width="3" stroke-dasharray="8 6"/>
            ${S.text(737, 80, 'Drag me!', { size: 17, fill: '#9A3222' })}
            ${token('water', '💧', 'water', 737, 140, '#3BA7E5')}
            ${token('minerals', '⛏️', 'minerals', 737, 245, '#F57C00')}
            ${token('food', '🍬', 'food', 737, 350, '#43A047')}
          `);
          const slots = { water: { zone: 'up', x: 70, y: 190 }, minerals: { zone: 'up', x: 70, y: 345 }, food: { zone: 'down', x: 165, y: 250 } };
          const says = {
            water: 'Yes! Roots take in water from the soil and send it up to the leaves.',
            minerals: 'Yes! Minerals from the soil go up from the roots with the water.',
            food: 'Yes! Leaves make food for the plant. The food is sent from the leaves to all the other parts.',
          };
          let placed = 0;
          const tokens = S.qa(svg, '.tr-token');
          const place = (node, id, drag) => {
            const s = slots[id];
            drag.animateTo(s.x, s.y);
            node.style.pointerEvents = 'none';
            node.classList.add('tr-done');
            placed++;
            api.sfx('drop');
            api.timeout(() => api.sfx('pop'), 150);
            if (placed < 3) { api.feedback('✔ ' + id, 'ok'); api.say(says[id]); }
            else { api.say(says[id]); api.timeout(finish, 2600); }
          };
          tokens.forEach(node => {
            const id = node.dataset.id;
            const drag = api.draggable(svg, node, {
              bounds: { x1: 30, y1: 30, x2: 770, y2: 490 },
              onStart: () => api.sfx('pick'),
              onDrop: pos => {
                const zone = pos.x < 118 ? 'up' : pos.x < 215 ? 'down' : null;
                if (!zone || pos.y < 90 || pos.y > 470) return false;
                if (zone === slots[id].zone) { place(node, id, drag); return true; }
                api.oops(id === 'food' ? 'Food is made in the leaves. Does it go up to the leaves, or from the leaves?' : `The roots take in ${id} from the soil. Which way must it go to reach the leaves?`);
                return false;
              },
            });
            node._drag = drag;
          });
          // Particles travel through the tree once everything is sorted
          const parts = [];
          const partsG = S.q(svg, '#tr-parts');
          const rootTips = [{ x: 300, y: 470 }, { x: 460, y: 460 }, { x: 390, y: 492 }, { x: 330, y: 430 }, { x: 440, y: 420 }, { x: 270, y: 420 }];
          const pickCrown = () => crownPts[Math.floor(Math.random() * crownPts.length)];
          const spawn = kind => {
            const rt = rootTips[Math.floor(Math.random() * rootTips.length)], c = pickCrown();
            const trunkUp = [{ x: TX - 4 + Math.random() * 8, y: GY }, { x: TX - 3 + Math.random() * 6, y: 235 }];
            const pts = kind === 'food' ? [c, ...trunkUp.slice().reverse(), rt] : [rt, ...trunkUp, c];
            const col = kind === 'water' ? '#1E88E5' : kind === 'minerals' ? '#F57C00' : '#FFD600';
            const n = S.el('circle', { r: kind === 'food' ? 6 : 5, fill: col, stroke: kind === 'food' ? '#9A7B00' : '#fff', 'stroke-width': 1.5 }, partsG);
            parts.push({ n, pts, s: 0, sp: 70 + Math.random() * 40 });
          };
          let flowing = false;
          const finish = () => {
            api.star();
            api.praise('Water and minerals go up. Food comes down from the leaves.');
            if (flowing) return;
            flowing = true;
            S.q(svg, '#tr-up').classList.add('tr-glow');
            S.q(svg, '#tr-down').classList.add('tr-glow');
            let acc = 0;
            api.loop(dt => {
              acc += dt;
              if (acc > .12) { acc = 0; spawn(['water', 'minerals', 'water', 'food'][Math.floor(Math.random() * 4)]); }
              for (let i = parts.length - 1; i >= 0; i--) {
                const p = parts[i];
                p.s += p.sp * dt;
                const q = along(p.pts, p.s);
                p.n.setAttribute('cx', q.x.toFixed(1)); p.n.setAttribute('cy', q.y.toFixed(1));
                if (q.done) { p.n.remove(); parts.splice(i, 1); }
              }
            });
          };
          if (!document.getElementById('tr-style')) {
            document.head.insertAdjacentHTML('beforeend', `<style id="tr-style">
              .tr-glow { animation: tr-glow 1.2s ease-in-out infinite; }
              @keyframes tr-glow { 50% { filter: brightness(1.15) drop-shadow(0 0 8px #FFE56B); } }
            </style>`);
          }
          api.row();
          api.label('<span style="color:#1E88E5">● water</span> &nbsp; <span style="color:#F57C00">● minerals</span> &nbsp; <span style="color:#B8960B">● food</span>');
          api.button('↺ Start again', () => {
            api.sfx('swoosh');
            tokens.forEach(n => { n.style.pointerEvents = ''; n.classList.remove('tr-done'); n._drag.home(); });
            placed = 0;
          }, { cls: 'small' });
        },
      },

      // ---------- 2. The coloured water experiment ----------
      {
        title: 'Look for evidence',
        text: [
          'We cannot see things moving **inside** plants but we can look for **evidence** that it is happening. Scientists look for evidence to show them whether something is **correct**.',
          'Let\'s look for some evidence that things move inside plants. You will need: white flowers, food **colouring** and a small **beaker** of water.',
        ],
        ask: 'Choose a food colouring. Squeeze a few drops into the water. Put the stem of the flower into the coloured water. Then look at the flower regularly for a day or two.',
        activity: true,
        scene(stage, api) {
          const BX = 330, BY = 468;
          let dye = null, phase = 0;
          const bk = beakerParts(BX, BY, { level: 150, idp: 'tr2' });
          const svg = api.svg(`
            <rect width="800" height="520" fill="#FFF3DC"/>
            <g id="tr2-win">
              <rect x="40" y="36" width="170" height="130" rx="6" fill="#8FD0F5" id="tr2-sky"/>
              <g id="tr2-sun">${S.sun({ x: 150, y: 90, r: 24, rays: false })}</g>
              <g id="tr2-moon" opacity="0"><circle cx="150" cy="86" r="20" fill="#FFF6C9"/><circle cx="160" cy="80" r="17" fill="#23305E" class="tr2-mooncut"/></g>
              <rect x="40" y="36" width="170" height="130" rx="6" fill="none" stroke="#fff" stroke-width="10"/>
              <path d="M125 36 L125 166 M40 101 L210 101" stroke="#fff" stroke-width="6"/>
            </g>
            <rect x="0" y="${BY}" width="800" height="52" fill="#C9955E"/><rect x="0" y="${BY - 4}" width="800" height="8" fill="#A8743F"/>
            ${S.text(150, 505, 'food colouring', { size: 17, fill: '#fff' })}
            ${S.text(BX, 505, 'beaker of water', { size: 17, fill: '#fff' })}
            <g id="tr2-fllabel">${S.text(620, 505, 'white flower', { size: 17, fill: '#fff' })}</g>
            <g id="tr2-slot"></g>
            ${bk.liquid}
            <g id="tr2-swirl"></g>
            ${bk.glass}
            <g id="tr2-drops"></g>
            <g id="tr2-bottle" transform="translate(150 ${BY - 2})"><g id="tr2-bot-in">${bottle('#BBBBBB')}</g></g>
            <g id="tr2-flower" transform="translate(620 ${BY - 4})"><g id="tr2-fl-in">${carnation({})}</g>
              <circle id="tr2-ring" cx="0" cy="-320" r="56" class="target-ring" style="display:none"/></g>
            <g id="tr2-clockG" opacity="0">${clock(720, 80, 'tr2')}
              <rect x="652" y="124" width="136" height="32" rx="16" fill="#fff" stroke="#34495E" stroke-width="2"/>
              <text id="tr2-clockTxt" x="720" y="146" text-anchor="middle" font-size="18" font-weight="800" fill="#34495E">0 hours</text></g>
            <g id="tr2-target" style="display:none"><rect x="${BX - 75}" y="262" width="150" height="210" rx="12" fill="none" stroke="#E0A800" stroke-width="4" stroke-dasharray="10 8" class="blink-hint"/></g>
          `);
          const liquid = S.q(svg, '#tr2-liquid');
          const flower = S.q(svg, '#tr2-flower'), flIn = S.q(svg, '#tr2-fl-in');
          const botIn = S.q(svg, '#tr2-bot-in'), botG = S.q(svg, '#tr2-bottle');

          // Row 1: pick a colour
          const colRow = api.row();
          api.label('1. Choose a colour:', colRow);
          const colBtns = Object.keys(DYES).map(name => {
            const b = api.button(`<span style="display:inline-block;width:16px;height:16px;border-radius:50%;background:${DYES[name]};vertical-align:-2px"></span> ${name}`, () => {
              if (phase > 0) return;
              dye = DYES[name];
              botIn.innerHTML = bottle(dye);
              colBtns.forEach(x => x.classList.toggle('primary', x === b));
              api.sfx('pop');
              api.say(`${name} food colouring. Now squeeze the bottle.`);
              squeezeBtn.disabled = false;
              squeezeBtn.classList.add('pulse');
            }, { parent: colRow, cls: 'small', sound: null });
            return b;
          });
          const actRow = api.row();
          const squeezeBtn = api.button('2. 💧 Squeeze the bottle', () => squeeze(), { parent: actRow, cls: 'primary', sound: 'click' });
          squeezeBtn.disabled = true;
          api.button('↺ Start again', () => reset(), { parent: actRow, cls: 'small' });

          let busy = false;
          async function squeeze() {
            if (busy || !dye || phase > 0) return;
            busy = true; squeezeBtn.disabled = true; squeezeBtn.classList.remove('pulse');
            colBtns.forEach(b => b.disabled = true);
            api.sfx('whoosh');
            // Lift the bottle over the beaker and turn it upside down
            if (!await api.tween(900, k => botG.setAttribute('transform', `translate(${150 + (BX - 150) * k} ${BY - 2 - (BY - 2 - 135) * k}) rotate(${180 * k})`))) return;
            const dropsG = S.q(svg, '#tr2-drops');
            for (let i = 0; i < 5; i++) {
              botIn.setAttribute('transform', 'scale(1.12 .94)');
              api.timeout(() => botIn.setAttribute('transform', ''), 160);
              const d = S.frag(S.drop({ x: BX, y: 255, s: .9, color: dye }));
              dropsG.appendChild(d);
              if (!await api.tween(380, k => d.setAttribute('transform', `translate(${BX} ${255 + (bk.liquidTop - 250) * k}) scale(.9)`), t => t * t)) return;
              d.remove();
              api.sfx('drip');
              const rip = S.el('ellipse', { cx: BX, cy: bk.liquidTop + 2, rx: 4, ry: 2, fill: 'none', stroke: dye, 'stroke-width': 3 }, dropsG);
              api.tween(600, k => { rip.setAttribute('rx', 4 + k * 50); rip.setAttribute('ry', 2 + k * 8); rip.setAttribute('opacity', 1 - k); }).then(() => rip.remove());
              liquid.setAttribute('fill', S.mix(PALE_WATER, dye, (i + 1) / 5 * .92));
              await api.wait(200);
              if (!api.alive()) return;
            }
            // Swirl the colour through the water
            api.sfx('bubble');
            const sw = S.q(svg, '#tr2-swirl');
            sw.innerHTML = `<path d="M${BX} 410 m-44 0 a44 22 0 1 1 88 0 a34 16 0 1 1 -68 0 a22 10 0 1 1 44 0" stroke="${S.mix(dye, '#fff', .4)}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
            api.tween(1600, k => sw.setAttribute('transform', `translate(${BX} 410) rotate(${k * 360}) scale(1 ${1 - k * .3}) translate(${-BX} -410)`)).then(() => { sw.innerHTML = ''; });
            if (!await api.tween(900, k => botG.setAttribute('transform', `translate(${BX + (150 - BX) * k} ${135 + (BY - 2 - 135) * k}) rotate(${180 * (1 - k)})`))) return;
            phase = 1; busy = false;
            api.say('The water is coloured now. Next, drag the white flower and put its stem into the coloured water.');
            api.info('3. Drag the flower into the beaker', false);
            S.q(svg, '#tr2-ring').style.display = '';
            S.q(svg, '#tr2-target').style.display = '';
          }

          const flDrag = api.draggable(svg, flower, {
            bounds: { x1: 60, y1: 300, x2: 760, y2: 480 },
            onStart: () => { api.sfx('pick'); S.q(svg, '#tr2-ring').style.display = 'none'; },
            onDrop: pos => {
              if (phase !== 1) { api.oops(phase === 0 ? 'First put some food colouring into the water.' : 'The flower is already in the water.'); return false; }
              if (Math.abs(pos.x - BX) < 90 && pos.y > 330) { putIn(); return true; }
              api.sfx('drop');
              S.q(svg, '#tr2-ring').style.display = '';
              return false;
            },
          });
          function putIn() {
            phase = 2;
            flDrag.animateTo(BX, BY - 8);
            S.q(svg, '#tr2-slot').appendChild(flower);
            flower.style.pointerEvents = 'none';
            S.q(svg, '#tr2-fllabel').style.display = 'none';
            S.q(svg, '#tr2-target').style.display = 'none';
            api.sfx('bubble');
            S.q(svg, '#tr2-clockG').setAttribute('opacity', 1);
            api.say('Now look at the flower regularly for a day or two. Slide the time along.');
            makeSlider();
          }
          let sl = null, lastMark = -1, ready = false;
          const marks = [
            { h: 6, say: 'After a few hours, the coloured water is moving up the stem.' },
            { h: 18, say: 'The colour has reached the top of the stem.' },
            { h: 30, say: 'Look at the edges of the petals. They are changing colour!' },
            { h: 46, say: 'After two days, the white petals are coloured. The coloured water moved up inside the flower!' },
          ];
          function setTime(h) {
            const rise = S.clamp(h / 18), tint = S.clamp((h - 14) / 32);
            flIn.innerHTML = carnation({ dye, rise, tint });
            S.q(svg, '#tr2-hr').setAttribute('transform', `rotate(${h * 30})`);
            S.q(svg, '#tr2-min').setAttribute('transform', `rotate(${h * 360})`);
            S.q(svg, '#tr2-clockTxt').textContent = h < 24 ? `${h} hours` : `Day ${Math.floor(h / 24) + 1}, ${h} h`;
            // Day and night in the window
            const tod = (9 + h) % 24, night = tod < 6 || tod >= 20;
            S.q(svg, '#tr2-sky').setAttribute('fill', night ? '#23305E' : '#8FD0F5');
            S.q(svg, '#tr2-sun').setAttribute('opacity', night ? 0 : 1);
            S.q(svg, '#tr2-moon').setAttribute('opacity', night ? 1 : 0);
            liquid.setAttribute('y', bk.liquidTop + h * .35);
            liquid.setAttribute('height', BY - bk.liquidTop - 3 - h * .35);
            let m = -1;
            marks.forEach((mk, i) => { if (h >= mk.h) m = i; });
            if (m > lastMark && ready) { api.sfx(m === 3 ? 'magic' : 'grow'); api.say(marks[m].say); }
            if (m > lastMark) lastMark = m;
            if (m === 3 && ready) { api.star(); api.timeout(() => api.praise('That is our evidence.'), 3500); }
          }
          function makeSlider() {
            ready = false;
            sl = api.slider({ label: '🕑 Time', min: 0, max: 48, step: 1, value: 0, format: v => `${v} hours`, onInput: setTime });
            ready = true;
          }
          function reset() {
            if (busy) return;
            api.sfx('swoosh');
            phase = 0; dye = null; lastMark = -1;
            botIn.innerHTML = bottle('#BBBBBB');
            liquid.setAttribute('fill', PALE_WATER);
            liquid.setAttribute('y', bk.liquidTop); liquid.setAttribute('height', BY - bk.liquidTop - 3);
            svg.appendChild(flower);
            flower.style.pointerEvents = '';
            S.q(svg, '#tr2-fllabel').style.display = '';
            flDrag.setPos(620, BY - 4);
            flIn.innerHTML = carnation({});
            S.q(svg, '#tr2-ring').style.display = 'none';
            S.q(svg, '#tr2-target').style.display = 'none';
            S.q(svg, '#tr2-clockG').setAttribute('opacity', 0);
            colBtns.forEach(b => { b.disabled = false; b.classList.remove('primary'); });
            squeezeBtn.disabled = true;
            if (sl) { sl.el.parentNode.remove(); sl = null; }
          }
        },
      },

      // ---------- 3. Questions ----------
      {
        title: 'What is the evidence?',
        text: ['Here is the flower at the start, and the same flower after two days in the coloured water.'],
        ask: 'What evidence do you have that water moves inside the plant? Which part is it moving **through**?',
        activity: true,
        scene(stage, api) {
          const dye = DYES.red;
          const b1 = beakerParts(210, 468, { level: 150, color: S.mix(PALE_WATER, dye, .9), idp: 'tr3a' });
          const b2 = beakerParts(560, 468, { level: 120, color: S.mix(PALE_WATER, dye, .9), idp: 'tr3b' });
          const svg = api.svg(`
            <rect width="800" height="520" fill="#FFF3DC"/>
            <rect x="0" y="468" width="800" height="52" fill="#C9955E"/><rect x="0" y="464" width="800" height="8" fill="#A8743F"/>
            <path d="M385 40 L385 450" stroke="#E7A07F" stroke-width="3" stroke-dasharray="10 8"/>
            <g transform="translate(210 30)"><rect x="-90" y="-4" width="180" height="36" rx="18" fill="#fff" stroke="#3B3F6B" stroke-width="2.5"/>${S.text(0, 21, 'At the start', { size: 19, fill: '#3B3F6B' })}</g>
            <g transform="translate(560 30)"><rect x="-100" y="-4" width="200" height="36" rx="18" fill="#fff" stroke="#C8452F" stroke-width="2.5"/>${S.text(0, 21, 'After two days', { size: 19, fill: '#9A3222' })}</g>
            <g transform="translate(210 460)">${carnation({ dye, tint: 0, rise: 0 })}</g>
            ${b1.liquid}${b1.glass}
            <g id="tr3-after" transform="translate(560 460)">${carnation({ dye, tint: 1, rise: 1 })}</g>
            <g id="tr3-flow" opacity="0"><path d="M560 452 C563 348 555 236 560 185" stroke="#fff" stroke-width="3" fill="none" class="flow"/></g>
            ${b2.liquid}${b2.glass}
            <circle id="tr3-hotPet" cx="560" cy="140" r="50" fill="transparent" class="hot"/>
            <rect id="tr3-hotStem" x="540" y="195" width="40" height="255" fill="transparent" class="hot"/>
          `);
          S.q(svg, '#tr3-hotPet').addEventListener('click', () => { api.sfx('pop'); api.say('The white petals have turned red, especially at the edges.'); });
          S.q(svg, '#tr3-hotStem').addEventListener('click', () => { api.sfx('pop'); api.say('This is the stem. It joins the flower to the water.'); });
          const q1 = api.choice({
            q: 'What evidence do you have that water moves inside the plant?',
            options: ['The petals changed colour', 'The flower got bigger', 'The water turned white', 'The leaves fell off'],
            correct: 0,
            hints: { 1: 'Look at the size. Is it bigger? Look at the colour instead.', 2: 'The water is still coloured. Look at the petals.', 3: 'The leaves are still there. Look at the petals.' },
            explain: 'The coloured water got all the way up to the petals.',
            onRight: () => {
              api.timeout(() => { q1.parentNode.remove(); api.choice({
                q: 'Which part is the water moving through?',
                options: ['the petals only', 'the stem', 'the air', 'the beaker'],
                correct: 1,
                hints: { 0: 'The petals are at the top. How did the water get up there?', 2: 'The water stays inside the plant.', 3: 'The beaker holds the water. Which part of the plant is in the water?' },
                explain: 'The water moves up through the stem to the flower.',
                onRight: () => {
                  api.star();
                  const f = S.q(svg, '#tr3-flow');
                  f.setAttribute('opacity', 1);
                  api.sfx('water');
                },
              }); }, 2200);
            },
          });
        },
      },
    ],
  });
})();
