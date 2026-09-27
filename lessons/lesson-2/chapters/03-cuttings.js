// Chapter 3: Taking a cutting
(() => {
  // Extra styles for this chapter (added once)
  if (!document.getElementById('cut-style')) {
    const st = document.createElement('style');
    st.id = 'cut-style';
    st.textContent = `
      .cut-noptr { pointer-events: none; }
      .cut-scene-cut { cursor: none; }
      .cut-spot .cut-hit { fill: transparent; }
      .cut-spot:hover .cut-line { stroke: #E53935; }
      .cut-shake { animation: cut-shake .4s; transform-box: fill-box; transform-origin: center; }
      @keyframes cut-shake { 25%, 75% { transform: translateX(-5px); } 50% { transform: translateX(5px); } }
      .cut-mist { pointer-events: none; }
    `;
    document.head.append(st);
  }

  const STEM = '#5BAE4A', STEM_DARK = '#3E8B37', LEAF = '#58B947';

  // A straight leafy stem from yBot up to yTop. nodes = y of each leaf pair.
  // Leaves in `lowNodes` get the class cut-low (so they can be plucked).
  function leafyStem({ x, yBot, yTop, nodes, lowNodes = [], scars = [], L = 60, W = 21, hot = false }) {
    let s = `<path d="M${x} ${yBot} L${x} ${yTop}" stroke="${STEM_DARK}" stroke-width="11" stroke-linecap="round"/>
      <path d="M${x} ${yBot} L${x} ${yTop}" stroke="${STEM}" stroke-width="8" stroke-linecap="round"/>
      <path d="M${x - 2} ${yBot} L${x - 2} ${yTop}" stroke="#9BD58A" stroke-width="2" opacity=".7"/>`;
    scars.forEach(y => { s += `<ellipse cx="${x + 5}" cy="${y}" rx="4" ry="3" fill="#8CBF6A" stroke="${STEM_DARK}" stroke-width="1"/><ellipse cx="${x - 5}" cy="${y}" rx="4" ry="3" fill="#8CBF6A" stroke="${STEM_DARK}" stroke-width="1"/>`; });
    nodes.forEach((y, i) => {
      const k = 1 - i * .07;
      const low = lowNodes.includes(y);
      [1, -1].forEach(side => {
        const a = side > 0 ? -28 - i * 3 : -152 + i * 3;
        s += `<g class="cut-leaf${low ? ' cut-low' : ''}${hot ? ' hot' : ''}" data-x="${x}" data-y="${y}" data-side="${side}">
          ${S.leaf({ x: x + side * 3, y, angle: a, L: L * k, W: W * k, color: LEAF, stalk: 7 })}</g>`;
      });
      s += `<ellipse cx="${x}" cy="${y}" rx="7" ry="4" fill="${STEM_DARK}"/>`;
    });
    // Small new leaves and a bud at the tip
    s += S.leaf({ x, y: yTop + 4, angle: -62, L: L * .45, W: W * .45, color: '#7CCB62', stalk: 3 });
    s += S.leaf({ x, y: yTop + 4, angle: -118, L: L * .45, W: W * .45, color: '#7CCB62', stalk: 3 });
    s += `<ellipse cx="${x}" cy="${yTop - 2}" rx="5" ry="8" fill="#8BD17C" stroke="${STEM_DARK}" stroke-width="1.2"/>`;
    return s;
  }

  // The prepared cutting: bare lower stem, leaves only at the top
  function cuttingSvg(x, yBot) {
    return leafyStem({ x, yBot, yTop: yBot - 222, nodes: [yBot - 150, yBot - 188], scars: [yBot - 70, yBot - 108], L: 50, W: 18 });
  }

  // A clear plastic pot. y = rim top. Returns the parts so scenes can layer things inside.
  function clearPot({ x, y, w, h, id }) {
    const bw = w * .72;
    const inner = `M${x - w / 2 + 4} ${y + 8} L${x - bw / 2 + 4} ${y + h - 4} L${x + bw / 2 - 4} ${y + h - 4} L${x + w / 2 - 4} ${y + 8}Z`;
    return {
      clip: `<clipPath id="${id}"><path d="${inner}"/></clipPath>`,
      back: `<path d="${inner}" fill="#E8F4F8" opacity=".8"/>`,
      front: `<path d="M${x - w / 2} ${y + 6} L${x - bw / 2} ${y + h} L${x + bw / 2} ${y + h} L${x + w / 2} ${y + 6}" fill="url(#g-glass)" stroke="#7FA7B8" stroke-width="3" stroke-linejoin="round"/>
        <path d="M${x - w / 2 + 16} ${y + 26} L${x - bw / 2 + 14} ${y + h - 16}" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".6"/>
        <rect x="${x - w / 2 - 8}" y="${y}" width="${w + 16}" height="16" rx="6" fill="#CFE7EF" stroke="#7FA7B8" stroke-width="3" opacity=".95"/>`,
    };
  }

  // Wooden potting bench along the bottom
  const bench = (y = 450) => `<rect x="0" y="${y}" width="800" height="${520 - y}" fill="#D9A86C"/>
    <rect x="0" y="${y}" width="800" height="10" fill="#E9C08A"/>
    ${[0, 1, 2, 3].map(i => `<path d="M${i * 230 + 40} ${y + 26} q60 6 150 0" stroke="#B9844B" stroke-width="3" fill="none" opacity=".7"/>`).join('')}`;

  // Greenhouse back wall
  const wall = () => `<rect width="800" height="520" fill="#E4F4EC"/>
    ${[0, 1, 2, 3, 4].map(i => `<rect x="${i * 170 + 10}" y="10" width="150" height="200" rx="6" fill="#CDEBF7" stroke="#A9CDB6" stroke-width="4"/>`).join('')}
    <rect x="0" y="210" width="800" height="12" fill="#A9CDB6"/>`;

  App.chapter({
    id: 'cuttings',
    title: 'Taking a cutting',
    icon: '✂️',
    group: 'Parts of a plant',
    keywords: [
      { w: 'cutting', d: 'A piece cut off a plant that can grow into a new plant.' },
    ],
    steps: [
      {
        text: [
          'A **cutting** is a piece that you cut off a bigger plant. It will make a new plant.',
          'Take your cutting below a place where a leaf is growing.',
        ],
        ask: 'Move the scissors. Click a glowing spot just below a leaf to cut.',
        activity: true,
        scene(stage, api) {
          const X = 250, NODES = [330, 255, 180, 115, 65], TOP = 32;
          const spots = [
            { y: 305, ok: false, hint: 'That is in the middle of the stem. Find a spot just below a leaf.' },
            { y: 270, ok: true },
            { y: 240, ok: false, hint: 'That is just above a leaf. Cut a little lower, below where a leaf grows.' },
            { y: 195, ok: true },
            { y: 148, ok: false, hint: 'That is in the middle of the stem. Find a spot just below a leaf.' },
          ];
          const plantMk = leafyStem({ x: X, yBot: 366, yTop: TOP, nodes: NODES });
          const svg = api.svg(`
            ${wall()}
            <defs><clipPath id="cut-ct"><rect id="cut-ctr" x="0" y="-200" width="800" height="400"/></clipPath>
              <clipPath id="cut-cb"><rect id="cut-cbr" x="0" y="200" width="800" height="600"/></clipPath></defs>
            ${bench()}
            <g id="cut-plant">${plantMk}</g>
            ${S.pot({ x: X, y: 360, w: 150, h: 110 })}
            <g id="cut-spots">${spots.map((s, i) => `<g class="cut-spot hot" data-i="${i}">
              <rect class="cut-hit" x="${X - 34}" y="${s.y - 12}" width="68" height="24"/>
              <path class="cut-line" d="M${X - 20} ${s.y} L${X + 20} ${s.y}" stroke="#FFB300" stroke-width="3" stroke-dasharray="4 3"/>
              <circle class="target-ring" cx="${X}" cy="${s.y}" r="9"/></g>`).join('')}</g>
            <g id="cut-tag"></g>
            <g id="cut-sign" transform="translate(470 250)">
              <rect x="0" y="0" width="290" height="110" rx="14" fill="#fff" stroke="#3E9B4F" stroke-width="3"/>
              ${S.text(145, 34, 'Where do I cut?', { size: 20, fill: '#2A7439' })}
              ${S.text(145, 64, '✔ just below a leaf', { size: 18, fill: '#2A7439', weight: 700 })}
              ${S.text(145, 92, '✘ not in the middle', { size: 18, fill: '#C8452F', weight: 700 })}
            </g>
            <g id="cut-sc" class="cut-noptr" transform="translate(330 222)"><g id="cut-scin"></g></g>
          `);
          const scWrap = S.q(svg, '#cut-sc'), scIn = S.q(svg, '#cut-scin');
          const drawSc = open => { scIn.innerHTML = S.scissors({ x: 0, y: 0, angle: 180, open, s: 1.15 }); };
          drawSc(.6);
          let busy = false, done = false;
          svg.classList.add('cut-scene-cut');
          svg.addEventListener('pointermove', e => {
            if (busy || done) return;
            const p = api.point(svg, e);
            scWrap.setAttribute('transform', `translate(${(p.x + 40).toFixed(1)} ${p.y.toFixed(1)})`);
          });

          const cut = async y => {
            busy = true;
            scWrap.setAttribute('transform', `translate(${X + 40} ${y})`);
            await api.tween(160, k => drawSc(.6 * (1 - k)), W.ease.linear);
            if (!api.alive()) return;
            api.sfx('snip');
            // Split the plant into a bottom part and a top part (the cutting)
            S.q(svg, '#cut-ctr').setAttribute('height', y + 200);
            S.q(svg, '#cut-cbr').setAttribute('y', y);
            S.q(svg, '#cut-plant').innerHTML = `<g clip-path="url(#cut-cb)">${plantMk}</g><g id="cut-top" clip-path="url(#cut-ct)">${plantMk}</g>
              <path d="M${X - 16} ${y} L${X + 16} ${y}" stroke="#fff" stroke-width="4" class="fade-in"/>`;
            S.q(svg, '#cut-spots').style.display = 'none';
            S.q(svg, '#cut-sign').style.display = 'none';
            await api.wait(250);
            if (!api.alive()) return;
            drawSc(.6);
            api.tween(400, k => scWrap.setAttribute('transform', `translate(${X + 40 + k * 300} ${y - k * 120})`)).then(() => scWrap.setAttribute('opacity', 0));
            const top = S.q(svg, '#cut-top');
            const tx = 470 - X, ty = 440 - y;
            api.sfx('whoosh');
            await api.tween(1000, k => {
              top.setAttribute('transform', `translate(${(tx * k).toFixed(1)} ${(ty * k - Math.sin(Math.PI * k) * 70).toFixed(1)}) rotate(${(90 * k).toFixed(1)} ${X} ${y})`);
            }, W.ease.inOut);
            if (!api.alive()) return;
            api.sfx('thud');
            await api.tween(260, (k, raw) => {
              top.setAttribute('transform', `translate(${tx} ${(ty - Math.sin(Math.PI * raw) * 12).toFixed(1)}) rotate(90 ${X} ${y})`);
            }, W.ease.linear);
            if (!api.alive()) return;
            const len = y - TOP;
            S.q(svg, '#cut-tag').innerHTML = S.callout({ x: 470 + len * .45, y: 442, tx: 470 + len * .45, ty: 494, text: 'cutting', cls: 'callout pop-in' });
            done = true; busy = false;
            svg.classList.remove('cut-scene-cut');
            api.star();
            api.praise('You cut just below a leaf. This cutting can grow into a new plant!');
          };

          S.qa(svg, '.cut-spot').forEach(g => g.addEventListener('click', () => {
            if (busy || done) return;
            const s = spots[+g.dataset.i];
            if (s.ok) cut(s.y);
            else {
              drawSc(.2); api.timeout(() => drawSc(.6), 150);
              g.classList.remove('cut-shake'); void g.getBBox(); g.classList.add('cut-shake');
              api.oops(s.hint);
            }
          }));
          api.button('↺ Try again', () => {
            if (busy) return;
            done = false;
            S.q(svg, '#cut-plant').innerHTML = plantMk;
            S.q(svg, '#cut-spots').style.display = '';
            S.q(svg, '#cut-sign').style.display = '';
            S.q(svg, '#cut-tag').innerHTML = '';
            scWrap.setAttribute('opacity', 1);
            scWrap.setAttribute('transform', 'translate(330 222)');
            svg.classList.add('cut-scene-cut');
          }, { sound: 'swoosh' });
        },
      },
      {
        text: ['Remove the lower leaves before planting.'],
        ask: 'Click the lower leaves to pull them off.',
        activity: true,
        scene(stage, api) {
          const X = 400, LOW = [395, 335];
          const svg = api.svg(`
            ${wall()}
            ${bench(470)}
            ${leafyStem({ x: X, yBot: 470, yTop: 95, nodes: [395, 335, 265, 200, 140], lowNodes: LOW, hot: true })}
            <g id="cut-hand">
              <path d="M360 520 L366 452 L434 452 L440 520Z" fill="#5C6BC0"/>
              <rect x="362" y="410" width="76" height="50" rx="22" fill="#E0A77A" stroke="#B57A4E" stroke-width="2"/>
              <path d="M376 418 q-8 12 0 24 M392 414 q-8 14 0 28 M408 414 q-8 14 0 28" stroke="#B57A4E" stroke-width="2" fill="none"/>
              <ellipse cx="428" cy="424" rx="12" ry="9" fill="#E8B58A" stroke="#B57A4E" stroke-width="2"/>
            </g>
            <g id="cut-box">
              <rect x="300" y="300" width="200" height="130" rx="18" fill="none" stroke="#E07A4F" stroke-width="3" stroke-dasharray="9 7"/>
              ${S.callout({ x: 300, y: 360, tx: 170, ty: 360, text: 'lower leaves' })}
              ${S.callout({ x: 470, y: 150, tx: 640, ty: 120, text: 'top leaves', color: '#3E9B4F' })}
            </g>
            <g id="cut-fall"></g>
          `);
          const low = S.qa(svg, '.cut-low');
          let removed = 0;
          S.qa(svg, '.cut-leaf').forEach(g => g.addEventListener('click', async () => {
            if (g.dataset.gone) return;
            if (!g.classList.contains('cut-low')) {
              api.sfx('pop');
              api.info('Keep the top leaves! They will make food for the new plant.');
              return;
            }
            g.dataset.gone = 1;
            g.classList.remove('hot');
            api.sfx('pluck');
            const px = +g.dataset.x, py = +g.dataset.y, side = +g.dataset.side;
            removed++;
            if (removed === low.length) {
              S.q(svg, '#cut-box').style.transition = 'opacity .6s';
              S.q(svg, '#cut-box').style.opacity = 0;
              api.star();
              api.timeout(() => api.praise('Now the stem is bare at the bottom, ready to go in the soil.'), 500);
            } else api.feedback(`🍃 ${removed} of ${low.length}`, 'ok', 1400);
            await api.tween(1300, (k, raw) => {
              const dx = side * (40 * raw + Math.sin(raw * 9) * 14), dy = 170 * raw * raw;
              g.setAttribute('transform', `translate(${dx.toFixed(1)} ${dy.toFixed(1)}) rotate(${(side * 200 * raw).toFixed(1)} ${px + side * 30} ${py - 15})`);
              g.setAttribute('opacity', (1 - raw * raw).toFixed(2));
            }, W.ease.linear);
          }));
          api.button('↺ Put the leaves back', () => {
            removed = 0;
            low.forEach(g => { delete g.dataset.gone; g.classList.add('hot'); g.removeAttribute('transform'); g.setAttribute('opacity', 1); });
            S.q(svg, '#cut-box').style.opacity = 1;
          }, { sound: 'swoosh' });
        },
      },
      {
        text: ['Use a sandy soil or put sand in the soil you have.'],
        ask: 'Add soil and sand to the pot. Then plant your cutting.',
        activity: true,
        scene(stage, api) {
          const PX = 400, PY = 240, PW = 250, PH = 220, BOT = PY + PH;
          const pot = clearPot({ x: PX, y: PY, w: PW, h: PH, id: 'cut-potclip' });
          let grains = '';
          const r = S.rng(4);
          for (let i = 0; i < 70; i++) grains += `<circle cx="${(PX - 120 + r() * 240).toFixed(1)}" cy="${(300 + r() * 160).toFixed(1)}" r="${(1.5 + r() * 2).toFixed(1)}" fill="#F3D98E"/>`;
          const svg = api.svg(`
            ${wall()}
            <defs>${pot.clip}</defs>
            ${bench(460)}
            ${pot.back}
            <g id="cut-cutting" opacity="0">${cuttingSvg(PX, 365)}</g>
            <g clip-path="url(#cut-potclip)">
              <rect id="cut-soil" x="${PX - 130}" y="${BOT}" width="260" height="0" fill="url(#g-soil)"/>
              <rect id="cut-sand" x="${PX - 130}" y="${BOT}" width="260" height="0" fill="#E9CB85"/>
              <g id="cut-grains" opacity="0">${grains}</g>
            </g>
            ${pot.front}
            <g id="cut-parts"></g>
            <g id="cut-bag" transform="translate(110 330)">
              <path d="M-42 -48 Q0 -62 42 -48 L48 50 Q0 62 -48 50Z" fill="#8D6E63" stroke="#5D4037" stroke-width="3"/>
              <path d="M-42 -48 Q0 -34 42 -48" stroke="#5D4037" stroke-width="3" fill="#6D4C41"/>
              ${S.text(0, 14, 'SOIL', { size: 22, fill: '#fff' })}
            </g>
            <g id="cut-bucket" transform="translate(690 330)">
              <path d="M-40 -44 L40 -44 L32 48 L-32 48Z" fill="#FFCA28" stroke="#C79100" stroke-width="3"/>
              <ellipse cx="0" cy="-44" rx="40" ry="9" fill="#E9CB85" stroke="#C79100" stroke-width="3"/>
              <path d="M-38 -44 Q0 -100 38 -44" stroke="#9E9E9E" stroke-width="4" fill="none"/>
              ${S.text(0, 14, 'SAND', { size: 22, fill: '#8A5A00' })}
            </g>
          `);
          const soilR = S.q(svg, '#cut-soil'), sandR = S.q(svg, '#cut-sand'), parts = S.q(svg, '#cut-parts');
          let soilH = 0, sandH = 0, busy = false, planted = false;
          const drawFill = () => {
            soilR.setAttribute('y', BOT - soilH); soilR.setAttribute('height', soilH);
            sandR.setAttribute('y', BOT - soilH - sandH); sandR.setAttribute('height', sandH);
          };
          // Falling grains from a point into the pot
          const grainsFx = (fromX, fromY, color, ms) => {
            const list = [];
            let t = 0, spawn = 0;
            api.loop(dt => {
              t += dt * 1000; spawn += dt;
              while (t < ms && spawn > .012) {
                spawn -= .012;
                const c = S.el('circle', { r: 2 + Math.random() * 2.5, fill: color }, parts);
                list.push({ c, x: fromX + (Math.random() - .5) * 14, y: fromY, vx: (Math.random() - .5) * 40, vy: 30 + Math.random() * 40 });
              }
              const floor = BOT - soilH - sandH;
              for (let i = list.length - 1; i >= 0; i--) {
                const p = list[i];
                p.vy += 900 * dt; p.x += p.vx * dt; p.y += p.vy * dt;
                if (p.y > floor) { p.c.remove(); list.splice(i, 1); continue; }
                p.c.setAttribute('cx', p.x.toFixed(1)); p.c.setAttribute('cy', p.y.toFixed(1));
              }
              return t < ms || list.length > 0;
            });
          };
          // Move a container over the pot, tip it, pour, and put it back
          const pour = async (node, home, over, rot, color, add) => {
            busy = true;
            await api.tween(600, k => node.setAttribute('transform', `translate(${home.x + (over.x - home.x) * k} ${home.y + (over.y - home.y) * k}) rotate(${rot * k})`), W.ease.out);
            if (!api.alive()) return;
            api.sfx('pour');
            const a = (rot - 90) * Math.PI / 180;
            grainsFx(over.x + Math.cos(a) * 55, over.y + Math.sin(a) * 55, color, 1500);
            const s0 = soilH, d0 = sandH;
            await api.tween(1900, k => { add(s0, d0, k); drawFill(); }, W.ease.inOut);
            if (!api.alive()) return;
            await api.tween(600, k => node.setAttribute('transform', `translate(${over.x + (home.x - over.x) * k} ${over.y + (home.y - over.y) * k}) rotate(${rot * (1 - k)})`), W.ease.out);
            busy = false;
          };
          const mix = async () => {
            if (!(soilH > 0 && sandH > 0)) return;
            api.sfx('sprinkle');
            api.say('The soil and sand mix together. Now it is sandy soil.');
            const g = S.q(svg, '#cut-grains');
            const total = soilH + sandH;
            await api.tween(1200, k => {
              soilH = total * (.8 + .2 * k); sandH = total - soilH; drawFill();
              g.setAttribute('opacity', k);
              soilR.setAttribute('opacity', 1 - k * .15);
            });
            plantBtn.disabled = false; plantBtn.classList.add('pulse');
          };
          api.row();
          const soilBtn = api.button('🟫 Add soil', async () => {
            if (busy || soilH) return;
            soilBtn.disabled = true;
            await pour(S.q(svg, '#cut-bag'), { x: 110, y: 330 }, { x: 290, y: 170 }, 135, '#6D4C41', (s0, d0, k) => { soilH = 130 * k; });
            if (api.alive()) mix();
          }, { cls: 'primary' });
          const sandBtn = api.button('🏖️ Add sand', async () => {
            if (busy || sandH) return;
            sandBtn.disabled = true;
            await pour(S.q(svg, '#cut-bucket'), { x: 690, y: 330 }, { x: 510, y: 170 }, -135, '#E9CB85', (s0, d0, k) => { sandH = 32 * k; });
            if (api.alive()) mix();
          }, { cls: 'primary' });
          const plantBtn = api.button('🌱 Plant the cutting', async () => {
            if (busy || planted) return;
            planted = true; plantBtn.disabled = true; plantBtn.classList.remove('pulse');
            const c = S.q(svg, '#cut-cutting');
            c.setAttribute('opacity', 1);
            api.sfx('swoosh');
            await api.tween(1100, k => c.setAttribute('transform', `translate(0 ${(-330 * (1 - k)).toFixed(1)})`), W.ease.out);
            if (!api.alive()) return;
            api.sfx('drop');
            api.star();
            api.praise('Your cutting is planted in sandy soil.');
          });
          plantBtn.disabled = true;
          api.button('↺ Start again', () => {
            if (busy) return;
            soilH = 0; sandH = 0; planted = false; drawFill();
            S.q(svg, '#cut-grains').setAttribute('opacity', 0);
            soilR.setAttribute('opacity', 1);
            S.q(svg, '#cut-cutting').setAttribute('opacity', 0);
            soilBtn.disabled = false; sandBtn.disabled = false; plantBtn.disabled = true; plantBtn.classList.remove('pulse');
          }, { sound: 'swoosh' });
        },
      },
      {
        text: ['Water your plant and spray it with water.'],
        tip: 'In a few weeks, the plant will grow roots so it can take in its own water.',
        ask: 'Water the soil, spray the leaves, then wait a few weeks.',
        activity: true,
        scene(stage, api) {
          const PX = 330, PY = 240, PW = 250, PH = 220, BOT = PY + PH, SOIL = 300, CUT_BOT = 365;
          const pot = clearPot({ x: PX, y: PY, w: PW, h: PH, id: 'cut-potclip2' });
          const svg = api.svg(`
            ${wall()}
            <defs>${pot.clip}</defs>
            ${bench(460)}
            ${pot.back}
            <g id="cut-plantG">${cuttingSvg(PX, CUT_BOT)}</g>
            <g id="cut-newleaf"></g>
            <g clip-path="url(#cut-potclip2)">
              <rect id="cut-soil" x="${PX - 130}" y="${SOIL}" width="260" height="${BOT - SOIL}" fill="#8A5A34"/>
              <rect id="cut-wet" x="${PX - 130}" y="${SOIL}" width="260" height="${BOT - SOIL}" fill="#3E2515" opacity="0"/>
              <g id="cut-roots"></g>
            </g>
            ${pot.front}
            <g id="cut-shine"></g>
            <g id="cut-fx"></g>
            <g id="cut-can" transform="translate(110 150)">${S.wateringCan({ s: 1 })}</g>
            <g id="cut-spray" transform="translate(640 330) scale(-1 1)">${S.sprayBottle({ s: 1.2 })}</g>
            <g id="cut-cal" transform="translate(600 40)" opacity=".35">
              <rect x="0" y="0" width="150" height="130" rx="12" fill="#fff" stroke="#555" stroke-width="3"/>
              <rect x="0" y="0" width="150" height="38" rx="12" fill="#E53935"/>
              <rect x="0" y="24" width="150" height="14" fill="#E53935"/>
              ${S.text(75, 27, 'WEEK', { size: 20, fill: '#fff' })}
              <text id="cut-week" x="75" y="108" text-anchor="middle" font-size="60" font-weight="800" fill="#2B2A28">0</text>
              <g id="cut-page"><rect x="4" y="38" width="142" height="88" fill="#F5F5F5" opacity="0"/></g>
              <circle cx="40" cy="4" r="6" fill="#555"/><circle cx="110" cy="4" r="6" fill="#555"/>
            </g>
          `);
          const fx = S.q(svg, '#cut-fx');
          let watered = false, sprayed = false, busy = false, grown = false;
          const check = () => {
            if (watered && sprayed && !grown) { waitBtn.disabled = false; waitBtn.classList.add('pulse'); }
          };
          // Little particles helper: each one moves with velocity and fades
          const particles = (spawnFn, ms, rate) => {
            const list = [];
            let t = 0, acc = 0;
            api.loop(dt => {
              t += dt * 1000; acc += dt;
              while (t < ms && acc > rate) { acc -= rate; list.push(spawnFn()); }
              for (let i = list.length - 1; i >= 0; i--) {
                const p = list[i];
                p.life -= dt; p.vy += (p.g || 0) * dt; p.x += p.vx * dt; p.y += p.vy * dt;
                if (p.life <= 0 || p.y > p.floor) { p.n.remove(); list.splice(i, 1); continue; }
                p.n.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) scale(${p.s || 1})`);
                if (p.fade) p.n.setAttribute('opacity', Math.min(1, p.life * 2).toFixed(2));
              }
              return t < ms || list.length > 0;
            });
          };
          api.row();
          const waterBtn = api.button('🚿 Water the soil', async () => {
            if (busy) return;
            busy = true;
            const can = S.q(svg, '#cut-can');
            await api.tween(600, k => can.setAttribute('transform', `translate(${110 + 90 * k} ${150 + 20 * k}) rotate(${30 * k})`), W.ease.out);
            if (!api.alive()) return;
            api.sfx('water');
            // Spout tip after tilting is about 85px right of the can
            particles(() => {
              const n = S.frag(S.drop({ s: .55 }));
              fx.appendChild(n);
              return { n, x: 285 + Math.random() * 6, y: 172, vx: 40 + Math.random() * 50, vy: 20, g: 700, life: 2, floor: SOIL + 4 };
            }, 1600, .03);
            await api.tween(1800, k => S.q(svg, '#cut-wet').setAttribute('opacity', (.45 * k).toFixed(2)));
            if (!api.alive()) return;
            await api.tween(600, k => can.setAttribute('transform', `translate(${200 - 90 * k} ${170 - 20 * k}) rotate(${30 * (1 - k)})`), W.ease.out);
            busy = false;
            if (!watered) { watered = true; api.say('The soil is wet now.'); waterBtn.innerHTML = '🚿 Water again'; }
            check();
          }, { cls: 'primary', sound: 'pour' });
          const sprayBtn = api.button('💦 Spray the leaves', async () => {
            if (busy) return;
            busy = true;
            const sp = S.q(svg, '#cut-spray');
            await api.tween(600, k => sp.setAttribute('transform', `translate(${640 - 150 * k} ${330 - 170 * k}) scale(-1.2 1.2)`), W.ease.out);
            if (!api.alive()) return;
            for (let i = 0; i < 3; i++) {
              api.sfx('spray');
              particles(() => {
                const n = S.el('circle', { r: 2 + Math.random() * 3, fill: '#8FD3F7', opacity: .8 }, fx);
                return { n, x: 455, y: 125, vx: -(160 + Math.random() * 120), vy: (Math.random() - .5) * 120, life: .8, floor: 999, fade: true };
              }, 350, .01);
              if (!await api.wait(500)) return;
            }
            // Tiny drops stay on the leaves for a while
            S.q(svg, '#cut-shine').innerHTML = [[300, 195], [360, 190], [290, 158], [372, 150], [318, 128], [345, 170]]
              .map(([x, y]) => S.drop({ x, y, s: .45, color: '#BDE8FF', cls: 'drop pop-in' })).join('');
            await api.tween(600, k => sp.setAttribute('transform', `translate(${490 + 150 * k} ${160 + 170 * k}) scale(-1.2 1.2)`), W.ease.out);
            busy = false;
            if (!sprayed) { sprayed = true; api.say('The leaves are sprayed with water.'); }
            check();
          }, { cls: 'primary', sound: null });
          const waitBtn = api.button('⏩ Wait a few weeks', async () => {
            if (busy || grown) return;
            busy = true; waitBtn.disabled = true; waitBtn.classList.remove('pulse');
            const cal = S.q(svg, '#cut-cal'), wk = S.q(svg, '#cut-week'), page = S.q(svg, '#cut-page');
            cal.setAttribute('opacity', 1);
            S.q(svg, '#cut-shine').innerHTML = '';
            for (let w = 1; w <= 4; w++) {
              api.sfx('page');
              page.innerHTML = `<rect x="4" y="38" width="142" height="88" fill="#FFF8E1" stroke="#ccc"/>`;
              const pr = page.firstChild;
              await api.tween(350, k => { pr.setAttribute('height', (88 * (1 - k)).toFixed(1)); });
              if (!api.alive()) return;
              wk.textContent = w;
              api.sfx('grow');
              const g0 = (w - 1) / 4, g1 = w / 4;
              await api.tween(700, k => {
                const g = g0 + (g1 - g0) * k;
                // Draw the buried stem end too, so the roots join onto it
                S.q(svg, '#cut-roots').innerHTML = `<path d="M${PX} ${SOIL} L${PX} ${CUT_BOT}" stroke="#7FAF5C" stroke-width="8" opacity=".85"/>` + S.roots({ x: PX, y: CUT_BOT - 2, depth: 80 * g, spread: 80 * g, color: '#F3E6C8', w: Math.max(1.2, 3.5 * g), seed: 9, hairs: g > .7 });
              }, W.ease.linear);
              if (!api.alive()) return;
            }
            S.q(svg, '#cut-newleaf').innerHTML = `<g class="grow-in">${S.leaf({ x: PX, y: CUT_BOT - 216, angle: -75, L: 34, W: 13, color: '#8BD17C' })}</g>`;
            S.q(svg, '#cut-fx').innerHTML = S.callout({ x: PX + 40, y: 420, tx: 560, ty: 420, text: 'new roots', cls: 'callout pop-in' })
              + S.callout({ x: PX + 6, y: CUT_BOT - 236, tx: 480, ty: 70, text: 'new leaf', cls: 'callout pop-in', color: '#3E9B4F' });
            grown = true; busy = false;
            api.star();
            api.praise('Look! The cutting has grown roots. Now it can take in its own water.');
          }, { cls: 'primary' });
          waitBtn.disabled = true;
        },
      },
    ],
  });
})();
