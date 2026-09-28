// Chapter 2: The human skeleton: support
(() => {
  const { bone, BONE } = L3;
  const HL = '#FFD54F', HL_EDGE = '#C79A00';

  function injectStyle() {
    if (document.getElementById('l3-sup-style')) return;
    document.head.insertAdjacentHTML('beforeend', `<style id="l3-sup-style">
      .l3-sup-lit .l3-sk-vert { fill: ${HL}; stroke: ${HL_EDGE}; }
      .l3-sup-lit .l3-sk-neckbone { fill: #CE93D8; stroke: #7B1FA2; }
      .l3-sup-femur-lit .l3-sk-femur line, .l3-sup-femur-lit .l3-sk-femur circle { fill: ${HL}; stroke: ${HL}; }
    </style>`);
  }

  // ---------- Giraffe skeleton, facing left ----------
  function giraffe() {
    const c = BONE;
    const lerp = (a, b, t) => a + (b - a) * t;
    let neck = '', back = '', tail = '', ribs = '';
    const n0 = { x: 205, y: 82 }, n1 = { x: 352, y: 284 };
    const neckPts = [];
    for (let i = 0; i < 7; i++) {
      const t0 = i / 7 + .01, t1 = (i + 1) / 7 - .01;
      const bend = t => Math.sin(t * Math.PI) * 14;
      const a = { x: lerp(n0.x, n1.x, t0) - bend(t0), y: lerp(n0.y, n1.y, t0) + bend(t0) * .5 };
      const b = { x: lerp(n0.x, n1.x, t1) - bend(t1), y: lerp(n0.y, n1.y, t1) + bend(t1) * .5 };
      neckPts.push({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
      neck += `<g class="l3-sup-v l3-sup-nv">${bone(a.x, a.y, b.x, b.y, 12, c)}</g>`;
    }
    for (let i = 0; i < 14; i++) {
      const t = i / 13, x = lerp(360, 590, t), y = lerp(284, 318, t) - Math.sin(t * Math.PI) * 10;
      const spine = i < 6 ? 34 - i * 4 : 10;
      back += `<g class="l3-sup-v"><path d="M${S.f1(x)} ${S.f1(y)} l${i < 6 ? -6 : 2} ${-spine}" stroke="${c.edge}" stroke-width="6" stroke-linecap="round"/>
        <path d="M${S.f1(x)} ${S.f1(y)} l${i < 6 ? -6 : 2} ${-spine}" stroke="${c.fill}" stroke-width="3.5" stroke-linecap="round"/>
        <rect x="${S.f1(x - 8)}" y="${S.f1(y - 6)}" width="16" height="12" rx="3" fill="${c.fill}" stroke="${c.edge}" stroke-width="1.5"/></g>`;
      if (i >= 1 && i <= 11) {
        const L = 70 + Math.sin((i - 1) / 10 * Math.PI) * 50;
        ribs += `<path d="M${S.f1(x)} ${S.f1(y + 4)} C${S.f1(x + 16)} ${S.f1(y + L * .3)} ${S.f1(x + 20)} ${S.f1(y + L * .8)} ${S.f1(x + 6)} ${S.f1(y + L)}" stroke="${c.edge}" stroke-width="6" fill="none" stroke-linecap="round"/>
          <path d="M${S.f1(x)} ${S.f1(y + 4)} C${S.f1(x + 16)} ${S.f1(y + L * .3)} ${S.f1(x + 20)} ${S.f1(y + L * .8)} ${S.f1(x + 6)} ${S.f1(y + L)}" stroke="${c.fill}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
      }
    }
    for (let i = 0; i < 11; i++) {
      const t = i / 10, x = 598 + Math.sin(t * 1.3) * 34, y = 322 + t * 112, r = 7 - i * .4;
      tail += `<g class="l3-sup-v"><ellipse cx="${S.f1(x)}" cy="${S.f1(y)}" rx="${S.f1(r)}" ry="${S.f1(r * 1.1)}" fill="${c.fill}" stroke="${c.edge}" stroke-width="1.5"/></g>`;
    }
    const leg = (dx, far) => {
      const cc = far ? { fill: '#E6DCC6', edge: '#A89878' } : c;
      return `<g>
        ${bone(362 + dx, 352, 350 + dx, 414, 12, cc)}${bone(350 + dx, 418, 356 + dx, 470, 10, cc)}${bone(356 + dx, 474, 352 + dx, 500, 8, cc)}
        <path d="M${342 + dx} 500 L${364 + dx} 500 L${362 + dx} 510 L${340 + dx} 510Z" fill="${cc.fill}" stroke="${cc.edge}" stroke-width="1.5"/>
        ${bone(572 + dx, 330, 590 + dx, 396, 13, cc)}${bone(590 + dx, 400, 566 + dx, 458, 10, cc)}${bone(566 + dx, 462, 572 + dx, 500, 8, cc)}
        <path d="M${562 + dx} 500 L${584 + dx} 500 L${582 + dx} 510 L${560 + dx} 510Z" fill="${cc.fill}" stroke="${cc.edge}" stroke-width="1.5"/>
      </g>`;
    };
    const skull = `<g>
      <path d="M200 68 L196 50 M214 70 L216 52" stroke="${c.edge}" stroke-width="7" stroke-linecap="round"/>
      <path d="M200 68 L196 50 M214 70 L216 52" stroke="${c.fill}" stroke-width="4" stroke-linecap="round"/>
      <path d="M212 78 C200 62 166 70 144 86 C126 98 112 112 110 124 C112 134 126 136 142 130 C164 122 196 110 216 98 C226 92 222 84 212 78Z" fill="${c.fill}" stroke="${c.edge}" stroke-width="2"/>
      <path d="M212 100 C186 118 150 132 116 136" stroke="${c.edge}" stroke-width="2.5" fill="none"/>
      <circle cx="186" cy="88" r="8" fill="${c.dark}"/><ellipse cx="124" cy="116" rx="5" ry="3" fill="${c.dark}"/>
    </g>`;
    return { neckPts, svg: `
      ${leg(22, true)}
      <path d="M352 292 L340 368 L388 352Z" fill="${c.fill}" stroke="${c.edge}" stroke-width="2" stroke-linejoin="round"/>
      <path d="M560 306 L608 320 L596 348 L566 344Z" fill="${c.fill}" stroke="${c.edge}" stroke-width="2" stroke-linejoin="round"/>
      <g id="l3-sup-ribs">${ribs}</g>
      ${leg(0, false)}
      <g id="l3-sup-back">${neck}${back}${tail}
        <path d="M205 82 Q300 210 356 284 L590 318 Q640 360 626 436" stroke="#fff" stroke-opacity="0" stroke-width="40" fill="none" class="hot" id="l3-sup-hit"/></g>
      <path d="M614 440 q-8 14 0 30 q8 -14 8 -30z" fill="#6D4C33"/>
      ${skull}` };
  }

  // ---------- Side view backbone for bending ----------
  // bend 0..1 leans the top forward (to the left)
  function spineColumn(bend) {
    const parts = [];
    for (let i = 0; i < 5; i++) parts.push({ w: 44, h: 16, kind: 'low', curve: -2.2 });
    for (let i = 0; i < 12; i++) parts.push({ w: 36, h: 12, kind: 'mid', curve: 1.6 });
    for (let i = 0; i < 7; i++) parts.push({ w: 26, h: 9, kind: 'neck', curve: -2 });
    let x = 600, y = 470, a = 4;
    let out = `<path d="M572 486 L628 486 L618 520 L582 520Z" fill="${BONE.fill}" stroke="${BONE.edge}" stroke-width="2"/>`;
    parts.forEach(p => {
      a += p.curve - bend * 2.8;
      const rad = a * Math.PI / 180, ux = Math.sin(rad), uy = -Math.cos(rad);
      x += ux * (p.h / 2 + 2); y += uy * (p.h / 2 + 2);
      const col = p.kind === 'neck' ? { fill: '#E1BEE7', edge: '#7B1FA2' } : { fill: HL, edge: HL_EDGE };
      out += `<g transform="translate(${S.f1(x)} ${S.f1(y)}) rotate(${S.f1(a)})">
        <path d="M${p.w * .3} 0 L${p.w * .3 + p.w * .7} ${p.h * .4}" stroke="${col.edge}" stroke-width="${p.h * .55 + 2}" stroke-linecap="round"/>
        <path d="M${p.w * .3} 0 L${p.w * .3 + p.w * .7} ${p.h * .4}" stroke="${col.fill}" stroke-width="${p.h * .55}" stroke-linecap="round"/>
        <rect x="${-p.w / 2}" y="${-p.h / 2}" width="${p.w}" height="${p.h}" rx="4" fill="${col.fill}" stroke="${col.edge}" stroke-width="2"/>
        <rect x="${-p.w / 2 + 3}" y="${p.h / 2}" width="${p.w - 6}" height="4" rx="2" fill="#90CAF9"/></g>`;
      x += ux * (p.h / 2 + 2); y += uy * (p.h / 2 + 2);
    });
    // Skull on top, facing left
    out += `<g transform="translate(${S.f1(x)} ${S.f1(y)}) rotate(${S.f1(a)})">
      <path d="M8 -4 C30 -10 34 -50 8 -64 C-20 -76 -52 -60 -54 -34 C-56 -22 -50 -14 -48 -8 L-40 2 C-30 4 -14 2 0 0Z" fill="${BONE.fill}" stroke="${BONE.edge}" stroke-width="2"/>
      <circle cx="-34" cy="-34" r="8" fill="${BONE.dark}"/></g>`;
    return { svg: out, top: { x, y } };
  }

  // Big hand skeleton, palm towards us (drawn in body.js)
  const FINGERS = L3.FINGERS;
  const handSvg = lit => L3.bigHand({ lit, newCls: 'l3-sup-wig' }).svg;

  App.chapter({
    id: 'support',
    title: 'The skeleton: support',
    icon: '🦒',
    group: 'The human skeleton',
    keywords: [
      { w: 'bones', d: 'The hard parts inside our body that make up our skeleton.' },
      { w: 'long', d: 'Having a big length from one end to the other.' },
      { w: 'backbone', d: 'The chain of small bones down the middle of your back.' },
      { w: 'skeleton', d: 'All the bones inside a body, joined together.' },
      { w: 'shorter', d: 'Not as long as something else.' },
      { w: 'blood cells', d: 'Tiny parts of our blood. Some of our bones make them.' },
      { w: 'vertebrae', d: 'The small bones that make up the backbone.' },
      { w: 'support', d: 'To hold something up and keep it in shape.' },
      { w: 'thumb', d: 'The short, thick finger at the side of your hand.' },
    ],
    steps: [
      // ---------- a) Giraffe ----------
      {
        text: [
          'All vertebrates have **bones** inside their bodies.',
          'These are the bones inside a giraffe. Each bone in a giraffe\'s neck is very **long**.',
        ],
        ask: 'Can you see its **backbone**? Click it.',
        activity: true,
        scene(stage, api) {
          const G = giraffe();
          const svg = api.svg(`
            <rect width="800" height="520" fill="#FFF6E0"/>
            <rect y="508" width="800" height="12" fill="#E9CFA6"/>
            <g class="float" style="animation-duration:5s">${S.cloud({ x: 680, y: 80, s: .9, color: '#FFFFFF' })}</g>
            ${G.svg}
            <g id="l3-sup-nums"></g>`);
          const verts = S.qa(svg, '.l3-sup-v');
          let found = false, counted = false;
          const light = async () => {
            api.sfx('magic');
            for (let i = 0; i < verts.length; i++) {
              S.qa(verts[i], 'circle, rect, ellipse, line').forEach(n => {
                if (n.getAttribute('fill') === BONE.fill) n.setAttribute('fill', HL);
                if (n.getAttribute('stroke') === BONE.fill) n.setAttribute('stroke', HL);
              });
              if (i % 3 === 0) api.sfx('tick');
              if (!(await api.wait(45))) return;
            }
          };
          S.q(svg, '#l3-sup-hit').addEventListener('click', async () => {
            if (found) return;
            found = true;
            await light();
            if (!api.alive()) return;
            api.star();
            api.praise('This is the backbone. It goes from the head, along the neck and back, to the tail.');
            countBtn.disabled = false;
          });
          S.q(svg, '#l3-sup-ribs').addEventListener('click', () => { if (!found) api.oops('Those are the ribs. Look for the chain of bones along the neck and back.'); });
          const countBtn = api.button('🔢 Count the neck bones', async () => {
            if (counted) return;
            counted = true;
            const nums = S.q(svg, '#l3-sup-nums');
            for (let i = 0; i < G.neckPts.length; i++) {
              const p = G.neckPts[i];
              nums.insertAdjacentHTML('beforeend', `<g class="pop-in"><circle cx="${S.f1(p.x - 30)}" cy="${S.f1(p.y + 14)}" r="15" fill="#7E57C2"/>${S.text(S.f1(p.x - 30), S.f1(p.y + 20), i + 1, { size: 17, fill: '#fff' })}</g>`);
              api.sfx('pop');
              if (!(await api.wait(380))) return;
            }
            api.say('A giraffe has seven neck bones. Each one is very long!');
          }, { cls: 'primary', sound: null });
          countBtn.disabled = true;
        },
      },

      // ---------- b) Our skeleton and vertebrae ----------
      {
        text: [
          'Humans are vertebrates. We call the bones inside our body our **skeleton**.',
          'Our neck bones are much **shorter** than a giraffe\'s.',
        ],
        ask: 'Can you see the small bones of the backbone called **vertebrae**? Slide to bend the backbone.',
        activity: true,
        scene(stage, api) {
          injectStyle();
          const svg = api.svg(`
            <rect width="800" height="520" fill="#F3EEFA"/>
            <g class="l3-sup-lit">${L3.skeleton({ x: 190, y: 40, s: 1.08 })}</g>
            <rect x="170" y="112" width="40" height="190" rx="10" fill="none" stroke="#7E57C2" stroke-width="3" stroke-dasharray="7 6"/>
            <path d="M212 200 L420 200" stroke="#7E57C2" stroke-width="3" stroke-dasharray="7 6"/>
            <g id="l3-sup2-col"></g>
            <g id="l3-sup2-tags"></g>`);
          const col = S.q(svg, '#l3-sup2-col'), tags = S.q(svg, '#l3-sup2-tags');
          const draw = b => {
            const s = spineColumn(b);
            col.innerHTML = s.svg;
            tags.innerHTML = `${L3.pill(700, 300, 'vertebrae', { stroke: HL_EDGE, color: '#7A5A00' })}
              <path d="M650 300 L${S.f1(612 - b * 30)} ${S.f1(330 + b * 10)}" stroke="${HL_EDGE}" stroke-width="2.5"/>
              ${L3.pill(710, 80, 'neck bones', { stroke: '#7B1FA2', color: '#6A1B9A' })}
              <path d="M650 90 L${S.f1(s.top.x + 8)} ${S.f1(s.top.y + 40)}" stroke="#7B1FA2" stroke-width="2.5"/>`;
          };
          let ready = false, lastZone = 0;
          api.slider({
            label: '🙇 Bend', min: 0, max: 1, step: .02, value: 0,
            format: v => v < .1 ? 'standing tall' : v < .9 ? 'bending…' : 'touch your toes!',
            onInput: v => {
              draw(v);
              const zone = v < .1 ? 0 : v < .9 ? 1 : 2;
              if (ready && zone !== lastZone) {
                if (zone === 2) {
                  api.sfx('success');
                  api.star();
                  api.say('The backbone is made of lots of small bones called vertebrae. Together they let your back bend.');
                } else if (zone === 1 && lastZone === 0) api.sfx('swoosh');
              }
              lastZone = zone;
            },
          });
          ready = true;
          api.row();
          api.label('<span style="color:#7B1FA2">■ neck bones: much shorter than a giraffe\'s</span>');
        },
      },

      // ---------- c) Bone facts ----------
      {
        text: [
          'Our smallest bones are inside our ears. The longest bone in our skeleton is in our leg.',
          '**Blood cells** are an important part of our blood. They are made inside some of our bones.',
          'The skeleton does not have ears or a nose. They are not made of bone so we can bend them easily.',
        ],
        ask: 'Click the glowing spots on the skeleton to find out more.',
        activity: true,
        scene(stage, api) {
          injectStyle();
          const X = 200, Y = 36, K = 1.08;
          const P = (x, y) => ({ x: X + x * K, y: Y + y * K });
          const spots = [
            { id: 'ear', at: P(-33, 36), label: 'smallest bones' },
            { id: 'nose', at: P(0, 40), label: 'no bone here' },
            { id: 'long', at: P(-28, 300), label: 'longest bone' },
            { id: 'blood', at: P(36, 240), label: 'blood cells' },
          ];
          const svg = api.svg(`
            <rect width="800" height="520" fill="#FFF8EC"/>
            <g id="l3-sup3-sk">${L3.skeleton({ x: X, y: Y, s: K })}</g>
            <rect x="400" y="24" width="376" height="472" rx="22" fill="#fff" stroke="#EADFCB" stroke-width="3"/>
            <g id="l3-sup3-panel">${S.text(588, 250, '👈 Click a glowing spot', { size: 22, fill: '#6E665A' })}</g>
            <g id="l3-sup3-spots">${spots.map(s => `<circle class="target-ring hot" data-s="${s.id}" cx="${S.f1(s.at.x)}" cy="${S.f1(s.at.y)}" r="15"/>`).join('')}</g>`);
          const panel = S.q(svg, '#l3-sup3-panel'), skG = S.q(svg, '#l3-sup3-sk');
          const title = t => S.text(588, 70, t, { size: 26, fill: '#4A2D8A' });
          const views = {
            ear: () => `${title('Tiny ear bones')}
              ${L3.lens('l3-sup3-lens', 588, 250, 130, `<rect x="440" y="100" width="300" height="300" fill="#FDF3E2"/>
                <g transform="translate(588 250) scale(2.4)">
                  <path d="M-34 -18 C-30 -30 -14 -30 -12 -18 C-10 -8 -18 -2 -20 10 L-24 26 L-28 26 L-26 8 C-30 0 -36 -8 -34 -18Z" fill="${BONE.fill}" stroke="${BONE.edge}" stroke-width="1.2"/>
                  <path d="M-8 -20 C2 -28 14 -22 12 -12 C10 -6 16 4 12 18 L8 18 C8 8 2 0 -4 -2 C-10 -4 -14 -14 -8 -20Z" fill="${BONE.fill}" stroke="${BONE.edge}" stroke-width="1.2"/>
                  <path d="M18 -6 L34 -14 L38 8 L22 12 Z M22 -2 L32 -6 L34 6 L24 8Z" fill="${BONE.fill}" stroke="${BONE.edge}" stroke-width="1.2" fill-rule="evenodd"/>
                </g>`, '#7E57C2')}
              ${S.text(588, 430, 'They are smaller than a grain of rice!', { size: 19 })}
              ${S.text(588, 460, 'They help us hear.', { size: 19, fill: '#6E665A' })}`,
            nose: () => `${title('Ears and nose')}
              <g transform="translate(588 250)">
                <ellipse rx="95" ry="110" fill="${L3.SKIN}"/>
                <g class="l3-sup-wig"><path d="M88 -30 C120 -40 124 20 90 26 Z" fill="${L3.SKIN}" stroke="#8D5A36" stroke-width="3"/></g>
                <g class="l3-sup-wig" style="animation-delay:.2s"><path d="M-90 0 C-118 6 -118 36 -88 40" fill="${L3.SKIN}" stroke="#8D5A36" stroke-width="3"/></g>
                <path d="M-30 -110 C-80 -120 -110 -60 -96 -30 C-40 -80 40 -80 96 -30 C110 -60 70 -126 -30 -110Z" fill="#2B1B10"/>
                <circle cx="-34" cy="-10" r="9" fill="#2B1B10"/><circle cx="34" cy="-10" r="9" fill="#2B1B10"/>
                <g class="l3-sup-wig" style="animation-delay:.1s"><path d="M0 -4 C-6 16 -18 30 -10 38 C-4 42 6 42 12 38" fill="none" stroke="#8D5A36" stroke-width="4" stroke-linecap="round"/></g>
                <path d="M-26 62 Q0 82 26 62" stroke="#6B2E14" stroke-width="5" fill="none" stroke-linecap="round"/>
              </g>
              ${S.text(588, 420, 'Ears and noses are not bone.', { size: 19 })}
              ${S.text(588, 450, 'We can bend them easily!', { size: 19, fill: '#6E665A' })}`,
            long: () => `${title('The longest bone')}
              ${bone(460, 230, 716, 250, 30, { fill: HL, edge: HL_EDGE })}
              <path d="M460 290 L716 290" stroke="#6E665A" stroke-width="3"/><path d="M460 280 L460 300 M716 280 L716 300" stroke="#6E665A" stroke-width="3"/>
              ${S.text(588, 322, 'about a quarter of your height', { size: 18, fill: '#6E665A' })}
              ${S.text(588, 420, 'This thigh bone is the longest', { size: 19 })}
              ${S.text(588, 450, 'bone in our skeleton.', { size: 19 })}`,
            blood: () => `${title('Blood cells')}
              <g transform="translate(588 230)">
                <rect x="-150" y="-60" width="300" height="120" rx="60" fill="${BONE.fill}" stroke="${BONE.edge}" stroke-width="3"/>
                <rect x="-120" y="-36" width="240" height="72" rx="36" fill="#C62828" opacity=".85"/>
                <g id="l3-sup3-cells"></g>
              </g>
              ${S.text(588, 350, 'inside a bone', { size: 18, fill: '#6E665A' })}
              ${S.text(588, 420, 'Some bones make new', { size: 19 })}
              ${S.text(588, 450, 'blood cells every day!', { size: 19 })}`,
          };
          const says = {
            ear: 'Our smallest bones are inside our ears. They are smaller than a grain of rice.',
            nose: 'The skeleton does not have ears or a nose. They are not made of bone, so we can bend them easily.',
            long: 'This is the longest bone in our skeleton. It is in the top of your leg.',
            blood: 'Blood cells are an important part of our blood. They are made inside some of our bones.',
          };
          const seen = new Set();
          let cells = [];
          api.loop(dt => {
            cells.forEach(c => {
              c.x += c.vx * dt; c.a += dt * 2;
              if (c.x > 110) c.x = -110;
              c.el.setAttribute('transform', `translate(${S.f1(c.x)} ${S.f1(c.y + Math.sin(c.a) * 6)}) rotate(${S.f1(c.a * 30)})`);
            });
          });
          S.q(svg, '#l3-sup3-spots').addEventListener('click', e => {
            const t = e.target.closest('[data-s]');
            if (!t) return;
            const id = t.dataset.s;
            api.sfx('pop');
            panel.innerHTML = `<g class="fade-in">${views[id]()}</g>`;
            skG.classList.toggle('l3-sup-femur-lit', id === 'long');
            cells = [];
            if (id === 'blood') {
              const host = S.q(svg, '#l3-sup3-cells');
              for (let i = 0; i < 9; i++) {
                const el = S.el('g', {}, host);
                el.innerHTML = `<ellipse rx="13" ry="10" fill="#EF5350" stroke="#8E1B1B" stroke-width="1.5"/><ellipse rx="6" ry="4" fill="#C62828"/>`;
                cells.push({ el, x: -110 + i * 26, y: (i % 3 - 1) * 16, vx: 18 + (i % 4) * 6, a: i });
              }
            }
            api.say(says[id]);
            if (!seen.has(id)) {
              seen.add(id);
              t.classList.remove('target-ring');
              t.setAttribute('fill', '#7E57C2'); t.setAttribute('r', 9);
              if (seen.size === spots.length) {
                api.star();
                api.timeout(() => api.praise('You found all the bone facts!'), 5200);
              }
            }
          });
          if (!document.getElementById('l3-sup-wig-style')) {
            document.head.insertAdjacentHTML('beforeend', `<style id="l3-sup-wig-style">
              .l3-sup-wig { animation: wiggle .6s ease-in-out 4; transform-box: fill-box; transform-origin: center; }</style>`);
          }
        },
      },

      // ---------- d) Support: a pile on the floor ----------
      {
        text: [
          'One function of a skeleton is **support**. It keeps our body shape.',
          'If we did not have a skeleton we would be in a pile on the floor!',
        ],
        ask: 'Take the skeleton away. What happens?',
        activity: true,
        scene(stage, api) {
          const svg = api.svg(`
            <rect width="800" height="520" fill="#EAF4FB"/>
            <rect y="486" width="800" height="34" fill="#D9C4A3"/>
            <g id="l3-sup4-body">
              ${L3.person({ x: 400, y: 58, s: 1, shirt: '#FF7043', shorts: '#5C6BC0' })}
              <g id="l3-sup4-x" opacity="0">${L3.skeleton({ x: 400, y: 58, s: 1, xray: false })}</g>
            </g>
            <g id="l3-sup4-pile" opacity="0" transform="translate(400 486)">
              <path d="M-220 0 C-240 -20 -200 -40 -140 -40 C-90 -44 -40 -34 20 -40 C40 -80 110 -86 130 -44 C190 -42 240 -24 222 0 Z" fill="${L3.SKIN}" stroke="#8D5A36" stroke-width="3"/>
              <path d="M-60 -38 C-40 -60 30 -60 50 -40 C30 -30 -30 -30 -60 -38Z" fill="#FF7043"/>
              <path d="M-200 -18 L-270 -34 M204 -16 L270 -30" stroke="${L3.SKIN}" stroke-width="16" stroke-linecap="round"/>
              <circle cx="72" cy="-56" r="12" fill="#fff" stroke="#333" stroke-width="2"/><circle cx="102" cy="-54" r="12" fill="#fff" stroke="#333" stroke-width="2"/>
              <circle cx="74" cy="-54" r="5" fill="#222"/><circle cx="104" cy="-52" r="5" fill="#222"/>
              <path d="M70 -34 Q88 -26 104 -34" stroke="#6B2E14" stroke-width="3" fill="none"/>
              <path d="M60 -76 q4 -12 12 -14 M90 -80 q2 -12 10 -12" stroke="#2B1B10" stroke-width="3" fill="none"/>
            </g>`);
          const body = S.q(svg, '#l3-sup4-body'), pile = S.q(svg, '#l3-sup4-pile'), xr = S.q(svg, '#l3-sup4-x');
          let flat = false, busy = false, starred = false;
          const go = async () => {
            if (busy) return;
            busy = true;
            if (!flat) {
              api.sfx('whoosh');
              xr.setAttribute('opacity', .9);
              await api.tween(700, k => xr.setAttribute('transform', `translate(${S.f1(k * 520)} 0)`), W.ease.inOut);
              if (!api.alive()) return;
              api.sfx('shrink');
              await api.tween(900, k => {
                body.setAttribute('transform', `translate(400 486) scale(${S.f1(1 + k * .8)} ${S.f1(1 - k * .9)}) translate(-400 -486)`);
                body.setAttribute('opacity', S.f1(1 - k));
                pile.setAttribute('opacity', S.f1(k));
                pile.setAttribute('transform', `translate(400 486) scale(${S.f1(.5 + k * .5)} ${S.f1(k)})`);
              }, W.ease.out);
              if (!api.alive()) return;
              api.sfx('thud');
              api.say('Splat! Without a skeleton we would be in a pile on the floor. The skeleton supports our body.');
              if (!starred) { starred = true; api.star(); }
              btn.innerHTML = '🦴 Put the skeleton back';
            } else {
              api.sfx('grow');
              await api.tween(900, k => {
                body.setAttribute('transform', `translate(400 486) scale(${S.f1(1.8 - k * .8)} ${S.f1(.1 + k * .9)}) translate(-400 -486)`);
                body.setAttribute('opacity', S.f1(k));
                pile.setAttribute('opacity', S.f1(1 - k));
              }, W.ease.back);
              if (!api.alive()) return;
              body.removeAttribute('transform');
              xr.setAttribute('transform', '');
              xr.setAttribute('opacity', 0);
              api.say('Our skeleton holds us up and keeps our body shape.');
              btn.innerHTML = '🫠 Take the skeleton away';
            }
            flat = !flat;
            busy = false;
          };
          const btn = api.button('🫠 Take the skeleton away', go, { cls: 'primary pulse', sound: null });
        },
      },

      // ---------- e) Hand bones ----------
      {
        text: ['Our hands are made of lots of bones.'],
        ask: ['Compare your own hands with this picture.', 'Can you work out where some of the bones are? Find the **thumb** first.'],
        activity: true,
        scene(stage, api) {
          injectStyle();
          if (!document.getElementById('l3-sup-wig-style')) {
            document.head.insertAdjacentHTML('beforeend', `<style id="l3-sup-wig-style">
              .l3-sup-wig { animation: wiggle .6s ease-in-out 4; transform-box: fill-box; transform-origin: center; }</style>`);
          }
          const svg = api.svg(`
            <rect width="800" height="520" fill="#FFF8EC"/>
            <rect x="200" y="14" width="400" height="506" rx="30" fill="#fff" stroke="#E7A07F" stroke-width="3"/>
            <g id="l3-sup5-hand" transform="translate(400 520) scale(1.15) translate(-400 -520)"></g>
            <g id="l3-sup5-tags"></g>
            <g transform="translate(110 70)"><circle r="46" fill="#7E57C2"/>${S.text(0, -4, '0', { size: 34, fill: '#fff' }).replace('>0<', ' id="l3-sup5-n">0<')}${S.text(0, 22, 'bones', { size: 16, fill: '#fff' })}</g>`);
          const handG = S.q(svg, '#l3-sup5-hand'), tags = S.q(svg, '#l3-sup5-tags');
          const lit = {};
          let bones = 0;
          const draw = () => { handG.innerHTML = handSvg(lit); };
          draw();
          handG.addEventListener('click', e => {
            const g = e.target.closest('[data-f]');
            if (!g) return;
            const f = FINGERS.find(q => q.id === g.dataset.f);
            if (lit[f.id]) { api.say(f.name); return; }
            if (f.id !== 'thumb' && !lit.thumb) { api.oops('Find the thumb first! It is the short, thick finger at the side of your hand.'); return; }
            Object.keys(lit).forEach(k => { lit[k] = true; });
            lit[f.id] = 'new';
            draw();
            api.sfx('pop');
            bones += f.lens.length;
            S.q(svg, '#l3-sup5-n').textContent = bones;
            // Finger tip, then scaled like the hand
            const tx = f.base[0] + Math.sin(f.dir * Math.PI / 180) * 210, ty = f.base[1] - Math.cos(f.dir * Math.PI / 180) * 210;
            const tip = { x: 400 + (tx - 400) * 1.15, y: 520 + (ty - 520) * 1.15 };
            const short = f.id === 'thumb' ? 'thumb' : f.name.replace(' finger', '');
            tags.insertAdjacentHTML('beforeend', `<g class="pop-in">${L3.pill(S.f1(Math.max(250, Math.min(550, tip.x))), S.f1(Math.max(40, tip.y - 24)), short, { size: 16 })}</g>`);
            const done = FINGERS.every(q => lit[q.id]);
            if (done) {
              bones = 27;
              api.timeout(() => { S.q(svg, '#l3-sup5-n').textContent = 27; api.sfx('fanfare'); }, 900);
              api.star();
              api.praise('With the wrist bones too, each hand has 27 bones!');
            } else if (f.id === 'thumb') api.say('Yes, that is the thumb! It has three bones, from the wrist to the tip. Now find the other fingers.');
            else api.say(`That is the ${f.name}. It has four bones, from the palm to the tip.`);
          });
        },
      },
    ],
  });
})();
