// Chapter 8: Contracting and relaxing
(() => {
  function injectStyle() {
    if (document.getElementById('l3-con-style')) return;
    document.head.insertAdjacentHTML('beforeend', `<style id="l3-con-style">
      .l3-con-mem { display:flex; flex-direction:column; gap:10px; height:100%; }
      .l3-con-head { font-size:19px; text-align:center; background:#FDEBE1; border-radius:14px; padding:6px 12px; font-weight:700; }
      .l3-con-grid { flex:1; display:grid; grid-template-columns:repeat(4, 1fr); gap:12px; }
      .l3-con-card { position:relative; border:0; padding:0; background:none; cursor:pointer; perspective:600px; min-height:110px; }
      .l3-con-in { position:absolute; inset:0; transition: transform .45s; transform-style: preserve-3d; }
      .l3-con-card.up .l3-con-in, .l3-con-card.done .l3-con-in { transform: rotateY(180deg); }
      .l3-con-face { position:absolute; inset:0; border-radius:16px; display:flex; flex-direction:column; align-items:center; justify-content:center; backface-visibility:hidden; box-shadow: var(--shadow); font-weight:800; font-size:17px; }
      .l3-con-back { background: repeating-linear-gradient(45deg, #7E57C2, #7E57C2 10px, #9575CD 10px, #9575CD 20px); color:#fff; font-size:34px; }
      .l3-con-front { background:#fff; border:3px solid #EADFCB; transform: rotateY(180deg); }
      .l3-con-front span { font-size:46px; line-height:1.1; }
      .l3-con-card.done .l3-con-front { border-color: var(--leaf); background: var(--leaf-soft); }
      .l3-con-card.bad .l3-con-front { animation: shake .4s; border-color:#E8833A; }
    </style>`);
  }

  // Lower leg seen from the side, facing right. foot > 0 points the toes down.
  function lowerLeg(foot) {
    const { bone, BONE, SKIN } = L3;
    const K = { x: 380, y: 50 }, A = { x: 392, y: 380 };
    const r = foot * Math.PI / 180;
    const R = (x, y) => ({ x: A.x + (x - A.x) * Math.cos(r) - (y - A.y) * Math.sin(r), y: A.y + (x - A.x) * Math.sin(r) + (y - A.y) * Math.cos(r) });
    const heel = R(356, 402), toe = R(540, 418), top = R(452, 392), ball = R(500, 414);
    const calfA = { x: 352, y: 76 }, shinA = { x: 408, y: 110 };
    const calfL = Math.hypot(heel.x - calfA.x, heel.y - calfA.y), shinL = Math.hypot(top.x - shinA.x, top.y - shinA.y);
    const calfW = S.clamp(34 * 330 / calfL, 22, 52), shinW = S.clamp(16 * 285 / shinL, 11, 26);
    const skin = `M330 20 C300 120 316 250 350 330 C356 360 344 390 340 410 C340 430 ${S.f1(heel.x - 6)} ${S.f1(heel.y + 16)} ${S.f1(heel.x + 10)} ${S.f1(heel.y + 18)} L${S.f1(toe.x)} ${S.f1(toe.y + 14)} C${S.f1(toe.x + 14)} ${S.f1(toe.y)} ${S.f1(toe.x)} ${S.f1(toe.y - 18)} ${S.f1(ball.x - 10)} ${S.f1(ball.y - 26)} L${S.f1(top.x - 30)} ${S.f1(top.y - 30)} C420 330 430 120 430 20Z`;
    return {
      calfW, shinW,
      svg: `<path d="${skin}" fill="${SKIN}" opacity=".25" stroke="#8D5A36" stroke-width="2.5"/>
        ${bone(K.x, K.y, A.x, A.y - 10, 22, BONE)}${bone(K.x - 24, K.y + 20, A.x - 22, A.y - 20, 8, BONE)}
        <path d="M${S.f1(heel.x)} ${S.f1(heel.y)} L${S.f1(A.x)} ${S.f1(A.y)} L${S.f1(top.x)} ${S.f1(top.y)} L${S.f1(toe.x)} ${S.f1(toe.y)}" stroke="${BONE.edge}" stroke-width="16" fill="none" stroke-linejoin="round" stroke-linecap="round"/>
        <path d="M${S.f1(heel.x)} ${S.f1(heel.y)} L${S.f1(A.x)} ${S.f1(A.y)} L${S.f1(top.x)} ${S.f1(top.y)} L${S.f1(toe.x)} ${S.f1(toe.y)}" stroke="${BONE.fill}" stroke-width="12" fill="none" stroke-linejoin="round" stroke-linecap="round"/>
        ${L3.muscle(calfA.x, calfA.y, heel.x, heel.y, calfW, { tendon: 70, cls: 'l3-con-calf' })}
        ${L3.muscle(shinA.x, shinA.y, top.x, top.y, shinW, { tendon: 60, color: '#E53935', cls: 'l3-con-shin' })}`,
    };
  }

  App.chapter({
    id: 'contracting',
    title: 'Contracting and relaxing',
    icon: '🦵',
    group: 'Muscles',
    keywords: [
      { w: 'shorten', d: 'To get shorter.' },
      { w: 'pair', d: 'Two things that go together, like two socks.' },
      { w: 'triceps', d: 'The muscle at the back of the top of your arm. It makes a pair with the biceps.' },
      { w: 'straighten', d: 'To make something straight again.' },
    ],
    steps: [
      // ---------- a) Squeeze a muscle ----------
      {
        text: [
          'Muscles can contract or relax.',
          'When a muscle contracts it becomes shorter and fatter. When a muscle relaxes it goes back to the length and shape it started.',
        ],
        tip: 'Muscles do not get longer. They stay relaxed or they **shorten** by contracting.',
        ask: 'Press and hold the muscle to make it contract. Let go to make it relax.',
        activity: true,
        scene(stage, api) {
          const svg = api.svg(`
            <rect width="800" height="520" fill="#FFF3F0"/>
            <g id="l3-con1-m" class="hot"></g>
            <g id="l3-con1-ruler"></g>
            <g id="l3-con1-word"></g>
            <text x="400" y="80" text-anchor="middle" font-size="22" font-weight="800" fill="#8E1B1B" id="l3-con1-hint" class="blink-hint">👆 Press and hold the muscle</text>`);
          const mG = S.q(svg, '#l3-con1-m'), ruler = S.q(svg, '#l3-con1-ruler'), word = S.q(svg, '#l3-con1-word');
          let k = 0, target = 0, squeezes = 0, asked = false;
          const draw = () => {
            const half = 300 - k * 110, w = 60 + k * 50;
            mG.innerHTML = L3.muscle(400 - half, 250, 400 + half, 250, w, { tendon: 40 });
            ruler.innerHTML = `<path d="M${S.f1(400 - half)} 400 L${S.f1(400 + half)} 400" stroke="#6E665A" stroke-width="4"/>
              <path d="M${S.f1(400 - half)} 385 L${S.f1(400 - half)} 415 M${S.f1(400 + half)} 385 L${S.f1(400 + half)} 415" stroke="#6E665A" stroke-width="4"/>
              ${S.text(400, 440, k > .5 ? 'shorter' : 'length', { size: 20, fill: '#6E665A' })}`;
          };
          draw();
          api.loop(dt => {
            const before = k;
            k += (target - k) * Math.min(1, dt * 8);
            if (Math.abs(k - before) > .0005) draw();
          });
          const down = () => {
            target = 1;
            api.sfx('shrink');
            const h = S.q(svg, '#l3-con1-hint'); if (h) h.remove();
            word.innerHTML = `<g class="pop-in">${L3.pill(400, 490, 'contracts: shorter and fatter', { stroke: '#C62828', color: '#8E1B1B', size: 20 })}</g>`;
          };
          const up = () => {
            if (target !== 1) return;
            target = 0;
            api.sfx('grow');
            word.innerHTML = `<g class="pop-in">${L3.pill(400, 490, 'relaxes: back to how it started', { stroke: '#1E63B8', color: '#1E63B8', size: 20 })}</g>`;
            squeezes++;
            if (squeezes === 2 && !asked) {
              asked = true;
              api.choice({
                q: 'What happens when a muscle contracts?',
                options: ['Shorter and fatter', 'Longer and thinner', 'It stays the same'],
                correct: 0,
                hints: { 1: 'Muscles do not get longer. Try squeezing it again and watch.', 2: 'Look again. Did the muscle change shape?' },
                explain: 'When a muscle contracts it becomes shorter and fatter.',
                onRight: () => api.star(),
              });
            }
          };
          W.pointerDrag(mG, { onStart: down, onEnd: up });
        },
      },

      // ---------- b) Pairs memory game ----------
      {
        text: ['Muscles only move bones when they contract, so we need a **pair** of muscles to move most bones.'],
        tip: 'A pair means two that go together, like a pair of socks or a pair of gloves.',
        ask: 'Find the pairs! Click two cards to turn them over.',
        activity: true,
        scene(stage, api) {
          injectStyle();
          const kinds = [
            { id: 'socks', e: '🧦', name: 'socks' }, { id: 'gloves', e: '🧤', name: 'gloves' },
            { id: 'shoes', e: '👟', name: 'shoes' }, { id: 'arm', e: '💪', name: 'biceps', e2: '💪', name2: 'triceps' },
          ];
          const cards = [];
          kinds.forEach(k => { cards.push({ k: k.id, e: k.e, name: k.name }); cards.push({ k: k.id, e: k.e2 || k.e, name: k.name2 || k.name }); });
          for (let i = cards.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [cards[i], cards[j]] = [cards[j], cards[i]]; }
          const wrap = api.html(`<div class="l3-con-mem"><div class="l3-con-head">🃏 Find the 4 pairs</div>
            <div class="l3-con-grid">${cards.map((c, i) => `<button class="l3-con-card" data-i="${i}"><div class="l3-con-in">
              <div class="l3-con-face l3-con-back">?</div>
              <div class="l3-con-face l3-con-front"><span>${c.e}</span>${c.name}</div></div></button>`).join('')}</div></div>`);
          let open = [], pairs = 0, lock = false;
          wrap.querySelectorAll('.l3-con-card').forEach(b => b.addEventListener('click', () => {
            if (lock || b.classList.contains('up') || b.classList.contains('done')) return;
            const c = cards[+b.dataset.i];
            b.classList.add('up');
            api.sfx('page');
            api.say(c.name);
            open.push(b);
            if (open.length < 2) return;
            lock = true;
            const [a, d] = open.map(x => cards[+x.dataset.i]);
            if (a.k === d.k) {
              api.timeout(() => {
                open.forEach(x => { x.classList.remove('up'); x.classList.add('done'); });
                open = []; lock = false; pairs++;
                api.sfx('success');
                if (a.k === 'arm') api.say('The biceps and the triceps are a pair of muscles!');
                else api.say(`A pair of ${a.name}!`);
                if (pairs === kinds.length) {
                  api.star();
                  api.timeout(() => api.praise('You found all the pairs. The biceps and triceps work as a pair.'), 2000);
                }
              }, 700);
            } else {
              api.timeout(() => {
                open.forEach(x => { x.classList.add('bad'); });
                api.sfx('oops');
              }, 600);
              api.timeout(() => { open.forEach(x => x.classList.remove('up', 'bad')); open = []; lock = false; }, 1400);
            }
          }));
        },
      },

      // ---------- c) Biceps and triceps ----------
      {
        text: [
          'This **triceps** muscle makes a pair with the biceps.',
          'The muscle that is contracting pulls the bone it is attached to.',
        ],
        ask: ['Try doing this movement with your arm. Can you feel the muscles change?', 'Press a button to make a muscle contract.'],
        activity: true,
        scene(stage, api) {
          const SX = 260, SY = 60;
          const svg = api.svg(`<rect width="800" height="520" fill="#EEF7FB"/><g id="l3-con3-arm"></g><g id="l3-con3-tags"></g>`);
          const armG = S.q(svg, '#l3-con3-arm'), tags = S.q(svg, '#l3-con3-tags');
          let bend = 80, busy = false;
          const done = new Set();
          const K = 1.25;
          const P = pt => ({ x: SX + (pt.x - SX) * K, y: SY + (pt.y - SY) * K });
          const draw = (state) => {
            armG.innerHTML = `<g transform="translate(${SX} ${SY}) scale(${K}) translate(${-SX} ${-SY})">${L3.arm({ x: SX, y: SY, bend, triceps: true })}</g>`;
            const g = L3.armGeom(SX, SY, bend);
            const bm = P({ x: (g.bic.a.x + g.bic.b.x) / 2 + 10, y: (g.bic.a.y + g.bic.b.y) / 2 });
            const tm = P({ x: (g.tri.a.x + g.tri.b.x) / 2 - 10, y: (g.tri.a.y + g.tri.b.y) / 2 });
            const bw = state === 'b' ? 'biceps contracts' : state === 't' ? 'biceps relaxes' : 'biceps';
            const tw = state === 't' ? 'triceps contracts' : state === 'b' ? 'triceps relaxes' : 'triceps';
            tags.innerHTML = `<path d="M560 150 L${S.f1(bm.x)} ${S.f1(bm.y)}" stroke="#C62828" stroke-width="3"/>${L3.pill(640, 150, bw, { stroke: '#C62828', color: '#8E1B1B', size: 17 })}
              <path d="M100 330 L${S.f1(tm.x)} ${S.f1(tm.y)}" stroke="#1E63B8" stroke-width="3"/>${L3.pill(120, 360, tw, { stroke: '#1E63B8', color: '#1E63B8', size: 17 })}`;
          };
          draw('');
          const move = async (to, id) => {
            if (busy) return;
            busy = true;
            api.sfx('swoosh');
            const from = bend;
            await api.tween(1100, k => { bend = from + (to - from) * k; draw(id); }, W.ease.inOut);
            if (!api.alive()) return;
            busy = false;
            done.add(id);
            api.say(id === 'b' ? 'The biceps contracts and pulls the lower arm up. The triceps relaxes.' : 'The triceps contracts and pulls the arm straight. The biceps relaxes.');
            if (done.size === 2) { api.star(); api.timeout(() => api.praise('The biceps and triceps work as a pair.'), 4200); }
          };
          api.button('💪 Biceps contracts', () => move(145, 'b'), { cls: 'primary', sound: null });
          api.button('👋 Triceps contracts', () => move(0, 't'), { cls: 'primary', sound: null });
        },
      },

      // ---------- d) Muscles in the leg ----------
      {
        text: ['There are pairs of muscles in your legs too.'],
        ask: ['Bend and **straighten** your foot.', 'Can you feel the muscles in your lower leg changing?'],
        activity: true,
        scene(stage, api) {
          const svg = api.svg(`<rect width="800" height="520" fill="#FFF8EC"/>
            <g id="l3-con4-leg"></g><g id="l3-con4-tags"></g>`);
          const legG = S.q(svg, '#l3-con4-leg'), tags = S.q(svg, '#l3-con4-tags');
          const reached = new Set();
          let ready = false;
          api.slider({
            label: '🦶 Foot', min: -25, max: 35, step: 1, value: 0,
            format: v => v < -15 ? 'toes up' : v > 25 ? 'toes pointed' : 'resting',
            onInput: v => {
              const L = lowerLeg(v);
              legG.innerHTML = L.svg;
              const calf = v > 5 ? 'contracts' : 'relaxes', shin = v < -5 ? 'contracts' : 'relaxes';
              tags.innerHTML = `<path d="M190 200 L330 200" stroke="#C62828" stroke-width="3"/>${L3.pill(130, 200, `back: ${calf}`, { stroke: '#C62828', color: '#8E1B1B', size: 17 })}
                <path d="M600 220 L420 220" stroke="#E53935" stroke-width="3"/>${L3.pill(660, 220, `front: ${shin}`, { stroke: '#E53935', color: '#8E1B1B', size: 17 })}`;
              if (!ready) return;
              const zone = v < -15 ? 'up' : v > 25 ? 'down' : null;
              if (zone && !reached.has(zone)) {
                reached.add(zone);
                api.sfx('pop');
                api.say(zone === 'down' ? 'Point your toes. The muscle at the back of your leg contracts.' : 'Pull your toes up. The muscle at the front contracts.');
                if (reached.size === 2) { api.star(); api.timeout(() => api.praise('The two leg muscles work as a pair to bend and straighten your foot.'), 3200); }
              }
            },
          });
          ready = true;
        },
      },
    ],
  });
})();
