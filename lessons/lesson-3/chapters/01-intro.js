// Chapter 1: Skeleton and muscles (introduction)
(() => {
  const { rot, squiggle } = L3;

  App.chapter({
    id: 'intro',
    title: 'Skeleton and muscles',
    icon: '🦴',
    group: 'Getting started',
    steps: [
      // ---------- a) X-ray scanner ----------
      {
        text: ['Humans have a skeleton to support their bodies. What else is a skeleton needed for? Let\'s find out.'],
        ask: 'Drag the X-ray scanner over the body to see the bones inside.',
        activity: true,
        scene(stage, api) {
          const X = 400, Y = 36, K = 1.06;
          const svg = api.svg(`
            <rect width="800" height="520" fill="#EAF4FB"/>
            <rect y="470" width="800" height="50" fill="#D6E4EE"/>
            <clipPath id="l3-in-clip"><rect id="l3-in-win" x="40" y="60" width="170" height="150" rx="14"/></clipPath>
            ${L3.person({ x: X, y: Y, s: K })}
            <g clip-path="url(#l3-in-clip)">
              <rect width="800" height="520" fill="#0E2A47"/>
              ${L3.person({ x: X, y: Y, s: K, skin: '#1F4A70', shirt: '#1F4A70', shorts: '#1F4A70', shoe: '#1F4A70', hair: '#1F4A70', face: false })}
              ${L3.skeleton({ x: X, y: Y, s: K, xray: true })}
            </g>
            <g id="l3-in-scan" transform="translate(40 60)">
              <rect width="170" height="150" rx="14" fill="none" stroke="#7E57C2" stroke-width="7"/>
              <rect x="40" y="-30" width="90" height="30" rx="10" fill="#7E57C2"/>
              ${S.text(85, -8, 'X-ray', { size: 18, fill: '#fff' })}
              <rect width="170" height="150" rx="14" fill="#fff" opacity="0"/>
              <text id="l3-in-hint" x="85" y="82" text-anchor="middle" font-size="20" font-weight="800" fill="#4A2D8A" class="blink-hint">👆 Drag me</text>
            </g>
            <g id="l3-in-tags"></g>
          `);
          const win = S.q(svg, '#l3-in-win'), scan = S.q(svg, '#l3-in-scan'), tags = S.q(svg, '#l3-in-tags');
          const parts = [
            { id: 'skull', y1: 0, y2: 130, say: 'That is the skull. It is the bone of your head.', tag: 'skull', tx: 560, ty: 70 },
            { id: 'ribs', y1: 130, y2: 245, say: 'Those are the ribs. They go round your chest.', tag: 'ribs', tx: 580, ty: 180 },
            { id: 'hips', y1: 245, y2: 340, say: 'These are your hip bones. Your legs join on here.', tag: 'hips', tx: 590, ty: 290 },
            { id: 'legs', y1: 340, y2: 520, say: 'Look at the long bones in your legs!', tag: 'leg bones', tx: 600, ty: 420 },
          ];
          const seen = new Set();
          api.draggable(svg, scan, {
            bounds: { x1: 0, y1: 30, x2: 630, y2: 370 },
            onStart: () => { api.sfx('pick'); const h = S.q(svg, '#l3-in-hint'); if (h) h.remove(); },
            onMove: p => {
              win.setAttribute('x', S.f1(p.x)); win.setAttribute('y', S.f1(p.y));
              const cx = p.x + 85, cy = p.y + 75;
              if (Math.abs(cx - X) > 110) return;
              const part = parts.find(q => cy >= q.y1 && cy < q.y2);
              if (part && !seen.has(part.id)) {
                seen.add(part.id);
                api.sfx('shutter');
                api.say(part.say);
                tags.insertAdjacentHTML('beforeend', `<g class="pop-in">${L3.pill(part.tx, part.ty, part.tag)}</g>`);
                if (seen.size === parts.length) {
                  api.star();
                  api.timeout(() => api.praise('You found the skeleton inside the body. It is made of lots of bones.'), 2600);
                }
              }
            },
            onDrop: () => { api.sfx('drop'); return true; },
          });
        },
      },

      // ---------- b) Joints let us move ----------
      {
        text: [
          'Our skeleton also helps us to move.',
          'Muscles are attached to the bones of our skeleton.',
          'Joints are places where bones meet. Joints allow our arms and legs to move in different directions.',
        ],
        ask: 'Click the glowing joints to make the skeleton move.',
        activity: true,
        scene(stage, api) {
          const X = 400, Y = 64, K = 1;
          const svg = api.svg(`
            <rect width="800" height="520" fill="#FFF8EC"/>
            <rect y="494" width="800" height="26" fill="#E9CFA6"/>
            <g id="l3-in2-sk"></g><g id="l3-in2-rings"></g>`);
          const skG = S.q(svg, '#l3-in2-sk'), ringG = S.q(svg, '#l3-in2-rings');
          const arms = { l: [0, 0], r: [0, 0] };
          // Local frame -> scene
          const P = (x, y) => ({ x: X + x * K, y: Y + y * K });
          const joints = [
            { id: 'ls', side: 'l', k: 0, name: 'shoulder', to: 85 },
            { id: 'rs', side: 'r', k: 0, name: 'shoulder', to: 85 },
            { id: 'le', side: 'l', k: 1, name: 'elbow', to: 75 },
            { id: 're', side: 'r', k: 1, name: 'elbow', to: 75 },
          ];
          const where = j => {
            const side = j.side === 'l' ? -1 : 1;
            if (j.k === 0) return P(side * 48, 88);
            const e = rot(side * 54, 166, side * 48, 88, -side * arms[j.side][0]);
            return P(e.x, e.y);
          };
          const draw = () => {
            skG.innerHTML = L3.skeleton({ x: X, y: Y, s: K, arms });
            ringG.innerHTML = joints.map(j => { const p = where(j); return `<circle class="target-ring hot" data-j="${j.id}" cx="${S.f1(p.x)}" cy="${S.f1(p.y)}" r="15"/>`; }).join('');
          };
          draw();
          const found = new Set();
          let busy = false;
          const bendTo = async (j, v) => {
            busy = true;
            const from = arms[j.side][j.k];
            await api.tween(600, k => { arms[j.side][j.k] = from + (v - from) * k; draw(); }, W.ease.out);
            busy = false;
          };
          ringG.addEventListener('click', async e => {
            const r = e.target.closest('[data-j]');
            if (!r || busy) return;
            const j = joints.find(q => q.id === r.dataset.j);
            api.sfx('swoosh');
            const cur = arms[j.side][j.k];
            await bendTo(j, cur > 10 ? 0 : j.to);
            if (!api.alive()) return;
            if (!found.has(j.id)) {
              found.add(j.id);
              api.say(j.k === 0 ? 'This is a shoulder joint. The arm moves up and down here.' : 'This is an elbow joint. The arm bends here.');
              if (found.size === joints.length) {
                api.star();
                api.timeout(() => api.praise('Joints let our arms move in different directions. Press Dance!'), 2800);
                danceBtn.disabled = false;
              }
            }
          });
          const danceBtn = api.button('💃 Dance', async () => {
            if (busy) return;
            busy = true;
            api.sfx('magic');
            await api.tween(3200, (k, raw) => {
              const t = raw * Math.PI * 4;
              arms.l = [50 + Math.sin(t) * 40, 45 + Math.sin(t * 2) * 35];
              arms.r = [50 - Math.sin(t) * 40, 45 - Math.sin(t * 2) * 35];
              draw();
            }, W.ease.linear);
            if (!api.alive()) return;
            arms.l = [0, 0]; arms.r = [0, 0]; draw();
            busy = false;
          }, { cls: 'primary', sound: null });
          danceBtn.disabled = true;
        },
      },

      // ---------- c) The skull: a fixed joint ----------
      {
        text: [
          'The picture shows the top of a human skull. The skull protects our brain from damage.',
          'Unlike other moveable joints in our arms and legs, this joint is fixed.',
        ],
        ask: 'Can you see where the bones of the skull meet? Click the wiggly lines.',
        activity: true,
        scene(stage, api) {
          const seams = [
            { id: 'a', d: squiggle(120, 250, 400, 196, 17, 15, 3) },
            { id: 'b', d: squiggle(400, 196, 690, 236, 17, 15, 5) },
            { id: 'c', d: squiggle(400, 196, 410, 505, 19, 15, 8) },
          ];
          const r = S.rng(4);
          let speckle = '';
          for (let i = 0; i < 90; i++) speckle += `<circle cx="${S.f1(80 + r() * 640)}" cy="${S.f1(40 + r() * 470)}" r="${S.f1(1 + r() * 3)}" fill="#8A5A20" opacity="${S.f1(.15 + r() * .25)}"/>`;
          const svg = api.svg(`
            <defs><radialGradient id="l3-in3-bone" cx=".5" cy=".35" r=".75">
              <stop offset="0" stop-color="#F6DDA8"/><stop offset=".6" stop-color="#E0AE63"/><stop offset="1" stop-color="#A8692A"/>
            </radialGradient>
            <clipPath id="l3-in3-clip"><ellipse cx="400" cy="300" rx="330" ry="270"/></clipPath></defs>
            <rect width="800" height="520" fill="#3A2412"/>
            <g id="l3-in3-skull">
              <ellipse cx="400" cy="300" rx="330" ry="270" fill="url(#l3-in3-bone)"/>
              <g clip-path="url(#l3-in3-clip)">${speckle}
                ${seams.map(s => `<path d="${s.d}" stroke="#6B3E14" stroke-width="5" fill="none" stroke-linejoin="round"/>`).join('')}
                <g id="l3-in3-lit"></g>
                ${seams.map(s => `<path class="hot" data-s="${s.id}" d="${s.d}" stroke="#fff" stroke-opacity="0" stroke-width="34" fill="none"/>`).join('')}
              </g>
            </g>
            <g transform="translate(20 20)"><rect width="250" height="44" rx="22" fill="#fff" opacity=".92"/>
              ${S.text(125, 29, '🔍 Joins found: ', { size: 19 }).replace('</text>', '<tspan id="l3-in3-n">0</tspan> of 3</text>')}</g>
            <g transform="translate(150 470)"><rect x="-80" y="-24" width="160" height="40" rx="20" fill="#fff" opacity=".85"/>
              ${S.text(0, 3, 'top of the head', { size: 18, fill: '#6B3E14' })}</g>
          `);
          const lit = S.q(svg, '#l3-in3-lit');
          const found = new Set();
          svg.addEventListener('click', e => {
            const p = e.target.closest('[data-s]');
            if (!p || found.has(p.dataset.s)) return;
            const s = seams.find(q => q.id === p.dataset.s);
            found.add(s.id);
            api.sfx('pop');
            lit.insertAdjacentHTML('beforeend', `<path d="${s.d}" stroke="#FF5252" stroke-width="7" fill="none" stroke-linejoin="round" class="fade-in"/>`);
            S.q(svg, '#l3-in3-n').textContent = found.size;
            if (found.size < 3) api.say('Yes! Two skull bones meet here.');
            else {
              api.star();
              api.praise('The skull bones meet at these wiggly lines. They fit together like a jigsaw.');
              shake.disabled = false;
            }
          });
          const shake = api.button('✋ Try to move the bones', async () => {
            api.sfx('thud');
            const g = S.q(svg, '#l3-in3-skull');
            await api.tween(700, (k, raw) => g.setAttribute('transform', `translate(${S.f1(Math.sin(raw * 40) * 4 * (1 - raw))} 0)`), W.ease.linear);
            if (!api.alive()) return;
            g.setAttribute('transform', '');
            api.say('The bones do not move apart. This joint is fixed.');
          }, { cls: 'primary', sound: null });
          shake.disabled = true;
        },
      },
    ],
  });
})();
