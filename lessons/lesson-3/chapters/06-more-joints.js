// Chapter 6: More types of joint
(() => {
  const { XRAY, bone } = L3;

  // Hip bones and the tops of the legs in X-ray colours (local frame of L3.skeleton).
  // swing turns the right-hand leg out to the side.
  function hips(swing = 0) {
    const c = XRAY;
    let spine = '';
    for (let i = 0; i < 6; i++) spine += `<rect x="-8" y="${170 + i * 10}" width="16" height="8" rx="3" fill="${c.fill}" stroke="${c.edge}" stroke-width="1"/>`;
    return `${spine}
      <path d="M0 228 C-20 214 -46 214 -48 232 C-48 250 -34 262 -18 266 L-8 254 C-4 262 4 262 8 254 L18 266 C34 262 48 250 48 232 C46 214 20 214 0 228Z" fill="${c.fill}" stroke="${c.edge}" stroke-width="1.2"/>
      <ellipse cx="-17" cy="248" rx="6" ry="5" fill="#0E2A47"/><ellipse cx="17" cy="248" rx="6" ry="5" fill="#0E2A47"/>
      <path d="M-6 232 L6 232 L4 246 L-4 246Z" fill="#0E2A47" opacity=".5"/>
      ${bone(-30, 254, -25, 340, 11, c)}
      <g transform="rotate(${S.f1(-swing)} 30 254)">${bone(30, 254, 25, 340, 11, c)}</g>
      <circle cx="-30" cy="253" r="7.5" fill="${c.fill}" stroke="${c.edge}" stroke-width="1"/>
      <circle cx="30" cy="253" r="7.5" fill="${c.fill}" stroke="${c.edge}" stroke-width="1"/>`;
  }

  // A child's head seen from the front. dx, dy move the face; tilt turns the whole head.
  function head(dx, dy, tilt, turn) {
    const sk = L3.SKIN, dk = '#8D5A36';
    const earL = 1 - Math.max(0, turn) * .9, earR = 1 - Math.max(0, -turn) * .9;
    return `<g transform="rotate(${S.f1(tilt)} 400 300)">
      <path d="M340 330 L330 470 L470 470 L460 330Z" fill="#26A69A"/>
      <path d="M372 330 L400 380 L428 330Z" fill="${sk}"/>
      <rect x="372" y="300" width="56" height="50" fill="${sk}"/>
      <g transform="translate(${S.f1(dx * .3)} ${S.f1(dy * .4)})">
        ${[...Array(9)].map((_, i) => `<circle cx="${S.f1(400 + Math.cos(i * .7 - 3.5) * 120)}" cy="${S.f1(215 + Math.sin(i * .7 - 3.5) * 110)}" r="40" fill="#2B1B10"/>`).join('')}
        <ellipse cx="${S.f1(290 + turn * 30)}" cy="220" rx="${S.f1(16 * earL)}" ry="24" fill="${sk}" stroke="${dk}" stroke-width="2"/>
        <ellipse cx="${S.f1(510 + turn * 30)}" cy="220" rx="${S.f1(16 * earR)}" ry="24" fill="${sk}" stroke="${dk}" stroke-width="2"/>
        <ellipse cx="400" cy="215" rx="${S.f1(110 - Math.abs(turn) * 12)}" ry="118" fill="${sk}" stroke="${dk}" stroke-width="2"/>
        <path d="M290 180 C300 90 500 90 510 180 C470 140 330 140 290 180Z" fill="#2B1B10"/>
        <g transform="translate(${S.f1(dx)} ${S.f1(dy)})">
          <circle cx="360" cy="210" r="20" fill="#fff" stroke="#333" stroke-width="2"/><circle cx="440" cy="210" r="20" fill="#fff" stroke="#333" stroke-width="2"/>
          <circle cx="${S.f1(360 + dx * .25)}" cy="${S.f1(212 + dy * .25)}" r="9" fill="#222"/><circle cx="${S.f1(440 + dx * .25)}" cy="${S.f1(212 + dy * .25)}" r="9" fill="#222"/>
          <path d="M400 230 q-8 18 2 22" stroke="${dk}" stroke-width="3" fill="none" stroke-linecap="round"/>
          <path d="M370 270 Q400 292 430 270" stroke="#6B2E14" stroke-width="4" fill="none" stroke-linecap="round"/>
        </g>
      </g></g>`;
  }

  App.chapter({
    id: 'more-joints',
    title: 'More types of joint',
    icon: '🔄',
    group: 'Joints',
    keywords: [
      { w: 'circle', d: 'A round shape, like a hoop.' },
      { w: 'neck', d: 'The part of your body that joins your head to your shoulders.' },
      { w: 'fixed', d: 'Joined tightly so that it cannot move.' },
    ],
    steps: [
      // ---------- a) Shoulder circles ----------
      {
        text: [
          'Your shoulder joint gives your arm a bigger **range of movement** than the elbow joint does.',
          'There are two bones at the shoulder joint.',
        ],
        ask: ['Can you draw a big **circle** in the air using your whole arm? Drag the hand round in a circle.', 'Find out other ways in which your shoulder joint moves.'],
        activity: true,
        scene(stage, api) {
          const X = 290, Y = 150, K = .8;
          const SX = X + 48 * K, SY = Y + 88 * K;
          const svg = api.svg(`
            <rect width="800" height="520" fill="#EAF4FB"/>
            <path id="l3-mj1-trail" fill="none" stroke="#7E57C2" stroke-width="5" stroke-linecap="round" stroke-dasharray="2 10"/>
            <g id="l3-mj1-kid"></g>
            <circle id="l3-mj1-grab" r="30" fill="#FFE56B" opacity=".5" class="target-ring"/>
            <clipPath id="l3-mj1-clip"><circle cx="650" cy="150" r="118"/></clipPath>
            <circle cx="650" cy="150" r="118" fill="#0E2A47"/>
            <g clip-path="url(#l3-mj1-clip)">
              <path d="M600 60 C640 40 700 50 720 80 L730 240 C700 250 680 230 660 200 C650 170 640 120 620 110 Z" fill="${XRAY.fill}" stroke="${XRAY.edge}" stroke-width="3"/>
              <path d="M560 70 L680 58" stroke="${XRAY.fill}" stroke-width="18" stroke-linecap="round"/>
              <g id="l3-mj1-hum">${bone(630, 125, 630, 330, 40, XRAY)}<circle cx="630" cy="122" r="30" fill="${XRAY.fill}" stroke="${XRAY.edge}" stroke-width="3"/></g>
            </g>
            <circle cx="650" cy="150" r="118" fill="none" stroke="#2BA3B8" stroke-width="8"/>
            ${L3.pill(650, 300, 'two bones meet here', { size: 16 })}
            <g transform="translate(20 20)"><rect width="190" height="44" rx="22" fill="#fff" opacity=".92"/>
              ${S.text(95, 29, '⭕ Circle: 0%', { size: 19 }).replace('>⭕ Circle: 0%<', ' id="l3-mj1-pct">⭕ Circle: 0%<')}</g>`);
          const kid = S.q(svg, '#l3-mj1-kid'), grab = S.q(svg, '#l3-mj1-grab'), trail = S.q(svg, '#l3-mj1-trail'), hum = S.q(svg, '#l3-mj1-hum');
          const L = 172 * K;
          let a = 0;
          const seen = new Set(), pts = [];
          let starred = false;
          const draw = () => {
            kid.innerHTML = L3.person({ x: X, y: Y, s: K, shirt: '#FFB300', arms: { r: [a, 0] } });
            const r = a * Math.PI / 180;
            grab.setAttribute('cx', S.f1(SX + Math.sin(r) * L)); grab.setAttribute('cy', S.f1(SY + Math.cos(r) * L));
            hum.setAttribute('transform', `rotate(${S.f1(-a * .5)} 630 122)`);
          };
          draw();
          let dragging = false;
          W.pointerDrag(svg, {
            onStart: e => {
              const p = api.point(svg, e);
              const r = a * Math.PI / 180;
              dragging = Math.hypot(p.x - (SX + Math.sin(r) * L), p.y - (SY + Math.cos(r) * L)) < 70;
              if (dragging) { api.sfx('pick'); grab.classList.remove('target-ring'); }
            },
            onMove: e => {
              if (!dragging) return;
              const p = api.point(svg, e);
              a = (Math.atan2(p.x - SX, p.y - SY) * 180 / Math.PI + 360) % 360;
              draw();
              const r = a * Math.PI / 180;
              pts.push(`${S.f1(SX + Math.sin(r) * L)} ${S.f1(SY + Math.cos(r) * L)}`);
              if (pts.length > 160) pts.shift();
              trail.setAttribute('d', 'M' + pts.join(' L'));
              const b = Math.floor(a / 15);
              if (!seen.has(b)) {
                seen.add(b);
                if (seen.size % 4 === 0) api.sfx('tick');
                S.q(svg, '#l3-mj1-pct').textContent = `⭕ Circle: ${Math.round(seen.size / 24 * 100)}%`;
                if (seen.size === 24 && !starred) {
                  starred = true;
                  api.star();
                  api.praise('A full circle! The shoulder can move the arm up, down, forwards, backwards and round.');
                }
              }
            },
            onEnd: () => { if (dragging) api.sfx('drop'); dragging = false; },
          });
        },
      },

      // ---------- b) Hip joints ----------
      {
        text: ['The drawing shows two hip joints. Two bones meet at each hip joint.'],
        ask: 'Now try the same with your leg. Click the two hip joints, then swing the leg.',
        activity: true,
        scene(stage, api) {
          const K = 3.1, TY = -500;
          const P = (x, y) => ({ x: 400 + x * K, y: TY + y * K });
          const svg = api.svg(`
            <rect width="800" height="520" fill="#FFF8EC"/>
            <clipPath id="l3-mj2-clip"><rect x="90" y="20" width="620" height="480" rx="30"/></clipPath>
            <rect x="90" y="20" width="620" height="480" rx="30" fill="#0E2A47"/>
            <g clip-path="url(#l3-mj2-clip)"><g id="l3-mj2-hips" transform="translate(400 ${TY}) scale(${K})"></g></g>
            <g id="l3-mj2-rings"></g>
            <g id="l3-mj2-tags"></g>`);
          const hipsG = S.q(svg, '#l3-mj2-hips'), rings = S.q(svg, '#l3-mj2-rings'), tags = S.q(svg, '#l3-mj2-tags');
          hipsG.innerHTML = hips(0);
          const joints = [P(-30, 253), P(30, 253)];
          rings.innerHTML = joints.map((j, i) => `<circle class="target-ring hot" data-h="${i}" cx="${S.f1(j.x)}" cy="${S.f1(j.y)}" r="30"/>`).join('');
          const found = new Set();
          let busy = false;
          rings.addEventListener('click', e => {
            const r = e.target.closest('[data-h]');
            if (!r || found.has(r.dataset.h)) return;
            found.add(r.dataset.h);
            r.remove();
            api.sfx('pop');
            const j = joints[+r.dataset.h];
            tags.insertAdjacentHTML('beforeend', `<g class="pop-in"><circle cx="${S.f1(j.x)}" cy="${S.f1(j.y)}" r="26" fill="none" stroke="#FFB300" stroke-width="5"/>
              ${L3.pill(j.x < 400 ? 200 : 600, 90, 'hip joint', { stroke: '#FFB300', color: '#7A5A00' })}
              <path d="M${j.x < 400 ? 200 : 600} 108 L${S.f1(j.x)} ${S.f1(j.y - 26)}" stroke="#FFB300" stroke-width="3"/></g>`);
            if (found.size === 1) api.say('Yes! The top of the leg bone fits into the hip bone here.');
            else {
              api.say('Two hip joints. Two bones meet at each one. Now swing the leg!');
              swingBtn.disabled = false;
              swingBtn.classList.add('pulse');
            }
          });
          const swingBtn = api.button('🦵 Swing the leg', async () => {
            if (busy) return;
            busy = true;
            api.sfx('swoosh');
            await api.tween(2400, (k, raw) => { hipsG.innerHTML = hips(Math.sin(raw * Math.PI * 2) * 40); }, W.ease.linear);
            if (!api.alive()) return;
            hipsG.innerHTML = hips(0);
            busy = false;
            api.star();
            api.praise('The hip joint lets the leg move in many directions, just like the shoulder.');
          }, { cls: 'primary', sound: null });
          swingBtn.disabled = true;
        },
      },

      // ---------- c) Neck ----------
      {
        text: ['Your **neck** joint allows your head to move in many directions.'],
        ask: 'Press the buttons to move the head. Try it with your own head too!',
        activity: true,
        scene(stage, api) {
          const svg = api.svg(`<rect width="800" height="520" fill="#FFF3E0"/><g id="l3-mj3-head"></g><g id="l3-mj3-arrow"></g>`);
          const hg = S.q(svg, '#l3-mj3-head'), arrowG = S.q(svg, '#l3-mj3-arrow');
          let st = { dx: 0, dy: 0, tilt: 0, turn: 0 }, busy = false;
          const draw = () => { hg.innerHTML = head(st.dx, st.dy, st.tilt, st.turn); };
          draw();
          const moves = {
            up: { to: { dx: 0, dy: -30, tilt: 0, turn: 0 }, say: 'Look up!', arrow: S.arrow(620, 330, 620, 120, { color: '#E53935', w: 8, head: 22 }) },
            down: { to: { dx: 0, dy: 34, tilt: 0, turn: 0 }, say: 'Look down!', arrow: S.arrow(620, 120, 620, 330, { color: '#E53935', w: 8, head: 22 }) },
            tilt: { to: { dx: 0, dy: 0, tilt: 24, turn: 0 }, say: 'Tilt your head to the side.', arrow: `<path d="M560 110 A170 170 0 0 1 610 230" stroke="#E53935" stroke-width="8" fill="none"/>${S.arrow(600, 205, 612, 238, { color: '#E53935', w: 8, head: 22 })}` },
            turn: { to: { dx: 46, dy: 0, tilt: 0, turn: 1 }, say: 'Turn your head to look to the side.', arrow: `<ellipse cx="400" cy="70" rx="120" ry="22" stroke="#E53935" stroke-width="7" fill="none"/>${S.arrow(470, 88, 500, 86, { color: '#E53935', w: 7, head: 20 })}` },
          };
          const done = new Set();
          const go = async id => {
            if (busy) return;
            busy = true;
            const m = moves[id], from = { ...st };
            arrowG.innerHTML = `<g class="fade-in">${m.arrow}</g>`;
            api.sfx('swoosh');
            api.say(m.say);
            const lerp = (k, to) => { Object.keys(to).forEach(key => { st[key] = from[key] + (to[key] - from[key]) * k; }); draw(); };
            if (!(await api.tween(700, k => lerp(k, m.to), W.ease.out))) return;
            await api.wait(700);
            const back = { ...st };
            if (!(await api.tween(600, k => { Object.keys(back).forEach(key => { st[key] = back[key] * (1 - k); }); draw(); }, W.ease.inOut))) return;
            arrowG.innerHTML = '';
            busy = false;
            done.add(id);
            if (done.size === 4) {
              api.star();
              api.praise('The neck joint lets your head move up, down, to the side and round.');
            }
          };
          api.row();
          api.button('⬆️ Up', () => go('up'), { sound: null });
          api.button('⬇️ Down', () => go('down'), { sound: null });
          api.button('↩️ Tilt', () => go('tilt'), { sound: null });
          api.button('🔄 Turn', () => go('turn'), { sound: null });
        },
      },

      // ---------- d) Fixed joints ----------
      {
        text: [
          'Some joints do not move. They are **fixed** joints.',
          'This is the top of a human head. The skull is made of three bones.',
          'When a baby is born, the skull bones are not joined. As the baby grows, the skull bones join together forever and then do not move.',
        ],
        ask: 'Slide to make the baby grow. Watch the skull bones.',
        activity: true,
        scene(stage, api) {
          const lines = [[120, 250, 400, 196], [400, 196, 690, 236], [400, 196, 410, 505]];
          const seams = lines.map((l, i) => L3.squiggle(...l, 17, 15, [3, 5, 8][i]));
          const svg = api.svg(`
            <defs><radialGradient id="l3-mj4-bone" cx=".5" cy=".35" r=".75">
              <stop offset="0" stop-color="#F6DDA8"/><stop offset=".6" stop-color="#E0AE63"/><stop offset="1" stop-color="#A8692A"/>
            </radialGradient>
            <clipPath id="l3-mj4-clip"><ellipse cx="400" cy="300" rx="330" ry="270"/></clipPath></defs>
            <rect width="800" height="520" fill="#3A2412"/>
            <ellipse cx="400" cy="300" rx="330" ry="270" fill="url(#l3-mj4-bone)"/>
            <g clip-path="url(#l3-mj4-clip)">
              <g id="l3-mj4-gaps"></g>
              <g id="l3-mj4-seams">${seams.map(d => `<path d="${d}" stroke="#6B3E14" stroke-width="5" fill="none" stroke-linejoin="round"/>`).join('')}</g>
            </g>
            ${[[400, 110, '1'], [230, 360, '2'], [580, 360, '3']].map(([x, y, n]) => `<g><rect x="${x - 24}" y="${y - 26}" width="48" height="52" fill="#fff" stroke="#333" stroke-width="2"/>${S.text(x, y + 11, n, { size: 30 })}</g>`).join('')}
            <g transform="translate(680 470)"><rect x="-110" y="-32" width="220" height="56" rx="28" fill="#fff"/>
              <text id="l3-mj4-age" x="0" y="6" text-anchor="middle" font-size="22" font-weight="800">👶 new baby</text></g>`);
          const gaps = S.q(svg, '#l3-mj4-gaps'), seamG = S.q(svg, '#l3-mj4-seams'), age = S.q(svg, '#l3-mj4-age');
          let ready = false, starred = false;
          api.slider({
            label: '🍼 Grow', min: 0, max: 1, step: .02, value: 0,
            format: v => v < .34 ? 'baby' : v < .8 ? 'child' : 'grown-up',
            onInput: v => {
              const g = Math.max(0, 34 * (1 - v / .8));
              gaps.innerHTML = g > 0 ? lines.map(l => `<path d="M${l[0]} ${l[1]} L${l[2]} ${l[3]}" stroke="#E8B4A0" stroke-width="${S.f1(g)}" stroke-linecap="round"/>`).join('')
                + `<path d="M400 ${S.f1(196 - g * 2)} L${S.f1(400 + g * 1.6)} 196 L400 ${S.f1(196 + g * 2)} L${S.f1(400 - g * 1.6)} 196Z" fill="#E8B4A0"/>` : '';
              seamG.setAttribute('opacity', S.f1(S.clamp(1 - g / 10)));
              age.textContent = v < .34 ? '👶 new baby' : v < .8 ? '🧒 child' : '🧑 grown-up';
              if (ready && v >= .98 && !starred) {
                starred = true;
                api.sfx('success');
                api.star();
                api.say('Now the skull bones have joined together forever. They cannot move. This is a fixed joint.');
              }
            },
          });
          ready = true;
        },
      },
    ],
  });
})();
