// Chapter 11: The pathway of water
(() => {
  const WATER = '#3BA7E5';

  // Same maths as S.plant, so we know where the stem and each leaf are
  function plantGeo(opts) {
    const o = Object.assign({ x: 400, y: 400, h: 200, grow: 1, bend: 0, droop: 0, leaves: 6, leafL: 46, leafStart: .3 }, opts);
    const h = Math.max(4, o.h * o.grow), dir = o.bend < 0 ? -1 : 1;
    const P = [{ x: o.x, y: o.y }, { x: o.x, y: o.y - h * .42 },
      { x: o.x + o.bend * h * .22 + dir * o.droop * h * .42, y: o.y - h * (.86 - .08 * o.droop) },
      { x: o.x + o.bend * h * .62 + dir * o.droop * h * .5, y: o.y - h * (1 - .1 * Math.abs(o.bend) - .55 * o.droop) }];
    const at = t => S.bez(P[0], P[1], P[2], P[3], t);
    const n = Math.round(o.leaves), ls = Math.sqrt(Math.min(1.2, o.grow));
    const leaves = [];
    for (let i = 0; i < n; i++) {
      const t = o.leafStart + (0.93 - o.leafStart) * (n === 1 ? .5 : i / (n - 1));
      const base = at(t), tan = S.bezAngle(P[0], P[1], P[2], P[3], t);
      const side = i % 2 ? -1 : 1;
      let a = tan + side * (58 - 12 * t);
      a = side > 0 ? S.lerp(a, 70, o.droop * .85) : S.lerp(a, 110, o.droop * .85);
      const size = (1 - .35 * (i / Math.max(1, n))) * ls;
      const len = 5 * size + o.leafL * size, r = a * Math.PI / 180;
      leaves.push({
        t, base, a,
        tip: { x: base.x + Math.cos(r) * len, y: base.y + Math.sin(r) * len },
        mid: { x: base.x + Math.cos(r) * len * .55, y: base.y + Math.sin(r) * len * .55 },
      });
    }
    return { at, leaves, tip: P[3] };
  }

  // Wisps of water vapour that drift up and fade away
  function makeVapour(api, layer, { color = '#8FCBF0', width = 4 } = {}) {
    const list = [];
    api.loop(dt => {
      for (let i = list.length - 1; i >= 0; i--) {
        const w = list[i];
        w.t += dt;
        const k = w.t / w.life;
        if (k >= 1) { w.n.remove(); list.splice(i, 1); continue; }
        const x = w.x + Math.sin(w.t * 3 + w.ph) * 5 + w.vx * w.t, y = w.y - w.vy * w.t;
        w.n.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${(.6 + k * .7).toFixed(2)})`);
        w.n.setAttribute('opacity', (Math.sin(k * Math.PI) * .9).toFixed(2));
      }
    });
    return (x, y, o = {}) => {
      const n = S.el('path', { d: 'M0 0 q-7 -8 0 -16 t0 -16', stroke: o.color || color, 'stroke-width': width, fill: 'none', 'stroke-linecap': 'round', opacity: 0 }, o.layer || layer);
      list.push({ n, x, y, t: 0, life: o.life || 2.2, vy: o.vy || 30, vx: o.vx != null ? o.vx : (Math.random() - .5) * 10, ph: Math.random() * 6 });
    };
  }

  // Walk along a list of points
  function along(pts, s) {
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1], b = pts[i], d = Math.hypot(b.x - a.x, b.y - a.y) || 1;
      if (s <= d) return { x: a.x + (b.x - a.x) * s / d, y: a.y + (b.y - a.y) * s / d, done: false };
      s -= d;
    }
    return { ...pts[pts.length - 1], done: true };
  }

  const clockFace = (x, y, id) => `<g id="${id}" transform="translate(${x} ${y})" opacity="0">
      <circle r="30" fill="#fff" stroke="#34495E" stroke-width="4"/>
      <path class="hand" d="M0 0 L0 -21" stroke="#C8452F" stroke-width="4" stroke-linecap="round"/><circle r="4" fill="#34495E"/></g>`;

  App.chapter({
    id: 'pathway',
    title: 'The pathway of water',
    icon: '💧',
    group: 'Moving water',
    keywords: [
      { w: 'arrows', d: 'Pointed lines that show which way something moves.' },
      { w: 'evaporating', d: 'When water turns into a gas called water vapour and goes into the air.' },
      { w: 'tubes', d: 'Long, thin, hollow pipes that water can move through.' },
      { w: 'celery', d: 'A plant with long crunchy stalks that we can eat.' },
      { w: 'slice', d: 'A thin, flat piece cut from something.' },
      { w: 'regularly', d: 'Again and again, at the same times.' },
      { w: 'condensed', d: 'When water vapour cools down and turns back into drops of water.' },
      { w: 'improve', d: 'To make something better.' },
    ],
    steps: [
      // ---------- 1. The path of water ----------
      {
        text: [
          'The roots of a plant take in water from the soil. The **arrows** show where the water goes next.',
          'Water moves up through the stem and into the leaves. Then the water is **evaporating** into the air.',
        ],
        ask: ['Press play. Look at the leaves on the diagram. Can you see some arrows showing water going out of the leaf into the air?', 'Can you see another place where water is evaporating into the air? Click on it!'],
        activity: true,
        scene(stage, api) {
          const GY = 330;
          const po = { x: 400, y: GY, h: 260, leaves: 8, leafL: 72, leafW: 28, leafColor: '#43A047', roots: false, seed: 7 };
          const geo = plantGeo(po);
          const soilArrows = [[250, 385, 330, 372], [555, 380, 475, 372], [270, 460, 345, 420], [540, 455, 460, 420], [360, 500, 385, 450], [450, 500, 420, 452], [215, 420, 300, 400], [590, 420, 505, 402]]
            .map(a => S.arrow(a[0], a[1], a[2], a[3], { color: '#7FD0FF', w: 4, head: 11, cls: 'arrow flow' })).join('');
          const stemPath = S.stemPath(po);
          const toLeaves = geo.leaves.map(l => `<path d="M${S.f1(l.base.x)} ${S.f1(l.base.y)} L${S.f1(l.mid.x)} ${S.f1(l.mid.y)}" stroke="${WATER}" stroke-width="3" fill="none" class="flow"/>`).join('');
          const stemArrows = [.2, .5, .78].map(t => { const p = geo.at(t); return S.arrow(p.x + 14, p.y + 16, p.x + 14, p.y - 12, { color: WATER, w: 3, head: 9 }); }).join('');
          const outArrows = geo.leaves.map(l => {
            const r = l.a * Math.PI / 180;
            let dx = Math.cos(r), dy = Math.sin(r) - 1.3;
            const m = Math.hypot(dx, dy); dx /= m; dy /= m;
            return S.arrow(l.tip.x + dx * 4, l.tip.y + dy * 4, l.tip.x + dx * 40, l.tip.y + dy * 40, { color: '#5DB5EA', w: 3.5, head: 10 });
          }).join('');
          const svg = api.svg(`
            <rect width="800" height="520" fill="#F6FBFF"/>
            <rect y="${GY}" width="800" height="${520 - GY}" fill="url(#g-soil)"/>
            <path d="M0 ${GY} Q200 ${GY - 6} 400 ${GY} T800 ${GY}" stroke="#6B4226" stroke-width="5" fill="none"/>
            <clipPath id="pw-rclip"><rect y="${GY + 2}" width="800" height="200"/></clipPath>
            <g clip-path="url(#pw-rclip)">${S.roots({ x: 400, y: GY + 1, depth: 150, spread: 170, color: '#F3D98E', w: 5, seed: 7 })}</g>
            <g id="pw-plant" class="hot">${S.plant(po)}</g>
            <g id="pw-s1" opacity="0">${soilArrows}</g>
            <g id="pw-s2" opacity="0"><path d="${stemPath}" stroke="${WATER}" stroke-width="4" fill="none" class="flow"/>${toLeaves}${stemArrows}</g>
            <g id="pw-s3" opacity="0">${outArrows}</g>
            <g id="pw-vap"></g>
            <rect id="pw-soilHot" x="0" y="${GY - 8}" width="800" height="34" fill="transparent" style="cursor:pointer"/>
            <rect id="pw-airHot" x="0" y="0" width="800" height="60" fill="transparent"/>
            <g id="pw-steps" transform="translate(30 30)">
              ${[['1', 'roots take in'], ['2', 'up the stem'], ['3', 'into the air']].map((s, i) => `<g class="pw-st" transform="translate(0 ${i * 46})" opacity=".35">
                <circle r="17" fill="${WATER}"/>${S.text(0, 7, s[0], { size: 19, fill: '#fff' })}${S.text(26, 7, s[1], { size: 18, anchor: 'start', fill: '#1D5C87' })}</g>`).join('')}
            </g>
          `);
          const vap = makeVapour(api, S.q(svg, '#pw-vap'));
          const stepG = S.qa(svg, '.pw-st');
          let stage3 = false, soilOn = false, playing = false;
          const show = async (id, i, msg, snd) => {
            api.sfx(snd);
            stepG[i].setAttribute('opacity', 1);
            stepG[i].classList.add('pop-in');
            const g = S.q(svg, id);
            await api.tween(700, k => g.setAttribute('opacity', k));
            api.say(msg);
          };
          const play = async () => {
            if (playing) return;
            playing = true; playBtn.disabled = true;
            await show('#pw-s1', 0, 'One. The roots take in water from the soil.', 'water');
            if (!await api.wait(3200)) return;
            await show('#pw-s2', 1, 'Two. Water moves up through the stem and into the leaves.', 'bubble');
            if (!await api.wait(3600)) return;
            await show('#pw-s3', 2, 'Three. Look at the arrows at the leaves. Water goes out of the leaves into the air. The water is evaporating.', 'whoosh');
            stage3 = true;
            playBtn.disabled = false; playing = false;
            if (!await api.wait(7000)) return;
            if (!soilOn) api.info('Can you see another place where water is evaporating? Click on it!');
          };
          // Wisps from the leaves (and later the soil)
          api.interval(() => {
            if (stage3) { const l = geo.leaves[Math.floor(Math.random() * geo.leaves.length)]; vap(l.tip.x, l.tip.y - 6); }
            if (soilOn) for (let i = 0; i < 2; i++) vap(40 + Math.random() * 720, GY - 4, { color: '#6FB3E0', vy: 24 });
          }, 260);
          S.q(svg, '#pw-soilHot').addEventListener('click', () => {
            if (!stage3) { api.sfx('tick'); api.info('Press play first to see where the water goes.'); return; }
            if (soilOn) { api.sfx('pop'); api.say('Water is evaporating from the soil into the air.'); return; }
            soilOn = true;
            api.sfx('magic');
            api.star();
            api.praise('Water is evaporating from the soil too!');
          });
          S.q(svg, '#pw-plant').addEventListener('click', () => {
            api.sfx('pop');
            if (!stage3) api.say('This is the plant. Press play to see where the water goes.');
            else if (!soilOn) api.say('Yes, water evaporates from the leaves. Can you find another place? Look lower down.');
            else api.say('Water goes up the stem and evaporates from the leaves.');
          });
          S.q(svg, '#pw-airHot').addEventListener('click', () => { api.sfx('tick'); if (stage3 && !soilOn) api.say('The water vapour goes into the air. But where else does it come from? Look lower down.'); });
          api.row();
          const playBtn = api.button('▶ Play: follow the water', play, { cls: 'primary pulse' });
        },
      },

      // ---------- 2. Tubes and celery ----------
      {
        title: 'Water tubes',
        text: [
          'Water moves up the stem in big **tubes**. Let\'s look at some evidence for this. As the plant grows it makes more and more water tubes.',
          'Look at some **celery** that has been standing in a beaker of water and red food colouring.',
        ],
        ask: 'Click the stem to grow more tubes. Then wait for the red stripes, cut a **slice**, and click every red dot to count them.',
        tip: 'Your teacher will cut a slice of it for you. Knives are sharp!',
        activity: true,
        scene(stage, api) {
          const X = 380, BY = 470, LIQ = 380, CUT = 290;
          const r = S.rng(4);
          // Celery leaves on little stalks
          let leaves = '';
          [[X - 42, 88], [X + 38, 78], [X - 2, 58]].forEach(([lx, ly], j) => {
            leaves += `<path d="M${X} 142 Q${(X + lx) / 2} ${ly + 30} ${lx} ${ly}" stroke="#8DB547" stroke-width="5" fill="none" stroke-linecap="round"/>`;
            for (let k = 0; k < 3; k++) leaves += S.leaf({ x: lx, y: ly, angle: -150 + k * 60 + j * 20 + r() * 20, L: 36, W: 13, shape: 'toothed', color: ['#A8C94B', '#B8D45A', '#9DBF3E'][k], stalk: 4, veins: true });
          });
          const stalk = `M${X - 22} ${BY - 8} C${X - 23} 360 ${X - 21} 230 ${X - 18} 140 Q${X} 132 ${X + 17} 140 C${X + 20} 230 ${X + 22} 360 ${X + 21} ${BY - 8}Z`;
          const stripes = [-15, -8, 0, 8, 15].map(o => `<path class="pw-stripe" d="M${X + o} ${BY - 12} C${X + o} 360 ${X + o * .95} 230 ${X + o * .85} 146" pathLength="100" stroke="#D62839" stroke-width="2.6" fill="none" stroke-dasharray="100 100" stroke-dashoffset="100"/>`).join('');
          const ridges = [-12, -4, 4, 12].map(o => `<path d="M${X + o} ${BY - 12} C${X + o} 360 ${X + o * .95} 230 ${X + o * .85} 146" stroke="#D7EBA0" stroke-width="2" fill="none"/>`).join('');
          // The crescent-shaped slice, with red dots near the outside
          const O = t => ({ x: 100 * Math.cos(t), y: 110 * Math.sin(t) - 50 }), I = t => ({ x: 58 * Math.cos(t), y: 62 * Math.sin(t) - 32 });
          const t0 = .08 * Math.PI, t1 = .92 * Math.PI;
          let cres = 'M', inner = '';
          for (let i = 0; i <= 24; i++) { const p = O(t0 + (t1 - t0) * i / 24); cres += `${S.f1(p.x)} ${S.f1(p.y)} L`; }
          const e1 = O(t1), i1 = I(t1), e0 = O(t0), i0 = I(t0);
          cres = cres.slice(0, -2) + ` Q${S.f1((e1.x + i1.x) / 2 - 14)} ${S.f1((e1.y + i1.y) / 2)} ${S.f1(i1.x)} ${S.f1(i1.y)}`;
          for (let i = 24; i >= 0; i--) { const p = I(t0 + (t1 - t0) * i / 24); inner += ` L${S.f1(p.x)} ${S.f1(p.y)}`; }
          cres += inner + ` Q${S.f1((e0.x + i0.x) / 2 + 14)} ${S.f1((e0.y + i0.y) / 2)} ${S.f1(e0.x)} ${S.f1(e0.y)}Z`;
          const N = 9;
          const dots = [...Array(N)].map((_, j) => {
            const t = .17 * Math.PI + j * (.66 * Math.PI / (N - 1)), a = I(t), b = O(t);
            return { x: S.lerp(a.x, b.x, .6), y: S.lerp(a.y, b.y, .6) };
          });
          const sliceSvg = `<path d="${cres}" fill="#F4F8E4" stroke="#8DBF4A" stroke-width="6" stroke-linejoin="round"/>
            <path d="${cres}" fill="none" stroke="#fff" stroke-width="2" opacity=".6" transform="scale(.94) translate(0 2)"/>
            ${dots.map((d, j) => `<g class="pw-dot hot" data-j="${j}"><circle cx="${S.f1(d.x)}" cy="${S.f1(d.y)}" r="16" fill="transparent"/><circle cx="${S.f1(d.x)}" cy="${S.f1(d.y)}" r="7" fill="#D62839"/><circle class="pw-ring" cx="${S.f1(d.x)}" cy="${S.f1(d.y)}" r="12" fill="none" stroke="#FFC400" stroke-width="4" opacity="0"/></g>`).join('')}`;
          const svg = api.svg(`
            <rect width="800" height="520" fill="#FFF3DC"/>
            <rect x="0" y="${BY}" width="800" height="50" fill="#C9955E"/><rect x="0" y="${BY - 4}" width="800" height="8" fill="#A8743F"/>
            <g id="pw-tubes" class="hot"></g>
            ${S.text(120, 500, 'inside a stem', { size: 17, fill: '#fff' })}
            <g>${leaves}</g>
            <path d="${stalk}" fill="#B5D86A" stroke="#7FA33A" stroke-width="2.5"/>
            ${ridges}${stripes}
            <path id="pw-cutline" d="M${X - 26} ${CUT} L${X + 26} ${CUT}" stroke="#fff" stroke-width="3" opacity="0"/>
            <rect id="pw-liq" x="${X - 57}" y="${LIQ}" width="114" height="${BY - LIQ - 3}" rx="6" fill="#E8394E" opacity=".78"/>
            <path d="M${X - 68} 305 L${X - 60} 313 L${X - 60} ${BY - 10} Q${X - 60} ${BY} ${X - 50} ${BY} L${X + 50} ${BY} Q${X + 60} ${BY} ${X + 60} ${BY - 10} L${X + 60} 313 L${X + 68} 305" fill="url(#g-glass)" stroke="#6E8CA0" stroke-width="3.5" stroke-linejoin="round"/>
            ${S.text(X, 500, 'celery in red water', { size: 17, fill: '#fff' })}
            ${clockFace(X + 110, 60, 'pw-clock')}
            <g id="pw-knife" transform="translate(1000 ${CUT})">
              <path d="M0 -3 L-110 -3 Q-122 4 -110 12 L0 12Z" fill="#CFD8DC" stroke="#78909C" stroke-width="2"/>
              <path d="M-100 -1 L-6 -1" stroke="#fff" stroke-width="2" opacity=".7"/>
              <rect x="0" y="-6" width="62" height="20" rx="8" fill="#6D4C41" stroke="#4E342E" stroke-width="2"/>
              <circle cx="16" cy="4" r="3" fill="#D7CCC8"/><circle cx="44" cy="4" r="3" fill="#D7CCC8"/></g>
            <g id="pw-panel" style="display:none">
              <circle cx="630" cy="250" r="150" fill="#fff" stroke="#E7A07F" stroke-width="4" stroke-dasharray="10 7"/>
              ${S.text(630, 440, 'Red dots counted: ', { size: 20, fill: '#9A3222' }).replace('</text>', '<tspan id="pw-count">0</tspan></text>')}
            </g>
            <g id="pw-slice" style="display:none">${sliceSvg}</g>
          `);
          // Cut-away stem with water tubes; click to add more
          let nTubes = 2, off = 0;
          const tubesG = S.q(svg, '#pw-tubes');
          const drawTubes = () => {
            let s = `<clipPath id="pw-tclip"><rect x="40" y="60" width="160" height="380"/></clipPath>
              <rect x="40" y="60" width="160" height="380" rx="10" fill="#C9E07A" stroke="#7FA33A" stroke-width="3"/>`;
            for (let i = 0; i < nTubes; i++) {
              const cx = 40 + 160 * (i + 1) / (nTubes + 1);
              s += `<rect x="${cx - 11}" y="60" width="22" height="380" fill="#E3F4FF" stroke="#9CC7E0" stroke-width="2"/>`;
              s += `<g clip-path="url(#pw-tclip)" class="pw-arrows" data-x="${cx}"></g>`;
            }
            s += `<ellipse cx="120" cy="60" rx="80" ry="14" fill="#E3EFB0" stroke="#7FA33A" stroke-width="3"/>`;
            s += `<g transform="translate(120 32)"><rect x="-58" y="-16" width="116" height="30" rx="15" fill="#fff" stroke="#7FA33A" stroke-width="2"/>${S.text(0, 6, nTubes + ' tubes', { size: 17, fill: '#2A7439' })}</g>`;
            tubesG.innerHTML = s;
          };
          drawTubes();
          api.loop(dt => {
            off = (off + dt * 60) % 80;
            S.qa(tubesG, '.pw-arrows').forEach((g, i) => {
              const cx = +g.dataset.x;
              let s = '';
              for (let k = 0; k < 6; k++) {
                const y = 440 - ((k * 80 + off + i * 23) % 480);
                s += `<path d="M${cx} ${S.f1(y + 12)} L${cx} ${S.f1(y - 10)} M${cx - 6} ${S.f1(y - 3)} L${cx} ${S.f1(y - 11)} L${cx + 6} ${S.f1(y - 3)}" stroke="#D62839" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
              }
              g.innerHTML = s;
            });
          });
          tubesG.addEventListener('click', () => {
            if (nTubes >= 5) { api.sfx('tick'); api.say('This stem has lots of tubes now.'); return; }
            nTubes++;
            drawTubes();
            api.sfx('grow');
            api.say(`As the plant grows it makes more water tubes. Now there are ${nTubes}.`);
          });

          // Wait: red stripes climb the stalk
          const stripesEls = S.qa(svg, '.pw-stripe');
          const liq = S.q(svg, '#pw-liq');
          let waited = false, cut = false, busy = false;
          const wait = async () => {
            if (busy || waited) return;
            busy = true; waitBtn.disabled = true; waitBtn.classList.remove('pulse');
            const clock = S.q(svg, '#pw-clock');
            clock.setAttribute('opacity', 1);
            api.sfx('bubble');
            if (!await api.tween(3500, k => {
              stripesEls.forEach((s, i) => s.setAttribute('stroke-dashoffset', S.f1(100 * (1 - S.clamp(k * 1.15 - i * .03)))));
              S.q(clock, '.hand').setAttribute('transform', `rotate(${k * 720})`);
              liq.setAttribute('y', LIQ + k * 12); liq.setAttribute('height', BY - LIQ - 3 - k * 12);
            })) return;
            waited = true; busy = false;
            api.sfx('magic');
            api.say('Look! Red stripes. These red stripes show where the tubes are. Now cut a slice.');
            cutBtn.disabled = false; cutBtn.classList.add('pulse');
          };
          // Cut: the knife slides in, a slice falls and turns to face you
          const cutIt = async () => {
            if (busy || !waited || cut) return;
            busy = true; cutBtn.disabled = true; cutBtn.classList.remove('pulse');
            const knife = S.q(svg, '#pw-knife');
            api.sfx('swoosh');
            if (!await api.tween(800, k => knife.setAttribute('transform', `translate(${1000 - (1000 - (X + 60)) * k} ${CUT})`), W.ease.out)) return;
            api.sfx('snip');
            await api.tween(250, k => knife.setAttribute('transform', `translate(${X + 60 - 40 * k} ${CUT})`));
            S.q(svg, '#pw-cutline').setAttribute('opacity', 1);
            api.tween(600, k => knife.setAttribute('transform', `translate(${X + 20 + 980 * k} ${CUT})`));
            const slice = S.q(svg, '#pw-slice');
            slice.style.display = '';
            S.q(svg, '#pw-panel').style.display = '';
            S.q(svg, '#pw-panel').classList.add('pop-in');
            api.sfx('whoosh');
            if (!await api.tween(1300, k => {
              const x = S.lerp(X, 630, k), y = S.lerp(CUT, 240, k) - Math.sin(k * Math.PI) * 60;
              const s = S.lerp(.22, 1.2, k);
              slice.setAttribute('transform', `translate(${S.f1(x)} ${S.f1(y)}) rotate(${S.f1((1 - k) * 90)}) scale(${S.f1(s)} ${(s * S.lerp(.12, 1, k)).toFixed(3)})`);
            }, W.ease.inOut)) return;
            api.sfx('thud');
            cut = true; busy = false;
            api.say('Here is the slice. Can you see the red dots? Click each red dot to count them.');
          };
          const found = new Set();
          S.qa(svg, '.pw-dot').forEach(g => g.addEventListener('click', () => {
            if (!cut) return;
            const j = g.dataset.j;
            if (found.has(j)) { api.sfx('tick'); return; }
            found.add(j);
            S.q(g, '.pw-ring').setAttribute('opacity', 1);
            api.sfx('pop');
            S.q(svg, '#pw-count').textContent = found.size;
            if (found.size < N) api.say(String(found.size));
            else {
              api.star();
              api.praise(`${N} red dots! The red dots show where water moves up through the stem.`);
            }
          }));
          api.row();
          const waitBtn = api.button('⏩ Wait one day', wait, { cls: 'primary pulse' });
          const cutBtn = api.button('🔪 Cut a slice', cutIt, { cls: 'primary' });
          cutBtn.disabled = true;
        },
      },

      // ---------- 3. Water in leaves ----------
      {
        title: 'Water in leaves',
        text: ['Water evaporates from the leaves of a plant into the air.', 'This helps more water to come up the stem.'],
        ask: 'Slide the weather to sunny and warm. What happens to the water?',
        activity: true,
        scene(stage, api) {
          const GY = 340;
          const po = { x: 360, y: GY, h: 250, leaves: 6, leafL: 70, leafW: 30, leafShape: 'round', leafColor: '#4CAF50', roots: false, seed: 12 };
          const geo = plantGeo(po);
          const num = (x, y, n, lines) => `<g transform="translate(${x} ${y})"><circle r="15" fill="#fff" stroke="#2B2A28" stroke-width="2.5"/>${S.text(0, 6, n, { size: 18 })}
            ${lines.map((l, i) => S.text(24, 7 + i * 22, l, { size: 18, anchor: 'start', weight: 700, fill: 'inherit' })).join('')}</g>`;
          const svg = api.svg(`
            <rect id="pw3-sky" width="800" height="${GY}" fill="#CFE3EE"/>
            <g id="pw3-sun">${S.sun({ x: 690, y: 70, r: 36 })}</g>
            <g id="pw3-clouds">${S.cloud({ x: 660, y: 80, s: 1.3, color: '#F2F4F6' })}${S.cloud({ x: 470, y: 60, s: .9, color: '#E9EDF0' })}</g>
            <rect y="${GY}" width="800" height="${520 - GY}" fill="url(#g-darksoil)"/>
            <path d="M0 ${GY} L60 ${GY - 6} L140 ${GY - 2} L230 ${GY - 8} L330 ${GY - 3} L420 ${GY - 9} L520 ${GY - 2} L620 ${GY - 7} L800 ${GY - 3} L800 ${GY + 4} L0 ${GY + 4}Z" fill="#5A4030"/>
            <clipPath id="pw3-rclip"><rect y="${GY + 3}" width="800" height="200"/></clipPath>
            <g clip-path="url(#pw3-rclip)">${S.roots({ x: 360, y: GY + 2, depth: 120, spread: 110, color: '#F3D98E', w: 5, seed: 12 })}</g>
            ${S.plant(po)}
            <path id="pw3-stemflow" d="${S.stemPath(po)}" stroke="#9ED8FF" stroke-width="3" fill="none" class="flow" opacity=".9"/>
            <g id="pw3-parts"></g><g id="pw3-vap"></g>
            <g fill="#2B2A28">${num(480, 118, '3', ['Water evaporates', 'from the leaves.'])}</g>
            <g fill="#2B2A28">${num(470, 262, '2', ['Water moves up the', 'stem to the leaves.'])}</g>
            <g fill="#fff">${num(30, 385, '1', ['Roots take in water', 'from the soil.'])}</g>
            ${S.text(150, 200, 'air', { size: 20, weight: 700, fill: '#37474F' })}
            <g transform="translate(560 372)">
              <rect width="224" height="130" rx="14" fill="#fff" opacity=".95"/>
              ${S.text(12, 30, '💨 Evaporation', { size: 17, anchor: 'start' })}
              <rect x="12" y="40" width="200" height="18" rx="9" fill="#E0E0E0"/><rect id="pw3-bar1" x="12" y="40" width="40" height="18" rx="9" fill="#5DB5EA"/>
              ${S.text(12, 88, '⬆️ Water up the stem', { size: 17, anchor: 'start' })}
              <rect x="12" y="98" width="200" height="18" rx="9" fill="#E0E0E0"/><rect id="pw3-bar2" x="12" y="98" width="40" height="18" rx="9" fill="#2E7DD1"/>
            </g>
          `);
          const vap = makeVapour(api, S.q(svg, '#pw3-vap'), { color: '#3C8FCB', width: 4 });
          const partsG = S.q(svg, '#pw3-parts');
          const stemPts = [...Array(21)].map((_, i) => geo.at(i / 20));
          let warm = .2;
          const parts = [];
          let acc = 0, accV = 0;
          api.loop(dt => {
            const rate = 1 + warm * 9, speed = 40 + warm * 160;
            acc += dt * rate; accV += dt * rate;
            while (acc > 1) {
              acc--;
              // A water drop: from the soil, into a root, up the stem to a leaf
              const leaf = geo.leaves[Math.floor(Math.random() * geo.leaves.length)];
              const upTo = stemPts.filter((p, i) => i / 20 <= leaf.t);
              const pts = [{ x: po.x + (Math.random() - .5) * 180, y: GY + 60 + Math.random() * 60 }, { x: po.x, y: GY + 20 }, ...upTo, leaf.base, leaf.mid];
              const n = S.el('circle', { r: 4, fill: '#7FD0FF', stroke: '#fff', 'stroke-width': 1 }, partsG);
              parts.push({ n, pts, s: 0, leaf });
            }
            for (let i = parts.length - 1; i >= 0; i--) {
              const p = parts[i];
              p.s += speed * dt;
              const q = along(p.pts, p.s);
              p.n.setAttribute('cx', q.x.toFixed(1)); p.n.setAttribute('cy', q.y.toFixed(1));
              if (q.done) { p.n.remove(); parts.splice(i, 1); vap(p.leaf.tip.x, p.leaf.tip.y - 4, { vy: 25 + warm * 40 }); }
            }
          });
          const apply = v => {
            warm = v / 100;
            S.q(svg, '#pw3-sky').setAttribute('fill', S.mix('#B8C7D1', '#8FD3FF', warm));
            S.q(svg, '#pw3-clouds').setAttribute('opacity', (1 - warm * .9).toFixed(2));
            S.q(svg, '#pw3-sun').setAttribute('opacity', (.3 + warm * .7).toFixed(2));
            S.q(svg, '#pw3-bar1').setAttribute('width', S.f1(20 + warm * 180));
            S.q(svg, '#pw3-bar2').setAttribute('width', S.f1(20 + warm * 180));
            S.q(svg, '#pw3-stemflow').style.animationDuration = (1.6 - warm * 1.3).toFixed(2) + 's';
          };
          let ready = false, lastZone = 0;
          api.slider({
            label: '☀️ Weather', min: 0, max: 100, step: 1, value: 20,
            format: v => v < 34 ? '☁️ cool, cloudy' : v < 67 ? '⛅ mild' : '☀️ sunny, warm',
            onInput: v => {
              apply(v);
              const zone = v < 34 ? 0 : v < 67 ? 1 : 2;
              if (!ready || zone === lastZone) return;
              lastZone = zone;
              if (zone === 2) {
                api.sfx('magic');
                api.star();
                api.say('Sunny and warm! More water evaporates from the leaves. This pulls more water up the stem.');
              } else if (zone === 0) {
                api.sfx('shrink');
                api.say('Cool and cloudy. Less water evaporates, so less water comes up the stem.');
              } else api.sfx('whoosh');
            },
          });
          ready = true;
        },
      },

      // ---------- 4. The plastic bag investigation ----------
      {
        title: 'Evidence in a bag',
        text: [
          'Let\'s look at some evidence. You will need a plant in a pot of soil. Water it before you start. Put the plant into a transparent plastic bag. Tie it around the pot.',
          'Observe the plant **regularly**. Water that evaporated from the leaves has **condensed** on the inside of the plastic bag.',
        ],
        ask: ['Can you see drops of water inside the bag?', 'Could you tie the bag in a different place to **improve** this investigation?'],
        tip: 'Hmmm. Maybe water evaporated from the soil too?',
        activity: true,
        scene(stage, api) {
          const X = 360, RIM = 330, SOIL = RIM + 4, TABLE = 450;
          const po = { x: X, y: SOIL, h: 200, leaves: 7, leafL: 50, leafW: 20, leafColor: '#43A047', roots: false, seed: 5 };
          const geo = plantGeo(po);
          // Bag outline, tied at height tieY with half-width hw
          const bagD = (tieY, hw) => `M${X - hw} ${tieY} C${X - hw - 50} ${tieY - 30} ${X - 140} ${tieY - 90} ${X - 135} 170 C${X - 130} 100 ${X - 60} 88 ${X} 88 C${X + 60} 88 ${X + 130} 100 ${X + 135} 170 C${X + 140} ${tieY - 90} ${X + hw + 50} ${tieY - 30} ${X + hw} ${tieY}Z`;
          const svg = api.svg(`
            <rect width="800" height="520" fill="#EAF4E4"/>
            <rect width="800" height="${TABLE}" fill="#F3F7EC"/>
            <path d="M0 60 L800 60" stroke="#DCE8D2" stroke-width="3"/>
            <rect x="0" y="${TABLE}" width="800" height="70" fill="#C9955E"/><rect x="0" y="${TABLE - 4}" width="800" height="8" fill="#A8743F"/>
            <g id="pw4-plant">${S.pot({ x: X, y: RIM, w: 150, h: 120 })}${S.plant(po)}</g>
            <ellipse id="pw4-wet" cx="${X}" cy="${RIM + 2}" rx="75" ry="8.6" fill="#3A2213" opacity="0"/>
            <clipPath id="pw4-clip"><path id="pw4-clipPath" d="${bagD(370, 72)}"/></clipPath>
            <g id="pw4-vapIn" clip-path="url(#pw4-clip)"></g>
            <g id="pw4-vapOut"></g>
            <g id="pw4-bag" transform="translate(0 -460)">
              <path id="pw4-bagShape" d="${bagD(370, 100)}" fill="#EAF6FF" fill-opacity=".22" stroke="#9DB8CC" stroke-width="2.5" stroke-linejoin="round"/>
              <path id="pw4-mist" d="${bagD(370, 100)}" fill="#FFFFFF" fill-opacity="0"/>
              <path d="M${X - 100} 150 Q${X - 110} 200 ${X - 104} 250" stroke="#fff" stroke-width="5" fill="none" opacity=".7" stroke-linecap="round"/>
              <g id="pw4-drops" clip-path="url(#pw4-clip)"></g>
              <g id="pw4-tie" opacity="0"></g>
            </g>
            <g id="pw4-can" transform="translate(640 330) scale(-1.1 1.1)">${S.wateringCan({})}</g>
            <g id="pw4-pour"></g>
            ${clockFace(720, 60, 'pw4-clock')}
          `);
          const bag = S.q(svg, '#pw4-bag'), shape = S.q(svg, '#pw4-bagShape'), mist = S.q(svg, '#pw4-mist'), clipP = S.q(svg, '#pw4-clipPath');
          const dropsG = S.q(svg, '#pw4-drops'), tieG = S.q(svg, '#pw4-tie');
          const vapIn = makeVapour(api, S.q(svg, '#pw4-vapIn'), { color: '#9CCFEF' });
          let phase = 0, busy = false, tieMode = 'pot', soilVap = true;
          const setBag = (tieY, hw) => { const d = bagD(tieY, hw); shape.setAttribute('d', d); mist.setAttribute('d', d); clipP.setAttribute('d', d); };
          const drawTie = (tieY, hw) => {
            tieG.innerHTML = `<rect x="${X - hw - 4}" y="${tieY - 5}" width="${hw * 2 + 8}" height="10" rx="4" fill="#E53935"/>
              <path d="M${X + hw} ${tieY} q18 -16 26 -2 q-10 10 -26 2 q18 16 26 2" fill="#EF5350" stroke="#B71C1C" stroke-width="2"/>`;
          };
          const labels = ['1. 💧 Water the plant', '2. 🛍️ Put the plant in the bag', '3. 🎀 Tie it around the pot', '4. ⏩ Observe for a few hours'];

          async function water() {
            const can = S.q(svg, '#pw4-can');
            api.sfx('whoosh');
            if (!await api.tween(800, k => can.setAttribute('transform', `translate(${640 - 140 * k} ${330 - 130 * k}) scale(-1.1 1.1) rotate(${40 * k})`))) return false;
            api.sfx('pour');
            const pour = S.q(svg, '#pw4-pour');
            for (let i = 0; i < 14; i++) {
              const d = S.frag(S.drop({ x: 0, y: 0, s: .6 }));
              pour.appendChild(d);
              const sx = 406 + Math.random() * 6, sy = 218, dx = 20 + Math.random() * 70;
              api.tween(500, k => d.setAttribute('transform', `translate(${S.f1(sx - k * dx)} ${S.f1(sy + k * 112)}) scale(.6)`), t => t).then(() => d.remove());
              if (!await api.wait(90)) return false;
            }
            S.q(svg, '#pw4-wet').setAttribute('opacity', .75);
            api.sfx('drip');
            await api.tween(700, k => can.setAttribute('transform', `translate(${500 + 140 * k} ${200 + 130 * k}) scale(-1.1 1.1) rotate(${40 * (1 - k)})`));
            api.say('The soil is wet. Now put the plant into the plastic bag.');
            return true;
          }
          async function bagOn() {
            api.sfx('swoosh');
            if (!await api.tween(1200, k => bag.setAttribute('transform', `translate(0 ${S.f1(-460 * (1 - k))})`), W.ease.out)) return false;
            api.sfx('thud');
            api.say('The plant is inside the bag. Now tie it around the pot.');
            return true;
          }
          async function tie(tieY, hw0, hw1) {
            api.sfx('pluck');
            if (!await api.tween(700, k => setBag(tieY, S.lerp(hw0, hw1, k)))) return false;
            drawTie(tieY, hw1);
            tieG.setAttribute('opacity', 1);
            api.sfx('pop');
            return true;
          }
          // Watch for a few hours: vapour rises, mist and drops build up
          async function observe() {
            const clock = S.q(svg, '#pw4-clock');
            clock.setAttribute('opacity', 1);
            const bb = { x1: X - 135, x2: X + 135, y1: 95, y2: tieMode === 'pot' ? 365 : 312 };
            const drops = [];
            api.sfx('bubble');
            let last = 0;
            const ok = await api.tween(5000, k => {
              S.q(clock, '.hand').setAttribute('transform', `rotate(${k * 1080})`);
              mist.setAttribute('fill-opacity', (k * .28).toFixed(2));
              if (k - last > .02) {
                last = k;
                const l = geo.leaves[Math.floor(Math.random() * geo.leaves.length)];
                vapIn(l.tip.x, l.tip.y - 4, { vy: 35 });
                if (soilVap) {
                  const sx = X - 60 + Math.random() * 120;
                  if (tieMode === 'pot') vapIn(sx, SOIL - 2, { vy: 30 });
                  else vapOut(sx, SOIL - 2, { vy: 30, life: 2.6, vx: (sx - X) * .3 });
                }
                // New drops stick to the inside of the bag
                for (let tries = 0; tries < 4; tries++) {
                  const x = bb.x1 + Math.random() * (bb.x2 - bb.x1), y = bb.y1 + Math.random() * (bb.y2 - bb.y1);
                  if (!inBag(x, y) || !nearEdge(x, y)) continue;
                  const n = S.frag(`<g transform="translate(${S.f1(x)} ${S.f1(y)})"><circle r="1" fill="#CFEAFB" stroke="#7FB6D8" stroke-width="1"/><circle r=".4" cx="-1" cy="-1" fill="#fff"/></g>`);
                  dropsG.appendChild(n);
                  drops.push({ n, max: 4 + Math.random() * 5 });
                  if (Math.random() < .15) api.sfx('drip');
                  break;
                }
              }
              drops.forEach(d => { d.r = Math.min(d.max, (d.r || 1) + .06); d.n.firstChild.setAttribute('r', S.f1(d.r)); d.n.lastChild.setAttribute('r', S.f1(d.r * .35)); d.n.lastChild.setAttribute('cx', S.f1(-d.r * .35)); d.n.lastChild.setAttribute('cy', S.f1(-d.r * .35)); });
            }, W.ease.linear);
            return ok;
          }
          const vapOut = makeVapour(api, S.q(svg, '#pw4-vapOut'), { color: '#7FB6DE' });
          const inBag = (x, y) => {
            try { const p = svg.createSVGPoint(); p.x = x; p.y = y; return shape.isPointInFill(p); } catch (e) { return true; }
          };
          // Drops form on the plastic, so keep them near the bag's edge
          const nearEdge = (x, y) => !inBag(x - 22, y) || !inBag(x + 22, y) || !inBag(x, y - 22) || Math.random() < .25;

          async function next() {
            if (busy) return;
            busy = true; mainBtn.disabled = true; mainBtn.classList.remove('pulse');
            let ok = true;
            if (phase === 0) ok = await water();
            else if (phase === 1) ok = await bagOn();
            else if (phase === 2) { ok = await tie(370, 100, 72); if (ok) api.say('The bag is tied around the pot. Now observe the plant regularly.'); }
            else if (phase === 3) {
              ok = await observe();
              if (ok) {
                api.sfx('magic');
                api.say('Water that evaporated from the leaves has condensed on the inside of the plastic bag.');
                askDrops();
              }
            }
            if (!ok || !api.alive()) return;
            phase++;
            busy = false;
            if (phase < 4) { mainBtn.innerHTML = labels[phase]; mainBtn.disabled = false; mainBtn.classList.add('pulse'); }
            else mainBtn.style.display = 'none';
          }
          function askDrops() {
            const c = api.choice({
              q: 'Can you see drops of water inside the bag?',
              options: ['Yes, lots of drops', 'No drops at all'],
              correct: 0,
              hints: { 1: 'Look closely at the inside of the bag. Can you see the little drops?' },
              explain: 'The drops are water that condensed on the plastic.',
              onRight: () => api.timeout(() => { c.parentNode.remove(); askImprove(); }, 2600),
            });
          }
          function askImprove() {
            api.say('Hmmm. Maybe water evaporated from the soil too? Could you tie the bag in a different place to improve this investigation?');
            const c = api.choice({
              q: 'Where could you tie the bag to improve this investigation?',
              options: ['Around the stem, above the soil', 'Around the bottom of the pot', 'Do not tie it at all'],
              correct: 0,
              hints: { 1: 'Then the soil is still inside the bag. Water from the soil would still get in.', 2: 'Then water from the soil and the air could get in.' },
              explain: 'Then only the leaves are inside the bag. Let\'s try it!',
              onRight: () => api.timeout(() => { c.parentNode.remove(); rerun(); }, 2400),
            });
          }
          // Try again with the bag tied around the stem
          async function rerun() {
            busy = true;
            dropsG.innerHTML = ''; mist.setAttribute('fill-opacity', 0); tieG.setAttribute('opacity', 0);
            tieMode = 'stem';
            api.sfx('swoosh');
            if (!await api.tween(800, k => setBag(S.lerp(370, 318, k), S.lerp(72, 30, k)))) return;
            if (!await tie(318, 30, 5)) return;
            api.say('Now the bag is tied around the stem. The soil is outside the bag.');
            if (!await api.wait(1500)) return;
            if (!await observe()) return;
            api.star();
            api.praise('Now the drops in the bag can only come from the leaves. That is a better investigation!');
            const r = api.row();
            api.button('↺ Start again', () => App.go(App.chapters.findIndex(c => c.id === 'pathway'), 3), { parent: r, cls: 'small' });
          }
          api.row();
          const mainBtn = api.button(labels[0], next, { cls: 'primary pulse' });
        },
      },
    ],
  });
})();
