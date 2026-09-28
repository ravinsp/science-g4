// Chapter 7: Muscles
(() => {
  const { BONE } = L3;

  // Arm drawn around its elbow: elbow at (ex,ey), scaled by k
  const armAt = (ex, ey, k, o) => `<g transform="translate(${ex} ${ey}) scale(${k})">${L3.arm(Object.assign({ x: 0, y: -150 }, o))}</g>`;

  App.chapter({
    id: 'muscles',
    title: 'Muscles',
    icon: '🥩',
    group: 'Muscles',
    keywords: [
      { w: 'muscle', d: 'A soft, stretchy part of the body that pulls on bones to make them move.' },
      { w: 'blood', d: 'The red liquid that the heart pumps all round your body.' },
      { w: 'attached', d: 'Joined on to something.' },
      { w: 'biceps', d: 'The big muscle at the front of the top of your arm.' },
      { w: 'bend', d: 'To change from straight to curved.' },
      { w: 'contracts', d: 'Gets shorter and fatter. A muscle contracts to pull a bone.' },
      { w: 'relaxes', d: 'Goes back to its first length and shape.' },
    ],
    steps: [
      // ---------- a) Muscles are red ----------
      {
        text: [
          '**Muscle**s make our skeleton move.',
          'Muscles are red because lots of **blood** goes to them.',
          'Some animals and humans eat meat. Meat is the muscle of an animal.',
        ],
        ask: 'Pump blood to the muscle. Then click the muscle to look closer.',
        activity: true,
        scene(stage, api) {
          const svg = api.svg(`
            <rect width="800" height="520" fill="#FFF3F0"/>
            <path id="l3-mus1-pipe" d="M40 470 C160 470 150 330 250 300" stroke="#EF9A9A" stroke-width="22" fill="none" stroke-linecap="round"/>
            <g id="l3-mus1-drops"></g>
            <g transform="translate(40 470)">${L3.heart({ s: 1.3 })}</g>
            <g id="l3-mus1-m" class="hot">${L3.muscle(220, 330, 560, 140, 70, { tendon: 30, color: '#F4B4B4', cls: 'l3-mus1-muscle' })}</g>
            ${L3.pill(640, 330, 'muscle', {})}<path d="M590 330 L470 250" stroke="#7E57C2" stroke-width="3"/>
            <g id="l3-mus1-zoom" opacity="0" pointer-events="none">
              <clipPath id="l3-mus1-clip"><circle cx="590" cy="130" r="110"/></clipPath>
              <circle cx="590" cy="130" r="110" fill="#C62828"/>
              <g clip-path="url(#l3-mus1-clip)">${[...Array(16)].map((_, i) => `<path d="M${440 + i * 16} 20 Q${470 + i * 16} 130 ${440 + i * 16} 250" stroke="${i % 2 ? '#8E1B1B' : '#EF5350'}" stroke-width="7" fill="none"/>`).join('')}</g>
              <circle cx="590" cy="130" r="110" fill="none" stroke="#455A64" stroke-width="12"/>
              <path d="M668 208 L720 260" stroke="#6D4C41" stroke-width="22" stroke-linecap="round"/>
              ${L3.pill(590, 270, 'stripes!', { size: 17 })}
            </g>`);
          const mG = S.q(svg, '#l3-mus1-m'), drops = S.q(svg, '#l3-mus1-drops'), pipe = S.q(svg, '#l3-mus1-pipe');
          let red = 0, pumped = false, zoomed = false, busy = false;
          const paint = () => {
            mG.innerHTML = L3.muscle(220, 330, 560, 140, 70, { tendon: 30, color: S.mix('#F4B4B4', '#D32F2F', red) });
            pipe.setAttribute('stroke', S.mix('#EF9A9A', '#C62828', red));
          };
          const check = () => {
            if (pumped && zoomed) {
              api.star();
              api.timeout(() => api.praise('Muscles are red because lots of blood goes to them. They have stripes too.'), 2200);
            }
          };
          const len = pipe.getTotalLength();
          api.button('❤️ Pump blood', async () => {
            if (busy) return;
            busy = true;
            api.sfx('knock');
            const cells = [...Array(12)].map(() => S.el('circle', { r: 7, fill: '#B71C1C' }, drops));
            await api.tween(2200, k => {
              cells.forEach((c, i) => {
                const kk = S.clamp(k * 1.6 - i * .05);
                const p = pipe.getPointAtLength(kk * len);
                c.setAttribute('cx', S.f1(p.x)); c.setAttribute('cy', S.f1(p.y));
                c.setAttribute('opacity', kk >= 1 ? 0 : 1);
              });
              red = Math.max(red, k);
              paint();
            }, W.ease.linear);
            if (!api.alive()) return;
            drops.innerHTML = '';
            busy = false;
            api.say('The blood makes the muscle red.');
            if (!pumped) { pumped = true; check(); }
          }, { cls: 'primary pulse', sound: null });
          mG.addEventListener('click', () => {
            api.sfx('pop');
            S.q(svg, '#l3-mus1-zoom').setAttribute('opacity', 1);
            api.say('Look closely. The muscle is made of lots of long stripes.');
            if (!zoomed) { zoomed = true; check(); }
          });
        },
      },

      // ---------- b) Muscles pull bones ----------
      {
        text: [
          'Bones cannot move. They need muscles to pull them in different directions.',
          'This is an elbow joint. The muscle is **attached** to the bone.',
          'The muscles that move our skeleton have stripes on them.',
        ],
        ask: 'Drag the labels to the right places. Then press Pull.',
        activity: true,
        scene(stage, api) {
          const EX = 300, EY = 350, K = 1.75;
          const svg = api.svg(`<rect width="800" height="520" fill="#FFF8EC"/><g id="l3-mus2-arm"></g><g id="l3-mus2-dot"></g>`);
          const armG = S.q(svg, '#l3-mus2-arm'), dot = S.q(svg, '#l3-mus2-dot');
          const draw = bend => {
            armG.innerHTML = armAt(EX, EY, K, { bend, skin: false, scapula: false });
            const g = L3.armGeom(0, -150, bend);
            dot.innerHTML = `<circle cx="${S.f1(EX + g.bic.b.x * K)}" cy="${S.f1(EY + g.bic.b.y * K)}" r="9" fill="#E53935" stroke="#fff" stroke-width="2"/>`;
          };
          draw(90);
          const g = L3.armGeom(0, -150, 90);
          const P = (x, y) => ({ x: EX + x * K, y: EY + y * K });
          const mid = P((g.bic.a.x + g.bic.b.x) / 2, (g.bic.a.y + g.bic.b.y) / 2);
          const top = P(g.bic.a.x * .7 + g.bic.b.x * .3, g.bic.a.y * .7 + g.bic.b.y * .3);
          let labelled = false, busy = false;
          api.dragLabels(svg, [
            { id: 'bone', label: 'bone', x: EX, y: EY - 170, lx: 150, ly: 110 },
            { id: 'muscle', label: 'muscle', x: mid.x + 14, y: mid.y, lx: 560, ly: 170 },
            { id: 'stripes', label: 'stripes', x: top.x + 10, y: top.y, lx: 540, ly: 60 },
            { id: 'attached', label: 'attached', x: P(g.bic.b.x, g.bic.b.y).x, y: P(g.bic.b.x, g.bic.b.y).y, lx: 640, ly: 290 },
            { id: 'joint', label: 'elbow joint', x: EX, y: EY, lx: 150, ly: 440 },
          ], {
            onDone: () => {
              labelled = true;
              api.star();
              api.sayAfter('Now press Pull to see the muscle pull the bone.');
              pull.classList.add('pulse');
            },
          });
          const pull = api.button('💪 Pull', async () => {
            if (busy) return;
            if (!labelled) { api.info('Put all the labels on first.'); return; }
            busy = true;
            api.sfx('swoosh');
            S.qa(svg, '.label-layer .callout').forEach(c => c.setAttribute('opacity', .25));
            await api.tween(900, k => draw(90 + k * 45), W.ease.inOut);
            if (!api.alive()) return;
            api.say('The muscle got shorter and pulled the bone. The arm bends at the joint.');
            await api.wait(900);
            await api.tween(900, k => draw(135 - k * 45), W.ease.inOut);
            if (!api.alive()) return;
            S.qa(svg, '.label-layer .callout').forEach(c => c.setAttribute('opacity', 1));
            busy = false;
          }, { cls: 'primary', sound: null });
        },
      },

      // ---------- c) The biceps ----------
      {
        text: [
          'Look at one of the muscles in this arm. It is called the **biceps** muscle.',
          'Each end of this muscle is attached to a different bone.',
        ],
        ask: ['Can you feel this muscle in your arm? Lift your arm and feel how your biceps changes.', 'Click both ends of the biceps to find where it is attached.'],
        activity: true,
        scene(stage, api) {
          const SX = 250, SY = 110;
          const svg = api.svg(`<rect width="800" height="520" fill="#EEF7FB"/><g id="l3-mus3-arm"></g><g id="l3-mus3-rings"></g><g id="l3-mus3-tags"></g>`);
          const armG = S.q(svg, '#l3-mus3-arm'), rings = S.q(svg, '#l3-mus3-rings'), tags = S.q(svg, '#l3-mus3-tags');
          let bend = 40;
          const K = 1.35;
          const draw = () => { armG.innerHTML = `<g transform="translate(${SX} ${SY}) scale(${K}) translate(${-SX} ${-SY})">${L3.arm({ x: SX, y: SY, bend })}</g>`; };
          draw();
          const P = pt => ({ x: SX + (pt.x - SX) * K, y: SY + (pt.y - SY) * K });
          const g0 = L3.armGeom(SX, SY, bend);
          const ends = [
            { id: 'top', at: P(g0.bic.a), say: 'This end is attached near the shoulder.', tag: 'attached near the shoulder', tx: 560, ty: 60 },
            { id: 'low', at: P(g0.bic.b), say: 'This end is attached to a bone in the lower arm.', tag: 'attached to the lower arm', tx: 560, ty: 450 },
          ];
          rings.innerHTML = ends.map(e => `<circle class="target-ring hot" data-e="${e.id}" cx="${S.f1(e.at.x)}" cy="${S.f1(e.at.y)}" r="18"/>`).join('');
          tags.innerHTML = `${L3.pill(560, 250, 'biceps muscle', { stroke: '#C62828', color: '#8E1B1B' })}
            <path d="M494 250 L${S.f1(P({ x: (g0.bic.a.x + g0.bic.b.x) / 2, y: 0 }).x + 16)} ${S.f1(P({ x: 0, y: (g0.bic.a.y + g0.bic.b.y) / 2 }).y)}" stroke="#C62828" stroke-width="3"/>`;
          const found = new Set();
          rings.addEventListener('click', e => {
            const r = e.target.closest('[data-e]');
            if (!r || found.has(r.dataset.e)) return;
            const end = ends.find(q => q.id === r.dataset.e);
            found.add(end.id);
            r.remove();
            api.sfx('pop');
            tags.insertAdjacentHTML('beforeend', `<g class="pop-in"><circle cx="${S.f1(end.at.x)}" cy="${S.f1(end.at.y)}" r="9" fill="#E53935" stroke="#fff" stroke-width="2"/>
              ${L3.pill(end.tx, end.ty, end.tag, { size: 16 })}<path d="M${end.tx - 90} ${end.ty + (end.id === 'top' ? 18 : -18)} L${S.f1(end.at.x)} ${S.f1(end.at.y)}" stroke="#7E57C2" stroke-width="2.5"/></g>`);
            api.say(end.say);
            if (found.size === 2) {
              api.star();
              api.timeout(() => api.praise('Each end of the biceps is attached to a different bone. Now lift your arm!'), 2600);
              lift.disabled = false;
              lift.classList.add('pulse');
            }
          });
          let busy = false;
          const lift = api.button('💪 Lift the arm', async () => {
            if (busy) return;
            busy = true;
            tags.setAttribute('opacity', 0); rings.setAttribute('opacity', 0);
            api.sfx('swoosh');
            await api.tween(900, k => { bend = 40 + k * 100; draw(); }, W.ease.inOut);
            if (!api.alive()) return;
            api.say('Feel your biceps. It gets shorter and fatter when you lift your arm.');
            await api.wait(1400);
            await api.tween(900, k => { bend = 140 - k * 100; draw(); }, W.ease.inOut);
            if (!api.alive()) return;
            tags.setAttribute('opacity', 1); rings.setAttribute('opacity', 1);
            busy = false;
          }, { cls: 'primary', sound: null });
          lift.disabled = true;
        },
      },

      // ---------- d) Contracts and relaxes ----------
      {
        text: [
          'To **bend** the arm, the biceps muscle **contracts**. Now it is shorter and fatter.',
          'To make the arm straight, the biceps goes back to how it started. It **relaxes**.',
        ],
        ask: 'Press Bend, then Straighten. Watch the biceps change.',
        activity: true,
        scene(stage, api) {
          const SX = 220, SY = 70;
          const svg = api.svg(`
            <rect width="800" height="520" fill="#FFF8EC"/>
            <g id="l3-mus4-arm"></g>
            <rect x="470" y="30" width="310" height="460" rx="24" fill="#fff" stroke="#EADFCB" stroke-width="3"/>
            ${S.text(625, 72, 'The biceps', { size: 24, fill: '#8E1B1B' })}
            <g id="l3-mus4-solo"></g>
            <g id="l3-mus4-word"></g>`);
          const armG = S.q(svg, '#l3-mus4-arm'), solo = S.q(svg, '#l3-mus4-solo'), word = S.q(svg, '#l3-mus4-word');
          let bend = 0, busy = false;
          const done = new Set();
          const draw = () => {
            armG.innerHTML = `<g transform="translate(${SX} ${SY}) scale(1.2) translate(${-SX} ${-SY})">${L3.arm({ x: SX, y: SY, bend })}</g>`;
            const g = L3.armGeom(SX, SY, bend);
            const L = Math.hypot(g.bic.b.x - g.bic.a.x, g.bic.b.y - g.bic.a.y);
            const w = L3.fat(g.bic, 150, 13) * 2.2;
            const len = L * 1.7;
            solo.innerHTML = `${L3.muscle(625, 260 - len / 2, 625, 260 + len / 2, w, { tendon: 22 })}
              <path d="M520 ${S.f1(260 - len / 2)} L520 ${S.f1(260 + len / 2)}" stroke="#6E665A" stroke-width="3"/>
              <path d="M510 ${S.f1(260 - len / 2)} L530 ${S.f1(260 - len / 2)} M510 ${S.f1(260 + len / 2)} L530 ${S.f1(260 + len / 2)}" stroke="#6E665A" stroke-width="3"/>`;
          };
          draw();
          const show = (txt, sub, col) => {
            word.innerHTML = `<g class="pop-in">${L3.pill(625, 440, txt, { stroke: col, color: col, size: 22 })}</g>${S.text(625, 478, sub, { size: 17, fill: '#6E665A' })}`;
          };
          const move = async (to, id) => {
            if (busy) return;
            if (Math.abs(bend - to) < 1) { api.info(id === 'bend' ? 'The arm is already bent. Press Straighten.' : 'The arm is already straight. Press Bend.'); return; }
            busy = true;
            api.sfx('swoosh');
            const from = bend;
            await api.tween(1200, k => { bend = from + (to - from) * k; draw(); }, W.ease.inOut);
            if (!api.alive()) return;
            busy = false;
            if (id === 'bend') { show('contracts', 'shorter and fatter', '#C62828'); api.say('The biceps contracts. It is shorter and fatter. It pulls the lower arm up.'); }
            else { show('relaxes', 'back to how it started', '#1E63B8'); api.say('The biceps relaxes. It goes back to how it started.'); }
            done.add(id);
            if (done.size === 2) { api.star(); api.timeout(() => api.praise(), 3200); }
          };
          api.button('💪 Bend', () => move(145, 'bend'), { cls: 'primary', sound: null });
          api.button('👋 Straighten', () => move(0, 'straight'), { cls: 'primary', sound: null });
        },
      },
    ],
  });
})();
