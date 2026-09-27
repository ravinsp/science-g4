// Chapter 15: Investigating fertiliser
(() => {
  // Blue striped pot like the book. (x, y) = centre of the rim top
  function bluePot(x, y, w, h, num) {
    const bw = w * .8;
    const side = t => ({ l: x - w / 2 + (w - bw) / 2 * t, r: x + w / 2 - (w - bw) / 2 * t });
    const band = (t0, t1) => {
      const a = side(t0), b = side(t1);
      return `<path d="M${a.l} ${y + h * t0} L${a.r} ${y + h * t0} L${b.r} ${y + h * t1} L${b.l} ${y + h * t1}Z" fill="#fff" opacity=".85"/>`;
    };
    return `<g class="fer-pot">
      <path d="M${x - w / 2} ${y} L${x - bw / 2} ${y + h} L${x + bw / 2} ${y + h} L${x + w / 2} ${y}Z" fill="#3E8ED0" stroke="#1F5E96" stroke-width="2"/>
      ${band(.18, .3)}${band(.62, .74)}
      <rect x="${x - w / 2 - 4}" y="${y - 6}" width="${w + 8}" height="12" rx="5" fill="#5FA8E6" stroke="#1F5E96" stroke-width="2"/>
      <ellipse cx="${x}" cy="${y - 2}" rx="${w / 2 - 2}" ry="5" fill="#8A5A34"/>
      ${num ? `<rect x="${x - 13}" y="${y + h * .36}" width="26" height="${h * .22 + 6}" rx="3" fill="#fff" stroke="#333" stroke-width="1.5"/>
      <text x="${x}" y="${y + h * .36 + h * .11 + 9}" text-anchor="middle" font-size="18" font-weight="800" fill="#222">${num}</text>` : ''}
    </g>`;
  }

  function seedling(x, y, cm, pale, seed = 5) {
    const h = Math.max(10, cm * 8);
    return S.plant({
      x, y, h, leaves: Math.min(8, 2 + Math.floor(cm / 3)), leafL: 20, leafW: 10, leafShape: 'round',
      leafColor: pale ? S.mix('#43A047', '#C9D35A', pale) : '#43A047', roots: false, stemW: 4, seed,
    });
  }

  // Drag an SVG node by its translate. (Local helper: keeps pointer capture,
  // because re-appending the node during a drag would lose it.)
  function dragNode(svg, node, api, x, y, { onMove, onDrop, bounds } = {}) {
    const pos = { x, y };
    let st = null;
    const set = (nx, ny) => { pos.x = nx; pos.y = ny; node.setAttribute('transform', `translate(${S.f1(nx)} ${S.f1(ny)})`); };
    node.style.cursor = 'grab';
    W.pointerDrag(node, {
      onStart: e => { const p = W.svgPoint(svg, e.clientX, e.clientY); st = { px: p.x, py: p.y, x: pos.x, y: pos.y }; api.sfx('pick'); },
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
        if (onDrop && onDrop(pos) === false) animateTo(s0.x, s0.y);
      },
    });
    function animateTo(tx, ty, ms = 300) {
      const fx = pos.x, fy = pos.y;
      return api.tween(ms, k => set(fx + (tx - fx) * k, fy + (ty - fy) * k), W.ease.out);
    }
    return { pos, setPos: set, animateTo };
  }

  function injectStyle() {
    if (document.getElementById('fer-style')) return;
    document.head.insertAdjacentHTML('beforeend', `<style id="fer-style">
      .fer-wrap { display:flex; flex-direction:column; gap:8px; }
      .fer-wrap > svg { width:100%; display:block; max-height:36vh; }
      .fer-grid { display:grid; grid-template-columns:repeat(4, 1fr); gap:8px; }
      .fer-card { background:#fff; border:3px solid #EADFCB; border-radius:14px; padding:6px; text-align:center; transition:all .2s; }
      .fer-card .fer-emo { font-size:28px; line-height:1.1; }
      .fer-card .fer-name { font-weight:800; font-size:16px; }
      .fer-card .fer-btns { display:flex; gap:4px; justify-content:center; margin-top:4px; }
      .fer-card button { border:2px solid #C9B897; background:#FFFCF5; border-radius:10px; font-size:13px; font-weight:800; padding:3px 6px; cursor:pointer; }
      .fer-card button:hover { border-color:#3E9B4F; }
      .fer-card.same { border-color:#3E9B4F; background:#E3F4DE; }
      .fer-card.change { border-color:#E07A4F; background:#FDEBE1; }
      .fer-card.done .fer-btns { display:none; }
      .fer-card .fer-res { display:none; font-weight:800; font-size:14px; margin-top:4px; }
      .fer-card.done .fer-res { display:block; }
      .fer-card.bad { animation: shake .4s; }
      .fer-tbl { font-size:15px; }
      .fer-tbl th, .fer-tbl td { padding:2px 8px; min-width:58px; line-height:1.25; }
      .fer-tbl tr.fer-with td:first-child { background:#E3F4DE; font-weight:800; }
      .fer-tbl tr.fer-without td:first-child { background:#FFF0D6; font-weight:800; }
      .fer-tbl td.fer-now { outline:3px solid #FFC93C; }
    </style>`);
  }

  // Heights in cm for plants 1-6 at start and after weeks 1-4
  const HEIGHTS = [
    [4, 7, 11, 15, 19],
    [4, 7, 10, 14, 18],
    [4, 8, 12, 15, 19],
    [4, 6, 8, 10, 12],
    [4, 5, 7, 9, 11],
    [4, 6, 8, 9, 12],
  ];

  App.chapter({
    id: 'fertiliser',
    title: 'Investigating fertiliser',
    icon: '📏',
    group: 'What plants need',
    keywords: [
      { w: 'results', d: 'What we find out at the end of an investigation.' },
      { w: 'measure', d: 'To find out how big, long or heavy something is, using a ruler or scales.' },
      { w: 'height', d: 'How tall something is.' },
      { w: 'cm', d: 'Short for centimetre. We use it to measure length and height.' },
    ],
    steps: [
      // ---------- a) Set up the pots ----------
      {
        text: [
          'Do plants grow taller when they are given fertiliser? Let\'s collect some evidence to find out.',
          'We need to do an investigation and look at the **results**.',
          'You will need six potted plants that are all the same. Number the pots.',
        ],
        ask: 'Give pots 1 to 3 the same amount of the same fertiliser. Leave pots 4 to 6 without fertiliser. Drag the scoop onto a pot.',
        activity: true,
        scene(stage, api) {
          const X = i => 90 + i * 124;
          const svg = api.svg(`
            <rect width="800" height="520" fill="#EAF6FF"/>
            <rect x="0" y="0" width="800" height="200" fill="#DCEFFC"/>
            <rect x="40" y="30" width="200" height="130" rx="8" fill="#BFE6FF" stroke="#fff" stroke-width="8"/>
            <path d="M140 30 L140 160 M40 95 L240 95" stroke="#fff" stroke-width="6"/>
            <rect x="0" y="440" width="800" height="80" fill="#E9CFA6"/><rect x="0" y="436" width="800" height="8" fill="#C9A77C"/>
            <!-- fertiliser tub -->
            <g transform="translate(680 140)">
              <path d="M-50 -60 L50 -60 L44 40 L-44 40Z" fill="#7CB342" stroke="#33691E" stroke-width="2.5"/>
              <rect x="-56" y="-72" width="112" height="16" rx="6" fill="#558B2F"/>
              <rect x="-38" y="-38" width="76" height="46" rx="6" fill="#fff"/>
              ${S.text(0, -18, 'plant', { size: 16, fill: '#33691E' })}${S.text(0, 2, 'fertiliser', { size: 16, fill: '#33691E' })}
            </g>
            <g id="fer-pots">
              ${[0, 1, 2, 3, 4, 5].map(i => `<g data-i="${i}">
                <g class="fer-glow" opacity="0"><ellipse cx="${X(i)}" cy="${330}" rx="58" ry="22" fill="url(#g-glow)"/></g>
                ${S.plant({ x: X(i), y: 330, h: 110, leaves: 5, leafL: 32, leafW: 15, leafShape: 'round', leafColor: '#43A047', roots: false, stemW: 5, seed: 5 })}
                ${bluePot(X(i), 332, 92, 100, i + 1)}
                <g class="fer-pel"></g>
                <g class="fer-tag"></g>
              </g>`).join('')}
            </g>
            <g id="fer-fx"></g>
            <g id="fer-scoop" transform="translate(560 120)">
              <path d="M0 0 L60 -26" stroke="#8D6E63" stroke-width="10" stroke-linecap="round"/>
              <path d="M-34 -8 Q-36 22 -6 24 Q16 24 16 -2 Z" fill="#B0BEC5" stroke="#546E7A" stroke-width="2.5"/>
              <g fill="#F5EFE2" stroke="#8C7B60" stroke-width=".8">
                <circle cx="-22" cy="-3" r="4"/><circle cx="-13" cy="-5" r="4"/><circle cx="-4" cy="-4" r="4"/><circle cx="-17" cy="3" r="4"/><circle cx="-8" cy="3" r="4"/>
              </g>
              <circle cx="0" cy="0" r="46" fill="transparent"/>
            </g>
            <g class="blink-hint" id="fer-hint">${S.text(400, 490, '👆 Drag the scoop onto pots 1, 2 and 3', { size: 22, fill: '#9A3222' })}</g>
          `);
          const pots = S.qa(svg, '#fer-pots > g');
          const scoop = S.q(svg, '#fer-scoop');
          const done = new Set();
          let busy = false;
          const nearest = pos => {
            let best = -1, bd = 80;
            pots.forEach((g, i) => {
              const d = Math.abs(pos.x - X(i));
              if (d < bd && pos.y > 170 && pos.y < 440) { bd = d; best = i; }
            });
            return best;
          };
          const drag = dragNode(svg, scoop, api, 560, 120, {
            bounds: { x1: 40, y1: 40, x2: 770, y2: 480 },
            onMove: pos => {
              const n = nearest(pos);
              pots.forEach((g, i) => S.q(g, '.fer-glow').setAttribute('opacity', i === n ? 1 : 0));
            },
            onDrop: pos => {
              pots.forEach(g => S.q(g, '.fer-glow').setAttribute('opacity', 0));
              if (busy) return false;
              const n = nearest(pos);
              if (n < 0) { api.sfx('drop'); return false; }
              if (n >= 3) {
                api.oops(`Pot ${n + 1} gets no fertiliser. We need pots 4 to 6 without it, so we can compare.`);
                return false;
              }
              if (done.has(n)) {
                api.info(`Pot ${n + 1} already has its scoop. Every pot gets the same amount.`);
                return false;
              }
              pour(n);
              return true;
            },
          });
          const pour = async n => {
            busy = true;
            done.add(n);
            const g = pots[n], x = X(n);
            // Snap over the pot, tip the scoop, pellets fall onto the soil
            drag.setPos(x + 30, 250);
            api.sfx('sprinkle');
            const fx = S.q(svg, '#fer-fx');
            const pel = [...Array(12)].map((_, k) => ({
              n: S.el('circle', { r: 3.5, fill: '#F5EFE2', stroke: '#8C7B60', 'stroke-width': .8 }, fx),
              x: x + 4 + (k % 4) * 5, d: k * .04, tx: x + (k - 6) * 6,
            }));
            await api.tween(1100, (k, raw) => {
              scoop.setAttribute('transform', `translate(${x + 30} 250) rotate(${-40 * Math.min(1, raw * 3)})`);
              pel.forEach(p => {
                const t = Math.max(0, Math.min(1, (raw - p.d) * 1.6));
                p.n.setAttribute('cx', S.f1(p.x + (p.tx - p.x) * t));
                p.n.setAttribute('cy', S.f1(262 + 66 * t * t));
              });
            }, W.ease.linear);
            if (!api.alive()) return;
            fx.innerHTML = '';
            S.q(g, '.fer-pel').innerHTML = [...Array(10)].map((_, k) => `<circle cx="${x - 30 + k * 6.5}" cy="${328 + (k % 2) * 2}" r="3" fill="#F5EFE2" stroke="#8C7B60" stroke-width=".8"/>`).join('');
            // Sparkles
            S.q(g, '.fer-tag').innerHTML = `<g class="pop-in">
              ${[...Array(6)].map((_, k) => `<text x="${x - 40 + k * 16}" y="${300 - (k % 2) * 16}" font-size="18">✨</text>`).join('')}
              <rect x="${x - 50}" y="${444}" width="100" height="30" rx="15" fill="#3E9B4F"/>${S.text(x, 465, 'fertiliser ✔', { size: 16, fill: '#fff' })}</g>`;
            api.sfx('magic');
            await drag.animateTo(560, 120, 500);
            scoop.setAttribute('transform', 'translate(560 120)');
            drag.setPos(560, 120);
            busy = false;
            if (done.size === 3) {
              S.q(svg, '#fer-hint').remove();
              [3, 4, 5].forEach(i => {
                S.q(pots[i], '.fer-tag').innerHTML = `<g class="pop-in"><rect x="${X(i) - 56}" y="444" width="112" height="30" rx="15" fill="#fff" stroke="#E07A4F" stroke-width="2"/>${S.text(X(i), 465, 'no fertiliser', { size: 16, fill: '#9A3222' })}</g>`;
              });
              api.star();
              api.praise('Pots 1 to 3 have the same amount of the same fertiliser. Pots 4 to 6 have none.');
            } else {
              api.say(`Pot ${n + 1} has fertiliser.`);
            }
          };
        },
      },

      // ---------- b) Fair test ----------
      {
        text: ['Think about why you are using six plants, not just two.', 'We only change one factor, the fertiliser. Some plants will have it and some will not.'],
        ask: 'How many factors can you think of to keep the same? Choose <b>keep the same</b> or <b>change</b> for each card.',
        activity: true,
        scene(stage, api) {
          injectStyle();
          const bubble = (x, y, w, lines, tailX) => `
            <path d="M${x + 20} ${y} H${x + w - 20} Q${x + w} ${y} ${x + w} ${y + 20} V${y + lines.length * 24 + 4} Q${x + w} ${y + lines.length * 24 + 24} ${x + w - 20} ${y + lines.length * 24 + 24}
              H${tailX + 16} L${tailX} ${y + lines.length * 24 + 50} L${tailX - 6} ${y + lines.length * 24 + 24} H${x + 20} Q${x} ${y + lines.length * 24 + 24} ${x} ${y + lines.length * 24 + 4} V${y + 20} Q${x} ${y} ${x + 20} ${y}Z"
              fill="#FFE56B" stroke="#E0B400" stroke-width="2"/>
            ${lines.map((l, i) => `<text x="${x + w / 2}" y="${y + 32 + i * 24}" text-anchor="middle" font-size="19" font-weight="700" fill="#2B2A28">${l}</text>`).join('')}`;
          const wrap = api.html(`<div class="fer-wrap">
            <svg viewBox="0 0 800 220" xmlns="${S.NS}">
              <rect width="800" height="220" rx="16" fill="#F3FAFF"/>
              ${S.kid({ x: 64, y: 212, s: .95, skin: '#A0673D', hair: '#2B1B10', shirt: '#7E57C2' })}
              ${S.kid({ x: 736, y: 212, s: .95, skin: '#5C3A1E', hair: '#140C06', shirt: '#43A047' })}
              <g class="fer-b1">${bubble(130, 14, 270, ['Think about why you', 'are using six plants,', 'not just two.'], 150)}</g>
              <g class="fer-b2">${bubble(418, 14, 262, ['We only change one', 'factor, the fertiliser.'], 660)}</g>
            </svg>
            <div class="fer-grid"></div>
          </div>`);
          const factors = [
            { e: '💧', n: 'water', same: true },
            { e: '☀️', n: 'light', same: true },
            { e: '🪴', n: 'pot size', same: true },
            { e: '🟫', n: 'soil', same: true },
            { e: '🌱', n: 'type of plant', same: true },
            { e: '🌡️', n: 'temperature', same: true },
            { e: '🧪', n: 'fertiliser', same: false },
          ];
          const grid = wrap.querySelector('.fer-grid');
          let right = 0, asked = false;
          factors.forEach(f => {
            const c = W.h('div', { class: 'fer-card', html: `<div class="fer-emo">${f.e}</div><div class="fer-name">${f.n}</div>
              <div class="fer-btns"><button data-v="1">✔ same</button><button data-v="0">🔄 change</button></div>
              <div class="fer-res">${f.same ? '✔ keep the same' : '🔄 the one we change'}</div>` });
            c.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
              const same = b.dataset.v === '1';
              if (same === f.same) {
                c.classList.add('done', f.same ? 'same' : 'change');
                api.sfx(f.same ? 'pop' : 'magic');
                api.say(f.same ? `Keep the ${f.n} the same for every plant.` : 'Yes! The fertiliser is the only factor we change.');
                right++;
                if (right === factors.length) askSix();
              } else {
                c.classList.remove('bad'); void c.offsetWidth; c.classList.add('bad');
                api.oops(f.same ? `If we change the ${f.n} too, we will not know what made the plants grow. Keep it the same.` : 'The fertiliser is the factor we are testing. Some plants get it and some do not.');
              }
            }));
            grid.append(c);
          });
          grid.append(W.h('div', { class: 'fer-card', style: 'border-style:dashed;display:grid;place-items:center;font-weight:800;color:#6E665A', html: '<div>Change <b>one</b><br>factor only!</div>' }));
          const askSix = () => {
            if (asked) return;
            asked = true;
            api.praise('We change only the fertiliser. Everything else stays the same.');
            api.timeout(() => {
              api.choice({
                q: 'Why use six plants, not just two?',
                options: ['Because six pots look nicer', 'So one odd plant does not spoil the results', 'So we use up all the fertiliser'],
                correct: 1,
                hints: { 0: 'Think about the results. What if one plant was not healthy to begin with?', 2: 'Each pot gets the same small amount. Think about the results.' },
                explain: 'With three plants in each group, we can be more sure that our results are right.',
                onRight: () => api.star(),
              });
              api.say('Why use six plants, not just two?');
            }, 3000);
          };
        },
      },

      // ---------- c) Measure and record ----------
      {
        text: [
          'To find out our results, we must **measure** or observe something.',
          'Leave the plants to grow. Measure their **height** every week. Remember to water them all in the same way.',
          'Make a table for your results.',
        ],
        ask: 'Measure the plants at the start, then press <b>Next week</b>. Look at the pictures to see if the colour of the leaves changes.',
        activity: true,
        scene(stage, api) {
          injectStyle();
          const X = i => 66 + i * 104;
          const SOIL = 214, PX = 7.5;
          const heads = ['at start', 'after 1 week', 'after 2 weeks', 'after 3 weeks', 'after 4 weeks'];
          const wrap = api.html(`<div class="fer-wrap">
            <svg viewBox="0 0 800 270" xmlns="${S.NS}">
              <rect width="800" height="270" rx="14" fill="#EAF6FF"/>
              <rect y="258" width="800" height="12" fill="#E9CFA6"/>
              <g id="fer-plants"></g>
              ${[0, 1, 2, 3, 4, 5].map(i => bluePot(X(i), SOIL + 2, 60, 42, i + 1)).join('')}
              <g id="fer-drops"></g>
              <g id="fer-meas" opacity="0">
                <g id="fer-ruler">${S.ruler({ x: 0, y: SOIL, h: 20 * PX, cm: 20 })}</g>
                <path id="fer-line" d="" stroke="#E53935" stroke-width="2.5" stroke-dasharray="5 4"/>
                <g id="fer-val"><rect x="-30" y="-15" width="60" height="28" rx="14" fill="#E53935"/><text x="0" y="5" text-anchor="middle" font-size="16" font-weight="800" fill="#fff">0 cm</text></g>
              </g>
              <g id="fer-chart" opacity="0"></g>
              <g transform="translate(710 22)">
                <rect x="-66" y="0" width="140" height="40" rx="20" fill="#fff" stroke="#3B3F6B" stroke-width="2.5"/>
                <text id="fer-week" x="4" y="27" text-anchor="middle" font-size="19" font-weight="800" fill="#3B3F6B">Start</text>
              </g>
              <g id="fer-tab" class="hot" opacity="0" style="pointer-events:none" transform="translate(710 72)">
                <rect x="-66" y="0" width="140" height="36" rx="18" fill="#FFE56B" stroke="#E0B400" stroke-width="2"/>
                <text id="fer-tabt" x="4" y="24" text-anchor="middle" font-size="16" font-weight="800" fill="#2B2A28">📊 Bar chart</text>
              </g>
            </svg>
            <table class="tbl fer-tbl"><thead>
              <tr><th rowspan="2">Plant<br>number</th><th colspan="5">Plant height in cm</th></tr>
              <tr>${heads.map(h => `<th>${h}</th>`).join('')}</tr></thead>
              <tbody>${HEIGHTS.map((r, i) => `<tr class="${i < 3 ? 'fer-with' : 'fer-without'}"><td>${i + 1}${i < 3 ? ' 🧪' : ''}</td>${r.map(() => '<td></td>').join('')}</tr>`).join('')}</tbody>
            </table>
          </div>`);
          const svg = wrap.querySelector('svg');
          const plantsG = S.q(svg, '#fer-plants');
          const cur = HEIGHTS.map(r => r[0]);
          let week = 0, busy = false, measured = -1;
          const draw = paleK => {
            plantsG.innerHTML = cur.map((cm, i) => seedling(X(i), SOIL, cm, i >= 3 ? paleK : 0, 5 + i)).join('');
          };
          draw(0);
          const rows = Array.from(wrap.querySelectorAll('tbody tr'));

          // Move the ruler to each plant, read the height, fill the table
          const measure = async () => {
            const meas = S.q(svg, '#fer-meas'), ruler = S.q(svg, '#fer-ruler'), line = S.q(svg, '#fer-line'), val = S.q(svg, '#fer-val');
            meas.setAttribute('opacity', 1);
            for (let i = 0; i < 6; i++) {
              const rx = X(i) + 34;
              const cm = HEIGHTS[i][week], top = SOIL - cm * PX;
              ruler.setAttribute('transform', `translate(${rx} 0)`);
              if (!await api.tween(260, k => {
                line.setAttribute('d', `M${X(i) - 6} ${S.f1(top)} L${rx} ${S.f1(top)}`);
                line.setAttribute('opacity', k);
              })) return false;
              val.setAttribute('transform', `translate(${rx + 34} ${S.f1(top)})`);
              S.q(val, 'text').textContent = `${cm} cm`;
              api.sfx('tick');
              const td = rows[i].children[week + 1];
              td.textContent = cm;
              wrap.querySelectorAll('.fer-now').forEach(t => t.classList.remove('fer-now'));
              td.classList.add('fill', 'fer-now');
              if (!await api.wait(420)) return false;
            }
            meas.setAttribute('opacity', 0);
            wrap.querySelectorAll('.fer-now').forEach(t => t.classList.remove('fer-now'));
            return true;
          };

          const btn = api.button('📏 Measure at start', async () => {
            if (busy) return;
            busy = true; btn.disabled = true;
            if (measured === week) {
              // Grow for a week: water every pot the same, then grow
              week++;
              S.q(svg, '#fer-week').textContent = `Week ${week}`;
              api.sfx('water');
              const dropsG = S.q(svg, '#fer-drops');
              const drops = [];
              for (let i = 0; i < 6; i++) for (let k = 0; k < 4; k++) {
                const n = S.frag(S.drop({ x: X(i) - 12 + k * 8, y: 20, s: .6 }));
                dropsG.appendChild(n);
                drops.push({ n, x: X(i) - 12 + k * 8, d: k * .08 });
              }
              await api.tween(900, (k, raw) => drops.forEach(d => {
                const t = Math.max(0, Math.min(1, raw * 1.3 - d.d));
                d.n.setAttribute('transform', `translate(${d.x} ${S.f1(20 + (SOIL - 30) * t * t)}) scale(.6)`);
                d.n.setAttribute('opacity', t >= 1 ? 0 : 1);
              }), W.ease.linear);
              dropsG.innerHTML = '';
              if (!api.alive()) return;
              api.sfx('grow');
              const from = cur.slice();
              await api.tween(1400, k => {
                HEIGHTS.forEach((r, i) => { cur[i] = from[i] + (r[week] - from[i]) * k; });
                draw((week - 1 + k) * .16);
              });
              if (!api.alive()) return;
              api.say(`After ${week} week${week > 1 ? 's' : ''}. Let's measure the plants.`);
            } else {
              api.say('Let\'s measure the plants at the start.');
            }
            if (!await measure()) return;
            measured = week;
            busy = false;
            if (week < 4) {
              btn.disabled = false;
              btn.innerHTML = '⏩ Next week';
            } else {
              btn.innerHTML = '✔ 4 weeks done';
              finish();
            }
          }, { cls: 'primary pulse' });

          // Bar chart of the final heights
          const chart = () => {
            const g = S.q(svg, '#fer-chart');
            const x0 = 90, y0 = 236, sc = 9;
            let m = `<rect x="20" y="8" width="600" height="254" rx="12" fill="#fff" stroke="#EADFCB" stroke-width="2"/>
              ${S.text(320, 34, 'Height after 4 weeks', { size: 19, fill: '#3B3F6B' })}
              <path d="M${x0} 44 L${x0} ${y0} L600 ${y0}" stroke="#3B3F6B" stroke-width="2.5" fill="none"/>`;
            [0, 5, 10, 15, 20].forEach(v => {
              m += `<path d="M${x0 - 5} ${y0 - v * sc} L600 ${y0 - v * sc}" stroke="#E5E0D6" stroke-width="1"/>
                <text x="${x0 - 10}" y="${y0 - v * sc + 5}" text-anchor="end" font-size="14" font-weight="700" fill="#3B3F6B">${v}</text>`;
            });
            m += `<text x="36" y="140" font-size="14" font-weight="700" fill="#3B3F6B" transform="rotate(-90 36 140)" text-anchor="middle">cm</text>`;
            HEIGHTS.forEach((r, i) => {
              const bx = x0 + 22 + i * 82;
              m += `<rect class="fer-bar" data-h="${r[4] * sc}" x="${bx}" y="${y0}" width="52" height="0" rx="4" fill="${i < 3 ? '#3E9B4F' : '#F2A93B'}"/>
                <text x="${bx + 26}" y="${y0 + 18}" text-anchor="middle" font-size="15" font-weight="800">${i + 1}</text>
                <text class="fer-barv" x="${bx + 26}" y="${y0 - r[4] * sc - 6}" text-anchor="middle" font-size="14" font-weight="800" opacity="0">${r[4]}</text>`;
            });
            m += `<g transform="translate(636 130)">
              <rect width="16" height="16" fill="#3E9B4F"/><text x="22" y="14" font-size="16" font-weight="700">with fertiliser</text>
              <rect y="28" width="16" height="16" fill="#F2A93B"/><text x="22" y="42" font-size="16" font-weight="700">no fertiliser</text></g>`;
            g.innerHTML = m;
            const bars = S.qa(g, '.fer-bar');
            api.sfx('grow');
            api.tween(1200, k => bars.forEach(b => {
              const h = +b.dataset.h * k;
              b.setAttribute('height', S.f1(h)); b.setAttribute('y', S.f1(y0 - h));
            }), W.ease.out).then(ok => ok && S.qa(g, '.fer-barv').forEach(t => t.setAttribute('opacity', 1)));
          };
          let showChart = false;
          const setView = v => {
            showChart = v;
            S.q(svg, '#fer-chart').setAttribute('opacity', v ? 1 : 0);
            plantsG.setAttribute('opacity', v ? .12 : 1);
            S.q(svg, '#fer-tabt').textContent = v ? '🪴 Plants' : '📊 Bar chart';
          };
          S.q(svg, '#fer-tab').addEventListener('click', () => { api.sfx('swoosh'); setView(!showChart); });

          const finish = () => {
            chart();
            setView(true);
            const tab = S.q(svg, '#fer-tab');
            tab.setAttribute('opacity', 1); tab.style.pointerEvents = '';
            api.controls.innerHTML = '';
            api.say('Here are the results as a bar chart. Do plants grow taller when they are given fertiliser?');
            api.choice({
              q: 'Do plants grow taller when they are given fertiliser?',
              options: ['No', 'Yes', 'They grow the same'],
              correct: 1,
              hints: { 0: 'Look at the bars. Which plants grew tallest?', 2: 'Compare the green bars with the orange bars.' },
              explain: 'Plants 1 to 3 had fertiliser. They grew taller than plants 4 to 6.',
              onRight: () => {
                api.star();
                api.timeout(() => {
                  api.controls.innerHTML = '';
                  setView(false);
                  api.choice({
                    q: 'Look at the leaves. What happened to plants 4 to 6?',
                    options: ['They turned blue', 'They got darker green', 'They got paler'],
                    correct: 2,
                    hints: { 0: 'Look again at the colour of the leaves.', 1: 'Compare them with plants 1 to 3.' },
                    explain: 'Without fertiliser they did not get enough minerals, so their leaves lost some green colour.',
                  });
                  api.say('Look at the leaves. What happened to plants 4 to 6?');
                }, 4500);
              },
            });
          };
        },
      },
    ],
  });
})();
