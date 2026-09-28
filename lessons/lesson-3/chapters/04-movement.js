// Chapter 4: The human skeleton: movement
(() => {
  function injectStyle() {
    if (document.getElementById('l3-mov-style')) return;
    document.head.insertAdjacentHTML('beforeend', `<style id="l3-mov-style">
      .l3-mov-sort { display:flex; flex-direction:column; gap:8px; height:100%; }
      .l3-mov-head { font-size:19px; text-align:center; background:#EDE7F6; border-radius:14px; padding:6px 12px; font-weight:700; }
      .l3-mov-game { flex:1; }
      .l3-mov-sort .sort-card { width:112px; }
    </style>`);
  }
  // Emoji picture for a sort card
  const card = e => `<svg viewBox="0 0 100 70"><text x="50" y="52" text-anchor="middle" font-size="46">${e}</text></svg>`;

  // One step of walking; t is the phase in radians
  const walkPose = t => ({
    hipF: 24 * Math.sin(t), kneeF: 6 + 50 * Math.max(0, Math.cos(t)) ** 2, footF: 10 * Math.max(0, Math.cos(t)),
    hipB: 24 * Math.sin(t + Math.PI), kneeB: 6 + 50 * Math.max(0, Math.cos(t + Math.PI)) ** 2, footB: 10 * Math.max(0, Math.cos(t + Math.PI)),
    shF: -20 * Math.sin(t), elF: 18, shB: 20 * Math.sin(t), elB: 18, lean: 2,
  });

  App.chapter({
    id: 'movement',
    title: 'The skeleton: movement',
    icon: '🚶',
    group: 'The human skeleton',
    keywords: [
      { w: 'move', d: 'To go from one place or position to another.' },
      { w: 'meet', d: 'To come together at the same place.' },
      { w: 'joint', d: 'A place where two or more bones meet.' },
      { w: 'shoulder', d: 'The joint where your arm joins your body.' },
      { w: 'elbow', d: 'The joint in the middle of your arm.' },
      { w: 'wrist', d: 'The joint between your arm and your hand.' },
      { w: 'hip', d: 'The joint where your leg joins your body.' },
      { w: 'knee', d: 'The joint in the middle of your leg.' },
      { w: 'ankle', d: 'The joint between your leg and your foot.' },
    ],
    steps: [
      // ---------- a) What bones do ----------
      {
        text: ['The bones of our skeleton:<ul><li>support our body and keep it in shape</li><li>protect softer organs from damage</li><li>make blood cells.</li></ul>'],
        ask: 'Sort the cards. Which are jobs that our bones do?',
        activity: true,
        scene(stage, api) {
          injectStyle();
          const wrap = api.html(`<div class="l3-mov-sort">
            <div class="l3-mov-head">🦴 Is it a job that our bones do?</div>
            <div class="l3-mov-game"></div></div>`);
          const yes = 'Yes! This is one of the jobs of our bones.';
          const no = 'Bones do not do this job. Think about support, protection, blood cells and moving.';
          api.sortGame(wrap.querySelector('.l3-mov-game'), {
            bins: [{ id: 'yes', title: '✅ Bones do this' }, { id: 'no', title: '❌ Bones do not do this' }],
            items: [
              { id: 'shape', bin: 'yes', svg: card('🧍'), label: 'keep our shape', hint: yes },
              { id: 'protect', bin: 'yes', svg: card('🛡️'), label: 'protect organs', hint: yes },
              { id: 'blood', bin: 'yes', svg: card('🩸'), label: 'make blood cells', hint: yes },
              { id: 'move', bin: 'yes', svg: card('🏃'), label: 'help us move', hint: yes },
              { id: 'see', bin: 'no', svg: card('👀'), label: 'help us see', hint: no },
              { id: 'taste', bin: 'no', svg: card('👅'), label: 'taste food', hint: no },
              { id: 'hair', bin: 'no', svg: card('💇'), label: 'grow our hair', hint: no },
              { id: 'sleep', bin: 'no', svg: card('😴'), label: 'make us sleepy', hint: no },
            ],
            onDone: () => {
              api.star();
              api.timeout(() => api.sayAfter('Our bones support us, protect our organs, make blood cells and help us move.'), 2200);
            },
          });
        },
      },

      // ---------- b) Walking ----------
      {
        text: [
          'The bones of our skeleton also help us to **move**. Look at how the bones move as we walk.',
          'Each bone stays the same shape because it is very hard.',
        ],
        ask: 'Press Walk and watch the bones.',
        activity: true,
        scene(stage, api) {
          const svg = api.svg(`
            <rect width="800" height="520" fill="#EAF4FB"/>
            <g class="float" style="animation-duration:6s">${S.cloud({ x: 130, y: 80, s: .8 })}${S.cloud({ x: 650, y: 60, s: .6 })}</g>
            <rect y="478" width="800" height="42" fill="#D9C4A3"/>
            <g id="l3-mov2-lines"></g>
            <g id="l3-mov2-body"></g>
            <g id="l3-mov2-glow"></g>
            <g transform="translate(20 20)"><rect width="260" height="44" rx="22" fill="#fff" opacity=".92"/>
              <circle cx="28" cy="22" r="10" fill="#FFB300" opacity=".8"/>${S.text(140, 29, 'joints bend here', { size: 19 })}</g>`);
          const body = S.q(svg, '#l3-mov2-body'), glow = S.q(svg, '#l3-mov2-glow'), lines = S.q(svg, '#l3-mov2-lines');
          let t = 0, walking = false, slow = false, walked = 0, starred = false, shift = 0;
          const draw = () => {
            const y = 262 + 6 * Math.abs(Math.sin(t));
            const b = L3.sideBody(walkPose(t), { x: 380, y, s: 1.1 });
            body.innerHTML = b.svg;
            const P = b.pts;
            glow.innerHTML = ['shoulder', 'elbowF', 'wristF', 'hip', 'kneeF', 'ankleF', 'kneeB', 'ankleB']
              .map(k => `<circle cx="${S.f1(P[k].x)}" cy="${S.f1(P[k].y)}" r="${k.endsWith('B') ? 8 : 11}" fill="#FFB300" opacity="${k.endsWith('B') ? .45 : .75}"/>`).join('');
            lines.innerHTML = [...Array(9)].map((_, i) => `<rect x="${S.f1(((i * 110 - shift) % 990 + 990) % 990 - 100)}" y="494" width="60" height="8" rx="4" fill="#BFA47E"/>`).join('');
          };
          draw();
          api.loop(dt => {
            if (!walking) return;
            const w = (slow ? .5 : 1.6) * Math.PI;
            t += dt * w;
            shift += dt * w * 152 * 1.1 / Math.PI;
            walked += dt;
            draw();
            if (walked > 3 && !starred) {
              starred = true;
              api.star();
              api.say('Look! The hard bones stay the same shape. They change position at the joints.');
            }
          });
          api.button('🚶 Walk', b => {
            walking = !walking;
            b.innerHTML = walking ? '⏸ Stop' : '🚶 Walk';
            api.sfx(walking ? 'swoosh' : 'drop');
          }, { cls: 'primary pulse', sound: null });
          api.button('🐢 Slow motion', b => { slow = !slow; b.classList.toggle('primary', slow); });
        },
      },

      // ---------- c) Name the joints ----------
      {
        text: [
          'Our legs and arms are each made of more than one bone. The bones **meet** at a **joint**.',
          'We have lots of joints in our body. Joints allow our bones to change position so we can move.',
        ],
        ask: 'Drag each joint name to a glowing joint.',
        activity: true,
        scene(stage, api) {
          const pose = { hipF: 50, kneeF: 70, footF: 10, hipB: -28, kneeB: 60, footB: -30, shF: -50, elF: 85, shB: 55, elB: 60, lean: 16 };
          const b = L3.sideBody(pose, { style: 'body', dark: '#1F1F33', x: 380, y: 262, s: 1.05 });
          const P = b.pts;
          const svg = api.svg(`
            <defs><radialGradient id="l3-mov3-glow"><stop offset="0" stop-color="#FFF59D"/><stop offset=".4" stop-color="#FFB300"/><stop offset="1" stop-color="#FF6F00" stop-opacity="0"/></radialGradient></defs>
            <rect width="800" height="520" fill="#FFF8EC"/>
            ${b.svg}
            ${['shoulder', 'elbowF', 'wristF', 'hip', 'kneeF', 'ankleF', 'kneeB', 'ankleB', 'elbowB', 'wristB']
              .map(k => `<circle cx="${S.f1(P[k].x)}" cy="${S.f1(P[k].y)}" r="20" fill="url(#l3-mov3-glow)"/>`).join('')}`);
          api.dragLabels(svg, [
            { id: 'shoulder', label: 'shoulder', x: P.shoulder.x, y: P.shoulder.y, lx: 620, ly: 70 },
            { id: 'elbow', label: 'elbow', x: P.elbowB.x, y: P.elbowB.y, lx: 690, ly: 190 },
            { id: 'wrist', label: 'wrist', x: P.wristF.x, y: P.wristF.y, lx: 110, ly: 150 },
            { id: 'hip', label: 'hip', x: P.hip.x, y: P.hip.y, lx: 110, ly: 250 },
            { id: 'knee', label: 'knee', x: P.kneeF.x, y: P.kneeF.y, lx: 690, ly: 300 },
            { id: 'ankle', label: 'ankle', x: P.ankleB.x, y: P.ankleB.y, lx: 110, ly: 420 },
          ], {
            radius: 70,
            onDone: () => {
              api.star();
              api.sayAfter('Shoulder, elbow, wrist, hip, knee and ankle. These joints help us run, jump and move.');
            },
          });
        },
      },

      // ---------- d) Joints in the hand ----------
      {
        text: ['This is what the bones of our wrist and hand look like.'],
        ask: ['Can you see any more joints? Click them.', 'Find these joints on your own fingers. Slide to see how they help your fingers move.'],
        activity: true,
        scene(stage, api) {
          const K = 1.3;
          const svg = api.svg(`
            <rect width="800" height="520" fill="#FFF8EC"/>
            <rect x="170" y="10" width="460" height="510" rx="26" fill="#0B1726"/>
            <g id="l3-mov4-hand" transform="translate(400 520) scale(${K}) translate(-400 -520)"></g>
            <g id="l3-mov4-dots"></g>
            <g transform="translate(20 20)"><rect width="140" height="84" rx="20" fill="#fff" stroke="#EADFCB" stroke-width="3"/>
              ${S.text(70, 34, 'Joints', { size: 19, fill: '#6E665A' })}${S.text(70, 70, '0', { size: 32, fill: '#4A2D8A' }).replace('>0<', ' id="l3-mov4-n">0<')}</g>
            <g transform="translate(700 470)"><rect x="-80" y="-24" width="160" height="40" rx="20" fill="#fff"/>${S.text(0, 3, 'X-ray', { size: 19, fill: '#1E63B8' })}</g>`);
          const handG = S.q(svg, '#l3-mov4-hand'), dots = S.q(svg, '#l3-mov4-dots');
          const found = new Set();
          let curl = 0, joints = [];
          const draw = () => {
            const h = L3.bigHand({ curl, xray: true });
            handG.innerHTML = h.svg;
            joints = h.joints.map(j => ({ ...j, x: 400 + (j.x - 400) * K, y: 520 + (j.y - 520) * K }));
            dots.innerHTML = joints.map(j => found.has(j.id)
              ? `<circle cx="${S.f1(j.x)}" cy="${S.f1(j.y)}" r="9" fill="#FF7043" stroke="#fff" stroke-width="2"/>`
              : `<circle class="hot" data-j="${j.id}" cx="${S.f1(j.x)}" cy="${S.f1(j.y)}" r="16" fill="#fff" opacity="0"/>`).join('');
          };
          draw();
          dots.addEventListener('click', e => {
            const d = e.target.closest('[data-j]');
            if (!d || found.has(d.dataset.j)) return;
            found.add(d.dataset.j);
            api.sfx('pop');
            draw();
            S.q(svg, '#l3-mov4-n').textContent = found.size;
            if (found.size === 1) api.say(d.dataset.j === 'wrist' ? 'Yes! The wrist is a joint.' : 'Yes! Two finger bones meet here. It is a joint.');
            if (found.size === 8) {
              api.star();
              api.praise('You found lots of joints! Each finger has joints so it can bend.');
            }
          });
          let ready = false, lastZone = 0;
          api.slider({
            label: '✊ Bend', min: 0, max: 1, step: .02, value: 0,
            format: v => v < .1 ? 'open hand' : v < .9 ? 'bending…' : 'fist',
            onInput: v => {
              curl = v; draw();
              const zone = v < .1 ? 0 : v < .9 ? 1 : 2;
              if (ready && zone !== lastZone && zone === 2) api.say('The fingers bend at the joints to make a fist.');
              lastZone = zone;
            },
          });
          ready = true;
        },
      },
    ],
  });
})();
